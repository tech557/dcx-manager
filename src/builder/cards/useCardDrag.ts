import { useEffect, useRef, useState } from 'react';
import type { ActionCardData } from '@/types/builder-node.types';
import type { CardKind } from '@/types/card.types';
import { useStageContext } from '@/builder/stage/StageProvider';
import type { CardData } from './useCardBehavior';
import { handleCardDrop } from './handleCardDrop';
import {
  getAutoExpandIds,
  getActiveCardDragPayload,
  beginCardDrag,
  getCardDragPayload,
  getPhaseDropDirection,
  isCardDropCompatible,
  isDragExcludedTarget,
  isInternalDragTransition,
  setActiveCardDragPayload,
} from './cardDrag.helpers';
import type { useCardBehavior } from './useCardBehavior';
interface UseCardDragOptions {
  kind: CardKind;
  data: CardData;
  locked: boolean;
  isSelected: boolean;
  isSelectionInvalid: boolean;
  behavior: ReturnType<typeof useCardBehavior>;
  onLongPress?: () => void;
}
export function useCardDrag({ kind, data, locked, isSelected, isSelectionInvalid, behavior, onLongPress }: UseCardDragOptions) {
  const stage = useStageContext();
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLifted, setIsLifted] = useState(false);
  const autoExpandedIdsRef = useRef<string[]>([]);
  const isDraggable = behavior.draggable && !isSelectionInvalid && !locked;

  const LONG_PRESS_MS = 400; // ✅ TA-001 (Long-press duration 400ms hold)
  const LONG_PRESS_MOVE_THRESHOLD = 8; // ✅ BLD-CRD-INT-003 / OD-003 (8px movement cancellation threshold)
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pointerStartPos = useRef<{ x: number; y: number } | null>(null);
  const longPressFiredRef = useRef(false);
  const dragStartedRef = useRef(false);

  // Long-press "lift": hold the card (not a child card / control) for LONG_PRESS_MS to enter a
  // grabbed state that primes a fast, smooth drag. A quick grab (native drag before the hold
  // completes) still works and just skips the lift.
  const liftCard = () => {
    longPressFiredRef.current = true;
    setIsLifted(true);
    onLongPress?.();
  };

  const startLongPress = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (isDragExcludedTarget(e.target)) return; // pressing a control is "using", not grabbing
    e.stopPropagation(); // innermost card wins — ancestors don't also arm ("except children")
    longPressFiredRef.current = false;
    dragStartedRef.current = false;
    pointerStartPos.current = { x: e.clientX, y: e.clientY };
    if (!isDraggable) return;
    longPressTimerRef.current = setTimeout(liftCard, LONG_PRESS_MS);
  };

  const cancelLongPress = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    pointerStartPos.current = null;
  };

  // Native drag clears the lift on dragend/drop; this fires only for a lift released without a drag.
  const releaseLift = () => {
    cancelLongPress();
    if (!dragStartedRef.current) setIsLifted(false);
  };

  useEffect(() => {
    if (!stage.isDragging) {
      // Reset transient hover state when a drag session ends.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsDragOver(false);
      autoExpandedIdsRef.current = [];
    }
  }, [stage.isDragging]);

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    cancelLongPress();
    if (!isDraggable) return event.preventDefault();
    dragStartedRef.current = true;
    setIsLifted(true);
    const ids = isSelected && stage.selectedNodeIds.length > 1 ? stage.selectedNodeIds : [data.id];
    beginCardDrag(event, { id: data.id, ids, kind, create: false }, 'move');
    stage.setDraggingState(true, kind, data.id);
    if (kind === 'task') event.dataTransfer.setData('application/x-dcx-task', data.id);
  };
  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    const payload = getActiveCardDragPayload();
    if (locked || !payload || payload.ids.includes(data.id)) return;
    const isCompatible = isCardDropCompatible(payload.kind, kind);
    const isTaskOverPhase = payload.kind === 'task' && kind === 'phase';
    if (!isCompatible && !isTaskOverPhase) return;
    if (isInternalDragTransition(event.currentTarget, event.relatedTarget)) return;
    event.preventDefault();
    event.stopPropagation();
    if (isCompatible && payload.kind !== 'phase') setIsDragOver(true);
    const parentId = kind === 'action' ? (data as ActionCardData).parentPhaseId : null;
    const toExpand = getAutoExpandIds(kind, data.id, parentId, stage.expandedNodeIds);
    if (toExpand.length) {
      autoExpandedIdsRef.current = toExpand;
      stage.setExpandedNodeIds((current) => Array.from(new Set([...current, ...toExpand])));
    }
  };
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    const payload = getActiveCardDragPayload();
    if (locked || !payload || payload.ids.includes(data.id)) return;
    const isCompatible = isCardDropCompatible(payload.kind, kind);
    const isTaskOverPhase = payload.kind === 'task' && kind === 'phase';
    if (!isCompatible && !isTaskOverPhase) return;
    event.preventDefault();
    event.stopPropagation();
  };
  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    if (!getActiveCardDragPayload()) return;
    if (isInternalDragTransition(event.currentTarget, event.relatedTarget)) return;
    event.stopPropagation();
    setIsDragOver(false);
    if (autoExpandedIdsRef.current.length) {
      const idsToCollapse = autoExpandedIdsRef.current;
      stage.setExpandedNodeIds((current) => current.filter((id) => !idsToCollapse.includes(id)));
      autoExpandedIdsRef.current = [];
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    const payload = getCardDragPayload(event.dataTransfer);
    if (!payload || payload.ids.includes(data.id)) return;
    const isCompatible = isCardDropCompatible(payload.kind, kind);
    if (!isCompatible) return;
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
    setIsLifted(false);
    dragStartedRef.current = false;
    autoExpandedIdsRef.current = [];
    stage.setDraggingState(false, null, null);
    setActiveCardDragPayload(null);
    handleCardDrop({
      event,
      nodes: stage.nodes,
      kind,
      data,
      actions: behavior.actions,
      locked,
      hoverDirection: getPhaseDropDirection(event, payload.kind, kind),
      setReceivingChildId: stage.setReceivingChildId,
      setExpandedNodeIds: stage.setExpandedNodeIds,
    });
  };

  const handleDragEnd = (event: React.DragEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setIsDragOver(false);
    setIsLifted(false);
    dragStartedRef.current = false;
    autoExpandedIdsRef.current = [];
    setActiveCardDragPayload(null);
    stage.setDraggingState(false, null, null);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (pointerStartPos.current) {
      const dx = e.clientX - pointerStartPos.current.x;
      const dy = e.clientY - pointerStartPos.current.y;
      if (Math.sqrt(dx * dx + dy * dy) > LONG_PRESS_MOVE_THRESHOLD) {
        cancelLongPress();
      }
    }
  };

  const consumeLongPressClick = () => {
    if (!longPressFiredRef.current) return false;
    longPressFiredRef.current = false;
    return true;
  };

  return {
    isDragOver,
    isDraggable,
    isLifted,
    consumeLongPressClick,
    dragHandlers: { onDragStart: handleDragStart, onDragEnter: handleDragEnter,
      onDragOver: handleDragOver, onDragLeave: handleDragLeave,
      onDrop: handleDrop, onDragEnd: handleDragEnd },
    pointerHandlers: {
      onPointerDown: startLongPress,
      onPointerUp: releaseLift,
      onPointerMove: handlePointerMove,
      onPointerCancel: releaseLift,
    },
  };
}

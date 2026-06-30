import { useState, useEffect, useRef } from 'react';
import { useStageContext } from '../StageProvider';
import { useBuilderActions } from '@/actions/useBuilderActions';
import { getCardDragPayload, setActiveCardDragPayload } from '@/builder/cards/cardDrag.helpers';

// Pixels from the left/right edge of #kanban-scroller that trigger auto-scroll.
const EDGE_SCROLL_ZONE = 120;
// Maximum scroll speed in px/frame.
const EDGE_SCROLL_MAX_SPEED = 18;

function scrollKanbanEdge(scroller: HTMLElement, pointerX: number): number {
  const rect = scroller.getBoundingClientRect();
  const distLeft = pointerX - rect.left;
  const distRight = rect.right - pointerX;
  if (distLeft < EDGE_SCROLL_ZONE && distLeft >= 0) {
    return -EDGE_SCROLL_MAX_SPEED * (1 - distLeft / EDGE_SCROLL_ZONE);
  }
  if (distRight < EDGE_SCROLL_ZONE && distRight >= 0) {
    return EDGE_SCROLL_MAX_SPEED * (1 - distRight / EDGE_SCROLL_ZONE);
  }
  return 0;
}

export function useKanbanInteraction(versionId: string) {
  const {
    isDragging,
    draggedNodeId,
    draggedNodeKind,
    setDraggingState
  } = useStageContext();
  const actions = useBuilderActions();

  const [isDragOver, setIsDragOver] = useState(false);
  const [hoveredPhaseId, setHoveredPhaseId] = useState<string | null>(null);
  const [hoverDirection, setHoverDirection] = useState<'left' | 'right' | null>(null);

  // Edge-scroll: track pointer X during a drag and scroll the kanban scroller.
  const edgeScrollRafRef = useRef<number | null>(null);
  const pointerXRef = useRef<number>(0);

  // Attach a document-level pointermove listener while dragging to track cursor X.
  useEffect(() => {
    if (!isDragging) {
      if (edgeScrollRafRef.current !== null) {
        cancelAnimationFrame(edgeScrollRafRef.current);
        edgeScrollRafRef.current = null;
      }
      return;
    }

    const onPointerMove = (e: PointerEvent) => {
      pointerXRef.current = e.clientX;
    };
    document.addEventListener('pointermove', onPointerMove);

    const loop = () => {
      const scroller = document.getElementById('kanban-scroller');
      if (scroller) {
        const delta = scrollKanbanEdge(scroller, pointerXRef.current);
        if (delta !== 0) scroller.scrollLeft += delta;
      }
      edgeScrollRafRef.current = requestAnimationFrame(loop);
    };
    edgeScrollRafRef.current = requestAnimationFrame(loop);

    return () => {
      document.removeEventListener('pointermove', onPointerMove);
      if (edgeScrollRafRef.current !== null) {
        cancelAnimationFrame(edgeScrollRafRef.current);
        edgeScrollRafRef.current = null;
      }
    };
  }, [isDragging]);

  useEffect(() => {
    if (!isDragging) {
      // Reset transient phase-hover state when a drag session ends.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHoveredPhaseId(null);
      setHoverDirection(null);
    }
  }, [isDragging]);

  const handleBoardDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    const isDcxCard = e.dataTransfer.types.includes('application/x-dcx-card');
    if (isDcxCard) {
      e.preventDefault();
      setIsDragOver(true);
    }
  };

  const handleBoardDragLeave = () => {
    setIsDragOver(false);
  };

  const handleBoardDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    setDraggingState(false, null, null);
    setActiveCardDragPayload(null);
    const payload = getCardDragPayload(e.dataTransfer);
    if (payload?.create && payload.kind === 'phase') {
      actions.createPhase({ versionId, label: 'New Phase' });
    }
  };

  const handlePhaseColumnDragOver = (e: React.DragEvent<HTMLElement>, phaseId: string) => {
    if (isDragging && draggedNodeKind === 'phase' && draggedNodeId !== phaseId) {
      e.preventDefault();
      e.stopPropagation();
      const rect = e.currentTarget.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const percentageX = relativeX / rect.width;
      const direction = percentageX > 0.5 ? 'right' : 'left';
      if (hoveredPhaseId !== phaseId || hoverDirection !== direction) {
        setHoveredPhaseId(phaseId);
        setHoverDirection(direction);
      }
    }
  };

  const handlePhaseColumnDragLeave = (e: React.DragEvent<HTMLElement>, phaseId: string) => {
    e.stopPropagation();
    const relatedTarget = e.relatedTarget as Node | null;
    if (relatedTarget && e.currentTarget.contains(relatedTarget)) {
      return;
    }
    if (hoveredPhaseId === phaseId) {
      setHoveredPhaseId(null);
      setHoverDirection(null);
    }
  };

  const getPhaseTranslationStyle = (phaseId: string): React.CSSProperties => {
    if (isDragging && draggedNodeKind === 'phase' && phaseId === draggedNodeId) {
      return { opacity: 0.4 };
    }
    return {};
  };

  return {
    isDragOver,
    hoveredPhaseId,
    hoverDirection,
    boardHandlers: {
      onDragOver: handleBoardDragOver,
      onDragLeave: handleBoardDragLeave,
      onDrop: handleBoardDrop,
    },
    getPhaseColumnHandlers: (phaseId: string) => ({
      onDragOver: (e: React.DragEvent<HTMLElement>) => handlePhaseColumnDragOver(e, phaseId),
      onDragLeave: (e: React.DragEvent<HTMLElement>) => handlePhaseColumnDragLeave(e, phaseId),
    }),
    getPhaseTranslationStyle,
  };
}

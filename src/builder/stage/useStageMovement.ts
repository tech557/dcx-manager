import { useRef, useState, type PointerEvent } from 'react';
import type { ViewKind } from '@/types/stage.types';

export type StageEdge = 'top' | 'right' | 'bottom' | 'left';

export interface StageMovementState {
  activeEdge: StageEdge | null;
  offstageNavigation: 'previous-date' | 'next-date' | null;
}

const EDGE_THRESHOLD = 36;
const SCROLL_STEP = 24;

export function getEdgeFromPoint(rect: DOMRect, x: number, y: number): StageEdge | null {
  if (x - rect.left < EDGE_THRESHOLD) {
    return 'left';
  }

  if (rect.right - x < EDGE_THRESHOLD) {
    return 'right';
  }

  if (y - rect.top < EDGE_THRESHOLD) {
    return 'top';
  }

  if (rect.bottom - y < EDGE_THRESHOLD) {
    return 'bottom';
  }

  return null;
}

export function getTimelineOffstageNavigation(view: ViewKind, edge: StageEdge | null): StageMovementState['offstageNavigation'] {
  if (view !== 'timeline' && view !== 'weekly' && view !== 'monthly') {
    return null;
  }

  if (edge === 'left') {
    return 'previous-date';
  }

  if (edge === 'right') {
    return 'next-date';
  }

  return null;
}

export function useStageMovement(view: ViewKind = 'kanban') {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [movementState, setMovementState] = useState<StageMovementState>({
    activeEdge: null,
    offstageNavigation: null,
  });

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const rect = stageRef.current?.getBoundingClientRect();

    if (!rect || !stageRef.current) {
      return;
    }

    const activeEdge = getEdgeFromPoint(rect, event.clientX, event.clientY);
    const offstageNavigation = getTimelineOffstageNavigation(view, activeEdge);

    if (activeEdge === 'left') {
      stageRef.current.scrollLeft -= SCROLL_STEP;
    }

    if (activeEdge === 'right') {
      stageRef.current.scrollLeft += SCROLL_STEP;
    }

    setMovementState({ activeEdge, offstageNavigation });
  }

  function handlePointerLeave() {
    setMovementState({ activeEdge: null, offstageNavigation: null });
  }

  return {
    stageRef,
    movementState,
    handlePointerMove,
    handlePointerLeave,
  };
}

import { useCallback, useEffect, useState } from 'react';
import type { CardKind } from '@/types/card.types';

export function useDragState() {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedNodeKind, setDraggedNodeKind] = useState<CardKind | null>(null);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);

  const setDraggingState = useCallback(
    (dragging: boolean, kind: CardKind | null, id: string | null) => {
      setIsDragging(dragging);
      setDraggedNodeKind(kind);
      setDraggedNodeId(id);
    },
    [],
  );

  useEffect(() => {
    const clearDraggingState = () => setDraggingState(false, null, null);
    window.addEventListener('dragend', clearDraggingState);
    window.addEventListener('drop', clearDraggingState);
    return () => {
      window.removeEventListener('dragend', clearDraggingState);
      window.removeEventListener('drop', clearDraggingState);
    };
  }, [setDraggingState]);

  return {
    isDragging,
    draggedNodeKind,
    draggedNodeId,
    setDraggingState,
  };
}

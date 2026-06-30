import * as React from 'react';
import { useState, useEffect } from 'react';
import { useStageContext } from '@/builder/stage/StageProvider';
import { useBuilderActions } from '@/actions/useBuilderActions';
import { adjustDropIndex } from '@/builder/cards/dragDropHelpers';
import { getCardDragPayload, setActiveCardDragPayload } from '@/builder/cards/cardDrag.helpers';

interface TaskDropZoneProps {
  index: number;
  actionId: string;
  isSmall?: boolean;
}

export function TaskDropZone({ index, actionId, isSmall = false }: TaskDropZoneProps) {
  const { isDragging, draggedNodeKind, nodes, setDraggingState } = useStageContext();
  const actions = useBuilderActions();
  const [isOver, setIsOver] = useState(false);

  const isActive = isDragging && draggedNodeKind === 'task';

  useEffect(() => {
    if (!isDragging) {
      // Reset transient drop hover state when dragging stops.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsOver(false);
    }
  }, [isDragging]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (!isActive) return;
    const isDcxCard = e.dataTransfer.types.includes('application/x-dcx-card');
    if (isDcxCard) {
      e.preventDefault();
      setIsOver(true);
    }
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    setIsOver(false);
    e.preventDefault();
    e.stopPropagation();
    setDraggingState(false, null, null);
    setActiveCardDragPayload(null);

    const payload = getCardDragPayload(e.dataTransfer);
    if (!payload || payload.kind !== 'task') return;
    const action = nodes
      .filter((node) => node.kind === 'phase')
      .flatMap((node) => node.data.actionCards)
      .find((item) => item.id === actionId);
    const toIndex = action
      ? adjustDropIndex(index, payload.ids, action.tasks.map((task) => task.id))
      : index;
    actions.moveTasks({ taskIds: payload.ids, toActionId: actionId, toIndex });
  };

  if (!isActive) {
    return null;
  }

  const baseClasses = 'transition-all duration-300 relative flex items-center justify-center select-none shrink-0';
  let layoutClasses = '';

  if (isSmall) {
    if (isOver) {
      layoutClasses = 'h-[60px] w-14 border-2 border-dashed border-[var(--theme-accent)]/60 bg-[var(--theme-accent)]/5 opacity-100 mx-1 rounded-xl';
    } else {
      layoutClasses = 'h-[60px] w-1.5 hover:w-3 opacity-0 hover:opacity-100 hover:border hover:border-dashed hover:border-[var(--theme-accent)]/30 hover:mx-1 rounded-md cursor-pointer bg-[var(--theme-accent)]/5';
    }
  } else {
    if (isOver) {
      layoutClasses = 'w-full h-[60px] border-2 border-dashed border-[var(--theme-accent)]/60 bg-[var(--theme-accent)]/5 opacity-100 my-1 rounded-xl';
    } else {
      layoutClasses = 'w-full h-1.5 hover:h-3 opacity-0 hover:opacity-100 hover:border hover:border-dashed hover:border-[var(--theme-accent)]/30 hover:my-1 cursor-pointer bg-[var(--theme-accent)]/5';
    }
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={[baseClasses, layoutClasses].join(' ')}
      id={`task-drop-zone-${actionId}-${index}`}
    >
      {isOver && (
        <div className="text-dcx-4xs font-black uppercase tracking-widest text-center text-[var(--theme-accent)] scale-102 leading-none pointer-events-none">
          {isSmall ? '↓' : '↓ Drop Task Here ↓'}
        </div>
      )}
    </div>
  );
}

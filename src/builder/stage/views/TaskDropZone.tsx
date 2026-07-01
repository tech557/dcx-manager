import * as React from 'react';
import { useState, useEffect } from 'react';
import { ArrowDownToLine } from 'lucide-react';
import { useStageContext } from '@/builder/stage/StageProvider';
import { useBuilderActions } from '@/actions/useBuilderActions';
import { useReducedMotion } from '@/hooks/useReducedMotion';
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
  const reducedMotion = useReducedMotion();
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

  const baseClasses = [
    'relative flex items-center justify-center select-none shrink-0 overflow-hidden',
    reducedMotion ? 'transition-none' : 'transition-[width,height,margin,opacity] duration-300 ease-out',
  ].join(' ');
  const overSurface = 'border-[1.5px] border-dashed border-[var(--theme-accent)]/60 bg-[var(--theme-accent)]/[0.07] shadow-[inset_0_0_16px_var(--theme-accent-medium)]';
  const idleSurface = 'border-[1.5px] border-dashed border-transparent hover:border-[var(--theme-accent)]/25 bg-[var(--theme-accent)]/5';
  let layoutClasses = '';

  if (isSmall) {
    layoutClasses = isOver
      ? `h-[60px] w-14 opacity-100 mx-1 rounded-xl ${overSurface}`
      : `h-[60px] w-1.5 hover:w-3 opacity-0 hover:opacity-100 hover:mx-1 rounded-md cursor-pointer ${idleSurface}`;
  } else {
    layoutClasses = isOver
      ? `w-full h-[60px] opacity-100 my-1 rounded-xl ${overSurface}`
      : `w-full h-1.5 hover:h-3 opacity-0 hover:opacity-100 hover:my-1 rounded-md cursor-pointer ${idleSurface}`;
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
        <div className="flex items-center gap-1 text-dcx-4xs font-black uppercase tracking-widest text-center text-[var(--theme-accent)] leading-none pointer-events-none">
          <ArrowDownToLine className="w-3 h-3" />
          {!isSmall && <span>Drop task here</span>}
        </div>
      )}
    </div>
  );
}

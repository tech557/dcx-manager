import * as React from 'react';
import { useState, useEffect } from 'react';
import { useStageContext } from '@/builder/stage/StageProvider';
import { useBuilderActions } from '@/actions/useBuilderActions';
import { adjustDropIndex } from '@/builder/cards/dragDropHelpers';
import { getCardDragPayload, setActiveCardDragPayload } from '@/builder/cards/cardDrag.helpers';

interface ActionDropZoneProps {
  index: number;
  phaseId: string;
}

export function ActionDropZone({ index, phaseId }: ActionDropZoneProps) {
  const { isDragging, draggedNodeKind, nodes, setDraggingState } = useStageContext();
  const actions = useBuilderActions();
  const [isOver, setIsOver] = useState(false);

  const isActive = isDragging && draggedNodeKind === 'action';

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
    if (!payload || payload.kind !== 'action') return;
    const phase = nodes.find((node) => node.id === phaseId);
    const toIndex = phase?.kind === 'phase'
      ? adjustDropIndex(index, payload.ids, phase.data.actionCards.map((action) => action.id))
      : index;
    actions.moveActions({ actionIds: payload.ids, toPhaseId: phaseId, toIndex });
  };

  if (!isActive) {
    return null;
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={[
        'transition-all duration-300 relative rounded-2xl flex items-center justify-center shrink-0 w-full',
        isOver
          ? 'h-16 border-2 border-dashed border-[var(--theme-accent)]/70 bg-[var(--theme-accent)]/10 opacity-100 my-1.5'
          : 'h-2 hover:h-4 opacity-0 hover:opacity-100 hover:border hover:border-dashed hover:border-[var(--theme-accent)]/30 hover:my-1 cursor-pointer bg-[var(--theme-accent)]/5',
      ].join(' ')}
      id={`action-drop-zone-${phaseId}-${index}`}
    >
      <div
        className={[
          'text-dcx-3xs font-black uppercase tracking-widest text-center transition-all leading-none pointer-events-none',
          isOver ? 'text-[var(--theme-accent)] scale-105' : 'text-neutral-500 opacity-60 hover:opacity-100',
        ].join(' ')}
      >
        {isOver ? '↓ Drop Action Here ↓' : '+ Insert Action Here'}
      </div>
    </div>
  );
}

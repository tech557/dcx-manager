import * as React from 'react';
import { useState, useEffect } from 'react';
import { CornerDownRight } from 'lucide-react';
import { useStageContext } from '@/builder/stage/StageProvider';
import { useBuilderActions } from '@/actions/useBuilderActions';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { adjustDropIndex } from '@/builder/cards/dragDropHelpers';
import { getCardDragPayload, setActiveCardDragPayload } from '@/builder/cards/cardDrag.helpers';

interface ActionDropZoneProps {
  index: number;
  phaseId: string;
}

export function ActionDropZone({ index, phaseId }: ActionDropZoneProps) {
  const { isDragging, draggedNodeKind, nodes, setDraggingState } = useStageContext();
  const actions = useBuilderActions();
  const reducedMotion = useReducedMotion();
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
        'relative rounded-xl flex items-center justify-center shrink-0 w-full overflow-hidden',
        reducedMotion ? 'transition-none' : 'transition-[height,margin,opacity] duration-300 ease-out',
        isOver
          ? 'h-14 my-1.5 opacity-100 border-[1.5px] border-dashed border-[var(--theme-accent)]/65 bg-[var(--theme-accent)]/[0.08] shadow-[inset_0_0_18px_var(--theme-accent-medium)]'
          : 'h-2 hover:h-4 opacity-0 hover:opacity-100 hover:my-1 cursor-pointer border-[1.5px] border-dashed border-transparent hover:border-[var(--theme-accent)]/25 bg-[var(--theme-accent)]/5',
      ].join(' ')}
      id={`action-drop-zone-${phaseId}-${index}`}
    >
      <div
        className={[
          'flex items-center gap-1.5 text-dcx-3xs font-black uppercase tracking-widest text-center leading-none pointer-events-none',
          reducedMotion ? '' : 'transition-all duration-300 ease-out',
          isOver ? 'text-[var(--theme-accent)] opacity-100' : 'text-neutral-500 opacity-0',
        ].join(' ')}
      >
        <CornerDownRight className="w-3.5 h-3.5" />
        <span>Drop action here</span>
      </div>
    </div>
  );
}

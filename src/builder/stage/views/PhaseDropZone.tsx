import * as React from 'react';
import { useState, useEffect } from 'react';
import { Layers } from 'lucide-react';
import { useStageContext } from '@/builder/stage/StageProvider';
import { useBuilderActions } from '@/actions/useBuilderActions';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { getCardDragPayload, setActiveCardDragPayload } from '@/builder/cards/cardDrag.helpers';

interface PhaseDropZoneProps {
  index: number;
  hoveredPhaseId?: string | null;
  hoverDirection?: 'left' | 'right' | null;
}

export function PhaseDropZone({ index, hoveredPhaseId = null, hoverDirection = null }: PhaseDropZoneProps) {
  const { isDragging, draggedNodeKind, nodes, setDraggingState } = useStageContext();
  const actions = useBuilderActions();
  const reducedMotion = useReducedMotion();
  const [isOver, setIsOver] = useState(false);

  const isActive = isDragging && draggedNodeKind === 'phase';

  // Compute if adjacent phase is hovered in our direction
  const phaseNodes = React.useMemo(() => nodes.filter(n => n.kind === 'phase'), [nodes]);
  const isAdjacentHovered = React.useMemo(() => {
    if (!isActive || !hoveredPhaseId || !hoverDirection) return false;
    
    const hoveredIdx = phaseNodes.findIndex(n => n.id === hoveredPhaseId);
    if (hoveredIdx === -1) return false;
    
    if (hoverDirection === 'left' && index === hoveredIdx) return true;
    if (hoverDirection === 'right' && index === hoveredIdx + 1) return true;
    
    return false;
  }, [isActive, hoveredPhaseId, hoverDirection, phaseNodes, index]);

  const isExpandedState = isOver || isAdjacentHovered;

  // Ensure hover state is reset when dragging stops
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
    if (!payload || payload.kind !== 'phase') return;
    actions.movePhases({ ids: payload.ids, toIndex: index });
  };

  if (!isActive) {
    return <div className="w-0 opacity-0 pointer-events-none transition-all duration-300" />;
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={[
        'group/dz h-full min-h-[400px] rounded-[1.75rem] flex items-center justify-center shrink-0 relative overflow-hidden',
        reducedMotion ? 'transition-none' : 'transition-[width,margin,opacity] duration-300 ease-out',
        isExpandedState
          ? 'w-[272px] mx-3 opacity-100 border-[1.5px] border-dashed border-[var(--theme-accent)]/70 bg-[var(--theme-accent)]/[0.07] shadow-[inset_0_0_28px_var(--theme-accent-medium),0_10px_32px_-14px_var(--theme-selected-glow)]'
          : 'w-4 hover:w-6 mx-1 opacity-40 hover:opacity-100 cursor-pointer border-[1.5px] border-dashed border-transparent hover:border-[var(--theme-accent)]/25 hover:bg-[var(--theme-accent)]/5',
      ].join(' ')}
      id={`phase-drop-zone-${index}`}
    >
      {/* Soft top-down accent wash that reads the zone as a live target. */}
      <div
        className={[
          'pointer-events-none absolute inset-0 bg-gradient-to-b from-[var(--theme-accent)]/10 to-transparent',
          reducedMotion ? '' : 'transition-opacity duration-300',
          isExpandedState ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
      />
      <div
        className={[
          'relative select-none flex flex-col items-center justify-center text-center leading-normal gap-1.5 px-4 pointer-events-none',
          reducedMotion ? '' : 'transition-all duration-300 ease-out',
          isExpandedState
            ? 'opacity-100 translate-y-0 text-[var(--theme-accent)]'
            : 'opacity-0 translate-y-1 text-neutral-500',
        ].join(' ')}
      >
        <span className="flex items-center justify-center w-10 h-10 rounded-2xl bg-[var(--theme-accent)]/12 border border-[var(--theme-accent)]/25 shadow-[0_0_18px_var(--theme-accent-medium)]">
          <Layers className={`w-5 h-5 ${reducedMotion ? '' : 'animate-pulse'}`} />
        </span>
        <span className="text-dcx-xs uppercase font-black tracking-widest text-[var(--theme-accent)]">Insert Phase</span>
        <span className="text-dcx-3xs uppercase font-bold opacity-60 tracking-wider">Drop to place here</span>
      </div>
    </div>
  );
}

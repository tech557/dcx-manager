import * as React from 'react';
import { useState, useEffect } from 'react';
import { Layers } from 'lucide-react';
import { useStageContext } from '@/builder/stage/StageProvider';
import { useBuilderActions } from '@/actions/useBuilderActions';
import { getCardDragPayload, setActiveCardDragPayload } from '@/builder/cards/cardDrag.helpers';

interface PhaseDropZoneProps {
  index: number;
  hoveredPhaseId?: string | null;
  hoverDirection?: 'left' | 'right' | null;
}

export function PhaseDropZone({ index, hoveredPhaseId = null, hoverDirection = null }: PhaseDropZoneProps) {
  const { isDragging, draggedNodeKind, nodes, setDraggingState } = useStageContext();
  const actions = useBuilderActions();
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
        'h-full min-h-[400px] transition-all duration-300 rounded-[2rem] flex items-center justify-center shrink-0 relative',
        isExpandedState
          ? 'w-[280px] border-2 border-dashed border-[var(--theme-accent)]/80 bg-[var(--theme-accent)]/10 mx-3 scale-[0.99] shadow-[0_0_20px_var(--theme-selected-glow)] opacity-100'
          : 'w-4 hover:w-6 hover:bg-[var(--theme-accent)]/5 bg-transparent mx-1 opacity-40 hover:opacity-100 cursor-pointer',
      ].join(' ')}
      id={`phase-drop-zone-${index}`}
    >
      <div
        className={[
          'transition-all duration-300 select-none flex flex-col items-center justify-center text-center leading-normal gap-1.5 p-4 pointer-events-none',
          isExpandedState ? 'opacity-100 scale-100 text-[var(--theme-accent)]' : 'opacity-0 scale-95 text-neutral-500',
        ].join(' ')}
      >
        <Layers className="w-6 h-6 animate-pulse" />
        <span className="text-dcx-xs uppercase font-black tracking-widest text-[var(--theme-accent)]">Insert Phase</span>
        <span className="text-dcx-3xs uppercase font-bold opacity-60 tracking-wider">Drop to Place here</span>
      </div>
    </div>
  );
}

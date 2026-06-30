import { CardShell } from '../../CardShell';
import { PhaseReadinessBadge } from './PhaseReadinessBadge';
import type { PhaseNodeData } from '@/types/builder-node.types';
import { ActionCard } from '../action/ActionCard';
import { ActionDropZone } from '@/builder/stage/views/ActionDropZone';
import { ReadinessCheckModal } from '@/builder/ui/modals/readiness-check-modal/ReadinessCheckModal';
import { Eye, EyeOff } from 'lucide-react';
import * as React from 'react';
import { usePhaseCard } from './usePhaseCard';
import { useScrollEdge } from '@/hooks/useScrollEdge';
import { readinessAriaLabel, readinessTooltip } from './readiness-label';

interface PhaseCardProps {
  phase: PhaseNodeData;
  selected?: boolean;
  locked?: boolean;
  onSelect?: (id: string, isMulti: boolean) => void;
}

export function PhaseCard({ phase, selected = false, locked = false, onSelect }: PhaseCardProps) {
  const {
    behavior,
    isExpanded,
    isReadinessModalOpen,
    setIsReadinessModalOpen,
    editedLabel,
    setEditedLabel,
    displayNum,
    actionIds,
    allActionsExpanded,
    handleLabelSubmit,
    handleFocusToggle,
    handleSelect,
    selectedNodeIds,
  } = usePhaseCard({ phase, selected, locked, onSelect });

  const { ref: actionScrollRef, startFade: actionTopFade, endFade: actionBottomFade } = useScrollEdge('vertical');

  // Collapsed visual layout matching the mockup
  if (!isExpanded) {
    return (
      <>
        <div className="h-full flex flex-col justify-center">
          <div className="h-[var(--dim-card-height-pct)] min-h-0">
        <CardShell
          kind="phase"
          data={phase}
          selected={selected}
          locked={locked}
          onSelect={onSelect}
          className="w-full h-full max-h-full min-h-0 flex flex-col items-center justify-between pb-6 pt-5 relative group/card overflow-hidden"
        >
          {/* Top: Sequential identifier & active indicator */}
          <div className="flex flex-col items-center gap-2.5 shrink-0 select-none">
            <div className="w-6 h-6 rounded-md bg-white/10 dark:bg-white/[0.04] border border-white/10 flex items-center justify-center font-mono text-dcx-xs font-bold text-white shadow-sm">
              {displayNum}
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--theme-accent)] opacity-90 shadow-[0_0_8px_var(--theme-accent)] animate-pulse" />
          </div>

          {/* Middle: Rotated Vertical Text & Compact Action Slots */}
          <div className="flex-1 flex flex-col items-center justify-center py-4 overflow-hidden min-h-0 select-none gap-4">
            <span 
              className="text-dcx-md-plus font-black tracking-widest uppercase text-white/90 font-sans whitespace-nowrap block"
              style={{
                writingMode: 'vertical-rl',
                transform: 'rotate(180deg)',
              }}
            >
              {phase.label}
            </span>

            {phase.actionCards.length > 0 && (
              <div className="flex flex-col gap-1.5 shrink-0 select-none items-center mt-2.5">
                {phase.actionCards.slice(0, 3).map((ac) => (
                  <div 
                    key={ac.id}
                    className="w-4 h-4 rounded bg-white/[0.08] dark:bg-white/[0.04] border border-white/10 hover:border-[var(--theme-accent)]/50 transition-all flex items-center justify-center text-dcx-4xs font-mono font-bold text-neutral-400 hover:text-white"
                    title={ac.name}
                  >
                    {ac.name.substring(0, 1).toUpperCase()}
                  </div>
                ))}
                {phase.actionCards.length > 3 && (
                  <span className="text-dcx-4xs font-black text-[var(--theme-accent)] tracking-tight shrink-0 select-none font-mono">
                    +{phase.actionCards.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Bottom: readiness badge */}
          <div className="flex flex-col items-center shrink-0 select-none">
            <button
              type="button"
              data-testid="phase-readiness-collapsed"
              onClick={(e) => {
                e.stopPropagation();
                setIsReadinessModalOpen(true);
              }}
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-accent)] rounded cursor-pointer flex items-center hover:scale-105 active:scale-95 transition-transform"
              title={readinessTooltip(behavior.readiness.state)}
              aria-label={readinessAriaLabel(behavior.readiness.state)}
            >
              <PhaseReadinessBadge state={behavior.readiness.state} />
            </button>
          </div>
        </CardShell>

        <ReadinessCheckModal
          isOpen={isReadinessModalOpen}
          onClose={() => setIsReadinessModalOpen(false)}
          phase={phase}
        />
        </div>
      </div>
      </>
    );
  }

  return (
    <>
      <div className="h-full flex flex-col justify-center">
        <div className="h-[var(--dim-card-height-pct)] min-h-0">
          <CardShell kind="phase" data={phase} selected={selected} locked={locked} onSelect={onSelect} className="w-full h-full max-h-full min-h-0 flex flex-col relative group/card overflow-hidden">
        {/* Header section with integrated Readiness Badge and Focus toggle */}
        <div className="w-full shrink-0">
          <header className="phase-card-header leading-tight flex justify-between items-center w-full">
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <div className="w-5 h-5 rounded bg-white/10 dark:bg-white/[0.04] border border-white/10 flex items-center justify-center font-mono text-dcx-xs font-bold text-[var(--theme-accent)] shadow-sm shrink-0 select-none animate-in fade-in zoom-in-50 duration-200">
                {displayNum}
              </div>
              <input
                type="text"
                value={editedLabel}
                onChange={(e) => setEditedLabel(e.target.value)}
                onBlur={handleLabelSubmit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleLabelSubmit();
                    e.currentTarget.blur();
                  }
                  if (e.key === 'Escape') {
                    setEditedLabel(phase.label);
                    e.currentTarget.blur();
                  }
                }}
                onClick={(e) => e.stopPropagation()}
                onDoubleClick={(e) => e.stopPropagation()}
                className="bg-transparent border border-transparent hover:border-white/10 focus:border-[var(--theme-accent)]/30 hover:bg-white/[0.02] focus:bg-black/30 font-bold text-sm text-white px-1 py-0.5 rounded outline-none transition-all truncate focus:text-white w-full max-w-[190px] md:max-w-[210px] tracking-tight"
                title="Click to edit phase name"
              />
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {actionIds.length > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFocusToggle();
                  }}
                  className="text-neutral-500 hover:text-[var(--theme-accent)] focus:outline-none transition-colors p-0.5 rounded flex items-center justify-center cursor-pointer select-none shrink-0"
                  title={`${allActionsExpanded ? 'Collapse' : 'Focus (expand)'} all nested Actions`}
                >
                  {allActionsExpanded ? (
                    <Eye className="w-3.5 h-3.5" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5 opacity-60" />
                  )}
                </button>
              )}
              <button
                type="button"
                data-testid="phase-readiness-expanded"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsReadinessModalOpen(true);
                }}
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-accent)] rounded cursor-pointer flex items-center"
                title={readinessTooltip(behavior.readiness.state)}
                aria-label={readinessAriaLabel(behavior.readiness.state)}
              >
                <PhaseReadinessBadge state={behavior.readiness.state} />
              </button>
            </div>
          </header>
        </div>

        {/* Expanded Actions List with inline scrolling */}
        {isExpanded && phase.actionCards.length > 0 && (
          <div className="w-full flex-1 min-h-0 flex flex-col overflow-hidden">
            <div className="mt-2.5 pt-2 border-t border-white/[0.06] flex flex-col gap-2 animate-in fade-in slide-in-from-top-1 duration-200 text-left pointer-events-auto flex-1 min-h-0 overflow-hidden">
              <div className="relative flex-1 min-h-0 overflow-hidden">
                {actionTopFade && (
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-8 z-10 bg-gradient-to-b from-[var(--theme-glass-bg)] to-transparent" aria-hidden />
                )}
                {actionBottomFade && (
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 z-10 bg-gradient-to-t from-[var(--theme-glass-bg)] to-transparent" aria-hidden />
                )}
                <div
                  ref={actionScrollRef}
                  className="flex flex-col gap-1.5 overflow-y-auto pr-1 h-full [scrollbar-width:thin] scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent scroll-smooth"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ActionDropZone index={0} phaseId={phase.id} />
                  {phase.actionCards.map((action, index) => (
                    <React.Fragment key={action.id}>
                      <ActionCard
                        action={action}
                        selected={selectedNodeIds.includes(action.id)}
                        onSelect={handleSelect}
                        locked={locked}
                      />
                      <ActionDropZone index={index + 1} phaseId={phase.id} />
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {isExpanded && phase.actionCards.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <span className="text-dcx-xs text-neutral-500 select-none">No actions yet</span>
          </div>
        )}
      </CardShell>

      <ReadinessCheckModal
        isOpen={isReadinessModalOpen}
        onClose={() => setIsReadinessModalOpen(false)}
        phase={phase}
      />
        </div>  {/* h-[var(--dim-card-height-pct)] */}
      </div>    {/* h-full justify-center */}
    </>
  );
}

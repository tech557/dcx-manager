import { Target } from 'lucide-react';
import StickyPopupShell from '@/ui/StickyPopupShell';
import { ReadinessCheckContent } from './ReadinessCheckContent';
import type { TaskCardData, ActionCardData, PhaseNodeData } from '@/types/builder-node.types';

export interface ReadinessCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: TaskCardData | null;
  action?: ActionCardData | null;
  phase?: PhaseNodeData | null;
}

export function ReadinessCheckModal({
  isOpen,
  onClose,
  task = null,
  action = null,
  phase = null
}: ReadinessCheckModalProps) {
  if (!isOpen) return null;

  if (!task && !action && !phase) {
    return (
      <StickyPopupShell isOpen={isOpen} onClose={onClose} title="Readiness Benchmark Audit">
        <div
          className="flex flex-col items-center justify-center h-[280px] text-center p-6 text-neutral-400 font-sans"
          id="readiness-modal-blank"
        >
          <div className="w-12 h-12 rounded-full bg-neutral-900/60 border border-white/5 flex items-center justify-center mb-4 text-neutral-600 animate-pulse">
            <Target className="w-6 h-6" />
          </div>
          <h4 className="text-dcx-md-plus font-bold text-neutral-200">No Active Node Selected</h4>
          <p className="text-dcx-xs-plus text-neutral-500 mt-2 max-w-[240px] leading-relaxed">
            Configure or open a task, action, or phase card from the builder stage grid to inspect its production release readiness metrics.
          </p>
        </div>
      </StickyPopupShell>
    );
  }

  const isPhase = !!phase;
  const isAction = !isPhase && !!action;
  const title = isPhase
    ? (phase.label || 'Untitled Phase')
    : isAction
      ? (action.name || 'Untitled Action')
      : (task?.name || 'Untitled Task');

  return (
    <StickyPopupShell isOpen={isOpen} onClose={onClose} title={`Readiness Audit: ${title}`}>
      <ReadinessCheckContent task={task} action={action} phase={phase} />
    </StickyPopupShell>
  );
}

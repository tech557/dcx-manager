import { AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/ui/atoms/Badge';
import type { ReadinessState } from '@/types/card.types';
import { READINESS_LABEL } from './readiness-label';

export interface PhaseReadinessBadgeProps {
  state: ReadinessState;
}

const STATE_CLASSES: Record<ReadinessState, string> = {
  ready: 'bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] shadow-[0_0_8px_var(--theme-accent-bg)]',
  incomplete: 'bg-[var(--theme-warning)]/10 text-[var(--theme-warning)] shadow-[0_0_8px_var(--theme-warning-bg)]',
  blocked: 'animate-pulse bg-[var(--theme-error-alt)]/10 text-[var(--theme-error-alt)] shadow-[0_0_8px_var(--theme-error-bg-alt)]',
  empty: 'bg-white/5 text-white/20',
};

export function PhaseReadinessBadge({ state }: PhaseReadinessBadgeProps) {
  return (
    <Badge
      variant="readiness"
      size="xs"
      className={`h-5 w-5 p-0 transition-all duration-200 ${STATE_CLASSES[state]}`}
    >
      {state === 'ready' ? (
        <CheckCircle2 className="h-3.5 w-3.5" />
      ) : state === 'incomplete' ? (
        <AlertTriangle className="h-3.5 w-3.5" />
      ) : state === 'blocked' ? (
        <AlertCircle className="h-3.5 w-3.5" />
      ) : (
        <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
      )}
      <span className="sr-only">Readiness: {READINESS_LABEL[state]}</span>
    </Badge>
  );
}

import type { ReadinessState } from '@/types/card.types';

/**
 * Canonical human-readable labels for a phase readiness state.
 * Reuse for any presentation surface (tooltip, aria-label, sr-only) so the
 * collapsed-phase marker and the badge stay consistent. Do not inline these.
 */
export const READINESS_LABEL: Record<ReadinessState, string> = {
  ready: 'Ready',
  incomplete: 'Incomplete',
  blocked: 'Blocked',
  empty: 'No scheduled tasks',
};

/** Screen-reader / `aria-label` text for a phase readiness marker. */
export function readinessAriaLabel(state: ReadinessState): string {
  return `Phase readiness: ${READINESS_LABEL[state]}. Open readiness checklist.`;
}

/** Hover tooltip (`title`) text for a phase readiness marker. */
export function readinessTooltip(state: ReadinessState): string {
  return `Readiness: ${READINESS_LABEL[state]} — click to view checklist`;
}

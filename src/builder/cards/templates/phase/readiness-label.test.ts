import { describe, expect, it } from 'vitest';
import type { ReadinessState } from '@/types/card.types';
import { READINESS_LABEL, readinessAriaLabel, readinessTooltip } from './readiness-label';

const STATES: ReadinessState[] = ['ready', 'blocked', 'incomplete', 'empty'];

describe('readiness-label', () => {
  it('has a label for every readiness state', () => {
    for (const state of STATES) {
      expect(READINESS_LABEL[state]).toBeTruthy();
    }
  });

  it('aria-label exposes the readiness state and the checklist action', () => {
    expect(readinessAriaLabel('ready')).toBe('Phase readiness: Ready. Open readiness checklist.');
    expect(readinessAriaLabel('blocked')).toBe('Phase readiness: Blocked. Open readiness checklist.');
    expect(readinessAriaLabel('empty')).toBe('Phase readiness: No scheduled tasks. Open readiness checklist.');
  });

  it('tooltip exposes the readiness state and the click affordance', () => {
    expect(readinessTooltip('incomplete')).toBe('Readiness: Incomplete — click to view checklist');
    expect(readinessTooltip('ready')).toBe('Readiness: Ready — click to view checklist');
  });
});

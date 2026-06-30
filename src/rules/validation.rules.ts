import type { Phase, Version } from '@/types/domain';
import type { ReadinessResult } from './readiness.rules';
import { getPhaseReadiness } from './readiness.rules';

export interface ValidationResult {
  valid: boolean;
  issues: string[];
}

export function validatePhaseForReady(phase: Phase): ReadinessResult {
  return getPhaseReadiness(phase);
}

export function validateVersionForReady(version: Version, phases: Phase[]): ValidationResult {
  const issues = phases.flatMap((phase) => getPhaseReadiness(phase).reasons);

  if (phases.length === 0) {
    issues.push('Version has no phases.');
  }

  if (version.status !== 'In Progress') {
    issues.push('Only an In Progress version can be submitted for approval.');
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

export function validateVersionForApproval(version: Version): ValidationResult {
  const issues: string[] = [];

  if (version.status !== 'Ready for Approval') {
    issues.push('Only a ready version can be approved.');
  }

  if (!version.communicatedDate) {
    issues.push('Approval requires a communicated date.');
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

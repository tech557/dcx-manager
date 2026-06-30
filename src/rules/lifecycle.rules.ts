import type { VersionStatus } from '@/types/lifecycle';

export const ALLOWED_TRANSITIONS: Readonly<Record<VersionStatus, readonly VersionStatus[]>> = {
  Draft: ['In Progress'],
  'In Progress': ['Ready for Approval'],
  'Ready for Approval': ['Approved', 'Superseded'],
  Approved: [],
  Superseded: [],
} as const;

export function canTransition(from: VersionStatus, to: VersionStatus): boolean {
  return ALLOWED_TRANSITIONS[from].includes(to);
}

export function isVersionLocked(status: VersionStatus): boolean {
  return status === 'Ready for Approval' || status === 'Approved' || status === 'Superseded';
}

export function isVersionEditable(status: VersionStatus): boolean {
  return !isVersionLocked(status);
}

export function canApproveVersion(version: { communicatedDate: string | null }): boolean {
  return !!version.communicatedDate && version.communicatedDate.trim() !== '';
}

export function deriveDCXStatus(versions: { status: VersionStatus }[]): VersionStatus {
  if (versions.length === 0) {
    return 'Draft';
  }

  const statuses = versions.map((v) => v.status);

  if (statuses.includes('Approved')) {
    return 'Approved';
  }

  if (statuses.includes('Ready for Approval')) {
    return 'Ready for Approval';
  }

  if (statuses.includes('In Progress')) {
    return 'In Progress';
  }

  if (statuses.every((s) => s === 'Superseded')) {
    return 'Superseded';
  }

  return 'Draft';
}

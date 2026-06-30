export type VersionStatus =
  | 'Draft'
  | 'In Progress'
  | 'Ready for Approval'
  | 'Approved'
  | 'Superseded';

export type VersionSourceType = 'scratch' | 'duplicate' | 'import' | 'template';

export type LifecycleEventType =
  | 'version_created'
  | 'in_progress_started'
  | 'ready_submitted'
  | 'approved'
  | 'superseded'
  | 'duplicated'
  | 'import_applied';

export const EDITABLE_VERSION_STATUSES: VersionStatus[] = ['Draft', 'In Progress'];
export const LOCKED_VERSION_STATUSES: VersionStatus[] = [
  'Ready for Approval',
  'Approved',
  'Superseded',
];

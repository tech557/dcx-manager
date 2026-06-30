import type { VersionStatus } from '@/types/lifecycle';
import { isVersionLocked } from './lifecycle.rules';

export interface PermissionContext {
  isAuthenticated: boolean;
  hasDCXAccess: boolean;
  versionStatus: VersionStatus;
}

export interface PermissionResult {
  allowed: boolean;
  reason: string | null;
}

export function canReadDCX(context: PermissionContext): PermissionResult {
  if (!context.isAuthenticated) {
    return { allowed: false, reason: 'User is not authenticated.' };
  }

  if (!context.hasDCXAccess) {
    return { allowed: false, reason: 'User does not have DCX access.' };
  }

  return { allowed: true, reason: null };
}

export function canEditVersion(context: PermissionContext): PermissionResult {
  const readAccess = canReadDCX(context);

  if (!readAccess.allowed) {
    return readAccess;
  }

  if (isVersionLocked(context.versionStatus)) {
    return { allowed: false, reason: 'Version is locked.' };
  }

  return { allowed: true, reason: null };
}

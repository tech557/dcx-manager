import {
  duplicateVersion,
  updateStatus,
  updateVersionDate,
} from '@/services/versions.service';
import type { Version } from '@/types/domain';
import type { VersionStatus } from '@/types/lifecycle';

export function updateVersionStatus(versionId: string, status: VersionStatus): Promise<Version> {
  return updateStatus(versionId, status);
}

export function updateVersionCommunicationDate(
  versionId: string,
  communicatedDate: string | null
): Promise<Version> {
  return updateVersionDate(versionId, communicatedDate);
}

export function duplicateEditableVersion(versionId: string): Promise<Version> {
  return duplicateVersion(versionId);
}

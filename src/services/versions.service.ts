import { apiClient } from './api-client';
import { withServiceErrorHandler } from './service-utils';
import type { ApiVersion } from '@/types/api';
import type { VersionStatus } from '@/types/lifecycle';

/**
 * @route GET /versions — all versions across all DCXs (dashboard seam per D-6)
 */
export const getAllVersions = withServiceErrorHandler('getAllVersions', async (): Promise<ApiVersion[]> => {
  const response = await apiClient<ApiVersion[]>('/versions');
  return response.data;
});

/**
 * @route GET /dcx/:dcxId/versions
 */
export const getVersions = withServiceErrorHandler('getVersions', async (dcxId: string): Promise<ApiVersion[]> => {
  const response = await apiClient<ApiVersion[]>(`/dcx/${dcxId}/versions`);
  return response.data;
});

/**
 * @route GET /versions/:versionId
 */
export const getVersion = withServiceErrorHandler('getVersion', async (versionId: string): Promise<ApiVersion> => {
  const response = await apiClient<ApiVersion>(`/versions/${versionId}`);
  return response.data;
});

/**
 * @route PATCH /versions/:versionId/status
 */
export const updateStatus = withServiceErrorHandler('updateStatus', async (versionId: string, status: VersionStatus): Promise<ApiVersion> => {
  const response = await apiClient<ApiVersion, { status: VersionStatus }>(`/versions/${versionId}/status`, {
    method: 'PATCH',
    body: { status },
  });
  return response.data;
});

/**
 * @route PATCH /versions/:versionId/date
 */
export const updateVersionDate = withServiceErrorHandler('updateVersionDate', async (versionId: string, date: string | null): Promise<ApiVersion> => {
  const response = await apiClient<ApiVersion, { date: string | null }>(`/versions/${versionId}/date`, {
    method: 'PATCH',
    body: { date },
  });
  return response.data;
});

/**
 * @route POST /versions/:sourceVersionId/duplicate
 */
export const duplicateVersion = withServiceErrorHandler('duplicateVersion', async (sourceVersionId: string): Promise<ApiVersion> => {
  const response = await apiClient<ApiVersion>(`/versions/${sourceVersionId}/duplicate`, {
    method: 'POST',
  });
  return response.data;
});

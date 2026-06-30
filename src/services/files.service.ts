import type { ApiFileAttachment } from '@/types/api';
import { apiClient } from './api-client';
import { withServiceErrorHandler } from './service-utils';

/**
 * @route GET /versions/:versionId/files
 */
export const getVersionFiles = withServiceErrorHandler('getVersionFiles', async (versionId: string): Promise<ApiFileAttachment[]> => {
  const response = await apiClient<ApiFileAttachment[]>(`/versions/${versionId}/files`);
  return response.data;
});

/**
 * @route POST /versions/:versionId/files
 */
export const attachVersionFile = withServiceErrorHandler('attachVersionFile', async (versionId: string, file: ApiFileAttachment): Promise<ApiFileAttachment> => {
  const response = await apiClient<ApiFileAttachment, ApiFileAttachment>(`/versions/${versionId}/files`, {
    method: 'POST',
    body: file,
  });
  return response.data;
});

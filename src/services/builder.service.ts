import { apiClient } from './api-client';
import { withServiceErrorHandler } from './service-utils';
import type { ApiBuilderTree, ApiPhase } from '@/types/api';

/**
 * @route GET /versions/:versionId/builder
 */
export const getBuilder = withServiceErrorHandler('getBuilder', async (versionId: string): Promise<ApiBuilderTree> => {
  const response = await apiClient<ApiBuilderTree>(`/versions/${versionId}/builder`);
  return response.data;
});

/**
 * @route PATCH /versions/:versionId/builder
 */
export const saveBuilder = withServiceErrorHandler('saveBuilder', async (versionId: string, phases: ApiPhase[]): Promise<ApiBuilderTree> => {
  const response = await apiClient<ApiBuilderTree, ApiPhase[]>(`/versions/${versionId}/builder`, {
    method: 'PATCH',
    body: phases,
  });
  return response.data;
});

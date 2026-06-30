import { apiClient } from './api-client';
import { withServiceErrorHandler } from './service-utils';
import type { ApiSubtaskDefinition } from '@/types/api';

/**
 * @route GET /api/subtask-definitions
 */
export const getSubtaskDefinitions = withServiceErrorHandler('getSubtaskDefinitions', async (channelId?: string): Promise<ApiSubtaskDefinition[]> => {
  const route = channelId ? `/api/subtask-definitions/${channelId}` : '/api/subtask-definitions';
  const response = await apiClient<ApiSubtaskDefinition[]>(route);
  return response.data;
});

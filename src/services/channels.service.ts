import { apiClient } from './api-client';
import { withServiceErrorHandler } from './service-utils';
import type { ApiChannel, ApiChannelComposition } from '@/types/api';

/**
 * @route GET /api/channels
 */
export const getChannels = withServiceErrorHandler('getChannels', async (): Promise<ApiChannel[]> => {
  const response = await apiClient<ApiChannel[]>('/api/channels');
  return response.data;
});

/**
 * @route GET /api/channels/:channelId/compositions
 */
export const getCompositions = withServiceErrorHandler('getCompositions', async (channelId: string): Promise<ApiChannelComposition[]> => {
  const response = await apiClient<ApiChannelComposition[]>(`/api/channels/${channelId}/compositions`);
  return response.data;
});

/**
 * @route POST /api/channels/:channelId/compositions
 */
export const createComposition = withServiceErrorHandler('createComposition', async (
  channelId: string,
  input: { name: string; definitionIds: string[] },
): Promise<ApiChannelComposition> => {
  const response = await apiClient<ApiChannelComposition, { name: string; definitionIds: string[] }>(
    `/api/channels/${channelId}/compositions`,
    {
      method: 'POST',
      body: input,
    },
  );
  return response.data;
});

import { apiClient } from './api-client';
import { withServiceErrorHandler } from './service-utils';
import type { ApiActivityEvent } from '@/types/api';
import type { LifecycleEventType } from '@/types/lifecycle';

export interface WriteLifecycleLogInput {
  type: LifecycleEventType;
  versionId: string;
  userId: string;
  details?: ApiActivityEvent['details'];
}

/**
 * @route GET /activity-logs — all logs across all versions (dashboard Home seam per D-3)
 */
export const getAllActivityLogs = withServiceErrorHandler('getAllActivityLogs', async (): Promise<ApiActivityEvent[]> => {
  const response = await apiClient<ApiActivityEvent[]>('/activity-logs');
  return response.data;
});

/**
 * @route GET /versions/:versionId/activity-logs
 */
export const getActivityLogs = withServiceErrorHandler('getActivityLogs', async (versionId: string): Promise<ApiActivityEvent[]> => {
  const response = await apiClient<ApiActivityEvent[]>(`/versions/${versionId}/activity-logs`);
  return response.data;
});

/**
 * @route POST /activity-logs
 */
export const writeLifecycleLog = withServiceErrorHandler('writeLifecycleLog', async (input: WriteLifecycleLogInput): Promise<ApiActivityEvent> => {
  const response = await apiClient<ApiActivityEvent, WriteLifecycleLogInput>('/activity-logs', {
    method: 'POST',
    body: input,
  });
  return response.data;
});

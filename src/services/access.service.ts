import { apiClient } from './api-client';
import { withServiceErrorHandler } from './service-utils';

export interface MyAccess {
  userId: string;
  isAuthenticated: boolean;
  workspaceIds: string[];
}

export interface DCXAccess {
  dcxId: string;
  hasAccess: boolean;
  canEdit: boolean;
}

/**
 * @route GET /access/me
 */
export const getMyAccess = withServiceErrorHandler('getMyAccess', async (): Promise<MyAccess> => {
  const response = await apiClient<MyAccess>('/access/me');
  return response.data;
});

/**
 * @route GET /dcx/:dcxId/access
 */
export const checkDCXAccess = withServiceErrorHandler('checkDCXAccess', async (dcxId: string): Promise<DCXAccess> => {
  const response = await apiClient<DCXAccess>(`/dcx/${dcxId}/access`);
  return response.data;
});

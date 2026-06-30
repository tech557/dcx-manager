import type { DCXAccess, MyAccess } from '@/services/access.service';
import { MOCK_USER_ID } from '@/mock/constants';
import { readMockStore } from './store';

const ACCESS_KEY = 'access:me';
const DCX_ACCESS_KEY_PREFIX = 'access:dcx';

export function getMyAccessFromMock(): MyAccess {
  return readMockStore<MyAccess>(ACCESS_KEY, {
    userId: MOCK_USER_ID,
    isAuthenticated: true,
    workspaceIds: ['workspace-1'],
  });
}

export function checkDCXAccessFromMock(dcxId: string): DCXAccess {
  return readMockStore<DCXAccess>(`${DCX_ACCESS_KEY_PREFIX}:${dcxId}`, {
    dcxId,
    hasAccess: true,
    canEdit: true,
  });
}

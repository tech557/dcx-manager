import type { ApiActivityEvent } from '@/types/api';
import type { LifecycleEventType } from '@/types/lifecycle';
import { generateId } from '@/utils/id.helpers';
import { readMockStore, writeMockStore } from './store';

const LOGS_KEY = 'activity-logs';

export interface WriteLifecycleLogInput {
  type: LifecycleEventType;
  versionId: string;
  userId: string;
  details?: ApiActivityEvent['details'];
}

function seedLogs(): ApiActivityEvent[] {
  return [
    { id: 'log-1', type: 'in_progress_started', versionId: 'v-1', userId: 'u-ms', timestamp: '2026-06-19T09:10:00.000Z', details: null },
    { id: 'log-2', type: 'ready_submitted', versionId: 'v-2', userId: 'u-ms', timestamp: '2026-06-20T14:30:00.000Z', details: null },
    { id: 'log-3', type: 'in_progress_started', versionId: 'v-4', userId: 'u-ms', timestamp: '2026-06-22T11:00:00.000Z', details: null },
    { id: 'log-4', type: 'approved', versionId: 'v-5', userId: 'u-ms', timestamp: '2026-06-25T16:45:00.000Z', details: null },
    { id: 'log-5', type: 'superseded', versionId: 'v-6', userId: 'u-ms', timestamp: '2026-06-25T16:46:00.000Z', details: null },
  ];
}

export function getAllActivityLogsFromMock(): ApiActivityEvent[] {
  const stored = readMockStore<ApiActivityEvent[]>(LOGS_KEY, []);
  return stored.length > 0 ? stored : seedLogs();
}

export function getActivityLogsFromMock(versionId: string): ApiActivityEvent[] {
  return readMockStore<ApiActivityEvent[]>(LOGS_KEY, seedLogs()).filter((log) => log.versionId === versionId);
}

export function writeLifecycleLogToMock(input: WriteLifecycleLogInput): ApiActivityEvent {
  const logs = readMockStore<ApiActivityEvent[]>(LOGS_KEY, []);
  const log: ApiActivityEvent = {
    id: generateId(),
    type: input.type,
    versionId: input.versionId,
    userId: input.userId,
    timestamp: new Date().toISOString(),
    details: input.details ?? null,
  };

  writeMockStore(LOGS_KEY, [...logs, log]);
  console.info('[mock lifecycle log]', log);
  return log;
}

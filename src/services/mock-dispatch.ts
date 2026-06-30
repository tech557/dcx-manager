/**
 * Retained dev/mock backend route dispatcher.
 *
 * P4 intentionally keeps this dispatcher and `src/mock/*` as the offline data
 * backend behind `apiClient`. The production fetch/Supabase/Vercel swap belongs
 * to the follow-up `production-api-client-switch` sprint.
 */
import { createAIReviewDraft } from './ai.service';
import { getClickUpEntryPayload } from './clickup.service';
import type { ApiClientRequestOptions, ApiClientResponse } from './api-client';
import { checkDCXAccessFromMock, getMyAccessFromMock } from './mock/access.mock';
import {
  createCompositionInMock,
  getChannelCompositionsFromMock,
  getChannelsFromMock,
  type CreateCompositionInput,
} from './mock/channels.mock';
import { getBuilderFromMock, saveBuilderToMock } from './mock/builder.mock';
import { getAllActivityLogsFromMock, getActivityLogsFromMock, writeLifecycleLogToMock } from './mock/logs.mock';
import { getSubtaskDefinitionsFromMock } from './mock/subtasks.mock';
import {
  getAllVersionsFromMock,
  attachVersionFileToMock,
  duplicateVersionInMock,
  getVersionFilesFromMock,
  getVersionFromMock,
  getVersionsForDcxFromMock,
  updateStatusInMock,
  updateVersionDateInMock,
} from './mock/versions.mock';
import type { ApiFileAttachment, ApiPhase } from '@/types/api';
import type { VersionStatus } from '@/types/lifecycle';

interface RouteEntry {
  method: string;
  pattern: RegExp;
  paramNames: string[];
  handler: (...params: string[]) => Promise<unknown>;
}

const routes: RouteEntry[] = [
  { method: 'GET', pattern: /^\/api\/channels$/, paramNames: [], handler: () => Promise.resolve(getChannelsFromMock()) },
  { method: 'GET', pattern: /^\/api\/channels\/([^/]+)\/compositions$/, paramNames: ['channelId'], handler: (channelId) => Promise.resolve(getChannelCompositionsFromMock(channelId)) },
  { method: 'POST', pattern: /^\/api\/channels\/([^/]+)\/compositions$/, paramNames: ['channelId'], handler: (channelId, body) => Promise.resolve(createCompositionInMock(channelId, parseBody<CreateCompositionInput>(body))) },

  { method: 'GET', pattern: /^\/versions\/([^/]+)\/builder$/, paramNames: ['versionId'], handler: (versionId) => Promise.resolve(getBuilderFromMock(versionId)) },
  { method: 'PATCH', pattern: /^\/versions\/([^/]+)\/builder$/, paramNames: ['versionId'], handler: (versionId, body) => Promise.resolve(saveBuilderToMock(versionId, parseBody<ApiPhase[]>(body))) },

  { method: 'GET', pattern: /^\/versions$/, paramNames: [], handler: () => Promise.resolve(getAllVersionsFromMock()) },
  { method: 'GET', pattern: /^\/dcx\/([^/]+)\/versions$/, paramNames: ['dcxId'], handler: (dcxId) => Promise.resolve(getVersionsForDcxFromMock(dcxId)) },
  { method: 'GET', pattern: /^\/versions\/([^/]+)$/, paramNames: ['versionId'], handler: (versionId) => Promise.resolve(getVersionFromMock(versionId)) },
  { method: 'PATCH', pattern: /^\/versions\/([^/]+)\/status$/, paramNames: ['versionId'], handler: (versionId, body) => {
    const { status } = parseBody<{ status: VersionStatus }>(body);
    return Promise.resolve(updateStatusInMock(versionId, status));
  }},
  { method: 'PATCH', pattern: /^\/versions\/([^/]+)\/date$/, paramNames: ['versionId'], handler: (versionId, body) => {
    const { date } = parseBody<{ date: string | null }>(body);
    return Promise.resolve(updateVersionDateInMock(versionId, date));
  }},
  { method: 'POST', pattern: /^\/versions\/([^/]+)\/duplicate$/, paramNames: ['sourceVersionId'], handler: (sourceVersionId) => duplicateVersionInMock(sourceVersionId) },

  { method: 'GET', pattern: /^\/versions\/([^/]+)\/files$/, paramNames: ['versionId'], handler: (versionId) => Promise.resolve(getVersionFilesFromMock(versionId)) },
  { method: 'POST', pattern: /^\/versions\/([^/]+)\/files$/, paramNames: ['versionId'], handler: (versionId, body) => Promise.resolve(attachVersionFileToMock(versionId, parseBody<ApiFileAttachment>(body))) },

  { method: 'GET', pattern: /^\/activity-logs$/, paramNames: [], handler: () => Promise.resolve(getAllActivityLogsFromMock()) },
  { method: 'GET', pattern: /^\/versions\/([^/]+)\/activity-logs$/, paramNames: ['versionId'], handler: (versionId) => Promise.resolve(getActivityLogsFromMock(versionId)) },
  { method: 'POST', pattern: /^\/activity-logs$/, paramNames: [], handler: (body) => Promise.resolve(writeLifecycleLogToMock(parseBody(body))) },

  { method: 'GET', pattern: /^\/api\/subtask-definitions$/, paramNames: [], handler: () => Promise.resolve(getSubtaskDefinitionsFromMock()) },
  { method: 'GET', pattern: /^\/api\/subtask-definitions\/([^/]+)$/, paramNames: ['channelId'], handler: (channelId) => Promise.resolve(getSubtaskDefinitionsFromMock(channelId)) },

  { method: 'GET', pattern: /^\/access\/me$/, paramNames: [], handler: () => Promise.resolve(getMyAccessFromMock()) },
  { method: 'GET', pattern: /^\/dcx\/([^/]+)\/access$/, paramNames: ['dcxId'], handler: (dcxId) => Promise.resolve(checkDCXAccessFromMock(dcxId)) },

  { method: 'POST', pattern: /^\/ai\/review-draft$/, paramNames: [], handler: (body) => {
    const { prompt } = parseBody<{ prompt: string }>(body);
    return createAIReviewDraft(prompt);
  }},
  { method: 'GET', pattern: /^\/clickup\/entry\/([^/]+)$/, paramNames: ['versionId'], handler: (versionId) => getClickUpEntryPayload(versionId) },
];

function parseBody<T>(body: string | undefined): T {
  return body ? JSON.parse(body) as T : undefined as T;
}

export async function mockDispatch<TData>(
  route: string,
  options?: ApiClientRequestOptions<unknown>,
): Promise<ApiClientResponse<TData>> {
  const method = options?.method ?? 'GET';
  const bodyStr = options?.body !== undefined ? JSON.stringify(options.body) : undefined;

  for (const entry of routes) {
    if (entry.method !== method) continue;
    const match = route.match(entry.pattern);
    if (!match) continue;

    const params = match.slice(1);

    if (bodyStr !== undefined) {
      params.push(bodyStr);
    }

    const data = await entry.handler(...params);
    return { data: data as TData };
  }

  throw new Error(`No mock handler for ${method} ${route}`);
}

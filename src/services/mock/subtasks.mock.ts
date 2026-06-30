import { MOCK_SUBTASK_DEFINITIONS } from '@/mock/subtask-definitions';
import type { ApiSubtaskDefinition } from '@/types/api';
import { readMockStore } from './store';

const SUBTASK_DEFINITIONS_KEY = 'subtask-definitions';

export function getSubtaskDefinitionsFromMock(channelId?: string): ApiSubtaskDefinition[] {
  const definitions = readMockStore<ApiSubtaskDefinition[]>(
    SUBTASK_DEFINITIONS_KEY,
    MOCK_SUBTASK_DEFINITIONS,
  );

  if (!channelId) {
    return definitions;
  }

  return definitions.filter((definition) => definition.channelIds.includes(channelId));
}

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from './QUERY_KEYS';
import { apiSubtaskDefinitionToDomain } from '@/services/api-mappers';
import { getSubtaskDefinitions } from '@/services/subtask-definitions.service';

export function useSubtaskDefinitionsQuery(channelId?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.subtaskDefinitions.byChannel(channelId),
    queryFn: async () => (await getSubtaskDefinitions(channelId)).map(apiSubtaskDefinitionToDomain),
  });
}

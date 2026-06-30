import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from './QUERY_KEYS';
import {
  apiChannelCompositionToDomain,
  apiChannelToDomain,
} from '@/services/api-mappers';
import { createComposition, getChannels, getCompositions } from '@/services/channels.service';

export function useChannelsQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.channels.all,
    queryFn: async () => (await getChannels()).map(apiChannelToDomain),
  });
}

export function useCompositionsQuery(channelId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.channels.compositions(channelId),
    queryFn: async () => (await getCompositions(channelId)).map(apiChannelCompositionToDomain),
    enabled: channelId.length > 0,
  });
}

export function useCreateCompositionMutation(channelId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { name: string; definitionIds: string[] }) =>
      apiChannelCompositionToDomain(await createComposition(channelId, input)),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.channels.all }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.channels.compositions(channelId) }),
      ]);
    },
  });
}

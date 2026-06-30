import { MOCK_CHANNELS } from '@/mock/channels';
import { MOCK_COMPOSITIONS } from '@/mock/compositions';
import { MOCK_USER_ID } from '@/mock/constants';
import type { ApiChannel, ApiChannelComposition } from '@/types/api';
import { readMockStore, writeMockStore } from './store';

const CHANNELS_KEY = 'channels';
const COMPOSITIONS_KEY = 'channel-compositions';

export interface CreateCompositionInput {
  name: string;
  definitionIds: string[];
}

export function getChannelsFromMock(): ApiChannel[] {
  return readMockStore<ApiChannel[]>(CHANNELS_KEY, MOCK_CHANNELS);
}

function saveChannelsToMock(channels: ApiChannel[]): ApiChannel[] {
  return writeMockStore(CHANNELS_KEY, channels);
}

function getCompositionsFromMock(): ApiChannelComposition[] {
  return readMockStore<ApiChannelComposition[]>(COMPOSITIONS_KEY, MOCK_COMPOSITIONS);
}

function saveCompositionsToMock(compositions: ApiChannelComposition[]): ApiChannelComposition[] {
  return writeMockStore(COMPOSITIONS_KEY, compositions);
}

function createCompositionId(channelId: string, compositions: ApiChannelComposition[]): string {
  return `comp-${channelId}-user-${compositions.length + 1}`;
}

export function getChannelCompositionsFromMock(channelId: string): ApiChannelComposition[] {
  return getCompositionsFromMock().filter((composition) => composition.channelId === channelId);
}

export function createCompositionInMock(
  channelId: string,
  input: CreateCompositionInput,
): ApiChannelComposition {
  const compositions = getCompositionsFromMock();
  const composition: ApiChannelComposition = {
    id: createCompositionId(channelId, compositions),
    channelId,
    name: input.name,
    definitionIds: input.definitionIds,
    createdBy: MOCK_USER_ID,
    isUserDefined: true,
  };

  saveCompositionsToMock([...compositions, composition]);

  const channels = getChannelsFromMock().map((channel) => {
    if (channel.id !== channelId || channel.availableCompositionIds.includes(composition.id)) {
      return channel;
    }

    return {
      ...channel,
      availableCompositionIds: [...channel.availableCompositionIds, composition.id],
    };
  });
  saveChannelsToMock(channels);

  return composition;
}

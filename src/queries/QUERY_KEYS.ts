export const QUERY_KEYS = {
  access: {
    me: ['access', 'me'] as const,
    dcx: (dcxId: string) => ['access', 'dcx', dcxId] as const,
  },
  versions: {
    all: ['versions', 'all'] as const,
    list: (dcxId: string) => ['versions', dcxId] as const,
    detail: (versionId: string) => ['versions', 'detail', versionId] as const,
  },
  builder: {
    tree: (versionId: string) => ['builder', versionId] as const,
    nodes: (versionId: string) => ['builder', versionId, 'nodes'] as const,
  },
  channels: {
    all: ['channels'] as const,
    compositions: (channelId: string) => ['channels', channelId, 'compositions'] as const,
  },
  subtaskDefinitions: {
    byChannel: (channelId?: string) => ['subtask-definitions', channelId ?? 'all'] as const,
  },
  users: {
    current: ['users', 'current'] as const,
  },
} as const;

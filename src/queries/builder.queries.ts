import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from './QUERY_KEYS';
import { apiBuilderTreeToDomain } from '@/services/api-mappers';
import { getBuilder } from '@/services/builder.service';
import type { BuilderNode } from '@/types/builder-node.types';
import { phasesToBuilderNodes } from '@/utils/node.helpers';

export function getBuilderNodesQueryOptions(versionId: string) {
  return {
    queryKey: QUERY_KEYS.builder.nodes(versionId),
    queryFn: async (): Promise<BuilderNode[]> => {
      const apiTree = await getBuilder(versionId);
      const domainTree = apiBuilderTreeToDomain(apiTree);
      return phasesToBuilderNodes(domainTree.phases);
    },
  };
}

export function useBuilderNodesQuery(versionId: string) {
  return useQuery(getBuilderNodesQueryOptions(versionId));
}

export function useBuilderTreeQuery(versionId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.builder.tree(versionId),
    queryFn: async () => apiBuilderTreeToDomain(await getBuilder(versionId)),
  });
}

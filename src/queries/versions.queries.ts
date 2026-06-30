import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from './QUERY_KEYS';
import { apiVersionToDomain } from '@/services/api-mappers';
import { getAllVersions, getVersion, getVersions } from '@/services/versions.service';

export function useAllVersionsQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.versions.all,
    queryFn: async () => {
      const versions = await getAllVersions();
      return versions.map(apiVersionToDomain);
    },
  });
}

export function useVersionsQuery(dcxId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.versions.list(dcxId),
    queryFn: async () => {
      const versions = await getVersions(dcxId);
      return versions.map(apiVersionToDomain);
    },
  });
}

export function useVersionQuery(versionId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.versions.detail(versionId),
    queryFn: async () => apiVersionToDomain(await getVersion(versionId)),
  });
}

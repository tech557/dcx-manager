import { useQuery } from '@tanstack/react-query';
import { getAllActivityLogs } from '@/services/logs.service';
import type { ApiActivityEvent } from '@/types/api';

export function useAllActivityLogsQuery() {
  return useQuery<ApiActivityEvent[]>({
    queryKey: ['activity-logs', 'all'],
    queryFn: () => getAllActivityLogs(),
  });
}

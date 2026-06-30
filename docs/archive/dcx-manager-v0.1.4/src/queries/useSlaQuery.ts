import { useQuery } from "@tanstack/react-query";
import { slaService, SlaTaskRecommendation } from "../services/sla.service";

export const SLA_QUERY_KEYS = {
  recommendations: (channelId: string) => ["sla", "recommendations", channelId] as const,
};

export function useSlaQuery(channelId: string | null) {
  return useQuery<SlaTaskRecommendation[]>({
    queryKey: SLA_QUERY_KEYS.recommendations(channelId || ""),
    queryFn: () => (channelId ? slaService.getSlaRecommendations(channelId) : Promise.resolve([])),
    enabled: !!channelId,
  });
}

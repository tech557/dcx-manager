import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { versionsService } from "../services/versions.service";
import { usersService } from "../services/users.service";
import { projectsService } from "../services/projects.service";
import { EnrichedVersion, PhaseData, VersionStatus } from "../types";

export const QUERY_KEYS = {
  versions: ["versions"] as const,
  versionDetail: (id: string) => ["versions", id] as const,
  users: ["users"] as const,
  projects: ["projects"] as const,
};

// Hook to query all versions
export function useVersionsQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.versions,
    queryFn: () => versionsService.getVersions(),
  });
}

// Hook to query a single version
export function useVersionDetailQuery(id: string | null) {
  return useQuery({
    queryKey: QUERY_KEYS.versionDetail(id || ""),
    queryFn: () => (id ? versionsService.getVersionById(id) : Promise.resolve(undefined)),
    enabled: !!id,
  });
}

// Hook to query users
export function useUsersQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.users,
    queryFn: () => usersService.getUsers(),
  });
}

// Hook to query clients and projects
export function useClientsWithProjectsQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.projects,
    queryFn: () => projectsService.getClientsWithProjects(),
  });
}

// Mutation to update an entire version
export function useUpdateVersionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updated: EnrichedVersion) => versionsService.updateVersion(updated),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.versions });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.versionDetail(data.id) });
    },
  });
}

// Mutation to save only the phases (builder canvas updates)
export function usePatchVersionPhasesMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, phases }: { id: string; phases: PhaseData[] }) =>
      versionsService.patchVersionPhases(id, phases),
    onSuccess: (data) => {
      // Invalidate both version list and specific version details
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.versions });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.versionDetail(data.id) });
    },
  });
}

// Mutation to create a new version
export function useCreateVersionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (version: EnrichedVersion) => versionsService.createVersion(version),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.versions });
    },
  });
}

// Mutation to update status only
export function useUpdateVersionStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: VersionStatus }) =>
      versionsService.updateVersionStatus(id, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.versions });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.versionDetail(data.id) });
    },
  });
}

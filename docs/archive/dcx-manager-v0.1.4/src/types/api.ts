import { Phase, Task, Action } from './domain';
import { User, EnrichedVersion, DCX, Activity } from '../types';

// Users API
export interface GetUsersResponse {
  users: User[];
}

export interface GetUserResponse {
  user: User;
}

// Access API
export interface GetMeResponse {
  userId: string;
  role: string;
  accessLevel: 'full' | 'read' | 'collaborator';
  visibleVersionIds: string[];
}

// Eligible Projects API
export interface GetEligibleProjectsResponse {
  projects: DCX[];
}

// Versions API
export interface GetVersionsResponse {
  versions: EnrichedVersion[];
}

export interface CreateVersionPayload {
  clientId: string;
  projectName: string;
  product: string;
  subProduct?: string;
  versionNumber: string;
}

export interface CreateVersionResponse {
  version: EnrichedVersion;
}

export interface CloneVersionPayload {
  versionId: string;
  fullClone: boolean; // if false, structural clone (phases/actions, no tasks)
}

export interface CloneVersionResponse {
  clone: EnrichedVersion;
}

// Builder API
export interface GetBuilderResponse {
  phases: Phase[];
}

export interface SaveBuilderPayload {
  phases: Phase[];
}

export interface SaveBuilderResponse {
  success: boolean;
  phases: Phase[];
}

export interface CreatePhasePayload {
  label: string;
  icon: 'awareness' | 'teaser' | 'launch' | 'scale' | 'maintenance';
  startDate: string;
  endDate: string;
}

export interface CreatePhaseResponse {
  phase: Phase;
}

export interface CreateActionPayload {
  phaseId: string;
  name: string;
  startDate: string;
  endDate: string;
}

export interface CreateActionResponse {
  action: Action;
}

export interface CreateTaskPayload {
  actionId: string;
  name: string;
  channelId: string;
}

export interface CreateTaskResponse {
  task: Task;
}

export interface UpdateTaskPayload {
  task: Partial<Task>;
}

export interface UpdateTaskResponse {
  task: Task;
}

// SLA API
export interface SuggestedSubtask {
  label: string;
  estimatedMinutes?: number;
}

export interface GetSlaSubtasksResponse {
  subtasks: SuggestedSubtask[];
  estimatedHours: number;
}

// Files API
export interface FileAttachment {
  id: string;
  title: string;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface GetFilesResponse {
  files: FileAttachment[];
}

export interface UploadFilePayload {
  title: string;
  url: string;
}

export interface UploadFileResponse {
  file: FileAttachment;
}

// Logs API
export interface GetLogsResponse {
  logs: Activity[];
}

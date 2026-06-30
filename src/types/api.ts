import type { LifecycleEventType, VersionSourceType, VersionStatus } from './lifecycle';

export type ApiJsonValue =
  | string
  | number
  | boolean
  | null
  | ApiJsonValue[]
  | { [key: string]: ApiJsonValue };

export type ApiTaskDate =
  | { mode: 'unset' }
  | { mode: 'linked'; weekOffset: number; dayOffset: number }
  | { mode: 'fixed'; date: string };

export interface ApiChannel {
  id: string;
  label: string;
  icon: string;
  availableCompositionIds: string[];
}

export interface ApiSubtaskDefinition {
  id: string;
  label: string;
  estimatedMinutes: number | null;
  channelIds: string[];
}

export interface ApiChannelComposition {
  id: string;
  channelId: string;
  name: string;
  definitionIds: string[];
  createdBy: string;
  isUserDefined: boolean;
}

export interface ApiDCX {
  id: string;
  clientId: string;
  projectName: string;
  product: string;
  subProduct: string | null;
  tags: string[];
  createdAt: string;
  createdBy: string;
  metadata: ApiJsonValue | null;
}

export interface ApiVersion {
  id: string;
  dcxId: string;
  versionNumber: string;
  status: VersionStatus;
  communicatedDate: string | null;
  createdAt: string;
  createdBy: string;
  lastUpdatedAt: string;
  lastUpdatedBy: string;
  inProgressAt: string | null;
  readyAt: string | null;
  approvedAt: string | null;
  supersededAt: string | null;
  sourceType: VersionSourceType;
  sourceVersionId: string | null;
  sourceBackupId: string | null;
  sourceTemplateId: string | null;
  assignedTeam: ApiAssignedMember[];
  attachments: ApiFileAttachment[];
  metadata: ApiJsonValue | null;
  strategyContext: ApiJsonValue | null;
}

export interface ApiPhase {
  id: string;
  versionId: string;
  label: string;
  icon: ApiPhaseIconType;
  orderIndex: number;
  actions: ApiAction[];
  updatedAt: string | null;
  updatedBy: string | null;
  metadata: ApiJsonValue | null;
}

export type ApiPhaseIconType = 'awareness' | 'teaser' | 'launch' | 'scale' | 'maintenance';

export interface ApiAction {
  id: string;
  phaseId: string;
  name: string;
  description: string | null;
  orderIndex: number;
  tasks: ApiTask[];
  updatedAt: string | null;
  updatedBy: string | null;
  metadata: ApiJsonValue | null;
}

export interface ApiTask {
  id: string;
  actionId: string;
  name: string;
  channelId: string;
  compositionId: string | null;
  message: string;
  senderId: string;
  receiverId: string;
  orderIndex: number;
  date: ApiTaskDate;
  specsState: ApiFieldCompletionState;
  missingDataState: ApiFieldCompletionState;
  subtasks: ApiSubtask[];
  isSmall: boolean | null;
  updatedAt: string | null;
  updatedBy: string | null;
  metadata: ApiJsonValue | null;
  generationContext: ApiJsonValue | null;
}

export type ApiFieldCompletionState =
  | { status: 'filled'; value: string }
  | { status: 'not-needed' }
  | { status: 'empty' };

export interface ApiSubtask {
  id: string;
  taskId: string;
  definitionId: string | null;
  label: string;
  done: boolean;
  estimatedMinutes: number | null;
  orderIndex: number;
  metadata: ApiJsonValue | null;
}

export interface ApiFileAttachment {
  id: string;
  versionId: string;
  title: string;
  url: string;
  source: 'google-drive' | 'link';
  createdBy: string;
  createdAt: string;
}

export interface ApiAssignedMember {
  userId: string;
  role: string;
  isProtected: boolean;
}

export interface ApiActivityEvent {
  id: string;
  type: LifecycleEventType;
  versionId: string;
  userId: string;
  timestamp: string;
  details: ApiJsonValue | null;
}

export interface ApiBuilderTree {
  version: ApiVersion;
  phases: ApiPhase[];
}

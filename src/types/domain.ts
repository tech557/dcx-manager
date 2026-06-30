import type { VersionSourceType, VersionStatus } from './lifecycle';
import type {
  ApiAssignedMember,
  ApiFieldCompletionState,
  ApiFileAttachment,
  ApiJsonValue,
  ApiPhaseIconType,
  ApiTaskDate,
} from './api';

export type ISODate = string;
export type ISOTimestamp = string;

export interface AIContextFields {
  metadata?: ApiJsonValue | null;
  aiContext?: ApiJsonValue | null;
  sourceContext?: ApiJsonValue | null;
}

export interface CollaborationFields {
  updatedAt: ISOTimestamp | null;
  updatedBy: string | null;
}

export interface DCX extends AIContextFields {
  id: string;
  clientId: string;
  projectName: string;
  product: string;
  subProduct: string | null;
  tags: string[];
  createdAt: ISOTimestamp;
  createdBy: string;
}

export interface Version extends AIContextFields {
  id: string;
  dcxId: string;
  versionNumber: string;
  status: VersionStatus;
  communicatedDate: ISODate | null;
  createdAt: ISOTimestamp;
  createdBy: string;
  lastUpdatedAt: ISOTimestamp;
  lastUpdatedBy: string;
  inProgressAt: ISOTimestamp | null;
  readyAt: ISOTimestamp | null;
  approvedAt: ISOTimestamp | null;
  supersededAt: ISOTimestamp | null;
  sourceType: VersionSourceType;
  sourceVersionId: string | null;
  sourceBackupId: string | null;
  sourceTemplateId: string | null;
  assignedTeam: ApiAssignedMember[];
  attachments: ApiFileAttachment[];
  strategyContext: ApiJsonValue | null;
}

export interface Phase extends AIContextFields, CollaborationFields {
  id: string;
  versionId: string;
  label: string;
  icon: ApiPhaseIconType;
  orderIndex: number;
  actions: Action[];
}

export interface Action extends AIContextFields, CollaborationFields {
  id: string;
  phaseId: string;
  name: string;
  description: string | null;
  orderIndex: number;
  tasks: Task[];
}

export interface Task extends AIContextFields, CollaborationFields {
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
  subtasks: Subtask[];
  isSmall: boolean | null;
  generationContext: ApiJsonValue | null;
}

export interface Subtask extends AIContextFields {
  id: string;
  taskId: string;
  definitionId: string | null;
  label: string;
  done: boolean;
  estimatedMinutes: number | null;
  orderIndex: number;
}

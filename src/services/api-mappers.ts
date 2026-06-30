import type {
  ApiAction,
  ApiActivityEvent,
  ApiAssignedMember,
  ApiBuilderTree,
  ApiChannel,
  ApiChannelComposition,
  ApiDCX,
  ApiFileAttachment,
  ApiJsonValue,
  ApiPhase,
  ApiSubtask,
  ApiSubtaskDefinition,
  ApiTask,
  ApiTaskDate,
  ApiVersion,
} from '@/types/api';
import type {
  Action,
  DCX,
  Phase,
  Subtask,
  Task,
  Version,
} from '@/types/domain';

export interface DomainBuilderTree {
  version: Version;
  phases: Phase[];
}

function mapJson(value: ApiJsonValue | null): ApiJsonValue | null {
  return value;
}

function stripResolvedDate(date: ApiTaskDate & { resolvedDate?: string }): ApiTaskDate {
  if (date.mode === 'linked') {
    return {
      mode: 'linked',
      weekOffset: date.weekOffset,
      dayOffset: date.dayOffset,
    };
  }

  return date;
}

export function apiAssignedMemberToDomain(member: ApiAssignedMember): ApiAssignedMember {
  return { ...member };
}

export function domainAssignedMemberToApi(member: ApiAssignedMember): ApiAssignedMember {
  return { ...member };
}

export function apiFileAttachmentToDomain(file: ApiFileAttachment): ApiFileAttachment {
  return { ...file };
}

export function domainFileAttachmentToApi(file: ApiFileAttachment): ApiFileAttachment {
  return { ...file };
}

export function apiChannelToDomain(channel: ApiChannel): ApiChannel {
  return { ...channel };
}

export function domainChannelToApi(channel: ApiChannel): ApiChannel {
  return { ...channel };
}

export function apiSubtaskDefinitionToDomain(definition: ApiSubtaskDefinition): ApiSubtaskDefinition {
  return { ...definition };
}

export function apiChannelCompositionToDomain(composition: ApiChannelComposition): ApiChannelComposition {
  return { ...composition };
}

export function domainChannelCompositionToApi(composition: ApiChannelComposition): ApiChannelComposition {
  return { ...composition };
}

export function apiSubtaskToDomain(subtask: ApiSubtask): Subtask {
  return {
    ...subtask,
    definitionId: subtask.definitionId,
    metadata: mapJson(subtask.metadata),
  };
}

export function domainSubtaskToApi(subtask: Subtask): ApiSubtask {
  return {
    ...subtask,
    metadata: subtask.metadata as ApiJsonValue | null,
  };
}

export function apiTaskToDomain(task: ApiTask): Task {
  return {
    ...task,
    compositionId: task.compositionId,
    date: stripResolvedDate(task.date),
    specsState: task.specsState,
    missingDataState: task.missingDataState,
    subtasks: task.subtasks.map(apiSubtaskToDomain),
    metadata: mapJson(task.metadata),
    generationContext: mapJson(task.generationContext),
  };
}

export function domainTaskToApi(task: Task): ApiTask {
  return {
    ...task,
    date: stripResolvedDate(task.date),
    specsState: task.specsState,
    missingDataState: task.missingDataState,
    subtasks: task.subtasks.map(domainSubtaskToApi),
    metadata: task.metadata as ApiJsonValue | null,
    generationContext: task.generationContext as ApiJsonValue | null,
  };
}

export function apiActionToDomain(action: ApiAction): Action {
  return {
    ...action,
    tasks: action.tasks.map(apiTaskToDomain),
    metadata: mapJson(action.metadata),
  };
}

export function domainActionToApi(action: Action): ApiAction {
  return {
    ...action,
    tasks: action.tasks.map(domainTaskToApi),
    metadata: action.metadata as ApiJsonValue | null,
  };
}

export function apiPhaseToDomain(phase: ApiPhase): Phase {
  return {
    ...phase,
    actions: phase.actions.map(apiActionToDomain),
    metadata: mapJson(phase.metadata),
  };
}

export function domainPhaseToApi(phase: Phase): ApiPhase {
  return {
    ...phase,
    actions: phase.actions.map(domainActionToApi),
    metadata: phase.metadata as ApiJsonValue | null,
  };
}

export function apiVersionToDomain(version: ApiVersion): Version {
  return {
    ...version,
    assignedTeam: version.assignedTeam.map(apiAssignedMemberToDomain),
    attachments: version.attachments.map(apiFileAttachmentToDomain),
    metadata: mapJson(version.metadata),
    strategyContext: mapJson(version.strategyContext),
  };
}

export function domainVersionToApi(version: Version): ApiVersion {
  return {
    ...version,
    assignedTeam: version.assignedTeam.map(domainAssignedMemberToApi),
    attachments: version.attachments.map(domainFileAttachmentToApi),
    metadata: version.metadata as ApiJsonValue | null,
    strategyContext: version.strategyContext as ApiJsonValue | null,
  };
}

export function apiDCXToDomain(dcx: ApiDCX): DCX {
  return {
    ...dcx,
    metadata: mapJson(dcx.metadata),
  };
}

export function domainDCXToApi(dcx: DCX): ApiDCX {
  return {
    ...dcx,
    metadata: dcx.metadata as ApiJsonValue | null,
  };
}

export function apiActivityEventToDomain(event: ApiActivityEvent): ApiActivityEvent {
  return {
    ...event,
    details: mapJson(event.details),
  };
}

export function domainActivityEventToApi(event: ApiActivityEvent): ApiActivityEvent {
  return {
    ...event,
    details: event.details as ApiJsonValue | null,
  };
}

export function apiBuilderTreeToDomain(tree: ApiBuilderTree): DomainBuilderTree {
  return {
    version: apiVersionToDomain(tree.version),
    phases: tree.phases.map(apiPhaseToDomain),
  };
}

export function domainBuilderTreeToApi(tree: DomainBuilderTree): ApiBuilderTree {
  return {
    version: domainVersionToApi(tree.version),
    phases: tree.phases.map(domainPhaseToApi),
  };
}

export function domainPhasesToApi(phases: Phase[]): ApiPhase[] {
  return phases.map(domainPhaseToApi);
}

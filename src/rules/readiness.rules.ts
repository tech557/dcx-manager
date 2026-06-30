import type { Action, Phase, Task } from '@/types/domain';
import type { ApiFieldCompletionState } from '@/types/api';
import type { ReadinessState } from '@/types/card.types';
import { resolveTaskDate } from '@/utils/date.helpers';

export interface ReadinessResult {
  state: ReadinessState;
  reasons: string[];
}

export function getFieldReadiness(field: ApiFieldCompletionState): ReadinessResult {
  if (field.status === 'empty') {
    return { state: 'incomplete', reasons: ['Field is not answered yet.'] };
  }

  return { state: 'ready', reasons: [] };
}

export function getTaskReadiness(task: Task): ReadinessResult {
  const reasons: string[] = [];

  if (!task.name || !task.name.trim()) {
    reasons.push('Task name is required.');
  }

  if (!task.channelId || !task.channelId.trim()) {
    reasons.push('Task channel is not selected.');
  }

  if (!task.senderId || !task.senderId.trim()) {
    reasons.push('Sender ID must be specified.');
  }

  if (!task.receiverId || !task.receiverId.trim()) {
    reasons.push('Receiver ID must be specified.');
  }

  if (!task.message || !task.message.trim()) {
    reasons.push('Draft message text is required.');
  }

  if (!task.date || task.date.mode === 'unset') {
    reasons.push('Comm calendar date must be scheduled.');
  }

  if (!task.subtasks || task.subtasks.length === 0) {
    reasons.push('At least one benchmark subtask is required.');
  } else {
    const missingDuration = task.subtasks.some(
      (st) => st.estimatedMinutes === null || st.estimatedMinutes === undefined || st.estimatedMinutes <= 0
    );
    if (missingDuration) {
      reasons.push('Each subtask must have a duration set.');
    }
  }

  if (task.specsState?.status === 'empty') {
    reasons.push('Asset specifications status must be filled or marked not needed.');
  }

  if (task.missingDataState?.status === 'empty') {
    reasons.push('Outstanding queries/missing data status must be filled or marked not needed.');
  }

  return {
    state: reasons.length > 0 ? 'incomplete' : 'ready',
    reasons,
  };
}

export function getActionReadiness(action: Action): ReadinessResult {
  const tasks = action.tasks || [];
  if (tasks.length === 0) {
    return { state: 'blocked', reasons: ['Action has no tasks.'] };
  }

  const childResults = tasks.map(getTaskReadiness);
  const reasons = childResults.flatMap((result) => result.reasons);

  return {
    state: reasons.length > 0 ? 'incomplete' : 'ready',
    reasons,
  };
}

export function getPhaseReadiness(phase: Phase): ReadinessResult {
  const actionsList = phase.actions || (phase as Phase & { actionCards?: Action[] }).actionCards || [];
  if (actionsList.length === 0) {
    return { state: 'blocked', reasons: ['Phase has no actions.'] };
  }

  const childResults = actionsList.map(getActionReadiness);
  const reasons = childResults.flatMap((result) => result.reasons);
  const hasBlockedChild = childResults.some((result) => result.state === 'blocked');

  return {
    state: hasBlockedChild ? 'blocked' : reasons.length > 0 ? 'incomplete' : 'ready',
    reasons,
  };
}

export function getDayReadiness(dayDate: string, allTasks: Task[], communicatedDate: string | null = null): ReadinessResult {
  const dayTasks = allTasks.filter(t => {
    const resolved = resolveTaskDate(t.date, communicatedDate);
    return resolved === dayDate;
  });
  if (dayTasks.length === 0) return { state: 'empty', reasons: [] }; // ✅ BLD-RED-001 / OD-002 (neutral / not-applicable / empty)
  const results = dayTasks.map(getTaskReadiness);
  const reasons = results.flatMap(r => r.reasons);
  return { state: reasons.length > 0 ? 'incomplete' : 'ready', reasons };
}

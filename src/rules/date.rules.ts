import type { Action, Phase, Task } from '@/types/domain';
import type { ApiTaskDate } from '@/types/api';
import { deriveActionDateSpan, derivePhaseDateSpan, resolveTaskDate } from '@/utils/date.helpers';

export function resolveStoredTaskDate(date: ApiTaskDate, communicatedDate: string | null): string | null {
  return resolveTaskDate(date, communicatedDate);
}

export function getTaskResolvedDate(task: Task, communicatedDate: string | null): string | null {
  return resolveStoredTaskDate(task.date, communicatedDate);
}

export function getActionDateSpan(action: Action, communicatedDate: string | null) {
  return deriveActionDateSpan(action, communicatedDate);
}

export function getPhaseDateSpan(phase: Phase, communicatedDate: string | null) {
  return derivePhaseDateSpan(phase, communicatedDate);
}

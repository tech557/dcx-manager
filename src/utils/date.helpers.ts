import type { Action, Phase, Task } from '@/types/domain';
import type { ApiTaskDate } from '@/types/api';

export interface DateSpan {
  startDate: string | null;
  endDate: string | null;
}

const DAY_MS = 24 * 60 * 60 * 1000;

export function parseISODate(date: string): Date {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export function formatISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function addDays(date: string, days: number): string {
  const parsed = parseISODate(date);
  parsed.setUTCDate(parsed.getUTCDate() + days);
  return formatISODate(parsed);
}

export function resolveTaskDate(date: ApiTaskDate, communicatedDate: string | null): string | null {
  if (date.mode === 'unset') {
    return null;
  }

  if (date.mode === 'fixed') {
    return date.date;
  }

  if (!communicatedDate) {
    return null;
  }

  return addDays(communicatedDate, date.weekOffset * 7 + date.dayOffset);
}

export function deriveDateSpan(dates: Array<string | null>): DateSpan {
  const sorted = dates
    .filter((date): date is string => Boolean(date))
    .sort((a, b) => parseISODate(a).getTime() - parseISODate(b).getTime());

  return {
    startDate: sorted[0] ?? null,
    endDate: sorted[sorted.length - 1] ?? null,
  };
}

export function deriveActionDateSpan(action: Action, communicatedDate: string | null): DateSpan {
  return deriveDateSpan(action.tasks.map((task) => resolveTaskDate(task.date, communicatedDate)));
}

export function derivePhaseDateSpan(phase: Phase, communicatedDate: string | null): DateSpan {
  const dates = phase.actions.flatMap((action) =>
    action.tasks.map((task) => resolveTaskDate(task.date, communicatedDate)),
  );
  return deriveDateSpan(dates);
}

export function daysBetween(startDate: string, endDate: string): number {
  return Math.round((parseISODate(endDate).getTime() - parseISODate(startDate).getTime()) / DAY_MS);
}

export function taskHasResolvedDate(task: Task, communicatedDate: string | null): boolean {
  return resolveTaskDate(task.date, communicatedDate) !== null;
}

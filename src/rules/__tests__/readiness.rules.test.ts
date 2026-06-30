import { describe, expect, it } from 'vitest';
import type { Task } from '@/types/domain';
import { getDayReadiness } from '../readiness.rules';

const baseTask: Task = {
  id: 'task-1',
  actionId: 'action-1',
  name: 'Test Task',
  orderIndex: 0,
  channelId: 'ch-1',
  compositionId: 'comp-1',
  senderId: 'SENDER',
  receiverId: 'RECEIVER',
  message: 'Hello',
  date: { mode: 'unset' },
  specsState: { status: 'filled', value: 'done' },
  missingDataState: { status: 'filled', value: 'none' },
  isSmall: false,
  generationContext: null,
  updatedAt: null,
  updatedBy: null,
  subtasks: [{ id: 'st-1', taskId: 'task-1', definitionId: null, label: 'Sub', done: false, estimatedMinutes: 30, orderIndex: 0 }],
};

describe('getDayReadiness', () => {
  it('counts a fixed-date task that matches the day', () => {
    const task: Task = { ...baseTask, date: { mode: 'fixed', date: '2026-07-01' } };
    const result = getDayReadiness('2026-07-01', [task]);
    expect(result.state).toBe('ready');
  });

  it('counts a linked-date task that resolves to the day', () => {
    const task: Task = { ...baseTask, date: { mode: 'linked', weekOffset: 0, dayOffset: 0 } };
    const result = getDayReadiness('2026-07-01', [task], '2026-07-01');
    expect(result.state).toBe('ready');
  });

  it('does not count a linked-date task that resolves to a different day', () => {
    const task: Task = { ...baseTask, date: { mode: 'linked', weekOffset: 1, dayOffset: 0 } };
    const result = getDayReadiness('2026-07-01', [task], '2026-07-01');
    expect(result.state).toBe('empty');
  });

  it('returns empty when no tasks match the day', () => {
    const result = getDayReadiness('2026-07-02', []);
    expect(result.state).toBe('empty');
  });
});

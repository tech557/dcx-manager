import type { Subtask } from '@/types/domain';

let _clipboard: Subtask[] = [];

export const subtaskClipboard = {
  copy(subtasks: Subtask[]): void {
    _clipboard = subtasks.map((st) => ({ ...st }));
  },
  paste(): Subtask[] {
    return _clipboard.map((st) => ({ ...st }));
  },
  hasItems(): boolean {
    return _clipboard.length > 0;
  },
  count(): number {
    return _clipboard.length;
  },
};

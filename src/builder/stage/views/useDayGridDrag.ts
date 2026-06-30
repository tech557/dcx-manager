import { useState } from 'react';
import { useStageContext } from '../StageProvider';
import { useBuilderActions } from '@/actions/useBuilderActions';
import type { TaskNode } from '@/types/builder-node.types';

interface UseDayGridDragInput {
  dateString: string;
  dayLabel: string;
  dayIndex: number;
  weekIndex: number;
  dayNum: number;
  isEnabled: boolean;
}

export function useDayGridDrag({
  dateString,
  dayLabel,
  dayIndex,
  weekIndex,
  dayNum,
  isEnabled,
}: UseDayGridDragInput) {
  const { nodes, rescheduleTask, setDraggingState } = useStageContext();
  const actions = useBuilderActions();
  const [isDragOver, setIsDragOver] = useState(false);

  function handleDragOver(event: React.DragEvent) {
    if (!isEnabled) return;
    if (event.dataTransfer.types.includes('application/x-dcx-card')) {
      event.preventDefault();
      setIsDragOver(true);
    }
  }

  function handleDrop(event: React.DragEvent) {
    event.preventDefault();
    setIsDragOver(false);
    if (!isEnabled || dayNum < 1) return;

    const raw = event.dataTransfer.getData('application/x-dcx-card');
    if (!raw) return;

    try {
      const payload: unknown = JSON.parse(raw);
      if (!payload || typeof payload !== 'object' || !('kind' in payload) || payload.kind !== 'task') return;
      const taskId = 'id' in payload && typeof payload.id === 'string' ? payload.id : null;
      if (!taskId) return;

      const fromViewContext = 'fromViewContext' in payload && payload.fromViewContext === true;
      if (fromViewContext) {
        const taskNode = nodes.find((n): n is TaskNode => n.kind === 'task' && n.id === taskId);
        if (taskNode) {
          actions.updateTask({
            actionId: taskNode.data.parentActionId,
            taskId,
            changes: {
              date: {
                mode: 'fixed',
                date: dateString,
              },
            },
          });
        }
      } else {
        rescheduleTask(taskId, weekIndex, dayNum);
      }
    } catch {
      setIsDragOver(false);
    }
  }

  function handleDragStart(event: React.DragEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;
    if (target.closest('button') || target.closest('input') || target.closest('select') || target.closest('article')) return;
    setDraggingState(true, 'day', dateString);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('application/x-dcx-card', JSON.stringify({ id: dateString, label: dayLabel, kind: 'day', dayIndex, weekIndex }));
  }

  return {
    isDragOver,
    handleDragLeave: () => setIsDragOver(false),
    handleDragOver,
    handleDrop,
    handleDragStart,
  };
}

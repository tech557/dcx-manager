import { useCallback } from 'react';
import { useBuilderActions } from '@/actions/useBuilderActions';
import type { BuilderNode } from '@/types/builder-node.types';

export function useTaskReschedule(nodes: BuilderNode[]) {
  const actions = useBuilderActions();

  return useCallback(
    (taskId: string, targetWeek: number, targetDay: number) => {
      for (const phase of nodes) {
        if (phase.kind !== 'phase') continue;
        for (const action of phase.data.actionCards) {
          const task = action.tasks.find((item) => item.id === taskId);
          if (!task) continue;
          actions.updateTask({
            actionId: task.parentActionId,
            taskId,
            changes: {
              date: {
                mode: 'linked',
                weekOffset: targetWeek,
                dayOffset: targetDay,
              },
            },
          });
          return;
        }
      }
    },
    [actions, nodes],
  );
}

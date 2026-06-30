import { assertCanRunBuilderMutation } from './action.guards';
import { useBuilderStore } from '@/store/builderStore';
import type { TaskCardData } from '@/types/builder-node.types';
import { SYSTEM_USER_ID, now, renumberTasks, mapActions, updatePhaseNode, findPhaseForAction } from './action.helpers';

export interface UpdateTaskInput {
  actionId: string;
  taskId: string;
  changes: Partial<TaskCardData>;
}

export interface MoveTaskInput {
  taskId: string;
  fromActionId: string;
  toActionId: string;
  toIndex: number;
}

export const taskUpdateActions = {
  updateTask(input: UpdateTaskInput): void {
    assertCanRunBuilderMutation('updateTask');
    const phase = findPhaseForAction(useBuilderStore.getState().nodes, input.actionId);
    if (!phase) {
      return;
    }

    useBuilderStore.getState().updateNodes((nodes) =>
      updatePhaseNode(nodes, phase.id, (phaseNode) => ({
        ...phaseNode,
        data: {
          ...phaseNode.data,
          actionCards: phaseNode.data.actionCards.map((action) =>
            action.id === input.actionId
              ? {
                  ...action,
                  tasks: action.tasks.map((task) =>
                    task.id === input.taskId
                      ? {
                          ...task,
                          ...input.changes,
                          id: task.id,
                          actionId: task.actionId,
                          parentActionId: task.parentActionId,
                          updatedAt: now(),
                          updatedBy: SYSTEM_USER_ID,
                        }
                      : task,
                  ),
                  updatedAt: now(),
                  updatedBy: SYSTEM_USER_ID,
                }
              : action,
          ),
          updatedAt: now(),
          updatedBy: SYSTEM_USER_ID,
        },
      })),
    );
  },

  moveTask(input: MoveTaskInput): void {
    assertCanRunBuilderMutation('moveTask');
    useBuilderStore.getState().updateNodes((nodes) => {
      let moving: TaskCardData | null = null;
      const removed = mapActions(nodes, (actions) =>
        actions.map((action) => {
          if (action.id !== input.fromActionId) {
            return action;
          }
          moving = action.tasks.find((task) => task.id === input.taskId) ?? null;
          return {
            ...action,
            tasks: renumberTasks(action.tasks.filter((task) => task.id !== input.taskId)),
          };
        }),
      );

      if (!moving) {
        return nodes;
      }

      const movingTask = moving as TaskCardData;

      return mapActions(removed, (actions) =>
        actions.map((action) => {
          if (action.id !== input.toActionId) {
            return action;
          }
          const movedTask = {
            ...movingTask,
            actionId: input.toActionId,
            parentActionId: input.toActionId,
          };
          const nextTasks = [...action.tasks];
          nextTasks.splice(Math.max(0, input.toIndex), 0, movedTask);
          return {
            ...action,
            tasks: renumberTasks(nextTasks),
            updatedAt: now(),
            updatedBy: SYSTEM_USER_ID,
          };
        }),
      );
    });
  },

  moveTasks(input: { taskIds: string[]; toActionId: string; toIndex: number }): void {
    assertCanRunBuilderMutation('moveTasks');
    useBuilderStore.getState().updateNodes((nodes) => {
      const movingTasks: TaskCardData[] = [];
      nodes.forEach((n) => {
        if (n.kind === 'phase') {
          n.data.actionCards.forEach((act) => {
            act.tasks.forEach((task) => {
              if (input.taskIds.includes(task.id)) {
                movingTasks.push({
                  ...task,
                  actionId: input.toActionId,
                  parentActionId: input.toActionId,
                });
              }
            });
          });
        }
      });

      if (movingTasks.length === 0) return nodes;

      const removedList = nodes.map((n) => {
        if (n.kind === 'phase') {
          return {
            ...n,
            data: {
              ...n.data,
              actionCards: n.data.actionCards.map((act) => ({
                ...act,
                tasks: renumberTasks(
                  act.tasks.filter((task) => !input.taskIds.includes(task.id))
                ),
              })),
              updatedAt: now(),
              updatedBy: SYSTEM_USER_ID,
            },
          };
        }
        return n;
      });

      const targetPhase = findPhaseForAction(removedList, input.toActionId);
      if (!targetPhase) return nodes;

      return updatePhaseNode(removedList, targetPhase.id, (phaseItem) => ({
        ...phaseItem,
        data: {
          ...phaseItem.data,
          actionCards: phaseItem.data.actionCards.map((act) => {
            if (act.id !== input.toActionId) {
              return act;
            }
            const nextTasks = [...act.tasks];
            nextTasks.splice(Math.max(0, input.toIndex), 0, ...movingTasks);
            return {
              ...act,
              tasks: renumberTasks(nextTasks),
              updatedAt: now(),
              updatedBy: SYSTEM_USER_ID,
            };
          }),
          updatedAt: now(),
          updatedBy: SYSTEM_USER_ID,
        },
      }));
    });
  },
};

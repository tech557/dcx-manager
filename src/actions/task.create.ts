import { assertCanRunBuilderMutation } from './action.guards';
import { useBuilderStore } from '@/store/builderStore';
import type { TaskCardData } from '@/types/builder-node.types';
import type { Subtask } from '@/types/domain';
import type { ApiTaskDate } from '@/types/api';
import { deriveTaskName } from '@/utils/composition.helpers';
import { generateId } from '@/utils/id.helpers';
import { SYSTEM_USER_ID, now, updatePhaseNode, findPhaseForAction } from './action.helpers';

export interface CreateTaskInput {
  actionId: string;
  actionName: string;
  channelId: string;
  channelLabel: string;
  compositionId: string | null;
  generatedSubtasks?: Subtask[];
  date?: ApiTaskDate;
}

export function createDefaultTask(actionId: string, orderIndex: number, input: CreateTaskInput): TaskCardData {
  const id = generateId();
  return {
    id,
    actionId,
    parentActionId: actionId,
    name: deriveTaskName(input.actionName, input.channelLabel),
    channelId: input.channelId,
    compositionId: input.compositionId ?? null,
    message: '',
    senderId: '',
    receiverId: '',
    orderIndex,
    date: input.date ?? { mode: 'unset' },
    specsState: { status: 'empty' },
    missingDataState: { status: 'empty' },
    subtasks: (input.generatedSubtasks ?? []).map((subtask, index) => ({
      ...subtask,
      taskId: id,
      orderIndex: index,
    })),
    isSmall: null,
    updatedAt: now(),
    updatedBy: SYSTEM_USER_ID,
    metadata: null,
    generationContext: null,
  };
}

export function cloneTask(task: TaskCardData, actionId: string, orderIndex: number): TaskCardData {
  const id = generateId();
  return {
    ...task,
    id,
    actionId,
    parentActionId: actionId,
    orderIndex,
    subtasks: task.subtasks.map((subtask, index) => ({
      ...subtask,
      id: generateId(),
      taskId: id,
      orderIndex: index,
    })),
    updatedAt: now(),
    updatedBy: SYSTEM_USER_ID,
  };
}

export const taskCreateActions = {
  createTask(input: CreateTaskInput): TaskCardData {
    assertCanRunBuilderMutation('createTask');
    const phase = findPhaseForAction(useBuilderStore.getState().nodes, input.actionId);
    if (!phase) {
      throw new Error(`Action not found for createTask: ${input.actionId}`);
    }

    let created: TaskCardData | null = null;
    useBuilderStore.getState().updateNodes((nodes) =>
      updatePhaseNode(nodes, phase.id, (phaseNode) => ({
        ...phaseNode,
        data: {
          ...phaseNode.data,
          actionCards: phaseNode.data.actionCards.map((action) => {
            if (action.id !== input.actionId) {
              return action;
            }
            created = createDefaultTask(input.actionId, action.tasks.length, input);
            return {
              ...action,
              tasks: [...action.tasks, created],
              updatedAt: now(),
              updatedBy: SYSTEM_USER_ID,
            };
          }),
          updatedAt: now(),
          updatedBy: SYSTEM_USER_ID,
        },
      })),
    );

    if (!created) {
      throw new Error(`Action not found for createTask: ${input.actionId}`);
    }

    useBuilderStore.getState().addRecentlyCreatedId((created as TaskCardData).id);

    return created;
  },
};

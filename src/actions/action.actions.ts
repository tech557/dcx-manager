import { assertCanRunBuilderMutation } from './action.guards';
import { useBuilderStore } from '@/store/builderStore';
import type { ActionCardData } from '@/types/builder-node.types';
import { generateId } from '@/utils/id.helpers';
import { SYSTEM_USER_ID, now, renumberActions, updatePhaseNode, mapActions } from './action.helpers';
import { cloneTask } from './task.create';

export interface CreateActionInput {
  phaseId: string;
  name?: string;
  description?: string | null;
}

export interface UpdateActionInput {
  phaseId: string;
  actionId: string;
  changes: Partial<ActionCardData>;
}

export interface MoveActionInput {
  actionId: string;
  fromPhaseId: string;
  toPhaseId: string;
  toIndex: number;
}

export function createDefaultAction(phaseId: string, orderIndex: number, input: CreateActionInput): ActionCardData {
  const id = generateId();
  return {
    id,
    phaseId,
    parentPhaseId: phaseId,
    name: input.name ?? 'Untitled action',
    description: input.description ?? null,
    orderIndex,
    tasks: [],
    updatedAt: now(),
    updatedBy: SYSTEM_USER_ID,
    metadata: null,
  };
}

export function cloneAction(action: ActionCardData, phaseId: string, orderIndex: number): ActionCardData {
  const id = generateId();
  return {
    ...action,
    id,
    phaseId,
    parentPhaseId: phaseId,
    orderIndex,
    tasks: action.tasks.map((task, index) => cloneTask(task, id, index)),
    updatedAt: now(),
    updatedBy: SYSTEM_USER_ID,
  };
}

export const actionActions = {
  createAction(input: CreateActionInput): ActionCardData {
    assertCanRunBuilderMutation('createAction');
    let created: ActionCardData | null = null;
    useBuilderStore.getState().updateNodes((nodes) =>
      updatePhaseNode(nodes, input.phaseId, (phase) => {
        created = createDefaultAction(input.phaseId, phase.data.actionCards.length, input);
        return {
          ...phase,
          data: {
            ...phase.data,
            actionCards: [...phase.data.actionCards, created],
            updatedAt: now(),
            updatedBy: SYSTEM_USER_ID,
            metadata: null,
          },
        };
      }),
    );

    if (!created) {
      throw new Error(`Phase not found for createAction: ${input.phaseId}`);
    }

    useBuilderStore.getState().addRecentlyCreatedId((created as ActionCardData).id);

    return created;
  },

  updateAction(input: UpdateActionInput): void {
    assertCanRunBuilderMutation('updateAction');
    useBuilderStore.getState().updateNodes((nodes) =>
      updatePhaseNode(nodes, input.phaseId, (phase) => ({
        ...phase,
        data: {
          ...phase.data,
          actionCards: phase.data.actionCards.map((action) =>
            action.id === input.actionId
              ? {
                  ...action,
                  ...input.changes,
                  id: action.id,
                  phaseId: action.phaseId,
                  parentPhaseId: action.parentPhaseId,
                  tasks: input.changes.tasks ?? action.tasks,
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

  deleteAction(actionId: string): void {
    assertCanRunBuilderMutation('deleteAction');
    useBuilderStore.getState().updateNodes((nodes) =>
      mapActions(nodes, (actions) => renumberActions(actions.filter((action) => action.id !== actionId))),
    );
  },

  moveAction(input: MoveActionInput): void {
    assertCanRunBuilderMutation('moveAction');
    useBuilderStore.getState().updateNodes((nodes) => {
      let moving: ActionCardData | null = null;
      const removed = mapActions(nodes, (actions, phase) => {
        if (phase.id !== input.fromPhaseId) {
          return actions;
        }
        moving = actions.find((action) => action.id === input.actionId) ?? null;
        return renumberActions(actions.filter((action) => action.id !== input.actionId));
      });

      if (!moving) {
        return nodes;
      }

      const movingAction = moving as ActionCardData;

      return updatePhaseNode(removed, input.toPhaseId, (phase) => {
        const nextAction: ActionCardData = {
          ...movingAction,
          phaseId: input.toPhaseId,
          parentPhaseId: input.toPhaseId,
        };
        const nextActions = [...phase.data.actionCards];
        nextActions.splice(Math.max(0, input.toIndex), 0, nextAction);
        return {
          ...phase,
          data: {
            ...phase.data,
            actionCards: renumberActions(nextActions),
            updatedAt: now(),
            updatedBy: SYSTEM_USER_ID,
          },
        };
      });
    });
  },

  moveActions(input: { actionIds: string[]; toPhaseId: string; toIndex: number }): void {
    assertCanRunBuilderMutation('moveActions');
    useBuilderStore.getState().updateNodes((nodes) => {
      const movingActions: ActionCardData[] = [];
      
      nodes.forEach((n) => {
        if (n.kind === 'phase') {
          n.data.actionCards.forEach((act) => {
            if (input.actionIds.includes(act.id)) {
              movingActions.push({
                ...act,
                phaseId: input.toPhaseId,
                parentPhaseId: input.toPhaseId,
              });
            }
          });
        }
      });

      if (movingActions.length === 0) return nodes;

      const removedList = nodes.map((node) => {
        if (node.kind === 'phase') {
          return {
            ...node,
            data: {
              ...node.data,
              actionCards: renumberActions(
                node.data.actionCards.filter((act) => !input.actionIds.includes(act.id))
              ),
              updatedAt: now(),
              updatedBy: SYSTEM_USER_ID,
            },
          };
        }
        return node;
      });

      return updatePhaseNode(removedList, input.toPhaseId, (phase) => {
        const nextActions = [...phase.data.actionCards];
        nextActions.splice(Math.max(0, input.toIndex), 0, ...movingActions);
        return {
          ...phase,
          data: {
            ...phase.data,
            actionCards: renumberActions(nextActions),
            updatedAt: now(),
            updatedBy: SYSTEM_USER_ID,
          },
        };
      });
    });
  },
};

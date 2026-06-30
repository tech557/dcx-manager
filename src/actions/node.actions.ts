import { assertCanRunBuilderMutation } from './action.guards';
import { useBuilderStore } from '@/store/builderStore';
import type { BuilderNode, PhaseNode, ActionCardData, TaskCardData } from '@/types/builder-node.types';
import { generateId } from '@/utils/id.helpers';
import { SYSTEM_USER_ID, now, renumberPhases, renumberActions, renumberTasks, updatePhaseNode } from './action.helpers';
import { cloneAction } from './action.actions';
import { cloneTask } from './task.create';

export interface DuplicateNodeInput {
  nodeId: string;
}

export interface ApplyImportInput {
  nodes: BuilderNode[];
}

export const nodeActions = {
  duplicateNode(input: DuplicateNodeInput): BuilderNode | null {
    assertCanRunBuilderMutation('duplicateNode');
    let duplicated: BuilderNode | null = null;
    useBuilderStore.getState().updateNodes((nodes) => {
      // 1. Try to find if it is a phase
      const phase = nodes.find((node): node is PhaseNode => node.kind === 'phase' && node.id === input.nodeId);
      if (phase) {
        const id = generateId();
        duplicated = {
          ...phase,
          id,
          parentId: phase.parentId,
          orderIndex: nodes.length,
          data: {
            ...phase.data,
            id,
            label: `${phase.data.label} Copy`,
            orderIndex: nodes.length,
            actionCards: phase.data.actionCards.map((action, index) => cloneAction(action, id, index)),
            updatedAt: now(),
            updatedBy: SYSTEM_USER_ID,
          },
        };
        return [...nodes, duplicated];
      }

      // 2. Try to find if it is an action
      let foundAction: ActionCardData | null = null;
      let parentPhaseId = '';
      for (const n of nodes) {
        if (n.kind === 'phase') {
          const act = n.data.actionCards.find(a => a.id === input.nodeId);
          if (act) {
            foundAction = act;
            parentPhaseId = n.id;
            break;
          }
        }
      }

      if (foundAction) {
        const cloned = cloneAction(foundAction, parentPhaseId, 0);
        cloned.name = `${cloned.name} Copy`;
        return updatePhaseNode(nodes, parentPhaseId, (phaseNode) => {
          const nextActionCards = [...phaseNode.data.actionCards, cloned];
          return {
            ...phaseNode,
            data: {
              ...phaseNode.data,
              actionCards: renumberActions(nextActionCards),
              updatedAt: now(),
              updatedBy: SYSTEM_USER_ID,
              metadata: null,
            }
          };
        });
      }

      // 3. Try to find if it is a task
      let foundTask: TaskCardData | null = null;
      let parentActionId = '';
      let pPhaseId = '';
      for (const n of nodes) {
        if (n.kind === 'phase') {
          for (const a of n.data.actionCards) {
            const t = a.tasks.find(tk => tk.id === input.nodeId);
            if (t) {
              foundTask = t;
              parentActionId = a.id;
              pPhaseId = n.id;
              break;
            }
          }
        }
      }

      if (foundTask) {
        const cloned = cloneTask(foundTask, parentActionId, 0);
        cloned.name = `${cloned.name} Copy`;
        return updatePhaseNode(nodes, pPhaseId, (phaseNode) => {
          return {
            ...phaseNode,
            data: {
              ...phaseNode.data,
              actionCards: phaseNode.data.actionCards.map((act) => {
                if (act.id === parentActionId) {
                  const nextTasks = [...act.tasks, cloned];
                  return {
                    ...act,
                    tasks: renumberTasks(nextTasks),
                    updatedAt: now(),
                    updatedBy: SYSTEM_USER_ID,
                  };
                }
                return act;
              }),
              updatedAt: now(),
              updatedBy: SYSTEM_USER_ID,
            }
          };
        });
      }

      return nodes;
    });
    return duplicated;
  },

  applyImport(input: ApplyImportInput): void {
    assertCanRunBuilderMutation('applyImport');
    useBuilderStore.getState().setNodes(renumberPhases(input.nodes));
  },
};

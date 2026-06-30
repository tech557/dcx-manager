import type { BuilderNode } from '@/types/builder-node.types';

export interface ActionLocation {
  phaseId: string;
  orderIndex: number;
  actionCardsLength: number;
}

export function findActionLocation(nodes: BuilderNode[], actionId: string): ActionLocation | null {
  for (const node of nodes) {
    if (node.kind === 'phase') {
      const actionIdx = node.data.actionCards.findIndex((act) => act.id === actionId);
      if (actionIdx >= 0) {
        return {
          phaseId: node.id,
          orderIndex: actionIdx,
          actionCardsLength: node.data.actionCards.length,
        };
      }
    }
  }
  return null;
}

export interface TaskLocation {
  actionId: string;
  phaseId: string;
  orderIndex: number;
  tasksLength: number;
}

export function findTaskLocation(nodes: BuilderNode[], taskId: string): TaskLocation | null {
  for (const node of nodes) {
    if (node.kind === 'phase') {
      for (const action of node.data.actionCards) {
        const taskIdx = action.tasks.findIndex((t) => t.id === taskId);
        if (taskIdx >= 0) {
          return {
            actionId: action.id,
            phaseId: node.id,
            orderIndex: taskIdx,
            tasksLength: action.tasks.length,
          };
        }
      }
    }
  }
  return null;
}

export function findPhaseLocation(nodes: BuilderNode[], phaseId: string) {
  const phaseNodes = nodes.filter((n) => n.kind === 'phase');
  const idx = phaseNodes.findIndex((n) => n.id === phaseId);
  return {
    orderIndex: idx >= 0 ? idx : 0,
    length: phaseNodes.length,
  };
}

export function adjustDropIndex(targetIndex: number, draggedIds: string[], orderedIds: string[]): number {
  const removedBeforeTarget = orderedIds
    .slice(0, targetIndex)
    .filter((id) => draggedIds.includes(id))
    .length;
  return Math.max(0, targetIndex - removedBeforeTarget);
}

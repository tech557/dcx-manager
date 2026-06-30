import type { ActionCardData, BuilderNode, PhaseNode, TaskCardData } from '@/types/builder-node.types';

export const SYSTEM_USER_ID = 'mock-user';

export function now(): string {
  return new Date().toISOString();
}

export function renumberPhases(nodes: BuilderNode[]): BuilderNode[] {
  return nodes.map((node, index) =>
    node.kind === 'phase'
      ? {
          ...node,
          orderIndex: index,
          data: { ...node.data, orderIndex: index },
        }
      : node,
  );
}

export function renumberActions(actions: ActionCardData[]): ActionCardData[] {
  return actions.map((action, index) => ({ ...action, orderIndex: index }));
}

export function renumberTasks(tasks: TaskCardData[]): TaskCardData[] {
  return tasks.map((task, index) => ({ ...task, orderIndex: index }));
}

export function updatePhaseNode(nodes: BuilderNode[], phaseId: string, updater: (phase: PhaseNode) => PhaseNode): BuilderNode[] {
  return nodes.map((node) => (node.kind === 'phase' && node.id === phaseId ? updater(node) : node));
}

export function mapActions(nodes: BuilderNode[], mapper: (actions: ActionCardData[], phase: PhaseNode) => ActionCardData[]): BuilderNode[] {
  return nodes.map((node) => {
    if (node.kind !== 'phase') {
      return node;
    }

    return {
      ...node,
      data: {
        ...node.data,
        actionCards: mapper(node.data.actionCards, node),
      },
    };
  });
}

export function findPhaseForAction(nodes: BuilderNode[], actionId: string): PhaseNode | null {
  return (
    nodes.find(
      (node): node is PhaseNode =>
        node.kind === 'phase' && node.data.actionCards.some((action) => action.id === actionId),
    ) ?? null
  );
}

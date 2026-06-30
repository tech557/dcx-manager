import type {
  ActionCardData,
  BuilderNode,
  PhaseNode,
  TaskCardData,
} from '@/types/builder-node.types';
import type { Action, Phase, Task } from '@/types/domain';

export function taskToCardData(task: Task) {
  return {
    ...task,
    parentActionId: task.actionId,
  };
}

export function actionToCardData(action: Action) {
  return {
    ...action,
    parentPhaseId: action.phaseId,
    tasks: action.tasks.map(taskToCardData),
  };
}

export function phaseToNode(phase: Phase): PhaseNode {
  const { actions: _actions, ...phaseData } = phase;

  return {
    id: phase.id,
    kind: 'phase',
    parentId: phase.versionId,
    orderIndex: phase.orderIndex,
    data: {
      ...phaseData,
      actionCards: phase.actions.map(actionToCardData),
    },
  };
}

export function phasesToBuilderNodes(phases: Phase[]): BuilderNode[] {
  return phases.map(phaseToNode);
}

export function nodeToPhase(node: PhaseNode): Phase {
  const { actionCards: _actionCards, ...phaseData } = node.data;

  return {
    ...phaseData,
    actions: node.data.actionCards.map((actionCard): Action => {
      const { parentPhaseId: _parentPhaseId, tasks, ...actionData } = actionCard;
      return {
        ...actionData,
        tasks: tasks.map((taskCard): Task => {
          const { parentActionId: _parentActionId, ...task } = taskCard;
          return task;
        }),
      };
    }),
  };
}

export function builderNodesToPhases(nodes: BuilderNode[]): Phase[] {
  return nodes
    .filter((node): node is PhaseNode => node.kind === 'phase')
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .map(nodeToPhase);
}

export function getAllActions(nodes: BuilderNode[]): ActionCardData[] {
  return nodes
    .filter((node): node is PhaseNode => node.kind === 'phase')
    .flatMap((node) => node.data.actionCards);
}

export function getAllTasks(nodes: BuilderNode[]): TaskCardData[] {
  return getAllActions(nodes).flatMap((action) => action.tasks);
}

export function findAction(
  nodes: BuilderNode[],
  id: string,
): ActionCardData | undefined {
  return getAllActions(nodes).find((action) => action.id === id);
}

export function findTask(
  nodes: BuilderNode[],
  id: string,
): TaskCardData | undefined {
  return getAllTasks(nodes).find((task) => task.id === id);
}

export function resolveNodeKind(
  nodes: BuilderNode[],
  id: string,
): 'phase' | 'action' | 'task' | undefined {
  if (nodes.some((node) => node.kind === 'phase' && node.id === id)) return 'phase';
  if (findAction(nodes, id)) return 'action';
  if (findTask(nodes, id)) return 'task';
  return undefined;
}

export function findParentPhase(
  nodes: BuilderNode[],
  childId: string,
): PhaseNode | undefined {
  return nodes
    .filter((node): node is PhaseNode => node.kind === 'phase')
    .find((phase) =>
      phase.data.actionCards.some(
        (action) =>
          action.id === childId
          || action.tasks.some((task) => task.id === childId),
      ),
    );
}

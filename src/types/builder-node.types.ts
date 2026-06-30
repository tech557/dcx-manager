import type { Action, Phase, Task } from './domain';

export type BuilderNodeKind = 'phase' | 'action' | 'task';

export interface BuilderNodeBase<TKind extends BuilderNodeKind, TData> {
  id: string;
  kind: TKind;
  parentId: string | null;
  orderIndex: number;
  data: TData;
}

export interface TaskCardData extends Task {
  parentActionId: string;
}

export interface ActionCardData extends Omit<Action, 'tasks'> {
  parentPhaseId: string;
  tasks: TaskCardData[];
}

export interface PhaseNodeData extends Omit<Phase, 'actions'> {
  actionCards: ActionCardData[];
}

export type TaskNode = BuilderNodeBase<'task', TaskCardData>;
export type ActionNode = BuilderNodeBase<'action', ActionCardData>;
export type PhaseNode = BuilderNodeBase<'phase', PhaseNodeData>;
export type BuilderNode = PhaseNode | ActionNode | TaskNode;

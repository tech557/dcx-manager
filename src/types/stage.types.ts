import type { BuilderNode } from './builder-node.types';

export type ViewKind = 'kanban' | 'timeline' | 'weekly' | 'monthly';

export interface StagePosition {
  x: number;
  y: number;
  zoom: number;
}

export interface StageContext {
  view: ViewKind;
  selectedNodeIds: string[];
  focusedNodeId: string | null;
  expandedNodeIds: string[];
  position: StagePosition;
  nodes: BuilderNode[];
}

export type StageSurfaceBehavior = 'push' | 'float' | 'filter' | 'none';

export interface StageLayoutContract {
  view: ViewKind;
  editor: StageSurfaceBehavior;
  popup: StageSurfaceBehavior;
  focus: StageSurfaceBehavior;
  islands: StageSurfaceBehavior;
}

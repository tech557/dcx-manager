import type { BuilderNodeKind } from './builder-node.types';
import type { ViewKind } from './stage.types';

export type DropzoneTarget = 'stage' | 'phase' | 'action' | 'task' | 'day' | 'edge';
export type DropzoneEdge = 'top' | 'right' | 'bottom' | 'left' | null;
export type DropCommand =
  | 'createPhase'
  | 'movePhase'
  | 'createAction'
  | 'moveAction'
  | 'createTask'
  | 'moveTask';

export interface Dropzone {
  id: string;
  view: ViewKind;
  target: DropzoneTarget;
  acceptedTypes: BuilderNodeKind[];
  targetId: string | null;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  active: boolean;
  edge: DropzoneEdge;
  command: DropCommand;
}

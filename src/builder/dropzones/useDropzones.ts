import { useMemo } from 'react';
import type { BuilderNode, BuilderNodeKind } from '@/types/builder-node.types';
import type { Dropzone } from '@/types/dropzone.types';
import type { ViewKind } from '@/types/stage.types';
import { createDropzonesForView } from './dropzone.registry';

export interface ActiveDragState {
  id: string;
  kind: BuilderNodeKind;
}

export function useDropzones(view: ViewKind, nodes: BuilderNode[], activeDrag: ActiveDragState | null): Dropzone[] {
  return useMemo(
    () =>
      createDropzonesForView(view, nodes).map((zone) => ({
        ...zone,
        active: activeDrag ? zone.acceptedTypes.includes(activeDrag.kind) : false,
      })),
    [activeDrag, nodes, view],
  );
}

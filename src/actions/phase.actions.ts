import { assertCanRunBuilderMutation } from './action.guards';
import { useBuilderStore } from '@/store/builderStore';
import type { PhaseNode } from '@/types/builder-node.types';
import type { ApiPhaseIconType } from '@/types/api';
import { generateId } from '@/utils/id.helpers';
import { SYSTEM_USER_ID, now, renumberPhases, updatePhaseNode } from './action.helpers';

export interface CreatePhaseInput {
  label?: string;
  versionId: string;
  icon?: ApiPhaseIconType;
}

export interface UpdatePhaseInput {
  id: string;
  changes: Partial<PhaseNode['data']>;
}

export interface MovePhaseInput {
  id: string;
  toIndex: number;
}

export const phaseActions = {
  createPhase(input: CreatePhaseInput): PhaseNode {
    assertCanRunBuilderMutation('createPhase');
    const id = generateId();
    const orderIndex = useBuilderStore.getState().nodes.length;
    const phase: PhaseNode = {
      id,
      kind: 'phase',
      parentId: input.versionId,
      orderIndex,
      data: {
        id,
        versionId: input.versionId,
        label: input.label ?? 'Untitled phase',
        icon: input.icon ?? 'awareness',
        orderIndex,
        actionCards: [],
        updatedAt: now(),
        updatedBy: SYSTEM_USER_ID,
        metadata: null,
      },
    };

    const currentNodes = useBuilderStore.getState().nodes;
    const hasPhases = currentNodes.some((n) => n.kind === 'phase');

    useBuilderStore.getState().updateNodes((nodes) => [...nodes, phase]);
    useBuilderStore.getState().addRecentlyCreatedId(id);

    if (!hasPhases) {
      import('@/services/versions.service').then(({ getVersion, updateStatus }) => {
        getVersion(input.versionId).then((v) => {
          if (v.status === 'Draft') {
            updateStatus(input.versionId, 'In Progress').then(() => {
              import('@/main').then(({ queryClient }) => {
                queryClient.invalidateQueries({ queryKey: ['versions'] });
              });
            });
          }
        });
      });
    }

    return phase;
  },

  updatePhase(input: UpdatePhaseInput): void {
    assertCanRunBuilderMutation('updatePhase');
    useBuilderStore.getState().updateNodes((nodes) =>
      updatePhaseNode(nodes, input.id, (phase) => ({
        ...phase,
        data: {
          ...phase.data,
          ...input.changes,
          id: phase.data.id,
          versionId: phase.data.versionId,
          actionCards: input.changes.actionCards ?? phase.data.actionCards,
          updatedAt: now(),
          updatedBy: SYSTEM_USER_ID,
        },
      })),
    );
  },

  deletePhase(phaseId: string): void {
    assertCanRunBuilderMutation('deletePhase');
    useBuilderStore.getState().updateNodes((nodes) => renumberPhases(nodes.filter((node) => node.id !== phaseId)));
  },

  movePhase(input: MovePhaseInput): void {
    assertCanRunBuilderMutation('movePhase');
    useBuilderStore.getState().updateNodes((nodes) => {
      const phaseIndex = nodes.findIndex((node) => node.id === input.id);
      if (phaseIndex < 0) {
        return nodes;
      }
      const next = [...nodes];
      const [phase] = next.splice(phaseIndex, 1);
      next.splice(Math.max(0, input.toIndex), 0, phase);
      return renumberPhases(next);
    });
  },

  movePhases(input: { ids: string[]; toIndex: number }): void {
    assertCanRunBuilderMutation('movePhases');
    useBuilderStore.getState().updateNodes((nodes) => {
      const phaseNodes = nodes.filter((node) => node.kind === 'phase');
      const draggedPhases = input.ids
        .map((id) => nodes.find((node) => node.id === id))
        .filter((n): n is PhaseNode => !!n);

      if (draggedPhases.length === 0) return nodes;

      const remaining = nodes.filter((n) => !input.ids.includes(n.id));

      const originalTargetPhase = phaseNodes[input.toIndex];
      let insertAt = remaining.length;
      if (originalTargetPhase) {
        const remainingIdx = remaining.findIndex((n) => n.id === originalTargetPhase.id);
        if (remainingIdx >= 0) {
          insertAt = remainingIdx;
        }
      }

      const next = [...remaining];
      next.splice(Math.max(0, insertAt), 0, ...draggedPhases);
      return renumberPhases(next);
    });
  },
};

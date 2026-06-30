import type { BuilderNode } from '@/types/builder-node.types';
import type { DropCommand, Dropzone } from '@/types/dropzone.types';
import type { ViewKind } from '@/types/stage.types';

interface DropzoneRule {
  target: Dropzone['target'];
  acceptedTypes: Dropzone['acceptedTypes'];
  command: DropCommand;
}

export const dropzoneRegistry: Record<ViewKind, DropzoneRule[]> = {
  kanban: [
    { target: 'stage', acceptedTypes: ['phase'], command: 'createPhase' },
    { target: 'phase', acceptedTypes: ['action'], command: 'createAction' },
    { target: 'action', acceptedTypes: ['task'], command: 'createTask' },
    { target: 'edge', acceptedTypes: ['phase', 'action', 'task'], command: 'movePhase' },
  ],
  timeline: [
    { target: 'day', acceptedTypes: ['task'], command: 'createTask' },
    { target: 'edge', acceptedTypes: ['task'], command: 'moveTask' },
  ],
  weekly: [
    { target: 'day', acceptedTypes: ['task'], command: 'moveTask' },
    { target: 'edge', acceptedTypes: ['task'], command: 'moveTask' },
  ],
  monthly: [
    { target: 'day', acceptedTypes: ['task'], command: 'moveTask' },
    { target: 'edge', acceptedTypes: ['task'], command: 'moveTask' },
  ],
};

export function getDropzoneRules(view: ViewKind): DropzoneRule[] {
  return dropzoneRegistry[view];
}

export function createDropzonesForView(view: ViewKind, nodes: BuilderNode[]): Dropzone[] {
  const rules = getDropzoneRules(view);
  const zones: Dropzone[] = [];

  rules.forEach((rule, ruleIndex) => {
    if (rule.target === 'stage' || rule.target === 'edge') {
      zones.push({
        id: `${view}:${rule.target}:${ruleIndex}`,
        view,
        target: rule.target,
        acceptedTypes: rule.acceptedTypes,
        targetId: null,
        position: { x: ruleIndex * 24, y: 0, width: 160, height: 48 },
        active: false,
        edge: rule.target === 'edge' ? 'right' : null,
        command: rule.command,
      });
      return;
    }

    const phaseNodes = nodes.filter((node) => node.kind === 'phase');
    const targets =
      rule.target === 'action'
        ? phaseNodes.flatMap((node) =>
            node.data.actionCards.map((action) => ({
              id: action.id,
              index: node.orderIndex + action.orderIndex,
            })),
          )
        : phaseNodes.map((node) => ({ id: node.id, index: node.orderIndex }));

    targets.forEach((target) => {
        zones.push({
          id: `${view}:${rule.target}:${target.id}`,
          view,
          target: rule.target,
          acceptedTypes: rule.acceptedTypes,
          targetId: target.id,
          position: { x: target.index * 192, y: (ruleIndex + 1) * 64, width: 160, height: 48 },
          active: false,
          edge: null,
          command: rule.command,
        });
      });
  });

  return zones;
}

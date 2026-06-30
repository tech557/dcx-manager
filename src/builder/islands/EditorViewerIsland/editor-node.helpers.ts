import { getBrowserStorage } from '@/utils/browser-storage.helpers';
import type { BuilderNode } from '@/types/builder-node.types';
import type { DayDraft, EditorDraftData } from '@/types/editor.types';

export interface DayNode {
  id: string;
  kind: 'day';
  parentId: null;
  data: DayDraft;
}

export type EditorNode = BuilderNode | DayNode;

export function createDayNode(focusedNodeId: string): DayNode {
  const dateStr = focusedNodeId.replace('day:', '');
  return {
    id: focusedNodeId,
    kind: 'day',
    parentId: null,
    data: {
      id: focusedNodeId,
      label: `Day: ${dateStr}`,
      dateString: dateStr,
      kind: 'day',
    },
  };
}

export function findEditorNode(nodes: BuilderNode[], focusedNodeId: string | null): EditorNode | null {
  if (!focusedNodeId) return null;
  if (focusedNodeId.startsWith('day:')) return createDayNode(focusedNodeId);

  const phaseNode = nodes.find((node) => node.id === focusedNodeId);
  if (phaseNode) return phaseNode;

  for (const phase of nodes) {
    if (phase.kind !== 'phase') continue;

    const action = phase.data.actionCards.find((candidate) => candidate.id === focusedNodeId);
    if (action) {
      return {
        id: action.id,
        kind: 'action',
        parentId: phase.id,
        orderIndex: action.orderIndex ?? 0,
        data: action,
      };
    }

    for (const taskAction of phase.data.actionCards) {
      const task = taskAction.tasks.find((candidate) => candidate.id === focusedNodeId);
      if (task) {
        return {
          id: task.id,
          kind: 'task',
          parentId: taskAction.id,
          orderIndex: task.orderIndex ?? 0,
          data: task,
        };
      }
    }
  }

  return null;
}

export function getInitialDraft(activeNode: EditorNode): EditorDraftData {
  if (activeNode.kind === 'day') {
    return {
      ...activeNode.data,
      notes: getBrowserStorage()?.getItem(`dcx-day-notes-${activeNode.id}`) || '',
    };
  }

  return JSON.parse(JSON.stringify(activeNode.data)) as EditorDraftData;
}

import { useEffect, type Dispatch, type SetStateAction } from 'react';
import type { BuilderNode } from '@/types/builder-node.types';

interface UseStageExpansionOptions {
  nodes: BuilderNode[];
  focusedNodeId: string | null;
  selectedNodeIds: string[];
  setExpandedNodeIds: Dispatch<SetStateAction<string[]>>;
}

export function findParentId(nodes: BuilderNode[], nodeId: string): string | null {
  const phase = nodes.find((node) => node.id === nodeId);
  if (phase) return phase.parentId;

  for (const node of nodes) {
    if (node.kind !== 'phase') continue;
    const action = node.data.actionCards.find((item) => item.id === nodeId);
    if (action) return node.id;
    const parentAction = node.data.actionCards.find((item) =>
      item.tasks.some((task) => task.id === nodeId),
    );
    if (parentAction) return parentAction.id;
  }
  return null;
}

export function useStageExpansion({
  nodes,
  focusedNodeId,
  selectedNodeIds,
  setExpandedNodeIds,
}: UseStageExpansionOptions) {
  useEffect(() => {
    const sourceIds = [...(focusedNodeId ? [focusedNodeId] : []), ...selectedNodeIds];
    if (sourceIds.length === 0) return;

    const ancestorIds = new Set<string>();
    sourceIds.forEach((sourceId) => {
      let parentId = findParentId(nodes, sourceId);
      while (parentId) {
        ancestorIds.add(parentId);
        parentId = findParentId(nodes, parentId);
      }
    });

    if (ancestorIds.size === 0) return;
    setExpandedNodeIds((current) => {
      const next = Array.from(new Set([...current, ...ancestorIds]));
      return next.length === current.length ? current : next;
    });
  }, [focusedNodeId, nodes, selectedNodeIds, setExpandedNodeIds]);
}

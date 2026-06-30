import type { BuilderNode } from '@/types/builder-node.types';

/**
 * Traverses the hierarchy from the given node IDs to find all self and descendant node IDs.
 * (e.g. Phase -> Actions -> Tasks)
 */
export function getSelfAndDescendants(nodeIds: string[], allNodes: BuilderNode[]): string[] {
  const result = new Set<string>();
  const queue = [...nodeIds];
  while (queue.length > 0) {
    const currentId = queue.shift()!;
    if (!result.has(currentId)) {
      result.add(currentId);
      const children = allNodes.filter((n) => n.parentId === currentId);
      for (const child of children) {
        queue.push(child.id);
      }
    }
  }
  return Array.from(result);
}

import type { BuilderNode } from '@/types/builder-node.types';
import type { CardKind } from '@/types/card.types';

interface SelectionInfo {
  mixed: boolean;
  anyLocked: boolean;
}

export function getSelectionInfo(nodes: BuilderNode[], selectedIds: string[]): SelectionInfo {
  const selections: { kind: CardKind; locked: boolean }[] = [];

  selectedIds.forEach((id) => {
    const phase = nodes.find((node) => node.id === id);
    if (phase?.kind === 'phase') {
      selections.push({ kind: 'phase', locked: false });
      return;
    }

    for (const node of nodes) {
      if (node.kind !== 'phase') continue;
      const action = node.data.actionCards.find((candidate) => candidate.id === id);
      if (action) {
        selections.push({ kind: 'action', locked: false });
        return;
      }

      for (const candidate of node.data.actionCards) {
        if (candidate.tasks.some((task) => task.id === id)) {
          selections.push({ kind: 'task', locked: false });
          return;
        }
      }
    }
  });

  return {
    mixed: new Set(selections.map((selection) => selection.kind)).size > 1,
    anyLocked: selections.some((selection) => selection.locked),
  };
}

import type { ViewKind } from '@/types/stage.types';

export type IslandScope = 'global' | 'view-limited' | 'view-specific';

export interface IslandRegistryEntry {
  id: string;
  scope: IslandScope;
  // layout contract: push | float | overlay — keep simple string union for now
  layout?: 'push' | 'float' | 'overlay' | 'pill';
  // which views this island is compatible with (empty = all)
  compatibleWith?: ViewKind[];
  // whether island state should persist across views (UI pref)
  persistAcrossViews?: boolean;
}

export const islandRegistry: Record<string, IslandRegistryEntry> = {
  viewHelper: {
    id: 'viewHelper',
    scope: 'global',
    layout: 'pill',
    compatibleWith: [],
    persistAcrossViews: true,
  },
  selectionIsland: {
    id: 'selectionIsland',
    scope: 'view-limited',
    layout: 'pill',
    // shown only in kanban and timeline (example)
    compatibleWith: ['kanban', 'timeline'],
    persistAcrossViews: false,
  },
};

export function getIslandEntry(id: string): IslandRegistryEntry | undefined {
  return islandRegistry[id];
}

export function islandsForView(view: ViewKind) {
  return Object.values(islandRegistry).filter((i) => !i.compatibleWith || i.compatibleWith.length === 0 || i.compatibleWith.includes(view));
}

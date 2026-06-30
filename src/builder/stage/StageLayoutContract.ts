import type { StageLayoutContract as StageLayoutContractShape, ViewKind } from '@/types/stage.types';

export const STAGE_LAYOUT_CONTRACT: Record<ViewKind, StageLayoutContractShape> = {
  kanban: {
    view: 'kanban',
    editor: 'push',
    popup: 'float',
    focus: 'filter',
    islands: 'float',
  },
  timeline: {
    view: 'timeline',
    editor: 'push',
    popup: 'float',
    focus: 'filter',
    islands: 'float',
  },
  weekly: {
    view: 'weekly',
    editor: 'push',
    popup: 'float',
    focus: 'filter',
    islands: 'float',
  },
  monthly: {
    view: 'monthly',
    editor: 'push',
    popup: 'float',
    focus: 'filter',
    islands: 'float',
  },
};

export function getStageLayoutContract(view: ViewKind): StageLayoutContractShape {
  return STAGE_LAYOUT_CONTRACT[view];
}

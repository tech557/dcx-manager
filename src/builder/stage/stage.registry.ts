import type { ComponentType } from 'react';
import type { ViewKind } from '@/types/stage.types';
import { KanbanView } from './views/KanbanView';
import { MonthlyView } from './views/MonthlyView';
import { TimelineView } from './views/TimelineView';
import { WeeklyView } from './views/WeeklyView';

export interface StageViewRendererProps {
  className?: string;
}

export interface StageViewRegistryEntry {
  view: ViewKind;
  label: string;
  Renderer: ComponentType<StageViewRendererProps>;
}

export const stageRegistry: Record<ViewKind, StageViewRegistryEntry> = {
  kanban: {
    view: 'kanban',
    label: 'Kanban',
    Renderer: KanbanView,
  },
  timeline: {
    view: 'timeline',
    label: 'Timeline',
    Renderer: TimelineView,
  },
  weekly: {
    view: 'weekly',
    label: 'Weekly',
    Renderer: WeeklyView,
  },
  monthly: {
    view: 'monthly',
    label: 'Monthly',
    Renderer: MonthlyView,
  },
};

export function getStageRenderer(view: ViewKind): StageViewRegistryEntry {
  return stageRegistry[view];
}

export const stageViewOrder: ViewKind[] = ['kanban', 'timeline', 'weekly', 'monthly'];

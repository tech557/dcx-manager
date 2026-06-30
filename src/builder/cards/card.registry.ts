import type { CardConfig, CardKind } from '@/types/card.types';

const readinessBorders = {
  glassBorderReady: 'border-[var(--theme-accent)]/20 shadow-[0_0_15px_var(--theme-selected-glow)]',
  glassBorderIncomplete: 'border-[var(--theme-warning)]/20 shadow-[0_0_12px_rgba(244,201,117,0.12)]',
  glassBorderBlocked: 'border-[var(--theme-error)]/20 shadow-[0_0_12px_var(--theme-error-bg)]',
};

export const cardRegistry: Record<CardKind, CardConfig> = {
  phase: {
    kind: 'phase',
    capabilities: ['select', 'multiSelect', 'expand', 'drag', 'reorder', 'delete', 'lock', 'readiness', 'density'],
    movement: { axis: 'horizontal', container: 'board' },
    indicators: ['readiness', 'density', 'blockers'],
    readinessSource: 'children',
    templateId: 'phase/default',
    effects: {
      showDropGlow: true,
      showSelectionScale: false,
      showSelectionCorners: true,
      ...readinessBorders,
    },
  },
  action: {
    kind: 'action',
    capabilities: ['select', 'multiSelect', 'drag', 'reorder', 'delete', 'lock', 'readiness'],
    movement: { axis: 'vertical', container: 'phase' },
    indicators: ['readiness', 'taskCount'],
    readinessSource: 'children',
    templateId: 'action/default',
    effects: {
      showDropGlow: true,
      showSelectionScale: false,
      showSelectionCorners: true,
      noBackground: true,
      ...readinessBorders,
    },
  },
  task: {
    kind: 'task',
    capabilities: ['select', 'multiSelect', 'drag', 'reorder', 'delete', 'lock', 'readiness', 'fieldIndicators'],
    movement: { axis: 'vertical', container: 'action' },
    indicators: ['date', 'specs', 'missingData', 'sender', 'receiver', 'channel'],
    readinessSource: 'fields',
    templateId: 'task/default',
    effects: {
      showDropGlow: true,
      showSelectionScale: true,
      showSelectionCorners: true,
      ...readinessBorders,
    },
  },
  day: {
    kind: 'day',
    capabilities: ['select', 'readiness'],
    movement: { axis: 'none', container: 'timeline' },
    indicators: ['taskCount'],
    readinessSource: 'derived',
    templateId: 'day/default',
    effects: {
      showDropGlow: false,
      showSelectionScale: false,
      showSelectionCorners: false,
      ...readinessBorders,
    },
  },
};

export function getCardConfig(kind: CardKind): CardConfig {
  return cardRegistry[kind];
}

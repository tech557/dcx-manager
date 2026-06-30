import type { BuilderNodeKind } from './builder-node.types';
import type { ApiFieldCompletionState } from '@/types/api';

export type CardKind = BuilderNodeKind | 'day';

export type CardCapability =
  | 'select'
  | 'multiSelect'
  | 'expand'
  | 'drag'
  | 'reorder'
  | 'delete'
  | 'lock'
  | 'readiness'
  | 'density'
  | 'fieldIndicators';

export type MovementAxis = 'horizontal' | 'vertical' | 'free' | 'none';
export type ReadinessState = 'ready' | 'blocked' | 'incomplete' | 'empty';
export type ReadinessSource = 'self' | 'children' | 'fields' | 'derived';

export interface FieldIndicator {
  id: string;
  label: string;
  field: string;
  state: ApiFieldCompletionState;
  required: boolean;
}

export interface CardEffectsConfig {
  showDropGlow: boolean;
  showSelectionScale: boolean;
  showSelectionCorners: boolean;
  noBackground?: boolean;
  glassBorderReady?: string;
  glassBorderIncomplete?: string;
  glassBorderBlocked?: string;
}

export interface CardConfig {
  kind: CardKind;
  capabilities: CardCapability[];
  movement: {
    axis: MovementAxis;
    container: 'board' | 'phase' | 'action' | 'timeline' | 'none';
  };
  indicators: string[];
  readinessSource: ReadinessSource;
  templateId: string;
  effects: CardEffectsConfig;
}

import type { TaskCardData, ActionCardData, PhaseNodeData } from './builder-node.types';

export interface DayDraft {
  id: string;
  label: string;
  dateString: string;
  kind: 'day';
  notes?: string;
}

export type EditorDraftData = TaskCardData | ActionCardData | PhaseNodeData | DayDraft;

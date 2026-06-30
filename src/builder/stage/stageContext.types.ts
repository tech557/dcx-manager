import type { Dispatch, SetStateAction } from 'react';
import type { CardKind } from '@/types/card.types';
import type { StageContext, StagePosition, ViewKind } from '@/types/stage.types';

type TimelineSubView = 'weekly' | 'monthly' | 'matrix';
type PendingViewAction = { type: 'view'; payload: ViewKind };
type PendingSelectAction = { type: 'select'; payload: string[] };
type PendingFocusAction = { type: 'focus'; payload: string | null };

export type PendingAction = PendingViewAction | PendingSelectAction | PendingFocusAction;

export interface StageContextValue extends StageContext {
  setView: (view: ViewKind) => void;
  setSelectedNodeIds: (selectedNodeIds: string[]) => void;
  setFocusedNodeId: (focusedNodeId: string | null) => void;
  setExpandedNodeIds: Dispatch<SetStateAction<string[]>>;
  isPresentationActive: boolean;
  enterPresentationMode: (selectedId: string) => void;
  exitPresentationMode: () => void;
  isolatedNodeIds: string[] | null;
  setIsolatedNodeIds: (ids: string[] | null) => void;
  setPosition: (position: StagePosition) => void;
  isEditorOpen: boolean;
  setIsEditorOpen: (open: boolean) => void;
  recentlyEditedIds: string[];
  markAsRecentlyEdited: (id: string) => void;
  receivingChildId: string | null;
  setReceivingChildId: (id: string | null) => void;
  pendingAction: PendingAction | null;
  setPendingAction: (action: PendingAction | null) => void;
  activeWeek: number;
  setActiveWeek: Dispatch<SetStateAction<number>>;
  prevWeek: () => void;
  nextWeek: () => void;
  rescheduleTask: (taskId: string, targetWeek: number, targetDay: number) => void;
  totalWeeks: number;
  setTotalWeeks: Dispatch<SetStateAction<number>>;
  activeSubView: TimelineSubView;
  setActiveSubView: (subView: TimelineSubView) => void;
  isDragging: boolean;
  draggedNodeKind: CardKind | null;
  draggedNodeId: string | null;
  setDraggingState: (dragging: boolean, kind: CardKind | null, id: string | null) => void;
}

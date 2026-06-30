import type { EditorDraftData } from '@/types/editor.types';

export interface DraftState {
  draftData: EditorDraftData | null;
  isEditorDirty: boolean;
}

export type DraftAction =
  | { type: 'load'; draftData: EditorDraftData | null; isEditorDirty: boolean }
  | { type: 'update'; draftData: EditorDraftData }
  | { type: 'dirty'; isEditorDirty: boolean };

export function draftReducer(state: DraftState, action: DraftAction): DraftState {
  if (action.type === 'load') {
    return { draftData: action.draftData, isEditorDirty: action.isEditorDirty };
  }
  if (action.type === 'update') {
    return { draftData: action.draftData, isEditorDirty: true };
  }
  return { ...state, isEditorDirty: action.isEditorDirty };
}

import { create } from 'zustand';
import type { BuilderNode } from '@/types/builder-node.types';
import type { EditorDraftData } from '@/types/editor.types';

export type SaveStatus = 'idle' | 'dirty' | 'saving' | 'saved' | 'error';

export interface EditorSession {
  taskId: string;
  isMinimized: boolean;
  hasDraft: boolean;
  openedAt: number;
  draftData: EditorDraftData;
  activeTab: 'info' | 'channel' | 'specs' | 'subtasks';
}

interface BuilderStoreState {
  nodes: BuilderNode[];
  isLocked: boolean;
  saveStatus: SaveStatus;
  saveError: string | null;
  recentlyCreatedIds: string[];
  sessions: EditorSession[];
  activeTaskId: string | null;
  setNodes: (nodes: BuilderNode[]) => void;
  updateNodes: (updater: (nodes: BuilderNode[]) => BuilderNode[]) => void;
  setLocked: (isLocked: boolean) => void;
  setSaveStatus: (status: SaveStatus, error?: string | null) => void;
  addRecentlyCreatedId: (id: string) => void;
  clearRecentlyCreatedIds: () => void;
  openSession: (taskId: string, initialData: EditorDraftData) => void;
  minimizeSession: (taskId: string) => void;
  closeSession: (taskId: string) => void;
  switchSession: (taskId: string) => void;
  updateDraft: (taskId: string, draftData: EditorDraftData) => void;
  saveSession: (taskId: string) => void;
  discardSessionDraft: (taskId: string, initialData: EditorDraftData) => void;
  reset: () => void;
}

const initialState = {
  nodes: [],
  isLocked: false,
  saveStatus: 'idle' as SaveStatus,
  saveError: null,
  recentlyCreatedIds: [] as string[],
  sessions: [] as EditorSession[],
  activeTaskId: null as string | null,
};

export const useBuilderStore = create<BuilderStoreState>((set) => ({
  ...initialState,
  setNodes: (nodes) => set({ nodes, saveStatus: 'dirty', saveError: null }),
  updateNodes: (updater) =>
    set((state) => ({
      nodes: updater(state.nodes),
      saveStatus: 'dirty',
      saveError: null,
    })),
  setLocked: (isLocked) => set({ isLocked }),
  setSaveStatus: (saveStatus, saveError = null) => set({ saveStatus, saveError }),
  addRecentlyCreatedId: (id) =>
    set((state) => ({
      recentlyCreatedIds: [...state.recentlyCreatedIds, id],
    })),
  clearRecentlyCreatedIds: () => set({ recentlyCreatedIds: [] }),
  openSession: (taskId, initialData) =>
    set((state) => {
      const exists = state.sessions.find((s) => s.taskId === taskId);
      if (exists) {
        return {
          sessions: state.sessions.map((s) =>
            s.taskId === taskId ? { ...s, isMinimized: false } : s
          ),
          activeTaskId: taskId,
        };
      }
      const newSession: EditorSession = {
        taskId,
        isMinimized: false,
        hasDraft: false,
        openedAt: Date.now(),
        draftData: JSON.parse(JSON.stringify(initialData)),
        activeTab: 'info',
      };
      return {
        sessions: [...state.sessions, newSession],
        activeTaskId: taskId,
      };
    }),
  minimizeSession: (taskId) =>
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.taskId === taskId ? { ...s, isMinimized: true } : s
      ),
      activeTaskId: state.activeTaskId === taskId ? null : state.activeTaskId,
    })),
  closeSession: (taskId) =>
    set((state) => ({
      sessions: state.sessions.filter((s) => s.taskId !== taskId),
      activeTaskId: state.activeTaskId === taskId ? null : state.activeTaskId,
    })),
  switchSession: (taskId) =>
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.taskId === taskId ? { ...s, isMinimized: false } : s
      ),
      activeTaskId: taskId,
    })),
  updateDraft: (taskId, draftData) =>
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.taskId === taskId ? { ...s, draftData, hasDraft: true } : s
      ),
    })),
  saveSession: (taskId) =>
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.taskId === taskId ? { ...s, hasDraft: false } : s
      ),
    })),
  discardSessionDraft: (taskId, initialData) =>
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.taskId === taskId
          ? {
              ...s,
              draftData: JSON.parse(JSON.stringify(initialData)),
              hasDraft: false,
            }
          : s
      ),
    })),
  reset: () => set(initialState),
}));

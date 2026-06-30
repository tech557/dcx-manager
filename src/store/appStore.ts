import { create } from 'zustand';
import type { ThemeMode } from '@/brand/tokens';
import type { ViewKind } from '@/types/stage.types';

interface AppStoreState {
  themeMode: ThemeMode;
  activeView: ViewKind;
  setThemeMode: (themeMode: ThemeMode) => void;
  setActiveView: (activeView: ViewKind) => void;
  reset: () => void;
}

const initialState = {
  themeMode: 'dark' as ThemeMode,
  activeView: 'kanban' as ViewKind,
};

export const useAppStore = create<AppStoreState>((set) => ({
  ...initialState,
  setThemeMode: (themeMode) => set({ themeMode }),
  setActiveView: (activeView) => set({ activeView }),
  reset: () => set(initialState),
}));

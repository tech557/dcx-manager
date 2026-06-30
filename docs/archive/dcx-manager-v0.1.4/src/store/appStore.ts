import { create } from "zustand";

interface AppState {
  isDark: boolean;
  setIsDark: (isDark: boolean) => void;
  toggleTheme: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  isDark: true, // Starts as dark mode by default
  setIsDark: (isDark) => set({ isDark }),
  toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
}));

import { colorTokens, type ThemeMode } from './tokens';

export interface ResolvedTheme {
  mode: ThemeMode;
  color: typeof colorTokens.dark | typeof colorTokens.light;
  accent: typeof colorTokens.accent;
  isDark: boolean;
}

export function resolveTheme(mode: ThemeMode): ResolvedTheme {
  return {
    mode,
    color: colorTokens[mode],
    accent: colorTokens.accent,
    isDark: mode === 'dark',
  };
}

export const lightTheme = resolveTheme('light');
export const darkTheme = resolveTheme('dark');

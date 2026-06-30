import { useEffect, useRef } from 'react';
import { useAppStore } from '@/store/appStore';
import type { ThemeMode } from '@/brand/tokens';
import {
  getFallbackPreferenceScope,
  getPreferenceKey,
  readPreference,
  writePreference,
  type PreferenceScope,
} from '@/utils/preference.helpers';

const THEME_MODE_PREFERENCE = 'theme-mode';

function isThemeMode(value: unknown): value is ThemeMode {
  return value === 'dark' || value === 'light';
}

export function applyThemeToDocument(themeMode: ThemeMode): void {
  document.documentElement.dataset.theme = themeMode;
  document.documentElement.classList.toggle('dark', themeMode === 'dark');
}

export function getThemePreferenceScope(versionId: string): PreferenceScope {
  return {
    ...getFallbackPreferenceScope(),
    versionId,
  };
}

export function readThemePreference(scope: PreferenceScope, fallback: ThemeMode): ThemeMode {
  const storedMode = readPreference<unknown>(scope, THEME_MODE_PREFERENCE, fallback);
  return isThemeMode(storedMode) ? storedMode : fallback;
}

export function writeThemePreference(scope: PreferenceScope, themeMode: ThemeMode): void {
  writePreference(scope, THEME_MODE_PREFERENCE, themeMode);
}

export function useTheme(preferenceScope?: PreferenceScope) {
  const themeMode = useAppStore((state) => {
    return state.themeMode;
  });
  const setThemeMode = useAppStore((state) => state.setThemeMode);
  const scopeKey = preferenceScope ? getPreferenceKey(preferenceScope, THEME_MODE_PREFERENCE) : null;
  const hydratedScopeRef = useRef<string | null>(null);

  useEffect(() => {
    if (!preferenceScope || !scopeKey) {
      applyThemeToDocument(themeMode);
      return;
    }

    if (hydratedScopeRef.current !== scopeKey) {
      hydratedScopeRef.current = scopeKey;
      const storedMode = readThemePreference(preferenceScope, themeMode);
      if (storedMode !== themeMode) {
        applyThemeToDocument(storedMode);
        setThemeMode(storedMode);
        return;
      }
    }

    applyThemeToDocument(themeMode);
    writeThemePreference(preferenceScope, themeMode);
  }, [preferenceScope, scopeKey, setThemeMode, themeMode]);

  return {
    isDark: themeMode === 'dark',
    themeMode,
  };
}

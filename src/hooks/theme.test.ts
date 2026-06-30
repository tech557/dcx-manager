import { beforeEach, describe, expect, it } from 'vitest';
import type { ThemeMode } from '@/brand/tokens';
import {
  applyThemeToDocument,
  getThemePreferenceScope,
  readThemePreference,
  writeThemePreference,
} from './useTheme';

describe('theme preferences', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.classList.remove('dark');
  });

  it('applies the selected theme to the document dataset and class list', () => {
    applyThemeToDocument('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    applyThemeToDocument('light');
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('persists theme mode by local user/version scope', () => {
    const versionOneScope = getThemePreferenceScope('v-1');
    const versionTwoScope = getThemePreferenceScope('v-2');

    writeThemePreference(versionOneScope, 'light');
    writeThemePreference(versionTwoScope, 'dark');

    expect(readThemePreference(versionOneScope, 'dark')).toBe<ThemeMode>('light');
    expect(readThemePreference(versionTwoScope, 'light')).toBe<ThemeMode>('dark');
  });

  it('falls back when stored preference data is invalid', () => {
    const scope = getThemePreferenceScope('v-1');
    localStorage.setItem('dcx-manager:local-user:local-dcx:v-1:theme-mode', JSON.stringify('sepia'));

    expect(readThemePreference(scope, 'dark')).toBe<ThemeMode>('dark');
  });
});

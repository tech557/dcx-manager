import { getBrowserStorage } from './browser-storage.helpers';

export interface PreferenceScope {
  userId: string;
  dcxId: string;
  versionId: string;
}

export function getPreferenceKey(scope: PreferenceScope, preferenceName: string): string {
  return ['dcx-manager', scope.userId, scope.dcxId, scope.versionId, preferenceName].join(':');
}

export function readPreference<T>(scope: PreferenceScope, preferenceName: string, fallback: T): T {
  const rawValue = getBrowserStorage()?.getItem(getPreferenceKey(scope, preferenceName));
  if (!rawValue) {
    return fallback;
  }

  try {
    return JSON.parse(rawValue) as T;
  } catch {
    return fallback;
  }
}

export function writePreference<T>(scope: PreferenceScope, preferenceName: string, value: T): void {
  getBrowserStorage()?.setItem(getPreferenceKey(scope, preferenceName), JSON.stringify(value));
}

export function clearPreference(scope: PreferenceScope, preferenceName: string): void {
  getBrowserStorage()?.removeItem(getPreferenceKey(scope, preferenceName));
}

/**
 * Provide a safe fallback PreferenceScope for UI components when no real scope is available.
 * This is intentionally conservative and local-only (useful for dev/local UIs).
 */
export function getFallbackPreferenceScope(): PreferenceScope {
  return { userId: 'local-user', dcxId: 'local-dcx', versionId: 'v-1' };
}

const storagePrefix = 'dcx-manager:v0.3.5-dev:mock';

function getMockStorageKey(key: string): string {
  return `${storagePrefix}:${key}`;
}

function getBrowserStorage(): Storage | null {
  if (typeof globalThis === 'undefined' || !('localStorage' in globalThis)) {
    return null;
  }

  return globalThis.localStorage;
}

export function readMockStore<T>(key: string, fallback: T): T {
  const storage = getBrowserStorage();
  const rawValue = storage?.getItem(getMockStorageKey(key));

  if (!rawValue) {
    return fallback;
  }

  try {
    return JSON.parse(rawValue) as T;
  } catch {
    return fallback;
  }
}

export function writeMockStore<T>(key: string, value: T): T {
  const storage = getBrowserStorage();
  storage?.setItem(getMockStorageKey(key), JSON.stringify(value));
  return value;
}

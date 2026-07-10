/**
 * Wrapper around `window.localStorage` with try/catch + JSON serialization.
 *
 * Private browsing, disabled storage, and quota-exceeded contexts must not throw
 * uncaught — modules that persist preferences go through this helper.
 * See `.cursor/rules/30-scripts.mdc`.
 */

const STORAGE_NAMESPACE = 'vhskin:';

export const storageKey = (key: string): string => `${STORAGE_NAMESPACE}${key}`;

export const get = <T>(key: string, fallback: T): T => {
  try {
    const raw = window.localStorage.getItem(storageKey(key));
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

export const set = (key: string, value: unknown): boolean => {
  try {
    window.localStorage.setItem(storageKey(key), JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

export const remove = (key: string): boolean => {
  try {
    window.localStorage.removeItem(storageKey(key));
    return true;
  } catch {
    return false;
  }
};

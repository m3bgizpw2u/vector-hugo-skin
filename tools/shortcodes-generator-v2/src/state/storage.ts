// localStorage try/catch wrapper. Phase 2's Zustand persist middleware calls this.

const NS = 'vhskin:scg:v2';

export function loadJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(`${NS}:${key}`);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function saveJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(`${NS}:${key}`, JSON.stringify(value));
  } catch {
    // localStorage may be unavailable (private browsing, file://)
  }
}

export function removeKey(key: string): void {
  try {
    localStorage.removeItem(`${NS}:${key}`);
  } catch {
    // ignore
  }
}

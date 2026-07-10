// Stub — implementation lands in Phase 6. See .cursor/rules/30-scripts.mdc.
// localStorage try/catch wrapper per 30-scripts.mdc.
export const safeGet = (key: string): string | null => {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

export const safeSet = (key: string, value: string): void => {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // private browsing / storage-disabled — silently ignore
  }
};

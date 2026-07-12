// Settings — wires the format and theme selectors to state.

import { getState, setFormat, setTheme } from './state.js';

export function initFormat(): void {
  const sel = document.getElementById('format-select') as HTMLSelectElement | null;
  if (!sel) return;
  sel.value = getState().format;
  sel.addEventListener('change', () => {
    if (sel.value === 'vertical' || sel.value === 'compact') {
      setFormat(sel.value);
    }
  });
}

export function initTheme(): void {
  const sel = document.getElementById('theme-select') as HTMLSelectElement | null;
  if (!sel) return;
  sel.value = getState().theme;
  sel.addEventListener('change', () => {
    if (sel.value === 'light' || sel.value === 'dark') {
      setTheme(sel.value);
    }
  });
}

export function getFormat(): 'vertical' | 'compact' {
  return getState().format;
}

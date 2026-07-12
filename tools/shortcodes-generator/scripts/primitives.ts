// Inner-primitives view toggle.
//
// The header has a single "Inner primitives" button that flips between
// named-wrapper mode and primitive-only mode. When in primitive mode,
// the picker filters to the 12 infobox-* entries (per data/<slug>.yaml
// with category: primitives).

import { getState, setMode } from './state.js';
import { renderPicker } from './picker.js';

export function initPrimitivesToggle(): void {
  const btn = document.getElementById('primitives-toggle');
  if (!btn) return;
  const state = getState();
  if (state.mode === 'primitives') btn.classList.add('is-active');
  btn.addEventListener('click', () => {
    const cur = getState();
    setMode(cur.mode === 'primitives' ? 'named' : 'primitives');
    btn.classList.toggle('is-active', getState().mode === 'primitives');
    renderPicker();
  });
}

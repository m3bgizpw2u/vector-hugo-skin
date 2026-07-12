// Preview pane — switches between Source and Rendered tabs.
// Source shows the generated shortcode string; Rendered shows a tiny
// DOM tree built by renderer.ts that mirrors the infobox CSS hooks
// from docs/SHORTCODES.md §6.

import { getState, setActiveTab } from './state.js';
import { generate } from './generator.js';
import { renderInfobox } from './renderer.js';

export function initPreview(): void {
  // Restored active tab from state.
  switchTab(getState().activeTab);
}

export function switchTab(tab: 'source' | 'rendered'): void {
  setActiveTab(tab);
  document.querySelectorAll<HTMLButtonElement>('.tool-preview__tab').forEach((btn) => {
    const active = btn.dataset.tab === tab;
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-selected', String(active));
  });
  const source = document.getElementById('preview-source');
  const rendered = document.getElementById('preview-rendered');
  if (source && rendered) {
    source.classList.toggle('is-active', tab === 'source');
    source.hidden = tab !== 'source';
    rendered.hidden = tab !== 'rendered';
  }
  renderPreview();
}

export function renderPreview(): void {
  const source = document.getElementById('preview-source');
  const rendered = document.getElementById('preview-rendered');
  if (!source || !rendered) return;

  const generated = generate();
  source.textContent = generated || '— pick a shortcode to see output —';

  const state = getState();
  const spec = state.catalog.find((s) => s.slug === state.selectedSlug);
  if (!spec) {
    rendered.innerHTML = '<p class="infobox-empty">— pick a shortcode —</p>';
    return;
  }
  rendered.innerHTML = '';
  const node = renderInfobox(spec);
  rendered.appendChild(node);
}

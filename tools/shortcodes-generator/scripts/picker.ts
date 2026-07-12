// Left-pane picker: search box + categorized shortcode list.
//
// Renders the catalog grouped by `category:`. Click selects a slug,
// which fires the onPick callback wired up in main.ts.

import { getState, setSelectedSlug, setCatalog } from './state.js';
import type { ShortcodeSpec } from './types.js';

const PICKER_LIST_ID = 'picker-list';
const PICKER_SEARCH_ID = 'picker-search';

let onPick: ((slug: string) => void) | null = null;

export function initPicker(
  catalog: ShortcodeSpec[],
  pickHandler: (slug: string) => void
): void {
  onPick = pickHandler;
  setCatalog(catalog);
  renderPicker();
  wireSearch();
}

export function selectShortcode(slug: string): void {
  setSelectedSlug(slug);
  renderPicker(); // refresh active state
}

export function getSelectedSlug(): string | null {
  return getState().selectedSlug;
}

export function renderPicker(): void {
  const list = document.getElementById(PICKER_LIST_ID);
  if (!list) return;
  const state = getState();
  const visible = filterAndSort(state.catalog, state.mode);
  list.innerHTML = '';

  if (visible.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'tool-picker__empty';
    empty.textContent = 'No shortcodes match your search.';
    list.appendChild(empty);
    return;
  }

  const byCategory = new Map<string, ShortcodeSpec[]>();
  for (const sc of visible) {
    if (!byCategory.has(sc.category)) byCategory.set(sc.category, []);
    byCategory.get(sc.category)!.push(sc);
  }

  const categoryOrder = [
    'biography',
    'geography',
    'history',
    'media',
    'organization',
    'politics',
    'sports',
    'tech',
    'primitives',
    'other',
  ];
  const sortedCategories = Array.from(byCategory.keys()).sort((a, b) => {
    const ai = categoryOrder.indexOf(a);
    const bi = categoryOrder.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  for (const cat of sortedCategories) {
    const group = document.createElement('div');
    group.className = 'tool-picker__group';
    const title = document.createElement('h3');
    title.className = 'tool-picker__group-title';
    title.textContent = titleCase(cat);
    group.appendChild(title);
    const ul = document.createElement('ul');
    ul.className = 'tool-picker__items';
    for (const sc of byCategory.get(cat)!) {
      const li = document.createElement('li');
      li.className = 'tool-picker__item';
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tool-picker__button';
      if (sc.slug === state.selectedSlug) btn.classList.add('is-active');
      btn.textContent = sc.title;
      btn.dataset.slug = sc.slug;
      btn.addEventListener('click', () => onPick?.(sc.slug));
      li.appendChild(btn);
      ul.appendChild(li);
    }
    group.appendChild(ul);
    list.appendChild(group);
  }
}

function wireSearch(): void {
  const search = document.getElementById(PICKER_SEARCH_ID) as HTMLInputElement | null;
  if (!search) return;
  search.value = '';
  search.addEventListener('input', () => {
    renderPicker();
  });
}

function filterAndSort(
  catalog: ShortcodeSpec[],
  mode: 'named' | 'primitives'
): ShortcodeSpec[] {
  const searchEl = document.getElementById(PICKER_SEARCH_ID) as HTMLInputElement | null;
  const query = (searchEl?.value ?? '').trim().toLowerCase();
  const filtered = catalog.filter((sc) => {
    const isPrimitive = sc.category === 'primitives';
    if (mode === 'primitives' && !isPrimitive) return false;
    if (mode === 'named' && isPrimitive) return false;
    if (!query) return true;
    return (
      sc.slug.toLowerCase().includes(query) ||
      sc.title.toLowerCase().includes(query) ||
      sc.description.toLowerCase().includes(query)
    );
  });
  return filtered.sort((a, b) => a.title.localeCompare(b.title));
}

function titleCase(s: string): string {
  return s
    .split(/[\s_-]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

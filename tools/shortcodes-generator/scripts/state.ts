// Central state store with localStorage sync.
//
// State shape:
//   {
//     catalog: ShortcodeSpec[]   — every loaded YAML
//     selectedSlug: string|null  — currently picked shortcode
//     mode: 'named' | 'primitives'
//     values: Record<slug, Record<key, FieldValue>>   — per-shortcode form drafts
//     format: 'vertical' | 'compact'                   — preview format
//     theme: 'light' | 'dark'                          — UI theme override
//     activeTab: 'source' | 'rendered'                 — preview pane tab
//   }
//
// Persistence: every state mutation re-serialises the durable bits
// (selectedSlug, mode, values, format, theme, activeTab) into
// localStorage under one key so a refresh restores the user.

import type { ShortcodeSpec, FieldValue } from './types.js';

const STORAGE_KEY = 'vhskin:shortcodes-generator:v1';

export interface State {
  catalog: ShortcodeSpec[];
  selectedSlug: string | null;
  mode: 'named' | 'primitives';
  values: Record<string, Record<string, FieldValue>>;
  format: 'vertical' | 'compact';
  theme: 'light' | 'dark';
  activeTab: 'source' | 'rendered';
}

const state: State = {
  catalog: [],
  selectedSlug: null,
  mode: 'named',
  values: {},
  format: 'vertical',
  theme: 'light',
  activeTab: 'source',
};

type Listener = () => void;
const listeners = new Set<Listener>();

function notify(): void {
  for (const fn of listeners) fn();
  persist();
}

function persist(): void {
  try {
    const durable = {
      selectedSlug: state.selectedSlug,
      mode: state.mode,
      values: state.values,
      format: state.format,
      theme: state.theme,
      activeTab: state.activeTab,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(durable));
  } catch {
    // localStorage may be unavailable (private browsing, file://) — fail silently.
  }
}

function restore(): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw) as Partial<State>;
    if (data.selectedSlug !== undefined) state.selectedSlug = data.selectedSlug;
    if (data.mode) state.mode = data.mode;
    if (data.values) state.values = data.values;
    if (data.format) state.format = data.format;
    if (data.theme) state.theme = data.theme;
    if (data.activeTab) state.activeTab = data.activeTab;
  } catch {
    // ignore corrupt storage
  }
}

export function initState(): void {
  restore();
  applyTheme(state.theme);
  applyFormat(state.format);
}

export function getState(): Readonly<State> {
  return state;
}

export function subscribe(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function setCatalog(catalog: ShortcodeSpec[]): void {
  state.catalog = catalog;
  notify();
}

export function setSelectedSlug(slug: string | null): void {
  state.selectedSlug = slug;
  notify();
}

export function setMode(mode: 'named' | 'primitives'): void {
  state.mode = mode;
  // When switching modes, clear the current selection — the available
  // slugs are different in each mode.
  state.selectedSlug = null;
  notify();
}

export function getValuesFor(slug: string): Record<string, FieldValue> {
  return state.values[slug] ?? {};
}

export function setValueFor(slug: string, key: string, value: FieldValue): void {
  if (!state.values[slug]) state.values[slug] = {};
  state.values[slug][key] = value;
  notify();
}

export function resetValuesFor(slug: string): void {
  state.values[slug] = {};
  notify();
}

export function setFormat(format: 'vertical' | 'compact'): void {
  state.format = format;
  applyFormat(format);
  notify();
}

export function setTheme(theme: 'light' | 'dark'): void {
  state.theme = theme;
  applyTheme(theme);
  notify();
}

export function setActiveTab(tab: 'source' | 'rendered'): void {
  state.activeTab = tab;
  notify();
}

function applyTheme(theme: 'light' | 'dark'): void {
  document.documentElement.setAttribute('data-theme', theme);
}

function applyFormat(_format: 'vertical' | 'compact'): void {
  // Format only affects generated output; no DOM side effect needed here.
  // The generator.ts reads state.format directly.
}

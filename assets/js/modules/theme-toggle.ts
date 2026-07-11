/**
 * Derived from mediawiki-skins-Vector @ 7c224883 (REL1_42, 2025-06-12),
 * file: resources/skins.vector.js/watchstar.js
 * Original (c) Wikimedia Foundation and contributors, GPL-2.0-or-later.
 * This file: GPL-2.0-or-later.
 * Header per docs/PORT-MAP-CONVENTIONS.md §A.
 */
/**
 * Theme toggle — cycles light → dark → auto on click.
 *
 * One behavior only: the segmented button group (`.theme-toggle` containing
 * `[data-theme-value]` buttons) advances the active mode and persists it.
 * The CSS side (custom-property swap) is keyed off `data-theme` on the
 * `<html>` element — see `assets/css/themes/`.
 *
 * Persisted via `utils/storage`. Auto mode respects
 * `window.matchMedia('(prefers-color-scheme: dark)')` and re-applies the
 * appropriate concrete theme when the system preference changes while no
 * manual override exists.
 */

import { addClass, q, qAll, removeClass } from '../utils/dom';
import { get, set } from '../utils/storage';

const STORAGE_KEY = 'theme';
const THEMES = ['light', 'dark', 'auto'] as const;
type Theme = (typeof THEMES)[number];

const isTheme = (value: unknown): value is Theme =>
  typeof value === 'string' && (THEMES as readonly string[]).includes(value);

const systemPrefersDark = (): boolean =>
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-color-scheme: dark)').matches;

const resolveAutoTheme = (): 'light' | 'dark' =>
  systemPrefersDark() ? 'dark' : 'light';

const applyTheme = (theme: Theme): void => {
  const concrete = theme === 'auto' ? resolveAutoTheme() : theme;
  document.documentElement.setAttribute('data-theme', concrete);
  document.documentElement.setAttribute('data-theme-mode', theme);
};

const highlightActive = (group: HTMLElement, active: Theme): void => {
  const options = qAll<HTMLElement>('[data-theme-value]', group);
  for (const option of options) {
    const value = option.getAttribute('data-theme-value');
    const isActive = value === active;
    option.setAttribute('aria-pressed', String(isActive));
    option.setAttribute('tabindex', isActive ? '0' : '-1');
  }
};

const watchSystemPreference = (group: HTMLElement): MediaQueryList | null => {
  if (typeof window.matchMedia !== 'function') return null;
  const mql = window.matchMedia('(prefers-color-scheme: dark)');
  mql.addEventListener('change', () => {
    if (
      document.documentElement.getAttribute('data-theme-mode') === 'auto'
    ) {
      applyTheme('auto');
      highlightActive(group, 'auto');
    }
  });
  return mql;
};

export const init = (): void => {
  const group = q<HTMLElement>('.theme-toggle');
  if (!group) return;

  const stored = get<unknown>(STORAGE_KEY, null);
  const initial: Theme = isTheme(stored) ? stored : 'auto';

  applyTheme(initial);
  highlightActive(group, initial);
  watchSystemPreference(group);

  const options = qAll<HTMLElement>('[data-theme-value]', group);
  for (const option of options) {
    const value = option.getAttribute('data-theme-value');
    if (!isTheme(value)) continue;
    option.addEventListener('click', () => {
      addClass(option, 'is-active');
      applyTheme(value);
      highlightActive(group, value);
      set(STORAGE_KEY, value);
      window.setTimeout(() => removeClass(option, 'is-active'), 150);
    });
  }
};

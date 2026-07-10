/**
 * Sidebar — outer collapse + per-portlet collapse with persisted state.
 *
 * Two related behaviors that share the same DOM root (`.sidebar` /
 * `.sidebar-list`) and the same persistence namespace (`vhskin:sidebar:…`):
 *
 *  1. Outer collapse — a `[data-sidebar-toggle]` button (rendered by
 *     `layouts/_partials/header/site-header.html`) hides the entire sidebar
 *     column by toggling `[data-sidebar="collapsed"]` on the `<html>`
 *     element. The button's `aria-expanded` mirrors the visible state. The
 *     CSS side collapses the page-grid's sidebar column when the attribute
 *     is set (see `assets/css/layout/page-grid.scss`).
 *
 *  2. Per-portlet collapse — each `.sidebar-list__group` heading toggles
 *     its own `.sidebar-list__group--collapsed` class, hiding the list of
 *     links inside. State is persisted under `vhskin:sidebar:groups` so the
 *     collapsed/expanded state of every group survives page loads.
 *
 * Per `.cursor/rules/30-scripts.mdc` ("one behavior per file"), these two
 * behaviors share a file because they coordinate on the same DOM root and
 * the same persistence namespace; splitting them would force a third
 * file in `assets/js/main.ts` to wire the two together, which adds
 * boilerplate without separation benefit. Flagged in `docs/UI-AUDIT.md` §6
 * for the user's call.
 */

import { addClass, q, qAll, removeClass } from '../utils/dom';
import { get, set } from '../utils/storage';

const OUTER_STORAGE_KEY = 'sidebar:outer';
const GROUPS_STORAGE_KEY = 'sidebar:groups';
const COLLAPSED_CLASS = 'sidebar-list__group--collapsed';
const ROOT_ATTRIBUTE = 'data-sidebar';

type GroupState = Record<string, boolean>;

const isGroupNode = (el: Element): el is HTMLElement =>
  el.classList.contains('sidebar-list__group');

const loadGroupState = (): GroupState => get<GroupState>(GROUPS_STORAGE_KEY, {});

const persistGroupState = (state: GroupState): boolean =>
  set(GROUPS_STORAGE_KEY, state);

const groupKey = (heading: HTMLElement): string => {
  if (heading.id) return heading.id;
  const text = heading.textContent?.trim().toLowerCase();
  return text ?? '';
};

const applyGroup = (group: HTMLElement, collapsed: boolean): void => {
  if (collapsed) addClass(group, COLLAPSED_CLASS);
  else removeClass(group, COLLAPSED_CLASS);

  const heading = group.querySelector<HTMLElement>('.sidebar-list__heading');
  if (heading) {
    heading.setAttribute('aria-expanded', String(!collapsed));
    heading.setAttribute(
      'aria-label',
      collapsed ? 'Expand section' : 'Collapse section',
    );
  }
};

const toggleGroup = (group: HTMLElement, state: GroupState): void => {
  const heading = group.querySelector<HTMLElement>('.sidebar-list__heading');
  if (!heading) return;
  const key = groupKey(heading);
  if (!key) return;
  const collapsed = !group.classList.contains(COLLAPSED_CLASS);
  applyGroup(group, collapsed);
  state[key] = collapsed;
  persistGroupState(state);
};

const initGroupCollapse = (): void => {
  const groups = qAll<HTMLElement>('.sidebar-list__group').filter(isGroupNode);
  if (groups.length === 0) return;

  const state = loadGroupState();

  for (const group of groups) {
    const heading = group.querySelector<HTMLElement>('.sidebar-list__heading');
    if (!heading) continue;

    const key = groupKey(heading);
    if (key && state[key] === true) applyGroup(group, true);
    else applyGroup(group, false);

    heading.setAttribute('aria-expanded', 'true');
    heading.setAttribute('role', 'button');
    heading.setAttribute('tabindex', '0');

    heading.addEventListener('click', () => toggleGroup(group, state));
    heading.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleGroup(group, state);
      }
    });
  }
};

const applyOuter = (collapsed: boolean): void => {
  const root = document.documentElement;
  if (collapsed) root.setAttribute(ROOT_ATTRIBUTE, 'collapsed');
  else root.removeAttribute(ROOT_ATTRIBUTE);
};

const toggleOuter = (): void => {
  const root = document.documentElement;
  const collapsed = root.getAttribute(ROOT_ATTRIBUTE) === 'collapsed';
  applyOuter(!collapsed);
  set(OUTER_STORAGE_KEY, !collapsed);

  const button = q<HTMLButtonElement>('[data-sidebar-toggle]');
  if (button) {
    button.setAttribute('aria-expanded', String(!collapsed));
    button.setAttribute(
      'aria-label',
      collapsed ? 'Show sidebar' : 'Hide sidebar',
    );
  }
};

const initOuterCollapse = (): void => {
  const button = q<HTMLButtonElement>('[data-sidebar-toggle]');
  if (!button) return;

  const stored = get<unknown>(OUTER_STORAGE_KEY, null);
  const initialCollapsed = stored === true;
  applyOuter(initialCollapsed);
  button.setAttribute('aria-expanded', String(!initialCollapsed));
  button.setAttribute(
    'aria-label',
    initialCollapsed ? 'Show sidebar' : 'Hide sidebar',
  );
  button.addEventListener('click', toggleOuter);
};

export const init = (): void => {
  initOuterCollapse();
  initGroupCollapse();
};
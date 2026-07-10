/**
 * Sidebar list-group collapse/expand with persisted state.
 *
 * Each group is a `.sidebar-list__group` containing a `.sidebar-list__heading`
 * (the toggler) and `.sidebar-list__items` (the children that hide when collapsed).
 * One behavior only — portlet menu collapsing. The off-canvas drawer for narrow
 * viewports is a separate concern that Phase 7 may revisit.
 *
 * Persisted via `utils/storage` so the choice survives page loads; see
 * `.cursor/rules/30-scripts.mdc`.
 */

import { addClass, qAll, removeClass } from '../utils/dom';
import { get, set } from '../utils/storage';

const STORAGE_KEY = 'sidebar:groups';
const COLLAPSED_CLASS = 'sidebar-list__group--collapsed';

type GroupState = Record<string, boolean>;

const isGroupNode = (el: Element): el is HTMLElement =>
  el.classList.contains('sidebar-list__group');

const loadState = (): GroupState => get<GroupState>(STORAGE_KEY, {});

const persist = (state: GroupState): boolean => set(STORAGE_KEY, state);

const groupKey = (heading: HTMLElement): string => {
  if (heading.id) return heading.id;
  const text = heading.textContent?.trim().toLowerCase();
  return text ?? '';
};

const apply = (group: HTMLElement, collapsed: boolean): void => {
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

const toggle = (group: HTMLElement, state: GroupState): void => {
  const heading = group.querySelector<HTMLElement>('.sidebar-list__heading');
  if (!heading) return;
  const key = groupKey(heading);
  if (!key) return;
  const collapsed = !group.classList.contains(COLLAPSED_CLASS);
  apply(group, collapsed);
  state[key] = collapsed;
  persist(state);
};

export const init = (): void => {
  const groups = qAll<HTMLElement>('.sidebar-list__group').filter(isGroupNode);
  if (groups.length === 0) return;

  const state = loadState();

  for (const group of groups) {
    const heading = group.querySelector<HTMLElement>('.sidebar-list__heading');
    if (!heading) continue;

    const key = groupKey(heading);
    if (key && state[key] === true) apply(group, true);
    else apply(group, false);

    heading.setAttribute('aria-expanded', 'true');
    heading.setAttribute('role', 'button');
    heading.setAttribute('tabindex', '0');

    heading.addEventListener('click', () => toggle(group, state));
    heading.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggle(group, state);
      }
    });
  }
};

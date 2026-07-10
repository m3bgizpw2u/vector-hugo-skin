/**
 * Generic ARIA-compliant tab widget.
 *
 * One behavior only: `[role="tablist"]` elements are made into working tab
 * widgets. Click handlers, keyboard navigation (←/→/Home/End), and the
 * matching `aria-selected` / `aria-hidden` / `hidden` attribute toggling on
 * `[role="tab"]` and `[role="tabpanel"]` are scoped to each tablist so
 * multiple tab widgets on the page work independently.
 *
 * Markup contract — every `[role="tab"]` has:
 *   - `id` and `aria-controls="<panel-id>"`
 *   - `aria-selected="true|false"`
 *   - `tabindex="-1"` for inactive tabs (roving tabindex)
 *
 * Every `[role="tabpanel"]` has:
 *   - `id` matching the controlling tab's `aria-controls`
 *   - `aria-labelledby="<tab-id>"`
 *   - `hidden` when not the active panel
 */

import { qAll } from '../utils/dom';

const TABLIST_SELECTOR = '[role="tablist"]';
const TAB_SELECTOR = '[role="tab"]';

type TabWidget = {
  list: HTMLElement;
  tabs: HTMLElement[];
  panels: Map<string, HTMLElement>;
};

const buildWidget = (list: HTMLElement): TabWidget | null => {
  const tabs = qAll<HTMLElement>(TAB_SELECTOR, list).filter(
    (tab): tab is HTMLElement => list.contains(tab),
  );
  if (tabs.length === 0) return null;

  const panels = new Map<string, HTMLElement>();
  for (const tab of tabs) {
    const panelId = tab.getAttribute('aria-controls');
    if (!panelId) continue;
    const panel = document.getElementById(panelId);
    if (panel && panel.getAttribute('role') === 'tabpanel') panels.set(tab.id, panel);
  }
  return { list, tabs, panels };
};

const selectTab = (widget: TabWidget, target: HTMLElement): void => {
  for (const tab of widget.tabs) {
    const isTarget = tab === target;
    tab.setAttribute('aria-selected', String(isTarget));
    tab.setAttribute('tabindex', isTarget ? '0' : '-1');
    const panel = widget.panels.get(tab.id);
    if (panel) {
      panel.hidden = !isTarget;
      panel.setAttribute('aria-hidden', String(!isTarget));
    }
  }
};

const indexOf = (tabs: HTMLElement[], target: HTMLElement): number =>
  tabs.indexOf(target);

const handleKeydown = (
  widget: TabWidget,
  event: KeyboardEvent,
  current: HTMLElement,
): void => {
  const tabs = widget.tabs;
  const total = tabs.length;
  if (total === 0) return;
  const currentIndex = indexOf(tabs, current);
  let nextIndex = currentIndex;

  switch (event.key) {
    case 'ArrowRight':
      nextIndex = (currentIndex + 1) % total;
      break;
    case 'ArrowLeft':
      nextIndex = (currentIndex - 1 + total) % total;
      break;
    case 'Home':
      nextIndex = 0;
      break;
    case 'End':
      nextIndex = total - 1;
      break;
    default:
      return;
  }

  event.preventDefault();
  const next = tabs[nextIndex];
  next.focus();
  selectTab(widget, next);
};

const initWidget = (widget: TabWidget): void => {
  for (const tab of widget.tabs) {
    tab.addEventListener('click', () => selectTab(widget, tab));
    tab.addEventListener('keydown', (event) =>
      handleKeydown(widget, event, tab),
    );
  }
  const initiallyActive =
    widget.tabs.find((tab) => tab.getAttribute('aria-selected') === 'true') ??
    widget.tabs[0];
  selectTab(widget, initiallyActive);
};

export const init = (): void => {
  const tablists = qAll<HTMLElement>(TABLIST_SELECTOR);
  for (const list of tablists) {
    const widget = buildWidget(list);
    if (widget) initWidget(widget);
  }
};

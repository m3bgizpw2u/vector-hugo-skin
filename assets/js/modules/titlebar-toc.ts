/**
 * Derived from mediawiki-skins-Vector @ 7c224883 (REL1_42, 2025-06-12),
 * file: resources/skins.vector.js/dropdownMenus.js
 * Original (c) Wikimedia Foundation and contributors, GPL-2.0-or-later.
 * This file: GPL-2.0-or-later.
 * Header per docs/PORT-MAP-CONVENTIONS.md §A.
 */
/**
 * Page-titlebar ToC dropdown — outside-click and Escape close affordances.
 *
 * One behavior only: when the checkbox-driven ToC dropdown (rendered by
 * `layouts/_partials/article/page-titlebar.html` and styled by
 * `assets/css/components/page-titlebar.scss`) is open, a click outside
 * `.page-titlebar-toc-landmark` or an Escape keypress unchecks the
 * checkbox. The CSS sibling selector (`:checked ~`) re-hides the panel;
 * this module just toggles the checkbox state.
 */
import { q } from '../utils/dom';

const CHECKBOX_ID = 'page-titlebar-toc-checkbox';
const LANDMARK_SELECTOR = '.page-titlebar-toc-landmark';

export const init = (): void => {
  const checkbox = q<HTMLInputElement>(`#${CHECKBOX_ID}`);
  if (!checkbox) return;
  const landmark = q(LANDMARK_SELECTOR);
  document.addEventListener('click', (event) => {
    if (!checkbox.checked) return;
    if (landmark && event.target instanceof Node && landmark.contains(event.target)) return;
    checkbox.checked = false;
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (!checkbox.checked) return;
    checkbox.checked = false;
  });
};

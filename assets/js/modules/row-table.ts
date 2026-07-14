/**
 * Original work, GPL-2.0-or-later.
 * Header per docs/PORT-MAP-CONVENTIONS.md §A.
 */
/**
 * row-table — progressive enhancement for the `{{< row-table >}}` shortcode.
 *
 * The base layout is fully static (pure HTML + CSS), so the default case
 * has no JS cost. The `variant="expandable"` opt-in adds a small
 * narrow-viewport interaction: on screens at or below the project's mobile
 * breakpoint, each row's text body is clamped to two lines and the user
 * can click / press Enter or Space to expand it.
 *
 * The module only does work for `.row-table[data-expandable="true"]`; the
 * early-return below means the default static case pays nothing.
 */
import { q, qAll } from '../utils/dom';

// Must match the SCSS `$rt-breakpoint` in
// assets/css/components/_row-table.scss and the documented mobile boundary
// in assets/css/base/_tokens.scss.
const MOBILE_BREAKPOINT_PX = 720;

const MOBILE_MEDIA_QUERY = `(max-width: ${MOBILE_BREAKPOINT_PX - 1}px)`;

const EXPANDABLE_SELECTOR = '.row-table[data-expandable="true"]';
const ROW_SELECTOR = '.row-table__row';
const TEXT_BODY_SELECTOR = '.row-table__text-body';

const clampBody = (body: HTMLElement): void => {
  body.style.display = '-webkit-box';
  body.style.webkitLineClamp = '2';
  body.style.webkitBoxOrient = 'vertical';
  body.style.overflow = 'hidden';
  body.setAttribute('data-clamped', 'true');
};

const releaseBody = (body: HTMLElement): void => {
  body.style.display = '';
  body.style.webkitLineClamp = '';
  body.style.webkitBoxOrient = '';
  body.style.overflow = '';
  body.setAttribute('data-clamped', 'false');
};

const isClamped = (body: HTMLElement): boolean =>
  body.getAttribute('data-clamped') === 'true';

const toggleRow = (row: HTMLElement): void => {
  const body = q<HTMLElement>(TEXT_BODY_SELECTOR, row);
  if (!body) return;
  if (isClamped(body)) {
    releaseBody(body);
    row.setAttribute('aria-expanded', 'true');
  } else {
    clampBody(body);
    row.setAttribute('aria-expanded', 'false');
  }
};

const handleRowClick = (row: HTMLElement, event: MouseEvent): void => {
  if (!window.matchMedia(MOBILE_MEDIA_QUERY).matches) return;
  event.preventDefault();
  toggleRow(row);
};

const handleRowKeydown = (
  row: HTMLElement,
  event: KeyboardEvent,
): void => {
  if (!window.matchMedia(MOBILE_MEDIA_QUERY).matches) return;
  if (event.key !== 'Enter' && event.key !== ' ') return;
  event.preventDefault();
  toggleRow(row);
};

const enableRow = (row: HTMLElement): void => {
  const body = q<HTMLElement>(TEXT_BODY_SELECTOR, row);
  if (!body) return;
  clampBody(body);
  row.setAttribute('role', 'button');
  row.setAttribute('tabindex', '0');
  row.setAttribute('aria-expanded', 'false');
  row.addEventListener('click', (e) => handleRowClick(row, e));
  row.addEventListener('keydown', (e) => handleRowKeydown(row, e));
};

const disableRow = (row: HTMLElement): void => {
  const body = q<HTMLElement>(TEXT_BODY_SELECTOR, row);
  if (body && isClamped(body)) releaseBody(body);
  row.removeAttribute('role');
  row.removeAttribute('tabindex');
  row.removeAttribute('aria-expanded');
  // Event listeners stay attached (cheaper than tracking + removing them)
  // but the matchMedia guard inside the handlers short-circuits them on
  // wide viewports, so the cost is one extra function call per click.
};

const initTable = (table: HTMLElement): void => {
  const rows = qAll<HTMLElement>(ROW_SELECTOR, table);
  if (rows.length === 0) return;

  const apply = (mobile: boolean): void => {
    for (const row of rows) {
      if (mobile) enableRow(row);
      else disableRow(row);
    }
  };

  const mq = window.matchMedia(MOBILE_MEDIA_QUERY);
  apply(mq.matches);
  mq.addEventListener('change', (event) => apply(event.matches));
};

export const init = (): void => {
  const tables = qAll<HTMLElement>(EXPANDABLE_SELECTOR);
  if (tables.length === 0) return;
  for (const table of tables) initTable(table);
};

/**
 * Sticky header — show/hide on scroll direction.
 *
 * One behavior only: the condensed header docks in once the user scrolls past
 * a small threshold and tucks back up on scroll-down, snaps back in view on
 * scroll-up. Edge cases:
 *  - At the very top of the page, always visible regardless of last direction.
 *  - At the very bottom of the page, always visible (so the user can still
 *    reach it after reading).
 *
 * Scroll handling is throttled via `utils/debounce.throttle` to avoid layout
 * thrash on every scroll event.
 */

import { addClass, q, removeClass } from '../utils/dom';
import { throttle } from '../utils/debounce';

const REVEAL_THRESHOLD_PX = 200;
const SCROLL_THROTTLE_MS = 100;

export const init = (): void => {
  const header = q<HTMLElement>('.sticky-header');
  if (!header) return;

  let lastY = window.scrollY;

  const atTop = (): boolean => window.scrollY <= REVEAL_THRESHOLD_PX;
  const atBottom = (): boolean =>
    window.innerHeight + window.scrollY >=
    document.documentElement.scrollHeight - 4;

  const update = (): void => {
    const currentY = window.scrollY;

    if (atTop() || atBottom()) {
      addClass(header, 'is-visible');
      removeClass(header, 'is-hidden');
      lastY = currentY;
      return;
    }

    if (currentY > lastY) {
      removeClass(header, 'is-visible');
      addClass(header, 'is-hidden');
    } else if (currentY < lastY) {
      addClass(header, 'is-visible');
      removeClass(header, 'is-hidden');
    }

    lastY = currentY;
  };

  const onScroll = throttle(() => update(), SCROLL_THROTTLE_MS);

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  addClass(header, 'is-visible');
};

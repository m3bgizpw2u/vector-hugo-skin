/**
 * Sticky header — condensed chrome shown once the user scrolls past the
 * primary header. Per docs/RESEARCH.md §12.2 (second-plan Phase 4
 * layout findings), the trigger is an IntersectionObserver on the
 * primary `.page-header`'s bottom edge rather than a fixed-scroll-
 * position threshold: Vector 2022's actual mechanism is
 * IntersectionObserver-based, which avoids the rAF/scroll-throttle
 * thrash on long pages (the previous scroll-direction delta
 * implementation accumulated a 200px "no-op zone" at the top of every
 * page, then jittered on the first real scroll event).
 *
 * The module's contract:
 *  - When the bottom edge of `.page-header` exits the viewport top, the
 *    `.sticky-header` becomes visible (added `.is-visible`,
 *    removed `.is-hidden`).
 *  - When the primary header is fully back in view (its bottom edge is
 *    at or below the viewport top), the condensed header is removed
 *    again.
 *  - At very top / very bottom of the page, the condensed header is
 *    visible so the chrome is reachable from anywhere except the first
 *    screenful (where the primary header already covers the same area).
 *    The SCSS default keeps the bar off-screen (`translateY(-100%)` /
 *    `opacity: 0`) until the IntersectionObserver scroll handler
 *    explicitly reveals it — unconditionally calling `setVisible(true)`
 *    on init used to stack the bar on top of the sticky primary header
 *    and create a visible overlap on first paint.
 *
 * The module is a quiet no-op if either element is missing (the
 * primary header is always present, but `.sticky-header` is optional —
 * some templates may not include it).
 */

import { addClass, q, removeClass } from '../utils/dom';

export const init = (): void => {
  const sticky = q<HTMLElement>('.sticky-header');
  const primary = q<HTMLElement>('.page-header');
  if (!sticky || !primary) return;

  const setVisible = (visible: boolean): void => {
    if (visible) {
      addClass(sticky, 'is-visible');
      removeClass(sticky, 'is-hidden');
    } else {
      removeClass(sticky, 'is-visible');
      addClass(sticky, 'is-hidden');
    }
  };

  // Sentinel: a 1px tall line placed at the bottom of the primary header.
  // Trigger the sticky once this sentinel leaves the top of the viewport;
  // collapse it back the moment the sentinel re-enters. Using a sentinel
  // element rather than observing the header itself avoids layout
  // observation limits when the header's height changes (e.g. wrapping
  // at sub-500px widths) and matches Vector's `ScrollObserver` pattern.
  const sentinel = document.createElement('div');
  sentinel.setAttribute('aria-hidden', 'true');
  sentinel.style.position = 'absolute';
  sentinel.style.top = '0';
  sentinel.style.left = '0';
  sentinel.style.width = '1px';
  sentinel.style.height = '100%';
  sentinel.style.pointerEvents = 'none';
  sentinel.style.visibility = 'hidden';
  primary.style.position = 'relative';
  primary.appendChild(sentinel);

  let observer: IntersectionObserver | null = null;
  let viewportState: 'top' | 'middle' | 'bottom' = 'top';

  const recompute = (): void => {
    if (viewportState === 'bottom') {
      setVisible(true);
      return;
    }
    const entry = observerState;
    setVisible(entry === 'intersecting');
  };

  let observerState: 'intersecting' | 'above' = 'intersecting';

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        observerState = entry.isIntersecting
          ? 'intersecting'
          : 'above';
      }
      recompute();
    },
    { rootMargin: '0px', threshold: 0 },
  );
  observer.observe(sentinel);

  // Track document-level scroll position for top/bottom edge cases the
  // observer doesn't see (e.g. very-short pages where the bottom edge
  // arrives before the sentinel ever crosses the threshold).
  let frame = 0;
  const onScroll = (): void => {
    if (frame) return;
    frame = window.requestAnimationFrame(() => {
      frame = 0;
      const doc = document.documentElement;
      const atTop = window.scrollY <= 4;
      const atBottom =
        window.innerHeight + window.scrollY >= doc.scrollHeight - 4;
      viewportState = atTop ? 'top' : atBottom ? 'bottom' : 'middle';
      recompute();
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  // Run one synchronous recompute so very-short pages (where the
  // observer may never fire a crossing event) get the right state on
  // first paint. `onScroll` reads `window.scrollY` and `scrollHeight`
  // which are valid immediately after script load.
  onScroll();
};

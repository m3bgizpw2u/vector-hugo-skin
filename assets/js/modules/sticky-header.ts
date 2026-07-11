/**
 * Derived from mediawiki-skins-Vector @ 7c224883 (REL1_42, 2025-06-12),
 * file: resources/skins.vector.js/stickyHeader.js
 * Original (c) Wikimedia Foundation and contributors, GPL-2.0-or-later.
 * This file: GPL-2.0-or-later.
 * Header per docs/PORT-MAP-CONVENTIONS.md §A.
 */
/**
 * Sticky header — condensed chrome shown once the user scrolls past the
 * primary header. Per docs/RESEARCH.md §12.2 (second-plan Phase 4
 * layout findings), the trigger is an IntersectionObserver on the
 * primary `.page-header`'s bottom edge rather than a fixed-scroll-
 * position threshold: Vector 2022's actual mechanism is
 * IntersectionObserver-based, which avoids the rAF/scroll-throttle
 * thrash on long pages.
 *
 * The module's contract:
 *  - When `.page-header` exits the viewport (its bottom edge crosses the
 *    top of the viewport), the `.sticky-header` becomes visible
 *    (`.is-visible` / no `.is-hidden`).
 *  - When the primary header is back in view (any pixel of it intersects
 *    the viewport), the condensed header is removed again.
 *  - At the very top and very bottom of the page, the condensed header
 *    is visible so the chrome is reachable from anywhere except the
 *    first screenful (where the primary header already covers the same
 *    area).
 *
 * The SCSS default keeps the bar off-screen (`translateY(-100%)` /
 * `opacity: 0`) until this module's IntersectionObserver scroll handler
 * explicitly reveals it.
 *
 * Earlier revisions placed a 1px sentinel inside `.page-header` at
 * `top: 0`, but because `.page-header` itself is `position: sticky;
 * top: 0`, the sentinel was glued to the viewport top forever —
 * `isIntersecting` was permanently `true` and the sticky bar was
 * revealed even when the primary header was fully visible, producing a
 * visible overlap on every page. The fix observes `.page-header`
 * directly: any non-zero intersection means the primary bar is in
 * viewport, so the sticky should be hidden. No sentinel element, no
 * inline `style.position` override on the primary header.
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

  let observerState: 'intersecting' | 'above' = 'intersecting';
  let viewportState: 'top' | 'middle' | 'bottom' = 'top';

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        observerState = entry.isIntersecting ? 'intersecting' : 'above';
      }
      recompute();
    },
    { rootMargin: '0px', threshold: 0 },
  );
  observer.observe(primary);

  const recompute = (): void => {
    if (viewportState === 'bottom') {
      setVisible(true);
      return;
    }
    if (viewportState === 'top') {
      setVisible(false);
      return;
    }
    setVisible(observerState === 'above');
  };

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
/**
 * Original work, GPL-2.0-or-later.
 * Header per docs/PORT-MAP-CONVENTIONS.md §A.
 */
/**
 * thumb — progressive enhancement for the shared image-rendering partial
 * (layouts/_partials/article/thumb.html). Every image-emitting shortcode
 * routes through that partial, so this module enhances images from the
 * `{{< thumb >}}`, `{{< figure >}}`, `{{< infobox-image >}}` and
 * `{{< row >}}` shortcodes uniformly.
 *
 * Two behaviors, both opt-in and both zero-cost when absent:
 *   1. Magnify affordance — a `.thumb[data-lightbox]` carries a
 *      `.thumb__magnify` button. Clicking (or pressing Enter/Space on) the
 *      button opens the existing lightbox overlay. The overlay itself lives
 *      in assets/js/modules/lightbox.ts and is reused verbatim: the button
 *      just re-dispatches the click onto the parent `.thumb` figure, which
 *      lightbox.ts already binds. No overlay/carousel/focus-trap code is
 *      duplicated here.
 *   2. Reveal — an IntersectionObserver adds `data-revealed="true"` on the
 *      figure when it scrolls into view, fading the magnify button in one
 *      frame after the image has settled. `prefers-reduced-motion: reduce`
 *      reveals everything immediately at init so nothing animates.
 *
 * The early-return below means pages without any lightbox-enabled thumb pay
 * nothing.
 */
import { qAll } from '../utils/dom';

const THUMB_LIGHTBOX_SELECTOR = '.thumb[data-lightbox]';
const MAGNIFY_SELECTOR = '.thumb__magnify';

const prefersReducedMotion = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// The button lives inside the figure that lightbox.ts binds. Re-dispatch a
// non-bubbling click on the figure so the existing overlay opens exactly
// once (the original button click is stopped before it bubbles).
const bindMagnify = (figure: HTMLElement): void => {
  const button = figure.querySelector<HTMLButtonElement>(MAGNIFY_SELECTOR);
  if (!button) return;

  button.addEventListener('click', (event) => {
    event.stopPropagation();
    event.preventDefault();
    figure.dispatchEvent(new MouseEvent('click', { bubbles: false }));
  });
};

const revealNow = (figure: HTMLElement): void => {
  figure.setAttribute('data-revealed', 'true');
};

const observeReveal = (figures: HTMLElement[]): void => {
  if (!('IntersectionObserver' in window)) {
    for (const figure of figures) revealNow(figure);
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        revealNow(entry.target as HTMLElement);
        obs.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -10% 0px' },
  );

  for (const figure of figures) observer.observe(figure);
};

export const init = (): void => {
  const figures = qAll<HTMLElement>(THUMB_LIGHTBOX_SELECTOR);
  if (figures.length === 0) return;

  for (const figure of figures) bindMagnify(figure);

  if (prefersReducedMotion()) {
    for (const figure of figures) revealNow(figure);
    return;
  }

  observeReveal(figures);
};

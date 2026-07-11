/**
 * Early theme application — runs before the page paints to avoid a
 * flash-of-wrong-theme (FOIT). Kept tiny on purpose; per
 * docs/RESEARCH.md §11.4 and the second-plan Phase 10 §2 contract,
 * it must apply the stored theme preference (light / dark / auto)
 * ahead of the stylesheet bundle's first paint.
 *
 * This file is referenced synchronously (without `defer`) from
 * `layouts/_default/baseof.html` so it executes before the body's
 * first render. It is kept as a separate asset (rather than an
 * inline `<script>` block in a Go template) to honor the project's
 * "no inline script inside templates" rule — see
 * `.cursor/rules/30-scripts.mdc` and `docs/ARCHITECTURE.md` §6.
 */
(function () {
  try {
    var stored = window.localStorage.getItem('theme');
    if (stored !== 'light' && stored !== 'dark' && stored !== 'auto') {
      stored = 'auto';
    }
    var concrete =
      stored === 'auto'
        ? window.matchMedia &&
          window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : stored;
    document.documentElement.setAttribute('data-theme', concrete);
    document.documentElement.setAttribute('data-theme-mode', stored);
  } catch (e) {
    /* private-mode or storage-disabled: leave data-theme unset (CSS
       defaults take over from themes/auto.scss's media query) */
  }
})();

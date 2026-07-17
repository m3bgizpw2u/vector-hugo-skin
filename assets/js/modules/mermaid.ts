/**
 * Mermaid diagram renderer — auto-renders every <pre class="mermaid"> block
 * on the page by delegating to the vendored Mermaid runtime
 * (static/js/mermaid/mermaid.min.js).
 *
 * The runtime is loaded via a <script type="module"> in layouts/_partials/footer/js.html
 * and exports a `mermaid` global (the ESM build does this by default).
 * This module calls mermaid.initialize() once, then mermaid.run() to transform
 * all .mermaid elements to SVG inline.
 *
 * Idioms supported:
 *   - Fenced ```mermaid code blocks in Markdown (Goldmark emits <pre class="mermaid">)
 *   - The {{< mermaid >}} paired shortcode (which also emits <pre class="mermaid">)
 *
 * One behavior only: idempotent init(). No DOM mutations beyond the runtime's own.
 */
let initialized = false;

export const init = (): void => {
  if (initialized) return;
  initialized = true;

  // The vendored ESM runtime exports a `mermaid` global; wait for it to exist.
  // Use requestAnimationFrame to defer past the script's own execution in case
  // this module's import runs first (the defer attribute on the runtime script
  // tag orders scripts, but a module's top-level runs synchronously before
  // any deferred scripts fire — so we need to wait for the global to appear).
  const tryRender = (): void => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mermaid = (window as unknown as Record<string, unknown>)['mermaid'];
    if (typeof mermaid !== 'object' || mermaid === null) {
      // Runtime not yet loaded; skip silently — graceful degradation leaves the
      // <pre class="mermaid"> as a raw text block.
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const api = mermaid as Record<string, (...args: unknown[]) => unknown>;
    if (typeof api.initialize === 'function' && typeof api.run === 'function') {
      void api.initialize({
        startOnLoad: false,
        securityLevel: 'loose',
        theme: 'default',
        // Explicit fontSize so mermaid calculates foreignObject dimensions with the
        // correct text size.  Without this, mermaid uses browser-default font metrics
        // before CSS is applied, producing tiny foreignObject containers.
        fontSize: 16,
      });
      // Clear data-processed so run() renders every diagram, not just unprocessed ones.
      for (const el of document.querySelectorAll('pre.mermaid')) {
        el.removeAttribute('data-processed');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (api.run as (...args: unknown[]) => Promise<unknown>)(
        { nodes: document.querySelectorAll('pre.mermaid') }
      ).then(() => {
        // Fix foreignObject dimensions that mermaid calculated with wrong font metrics.
        // Mermaid sets width/height attributes on foreignObject via setAttribute()
        // which can't be overridden by CSS.  It also sets inline height:100% on
        // inner divs which keeps them constrained to the too-small foreignObject
        // height.  Remove both so content auto-sizes to its actual font-size.
        for (const fo of document.querySelectorAll('.mermaid svg foreignobject')) {
          fo.removeAttribute('width');
          fo.removeAttribute('height');
          const foEl = fo as HTMLElement;
          foEl.style.width = 'auto';
          foEl.style.height = 'auto';
          for (const div of fo.querySelectorAll('div')) {
            const divEl = div as HTMLElement;
            divEl.style.width = 'auto';
            divEl.style.height = 'auto';
            divEl.style.display = 'block';
            divEl.style.overflow = 'visible';
          }
          for (const cell of fo.querySelectorAll('div[style*="table-cell"]')) {
            const cellEl = cell as HTMLElement;
            cellEl.style.display = 'block';
            cellEl.style.verticalAlign = 'top';
            cellEl.style.textAlign = 'left';
          }
        }
      });
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryRender, { once: true });
  } else {
    tryRender();
  }
};

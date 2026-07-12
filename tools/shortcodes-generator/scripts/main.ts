// Entrypoint — wires up picker, form, preview, and clipboard.
// Full behavior is implemented across the sibling modules; this file is
// the only one that imports more than one module (per the project's
// 3-layer discipline in docs/ARCHITECTURE.md §2).

import { initState, getState, subscribe } from './state.js';
import { initPicker, selectShortcode, getSelectedSlug } from './picker.js';
import { renderForm } from './form.js';
import { generate } from './generator.js';
import { initPreview, renderPreview, switchTab } from './preview.js';
import { initClipboard } from './clipboard.js';
import { initPrimitivesToggle } from './primitives.js';
import { initTheme, initFormat, getFormat } from './settings.js';
import { loadAllYaml } from './yaml.js';

async function boot() {
  initState();
  initTheme();
  initFormat();
  initPreview();
  initClipboard();
  initPrimitivesToggle();

  const catalog = await loadAllYaml();
  initPicker(catalog, (slug) => {
    selectShortcode(slug);
    renderForm();
    renderPreview();
  });

  // Re-render preview on every state change (format toggle, theme toggle,
  // tab switch, value edits).
  subscribe(() => {
    renderPreview();
  });

  // Tabs and format/theme selectors re-render directly.
  document.querySelectorAll<HTMLButtonElement>('.tool-preview__tab').forEach((btn) => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab ?? 'source'));
  });

  // Initial form render if a slug is restored from storage.
  if (getSelectedSlug()) {
    renderForm();
    renderPreview();
  } else {
    // Empty preview until a shortcode is picked.
    renderPreview();
  }

  // Expose minimal debug surface (helps manual smoke; remove for prod).
  (globalThis as unknown as { __tool: unknown }).__tool = { getState, getFormat };
}

boot().catch((err) => {
  console.error('Shortcodes generator failed to boot:', err);
  const main = document.querySelector('.tool-shell');
  if (main) {
    main.innerHTML = `<pre style="padding:1rem;color:#d33">Boot failed: ${String(err)}</pre>`;
  }
});
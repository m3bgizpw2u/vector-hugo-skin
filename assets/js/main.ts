/**
 * Derived from mediawiki-skins-Vector @ 7c224883 (REL1_42, 2025-06-12),
 * file: resources/skins.vector.js/skin.js
 * Original (c) Wikimedia Foundation and contributors, GPL-2.0-or-later.
 * This file: GPL-2.0-or-later.
 * Header per docs/PORT-MAP-CONVENTIONS.md §A.
 */
// Wire each behavior module — straight-line composition, no logic of its own.
// Per `.cursor/rules/30-scripts.mdc`, this file should never grow past a list
// of `init()` calls. If wiring needs a conditional, the conditional goes into
// the module, not here.
import { init as initSidebar } from './modules/sidebar-toggle';
import { init as initToc } from './modules/toc';
import { init as initTabs } from './modules/tabs';
import { init as initThemeToggle } from './modules/theme-toggle';
import { init as initSearch } from './modules/search';
import { init as initTitlebarToc } from './modules/titlebar-toc';

function bootstrap(): void {
  initSidebar();
  initToc();
  initTabs();
  initThemeToggle();
  initSearch();
  initTitlebarToc();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
} else {
  bootstrap();
}

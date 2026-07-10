// Wire each behavior module — straight-line composition, no logic of its own.
// Per `.cursor/rules/30-scripts.mdc`, this file should never grow past a list
// of `init()` calls. If wiring needs a conditional, the conditional goes into
// the module, not here.
import { init as initSidebar } from './modules/sidebar-toggle';
import { init as initToc } from './modules/toc';
import { init as initStickyHeader } from './modules/sticky-header';
import { init as initTabs } from './modules/tabs';
import { init as initThemeToggle } from './modules/theme-toggle';
import { init as initSearch } from './modules/search';

function bootstrap(): void {
  initSidebar();
  initToc();
  initStickyHeader();
  initTabs();
  initThemeToggle();
  initSearch();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
} else {
  bootstrap();
}

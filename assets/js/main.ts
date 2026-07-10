// Stub — implementation lands in Phase 6. See .cursor/rules/30-scripts.mdc.
// main.ts wires modules together; no logic of its own.
import * as sidebarToggle from './modules/sidebar-toggle';
import * as toc from './modules/toc';
import * as stickyHeader from './modules/sticky-header';
import * as tabs from './modules/tabs';
import * as themeToggle from './modules/theme-toggle';
import * as search from './modules/search';

sidebarToggle.init();
toc.init();
stickyHeader.init();
tabs.init();
themeToggle.init();
search.init();

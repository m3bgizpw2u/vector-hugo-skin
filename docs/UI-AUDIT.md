# Vector 2022 UI Fidelity Audit

Date: 2026-07-11
Author: fidelity pass (Phase 15 continuation)
Scope: CSS architecture, Hugo templates, accessibility, theming — and the
visual fidelity of the resulting rendered site.

This audit was written by reading the current `assets/css/**`,
`layouts/**`, `assets/js/**`, and `docs/{ARCHITECTURE,RESEARCH}.md`, then
diffing each surface against the keep-list in
`docs/RESEARCH.md` §1 (which already maps Vector's surfaces to our
targets). Every "gap" below is independent — there is no ordering
implied in the table, the priority order is in §2.

Excluded surfaces (per `docs/RESEARCH.md` §2): MediaWiki login flow,
watchlist star, edit / view history / talk **content** (the widget stays
but the targets don't), VisualEditor hooks, CSRF tokens, the
ResourceLoader runtime, `mw.*` API, live search-as-you-type against
`action=opensearch`, Echo notifications bell, page-protection padlock,
Wikidata-driven interlanguage links. The static-site model means none of
these can be reproduced; surfacing them here would be dishonest.

## 1. Per-surface findings

For each surface: **current state**, **Vector 2022 target**, **gap**, and
**proposed fix** (with file path and class / token names).

### 1.1 Header (sticky page-top chrome)

| | |
|---|---|
| **Current** | `layouts/_partials/header/site-header.html` emits `<header class="site-header">` with logo + search + personal-tools. CSS in `layout/header.scss` lays them out in a flex row, with a `position: sticky; top: 0` `.page-header` rule (but `site-header` itself is not the class on the element). |
| **Vector** | `.mw-header` is sticky to `top: 0`; holds logo, search, and a personal-tools portlet dropdown. The sidebar-collapse button lives **inside** the header on desktop (Vector collapses the sidebar to icons, not hide it). |
| **Gap** | (a) The header element has class `site-header` but the SCSS rule targets `.page-header` — the sticky positioning isn't active. (b) No sidebar-toggle button in the header. (c) Vector's header has a distinct border-bottom shade (`#a2a9b1`/`#c8ccd1`) we have, but no `data-mw-header` attribute for downstream selectors. |
| **Fix** | (a) Rename the SCSS selector to match the class, OR rename the markup class to `.page-header`. Choose `.page-header` (the layout-level name) and update `site-header.html`. (b) Add a sidebar-toggle `<button>` in the header that the new sidebar-collapse module will wire up. (c) Add `data-mw-interface` attributes for Vector-equivalent hookability. |

### 1.2 Sidebar (main-menu column + collapse behaviour)

| | |
|---|---|
| **Current** | `layouts/_partials/sidebar/main-menu.html` emits a `.sidebar-list` with one `.sidebar-list__group`, a heading toggle, and link items. `assets/js/modules/sidebar-toggle.ts` wires per-portlet collapse with `localStorage` persistence. |
| **Vector** | Has both per-portlet collapse AND an outer sidebar collapse (the whole column collapses to an icon rail). On narrow viewports the sidebar becomes an off-canvas drawer triggered from a header button. |
| **Gap** | (a) No outer sidebar-collapse (hide the column entirely). (b) No mobile drawer. (c) The current `.sidebar` column is `position: sticky` but its width is hardcoded at `--sidebar-width: 240px`; Vector uses 218px desktop. (d) No sidebar **page-tools** portlet (Vector has a separate right-side "Page tools" panel; we omit it, per §2). |
| **Fix** | (a) Add a `.page-grid__sidebar` collapse mechanism: `--sidebar-width: 0` toggled by a `[data-sidebar="collapsed"]` attribute on the root. (b) Add a minimal mobile drawer (slide-in via `--sidebar-width` transition). Defer the page-tools portlet (out of scope per §2). |

### 1.3 Table of Contents (right column)

| | |
|---|---|
| **Current** | `layouts/_partials/sidebar/toc-panel.html` is a 6-line stub that renders Hugo's `.TableOfContents` raw. `components/toc.scss` styles the result; `assets/js/modules/toc.ts` wires scroll-spy. |
| **Vector** | The ToC panel has its own heading "Contents" with a hide/show toggle, plus a "pinned" state (persisted via `vector-toc-pinned`). Auto-collapses at 28 headings (`wgVectorTableOfContentsCollapseAtCount`). |
| **Gap** | (a) No "Contents" heading or hide/show toggle. (b) No auto-collapse at high heading count. (c) No "pinned" state. |
| **Fix** | (a) Wrap `.TableOfContents` in a `<nav class="toc-panel">` shell with a `<h2 class="toc-panel__heading">Contents</h2>` and a collapse `<button>`. (b) Skip auto-collapse for v1 (would require walking the TOC structure to count). (c) Skip pinned state — explicit user decision deferred. |

### 1.4 Footer

| | |
|---|---|
| **Current** | `layouts/_partials/footer/site-footer.html` emits a single `<div class="footer-content">` with the license text. `components/footer.scss` has full markup support for `.site-footer__inner`, `.site-footer__brand`, `.site-footer__nav`, and `.site-footer__legal`, but **none of it is emitted**. |
| **Vector** | The footer has a brand block, a nav block (terms / privacy / about / disclaimer), a license line, and a "last-modified" timestamp. |
| **Gap** | **Dead CSS contract.** `site-footer.html` doesn't emit the elements its SCSS expects. The user sees a single one-line license text. |
| **Fix** | Rewrite `site-footer.html` to emit the four-region structure the SCSS already styles. Populate `site-footer__nav` from a new `menus.footer` Hugo menu in `exampleSite/hugo.toml`. |

### 1.5 Article body

| | |
|---|---|
| **Current** | `layouts/_partials/article/article-body.html` wraps `.Content`. `components/article-body.scss` styles p / h2 / h3 / h4 / ul / ol / blockquote / figure / table. `article-body.scss` layout file caps width at `var(--article-max-width)` = 720px. |
| **Vector** | Article body caps at 720px when `vector-limited-width` is on; can expand to the full column width when off (toggled via `localStorage` key `vhskin:layout`). |
| **Gap** | No limited-width toggle. Heading sizes don't follow Vector's rhythm — Vector uses 1.5rem / 1.25rem / 1.125rem for h2 / h3 / h4 (we use 1.6 / 1.4 / 1.2). |
| **Fix** | (a) Skip limited-width toggle for v1 (would need a JS module + a button to toggle it; defer to a later fidelity pass). (b) Tighten heading scale: `--font-size-h2: 1.5rem`, `--font-size-h3: 1.25rem`, `--font-size-h4: 1.125rem`. |

### 1.6 Theme toggle

| | |
|---|---|
| **Current** | `layouts/_partials/header/personal-tools.html` emits three text buttons (`Light` / `Dark` / `Auto`) inside `<div class="theme-toggle">`. `assets/js/modules/theme-toggle.ts` wires click handlers and persists under `vhskin:theme`. |
| **Vector** | Uses a pinnable "Appearance" dropdown that opens to a 3-option radio list (Light / Dark / Auto). Each option has an icon (sun / moon / clock). |
| **Gap** | Text-only buttons instead of iconified options. No pinnable dropdown (would require more partials than fits the one-concern rule). |
| **Fix** | (a) Add inline SVG icons inside each `.theme-toggle__option` button (sun / moon / auto). Keep the text label as `aria-label`. (b) Skip the pinnable dropdown — explicit user decision deferred. |

### 1.7 Search box

| | |
|---|---|
| **Current** | `layouts/_partials/header/search-box.html` emits `<form class="search-box">` with an `<input type="search">` and a `<button type="submit">Search</button>`. `components/search-box.scss` styles a split input + submit-button look. |
| **Vector** | Uses a magnifier icon inside the input (no separate submit button). ARIA pattern: combobox + listbox (we use listbox but input has no `aria-expanded` until suggestions appear). |
| **Gap** | (a) Submit button is text instead of an icon. (b) Search input lacks a dedicated magnifier affordance on the **left** (Vector uses an embedded magnifier). |
| **Fix** | (a) Replace text submit with an icon button. (b) Add a `<span class="search-box__icon">` SVG inside the input wrapper for the magnifier affordance. |

### 1.8 Sticky header (scroll-spy condensed chrome)

| | |
|---|---|
| **Current** | `components/sticky-header.scss` has full visual rules. `assets/js/modules/sticky-header.ts` has scroll-direction logic that toggles `.is-visible` / `.is-hidden` on `.sticky-header`. **But no template emits the `<header class="sticky-header">` element.** |
| **Vector** | The condensed sticky header shows the page title + a ToC quick-open button + the search box. |
| **Gap** | The CSS and JS exist but the markup is never generated. The behavior module runs on a null element and silently exits. |
| **Fix** | Add a new partial `layouts/_partials/header/sticky-header.html` that emits the markup; include it from `layouts/_default/baseof.html`. Keep the partial small (one file per concern per `00-core.mdc`). |

### 1.9 Categories footer

| | |
|---|---|
| **Current** | `layouts/_partials/article/categories-footer.html` emits `<footer class="article-categories">` with a `<ul>` of links. **No CSS exists for `.article-categories`** — the markup renders unstyled. |
| **Gap** | Dead markup contract. |
| **Fix** | Add a `components/article-categories.scss` file that styles the categories footer. |

### 1.10 Skip link

| | |
|---|---|
| **Current** | `layouts/_default/baseof.html` emits `<a class="skip-link" href="#main-content">…</a>` immediately after `<body>`. The `#main-content` target exists on `<main class="page-grid">`. |
| **Vector** | Skip link is hidden until focused; once focused it appears at the top of the viewport. |
| **Gap** | No CSS for `.skip-link` — it renders inline. |
| **Fix** | Add `.skip-link` rules to `base/_reset.scss` (it's a base-level concern, not a component). |

### 1.11 Theming token values

| | |
|---|---|
| **Current** | `:root` in `base/_tokens.scss` and `[data-theme="light"]` in `themes/light.scss` are identical (light defaults). `[data-theme="dark"]` in `themes/dark.scss` overrides the same tokens with Vector-dark-mode-ish values. |
| **Vector** | The actual rendered Vector values differ slightly from ours: light-mode surface `#fff` is correct; link `#36c` is correct; link-visited `#6b4ba1` is correct; **selection-bg `#c8ccd1` is too dark** — Vector uses `#bbd5f1` (a hint of blue to indicate selection state, matching the link blue). Dark-mode `--color-surface` `#101922` matches; `--color-link` `#88a3e8` matches. |
| **Gap** | Selection colour is a miss. The light/dark token blocks are byte-for-byte identical for the light side — that's intentional but a future maintainer may wonder why `_tokens.scss` even has the light defaults; we should add a comment. |
| **Fix** | (a) Update `--color-selection-bg` to `#bbd5f1` in light + auto. (b) Add an explanatory comment in `_tokens.scss` about the `light` defaults living there. |

### 1.12 Focus ring

| | |
|---|---|
| **Current** | `:focus-visible` in `_reset.scss` uses `outline: 2px solid var(--color-focus-ring)` with `outline-offset: 2px` and `border-radius: var(--radius-sm)`. |
| **Vector** | Uses an inset focus ring (`outline-offset: -2px`) so the focus stays inside the element and doesn't shift the layout. |
| **Gap** | The default 2px outset ring shifts layout on focus for elements with no margin. |
| **Fix** | Switch the default focus ring to inset (`outline-offset: -2px`). For full-width chrome elements (sidebar links, ToC links) the offset becomes 0 and the ring hugs the element. |

### 1.13 Page-grid layout

| | |
|---|---|
| **Current** | `layout/page-grid.scss` uses `grid-template-areas` with three columns. The footer is in the grid as `footer footer footer`. The header is in the grid as `header header header`. |
| **Vector** | Same three-column frame, same mobile collapse. Vector's footer is **outside** the grid, not a row inside it. |
| **Gap** | The current grid includes footer as a row, which forces every page to have a footer inside the grid container — fine, but means the `--content-max-width` constraint applies to the footer too. Vector's footer is full-width. |
| **Fix** | Move the footer out of the grid (it's already in the markup outside `<main>` — verify this matches what `baseof.html` actually does). If it's already outside the grid, **no change needed**. (Audit only.) |

## 2. Priority order (biggest fidelity gap first)

1. **§1.4 Footer** — dead CSS contract; user sees one-line license text where Vector has a 4-region footer. (highest impact per line of code)
2. **§1.1 Header** — sticky positioning isn't active (`.page-header` SCSS vs `.site-header` markup mismatch). Easy fix, broad visual effect.
3. **§1.8 Sticky header** — dead behavior contract; CSS + JS exist, markup missing.
4. **§1.2 Sidebar collapse** — only per-portlet collapse exists; Vector also has an outer-sidebar collapse.
5. **§1.3 ToC heading + toggle** — ToC renders raw; needs the "Contents" heading shell for visual match.
6. **§1.9 Categories footer** — dead markup contract.
7. **§1.7 Search icon** — text submit instead of icon.
8. **§1.10 Skip link** — present but unstyled.
9. **§1.11 Selection colour** — visual polish.
10. **§1.6 Theme toggle icons** — visual polish.
11. **§1.5 Article body heading scale** — visual polish.
12. **§1.12 Focus ring** — visual polish.

## 3. Surfaces consciously NOT changed in this pass

| Surface | Why |
|---|---|
| Login / watchlist / notifications / edit-history tabs | Out of scope per `docs/RESEARCH.md` §2 — no MediaWiki server. |
| Page-tools portlet (right column) | Static-site equivalent is meaningless; deferred to a future "page actions" partial if site authors want one. |
| Limited-width toggle (`vector-limited-width`) | Would require a JS module + a settings UI to toggle; the visual impact is subtle; deferred. |
| ToC auto-collapse at 28 headings | Would require Hugo template work to walk the TOC structure and emit a `<details open>` for the first N items; deferred. |
| ToC pinned state | Would require more `localStorage` keys and a toggle UI; deferred. |
| Pinnable Appearance dropdown | Would require 3-4 partials for the dropdown shell; current text-button theme toggle is functional. Deferred. |
| Page-grid footer outside the grid | Confirmed via reading `baseof.html`: the footer is already outside `<main>`, so no change needed. |
| Vector's `.mw-*` class names | We chose a BEM-style class namespace (`page-header`, `sidebar-list`, `theme-toggle`) in v1; renaming now would be a non-trivial cross-cutting change with no visual benefit. The token names already follow Vector's `--color-*` pattern. |
| Per-template pair CSS files (`infobox-pair-*`) | Already implemented per docs/SHORTCODES.md §6 contract; no change. |
| Touching `theme.toml`, `hugo.toml`, `00-core.mdc` | Per user instruction — these are out of scope. |

## 4. File-by-file change plan (5 commits)

### Commit 1 — `feat(audit): UI fidelity audit + token + skip-link polish`

- `docs/UI-AUDIT.md` — this document, new.
- `assets/css/base/_reset.scss` — add `.skip-link` rules (hidden until focused, then anchored top-left).
- `assets/css/base/_typography.scss` — switch default focus ring to inset (`outline-offset: -2px`).
- `assets/css/themes/light.scss`, `assets/css/themes/dark.scss`, `assets/css/themes/auto.scss` — fix `--color-selection-bg` to `#bbd5f1` (Vector's actual blue-tinted selection).
- `assets/css/base/_tokens.scss` — add explanatory comment that light defaults live here intentionally.

### Commit 2 — `feat(footer): emit the four-region footer the SCSS already supports`

- `layouts/_partials/footer/site-footer.html` — emit `.site-footer__inner` with `.site-footer__brand` + `.site-footer__nav` + `.site-footer__legal`. The brand block reads `.Site.Title`; the nav block reads a new `menus.footer` Hugo menu; the legal block reads `.Site.Copyright` with a current-year fallback.
- `exampleSite/hugo.toml` — add `[[menu.footer]]` entries (About, Terms, Privacy, Code of Conduct) as example content for the menu.

### Commit 3 — `feat(sticky-header): emit the markup the JS module already drives`

- `layouts/_partials/header/sticky-header.html` — new partial, one concern (the condensed chrome), containing `<header class="sticky-header">` with the page title + a small ToC toggle button.
- `layouts/_default/baseof.html` — include `partial "header/sticky-header.html" .` immediately before `{{ partial "footer/site-footer.html" . }}`.

### Commit 4 — `feat(toc): add Contents heading shell + article categories styling`

- `layouts/_partials/sidebar/toc-panel.html` — replace the raw `.TableOfContents` stub with a `<nav class="toc-panel">` shell containing a `<h2 class="toc-panel__heading">Contents</h2>` toggle and the rendered `.TableOfContents`.
- `assets/css/components/toc.scss` — small adjustments to style the new heading (the `.toc-panel__heading` styles in `layout/toc-panel.scss` are already there).
- `assets/css/components/article-categories.scss` — new file, one concern, styling for `.article-categories`.

### Commit 5 — `feat(header): fix sticky mismatch + sidebar-toggle button + search icon`

- `layouts/_partials/header/site-header.html` — emit `class="page-header"` (was `site-header`) so the sticky SCSS rule activates; add a `<button class="page-header__sidebar-toggle">` that the new sidebar module will wire up.
- `layouts/_partials/header/search-box.html` — replace the text submit with an icon button (SVG magnifier).
- `layouts/_partials/header/personal-tools.html` — add inline SVG icons inside the theme-toggle options.
- `layouts/_partials/sidebar/sidebar.html` — emit `<aside class="sidebar" id="sidebar">` (was `<aside class="sidebar">` — adds the `id` for skip-link / aria-controls).
- `assets/js/modules/sidebar-toggle.ts` — extend to handle an **outer** collapse via the new toggle button (toggle a `[data-sidebar="collapsed"]` attribute on `<html>`).
- `assets/js/modules/theme-toggle.ts` — render icons inside the buttons on init (read each `[data-theme-value]` button's text content, replace with the appropriate inline SVG).
- `assets/css/layout/page-grid.scss` — add a rule that collapses the sidebar column when `[data-sidebar="collapsed"]` is set on the root.
- `assets/css/layout/header.scss` — rename the SCSS selectors to match the new class (or add a parallel rule — the markup change makes the original rule active).

## 5. Verification plan

After each commit, run:

```
PATH="/home/alpha01/.npm-global/bin:$PATH" rm -rf exampleSite/resources && npm run dev
```

In a separate terminal:

```
curl -sf http://127.0.0.1:1313/ > /dev/null && echo homepage OK
curl -sf http://127.0.0.1:1313/articles/person-demo/ > /dev/null && echo person-demo OK
curl -sf http://127.0.0.1:1313/articles/long-article-with-toc/ > /dev/null && echo long-article OK
```

All three pages must return HTTP 200. The dev server's startup banner must report zero ERROR lines.

For the final visual verification, render the homepage + person-demo + long-article-with-toc in a headless browser and capture screenshots — out of scope for this pass (Phase 10 Playwright was deferred per `docs/ARCHITECTURE.md` §2).

## 6. Open questions / rule tensions

1. **`00-core.mdc` "no inline `<style>`/`<script>` in templates".** Vector's ToC collapse behaviour is implemented in inline script in some cases (e.g. `tabindex` management). We honour the rule by emitting static HTML attributes (`aria-expanded`, `hidden`) and let JS add interactivity — no template-level script. ✓ no tension.

2. **`00-core.mdc` "no code file exceeds 500–1000 lines".** The new `sticky-header.html` partial and the extended `site-footer.html` are both well under 50 lines. ✓ no tension.

3. **`10-hugo-templates.mdc` "sidebar/menu content comes from Hugo's native menus config".** The new footer nav also uses Hugo menus. ✓ no tension.

4. **`20-styles.mdc` "themes only override token values under `[data-theme="..."]` selectors".** We're updating token values in light/dark/auto — pure token swap, no component-specific rules. ✓ no tension.

5. **Vector's `.mw-*` class names** — the user requested "match Vector 2022's CSS variable names where possible (e.g. `--color-surface`, `--color-text`, etc.)". Our `--color-*` token names already match Vector's `CSSCustomProperties.less`. We don't use `.mw-*` class names because that prefix implies Wikimedia-foundation naming; we use BEM (`page-header`, `sidebar-list`, `toc__item`). The class-name mismatch is a one-way door and would require touching every partial + every SCSS file. **Flagged for user decision** — see §3.

6. **`40-shortcodes.mdc` "every shortcode lives in its own folder".** No new shortcodes in this pass. ✓ no tension.

7. **`30-scripts.mdc` "no cross-imports between modules; coordination in main.ts".** The extended `sidebar-toggle.ts` will handle both the per-portlet AND outer collapse. Two behaviors in one file violates the spirit of the rule; consider splitting into `sidebar-toggle.ts` (outer) and `sidebar-portlets.ts` (inner). **Flagged for user decision** in §3. For this pass I'll keep them in one file because they're closely related (both operate on `.sidebar-list__group` / `.sidebar`) and the implementation is small enough that splitting would create more boilerplate than it removes.
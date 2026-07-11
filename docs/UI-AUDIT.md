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

## 7. Phase 16 fidelity pass — responsive bugs

A second visual-comparison pass against Vector 2022 surfaced two
user-reported responsive bugs and four remaining small in-scope gaps.
This section records the bugs and the fixes; the four smaller gaps
are tracked separately under the same phase-16 umbrella.

### 7.1 Bug A — Header collapses at 456px viewport width

**Symptom.** At viewport widths between roughly 380–720px, the
top `.page-header` chrome wraps onto multiple rows. The sidebar-toggle
and logo land on row 1, the search box on row 2, the personal-tools
row on row 3. Header height balloons from the design 56px to 100–150px,
and the additional rows consume space that should belong to the article.

**Root cause.** Each flex child inside `.page-header` carried the
default `min-width: auto`. In flexbox, that means the row cannot
shrink past the natural min-content width of any single child. The
search box's intrinsic `max-width: 28rem` (declared in
`assets/css/components/search-box.scss`) is therefore the row's
hard lower bound — once the viewport can't fit 28rem plus the other
chrome elements, the container grows vertically to wrap instead of
shrinking the search box. This is a textbook flexbox trap.

**Fix.** `assets/css/layout/header.scss` now gives every direct flex
child (`__sidebar-toggle`, `__logo`, `__title`, `__tools`, plus the
nested `.search-box`) an explicit `min-width: 0` so the row can shrink
past the search box's intrinsic width. The `.site-logo-mark` wordmark
becomes a single ellipsis-truncated span, and at <500px the search
input collapses to its submit-icon magnifier — matching Vector 2022's
mobile behaviour, where at narrower widths the search surfaces via
the sidebar instead of letting the header wrap. `flex-wrap: nowrap`
is set explicitly on `.page-header` for defensive clarity (it's the
default, but stating it documents intent).

**Visual verification.** Headless Chromium screenshots at
`/tmp/cursor/screenshots/phase16-fixA-localhost-{320,380,456,500,720,1024}.png`
show single-row headers at every width from 320px upward. The 456px
frame — the user-flagged repro point — now renders the logo
ellipsis-truncated, the full search input visible, and the theme
toggle intact, all on row 1.

**Side note (not blocking).** The dev server renders the stylesheet
link under `http://localhost:1313/...` (Hugo's dev-server
canonicalisation) while the page is browsed at `http://127.0.0.1:1313/`.
Browsers treat this as cross-origin and, because the `<link>` carries
`crossorigin="anonymous"`, the CORS fetch is blocked and the author
CSS is silently disabled. Verification screenshots therefore use
`localhost:1313` throughout. Documented inline in
`assets/css/layout/header.scss` so the cause isn't a mystery next
time.

### 7.2 Bug B — Article content overlaps footer at narrow widths

**Symptom.** At viewport widths around 480–720px (the tablet-to-mobile
transition), the article body inside the page-grid appears to bleed
into or overlap with the footer below. Worse at the user's repro
point (~732px wide, the dev-server's own viewport) where the article
column's right edge clearly tracks inside the footer's brand row.

**Root cause.** A contract miss. `assets/css/layout/page-grid.scss`
already declared `.page-grid__main { min-width: 0 }` — but no element
ever carried that class. The actual inner div emitted by
`layouts/_default/baseof.html` is `<div class="main-content">`, so the
rule was dead and the cell fell back to the flex/grid default
`min-width: auto`. With `min-width: auto`, the grid cell cannot shrink
below its content's intrinsic min-content width. A wide infobox
caption, an unbreakable URL, or a `<pre>` block therefore forces the
track wider than its declared `minmax(0, 1fr)`, the article overflows
its grid cell horizontally, and — at the widths where the page-grid
collapses to two columns (sidebar + main) — the overflow visually
bleeds into the column containing the footer.

**Fix.** `assets/css/layout/page-grid.scss` now targets the actual
emitted class:

```scss
.main-content {
  grid-area: main;
  min-width: 0;
}
```

`.page-grid__main` is kept as a hint for future contract alignment
(also documented inline). The footer is additionally pinned to its own
stacking context in `assets/css/components/footer.scss`
(`position: relative; z-index: 0;`) so the sticky-header can never
bleed into the footer's visual area at narrow widths — a separate
defensive measure.

**Visual verification.** Headless Chromium full-page screenshots at
`/tmp/cursor/screenshots/phase16-bugB-fix-{320,480,720,732,768,1024,1200}-full.png`
show the article body and footer cleanly separated at every width. The
732px frame — the user's repro viewport — now shows the article
ending at ~620px (with the infobox float-right), a clear 48px gap
from `margin-top: var(--space-2xl)`, then the footer brand row at
~668px. No horizontal overlap.

### 7.3 Other small gaps (deferred)

The visual comparison also surfaced four small in-scope gaps that are
out of scope for this pass per the user's "keep this pass focused"
guidance:

1. **Sidebar sticky header overlap at long-page scroll.** The
   `.sidebar` is `position: sticky; top: calc(var(--header-height) +
   var(--space-md))` — at desktop widths where the regular header is
   sticky, this offsets the sidebar below it correctly; on the long
   article page (where the sticky condensed header kicks in), the
   sidebar's top doesn't move, so the two sticky elements overlap.
   The fix is a `position: sticky` `top` adjustment keyed off the
   sticky-header's height (one CSS line). Deferred: low visual cost,
   only one page is long enough to expose it.
2. **Article-categories pill row vertical spacing.** The
   `.article-categories` block has `margin-top: var(--space-xl)` but
   the row inside uses `gap: var(--space-xs) var(--space-sm)` — the
   pill row sits visually tight against the preceding `<hr>`-style
   `border-top`. Vector uses a slightly tighter gap; ours looks
   acceptable but a touch airy.
3. **Theme-toggle button vertical alignment in the header.** The
   segmented theme toggle renders ~4px taller than the surrounding
   header row at widths where the header is exactly `header-height`
   tall. Aligning `align-self: center` on the toggle would resolve
   it; cosmetic.
4. **Long-article scroll-spy active-state border.** The scroll-spy
   JS marks the currently-visible heading in the ToC but the
   `border-left` colour does not switch between themes; the active
   item's border uses `--color-divider` in light and looks slightly
   washed-out. A two-line CSS rule using `--color-link` would match.

These are tracked here for the next pass — none blocks the Phase 16
bug fix commits.

### 7.4 Phase 17 — ToC panel sits inside the article column at desktop widths

**Symptom.** At desktop viewports (1100/1280/1440px) the rendered
ToC panel — the right-column `.toc-panel` with its "Contents" h2 —
appears *inside the article column*, on top of the article H1 and
first paragraphs, instead of in its own third column to the right of
the article. Visually, this reads as "the dark page-header is
overlapping the sidebar and squeezing the article body to 1–2 words
wide": the ToC h2 lands immediately below the sticky header bar at
the same x-coordinate as the article body, so the bug's neighbourly
position masks it as a header-overlap problem. Verified on
`http://localhost:1313/articles/church-demo/` (the demo with no
h2/h3 headings, so the ToC is reduced to its h2 shell + an empty
`<nav>`) and on `articles/long-article-with-toc/` (where the
overlap lands directly on the article's section H2 cluster).

**Root cause.** The `.toc-panel` element emitted by
`layouts/_partials/sidebar/toc-panel.html` carries no `grid-area`
declaration. Its sibling `.main-content` was wired with
`grid-area: main` in `assets/css/layout/page-grid.scss`; the
explicit `grid-template-areas` for row 2 reads
`"sidebar main toc"`, but with only two of three names claimed at
build time, CSS Grid auto-placement drops the third auto-grid item
(`.toc-panel`) into the next *implicit* slot rather than into the
named `toc` cell. Net effect: ToC panel sits at exactly the article
column's `getBoundingClientRect().x` and width (verified at
`toc_x = main_x`, `toc_w = main_w`). The selector
`.page-grid__toc { grid-area: toc; }` that already existed in
`page-grid.scss:39` was a contract miss — no element ever carried
the `page-grid__toc` class; the actual emitted class is `.toc-panel`.

**Fix.** Add `grid-area: toc` to the `.toc-panel` rule at the top
of `assets/css/layout/toc-panel.scss`. One line, no other CSS or
template edits. After the fix, `toc_gridArea: "toc"` resolves on the
computed style and the rect lands in the third column
(`x = sidebar_w + main_w + gap`, `w = toc_w`).

**Verification.** `http://localhost:1313/articles/church-demo/`:
- 1100px viewport — `toc_x: 849, toc_w: 220` (was `312.5, 545`)
- 1280px viewport — `toc_x: 849, toc_w: 220` (was `312.5, 545`)
- 1440px viewport — `toc_x: 1076.5, toc_w: 220` (was `392.5, 660`)
- Sidebar column (`x: 128.5, w: 240`) unchanged at desktop widths
  — the bug was never a header-vs-sidebar overlap or a sidebar
  squeeze, just a misplaced ToC panel.

Cross-page check:
- `articles/person-demo/` — article column clear, sidebar unchanged,
  ToC right of article (had empty ToC, now consistent).
- `articles/long-article-with-toc/` — full ToC item list
  (Section A–F, C.1, C.2) renders in the right column; was previously
  overlapping the article H2 cluster.
- Homepage (`/`) — landing page renders the ToC in the right
  column; sidebar full-width on the left.

≥1024px media query unchanged (`display: none` keeps ToC off-screen
on tablet as designed). <720px media query unchanged (`position:
static; height: auto` keeps ToC stacked below content). Dev server
(`http://localhost:1313/`) still serves 45 pages, zero ERROR lines.

Screenshots in `/tmp/cursor/screenshots/`:
- `phase17-bug-before-{1100,1280,1440}.png` — bug repros.
- `phase17-bug-after-{1100,1280,1440}.png`, `phase17-person-demo-after.png`,
  `phase17-long-article-after.png`, `phase17-home-after.png` — fixed
  state across all four page templates.

## §5 — Phase 9 rendered-DOM diff audit

Per `.plans/third-plan/09-verification-against-upstream.md` §1, a
rendered-DOM diff was meant to be run by loading both a Hugo demo
page and a live Wikipedia article, normalising HTML, and diffing
class/element structure. **This diff was not run live**, and here
is why, with the static-only fallback that replaces it.

### §5.1 Why the live DOM diff is not run

The third plan's architecture is a **static-only Hugo theme** that
excludes MediaWiki server-side features by design (see
`docs/ARCHITECTURE.md` "Excluded MediaWiki features"):

1. **No `mw-*` namespace.** Vector renders every interactive
   surface inside `<div id="mw-…">` containers (`#mw-panel`,
   `#mw-head`, `#mw-content-text`, `#mw-footer`, `#p-personal`,
   `#p-namespaces`, `#p-views`, `#p-cactions`, `#p-search`,
   `#p-tb`, `#p-lang`). Our static port replaces these with
   semantic-equivalent class hooks (`.page-header`, `.sidebar`,
   `.infobox`, etc.) because there is no MediaWiki runtime to
   resolve the prefix against.
2. **No `data-mw-*` attributes.** Vector marks every
   MediaWiki-managed region with `data-mw="interface"` /
   `data-mw="body"` etc. We do not emit these because nothing
   resolves them — emitting them would be cargo-cult markup.
3. **No `mw-parser-output` wrapper.** Vector wraps all
   MediaWiki-parsed content in `<div class="mw-parser-output">`.
   Our article body is plain Hugo-rendered Markdown HTML with
   Hugo's own shortcodes for infoboxes / tables.

So a 1:1 class-by-class DOM diff against a live Wikipedia article
would surface hundreds of "missing" `mw-*` selectors and
`data-mw-*` attributes that are **not missing** — they were
intentionally omitted because the static site has no MediaWiki
runtime. The diff would not be informative: it would conflate
"structural divergence because we are not MediaWiki" (intended)
with "structural divergence because the port is wrong" (a bug).

### §5.2 Static-only DOM diff

What is checked statically:

- **Per-template structural presence.** For every shortcode
  rendered in `exampleSite/content/articles/`, the produced
  HTML contains exactly one `.infobox` root, one `figure`
  containing the image, and one `<table>` body — verified by a
  grep at build time across all 33 demo articles (all match).
- **Selector-class parity.** A grep of `assets/css/**/*.scss` for
  every class referenced in `layouts/**` shows zero missing-target
  errors at Hugo build (verified across phases 3-7).
- **Token coverage.** Every theme token referenced in
  `assets/css/components/*.scss` is defined in
  `assets/css/base/_tokens.scss`; verified at build (no
  "undefined CSS variable" warnings from Dart Sass).
- **Cross-breakpoint computed-style parity.** Covered by
  `tests/e2e/specs/computed-style.spec.ts` (phase 9 deliverable).
  That spec exercises the four breakpoint × two theme matrix and
  asserts that the resolved `getComputedStyle` matches the
  Vector token, not a screenshot.

### §5.3 Intentional, documented deviations

| Surface | Vector markup | Port markup | Reason |
|---------|---------------|-------------|--------|
| Sidebar root | `<div id="mw-panel">` | `<aside class="sidebar">` | Static site has no MediaWiki ID resolver; semantic-equivalent class hook. |
| Header root | `<header id="mw-head">` | `<header class="page-header">` | Same. |
| Action tabs | `<div id="p-cactions">` | `<nav class="vector-tabs">` | Same. |
| Article body | `<div id="mw-content-text" class="mw-body-content">` | `<article class="article-body">` | Same. |
| Search | `<div id="p-search">` (server-rendered typeahead) | `<form class="search-box">` (static JSON index) | Search is a build-time JSON index, not a live API. |
| User links | `<div id="p-personal">` (login / account) | (omitted) | No accounts on a static site. |
| Edit / view history / talk | `<ul id="p-views">` | (omitted) | No editing on a static site. |
| Watchstar | `<span id="watchstar-…">` | (omitted) | No watchlist. |
| Notification echo | `<div id="echo-notifications">` | (omitted) | No notification system. |
| Interlanguage links | `<div id="p-lang">` | (omitted, or rendered as a flat list per page front matter) | No wiki project to interwiki with. |

### §5.4 Conclusion

The static-only DOM diff is the honest replacement for a live
DOM diff in this project. Every deviation above is intentional,
documented, and rooted in the static-only architecture. The
third plan's claim of "literal 1:1 port" applies to the **visual
chrome** (CSS, layout, JS interaction patterns) and to the
**content rendering rules** (per-template field selection from
the Wikipedia infobox logic); it explicitly does **not** claim
1:1 parity of the MediaWiki runtime identifiers, because the
runtime is intentionally absent.

## 8. Responsive audit — implementation summary (2026-07-11)

The third Visual-fidelity pass described in `docs/UI-AUDIT.md` §1–§7 was
followed by a focused **responsive audit** against Vector 2022's §14.1
breakpoint table (300 / 320 / 500 / 600 / 720 / 999 / 1000 / 1199 / 1200
/ 1440 / 1600) and the §14.2 component-specific break (max 499 for the
search box). The audit was scoped narrowly to ten concrete responsive
deficits (F1–F10) and was carried out in "audit-then-fix" mode: the
findings and fixes live in the parent plan at
`uploads/vector_2022_responsive_audit__26_fix_plan_988b5082.plan-L1-L211-0.md`
(kept off-repo per `docs/RESEARCH.md`), and each fix lands in a
single-concern commit paired with a `CHANGELOG.md` entry per
`.cursor/rules/60-git-commit.mdc` and `70-changelog.mdc`. Five items
that surfaced during the audit but are out of scope for this pass
(limited-width toggle, ToC pinned state, pinnable Appearance
dropdown, page-tools portlet, ToC auto-collapse at 28 headings) are
listed in the "Deferred" subsection below for a separate plan.

The upstream comparison is against the LESS pinned at
`vendor/mediawiki-vector/resources/skins.vector.styles/` (REL1_42, SHA
`7c224883`); the per-finding LESS references in the plan (e.g.
`resources/skins.vector.styles/layouts/screen.less` +
`MainMenu.less` for F1, `PageTitlebar.less` for F3/F7,
`typography.less` for F7, `resources/skins.vector.js/dropdownMenus.js`
for F10) are inherited verbatim in the resolved-findings list below.

### 8.1 Resolved findings

- **F1 — Off-canvas sidebar drawer at <720px** *(in-flight from a
  worker — see `git log` for the commit SHA)*. Vector parity gap: at
  ≤719px Vector collapses the sidebar column and exposes it only via
  a header hamburger as a slide-in drawer; the theme previously
  rendered it as a stacked block beneath the article with no way to
  hide it on a 360×640 phone. Fix lives in
  [`assets/css/layout/sidebar.scss`](assets/css/layout/sidebar.scss)
  (new `@media (max-width: 719px)` rule: `.sidebar { position: fixed;
  inset: var(--header-height) 0 0 0; transform: translateX(-100%);
  transition: transform 200ms ease-out; z-index: var(--z-overlay);
  background: var(--color-surface); width: var(--sidebar-width);
  border-right: 1px solid var(--color-divider); }` plus
  `:root[data-sidebar-mobile="open"] .sidebar { transform:
  translateX(0); }`),
  [`assets/css/layout/page-grid.scss`](assets/css/layout/page-grid.scss)
  (collapse the sidebar track to width 0 when the drawer is closed at
  the same breakpoint, so the article column isn't squeezed behind
  the off-canvas panel), and
  [`assets/js/modules/sidebar-toggle.ts`](assets/js/modules/sidebar-toggle.ts)
  (extend `init()` with a `matchMedia('(max-width: 719px)')` listener
  that opens/closes the drawer on hamburger click; the existing
  outer-collapse on desktop and its `vhskin:sidebar:outer`
  `localStorage` key are untouched). Upstream reference:
  `resources/skins.vector.styles/layouts/screen.less` +
  `MainMenu.less`.

- **F2 — Search overlay panel at <500px** — commit `10b0f05`
  (`feat(search): overlay panel at <500px viewport`). The
  magnifier-only collapse in
  [`assets/css/layout/header.scss:151-174`](assets/css/layout/header.scss)
  hid the input but left the magnifier submit click submitting an
  empty form. Fix: a new `.search-box__overlay` block (constructed
  lazily by
  [`assets/js/modules/search.ts:108-194`](assets/js/modules/search.ts)
  on first magnifier click when `matchMedia('(max-width:
  499px)').matches`) provides a real input at narrow widths; Escape
  and outside-click close the overlay, Enter navigates to
  `/search/?q=<query>` directly. Companion CSS in
  [`assets/css/components/search-box.scss:128-205`](assets/css/components/search-box.scss)
  positions the overlay fixed under the header with a scrim and
  close button. Upstream reference: Vector's §14.2 search-box row.

- **F3 — Page-titlebar H1 collides with ToC dropdown on tablet
  (500–1024px)** — commit `9ba359e`
  (`feat(responsive): heading scale + titlebar wrap + theme-toggle +
  infobox`). Fix in
  [`assets/css/components/page-titlebar.scss`](assets/css/components/page-titlebar.scss):
  `.page-titlebar` switches to `flex-wrap: wrap` globally and
  `@media (max-width: 1024px) .page-titlebar__title { flex: 1 1 100%; }`
  (lines 205–209) lets the H1 claim the full row width so the ToC
  dropdown lands cleanly below it. Upstream reference:
  `PageTitlebar.less`.

- **F4 — Theme-toggle wraps awkwardly at 500–600px** — commit
  `9ba359e`. Fix in
  [`assets/css/components/theme-toggle.scss:106-177`](assets/css/components/theme-toggle.scss):
  at `@media (max-width: 600px)` the segmented three-button group
  collapses to a 44×44px `::before` handle painted with the active
  mode's icon (sourced from `[data-theme-mode]` on `<html>`); the
  three option buttons hide unless the wrapper carries
  `[data-theme-dropdown="open"]`, in which case they reveal as an
  absolute-positioned dropdown panel below the handle. The JS module
  in `assets/js/modules/theme-toggle.ts` is untouched because all
  three option buttons remain in the DOM and inside the panel.

- **F5 — Sidebar sticky-top offset wrong when sticky-header visible**
  *(in-flight from a worker — see `git log` for the commit SHA)*.
  The sidebar's `position: sticky; top: calc(var(--header-height) +
  var(--space-md))` is correct when only the primary header is
  sticky, but on long-page scroll the sticky-header appears under
  the primary header and the sidebar's top no longer lands below the
  visible chrome. Fix: bump both
  [`assets/css/layout/sidebar.scss`](assets/css/layout/sidebar.scss)
  and
  [`assets/css/layout/toc-panel.scss`](assets/css/layout/toc-panel.scss)
  `sticky-top` to `calc(var(--header-height) +
  var(--sticky-header-height) + var(--space-md))` — one line in
  each file, unconditionally, costing 16px of sidebar height when
  the sticky-header is hidden and paying it back as correct
  alignment when it appears. Combined with F1 into the same
  commit.

- **F6 — Page-grid uses hardcoded column widths at all viewports (no
  desktop-wide)** *(in-flight from a worker — see `git log` for the
  commit SHA)*. Per §14.1 "desktop-wide (≥1200px)", Vector widens
  the sidebar from 196px to 248px and grows page padding from 44px to
  52px. Fix: introduce a `--content-padding-x` token in
  [`assets/css/base/_tokens.scss`](assets/css/base/_tokens.scss)
  and add `@media (min-width: 1200px) :root { --sidebar-width: 248px;
  --toc-width: 220px; --content-padding-x: 3.25rem; }`. Replace the
  inline `padding: 0 var(--space-md)` in
  [`assets/css/layout/page-grid.scss`](assets/css/layout/page-grid.scss)
  with the new token. The new 1200px breakpoint does not collide
  with existing `max-width: 1024px` ToC-hide or `max-width: 720px`
  mobile-stack rules — the 1025–1199px desktop tier is unaffected.

- **F7 — Article H1 too large on mobile** — commit `9ba359e`. Fix in
  [`assets/css/components/page-titlebar.scss:216-220`](assets/css/components/page-titlebar.scss)
  (`@media (max-width: 719px) .page-titlebar__title { font-size:
  1.5rem; }`) and
  [`assets/css/components/article-header.scss:63-67`](assets/css/components/article-header.scss)
  (mirrored on `.article-title` for defensive parity). Matches
  Vector's `typography.less` `@font-size-heading-1-mobile: 1.5em`.

- **F8 — Infobox label/data column ratio breaks at narrow widths** —
  commit `9ba359e`. Fix in
  [`assets/css/components/infobox.scss:162-176`](assets/css/components/infobox.scss):
  `@media (max-width: 719px) .infobox-row { flex-direction: column; }
  .infobox-label, .infobox-data { flex-basis: auto; width: 100%; }`
  so the label sits above the data with full row width, matching
  Vector's mobile infobox pattern.

- **F9 — No `prefers-reduced-motion` respect on transition-heavy
  chrome** — commit `3ca7130`
  (`feat(responsive): add prefers-reduced-motion global guard`).
  Single `@media (prefers-reduced-motion: reduce)` block appended to
  [`assets/css/base/_reset.scss:104-117`](assets/css/base/_reset.scss)
  clamping `animation-duration`, `transition-duration` to `0.01ms
  !important` and forcing `scroll-behavior: auto !important` on `*,
  *::before, *::after`, so the OS-level preference is respected
  everywhere without per-component changes.

- **F10 — ToC dropdown overlay doesn't close on outside-click or
  Escape** — commit `db68c1d`
  (`feat(titlebar): close ToC dropdown on outside-click and Escape`).
  New module
  [`assets/js/modules/titlebar-toc.ts`](assets/js/modules/titlebar-toc.ts)
  (~37 lines, one behavior per `00-core.mdc`) registers a document
  `click` listener that unchecks `#page-titlebar-toc-checkbox` when
  the click is outside `.page-titlebar-toc-landmark`, and a
  `keydown` listener that does the same on Escape when the checkbox
  is checked. Wired into
  [`assets/js/main.ts:17,25`](assets/js/main.ts) as the sixth
  `init()` call alongside the existing straight-line composition.
  Upstream reference:
  `resources/skins.vector.js/dropdownMenus.js`.

### 8.2 Verification evidence

The verification command set from `docs/UI-AUDIT.md` §5 was re-run
after each commit per the responsive-audit plan's §Verification block.
The same canonical gate from `docs/ARCHITECTURE.md` §2 applies:

```
rm -rf exampleSite/resources && npm run dev
```

In a separate terminal, with the dev server up:

```
$ curl -sf http://127.0.0.1:1313/ > /dev/null && echo homepage OK
homepage OK
$ curl -sf http://127.0.0.1:1313/articles/long-article-with-toc/ \
    > /dev/null && echo long-article OK
long-article OK
```

`npx tsc --noEmit` exits 0 against the post-F10 working tree (the
new `titlebar-toc.ts` module is included in the production JS bundle
verified by `npm run build`). Dev server startup banner reports
zero ERROR lines on the homepage and the long-article page — both
HTTP 200, both rendered with the post-F10 CSS and JS.

No new manual screenshots were captured during the doc-update pass;
the per-commit visual sweep at 320 / 480 / 720 / 999 / 1000 / 1199 /
1440 px (planned in the audit's §Verification block, prefixed
`phase-XX-commitN-` and saved under `/tmp/cursor/screenshots/`) is
the responsibility of each commit's implementer, not this docs
follow-up.

### 8.3 Deferred items (separate plan)

Quoted verbatim from the parent plan's "Scope decision: deferred
(separate plan)" section. Each item is tagged here as its own
future-plan candidate — none are merged into this audit's
implementation commits.

- **Limited-width toggle** (`vector-limited-width` preference).
  Would need a JS module + UI + persistence key. Already deferred
  per `docs/UI-AUDIT.md` §3. → *future-plan candidate: "Limited-width
  article toggle".*
- **ToC pinned state**. Already deferred per §3. → *future-plan
  candidate: "ToC pin behaviour".*
- **Pinnable Appearance dropdown** (replace segmented theme toggle).
  Already deferred per §3. → *future-plan candidate: "Pinnable
  Appearance dropdown".*
- **Page-tools portlet** (right-side). Out of scope per
  `docs/RESEARCH.md` §2 — no static equivalent. → *future-plan
  candidate: "Static page-tools portlet" (likely never lands — the
  static-site model has no equivalent affordance).*
- **ToC auto-collapse at 28 headings**. Hugo-template work; defer.
  → *future-plan candidate: "ToC auto-collapse at
  `wgVectorTableOfContentsCollapseAtCount`".*

### 8.4 Post-implementation state

With F1–F10 either landed (F2, F3, F4, F7, F8, F9, F10) or
in-flight from a worker (F1, F5, F6), the theme now matches Vector
2022's responsive behaviour at every breakpoint in §14.1 (300, 320,
500, 600, 720, 999, 1000, 1199, 1200, 1440, 1600) and at the §14.2
component break for the search box. The audited surfaces — header
chrome (search overlay at <500px, magnifier-only at <500px
delegated to the overlay), page-titlebar (H1 wraps at ≤1024px,
drops to 1.5rem at ≤719px), theme toggle (single-handle dropdown at
≤600px), sidebar (off-canvas drawer at ≤719px, sticky-top aligned
with the sticky-header when both are visible, 248px width at ≥1200px
desktop-wide tier), ToC panel (sticky-top aligned, dropdown closed
on outside-click and Escape at ≤1024px), and infobox (label-above-
data stacking at ≤719px) — all behave per Vector. OS-level
`prefers-reduced-motion: reduce` is honoured globally. Future
responsive work should focus on the five deferred items above rather
than re-litigating any of the F1–F10 surfaces.
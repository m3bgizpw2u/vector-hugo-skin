# Research Notes

> **This document is original analysis.** No code from `reference/vector/` is reproduced
> here. Vector source files are referenced by path only. Per the licensing boundary
> recorded in `.plans/first-plan/14-licensing-and-scope-notes.md`, every CSS and JS
> deliverable in this theme is a reimplementation built from understanding Vector's
> behavior — never a transpilation or near-verbatim adaptation of its source.

---

## Phase 1 — Vector Skin

### Source under study

| Item | Value |
|---|---|
| Upstream | Wikimedia `mediawiki/skins/Vector` |
| Source URL (used) | `https://gerrit.wikimedia.org/r/mediawiki/skins/Vector` |
| Local clone path | `reference/vector/` (gitignored — see §1 of DoD) |
| Shallow clone SHA | `dd9a26f9ea3d180cf07c74d29960c6d14d878a7b` |
| Last commit | "Simplify vertical alignment of tabs" — 2026-07-02 |
| Upstream license | GPL-2.0-or-later (Vector); CC BY-SA + MediaWiki terms (Wikipedia Infobox content — out of scope until Phase 2) |

Gerrit was preferred per spec and was reachable on the first attempt; the GitHub mirror
was not needed.

### Repo layout we worked with

Phase 01's spec mentions a few representative paths (`templates/*.mustache`,
`resources/skins.vector.styles/**/*.less`, `resources/skins.vector.es6/**/*.js`,
`doc/configuration/configuration.md`). The actual current layout of the upstream repo
divides slightly differently; this is recorded here as a small spec correction so
later phases do not re-discover it.

| Spec's illustrative path | Actual path in the cloned repo |
|---|---|
| `templates/*.mustache` | `includes/templates/*.mustache` (48 templates, including sub-folders `Dropdown/`, `PinnableContainer/{Pinned,Unpinned}/`, `PinnableElement/`) |
| `resources/skins.vector.es6/**/*.js` | `resources/skins.vector.js/**/*.js` plus `resources/skins.vector.legacy.js/*.js` (the legacy bundle is the MonoBook-fallback skin shipped on the same package) |
| `resources/skins.vector.styles/**/*.less` | `resources/skins.vector.styles/` is correct, plus a parallel `resources/skins.vector.styles.legacy/` and `resources/skins.vector.clientPreferences/` |
| `doc/configuration/configuration.md` | Confirmed at exactly this path |

`skin.json` is at the repo root (confirmed), and declares 9 named resource modules
(their full names are listed in §4). The 19 server-side component classes live at
`includes/Components/VectorComponent*.php`.

---

### §1. Vector — keep-list

For each feature listed in Phase 01 §3, this section records: what Vector does (in our
own words), which Vector files are responsible (paths only), and where the Hugo
reimplementation will live (which planning phase and which target file in our theme).

#### 1.1 Header

- **What Vector does.** The page-top chrome holds the project wordmark/logo on the
  left, the page title with optional indicators attached, a search input, and a row
  of personal-tools entry points at the top-right (account, talk, etc.). It is rendered
  on every page and acts as the primary orientation anchor.
- **Vector files of record.** `includes/templates/Header.mustache`,
  `includes/templates/PageTitlebar.mustache`, `includes/templates/Logo.mustache`,
  `includes/templates/SearchBox.mustache`. PHP classes:
  `includes/Components/VectorComponentSearchBox.php`.
  LESS: `resources/skins.vector.styles/components/Header.less`,
  `components/PageTitlebar.less`, `components/SearchBox.less`,
  `components/Logo.less`. JS: `resources/skins.vector.js/searchToggle.js`
  (mobile/responsive search behaviour).
- **Hugo reimplementation target.** Phase 3 partials under
  `layouts/partials/header/`. One partial per file-above (per `00-core.mdc`: one
  concern per file). Styles in `assets/scss/components/header/` etc., each ≤ 500
  lines.

#### 1.2 Sticky header

- **What Vector does.** After the user scrolls past the regular header, a condensed
  chrome docks at the top of the viewport. It holds a small version of the page title,
  a mini search box, and a quick-open trigger for the Table of Contents. The condensed
  version is generated from the same data as the regular header — it is not a
  separately-maintained chrome, it is a presentation layer that activates on scroll.
- **Vector files of record.** `includes/templates/BottomDock.mustache`,
  `includes/templates/PinnableContainer/{Pinned,Unpinned}/*.mustache`,
  `includes/Components/VectorComponentStickyHeader.php`,
  `includes/Components/VectorComponentPinnableContainer.php`,
  `includes/Components/VectorComponentPinnableHeader.php`.
  LESS: `resources/skins.vector.styles/components/StickyHeader.less` (in
  legacy bundle), `components/PinnableHeader.less`, plus the `layouts/toc/*.less`
  rule group that pairs with it. JS: `resources/skins.vector.js/stickyHeader.js`,
  `stickyHeaderAB.js`, `scrollObserver.js`, `pinnableElement.js`,
  `setupIntersectionObservers.js`, `deferUntilFrame.js`.
- **Hugo reimplementation target.** Phase 3 partial `layouts/partials/sticky-header/`.
  Phase 6 TS module `assets/ts/sticky-header/index.ts` (one entry; observer glue
  splits into submodules per `00-core.mdc`).

#### 1.3 Main menu sidebar (left column)

- **What Vector does.** A collapsible vertical list of portlets — the leftmost column
  on desktop. Each portlet is a labelled group (e.g. "Navigation", "Tools"). Each item
  can collapse/expand and the collapsed state can be persisted per-user. On narrow
  viewports the column collapses into an overlay drawer triggered from the header.
- **Vector files of record.** `includes/templates/MainMenu.mustache`,
  `MainMenuDropdown.mustache`, `MainMenuPinned.mustache`, `Menu.mustache`,
  `MenuContents.mustache`, `MenuListItem.mustache`. PHP classes:
  `VectorComponentMainMenu.php`, `VectorComponentMenu.php`,
  `VectorComponentMenuListItem.php`. LESS:
  `resources/skins.vector.styles/components/MainMenu.less`,
  `Menu.less`, `MenuTabs.less`. JS: `portlets.js`, `menuTabs.js`,
  `dropdownMenus.js`. Legend images: `resources/skins.vector.styles/images/`.
- **Hugo reimplementation target.** Phase 3 partials under
  `layouts/partials/sidebar/{main-menu,menu,menu-list-item,…}.html`. JS in
  `assets/ts/sidebar/{index.ts,collapse.ts,drawer.ts}`.

#### 1.4 Table of Contents (scroll-spy + collapsible)

- **What Vector does.** A dedicated, sticky-positioned column on the right that
  lists the article's headings. As the user scrolls, the heading matching the visible
  article section gets a visual highlight (scroll-spy). Sub-headings can be
  collapsed/expanded independently. When the viewport narrows it collapses back into
  the sticky header's quick-open trigger (§1.2).
- **Vector files of record.** `includes/templates/` has no dedicated T OC partial in
  the path listing we recorded (the TOC markup is rendered into the
  Sidebar/PageTools area by `SkinVector22.php`); for completeness its LESS lives at
  `resources/skins.vector.styles/components/TableOfContents.less` plus
  `layouts/toc/{pinned.less,unpinned.less}`. JS:
  `resources/skins.vector.js/tableOfContents.js`, `tableOfContentsConfig.json`,
  `sectionObserver.js`, `setupIntersectionObservers.js`.
- **Hugo reimplementation target.** Phase 3 partial
  `layouts/partials/toc/index.html`. Phase 6 TS module
  `assets/ts/toc/{index.ts,scroll-spy.ts,collapsible.ts}`. Frontend authors write
  headings as ordinary Markdown `## H2`s; Hugo emits them as `<h2 id="…">` and the
  TOC walker reads the generated DOM.

#### 1.5 Article body container (two-column-aware max-width layout)

- **What Vector does.** The single most recognizable Vector 2022 trait: the article
  body sits inside a constrained-width container, centred, with the left sidebar flush
  to its left edge and the ToC flush to its right edge. The columns re-flow to full
  width when the viewport is too narrow to hold all three. The user can also force the
  limited-width off via a preference (see `vector-limited-width` in §5).
- **Vector files of record.** `resources/skins.vector.styles/layouts/screen.less`
  defines the overall frame; the column splits live inline with the component styles
  above. PHP-level layout: `SkinVector22.php` chooses the appropriate column assembly.
- **Hugo reimplementation target.** Phase 5 SCSS layout group
  `assets/scss/layouts/{grid,article,columns}.scss`. The Phase 4 base template
  `layouts/_default/baseof.html` produces the three-column shell from partial
  outputs.

#### 1.6 Tabs widget (Article/Talk/Read/Edit/History/View source)

- **What Vector does.** A horizontal row of small clickable chips at the top of the
  page. The **widget itself** (rendering, keyboard navigation, the active-state visual,
  collapsing on narrow screens) is reusable. The **contents** the widget carries (a
  link to the edit view, a link to the page history, etc.) are server-state-dependent.
  Phase 01's spec is explicit about this distinction.
- **Vector files of record.** LESS: `resources/skins.vector.styles/components/MenuTabs.less`.
  JS: `resources/skins.vector.js/menuTabs.js`. Component class:
  `VectorComponentPageToolbar.php` (combines tabs with page tools).
- **Hugo reimplementation target.** Phase 3 partial
  `layouts/partials/tabs/index.html` rendering only the widget chrome. Phase 6 TS
  `assets/ts/tabs/{index.ts,collapse.ts}`. The actual tabs populated come from page
  front matter (`article`, `talk`, etc.) — see §2 for what content is excluded.

#### 1.7 Footer

- **What Vector does.** Below the article body, a row of last-modified info, license
  statement, and links to the project's policy pages (terms, privacy, etc.).
- **Vector files of record.** `includes/templates/Footer.mustache`,
  `Footer__row.mustache`, plus the legacy fallback
  `LegacyFooter.mustache`. LESS:
  `resources/skins.vector.styles/components/Footer.less`.
- **Hugo reimplementation target.** Phase 3 partial
  `layouts/partials/footer/index.html` driven from site params
  (license name, last-modified commit date comes from Hugo's own metadata).

#### 1.8 Theme switcher (light / dark / automatic)

- **What Vector does.** A discrete control in the personal-tools area lets the user
  pick light, dark, or "match OS". The choice is stored client-side (MediaWiki's
  client preferences system) and applied by toggling a `data-theme` (or equivalent)
  attribute on the root; the entire theme flips through CSS custom properties defined
  in `CSSCustomProperties.less`.
- **Vector files of record.** `includes/templates/Appearance.mustache`,
  `includes/Components/VectorComponentAppearance.php`,
  `resources/skins.vector.styles/components/Appearance.less`,
  `resources/skins.vector.styles/CSSCustomProperties.less`. JS module:
  `resources/skins.vector.js/clientPreferences.js`,
  `resources/skins.vector.clientPreferences/clientPreferences.js`.
- **Hugo reimplementation target.** Same theme-switcher UX, but the storage layer
  becomes `localStorage` (no MediaWiki client preferences backend). Same
  `data-theme`-attribute pattern, same custom-property swap. Phase 3 partial
  `layouts/partials/theme-toggle/` and Phase 6 TS module
  `assets/ts/theme-toggle/`.

#### 1.9 Infobox integration (touch-points only; full research is Phase 2)

- **What Vector does.** The Infobox is *article content*, not part of the skin, but
  the skin shapes the visual contract around it: float behaviour at wide widths, the
  ToC panel reflows if the infobox is at the top, narrow-viewport stacking order,
  caption typography. Vector styles the Infobox's rendered HTML through generic
  selectors so the infobox and the skin agree on the spacing.
- **Vector files of record.** LESS: generic typography and table rules in
  `resources/skins.vector.styles/typography.less`, `mixins.less`,
  `components/SiteNotice.less`, plus table CSS in
  `resources/skins.vector.js/tables.js` (responsive wrapper). The Infobox-specific
  research (template parameter concepts, layout decisions) is deferred to Phase 2 per
  the plan.
- **Hugo reimplementation target.** Hugo shortcode `layouts/shortcodes/infobox/`
  produced in Phase 8. Skin-side overrides under
  `assets/scss/components/infobox.scss` and an optional rule in
  `_default/single.html` partial stacking order.

---

### §2. Vector — exclude-list

For each feature Vector ships that this theme **does not** reproduce, this section
records: what the feature is (our own words), why it is excluded, and whether any
Hugo-world replacement is planned.

| Excluded feature | What it is | Why we exclude it | Hugo replacement? |
|---|---|---|---|
| Login / Create account links | Top-right personal-tools entries that route to MediaWiki's auth flow. | A static site has no user accounts, so no auth flow exists. | No. Personal-tools area in Phase 3 partial just omits these entries. |
| Watchlist star | A star icon you click to bookmark a page to a server-side list of "watched" pages. | Requires a logged-in user and server-side persistence of watched-page state. | No. The icon itself is also omitted. |
| Edit / View history / Talk tabs (the **content** inside the tab widget) | The page-action tab slots whose targets are the wiki edit UI, the diff/history UI, the talk-page UI. | We keep the tab **widget** (Phase 1.6), but not these targets — they each require a server-side action endpoint. | Partially. If a site author wants to link to a GitHub "Edit this page" or an issue tracker, they can do that via front matter or a hook the theme exposes. Pre-baked defaults are not shipped. |
| VisualEditor hooks and edit-mode toggles | The client-side rich-text editor that MediaWiki ships in-line. | Editing requires the MediaWiki backend; the editor itself drags in a large OO.js framework. | No. |
| CSRF tokens / edit-session tokens | Hidden form fields MediaWiki emits to prove the submission came from a session-authenticated POST. | No edit form ⇒ no token required. | No. |
| ResourceLoader startup manifest / module loader | MediaWiki's runtime which dynamically fetches & lazily-loads JS/CSS modules from a `load.php?modules=…` URL. | Hugo builds static assets at build time and ships them as bundled CSS / `<script type="module">` files. No runtime loader is needed. | Entirely. Hugo Pipes + a plain ES-module entrypoint replaces it. |
| `mw.*` JS API (`mw.config`, `mw.loader`, `mw.Api`, …) | The ambient namespace MediaWiki makes available to every script (config bag, module loader, API client). | These symbols do not exist outside MediaWiki. | We expose equivalent helpers as plain TS modules (`assets/ts/api/`, `assets/ts/config/`) that read from Hugo-injected JSON instead. |
| Live search-as-you-type against `action=opensearch` / `action=query` | The header search box's debounced server round-trip to MediaWiki's API. | No API to call. | Yes — a **build-time** static JSON index of titles (`/search-index.json`, generated at build) loaded by the search box on focus. |
| Echo notifications bell | Header bell + dropdown showing notifications fan-out from a server. | Requires a notifications backend. | No. |
| Page-protection padlock icons, page-move/delete tabs | Visual indicators that the page is locked, semi-protected, or flagged for admin action. | Admin/server-state features with no equivalent in a static site. | No. |
| Interlanguage links driven by Wikidata | The auto-detected list of "Read this page in [other languages]" link language alternates pulled from the Wikidata item for the topic. | Out of scope; no live Wikidata lookup. | Manual: theme site-params may declare language alternates per page via front matter. |

One judgment call worth flagging (per Phase 14's "stop-and-flag" protocol):
**"Watchstar" is excluded, but the LESS component `Watchstar.less` is conceptually
adjacent to a future "favorite this article" widget that some users might want.**
We are explicitly excluding it. If a real user need surfaces, it would land in a
later phase as a frontend-only `localStorage`-backed widget — never an authoring
backend. Nothing to change in this phase; flagging for the record so Phase 2/+
doesn't quietly inherit it.

---

### §3. CSS source mapping (which LESS → which SCSS target, per Phase 5)

The upstream LESS tree is reorganized into Hugo partials per **one component per SCSS
file** (`00-core.mdc`). Path columns are paths only; the content is rewritten from
scratch. When a LESS file is the source for zero Phase 5 SCSS files, that means "we
read it for understanding but do not transcribe a counterpart".

| Vector LESS path | Our SCSS target | Notes |
|---|---|---|
| `resources/skins.vector.styles/skin.less` | split across `assets/scss/base/_reset.scss` + per-component files | The entry point; mostly @imports |
| `resources/skins.vector.styles/variables.less` | `assets/scss/base/_tokens.scss` + `_theme.scss` | Design tokens — reimplemented, not copied |
| `resources/skins.vector.styles/mixins.less` | `assets/scss/base/_mixins.scss` | Helper mixins — reimplemented from concept |
| `resources/skins.vector.styles/normalize.less` | `assets/scss/base/_normalize.scss` | Generic reset |
| `resources/skins.vector.styles/typography.less` | `assets/scss/base/_typography.scss` | Body text — reimplemented |
| `resources/skins.vector.styles/print.less` | `assets/scss/layouts/_print.scss` | Print stylesheet |
| `resources/skins.vector.styles/CSSCustomProperties.less` | `assets/scss/base/_tokens.scss` (with theme modifier hooks) | The custom-property system is what makes theme switching possible |
| `resources/skins.vector.styles/links.less` | `assets/scss/components/_links.scss` | |
| `resources/skins.vector.styles/layouts/screen.less` | `assets/scss/layouts/_grid.scss` | The two/three-column grid |
| `resources/skins.vector.styles/layouts/grid.less` | merged into `layouts/_grid.scss` | |
| `resources/skins.vector.styles/layouts/toc/pinned.less` | `assets/scss/components/toc/_pinned.scss` | |
| `resources/skins.vector.styles/layouts/toc/unpinned.less` | `assets/scss/components/toc/_unpinned.scss` | |
| `resources/skins.vector.styles/components/Appearance.less` | `assets/scss/components/appearance/_index.scss` | |
| `resources/skins.vector.styles/components/BottomDock.less` | (rolled into the sticky-header partial style) | |
| `resources/skins.vector.styles/components/Button.less` | `assets/scss/components/_button.scss` | |
| `resources/skins.vector.styles/components/Dropdown.less` | `assets/scss/components/dropdown/_index.scss` | |
| `resources/skins.vector.styles/components/Footer.less` | `assets/scss/components/footer/_index.scss` | |
| `resources/skins.vector.styles/components/Header.less` | `assets/scss/components/header/_index.scss` | |
| `resources/skins.vector.styles/components/Icon.less` | `assets/scss/components/_icon.scss` | |
| `resources/skins.vector.styles/components/Indicators.less` | `assets/scss/components/header/_indicators.scss` | |
| `resources/skins.vector.styles/components/LanguageDropdown.less` | `assets/scss/components/_language-dropdown.scss` | |
| `resources/skins.vector.styles/components/Logo.less` | (within `_index.scss` of header) | |
| `resources/skins.vector.styles/components/MainMenu.less` | `assets/scss/components/sidebar/_main-menu.scss` | |
| `resources/skins.vector.styles/components/Menu.less` | `assets/scss/components/sidebar/_menu.scss` | |
| `resources/skins.vector.styles/components/MenuTabs.less` | `assets/scss/components/_tabs.scss` | |
| `resources/skins.vector.styles/components/PageTitlebar.less` | (within header `_index.scss`) | |
| `resources/skins.vector.styles/components/PageToolbar.less` | (rolled into tabs partial style) | |
| `resources/skins.vector.styles/components/PageTools.less` | `assets/scss/components/sidebar/_page-tools.scss` | |
| `resources/skins.vector.styles/components/PinnableElement.less` | (within sticky-header partial style) | |
| `resources/skins.vector.styles/components/PinnableHeader.less` | (within sticky-header partial style) | |
| `resources/skins.vector.styles/components/SearchBox.less` | `assets/scss/components/header/_search-box.scss` | |
| `resources/skins.vector.styles/components/SiteNotice.less` | (out of scope — no equivalent in static site) | |
| `resources/skins.vector.styles/components/TableOfContents.less` | `assets/scss/components/toc/_index.scss` | |
| `resources/skins.vector.styles/components/UserLinks.less` | `assets/scss/components/header/_user-links.scss` | |
| `resources/skins.vector.styles/components/Watchstar.less` | excluded — see §2 | |
| `resources/skins.vector.styles.legacy/*` | not ported — legacy fallback is out of scope for this reimplementation | |
| `resources/skins.vector.clientPreferences/clientPreferences.less` | (rolled into appearance partial style) | |
| `resources/skins.vector.js/stickyHeader.less` | `assets/scss/components/sticky-header/_index.scss` | |
| `resources/skins.vector.js/tableOfContents.less` | (rolled into toc) | |
| `resources/skins.vector.js/popupNotification.less` | excluded | |
| `resources/skins.vector.js/bottomDock.less` | (rolled into sticky-header) | |
| `resources/skins.vector.js/index.less` | combined imports file | |

---

### §4. JS source mapping (which ES module → which TS target, per Phase 6)

Following `00-core.mdc` ("one behavior per TS module"), each upstream ES module
maps to one or two TS files. Where the upstream module depends on `mw.*` symbols
the corresponding TS module must read from a Hugo-injected config object instead —
this is the most common mechanical change. Where a module depends on a server-side
endpoint (watchstar, typeahead API call, notifications), the TS target is omitted.

| Vector JS path | Our TS target | Notes |
|---|---|---|
| `resources/skins.vector.js/skin.js` | `assets/ts/index.ts` (entry) | Plus per-feature entrypoints |
| `resources/skins.vector.js/features.js` | `assets/ts/features.ts` | Maps server-injected config into per-feature init |
| `resources/skins.vector.js/stickyHeader.js` | `assets/ts/sticky-header/index.ts` | |
| `resources/skins.vector.js/stickyHeaderAB.js` | excluded — A/B test infrastructure | |
| `resources/skins.vector.js/scrollObserver.js` | `assets/ts/util/scroll-observer.ts` | Reusable observer helper |
| `resources/skins.vector.js/sectionObserver.js` | `assets/ts/util/section-observer.ts` | |
| `resources/skins.vector.js/setupIntersectionObservers.js` | `assets/ts/util/setup-intersection-observers.ts` | |
| `resources/skins.vector.js/deferUntilFrame.js` | `assets/ts/util/raf.ts` | Generic rAF helper |
| `resources/skins.vector.js/pinnableElement.js` | `assets/ts/sticky-header/pinnable.ts` | |
| `resources/skins.vector.js/tableOfContents.js` | `assets/ts/toc/index.ts` | |
| `resources/skins.vector.js/menuTabs.js` | `assets/ts/tabs/collapse.ts` | |
| `resources/skins.vector.js/portlets.js` | `assets/ts/sidebar/portlets.ts` | |
| `resources/skins.vector.js/dropdownMenus.js` | `assets/ts/dropdown/index.ts` | |
| `resources/skins.vector.js/searchToggle.js` | `assets/ts/header/search-toggle.ts` | |
| `resources/skins.vector.js/languageButton.js` | excluded scope | |
| `resources/skins.vector.js/userPreferences.js` | `assets/ts/theme-toggle/preferences.ts` | localStorage adapter |
| `resources/skins.vector.js/disableNightModeIfGadget.js` | excluded | |
| `resources/skins.vector.js/popupNotification.js` | excluded | |
| `resources/skins.vector.js/watchstar.js` | excluded | |
| `resources/skins.vector.js/tables.js` | `assets/ts/util/responsive-tables.ts` | Optional responsive wrapper |
| `resources/skins.clientPreferences/clientPreferences.js` | `assets/ts/theme-toggle/index.ts` | |
| `resources/skins.vector.search/skins.vector.search.js` | `assets/ts/header/search.ts` | Loads the static JSON index instead of MediaWiki API |

---

### §5. Configuration surface — candidate `theme.toml` params

The following site-wide toggleable behaviour is documented in the upstream
configuration document (`reference/vector/doc/configuration/configuration.md`)
and is worth exposing as `theme.toml` parameters, organised by who turns the
dials (site author vs. end-user preference).

**Site-level (admin choices in `theme.toml` / site config):**

| Upstream knob | What it controls | Default | Expose as |
|---|---|---|---|
| `wgVectorMaxWidthOptions` | Constrained- vs. full-width reading layout | limited-width on | `theme.toml`: `[params.layout] maxWidth = "limited" \| "unlimited"` |
| `wgVectorTableOfContentsCollapseAtCount` | Auto-collapse large ToCs at this heading count | 28 | `theme.toml`: `[params.toc] collapseAtCount = 28` |
| `wgVectorLanguageInHeader` | Show language selector in header | off | `theme.toml`: `[params.language] inHeader = false` |
| `wgVectorLanguageInMainMenu` | Show language selector in main menu | off | `theme.toml`: `[params.language] inMainMenu = false` |
| `wgVectorTypeahead` | Enable type-ahead suggestion in search box | on | `theme.toml`: `[params.search] typeahead = true` |
| (Phase 14: extracted from sticky-header behaviour) | Pin/unpin sticky header | on | `theme.toml`: `[params.stickyHeader] enabled = true` |
| (Phase 14: extracted from main menu behaviour) | Pin/unpin left main menu | off | `theme.toml`: `[params.sidebar] mainMenuPinned = false` |
| (Phase 14: extracted from page tools behaviour) | Pin/unpin right page-tools | off | `theme.toml`: `[params.sidebar] pageToolsPinned = false` |
| (Phase 14: extracted from ToC behaviour) | Pin/unpin table of contents | on | `theme.toml`: `[params.toc] pinned = true` |
| (Phase 14: extracted from appearance behaviour) | Pin/unpin appearance menu | on | `theme.toml`: `[params.appearance] pinned = true` |

**User preferences (client-side; preserved via `localStorage`):**

| Upstream preference | What it controls | Storage in our theme |
|---|---|---|
| `vector-limited-width` | constrained- vs. full-width article body | `localStorage` key `vhskin:layout` |
| `vector-page-tools-pinned` | pin page-tools | `localStorage` key `vhskin:sidebar:pageTools` |
| `vector-main-menu-pinned` | pin main-menu | `localStorage` key `vhskin:sidebar:mainMenu` |
| `vector-toc-pinned` | pin ToC | `localStorage` key `vhskin:toc` |
| `vector-appearance-pinned` | pin appearance | `localStorage` key `vhskin:appearance` |
| `vector-font-size` | font size preference (regular / large / x-large) | `localStorage` key `vhskin:fontSize` |
| `vector-theme` | light / dark / OS preference | `localStorage` key `vhskin:theme` |

Phase 7 (`07-theme-config-and-front-matter.md` per plan) will confirm the final
naming; the names above are placeholders to ensure Phase 3-6 can resolve these as
sensible defaults rather than baking in magic numbers.

---

## Status / handoff

- **Phase 1 DoD:** clone present + gitignored ✓ — keep/exclude list written ✓ —
  no Vector source in tracked files ✓ — `docs/RESEARCH.md` complete in original
  words ✓.
- **Phase 2 readiness:** the Infobox research stage can begin using this document
  as the "skin-side contract" reference (especially §1.9 touch-points and the
  `layouts/shortcodes/infobox/` target). No Phase 2 work has begun.

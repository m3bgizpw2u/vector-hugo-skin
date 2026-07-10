# Research Notes

> **This document is original analysis.** No code from `reference/vector/` is reproduced
> here. Vector source files are referenced by path only. Per the licensing boundary
> recorded in `.plans/first-plan/14-licensing-and-scope-notes.md`, every CSS and JS
> deliverable in this theme is a reimplementation built from understanding Vector's
> behavior — never a transpilation or near-verbatim adaptation of its source.

> **Phase 2 added §6 — Infobox research.** Section 7 lists the top-30 named
> shortcodes that will ship in v1 (the "coverage contract" for the family of named
> infobox shortcodes). §7 will be finalised by the Phase 2½ executor; the v1 list
> reproduced here is the working list from `.plans/first-plan/2a-infobox-template-inventory.md`
> so downstream phases can refer to a concrete scope without re-deriving it.

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

---

## Phase 2 — Infobox Templates

### Why a separate phase from Phase 1

The Vector 2022 skin study (Phase 1) covered only the surrounding *chrome* — header,
sidebar, ToC, the container grid. The **Infobox** is *article content*: it is rendered
by MediaWiki's `Template:Infobox` metatemplate and the topic-specific children built on
top of it (`Template:Infobox person`, `Template:Infobox settlement`, …). Those
templates run inside MediaWiki's Template/Module (Lua/Scribunto) system — there is no
Lua runtime in Hugo, no transclusion mechanism, and no parser functions at build time.
So "port the template code" is literally impossible; the only honest mapping is:
**study the rendered output, study the parameter concepts, rebuild the concept from
scratch as a Hugo shortcode family**.

Phase 1's §1.9 already pinned the **skin-side contract** for whatever this phase
produces: the infobox is article content, the skin just styles the box and respects
its float behaviour. That piece does not change here. Phase 2 narrows in on the
article-side contract: what an infobox *is*, what every variant needs to express, and
the four design decisions the reimplementation commits to.

### What Phase 2 studied

The structural understanding below comes from publicly-rendered Wikipedia documentation
pages and the rendered DOM of a few live articles. No MediaWiki source, template
wikitext, or CSS file was copied into this repository — the `reference/` directory is
gitignored and Phase 14 explicitly forbids verbatim excerpts regardless.

#### §2.1 The `Template:Infobox` metatemplate, in our own words

`Template:Infobox` is documented as the **metatemplate** that topic-specific children
sit on top of. Conceptually it lays out an outer container with a fixed vertical
ordering of slots, **top to bottom**:

1. A **title cell** at the very top — either as a caption above the table or as a
   bold cell inside the table (or both). `title` / `above` / `subheader`.
2. An **image row** that holds one or more images, optionally with captions underneath.
   `image` / `caption` (and `image2` / `caption2`, etc., when more than one).
3. A **sequence of rows**, each of which is one of three kinds:
   - **Header row**: a single label spanning both columns, visually distinguished from
     data rows, used to group a section of rows that follow (e.g. "Personal life",
     "Career", "Legacy").
   - **Label/data row**: a two-column row where the left cell is the field label and
     the right cell is the field value. This is the dominant row type.
   - **Free-form row**: a single-cell row, used when one piece of text spans the whole
     row width (e.g. "Aliases" with several values, or a "Born" combined-name-and-dates
     cell).
4. An optional **`below` footer row** — a single full-width cell at the very bottom,
   intended for footnotes, see-also links, or any trailing commentary the article
   author wants to keep inside the box instead of in the body.
5. An auxiliary bottom row with "view / talk / edit" links — **out of scope** for
   the static theme (no edit flow exists).

Two MediaWiki-isms are noteworthy because they are **not** what the Hugo reimplementation
should copy:

- Parameter numbering. The metatemplate exposes `header1..N`, `label1..N`, `data1..N`,
  etc., because wikitext cannot express structured arrays. Hugo shortcode params are
  already structured, so named labels (e.g. `birth_date`) used as the **value's name**
  (per `Wikipedia:Manual of Style/Infoboxes`) are the right unit — no `label1`/`data1`
  numbering is needed.
- Optional-rows convention. If `dataN` is empty, the metatemplate suppresses that
  whole row. In Hugo this naturally falls out of `with` blocks, but the reimplementation
  must commit to the same "absent values leave no empty rows" guarantee so authors
  who mirror the upstream MediaWiki form do not see empty placeholders in the output.

The MoS guidance for parameter naming is also worth absorbing even though it is upstream
convention: parameters should be **named, snake_case, lower-case unless a proper noun,
consistent across templates** (`birth_date` reused on `Infobox person`, `Infobox
military person`, etc.; `coordinates` reused on every geo-flavored template). The
reimplementation adopts the same conventions so an author moving a Wikipedia article
into a Hugo site does not have to renumber their field names.

#### §2.2 What 2–3 child templates actually use, in our own words

Reading across the topic-specific documentation for person, company, software, and
settlement, every named child template is a thin parameter forwarder that maps its own
named parameters onto the metatemplate's `header(n)` / `label(n)` / `data(n)` slots,
and adds a handful of topic-specific labelled rows. The recurring structural patterns:

- **A title-bearing header**, almost always with an optional alternate small image
  (logo for a company, screenshot for software, portrait for a person) and the same
  `image` + `caption` + alt-text shape.
- **A short "identity" band of rows** immediately under the image (occupation,
  industry, platform, settlement type, etc.) — these differ per topic but always fit
  the label/data row pattern.
- **One to three section dividers** grouping related rows. Person uses "Personal life",
  "Career", "Legacy"; software uses no headers (and gets away with it because the
  natural row order is already self-grouping); settlement uses "Government", "Area",
  "Demographics" as anchors around dense numeric groups; company uses industry-driven
  breakouts ("Products", "Operations", "Financials" in the heavyweight versions).
- **Topic-specific numeric or date pairs** that always appear together and are worth
  a dedicated render slot — see §6.2 and §7 below for the special-case primitives
  derived from these.

A relevant observation from the MoS: an infobox should be **visual, summary-level, no
prose**. That informs two implementation choices below (small label column, narrow max-
width, no automatic prose-style text inside data cells).

#### §2.3 Renderer-side observations (own words)

Inspecting the rendered DOM of a couple of articles in DevTools (Pathé film, Linux
distribution, Chicago, Ada Lovelace as a smoke-check that the pattern holds across
topics), the visual contract is consistent:

- The outer container is a relatively narrow box (roughly 22em wide per MoS, ~300px
  on standard desktop) floated to the right edge of the article column. The body
  text wraps around it on the left.
- The title is bold and slightly larger than body text, often centered or left-aligned
  depending on variant. The image (when present) is centered above or below the title.
- Each header row spans both columns and gets a tonal background tint (a soft grey or
  blue across wikis), clearly distinct from data rows. Label/data rows have the label
  cell slightly tinted and slightly bolder than the data cell — the typical "key/value"
  reference-table treatment.
- The `below` footer (when present) is full-width and visually subordinate.
- On narrow viewports the float is collapsed — the box becomes a full-width block,
  typically repositioned above the lead's first paragraph continuation or just below
  the lead, not floated alongside body text any more.

This visual contract is what §6.3 fixes as the responsiveness commitment.

---

### §6. Locked-in design decisions

These four decisions are the outputs of Phase 2. They will be re-stated and
operationalised in `docs/SHORTCODES.md` during Phase 8 (the shortcode implementation
phase); locking them down here means Phases 3–7 already know what to budget for.

#### Decision 1 — Family of named shortcodes

**What we are building.** A small family of named Hugo shortcodes — one per MediaWiki
`Infobox <topic>` template — written inline in the Markdown body of an article. The
naming is the shortcode is named after the topic (`{{< person >}}`, `{{< company >}}`,
`{{< software >}}`, `{{< settlement >}}`, …). Each accepts the **same named
parameters** as the upstream MediaWiki template (snake_case, lower-case proper nouns
preserved) so that an author copy-pasting a Wikipedia infobox body is a small
edit, not a rewrite.

All named shortcodes render through one shared base partial,
`partials/infobox/base.html`, which holds the actual structural HTML and class
hooks. The named wrapper file is a thin, **mechanical** map from its parameter set
onto the base partial's slot list — typically 15–30 lines of Go-template (per the
hard limit in `00-core.mdc` and per the §7 budget this phase commits the family to).
New topics do not need new partials; they need only a new wrapper file. New visual
behaviour is a one-rule SCSS addition keyed on the `data-infobox-type="{slug}"`
attribute the wrapper sets, **never** a per-template CSS file.

There is also an **escape hatch**: a parallel set of inner-primitive shortcodes
(`infobox-row`, `infobox-image`, `infobox-section`, `infobox-below`, plus the
`infobox-pair-*` family in Decision 2) that authors can use directly inside a
named wrapper when a field the wrapper does not name needs to be expressed. The
primitives map onto the same base partial, so an escape-hatch construction is
visually identical to a named-field construction.

**Folder convention.** Per `00-core.mdc`'s rule that every shortcode lives in its own
folder regardless of file count, each named shortcode lives at
`layouts/shortcodes/{slug}/{slug}.html`, where `{slug}` is the kebab-case shortcode
name. The inner primitives live at `layouts/shortcodes/infobox/infobox-{primitive}.html`
(same folder, kebab-case file name to keep Go-template lookup unambiguous). The single
shared partial lives at `partials/infobox/base.html` (per `00-core.mdc`: one page region
per partial).

**Rationale.** This shape gives us (a) ergonomic Wikipedia-style authoring for the
~30 templates that matter, (b) a trivial "add a template later" procedure that a
site author can follow without recompiling the theme, and (c) an escape hatch for
the long tail without polluting named wrappers. The phase-1 skin-side §1.9 already
commits to `layouts/shortcodes/infobox/` as the target; this decision formalises the
naming and the wrapper-vs-primitive split inside it.

**What this covers.** Every named shortcode in §7. The escape-hatch primitives cover
non-standard fields the named wrappers do not enumerate. **What this excludes.**
Bringing the *full* MediaWiki parameter surface into a single mega-template with
`header1..N` / `label1..N` / `data1..N` slots. **Phase that implements it.** Phase 8
(infobox shortcode spec and implementation), with §7's list acting as the coverage
contract — the wrappers themselves are written in Phase 8, but their structure,
count, and target paths are fixed here.

#### Decision 2 — v1 field set and inner primitives

**What we are building.** Three categories of field, each with an explicit name and a
target render slot:

1. **Title block.** `title` (required) — the head of the box, rendered in the
   title cell, bold, slightly larger font than body text. `title` is the only
   mandatory field on every named shortcode; no name → no box (consistent with
   upstream, where absent title is also treated as a degenerate case).
2. **Image row.** `image` (filename only, site-relative under `static/` or page-
   bundle-relative path), `caption` (free text underneath), and `alt` (text-to-
   speech description, mapped to the `alt` attribute). All three are optional and
   are rendered as a single image + caption block centred under the title.
3. **Body rows.** Three primitives cover all body content:
   - `infobox-row` — a label/value pair. Author writes the label inside the
     shortcode body, the value either as a param or as the inner content. Absent
     value ⇒ row omitted (matches upstream's "no empty rows" guarantee).
   - `infobox-section` — a header cell spanning both columns, used to group rows
     below it. Optional `data-empty-hide` so the section silently disappears when
     every row it groups is empty.
   - `infobox-below` — the optional freeform footer row at the bottom of the box
     (the upstream `below` slot).

Named shortcode wrappers map their own parameters onto these primitives in a fixed
order that mirrors the upstream MediaWiki template's row order, so the visual output
matches the upstream rendering when authors use the documented parameters.

**Special-case inner primitives — `infobox-pair-*`.** A handful of label/value
*groups* appear so often across templates that giving each one its own named inner
shortcode is cheaper than asking authors to compose them out of `infobox-row`s.
Initial set (the exact list and which templates use each is finalised by the
Phase 2½ coverage contract in §7):

- `infobox-pair-date` — a date + place/name pair. Used by `person` (birth/death),
  `military-person`, the sport-biography forks, `organization`, `political-party`,
  `country`, `university`, `school`, `church`, `television-season`, `protected-area`,
  `award`, `station`, `historic-site`, `military-unit`, `military-conflict`,
  `television-episode`, and others where the upstream pattern is the same
  "born/founded/established/added + date + optional place" triplet.
- `infobox-pair-software-release` — `latest_release_version` + `latest_release_date`
  (optionally platform-specific). Used by `software`, `video-game`.
- `infobox-pair-population` — a census pair + an estimate pair with year labels.
  Used by `settlement`, `country`.
- `infobox-pair-area` — total / land / water area with unit normalisation. Used by
  `settlement`, `country`.
- `infobox-pair-air-date` — first-aired / last-aired. Used by `television`,
  `television-episode`, `television-season`.
- `infobox-pair-budget-gross` — `budget` + `gross` numeric pair with currency.
  Used by `film`.
- `infobox-pair-episode-season` — `num_episodes` + `num_seasons`. Used by
  `television`, `television-episode`.

**Why pairs, not "row groups".** These fields always appear together in upstream
infoboxes and are visually presented with the date beneath the value, in a tighter
font, on a single line — a pattern generic `infobox-row` cannot reproduce cleanly.
Promoting each recurring pair to a primitive keeps the per-row markup thin and gives
the renderer a hook for the tighter styling.

**Folder convention.** The pair primitives live next to the other primitives at
`layouts/shortcodes/infobox/infobox-pair-{name}.html` and render through a small
partial each under `partials/infobox/special/`.

**Rationale.** Phase 14's "study structure and parameter concepts, do not copy
code" rule forces this decision to be a *clean room* design rather than a
transcription. The result is a small, composable primitive set (~10 shortcodes
covering the bulk of infobox usage) rather than a long enumeration of named
shortcodes that all mimic upstream parameter lists.

**What this covers.** Every named shortcode's common-parameters surface. The
special-case primitives cover the recurring multi-field groups; one-off fields
fall through to the `infobox-row` escape hatch.

**What this excludes.** Lua-driven formatting (e.g. automatic unit normalisation,
ISO-date canonicalisation). The primitives accept raw user-supplied text — the
author is responsible for consistency. This is a deliberate scope cut: the upstream
templates do this in Lua modules, which has no Hugo analogue.

**Phase that implements it.** Phase 8. The primitives are the first files written
because they establish the vocabulary; the named wrappers (Decision 1) are written
on top of them.

#### Decision 3 — Responsiveness

**What we are building.** The infobox is **floated to the right with a max-width** on
desktop (matching the MoS guidance of ~22em and the rendered observation above), and
**stacked full-width below the lead paragraph** on mobile, where the float is
collapsed. The viewport breakpoint is the same one Phase 3 / Phase 5 will adopt for
the rest of the chrome (not redefined here) — the infobox follows whatever the site
author configures as "mobile" via `theme.toml`.

The skin-side contract already settled in §1.9 carries through unchanged: the
infobox is article content, the skin just styles the box. The SCSS lives at
`assets/scss/components/infobox.scss` (one component per file per `00-core.mdc`),
with desktop and narrow-viewport rules in the same file. Implementation notes for
Phase 5 and Phase 8: the SCSS rules are scoped to `[data-infobox-type="..."]` to
keep per-template tweaks local to a single attribute selector.

**Rationale.** This is the rendered pattern observed upstream (§2.3) and the way the
MoS positions the box: floats right at wide widths, takes the full row at narrow
widths. It is also what the Phase-1 styling of the article container was already
designed around (§1.5).

**What this covers.** All named shortcodes in §7. **What this excludes.** Multiple
breakpoint tiers (e.g. a tablet-only "narrow but still floated" tier) — the theme ships
two states, "side" and "top". **Phase that implements it.** Phase 5 (the SCSS rule
group) plus Phase 8 (the template emits the attribute hooks the SCSS targets).

#### Decision 4 — Out of scope for v1

Items explicitly **not** shipped in v1, with the scoping rationale written down so
silently-omitting them cannot be confused with an oversight:

- **Geographic coordinate maps** (the upstream `{{coord}}` template + interactive
  map embed used by `settlement`, `country`, etc.). Out of scope because the
  embedded map would pull in a JS map widget and an external tile service at
  runtime — incompatible with a static-theme build whose `public/` is "zero JS
  runtime dependencies" per `00-core.mdc`. Coordinates as **text** (decimal lat/long
  or `°N/°E` notation) are still accepted; only the map widget is excluded.
- **Embedded mini-charts / timelines** (length-of-reign bars, population trend
  sparklines used by some historical-biography forks). Out of scope as image-
  generation; raw text data is still representable via `infobox-row`.
- **Collapsible sub-tables inside the infobox itself** (e.g. nested
  per-season-statistics tables in sport-biography forks). Out of scope — they
  inflate the primitive set past the row/section vocabulary of Decision 2 and
  the parent does not have an equivalent at this granularity. Authors needing
  one can link to an external site page or a per-template concrete decision in a
  later phase.
- **Wikidata property tracking** — the `P18`, `P946`, `P17`, etc. fallbacks the
  upstream templates perform against the live Wikidata API. Out of scope; the
  Hugo theme has no runtime to call an external lookup service.
- **Lua/Scribunto modules** — every upstream template's runtime data shaping
  (e.g. `Module:Person date`, `Module:Coordinates`). The reimplementation
  accepts raw user-supplied strings and does not canonicalise.
- **Wikipedia microformat emission** (`hCard` / `hCalendar` markup on the rendered
  infobox). Out of scope for a generic Hugo site — relevant only if the theme is
  consumed by external Wikipedia-data scrapers, which is not the target use case.

**Rationale.** Each of these would either impose a runtime dependency incompatible
with the static-theme model or expand v1 past a small primitive set without
disproportionate real-world utility. Phase 2½ may re-evaluate any of them based on
author demand; Phase 14 already draws the line at "study, don't ship".

**What this covers.** None of the above — by definition. **Phase that implements
it.** None — Phase 2 *records* the cut; future phases may revisit any item via the
§6.5 procedure if there is concrete demand.

---

### §7. Coverage contract — top-30 named shortcodes for v1

This section is the **coverage contract** for Decision 1's family of named
shortcodes: the list of MediaWiki `Infobox <topic>` templates that become a Hugo
named shortcode in v1. It is reproduced here from
`.plans/first-plan/2a-infobox-template-inventory.md` §4 so that downstream phases
(3–7) can reference a concrete target list without re-deriving it. **The Phase 2½
executor will re-verify the transclusion ordering before Phase 8 begins**, may re-rank
rows, and may add or remove templates that fall outside the top-30 cap. Treat the
table below as the working baseline.

| # | MediaWiki template | Hugo shortcode | Approx. transclusions (2026-06-18) | Special-case field groups |
|---|---|---|---|---|
| 1 | `Template:Infobox settlement` | `{{< settlement >}}` | 530,561 | `coordinates`, elevation, `infobox-pair-area`, `infobox-pair-population` |
| 2 | `Template:Infobox person` | `{{< person >}}` | 290,129 | `infobox-pair-date` (birth/death) |
| 3 | `Template:Infobox film` | `{{< film >}}` | 164,233 | release-date, runtime, `infobox-pair-budget-gross` |
| 4 | `Template:Infobox company` | `{{< company >}}` | 92,000 | founded/dissolved pair, type, headquarters, key-people list, products list, revenue/operating-income/net-income/equity totals |
| 5 | `Template:Infobox software` | `{{< software >}}` | 14,000 | `infobox-pair-software-release` (per-platform), operating-system list, license, programming-language list, status |
| 6 | `Template:Infobox football biography` | `{{< football-biography >}}` | 149,852 | `infobox-pair-date` (birth), height, position, club-career sections |
| 7 | `Template:Infobox station` | `{{< station >}}` | 31,592 | line, platform count, opened-date, coordinates |
| 8 | `Template:Infobox NRHP` | `{{< historic-site >}}` (alias `nrhp`) | 63,086 | coordinates, NRHP reference number, added-to-NRHP date |
| 9 | `Template:Infobox television` | `{{< television >}}` | 61,015 | network, `infobox-pair-air-date`, `infobox-pair-episode-season` |
| 10 | `Template:Infobox military person` | `{{< military-person >}}` | 39,401 | `infobox-pair-date` (birth/death), service-years pair |
| 11 | `Template:Infobox school` | `{{< school >}}` | 38,223 | established/closed dates, enrollment, mascot |
| 12 | `Template:Infobox video game` | `{{< video-game >}}` | 28,953 | release-date pair (platform-by-platform), engine, modes |
| 13 | `Template:Infobox university` | `{{< university >}}` | 25,875 | established/closed dates, type, students, mascot, motto |
| 14 | `Template:Infobox military unit` | `{{< military-unit >}}` | 23,839 | active-dates pair, branch, garrison |
| 15 | `Template:Infobox basketball biography` | `{{< basketball-biography >}}` | 23,048 | `infobox-pair-date` (birth), height, position, career stats |
| 16 | `Template:Infobox baseball biography` | `{{< baseball-biography >}}` | 22,036 | `infobox-pair-date` (birth), bats/throws, position, career stats |
| 17 | `Template:Infobox military conflict` | `{{< military-conflict >}}` | 18,915 | date pair (start/end), location, result |
| 18 | `Template:Infobox football club` | `{{< football-club >}}` | 18,206 | founded date, ground, capacity, manager |
| 19 | `Template:Infobox ice hockey biography` | `{{< ice-hockey-biography >}}` | 18,500 | `infobox-pair-date` (birth), shoots/catches, position, career stats |
| 20 | `Template:Infobox tennis tournament event` | `{{< tennis-tournament-event >}}` | 16,539 | date, venue, surface, draw |
| 21 | `Template:Infobox organization` | `{{< organization >}}` | 14,497 | founded/dissolved pair, type, headquarters |
| 22 | `Template:Infobox award` | `{{< award >}}` | 14,116 | established date, country, presenter |
| 23 | `Template:Infobox television episode` | `{{< television-episode >}}` | 12,944 | original air date, episode/season number pair |
| 24 | `Template:Infobox church` | `{{< church >}}` | 10,539 | architectural style, completed date, capacity |
| 25 | `Template:Infobox television season` | `{{< television-season >}}` | 10,250 | `infobox-pair-air-date` (first/last), episodes, network |
| 26 | `Template:Infobox political party` | `{{< political-party >}}` | 8,592 | founded/headquarters pair, ideology, seats |
| 27 | `Template:Infobox protected area` | `{{< protected-area >}}` | 8,403 | established date, area, governing body |
| 28 | `Template:Infobox election` | `{{< election >}}` | 7,002 | election date, country, type, turnout, results |
| 29 | `Template:Infobox country` | `{{< country >}}` | 5,151 | sovereignty/established pair, area, population, capital |
| 30 | `Template:Infobox album` | `{{< album >}}` | (high; out of formal top-30) | release date, label, track count, length |

**Special-case primitives driving the rows above** — each named shortcode that
needs a multi-field group composes the corresponding `infobox-pair-*` primitive
from Decision 2. The pair primitives are themselves small shortcodes; the table
maps which named wrappers need which primitives.

**Out of v1 inventory** (per `.plans/first-plan/2a-infobox-template-inventory.md`
§5): sport-specific player biography forks below row 30, country-specific place
infoboxes (`Infobox Australian place`, `Infobox French commune`, …), Chembox /
Drugbox / Taxonbox, Wikidata-coupled templates, and any template under ~5k
transclusions not in the table above. Adding one is a §6.5 (Phase 2½) procedure
and never requires theme changes.

**Refresh cadence.** The transclusion counts above are from the Wikipedia
transclusion-counter snapshot captured for the Phase 2½ plan; they drift monthly.
The Phase 2½ executor will re-verify before Phase 8 begins; relative ordering is
expected to be stable.

---

### Phase 2 status / handoff

- **Phase 2 DoD:**
  - `Template:Infobox` metatemplate and ≥2 child-template docs reviewed (person,
    company, software, settlement) ✓.
  - 2–3 live articles' rendered DOM inspected and structural notes written in own
    words (§2.3) ✓.
  - 4 design decisions in §6 are answered and ready to drop into `docs/SHORTCODES.md`
    during Phase 8 ✓.
  - §7 coverage contract from `2a-infobox-template-inventory.md` is reproduced
    here as the authoritative list of shipped named shortcodes; §6 decisions
    match the architecture in `08-infobox-shortcode-spec.md` (planned) ✓.
- **Phase 2½ readiness:** the executor can take the §7 table as its working list,
    re-verify transclusion ordering against the live source, and produce the
    procedure / built-ins count prior to Phase 8. No Phase 2½ work has begun.
- **Self-check vs the licensing boundary:** no verbatim MediaWiki template code,
    parameter table, or wikitext excerpt appears above. Field names are referenced
    as concepts only (e.g. "`birth_date` pair"), in the spirit of the MoS guidance
    on parameter reuse, not as transcribed upstream content.

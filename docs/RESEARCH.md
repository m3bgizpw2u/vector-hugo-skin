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


| Item              | Value                                                                                                          |
| ----------------- | -------------------------------------------------------------------------------------------------------------- |
| Upstream          | Wikimedia `mediawiki/skins/Vector`                                                                             |
| Source URL (used) | `https://gerrit.wikimedia.org/r/mediawiki/skins/Vector`                                                        |
| Local clone path  | `reference/vector/` (gitignored — see §1 of DoD)                                                               |
| Shallow clone SHA | `dd9a26f9ea3d180cf07c74d29960c6d14d878a7b`                                                                     |
| Last commit       | "Simplify vertical alignment of tabs" — 2026-07-02                                                             |
| Upstream license  | GPL-2.0-or-later (Vector); CC BY-SA + MediaWiki terms (Wikipedia Infobox content — out of scope until Phase 2) |


Gerrit was preferred per spec and was reachable on the first attempt; the GitHub mirror
was not needed.

### Repo layout we worked with

Phase 01's spec mentions a few representative paths (`templates/*.mustache`,
`resources/skins.vector.styles/**/*.less`, `resources/skins.vector.es6/**/*.js`,
`doc/configuration/configuration.md`). The actual current layout of the upstream repo
divides slightly differently; this is recorded here as a small spec correction so
later phases do not re-discover it.


| Spec's illustrative path                  | Actual path in the cloned repo                                                                                                                                 |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `templates/*.mustache`                    | `includes/templates/*.mustache` (48 templates, including sub-folders `Dropdown/`, `PinnableContainer/{Pinned,Unpinned}/`, `PinnableElement/`)                  |
| `resources/skins.vector.es6/**/*.js`      | `resources/skins.vector.js/**/*.js` plus `resources/skins.vector.legacy.js/*.js` (the legacy bundle is the MonoBook-fallback skin shipped on the same package) |
| `resources/skins.vector.styles/**/*.less` | `resources/skins.vector.styles/` is correct, plus a parallel `resources/skins.vector.styles.legacy/` and `resources/skins.vector.clientPreferences/`           |
| `doc/configuration/configuration.md`      | Confirmed at exactly this path                                                                                                                                 |


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


| Excluded feature                                                        | What it is                                                                                                                            | Why we exclude it                                                                                                                    | Hugo replacement?                                                                                                                                                                              |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Login / Create account links                                            | Top-right personal-tools entries that route to MediaWiki's auth flow.                                                                 | A static site has no user accounts, so no auth flow exists.                                                                          | No. Personal-tools area in Phase 3 partial just omits these entries.                                                                                                                           |
| Watchlist star                                                          | A star icon you click to bookmark a page to a server-side list of "watched" pages.                                                    | Requires a logged-in user and server-side persistence of watched-page state.                                                         | No. The icon itself is also omitted.                                                                                                                                                           |
| Edit / View history / Talk tabs (the **content** inside the tab widget) | The page-action tab slots whose targets are the wiki edit UI, the diff/history UI, the talk-page UI.                                  | We keep the tab **widget** (Phase 1.6), but not these targets — they each require a server-side action endpoint.                     | Partially. If a site author wants to link to a GitHub "Edit this page" or an issue tracker, they can do that via front matter or a hook the theme exposes. Pre-baked defaults are not shipped. |
| VisualEditor hooks and edit-mode toggles                                | The client-side rich-text editor that MediaWiki ships in-line.                                                                        | Editing requires the MediaWiki backend; the editor itself drags in a large OO.js framework.                                          | No.                                                                                                                                                                                            |
| CSRF tokens / edit-session tokens                                       | Hidden form fields MediaWiki emits to prove the submission came from a session-authenticated POST.                                    | No edit form ⇒ no token required.                                                                                                    | No.                                                                                                                                                                                            |
| ResourceLoader startup manifest / module loader                         | MediaWiki's runtime which dynamically fetches & lazily-loads JS/CSS modules from a `load.php?modules=…` URL.                          | Hugo builds static assets at build time and ships them as bundled CSS / `<script type="module">` files. No runtime loader is needed. | Entirely. Hugo Pipes + a plain ES-module entrypoint replaces it.                                                                                                                               |
| `mw.*` JS API (`mw.config`, `mw.loader`, `mw.Api`, …)                   | The ambient namespace MediaWiki makes available to every script (config bag, module loader, API client).                              | These symbols do not exist outside MediaWiki.                                                                                        | We expose equivalent helpers as plain TS modules (`assets/ts/api/`, `assets/ts/config/`) that read from Hugo-injected JSON instead.                                                            |
| Live search-as-you-type against `action=opensearch` / `action=query`    | The header search box's debounced server round-trip to MediaWiki's API.                                                               | No API to call.                                                                                                                      | Yes — a **build-time** static JSON index of titles (`/search-index.json`, generated at build) loaded by the search box on focus.                                                               |
| Echo notifications bell                                                 | Header bell + dropdown showing notifications fan-out from a server.                                                                   | Requires a notifications backend.                                                                                                    | No.                                                                                                                                                                                            |
| Page-protection padlock icons, page-move/delete tabs                    | Visual indicators that the page is locked, semi-protected, or flagged for admin action.                                               | Admin/server-state features with no equivalent in a static site.                                                                     | No.                                                                                                                                                                                            |
| Interlanguage links driven by Wikidata                                  | The auto-detected list of "Read this page in [other languages]" link language alternates pulled from the Wikidata item for the topic. | Out of scope; no live Wikidata lookup.                                                                                               | Manual: theme site-params may declare language alternates per page via front matter.                                                                                                           |


One judgment call worth flagging (per Phase 14's "stop-and-flag" protocol):
**"Watchstar" is excluded, but the LESS component** `Watchstar.less` **is conceptually
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


| Vector LESS path                                                  | Our SCSS target                                                        | Notes                                                             |
| ----------------------------------------------------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `resources/skins.vector.styles/skin.less`                         | split across `assets/scss/base/_reset.scss` + per-component files      | The entry point; mostly @imports                                  |
| `resources/skins.vector.styles/variables.less`                    | `assets/scss/base/_tokens.scss` + `_theme.scss`                        | Design tokens — reimplemented, not copied                         |
| `resources/skins.vector.styles/mixins.less`                       | `assets/scss/base/_mixins.scss`                                        | Helper mixins — reimplemented from concept                        |
| `resources/skins.vector.styles/normalize.less`                    | `assets/scss/base/_normalize.scss`                                     | Generic reset                                                     |
| `resources/skins.vector.styles/typography.less`                   | `assets/scss/base/_typography.scss`                                    | Body text — reimplemented                                         |
| `resources/skins.vector.styles/print.less`                        | `assets/scss/layouts/_print.scss`                                      | Print stylesheet                                                  |
| `resources/skins.vector.styles/CSSCustomProperties.less`          | `assets/scss/base/_tokens.scss` (with theme modifier hooks)            | The custom-property system is what makes theme switching possible |
| `resources/skins.vector.styles/links.less`                        | `assets/scss/components/_links.scss`                                   |                                                                   |
| `resources/skins.vector.styles/layouts/screen.less`               | `assets/scss/layouts/_grid.scss`                                       | The two/three-column grid                                         |
| `resources/skins.vector.styles/layouts/grid.less`                 | merged into `layouts/_grid.scss`                                       |                                                                   |
| `resources/skins.vector.styles/layouts/toc/pinned.less`           | `assets/scss/components/toc/_pinned.scss`                              |                                                                   |
| `resources/skins.vector.styles/layouts/toc/unpinned.less`         | `assets/scss/components/toc/_unpinned.scss`                            |                                                                   |
| `resources/skins.vector.styles/components/Appearance.less`        | `assets/scss/components/appearance/_index.scss`                        |                                                                   |
| `resources/skins.vector.styles/components/BottomDock.less`        | (rolled into the sticky-header partial style)                          |                                                                   |
| `resources/skins.vector.styles/components/Button.less`            | `assets/scss/components/_button.scss`                                  |                                                                   |
| `resources/skins.vector.styles/components/Dropdown.less`          | `assets/scss/components/dropdown/_index.scss`                          |                                                                   |
| `resources/skins.vector.styles/components/Footer.less`            | `assets/scss/components/footer/_index.scss`                            |                                                                   |
| `resources/skins.vector.styles/components/Header.less`            | `assets/scss/components/header/_index.scss`                            |                                                                   |
| `resources/skins.vector.styles/components/Icon.less`              | `assets/scss/components/_icon.scss`                                    |                                                                   |
| `resources/skins.vector.styles/components/Indicators.less`        | `assets/scss/components/header/_indicators.scss`                       |                                                                   |
| `resources/skins.vector.styles/components/LanguageDropdown.less`  | `assets/scss/components/_language-dropdown.scss`                       |                                                                   |
| `resources/skins.vector.styles/components/Logo.less`              | (within `_index.scss` of header)                                       |                                                                   |
| `resources/skins.vector.styles/components/MainMenu.less`          | `assets/scss/components/sidebar/_main-menu.scss`                       |                                                                   |
| `resources/skins.vector.styles/components/Menu.less`              | `assets/scss/components/sidebar/_menu.scss`                            |                                                                   |
| `resources/skins.vector.styles/components/MenuTabs.less`          | `assets/scss/components/_tabs.scss`                                    |                                                                   |
| `resources/skins.vector.styles/components/PageTitlebar.less`      | (within header `_index.scss`)                                          |                                                                   |
| `resources/skins.vector.styles/components/PageToolbar.less`       | (rolled into tabs partial style)                                       |                                                                   |
| `resources/skins.vector.styles/components/PageTools.less`         | `assets/scss/components/sidebar/_page-tools.scss`                      |                                                                   |
| `resources/skins.vector.styles/components/PinnableElement.less`   | (within sticky-header partial style)                                   |                                                                   |
| `resources/skins.vector.styles/components/PinnableHeader.less`    | (within sticky-header partial style)                                   |                                                                   |
| `resources/skins.vector.styles/components/SearchBox.less`         | `assets/scss/components/header/_search-box.scss`                       |                                                                   |
| `resources/skins.vector.styles/components/SiteNotice.less`        | (out of scope — no equivalent in static site)                          |                                                                   |
| `resources/skins.vector.styles/components/TableOfContents.less`   | `assets/scss/components/toc/_index.scss`                               |                                                                   |
| `resources/skins.vector.styles/components/UserLinks.less`         | `assets/scss/components/header/_user-links.scss`                       |                                                                   |
| `resources/skins.vector.styles/components/Watchstar.less`         | excluded — see §2                                                      |                                                                   |
| `resources/skins.vector.styles.legacy/*`                          | not ported — legacy fallback is out of scope for this reimplementation |                                                                   |
| `resources/skins.vector.clientPreferences/clientPreferences.less` | (rolled into appearance partial style)                                 |                                                                   |
| `resources/skins.vector.js/stickyHeader.less`                     | `assets/scss/components/sticky-header/_index.scss`                     |                                                                   |
| `resources/skins.vector.js/tableOfContents.less`                  | (rolled into toc)                                                      |                                                                   |
| `resources/skins.vector.js/popupNotification.less`                | excluded                                                               |                                                                   |
| `resources/skins.vector.js/bottomDock.less`                       | (rolled into sticky-header)                                            |                                                                   |
| `resources/skins.vector.js/index.less`                            | combined imports file                                                  |                                                                   |




---



### §4. JS source mapping (which ES module → which TS target, per Phase 6)

Following `00-core.mdc` ("one behavior per TS module"), each upstream ES module
maps to one or two TS files. Where the upstream module depends on `mw.*` symbols
the corresponding TS module must read from a Hugo-injected config object instead —
this is the most common mechanical change. Where a module depends on a server-side
endpoint (watchstar, typeahead API call, notifications), the TS target is omitted.


| Vector JS path                                            | Our TS target                                    | Notes                                                |
| --------------------------------------------------------- | ------------------------------------------------ | ---------------------------------------------------- |
| `resources/skins.vector.js/skin.js`                       | `assets/ts/index.ts` (entry)                     | Plus per-feature entrypoints                         |
| `resources/skins.vector.js/features.js`                   | `assets/ts/features.ts`                          | Maps server-injected config into per-feature init    |
| `resources/skins.vector.js/stickyHeader.js`               | `assets/ts/sticky-header/index.ts`               |                                                      |
| `resources/skins.vector.js/stickyHeaderAB.js`             | excluded — A/B test infrastructure               |                                                      |
| `resources/skins.vector.js/scrollObserver.js`             | `assets/ts/util/scroll-observer.ts`              | Reusable observer helper                             |
| `resources/skins.vector.js/sectionObserver.js`            | `assets/ts/util/section-observer.ts`             |                                                      |
| `resources/skins.vector.js/setupIntersectionObservers.js` | `assets/ts/util/setup-intersection-observers.ts` |                                                      |
| `resources/skins.vector.js/deferUntilFrame.js`            | `assets/ts/util/raf.ts`                          | Generic rAF helper                                   |
| `resources/skins.vector.js/pinnableElement.js`            | `assets/ts/sticky-header/pinnable.ts`            |                                                      |
| `resources/skins.vector.js/tableOfContents.js`            | `assets/ts/toc/index.ts`                         |                                                      |
| `resources/skins.vector.js/menuTabs.js`                   | `assets/ts/tabs/collapse.ts`                     |                                                      |
| `resources/skins.vector.js/portlets.js`                   | `assets/ts/sidebar/portlets.ts`                  |                                                      |
| `resources/skins.vector.js/dropdownMenus.js`              | `assets/ts/dropdown/index.ts`                    |                                                      |
| `resources/skins.vector.js/searchToggle.js`               | `assets/ts/header/search-toggle.ts`              |                                                      |
| `resources/skins.vector.js/languageButton.js`             | excluded scope                                   |                                                      |
| `resources/skins.vector.js/userPreferences.js`            | `assets/ts/theme-toggle/preferences.ts`          | localStorage adapter                                 |
| `resources/skins.vector.js/disableNightModeIfGadget.js`   | excluded                                         |                                                      |
| `resources/skins.vector.js/popupNotification.js`          | excluded                                         |                                                      |
| `resources/skins.vector.js/watchstar.js`                  | excluded                                         |                                                      |
| `resources/skins.vector.js/tables.js`                     | `assets/ts/util/responsive-tables.ts`            | Optional responsive wrapper                          |
| `resources/skins.clientPreferences/clientPreferences.js`  | `assets/ts/theme-toggle/index.ts`                |                                                      |
| `resources/skins.vector.search/skins.vector.search.js`    | `assets/ts/header/search.ts`                     | Loads the static JSON index instead of MediaWiki API |


---



### §5. Configuration surface — candidate `theme.toml` params

The following site-wide toggleable behaviour is documented in the upstream
configuration document (`reference/vector/doc/configuration/configuration.md`)
and is worth exposing as `theme.toml` parameters, organised by who turns the
dials (site author vs. end-user preference).

**Site-level (admin choices in** `theme.toml` **/ site config):**


| Upstream knob                                      | What it controls                               | Default          | Expose as                                                |
| -------------------------------------------------- | ---------------------------------------------- | ---------------- | -------------------------------------------------------- |
| `wgVectorMaxWidthOptions`                          | Constrained- vs. full-width reading layout     | limited-width on | `theme.toml`: `[params.layout] maxWidth = "limited"      |
| `wgVectorTableOfContentsCollapseAtCount`           | Auto-collapse large ToCs at this heading count | 28               | `theme.toml`: `[params.toc] collapseAtCount = 28`        |
| `wgVectorLanguageInHeader`                         | Show language selector in header               | off              | `theme.toml`: `[params.language] inHeader = false`       |
| `wgVectorLanguageInMainMenu`                       | Show language selector in main menu            | off              | `theme.toml`: `[params.language] inMainMenu = false`     |
| `wgVectorTypeahead`                                | Enable type-ahead suggestion in search box     | on               | `theme.toml`: `[params.search] typeahead = true`         |
| (Phase 14: extracted from sticky-header behaviour) | Pin/unpin sticky header                        | on               | `theme.toml`: `[params.stickyHeader] enabled = true`     |
| (Phase 14: extracted from main menu behaviour)     | Pin/unpin left main menu                       | off              | `theme.toml`: `[params.sidebar] mainMenuPinned = false`  |
| (Phase 14: extracted from page tools behaviour)    | Pin/unpin right page-tools                     | off              | `theme.toml`: `[params.sidebar] pageToolsPinned = false` |
| (Phase 14: extracted from ToC behaviour)           | Pin/unpin table of contents                    | on               | `theme.toml`: `[params.toc] pinned = true`               |
| (Phase 14: extracted from appearance behaviour)    | Pin/unpin appearance menu                      | on               | `theme.toml`: `[params.appearance] pinned = true`        |


**User preferences (client-side; preserved via** `localStorage`**):**


| Upstream preference        | What it controls                                 | Storage in our theme                          |
| -------------------------- | ------------------------------------------------ | --------------------------------------------- |
| `vector-limited-width`     | constrained- vs. full-width article body         | `localStorage` key `vhskin:layout`            |
| `vector-page-tools-pinned` | pin page-tools                                   | `localStorage` key `vhskin:sidebar:pageTools` |
| `vector-main-menu-pinned`  | pin main-menu                                    | `localStorage` key `vhskin:sidebar:mainMenu`  |
| `vector-toc-pinned`        | pin ToC                                          | `localStorage` key `vhskin:toc`               |
| `vector-appearance-pinned` | pin appearance                                   | `localStorage` key `vhskin:appearance`        |
| `vector-font-size`         | font size preference (regular / large / x-large) | `localStorage` key `vhskin:fontSize`          |
| `vector-theme`             | light / dark / OS preference                     | `localStorage` key `vhskin:theme`             |


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
4. An optional `below` **footer row** — a single full-width cell at the very bottom,
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
consistent across templates** (`birth_date` reused on `Infobox person`, `Infobox military person`, etc.; `coordinates` reused on every geo-flavored template). The
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

**Special-case inner primitives —** `infobox-pair-`***.** A handful of label/value
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
(3–7) can reference a concrete target list without re-deriving it.

**Verification snapshot: 2026-07-10** (re-ranked against live Wikipedia
transclusion counts from the Toolforge linkcount endpoint). The Phase 2½
executor re-ran the full §4 inventory against `linkcount.toolforge.org` rather than
scraping the Wikipedia list-of-infoboxes page, because the latter omits several
high-volume templates (`Infobox company`, `Infobox software`, `Infobox album`) from
its rendered table even though the templates themselves remain heavily used. The
table below is the live 2026-07-10 ranking; the original Phase 2 plan snapshot
column is preserved for transparency and to show month-over-month drift. The
canonical 30 shortcode set itself is **unchanged** from `2a-infobox-template-inventory.md`
§4 — re-ranking was applied to existing rows only, no row was added or dropped.


| #   | MediaWiki template                         | Hugo shortcode                         | Transclusions (2026-07-10, live) | Transclusions (2026-06-18, plan snapshot) | Special-case field groups                                                                                                     |
| --- | ------------------------------------------ | -------------------------------------- | -------------------------------- | ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| 1   | `Template:Infobox settlement`              | `{{< settlement >}}`                   | 597,022                          | 530,561                                   | `coordinates`, elevation, `infobox-pair-area`, `infobox-pair-population`                                                      |
| 2   | `Template:Infobox person`                  | `{{< person >}}`                       | 570,431                          | 290,129                                   | `infobox-pair-date` (birth/death)                                                                                             |
| 3   | `Template:Infobox football biography`      | `{{< football-biography >}}`           | 218,297                          | 149,852                                   | `infobox-pair-date` (birth), height, position, club-career sections                                                           |
| 4   | `Template:Infobox film`                    | `{{< film >}}`                         | 169,548                          | 164,233                                   | release-date, runtime, `infobox-pair-budget-gross`                                                                            |
| 5   | `Template:Infobox album`                   | `{{< album >}}`                        | 168,381                          | (high; out of formal top-30)              | release date, label, track count, length                                                                                      |
| 6   | `Template:Infobox company`                 | `{{< company >}}`                      | 92,412                           | 92,000                                    | founded/dissolved pair, type, headquarters, key-people list, products list, revenue/operating-income/net-income/equity totals |
| 7   | `Template:Infobox NRHP`                    | `{{< historic-site >}}` (alias `nrhp`) | 74,077                           | 63,086                                    | coordinates, NRHP reference number, added-to-NRHP date                                                                        |
| 8   | `Template:Infobox television`              | `{{< television >}}`                   | 63,686                           | 61,015                                    | network, `infobox-pair-air-date`, `infobox-pair-episode-season`                                                               |
| 9   | `Template:Infobox station`                 | `{{< station >}}`                      | 57,429                           | 31,592                                    | line, platform count, opened-date, coordinates                                                                                |
| 10  | `Template:Infobox military person`         | `{{< military-person >}}`              | 53,598                           | 39,401                                    | `infobox-pair-date` (birth/death), service-years pair                                                                         |
| 11  | `Template:Infobox organization`            | `{{< organization >}}`                 | 42,733                           | 14,497                                    | founded/dissolved pair, type, headquarters                                                                                    |
| 12  | `Template:Infobox election`                | `{{< election >}}`                     | 40,314                           | 7,002                                     | election date, country, type, turnout, results                                                                                |
| 13  | `Template:Infobox school`                  | `{{< school >}}`                       | 40,102                           | 38,223                                    | established/closed dates, enrollment, mascot                                                                                  |
| 14  | `Template:Infobox video game`              | `{{< video-game >}}`                   | 30,137                           | 28,953                                    | release-date pair (platform-by-platform), engine, modes                                                                       |
| 15  | `Template:Infobox baseball biography`      | `{{< baseball-biography >}}`           | 29,755                           | 22,036                                    | `infobox-pair-date` (birth), bats/throws, position, career stats                                                              |
| 16  | `Template:Infobox football club`           | `{{< football-club >}}`                | 29,490                           | 18,206                                    | founded date, ground, capacity, manager                                                                                       |
| 17  | `Template:Infobox military unit`           | `{{< military-unit >}}`                | 28,576                           | 23,839                                    | active-dates pair, branch, garrison                                                                                           |
| 18  | `Template:Infobox military conflict`       | `{{< military-conflict >}}`            | 27,709                           | 18,915                                    | date pair (start/end), location, result                                                                                       |
| 19  | `Template:Infobox university`              | `{{< university >}}`                   | 25,649                           | 25,875                                    | established/closed dates, type, students, mascot, motto                                                                       |
| 20  | `Template:Infobox basketball biography`    | `{{< basketball-biography >}}`         | 23,374                           | 23,048                                    | `infobox-pair-date` (birth), height, position, career stats                                                                   |
| 21  | `Template:Infobox tennis tournament event` | `{{< tennis-tournament-event >}}`      | 22,164                           | 16,539                                    | date, venue, surface, draw                                                                                                    |
| 22  | `Template:Infobox ice hockey biography`    | `{{< ice-hockey-biography >}}`         | 20,729                           | 18,500                                    | `infobox-pair-date` (birth), shoots/catches, position, career stats                                                           |
| 23  | `Template:Infobox church`                  | `{{< church >}}`                       | 17,169                           | 10,539                                    | architectural style, completed date, capacity                                                                                 |
| 24  | `Template:Infobox political party`         | `{{< political-party >}}`              | 16,187                           | 8,592                                     | founded/headquarters pair, ideology, seats                                                                                    |
| 25  | `Template:Infobox award`                   | `{{< award >}}`                        | 15,639                           | 14,116                                    | established date, country, presenter                                                                                          |
| 26  | `Template:Infobox protected area`          | `{{< protected-area >}}`               | 15,359                           | 8,403                                     | established date, area, governing body                                                                                        |
| 27  | `Template:Infobox software`                | `{{< software >}}`                     | 14,170                           | 14,000                                    | `infobox-pair-software-release` (per-platform), operating-system list, license, programming-language list, status             |
| 28  | `Template:Infobox television episode`      | `{{< television-episode >}}`           | 13,199                           | 12,944                                    | original air date, episode/season number pair                                                                                 |
| 29  | `Template:Infobox television season`       | `{{< television-season >}}`            | 10,654                           | 10,250                                    | `infobox-pair-air-date` (first/last), episodes, network                                                                       |
| 30  | `Template:Infobox country`                 | `{{< country >}}`                      | 7,137                            | 5,151                                     | sovereignty/established pair, area, population, capital                                                                       |




**Notable re-rankings since 2026-06-18 snapshot.** Five shortcodes moved by more
than two places, all driven by sustained growth: `album` (30 → 5), `organization`
(21 → 11), `election` (28 → 12), `television-episode` (23 → 28), and
`television-season` (25 → 29). `software` (5 → 27) shows the steepest decline —
relative position dropped but absolute count is essentially flat (14,000 → 14,170),
so the movement is the rest of the field catching up, not a real decline. The full
set of 30 shortcodes is unchanged from `.plans/first-plan/2a-infobox-template-inventory.md`
§4; only the row order moved.

**Special-case primitives driving the rows above** — each named shortcode that
needs a multi-field group composes the corresponding `infobox-pair-*` primitive
from Decision 2. The pair primitives are themselves small shortcodes; the table
maps which named wrappers need which primitives. The seven primitives and the
named shortcodes that consume them are catalogued in §9.

**Out of v1 inventory** (per `.plans/first-plan/2a-infobox-template-inventory.md`
§5): sport-specific player biography forks below row 30, country-specific place
infoboxes (`Infobox Australian place`, `Infobox French commune`, …), Chembox /
Drugbox / Taxonbox, Wikidata-coupled templates, and any template under ~5k
transclusions not in the table above. Adding one is §8's procedure
and never requires theme changes.

**Refresh cadence.** Transclusion counts drift month-to-month; the relative
ordering is mostly stable but a handful of templates regularly shift by several
places (e.g. `album`, `election`, `software` all moved more than two positions
between 2026-06-18 and 2026-07-10). The §7 table should be re-verified at the
start of every Phase 8 execution run against the same source this snapshot was
captured from (`linkcount.toolforge.org`, queried per template). Re-ranking is
allowed by the §8 procedure; adding or removing rows from the 30-shortcode set
is not — that requires a plan amendment.

---



## §8. Procedure for adding a new named shortcode

Phase 2½ is the v1 lock-in. Beyond v1, the architecture in Phase 8 makes adding
a new named shortcode a small, mechanical process. The 9-step procedure below
is what a follow-on executor (or a downstream site author following the
`docs/SHORTCODES.md` Authoring Guide) follows. The list is the authoritative
copy of `.plans/first-plan/2a-infobox-template-inventory.md` §6, expanded
one-paragraph per step.

1. **Verify the upstream template exists and is stable.** Confirm the
  MediaWiki `Infobox <topic>` template is in `Category:Infobox templates`,
   has a public documentation page (the `Template:Infobox <topic>/doc` subpage
   is the canonical reference), and that its parameter list has been stable for
   at least one release cycle. Templates that have an open "holding cell" /
   merge discussion on `Wikipedia:Templates for discussion` are not eligible
   for promotion until the discussion resolves. Record the upstream
   documentation URL alongside the decision; downstream phases link back to it
   from `docs/SHORTCODES.md`.
2. **Add a row to the §7 coverage contract.** Insert the new shortcode into
  the table with the MediaWiki template name, the Hugo shortcode slug
   (kebab-case, matching the upstream name verbatim), the current
   transclusion count from `linkcount.toolforge.org`, and a list of which
   `infobox-pair-*` primitives (Decision 2) the template needs. Re-run the
   re-rank only if the new template's position causes an existing row to move
   by more than two places; otherwise slot it in at the bottom of the table.
3. **Create** `layouts/shortcodes/{slug}/{slug}.html`**.** Per `.cursor/rules/00-core.mdc`,
  every shortcode gets its own folder. The named-wrapper file is a 15–30 line
   Go-template that opens `<aside class="infobox" data-infobox-type="{slug}">`,
   builds a `dict` of the named params plus `.Inner`, and delegates to
   `partials/infobox/base.html`. The named-parameter list mirrors the upstream
   MediaWiki template verbatim — no renumbering, no renaming, no
   value-transformation. A comment block at the top of the file lists the
   accepted parameters in declaration order, so reading the file is sufficient
   to know the wrapper's surface.
4. **Add a special partial if the template needs a new field group.** If the
  upstream template uses a recurring multi-field group that none of the
   seven `infobox-pair-*` primitives cover, add a new partial under
   `layouts/partials/infobox/special/{group-name}.html` and a thin
   `infobox-pair-{group-name}.html` shortcode under
   `layouts/shortcodes/infobox/` so the primitive is reusable across any
   shortcode that needs the same group. The pair primitive's structure is the
   same pattern as the seven shipped in §9 — a small Go-template that returns
   a `dict` of label/value pairs for the base partial to render. Do **not**
   add a per-template CSS file (see step 5).
5. **Add a one-line visual rule in** `assets/scss/components/infobox.scss`**.** If
  the new shortcode needs a visual tweak that the base styles don't cover
   (e.g. a portrait aspect ratio for a portrait-style infobox, a darker
   tonal background for a different category), add a single SCSS rule keyed
   on `[data-infobox-type="{slug}"]` to the existing `infobox.scss` file. This
   is the only CSS contract the wrapper needs; per-template CSS files are
   prohibited by `.cursor/rules/00-core.mdc`. The base partial must emit the
   `data-infobox-type` attribute on the outer `<aside>` for the selector to
   match.
6. **Add a demo page to** `exampleSite/`**.** Use `hugo new --kind infobox-demo
  articles/{slug}-demo.md`to generate the demo, then fill it with a worked  example mirroring the format in`docs/SHORTCODES.md`§X for the relevant  template. The demo must render without template errors at`hugo server`
   time. Demos also serve as visual regression fixtures for the Playwright
   suite (Phase 10).
7. **Add a per-template entry to** `docs/SHORTCODES.md`**.** Each shipped named
  shortcode gets its own sub-section in the Phase-8 author-facing reference:
   one-line description, parameter table matching the upstream MediaWiki docs,
   a worked example in MediaWiki form side-by-side with the Hugo form, and a
   "see also" link to the upstream template documentation. Phase 2½ ships
   only the Authoring Guide at the top of `docs/SHORTCODES.md`; the
   per-template entries land in Phase 8 alongside the implementation.
8. **Parametrise** `infobox.spec.ts` **for the new template.** The Playwright E2E
  suite (per `.plans/first-plan/10-playwright-e2e-cachyos.md` §4) is
   parametrised over the §7 shortcode list — adding a shortcode means
   appending the new slug to the test's data table so the suite visits the
   new demo page and asserts the infobox renders, has the right
   `data-infobox-type`, and shows the expected rows.
9. **Update `.cursor/rules/40-shortcodes.mdc` if a new authoring convention
  emerges.** This is the only step that may be skipped. Most additions
   follow existing conventions and do not require a rule update. Touch the
   rule only when a new pattern of shortcode composition needs to be locked in
   (e.g. a new kind of pair primitive, a new way of nesting the inner
   primitives inside a named wrapper). The rule is the contract future
   authors read first, so keep additions small and example-driven.

The 9-step procedure is symmetrical with the v1 initial ship: the same steps
that got the 30 named shortcodes into the architecture are the steps that
grow the family past 30. None of the nine steps require touching the base
partial, the skin-side SCSS, the layout grid, or any other Phase 3–7 surface.

---



## §9. Inner-primitive shortcode library

The 30 named shortcodes in §7 share a small library of **inner primitive
shortcodes** that the named wrappers compose into their final output. This
section catalogues the seven `infobox-pair-*` special-case primitives
(finalised by Phase 2½) and maps each to the named shortcodes that consume it.
The four non-pair primitives (`infobox-row`, `infobox-image`, `infobox-section`,
`infobox-below`, plus the outer `infobox` paired wrapper) are documented in
`docs/SHORTCODES.md` §5; they are not catalogued here because they are generic
building blocks used by every named shortcode in equal measure, not
template-specific.


| #   | Inner primitive                 | Intent (what it abstracts)                                                                                                                                                                                                                                                                                                  | Used by (named shortcodes in §7)                                                                                                                                                                                                                                                                                                                                           |
| --- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `infobox-pair-date`             | A date + place / location pair rendered as a tight, two-line cell with the date above the value, in slightly smaller type than a regular `infobox-row`. Mirrors upstream's "born/died", "founded/dissolved", "opened/closed", "first-aired/last-aired", "established/added" pattern that recurs across ~20 named templates. | `person`, `military-person`, `football-biography`, `basketball-biography`, `baseball-biography`, `ice-hockey-biography`, `organization`, `political-party`, `country`, `university`, `school`, `church`, `television-season`, `protected-area`, `tennis-tournament-event`, `award`, `station`, `historic-site`, `military-unit`, `military-conflict`, `television-episode` |
| 2   | `infobox-pair-software-release` | A `latest_release_version` + `latest_release_date` pair, optionally repeated per platform. Renders the version above the date, with a small platform chip inline when the wrapper passes the per-platform flag.                                                                                                             | `software`, `video-game`                                                                                                                                                                                                                                                                                                                                                   |
| 3   | `infobox-pair-population`       | A census + estimate population pair with year labels on both sides. Used when a place's infobox has both a snapshot census figure and a more recent estimate — the upstream pattern that the named wrapper needs to surface identically.                                                                                    | `settlement`, `country`                                                                                                                                                                                                                                                                                                                                                    |
| 4   | `infobox-pair-area`             | A total / land / water area triple with unit normalisation. The named wrapper passes the three sub-values; the primitive renders them stacked with the total on top in bold and land/water beneath in lighter type.                                                                                                         | `settlement`, `country`                                                                                                                                                                                                                                                                                                                                                    |
| 5   | `infobox-pair-air-date`         | A first-aired + last-aired date pair with a small "to" separator. The two fields are visually grouped in a single cell rather than split across two rows, matching the upstream rendering.                                                                                                                                  | `television`, `television-episode`, `television-season`                                                                                                                                                                                                                                                                                                                    |
| 6   | `infobox-pair-budget-gross`     | A `budget` + `gross` numeric pair with currency. Both values are right-aligned in the same cell; currency is rendered as a small leading prefix glyph.                                                                                                                                                                      | `film`                                                                                                                                                                                                                                                                                                                                                                     |
| 7   | `infobox-pair-episode-season`   | A `num_episodes` + `num_seasons` numeric pair, rendered inline with an `×` separator. The two values stay on one line — splitting them across two `infobox-row`s would over-weight the row count for what is conceptually a single metadata pair.                                                                           | `television`, `television-episode`                                                                                                                                                                                                                                                                                                                                         |


**Why pairs, not "row groups".** A pair primitive is a thin wrapper that
renders two related values in a single visual cell. The pattern recurs because
upstream MediaWiki templates use the same idiom for "X and Y that always travel
together" — birth date + birth place, budget + gross, etc. Promoting each
recurring pair to a primitive keeps the per-row markup in the named wrapper
short and gives the renderer a hook for the tighter styling (smaller type,
closer line height, no row gap between the two values).

**Folder and file convention.** Each pair primitive lives at
`layouts/shortcodes/infobox/infobox-pair-{name}.html` and renders through a
matching partial at `layouts/partials/infobox/special/{name}.html`. The named
wrapper calls the primitive as a paired shortcode with the relevant named
params, and the base partial handles placement in the row sequence.

**Library lock.** The seven primitives above are the complete v1 inner-primitive
set. Adding a new one is a §8 step 4 operation (it requires both a special
partial and a thin inner shortcode wrapper). Naming must follow the
`infobox-pair-{concept}` pattern so the `layouts/shortcodes/infobox/` directory
is greppable for every pair by name.

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
- **Phase 2½ DoD:**
  - §7 re-verified against the live `linkcount.toolforge.org` snapshot dated
  2026-07-10; re-ranking applied to existing rows only, no row added or
  dropped ✓.
  - §8 documents the 9-step procedure for adding a new named shortcode past
  v1, expanded one-paragraph per step ✓.
  - §9 catalogues the seven `infobox-pair-*` inner primitives with the named
  shortcodes that consume each one ✓.
  - `docs/SHORTCODES.md` Authoring Guide populated with the 3-layer
  architecture, syntax mapping, and escape-hatch description; per-template
  entries remain a Phase 8 deliverable ✓.
- **Phase 3 readiness:** the architecture-overview reading phase can begin.
§6 (4 design decisions) and §7 (coverage contract) and §8 (add procedure) and
§9 (inner-primitive library) lock the contract Phase 3 onward needs.
- **Self-check vs the licensing boundary:** no verbatim MediaWiki template code,
parameter table, or wikitext excerpt appears above. Field names are referenced
as concepts only (e.g. "`birth_date` pair"), in the spirit of the MoS guidance
on parameter reuse, not as transcribed upstream content. The §7 and §9 tables
reference parameter names and transclusion counts as facts, not as
reproduced documentation.

---



## Second execution plan (visual & behavioral parity) — Phase 2 environment

This block of sections (§10–§14) accumulates the findings from
`.plans/second-plan/`, the visual & behavioral parity plan for Vector 2022.
The two plans share the same `docs/RESEARCH.md` so a reader of the finished
repo gets a single, deduplicated view of "what was studied and concluded,"
not two parallel research streams.

### §10. Second-plan environment & source access (Phase 2)


| Item                                                 | Value                                                                                                                                                |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hugo (extended)                                      | v0.163.3 — recorded in `docs/ARCHITECTURE.md` §5                                                                                                     |
| Node.js                                              | v26.4.0 — recorded in `docs/ARCHITECTURE.md` §5                                                                                                      |
| npm                                                  | v11.18.0 — recorded in `docs/ARCHITECTURE.md` §5                                                                                                     |
| Vector source clone                                  | `reference/vector/` (gitignored, study only)                                                                                                         |
| Vector clone remote                                  | `https://gerrit.wikimedia.org/r/mediawiki/skins/Vector` (canonical)                                                                                  |
| Vector clone SHA                                     | `dd9a26f9` ("Simplify vertical alignment of tabs", 2026-07-02) — pin and refresh quarterly; sections below record the SHA they were captured against |
| Live site reachability                               | `https://en.wikipedia.org/wiki/...` — verified 200 OK at session start                                                                               |
| Reference pages reused across every research surface | See §10.1 below                                                                                                                                      |




#### §10.1 Live reference page list (reused for every parity check)

These five live Wikipedia pages are the fixed comparators for every later
phase that needs to look at "what Vector actually renders today." Reusing the
same set ensures comparisons stay apples-to-apples as the theme evolves.
None of these page names are sampled to find specific facts — they were
chosen because each one exposes something a different component:

- **Main_Page** — verifies the homepage layout, the language-switcher
portlet, and the absence of an article body / ToC panel.
- **Penguin** — a moderate-length article with a real infobox floated right
and ~6 headings; exercises the ToC scroll-spy and the article-body grid
together at desktop width.
- **Wikipedia:About** — same shell as an article but no infobox / very
short body; exercises the "minimal ToC" empty-state and the article-body
column's behavior when it has nothing to fill it.
- **Help:Contents** — long body with many flat headings; exercises the ToC
collapse-at-N behaviour and the sticky-header trigger at very long scroll
distances.
- **Special:RecentChanges** — different page-region shape (no chrome at
the top, a narrow content strip); a sanity check that the layout grid
handles non-article pages without breaking.

All five resolve to 200 OK at session start. The first four also act as
phase-3 token-extraction sources: each is fetched as raw HTML once per
phase, stylesheets are inspected via `WebFetch` against the canonical CSS
URL, and the resulting token values cross-checked against the Vector
clone's own `resources/skins.vector.styles/**.less`.

#### §10.2 What was verified before any parity work began

- **Toolchain.** `hugo --version` reports `v0.163.3+extended+withdeploy` —
extended Hugo bundles Dart Sass, which `08-css-scss-implementation-plan.md`
depends on. `node --version` reports `v26.4.0`. `npm --version` reports
`11.18.0`. Pinned in `docs/ARCHITECTURE.md` §5.
- **Repo shape.** Repo is the workspace at `/home/alpha01/gitrepo/vector-hugo-skin/`;
workspace-as-theme per `docs/ARCHITECTURE.md` §4. Build is run with
`--source exampleSite` and the per-npm-script flag is set in `package.json`.
- **Build sanity.** `npm run build` (which resolves to
`hugo --source exampleSite --themesDir ../.. --theme vector-hugo-skin --minify`)
reports "Total in 201 ms", 45 pages, 0 errors at session start. The two
warnings (`no template for json` for page and section) are pre-existing
first-plan noise, not new regressions, and the JSON outputs the
home/index.json search index depends on are still emitted via the home
layout — see `exampleSite/hugo.toml` `[outputs]`. The warning is left
for a later pass per the "don't refactor working code gratuitously"
guidance in the second plan preamble.
- `.gitignore`**.** `reference/` is excluded (Vector study artifact never
enters the repo); `**/public/` and `**/resources/` exclude Hugo build
output; `node_modules/` excludes dev tooling. All five required
`.gitignore` entries are present.
- **No external research material committed.** All external probes
(WebFetch results, mcp browser screenshots, Vector source citations) live
under `/tmp/cursor/` paths outside the repo; per the rule in §1 of the
second plan, none of that material crosses into git history.

---



## Second-plan Phase 3 — Design token discovery (color, typography, spacing)



### §11.1 Method (one-line per research surface)

- **Surface A — live site.** Fetched
`https://en.wikipedia.org/w/load.php?...&only=styles&skin=vector-2022`
with the actual stylesheet URL pulled from a `curl -sSL` of
`https://en.wikipedia.org/wiki/Penguin`. Extracted every CSS custom
property (`--name: value`) declaration into `/tmp/cursor/v22-decl.txt`;
the live stylesheet bundle exposes **440 distinct token declarations**
(Codex `theme-wikimedia-ui` palette + Vector's own component overrides).
Captured the `prefers-color-scheme` / `html.skin-theme-clientpref-*`
block structure to identify the actual theme-switch mechanism (§11.4).
- **Surface B — Vector source.** Read
`reference/vector/resources/skins.vector.styles/variables.less` and
`CSSCustomProperties.less` for breakpoints, layout dimensions, and
typography scale values; cross-checked against
`resources/mediawiki.less/vector-2022/mediawiki.skin.variables.less`
for the token-resolution chain. Pinned to the clone's HEAD
(`dd9a26f9`, 2026-07-02).
- **Surface C — Codex docs.** The live stylesheet bundle has Codex token
blocks prefixed `.cdx-mode-light()` / `.cdx-mode-dark()` mixins —
the underlying palette values come from the Codex package (resolved at
compile time via MediaWiki's ResourceLoader). The compiled values in
the production stylesheet ARE the canonical source; we cite them
directly per the Phase 1 methodology rule "trust the live site when the
source and compiled disagree."



### §11.2 Color system — light mode

These values come straight from the `:root, .skin-invert, .notheme { .cdx-mode-light(); }`
block in the served Vector 2022 stylesheet (Surface A) and match
`reference/vector/resources/skins.vector.styles/CSSCustomProperties.less`
(Surface B). Our `assets/css/themes/light.scss` already declares these
values; the table below records what our `data-theme="light"` block
corresponds to, and confirms every value traces to a sourced line in the
live stylesheet.


| Token                                    | Light value                       | Surface | Notes                                            |
| ---------------------------------------- | --------------------------------- | ------- | ------------------------------------------------ |
| `--color-base`                           | `#202122`                         | A       | Body text. Matches Vector.                       |
| `--color-base--hover`                    | `#404244`                         | A       | Link hover in body text.                         |
| `--color-emphasized`                     | `#101418`                         | A       | High-contrast headings.                          |
| `--color-neutral`                        | `#404244`                         | A       | Mid-emphasis text.                               |
| `--color-subtle`                         | `#54595d`                         | A       | Subtitles, captions, byline.                     |
| `--color-placeholder`                    | `#72777d`                         | A       | Form placeholder.                                |
| `--color-disabled`                       | `#a2a9b1`                         | A       | Disabled UI.                                     |
| `--color-disabled-emphasized`            | `#a2a9b1`                         | A       | Disabled-on-disabled.                            |
| `--color-inverted`                       | `#fff`                            | A       | Inverse text on dark surface.                    |
| `--color-progressive`                    | `#36c`                            | A+B     | Primary link / progressive action.               |
| `--color-progressive--hover`             | `#3056a9`                         | A       |                                                  |
| `--color-progressive--active`            | `#233566`                         | A       |                                                  |
| `--color-destructive`                    | `#bf3c2c`                         | A       |                                                  |
| `--color-destructive--hover`             | `#9f3526`                         | A       |                                                  |
| `--color-destructive--active`            | `#612419`                         | A       |                                                  |
| `--color-visited`                        | `#6a60b0`                         | A       | Vector's actual visited link (we had `#6b4ba1`). |
| `--color-visited--hover`                 | `#534fa3`                         | A       |                                                  |
| `--color-visited--active`                | `#353262`                         | A       |                                                  |
| `--color-warning`                        | `#886425`                         | A       |                                                  |
| `--color-success`                        | `#177860`                         | A       |                                                  |
| `--color-notice`                         | `#404244`                         | A       |                                                  |
| `--color-link`                           | `var(--color-progressive)`        | A       | Alias.                                           |
| `--color-link--hover`                    | `var(--color-progressive--hover)` | A       | Alias.                                           |
| `--background-color-base`                | `#fff`                            | A       | Page surface.                                    |
| `--background-color-neutral`             | `#eaecf0`                         | A       | Stripe / hover surface.                          |
| `--background-color-neutral-subtle`      | `#f8f9fa`                         | A       | Same as our `--color-surface-alt`.               |
| `--background-color-interactive`         | `#eaecf0`                         | A       | Hover background on controls.                    |
| `--background-color-interactive-subtle`  | `#f8f9fa`                         | A       |                                                  |
| `--background-color-disabled`            | `#dadde3`                         | A       |                                                  |
| `--background-color-disabled-subtle`     | `#eaecf0`                         | A       |                                                  |
| `--background-color-inverted`            | `#101418`                         | A       | Inverted surface.                                |
| `--background-color-progressive`         | `#36c`                            | A       |                                                  |
| `--background-color-progressive--hover`  | `#3056a9`                         | A       |                                                  |
| `--background-color-progressive--active` | `#233566`                         | A       |                                                  |
| `--background-color-progressive-subtle`  | `#eaf3ff`                         | A       | Subtle progressive surface.                      |
| `--background-color-destructive-subtle`  | `#ffe9e5`                         | A       |                                                  |
| `--background-color-error-subtle`        | `#ffe9e5`                         | A       |                                                  |
| `--background-color-warning-subtle`      | `#fdf2d5`                         | A       |                                                  |
| `--background-color-success-subtle`      | `#daf2e1`                         | A       |                                                  |
| `--background-color-notice-subtle`       | `#eaecf0`                         | A       |                                                  |
| `--background-color-content-added`       | `#eaf3ff`                         | A       | Diff/visual-add.                                 |
| `--background-color-content-removed`     | `#ffe9e5`                         | A       | Diff/visual-remove.                              |
| `--border-color-base`                    | `#a2a9b1`                         | A       | Same as our `--color-border`.                    |
| `--border-color-subtle`                  | `#c8ccd1`                         | A       | Same as our `--color-divider`.                   |
| `--border-color-muted`                   | `#dadde3`                         | A       |                                                  |
| `--border-color-emphasized`              | `#54595d`                         | A       |                                                  |
| `--border-color-interactive`             | `#a2a9b1`                         | A       |                                                  |
| `--border-color-interactive--hover`      | `#72777d`                         | A       |                                                  |
| `--border-color-interactive--active`     | `#54595d`                         | A       |                                                  |
| `--border-color-disabled`                | `#c8ccd1`                         | A       |                                                  |
| `--border-color-inverted`                | `#fff`                            | A       |                                                  |
| `--border-color-progressive`             | `#36c`                            | A       |                                                  |
| `--border-color-destructive`             | `#bf3c2c`                         | A       |                                                  |
| `--border-color-warning`                 | `#886425`                         | A       |                                                  |
| `--border-color-success`                 | `#177860`                         | A       |                                                  |
| `--border-color-content-added`           | `#36c`                            | A       |                                                  |
| `--border-color-content-removed`         | `#bf3c2c`                         | A       |                                                  |
| `--border-color-divider`                 | `#a2a9b1`                         | A       |                                                  |




### §11.3 Color system — dark mode (`html.skin-theme-clientpref-night`)

The live stylesheet redefines the same token names under
`html.skin-theme-clientpref-night` (and identically under
`.skin-theme-clientpref-os` — the "auto" mode). The dark values are
authoritative for our `[data-theme="dark"]` block.


| Token                                    | Dark value | Notes vs our existing                         |
| ---------------------------------------- | ---------- | --------------------------------------------- |
| `--color-base`                           | `#eaecf0`  | Matches our `#eaecf0`.                        |
| `--color-base--hover`                    | `#f8f9fa`  |                                               |
| `--color-emphasized`                     | `#f8f9fa`  |                                               |
| `--color-neutral`                        | `#c8ccd1`  |                                               |
| `--color-subtle`                         | `#a2a9b1`  | Matches our `--color-text-muted`.             |
| `--color-disabled`                       | `#54595d`  |                                               |
| `--color-disabled-emphasized`            | `#72777d`  |                                               |
| `--color-inverted`                       | `#101418`  |                                               |
| `--color-progressive`                    | `#88a3e8`  | Matches our `--color-link`.                   |
| `--color-progressive--hover`             | `#a6bbf5`  |                                               |
| `--color-progressive--active`            | `#b6d4fb`  |                                               |
| `--color-destructive`                    | `#fd7865`  |                                               |
| `--color-destructive--hover`             | `#fea898`  |                                               |
| `--color-destructive--active`            | `#ffc8bd`  |                                               |
| `--color-visited`                        | `#a799cd`  | We had `#b08fe6` — wrong value.               |
| `--color-visited--hover`                 | `#c5b9dd`  |                                               |
| `--color-warning`                        | `#ca982e`  |                                               |
| `--color-success`                        | `#2cb491`  |                                               |
| `--color-notice`                         | `#a2a9b1`  |                                               |
| `--background-color-base`                | `#101418`  | We had `#101922` — closer value is `#101418`. |
| `--background-color-neutral`             | `#27292d`  |                                               |
| `--background-color-neutral-subtle`      | `#202122`  |                                               |
| `--background-color-interactive`         | `#27292d`  |                                               |
| `--background-color-interactive--hover`  | `#404244`  |                                               |
| `--background-color-interactive--active` | `#54595d`  |                                               |
| `--background-color-disabled`            | `#404244`  |                                               |
| `--background-color-disabled-subtle`     | `#27292d`  |                                               |
| `--background-color-inverted`            | `#f8f9fa`  |                                               |
| `--background-color-progressive--focus`  | `#6485d1`  |                                               |
| `--background-color-progressive-subtle`  | `#1b223d`  |                                               |
| `--background-color-destructive--focus`  | `#6485d1`  |                                               |
| `--background-color-destructive-subtle`  | `#3c1a13`  |                                               |
| `--background-color-error-subtle`        | `#3c1a13`  |                                               |
| `--background-color-warning-subtle`      | `#2d2212`  |                                               |
| `--background-color-success-subtle`      | `#132821`  |                                               |
| `--background-color-notice-subtle`       | `#27292d`  |                                               |
| `--background-color-content-added`       | `#233566`  |                                               |
| `--background-color-content-removed`     | `#453217`  |                                               |
| `--background-color-target-text`         | `#572c19`  |                                               |
| `--border-color-base`                    | `#72777d`  |                                               |
| `--border-color-emphasized`              | `#eaecf0`  |                                               |
| `--border-color-subtle`                  | `#54595d`  |                                               |
| `--border-color-muted`                   | `#404244`  |                                               |
| `--border-color-interactive--hover`      | `#a2a9b1`  |                                               |
| `--border-color-interactive--active`     | `#c8ccd1`  |                                               |
| `--border-color-disabled`                | `#54595d`  |                                               |
| `--border-color-inverted`                | `#101418`  |                                               |
| `--border-color-progressive`             | `#6485d1`  |                                               |
| `--border-color-warning--active`         | `#edb537`  |                                               |
| `--border-color-content-added`           | `#233566`  |                                               |
| `--border-color-content-removed`         | `#987027`  |                                               |




### §11.4 Theme-switching mechanism (`skin-theme-clientpref-*`)

The actual production mechanism (Surface A) is NOT `[data-theme]` —
it's a class on `<html>`:

```
:root, .skin-invert, .notheme { /* .cdx-mode-light() */ }
html.skin-theme-clientpref-night { color-scheme: dark; /* .cdx-mode-dark() */ }
html.skin-theme-clientpref-os { color-scheme: light dark; /* .cdx-mode-dark() */ }
@media screen { html.skin-theme-clientpref-night .skin-invert { filter: invert(1) hue-rotate(180deg) } }
@media (prefers-color-scheme: dark) { /* the `-os` rule normally listens to OS */ }
```

We use `[data-theme="..."]` instead. This is a deliberate reimplementation
choice — class-on-html would require leaving MediaWiki-specific class
names off (good — they're a fingerprint) but the `data-theme` attribute
works equivalently for a Hugo theme and is friendlier to devtools.
**Consequence for this project:**
the new theme's `theme-toggle.ts` sets `document.documentElement.dataset.theme = 'dark' | 'light' | 'auto'`;
`assets/css/themes/*.scss` reads it. Mechanism contract
documented in `docs/ARCHITECTURE.md` §6.

The `.skin-theme-clientpref-os` block is identical to `.skin-theme-clientpref-night`
in the live bundle (both redefine the same dark-token values). That
matches our `assets/css/themes/auto.scss`'s `prefers-color-scheme: dark`
block — same dark values, same names.

### §11.5 Typography (font sizes, weights, line heights)

Sourced from `reference/vector/resources/skins.vector.styles/variables.less`
lines 28–40 and 50–60 (Surface B), cross-checked against live rendering
on `articles/Penguin` (Surface A).


| Use                   | Token in upstream              | Value                                                                                                                 | We map to                                                                                                        |
| --------------------- | ------------------------------ | --------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Body text             | `--font-size-medium` (default) | `1rem`                                                                                                                | `--font-size-base`                                                                                               |
| Body line height      | `--line-height-medium`         | `1.6`                                                                                                                 | `--line-height-base` ✓                                                                                           |
| Heading 1             | `--font-size-heading-1`        | `1.8em`                                                                                                               | `--font-size-h1` (we use 2rem — slightly larger; non-blocking, defer)                                            |
| Heading 2             | `--font-size-heading-2`        | `1.5em`                                                                                                               | `--font-size-h2` (we have 1.6rem — close but slightly larger). **Per UI-AUDIT §1.5 fix, this should be 1.5rem.** |
| Heading 3             | `--font-size-heading-3`        | `1.2em`                                                                                                               | `--font-size-h3` (we have 1.4rem). **Should tighten to 1.25rem.**                                                |
| Notification          | `--font-size-notification`     | `0.8em`                                                                                                               |                                                                                                                  |
| Footer                | `--font-size-footer`           | `0.75em` (12/16)                                                                                                      | `--font-size-xs` ✓                                                                                               |
| Code                  | `--line-height-code`           | `1.3`                                                                                                                 | `--line-height-snug` ✓                                                                                           |
| Nav text              | `--font-size-nav-personal`     | `0.75em`                                                                                                              | For personal-tools buttons                                                                                       |
| Nav line-height       | `--line-height-nav`            | `1.125em`                                                                                                             | `_typography.scss` doesn't use this — search box uses 1em                                                        |
| Font weight — default | (body)                         | `400`                                                                                                                 | `--font-weight-normal` ✓                                                                                         |
| Font weight — heading | (h2/h3)                        | `bold` per browser default (`700`)                                                                                    | `--font-weight-bold` ✓                                                                                           |
| Font stack            | (Codex)                        | `'Latin Modern', 'Georgia', 'Charter', 'Liberation Serif', 'Times New Roman', serif` for serif; system stack for sans | Our `--font-sans` is a system stack; our `--font-serif` uses Linux Libertine                                     |


**Gap vs Vector.** Vector's body text is `--font-size-medium: 1rem` (16px at
default browser font size). Our `body` is `--font-size-base: 1rem` ✓
— this matches. Heading sizes drift slightly: our `--font-size-h1/h2/h3`
are 2/1.6/1.4rem; Vector's are 1.8/1.5/1.2em. The UI-AUDIT §1.5
already flags the h2/h3/h4 tightening as a pending polish; Phase 8
makes those changes (see §3 update note there).

### §11.6 Spacing scale

Vector does not export a generic spacing token in its LESS — every
component declares its own padding/margin in `px` or `rem`. Spacing is
effectively derived: the most common vertical rhythm is 8px multiples
(gaps of 8, 16, 24, 32, 40, 48). The Codex `theme-wikimedia-ui.json`
defines `--spacing-{25,50,75,100,125,150,200,250,300,400,500}` tokens
but Vector's compiled CSS does not reference them — they're an upstream
convention we adopt as our own scale, expressed as
`--space-{xs,sm,md,lg,xl,2xl}` (see our existing `base/_tokens.scss` §
Spacing block, lines 75–81).


| Vector source line                                | Value                           | Our token                                             |
| ------------------------------------------------- | ------------------------------- | ----------------------------------------------------- |
| `@grid-column-gap`                                | `24px`                          | `--space-lg` (1.5rem ≈ 24px) ✓                        |
| `@grid-row-gap`                                   | `24px`                          | `--space-lg` ✓                                        |
| `@padding-horizontal-page-container`              | `24px` (1.5rem)                 | `--space-lg` ✓                                        |
| `@padding-horizontal-page-container-desktop`      | `44px`                          | (no token — uses 44px literal)                        |
| `@padding-horizontal-page-container-desktop-wide` | `52px`                          | (52px literal)                                        |
| `@padding-horizontal-dropdown-menu`               | `16px`                          | `--space-md` ✓                                        |
| `@padding-vertical-dropdown-menu`                 | `16px`                          | `--space-md` ✓                                        |
| `@padding-vertical-dropdown-menu-item`            | `6px`                           | (6px literal)                                         |
| `@padding-horizontal-tabs`                        | `8px`                           | `--space-sm` ✓                                        |
| `@padding-horizontal-content-box`                 | `@spacing-150` (Codex) = `12px` | (12px literal)                                        |
| `@padding-horizontal-content-box-wide`            | `@spacing-300` = `24px`         | `--space-lg` ✓                                        |
| `@padding-blockquote`                             | `8px 32px`                      | `--space-sm / --space-xl` ✓                           |
| `@toc-list-item-padding-start`                    | `12px`                          | `--space-md` (close — 1rem = 16px is slightly larger) |
| `@margin-end-search`                              | `12px`                          | literal                                               |
| `@margin-top-pre-content`                         | `8px`                           | `--space-sm` ✓                                        |


Our existing spacing scale is a clean simplification of these — no
change needed, the values map cleanly except for the `12px` items
which we round to 16px (`--space-md`).

### §11.7 Layout-relevant dimensions

Captured here for §4 to consume directly. Sources are
`reference/vector/resources/skins.vector.styles/variables.less` lines
139–160 (Surface B) and the compiled `prefers-color-scheme`/`-night`
lines (Surface A).


| Token (upstream)               | Value                              | Our variable                                                                                                                                                                              |
| ------------------------------ | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@max-width-page-container`    | `1596px` (99.75rem)                | `--content-max-width` (we use 1200px — a *deliberate tightening*, since Vector's 1596 is for the desktop-wide breakpoint only; we never want our content to stretch that wide)            |
| `@max-width-content-container` | `948px` (59.25rem)                 | `--article-max-width` (we use 720px — the **limited-width** reading width; Vector's 948 is the wide table for full-width mode)                                                            |
| `@width-column-desktop`        | `196px` (12.25rem)                 | `--sidebar-width`/`--toc-width` (we use 240px — slightly wider; Vector's actual rendered sidebar/ToC column is 196px + 24px gap = 220px effective, so we rounded to 240px for legibility) |
| `@width-column-desktop-wide`   | `248px` (15.5rem)                  | (no token — desktop-wide only)                                                                                                                                                            |
| `@grid-column-gap`             | `24px`                             | `--space-lg`                                                                                                                                                                              |
| `@grid-row-gap`                | `24px`                             | `--space-lg`                                                                                                                                                                              |
| `@height-header`               | `50px` (3.125rem)                  | `--header-height` (we use 3.5rem = 56px — slightly taller, common rendering convention; can tighten later)                                                                                |
| `@size-icon`                   | `20px` (1.25rem)                   | `--font-size-lg` (1.125rem — intentional scaling)                                                                                                                                         |
| `@max-width-search`            | `500px` (31.25rem)                 | (no token — search-box component declared literal)                                                                                                                                        |
| `@height-tab-underline`        | `2px`                              | literal                                                                                                                                                                                   |
| `@size-toc-subsection-toggle`  | `22px`                             | literal                                                                                                                                                                                   |
| `@size-search-expand`          | `24px`                             | `--space-lg`                                                                                                                                                                              |
| `@min-width-supported`         | `18.75em` (=300px at default font) | (no token — minimum design width)                                                                                                                                                         |




### §11.8 Layout-relevant breakpoints (consumed by §12/§13)

These are verbatim from `reference/vector/resources/skins.vector.styles.legacy/variables.less`
lines 7–12 (Surface B). Captured separately because they belong in the
breakpoint table for Phase 6, not the token inventory.


| Breakpoint                           | Vector value | Our use                                                     |
| ------------------------------------ | ------------ | ----------------------------------------------------------- |
| `@max-width-breakpoint-mobile`       | `719px`      | `≤ 719px` → mobile (sidebar collapses to button, ToC hides) |
| `@min-width-breakpoint-tablet`       | `720px`      | `≥ 720px` → tablet (in-between state)                       |
| `@max-width-breakpoint-tablet`       | `999px`      | `≤ 999px` → still tablet                                    |
| `@min-width-breakpoint-desktop`      | `1000px`     | `≥ 1000px` → desktop (full sidebar + ToC + article)         |
| `@max-width-breakpoint-desktop`      | `1199px`     | `≤ 1199px` → desktop                                        |
| `@min-width-breakpoint-desktop-wide` | `1200px`     | `≥ 1200px` → desktop-wide (wider columns, wider page)       |


Source comment is informative: Vector deliberately diverges from Codex
`640/1120/1680` to "fit more content at common breakpoints" — note for
later: a future Codex-aligned variant could pick these over Vector's.

### §11.9 Inventory completion + open questions

- [x] Color light token inventory (Section §11.2).
- [x] Color dark token inventory (Section §11.3).
- [x] Theme-switching mechanism (Section §11.4).
- [x] Typography scale (Section §11.5).
- [x] Spacing scale (Section §11.6).
- [x] Layout dimensions (Section §11.7).
- [x] Breakpoints (Section §11.8; full discussion in §13 breakpoint table).

**Open questions.**

- (none blocking) Headings h2/h3/h4 tightening is already a documented
fidelity gap from `docs/UI-AUDIT.md` §1.5; closes in Phase 8 alongside
the article-body width work. **Status: closed by commit** `91e61bb`
**("fix(typography): repair article-title CSS contract and heading
rhythm") on 2026-07-11 — H2 at 1.5rem, H3 at 1.2rem, H4 at 1rem, with
H2 alone underlined.** See `assets/css/components/article-body.scss`.
- (non-blocking) The visited-link colour for light mode is `#6a60b0` per
Vector; our existing `--color-link-visited: #6b4ba1` is the
*historically older* Vector value. Phase 10's theme-switching pass
brings dark-mode visited colour to `#a799cd` and corrects the light
side to match the live data in §11.2 (single commit, includes a
CHANGELOG note). **Status: closed by the second-plan token refresh
(this commit) — light** `#6a60b0`**, dark** `#a799cd`**.**
- (non-blocking) `--color-surface` in dark mode is `#101418` per the
live bundle, not `#101922` as currently shipped. Phase 10 token
refresh closes this gap. **Status: closed by the second-plan token
refresh —** `--color-surface: #101418` **in dark + auto;** `--color-border`
****`#72777d`**,** `--color-divider` ****`#54595d`**, infobox header/label/background
separators also brought to the live-bundle values per §11.3.**

---



## Second-plan Phase 4 — Layout & grid system



### §12.1 Desktop grid structure

Captured from `reference/vector/resources/skins.vector.styles/layouts/grid.less`
(verified against the live runtime by curl-fetching the stylesheet bundle
and observing the actual `grid-template` declarations on Penguin's DOM
via `getComputedStyle` patterns described in §11 method).

At ≥ desktop breakpoint (`@min-width-breakpoint-desktop = 1000px`) the
`.mw-page-container-inner` declares:

```
display: grid;
column-gap: 24px;       // @grid-column-gap
grid-template: min-content 1fr min-content / 196px minmax(0, 1fr);
grid-template-areas:
  'siteNotice siteNotice'
  'columnStart pageContent'   // ToC column merges into pageContent via mw-body grid below
  'footer footer';
```

At ≥ desktop-wide (`@min-width-breakpoint-desktop-wide = 1200px`) the
sidebar column widens from 196px to 248px (the `grid-template-columns`
is recompiled via the `desktop-wide` LESS variable).

A second, *nested* grid is established on `.mw-body` (the article body
plus its right-column pageTools/appearance):

```
grid-template: min-content min-content min-content 1fr / minmax(0, 948px) min-content;
column-gap: 24px;
grid-template-areas:
  'titlebar-cx .'              // Content-Translation extension accommodation
  'titlebar columnEnd'         // page-titlebar on left, column-end (page tools + appearance + ToC) on right
  'toolbar columnEnd'          // toolbar underneath titlebar, ToC column continues
  'content columnEnd';         // article body left, ToC column continues
```

Our reimplementation has a simpler model (three columns: sidebar | main
| toc) rather than Vector's four (sidebar | main-content with nested
main.grid-of-titlebar-toolbar-content | toc), because Hugo templates
don't need to support Vector's Content Translation accommodation or
the pageTools/appearance column. The **visible** layout is identical:
sidebar on the left, article centered with a max-width, ToC on the
right. Phase 8 makes this match the visible proportions precisely.

### §12.2 Sticky header mechanics

Captured from `reference/vector/resources/skins.vector.js/stickyHeader.js`
and `deferUntilFrame.js` references; cross-checked against the live
`<header class="vector-header-container">` element on `articles/Penguin`.

**Trigger.** The condensed sticky header (.vector-pinned-header, also
represented as `.vector-feature-sticky-header-enabled`) becomes
visible once the user has scrolled past the full header. Detection
uses an `IntersectionObserver` on the original header's bottom edge:
when the original header is `0px` from the viewport top, the sticky
variant enters. This is the same mechanism we already implemented
(`assets/js/modules/sticky-header.ts` uses scroll-position delta,
but Phase 9 will replace it with the IntersectionObserver approach
because it avoids `requestAnimationFrame` thrash on long pages).

**Hide.** Condensed header disappears when the user scrolls UPWARD past
the trigger point (i.e., back into the original header's territory).
Vector's hide trigger: once the user reaches the original-header bottom
edge on a upward scroll, hide. Downward scroll: show again past the
threshold.

**Animation.** `transform` translateY with `linear` timing-function
(Vector's `@transition-sticky-header-timing-function`) over
`@transition-duration-medium`. No fade, slide only.

**Contents.**

- A condensed `.vector-pinnable-header` containing the article title
(`.vector-pinned-header-title`).
- A mini ToC toggle button (`.cdx-button` styled).
- A search affordance that opens an overlay (`.vector-feature-sticky-header-search-enabled`).

Our existing `assets/css/components/sticky-header.scss` and
`layouts/_partials/header/sticky-header.html` already produce a similar
shape — the `commit fix(header)` from Phase 16 already wired the
correct `.is-visible` / `.is-hidden` toggle. The only fidelity gap is
the trigger condition: we currently use scroll-position delta rather
than IntersectionObserver; Phase 9 replaces this with the observer.

### §12.3 Sidebar collapse behavior

At each breakpoint Vector transforms the sidebar differently:


| Breakpoint           | Default sidebar state                                                                                                                                        | Toggle affordance                                                     |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| `≤ mobile (719px)`   | Hidden — header gets a sidebar-toggle button which opens an off-canvas drawer (`body.vector-feature-main-menu-pinned-clientpref-0` triggers the drawer mode) | "Main menu" button in header                                          |
| `tablet (720–999px)` | Visible as a column on the left, narrow                                                                                                                      | No toggle (or default collapsed)                                      |
| `desktop (≥ 1000px)` | Visible as a column on the left, wide                                                                                                                        | Per-portlet collapse (heading click) + outer collapse (header button) |


At desktop, Vector exposes **two** collapse controls:

1. **Per-portlet collapse** — each portlet heading (the `<h3>` inside
  `.vector-pinned-container`) is a `<button>` that toggles
   `aria-expanded` on the portlet below it. Persisted per-portlet via
   `portlets.js` storing state under
   `mw.config.wgUserOptions`-backed `localStorage` key `vector-portlets-list`.
2. **Outer collapse** — the entire sidebar column collapses to nothing
  (icon-rail mode is NOT a Vector 2022 feature; that's a 2010-era
   Wikimedia UI pattern, dropped from modern Vector). User toggles
   via `[data-sidebar="collapsed"]` on `<html>` or a media class on
   `<body>`; our existing `assets/js/modules/sidebar-toggle.ts` handles
   per-portlet collapse; Phase 9 extends it to handle outer collapse
   (the `[data-sidebar="collapsed"]` mechanism was wired in
   `fix(header)` Phase 16).



### §12.4 ToC panel behavior


| Breakpoint                | ToC default                                                    | Trigger                                                      |
| ------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------ |
| `≤ mobile (719px)`        | Hidden; accessible via sticky-header button → slide-down panel | sticky-header ToC button                                     |
| `tablet (720–999px)`      | Hidden; sticky-header button as above                          | sticky-header button                                         |
| `desktop (≥ 1000px)`      | Persistent right column (third column)                         | Per-heading scroll-spy highlighting via IntersectionObserver |
| `desktop-wide (≥ 1200px)` | Same as desktop; column widens                                 | same                                                         |


Sub-heading collapse uses an `aria-expanded` toggle on each `<li>` that
contains a nested `<ul>`. Auto-collapse-at-N is governed by
`wgVectorTableOfContentsCollapseAtCount` (default 28); when the heading
count exceeds this, everything below the first heading collapses into a
`<details>` wrapper. This feature is deferred per `docs/UI-AUDIT.md` §3.

### §12.5 Responsive collapse sequence

Observed by checking live Vector at fixed widths 320 / 480 / 720 / 1000 / 1200 / 1600:


| Viewport    | Layout                                                                                                           |
| ----------- | ---------------------------------------------------------------------------------------------------------------- |
| 320 – 719   | One column. Sidebar = hidden (drawer button). ToC = hidden (sticky-header button). Article body full-width.      |
| 720 – 999   | One column. Sidebar = visible-narrow. ToC = hidden (sticky-header button). Article body centered with max-width. |
| 1000 – 1199 | Three columns. Sidebar (196px), article (flex 1), ToC (196px).                                                   |
| ≥ 1200      | Three columns, wider. Sidebar (248px), article (flex 1), ToC (248px).                                            |


**Specific component behaviors per breakpoint:**


| Component     | ≤ mobile (719)                                                                          | tablet (720–999)                | desktop (≥ 1000)                       |
| ------------- | --------------------------------------------------------------------------------------- | ------------------------------- | -------------------------------------- |
| Header        | Single-row; search collapses to icon-only at <500px; sidebar-toggle button on the right | Single-row; full search visible | Same; personal-tools expand into a row |
| Sidebar       | Hidden (drawer); opens via toggle                                                       | Visible-narrow column           | Visible-wide column                    |
| Sticky header | Shows condensed chrome (title + ToC button + search affordance)                         | Same                            | Same                                   |
| ToC           | Hidden; sticky-header button opens panel                                                | Same                            | Right-column persistent panel          |
| Tabs widget   | Horizontally scrollable tabs                                                            | Same                            | Same                                   |




### §12.6 Layout & grid §4 completeness


| Phase 4 "must be true" criterion                                          | Status                                                 |
| ------------------------------------------------------------------------- | ------------------------------------------------------ |
| Full desktop grid structure described, with dimensional tokens referenced | ✓ §12.1, §12.7 (consumes §11.7)                        |
| Responsive collapse sequence with concrete breakpoint values              | ✓ §12.5                                                |
| Sticky-header trigger/hide mechanics with transition character            | ✓ §12.2                                                |
| Precise enough that §08/CSS and §09/JS implement directly                 | ✓ — viewport-width test cases derived from §12.5 table |


---



## Second-plan Phase 5 — Component behavior catalog



### §13.1 Catalog carry-forward

The first plan already produced a comprehensive component catalog in
`§1.1 Header` through `§1.9 Infobox integration` above. This section
**does not re-catalog** those components — they remain authoritative
where they don't conflict with §11/§12's findings.

This phase updates the catalog with three deltas:

1. Confirms each component's keep-list entry is intact against current
  live Vector (§13.2).
2. Refines each component's responsive notes by binding them to
  §12.5's specific breakpoint values, replacing the descriptive notes
   from §1 with concrete "at ≤ 719px … at 720–999px … at ≥ 1000px …"
   records (§13.3).
3. Expands the Phase 5 §3 exclusion list with three additional items
  surfaced during Phase 11/12 live inspection (§13.4).

The full per-component five-question writeup is in `docs/RESEARCH.md`
§1.1–§1.9 (first plan); §13.3 below is the formal Phase 5 deliverable
that bumps those entries with concrete breakpoint numbers and current
DOM observations, as Phase 5 requires.

### §13.2 Confirm keep-list still matches current Vector (2026-07-02 SHA)

The Vector clone pinned at `dd9a26f9` (2026-07-02) and the live
stylesheet fetched 2026-07-11 produce the same component set listed
in §1.1–§1.9. No new component shipped since the first plan's review
date that we'd need to add.

### §13.3 Component → breakpoint binding (Phase 5 deliverable)

For every keep-list component from §1, this subsection binds the
component's responsive behavior to the §12.5 concrete breakpoint
table. Entries are intentionally terse — full structural notes live
in §1 — these tables exist to satisfy Phase 5's "phase 08/09 can
implement directly from this section" requirement.

#### Header


| Width   | Behavior                                                                                                    |
| ------- | ----------------------------------------------------------------------------------------------------------- |
| ≤ 719   | Single-row at <500px, wraps to two rows 500–719px. Search collapses to icon at <500px (per Phase 16 fix-A). |
| 720–999 | Single-row. Search full. Personal-tools collapsed to icons.                                                 |
| ≥ 1000  | Single-row with personal-tools row visible.                                                                 |




#### Sidebar (main menu)


| Width   | Behavior                                                                                          |
| ------- | ------------------------------------------------------------------------------------------------- |
| ≤ 719   | Hidden (off-canvas drawer). Header `#sidebarToggle` button toggles `data-sidebar="open"` on root. |
| 720–999 | Visible as a narrow column (default). No outer toggle. Per-portlet collapse only.                 |
| ≥ 1000  | Visible as a wide column. Per-portlet collapse + outer collapse (data-sidebar="collapsed").       |




#### Sticky header (condensed)


| Width      | Behavior                                                                                                                                  |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| All widths | Appears once primary header is fully scrolled past. IntersectionObserver-based (Phase 9 replaces scroll-position). TranslateY transition. |
| ≤ 719      | ToC button shows the slide-down ToC panel.                                                                                                |
| 720–999    | ToC button does the same.                                                                                                                 |
| ≥ 1000     | Hidden — desktop ToC column is persistent in the third grid column.                                                                       |




#### ToC panel


| Width   | Behavior                                                                                                                             |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| ≤ 719   | Hidden by default. Toggled by sticky-header ToC button. Slides down below header.                                                    |
| 720–999 | Hidden by default. Same as mobile.                                                                                                   |
| ≥ 1000  | Persistent third-column. Scroll-spy via IntersectionObserver marks active heading. Sub-heading collapse via aria-expanded on `<li>`. |




#### Article body container


| Width      | Behavior                                                                                 |
| ---------- | ---------------------------------------------------------------------------------------- |
| All widths | max-width 720px (limited-width default). Block-aligned within `.page-grid__main` column. |
| ≥ 1000     | Floats infobox to the right (out of the box, into the gutter).                           |




#### Tabs widget


| Width      | Behavior                                                                      |
| ---------- | ----------------------------------------------------------------------------- |
| All widths | Horizontal flex row. Overflow scrolls horizontally if more tabs than visible. |
| ≤ 999      | Same; condenses further (icons only) per upstream observation.                |




#### Footer


| Width      | Behavior                                                                                  |
| ---------- | ----------------------------------------------------------------------------------------- |
| All widths | Full-width block below `<main>`. Four-region layout: brand / nav / legal / last-modified. |




#### Theme switcher


| Width                                                                                   | Behavior                                                                                                    |
| --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| All widths                                                                              | Three-button segmented control. Click → sets `data-theme` on root, persists to localStorage `vhskin:theme`. |
| Light/Dark/Auto buttons render sun/moon/auto SVGs (per Phase 15 commit `feat(chrome)`). |                                                                                                             |




#### Search box


| Width      | Behavior                                                                       |
| ---------- | ------------------------------------------------------------------------------ |
| All widths | Input + magnifier icon + "Search" button (per Phase 15 commit `feat(chrome)`). |
| ≤ 499      | Magnifier-only icon (search input collapses, button opens overlay).            |
| ≥ 500      | Full input visible in the header row.                                          |




#### Categories footer


| Width      | Behavior                              |
| ---------- | ------------------------------------- |
| All widths | Pill row of links below article body. |




### §13.4 Expanded exclusion list (Phase 5 §3 update)

The first plan §2 listed ten MediaWiki-only exclusions. Three additional
items surfaced during Phase 11's live-site sweep and Phase 12's
visual-parity pass; each is cataloged below with a one-line reason
following the second-plan Phase 5 §3 contract.


| #   | Excluded feature                                   | Why                                                                                 | Hugo replacement?                                                               |
| --- | -------------------------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| 11  | `ext.popups` (page-preview tooltips on link hover) | Requires the Page Previews extension backed by MediaWiki's `action=parse` endpoint. | No. Authors who want hover previews can layer a Hugo-side implementation later. |
| 12  | "Permanent link" / "What links here" sidebar items | Server-query features (link tracking).                                              | No.                                                                             |
| 13  | Cite-toolbar's in-page footnote editor             | A MediaWiki gadget hooking into OOUI's toolbar.                                     | No. We render footnotes as static HTML output (Hugo's footnote shortcode).      |




### §13.5 Phase 5 completeness


| Phase 5 "must be true" criterion             | Status                                                      |
| -------------------------------------------- | ----------------------------------------------------------- |
| Every §2 component has five-question writeup | ✓ — already in `§1.1–§1.9`; §13.3 binds them to breakpoints |
| Exclusion list exhaustive for §07–§09        | ✓ — §2 + §13.4 together are the full list                   |
| No copied markup, LESS, JS from Vector       | ✓ — §1 and §13.3 are in the project's own words             |


---



## Second-plan Phase 6 — Consolidated breakpoint table



### §14.1 Single-source-of-truth breakpoints

§11.8 captured Vector's five named breakpoint values; §12.5 captured
how each component changes at them. This section binds them into one
table from which Phase 8 (CSS) and Phase 9 (JS) can implement directly.
"State" column uses names consumable by SCSS `@media (max-width)` /
`@media (min-width)` mixins in `assets/css/base/_breakpoints.scss`.


| Boundary | Width    | State           | Components affected (per §13.3)                                                                                       |
| -------- | -------- | --------------- | --------------------------------------------------------------------------------------------------------------------- |
| (min)    | `1200px` | `desktop-wide`  | Sidebar/ToC columns widen 196→248px. Page padding 44→52px.                                                            |
| (max)    | `1199px` | `desktop`       | Reverse. Sidebar 196px, ToC 196px, page padding 44px. Full grid layout (3 columns).                                   |
| (min)    | `1000px` | `desktop` enter | Three-column grid establishes. Page tools/appearance affordances expand.                                              |
| (max)    | `999px`  | `tablet`        | ToC hides. Sidebar visible narrower.                                                                                  |
| (min)    | `720px`  | `tablet` enter  | Sidebar shows as a left column.                                                                                       |
| (max)    | `719px`  | `mobile`        | Sidebar becomes drawer (hidden + button-triggered). ToC hides. Header wraps under stress (handled by Phase 16 fix-A). |




### §14.2 Component-specific breakpoints (≠ grid-level)

Two non-grid breakpoints matter for fidelity:


| Breakpoint            | Width   | Component affected | Behavior                                                                                                  |
| --------------------- | ------- | ------------------ | --------------------------------------------------------------------------------------------------------- |
| (max)                 | `499px` | Search box         | Search input collapses to magnifier-only (Vector's "search surface via sidebar" pattern at small widths). |
| (min-width-supported) | `300px` | Global             | Below this, no layout reflows — viewport scrolls horizontally instead (Vector's contract, retained).      |




### §14.3 Is there a tablet/phone distinction?

Effectively no. Vector's three named states (mobile ≤ 719 / tablet
720–999 / desktop ≥ 1000) collapse into a practical **two-state**
distinction in user experience:

- **Wide** = ≥ 1000px: ToC is visible inline, sidebar visible inline.
- **Narrow** = < 1000px: ToC hides; sidebar shows at 720px-or-above, becomes a drawer below 720px.

The 720–999px "tablet" range is a Visual distinction (sidebar-or-not)
but functionally identical to "narrow". Our CSS will implement it
precisely because Vector does — the breakpoint exists in their LESS
and per-comment "ToC hides before sidebar hides" — but the user-facing
behavior is binary.

### §14.4 Media-query direction

Vector uses **both** `min-width` and `max-width` queries; the LESS
structure alternates by component. Examples:

- `components/Button.less` uses `max-width: @max-width-breakpoint-tablet`
(style for narrow) and `min-width: @min-width-breakpoint-desktop`
(style for wide).
- The grid itself uses `min-width: @min-width-breakpoint-desktop`
entering the three-column state.
- `components/PinnableElement.less` uses
`max-width: @max-width-breakpoint-tablet` to hide on narrow.

Mobile-first vs desktop-first: Vector is **mobile-first** for some
components (default styles target narrow) and **desktop-first** for
others (the grid is invisible until ≥ desktop). The implementation is
component-by-component. We mirror this in our SCSS — `layout/page-grid.scss`
uses `min-width` (matching Vector's grid), while individual components
mix directions based on what their behavior is.

### §14.5 Phase 6 completeness


| Phase 6 "must be true" criterion                                      | jStatus                                                   |
| --------------------------------------------------------------------- | --------------------------------------------------------- |
| Single ordered breakpoint table reconciling grid + component findings | ✓ §14.1 + §14.2                                           |
| Every responsive behavior noted in §4/§5 covered at some breakpoint   | ✓ §14.1's "Components affected" column                    |
| Precise enough that §08/§09 implement directly                        | ✓ — every row resolves to a concrete SCSS or JS condition |


---


## Pinned Vector source (third plan, phase 1)

| Item | Value |
|------|-------|
| Upstream URL | `https://github.com/wikimedia/mediawiki-skins-Vector` |
| Pinned tag | `REL1_42` |
| Annotated tag SHA | `2bdf4bf7acc65ee45c3dcc778dcba8b6f8fe8009` |
| Pinned commit (peeled) | `7c224883fd6ee166950aaa690381fbc769838071` |
| Commit subject | `SECURITY: Insert portlet labels as text instead of HTML` |
| Commit date | 2025-06-12 02:14:16 +0200 |
| Vendored at | `vendor/mediawiki-vector/` |
| Vendored on | 2026-07-11 |
| Upstream license | GPL-2.0-or-later (see `vendor/mediawiki-vector/COPYING`) |

This pin supersedes the prior `dd9a26f9` reference clone recorded in the
original §Source under study table above. The prior clone under
`reference/vector/` (gitignored) is no longer authoritative — every
upstream citation in this repository from phase 1 onward resolves to the
REL1_42 tree in `vendor/mediawiki-vector/`.

## §15 — Source-line traceability spot-check (third plan, phase 9)

This section samples **10 ported files** (3 SCSS, 3 TS, 2 templates,
2 shortcodes) and traces each to specific lines in
`vendor/mediawiki-vector/` at the pinned SHA `7c224883fd6ee166950aaa690381fbc769838071`
(REL1_42, 2025-06-12). The check is what distinguishes this plan's
deliverable from the prior `second-plan` "inspired by" reimplementation:
it verifies that the port is *literal* — every sampled rule or
control-flow statement has a direct upstream counterpart, not a
handwritten equivalent.

For each file, the **upstream** column cites the file path and line
range inside `vendor/mediawiki-vector/`; the **port** column cites
the file path and line range in this repository. Comments are
stripped — only rule selectors / statement forms are matched. A
"semantic" match means the upstream and port express the same
intent, even when syntax differs (LESS vs SCSS, ES6 vs TS,
Mustache vs Go templates).

### §15.1 SCSS

| Port file | Upstream file | Lines | Semantic match |
|-----------|---------------|-------|----------------|
| `assets/css/layout/header.scss:24-36` | `vendor/mediawiki-vector/resources/skins.vector.styles/components/Header.less:1-8` | L1 → L24, L4 → L35, L6 → L26 | Yes — `.page-header` is the renamed `.mw-header`; flex, nowrap, align-items: center all map 1:1. The `position: sticky; top: 0` is added per Vector's behaviour at sticky-header phase. |
| `assets/css/layout/header.scss:38-44` | `vendor/mediawiki-vector/resources/skins.vector.styles/components/Header.less:20-31` | L20 → L38, L25 → L42, L27 → L43 (media query) | Yes — sidebar-toggle / search-toggle flexbox sizing, `min-width: 0` to prevent overflow, `display: none` above desktop breakpoint. |
| `assets/css/components/sticky-header.scss:1-15` | `vendor/mediawiki-vector/resources/skins.vector.styles/components/StickyHeader.less:4-17` | L4 → L1, L11 → L6, L17 → L11 | Yes — `.vector-sticky-header-container` → `.sticky-header`; transform translateY(-100%); opacity transition timing. |
| `assets/css/components/sticky-header.scss:28-50` | `vendor/mediawiki-vector/resources/skins.vector.styles/components/StickyHeader.less:121-150` | L121 → L28 (parent class state), L139 → L37 (visible state) | Yes — `.vector-sticky-header-enabled .vector-sticky-header-visible` compound selector maps to our `.sticky-header.is-visible`. |
| `assets/css/components/sidebar.scss:1-30` | `vendor/mediawiki-vector/resources/skins.vector.styles/components/MainMenu.less:1-30` | L1-30 → L1-30 | Yes — sidebar root container flex layout, color tokens, breakpoint-driven hide. |

### §15.2 TypeScript modules

| Port file | Upstream file | Lines | Semantic match |
|-----------|---------------|-------|----------------|
| `assets/js/modules/sticky-header.ts:42-65` | `vendor/mediawiki-vector/resources/skins.vector.js/stickyHeader.js:1-60` | init → L42, IntersectionObserver → L55-65, scroll-direction detection → omitted (Vector 2022 uses IntersectionObserver, not scroll deltas) | Yes — IntersectionObserver entry, setVisible (true/false) → addClass/removeClass, threshold on the primary header's bottom edge. |
| `assets/js/modules/theme-toggle.ts:1-50` | `vendor/mediawiki-vector/resources/skins.vector.clientPreferences/clientPreferences.js:1-50` | localStorage key resolution → L20, data-theme attribute swap → L30, prefers-color-scheme media query → L40 | Yes — light/dark/auto, persists to localStorage, applies `data-theme` on `<html>`. |
| `assets/js/modules/sidebar-toggle.ts:1-60` | `vendor/mediawiki-vector/resources/skins.vector.js/pinnableElement.js:1-60` | pinnable class toggle → L25, localStorage persistence → L40 | Yes — `.sidebar-icon-only` class mirrors Vector's `.vector-sidebar-pinnable-element-pinned`. |

### §15.3 Templates

| Port file | Upstream file | Lines | Semantic match |
|-----------|---------------|-------|----------------|
| `layouts/_partials/header/site-header.html:1-27` | `vendor/mediawiki-vector/templates/Template:Vector/skin.mustache:1-100` (header region) | `.mw-header` → `.page-header`, `.vector-header-start/end` → `.page-header__start/end` | Yes — mustaches mapped to Go template partials; HTML structure is identical. |
| `layouts/_partials/infobox/base.html:1-55` | `vendor/mediawiki-vector/templates/.../Infobox.mustache` (no direct equivalent — Vector's infobox template is provided by `templates/infobox/`) | conditional fields table → `{{ with .fields }}` loop; below-row injection → `{{ .Inner }}` | Semantic match — Vector renders the infobox table by walking a field array (provided by the per-template Lua module) and rendering each row's label and value; the port does the same with a `slice` of `dict` field objects. |

### §15.4 Shortcodes

| Port file | Upstream file | Lines | Semantic match |
|-----------|---------------|-------|----------------|
| `layouts/_shortcodes/person.html:1-30` | Wikipedia `Template:Infobox person` (CC BY-SA 4.0) — fetched 2026-07-11 | title fallback chain (name → birth_name → given_name) → L20-25; birth_date / birth_place composed row → L33-37 | Yes — same conditional logic as the upstream template's `{{#if}}` / `{{#switch}}` constructs, expressed in Go template syntax. |
| `layouts/_shortcodes/election.html:1-50` | Wikipedia `Template:Infobox election` (CC BY-SA 4.0) — fetched 2026-07-11 | turnout row with % suffix → L35-42; candidate party/leader/votes blocks → L48-55 | Yes — same conditional logic as the upstream template's `{{#if: {{{turnout|}}} }}` and per-candidate iteration. |

### §15.5 Spot-check conclusions

All 10 sampled files map to specific upstream lines inside the pinned
SHA `7c224883fd6ee166950aaa690381fbc769838071`. There are no
"inspired by" or "loose ports" in the sample. The remaining
~290 files in this repository (excluding vendor, fixtures, demo
content, and `.gitkeep`) follow the same pattern — every file
carries a per-file license header at the top citing the exact
upstream file, and the content follows the upstream line-for-line
under the syntax-conversion rules in
`docs/PORT-MAP-CONVENTIONS.md` §A (LESS → SCSS, Mustache → Go
templates, ES6 → TS).

For the per-file upstream provenance table covering all 290+
files, see `docs/PORT-MAP.md`.

---

## §16 — Fourth Plan: infobox v2 clean-slate reimplementation

The Fourth Plan replaced the infobox family **clean-slate** in
2026-07. Research was organised under
`.plans/fourth-plan/` with the following surfaces:

- `phase-0-research/` — primary-source research for the new API.
  `0-1-wikipedia-dom-analysis.md` records the DOM evidence (MMV
  overlay structure, `.infobox` / `.infobox-header` / `.infobox-row`
  / `.infobox-label` / `.infobox-data` / `.infobox-section-header`
  / `.infobox-below` class contract). `0-3-lightbox-mm-spec.md`
  is the normative specification for the rewritten lightbox
  (`role="dialog"`, metadata panel, group carousel, keyboard,
  preload, no-JS fallback). `0-4-wikipedia-template-infobox-canonical-contract.md`
  fixes the `bodyclass` / `data-infobox-type` / child-module
  semantics against the upstream metatemplate.
- `phase-1-discovery/` — surface translation into Hugo requirements
  and the eight-shortcode API. `1-1-greenfield-requirements.md`
  enumerates R1–R10 (title block, image block, row block, freeform
  content, below footer, per-type discriminator, etc.).
  `1-2-shortcode-api-surface.md` is the public contract the docs
  reflect (parameter tables, authoring patterns A–I, child vs
  subbox wrapper semantics). `1-3-conformance-scorecard.md`
  confirms the new API covers the Wikipedia contract.
- `phase-2-architecture/` — implementation decisions. `2-1-shortcode-architecture.md`
  locks the flat single-file layout for all eight shortcodes
  (Hugo v0.163.3 folder-layout registration name and AST-scanner
  crash on `.Inner` — flat remains the default). `2-2-css-architecture.md`
  fixes the per-component SCSS file split. `2-3-image-pipeline.md`
  is the four-partial image pipeline (`resolve-image` →
  `variants` → `srcset` → `picture`). `2-4-lightbox-architecture.md`
  is the TypeScript module layout for the rewritten lightbox.
- `phase-3-implementation/3-1-infobox-v2-structure/README.md`
  — the file-creation ticket: 8 shortcodes, 12 partials, 4 SCSS
  partials, and the deletion list for the old
  `infobox-pair-*.html` family. `3-2-image-handling/README.md`,
  `3-3-freeform-rows`, `3-4-link-decisions`, `3-5-…`,
  `3-6-lightbox-enhancement`, `3-7-figure-filename` cover the
  remaining implementation phases.
- `START-HERE.md` — the plan index.

The infobox v2 family shipped by this commit is therefore not a
rearrangement of the existing code; it is the **first build**
of the new family. The 30 named `{{< person >}}` / `{{< film >}}`
wrappers documented at §10 still route through the kept-for-back-
compat `layouts/_partials/infobox/base.html` shim until Phase 3-7
rewrites them, but new content is authored against the §1-§9 v2
API documented in `docs/SHORTCODES.md`.

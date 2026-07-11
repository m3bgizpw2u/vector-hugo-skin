# PORT-MAP — Per-File Upstream Provenance

This document is the work-order for phases 3 through 7 of the third plan
(literal 1:1 port of `wikimedia/mediawiki-skins-Vector`). Every row names
the specific file under `vendor/mediawiki-vector/` (pinned to REL1_42 /
`7c224883`, 2025-06-12) that the corresponding file in the Hugo theme
is derived from, or marks the file as Hugo-native (no upstream
counterpart).

## How to read this file

Columns are described below; column order in each row follows the same
description.

- **Hugo file** — relative path under the repository root.
- **Upstream Vector file(s)** — path under `vendor/mediawiki-vector/`
  that this file is a literal or near-literal translation of. Empty
  when the file is Hugo-native.
- **Port type** — one of:
  - `literal` — translate 1:1, the rendered output and selectors stay
    identical; only the source syntax shifts (LESS → SCSS, Mustache →
    Go template, ES6 → TypeScript).
  - `literal+adapt` — translate 1:1 but the file legitimately needs a
    small Hugo-idiom change (e.g. a Mustache partial call becomes a Go
    template `partial` call; ES6 module boundaries map to the repo's
    existing one-behavior-per-file split). The rendering stays
    identical; the templating/modularity mechanics differ. The `Notes`
    column records the deviation.
  - `hugo-native` — no upstream equivalent. The file is an original
    Hugo / repo artifact (theme metadata, build config, dev tooling,
    docs, example-site content, the rules under `.cursor/rules/`).
- **License family** — one of `GPL-2.0-or-later` (Vector-derived), `CC-
  BY-SA-4.0` (Wikipedia Template:Infobox content-derived, see phase 7),
  `dual` (a single file combining Vector wrapper styling and Wikipedia
  template logic), or `original` (Hugo-native / original prose).
- **Notes** — anything else that matters: scope cuts, intentional
  deviations, line citations back to the vendor file when the entry is
  particularly load-bearing for a later phase.

The exit gate for phase 2 is: every file currently in the repository
appears exactly once below; no `TBD`s; infobox rows are visibly flagged
as `CC-BY-SA-4.0` or `dual` rather than mixed in with the GPL rows.

---

## 1. Theme metadata & build config (`hugo-native`)

| Hugo file | Upstream Vector file(s) | Port type | License family | Notes |
|---|---|---|---|---|
| `theme.toml` | — | hugo-native | original | Hugo theme manifest. Pinned description + license (GPL-2.0-or-later) updated in phase 0. |
| `package.json` | — | hugo-native | original | Build/dev scripts (`dev`, `build`, `e2e`). The hugo-on-its-own-target invocation only targets the workspace-as-theme layout. |
| `package-lock.json` | — | hugo-native | original | npm-generated lockfile, never hand-edited. |
| `tsconfig.json` | `vendor/mediawiki-vector/tsconfig.json` | hugo-native | original | Hugo-pipeline TS config; takes its baseline pre-1.7 strictness from the vendor but the actual `compilerOptions` are repo-defined. |
| `.eslintrc.json` | — | hugo-native | original | ESLint v9 flat config for `assets/js/`. |
| `.stylelintrc.json` | — | hugo-native | original | Stylelint config tuned for SCSS-in-Hugo-Pipes. |
| `.gitignore` | — | hugo-native | original | Build/playwright/vendor ignore list — updated in phase 1. |
| `.editorconfig` (if present) / `.cursor/rules/*.mdc` | — | hugo-native | original | Editor + Cursor rule files. Eight rule files; the per-rule scope is unchanged by this plan. |

## 2. Layouts — base templates (`_default/`)

| Hugo file | Upstream Vector file(s) | Port type | License family | Notes |
|---|---|---|---|---|
| `layouts/_default/baseof.html` | `vendor/mediawiki-vector/includes/templates/Skin.mustache` (the wrapper at `skin.json` deploy target) and `includes/templates/Header.mustache`, `includes/templates/Footer.mustache` rendered as region partials | literal+adapt | GPL-2.0-or-later | Page chrome wrapper. Maintains the `.page-grid`, `.sidebar`, `.main-content`, `.toc-panel`, `.sticky-header` region graph. Hugo idioms: `{{ block "main" . }}` instead of Mustache section; `{{ partial … }}` for header/footer/sidebar. |
| `layouts/_default/single.html` | `vendor/mediawiki-vector/includes/skins/Vector/templates/SkinVector22.mustache` (single-page branch) | literal+adapt | GPL-2.0-or-later | Article page shell — `article-header` + `article-body` + `categories-footer`. |
| `layouts/_default/list.html` | n/a (Hugo generates the section index from `.Pages`) | hugo-native | original | Section index. No direct upstream Mustache counterpart. |
| `layouts/_default/home.json` | n/a | hugo-native | original | Build-time search index JSON home output; per `docs/ARCHITECTURE.md` §6. |

## 3. Layouts — header partials (`_partials/header/`)

| Hugo file | Upstream Vector file(s) | Port type | License family | Notes |
|---|---|---|---|---|
| `layouts/_partials/header/site-header.html` | `vendor/mediawiki-vector/includes/templates/Header.mustache` (region) | literal+adapt | GPL-2.0-or-later | Top chrome — `.page-header` row with logo, sidebar-toggle, title, tools. Class names kept verbatim. |
| `layouts/_partials/header/logo.html` | `vendor/mediawiki-vector/includes/templates/Logo.mustache` | literal+adapt | GPL-2.0-or-later | `.site-logo` element with brand-mark/title — text sourced from `[Params].logoText` + `.Site.Title`. |
| `layouts/_partials/header/search-box.html` | `vendor/mediawiki-vector/includes/templates/SearchBox.mustache` | literal+adapt | GPL-2.0-or-later | Three-region input (`magnifier-label / input / submit-icon`). Per phase 6 the data source becomes local `index.json`, not MediaWiki's API. |
| `layouts/_partials/header/personal-tools.html` | `vendor/mediawiki-vector/includes/templates/UserLinks.mustache` + `includes/templates/ClientPreferences.mustache` | literal+adapt | GPL-2.0-or-later | Segmented theme toggle (light / dark / auto) as the kept visible component. The Vector-only login/create-account/preferences items are omitted per phase 6; rendered as `personalToolsLabel` i18n placeholder links if `[Params].showPersonalToolsPlaceholder = true`. |
| `layouts/_partials/header/sticky-header.html` | `vendor/mediawiki-vector/includes/templates/BottomDock.mustache` + `includes/templates/PinnableContainer/Pinned/*.mustache` + `includes/templates/PinnableHeader.mustache` | literal+adapt | GPL-2.0-or-later | Condensed chrome docked on scroll. Driven by `assets/js/modules/sticky-header.ts` (phase 5). |

## 4. Layouts — sidebar partials (`_partials/sidebar/`)

| Hugo file | Upstream Vector file(s) | Port type | License family | Notes |
|---|---|---|---|---|
| `layouts/_partials/sidebar/sidebar.html` | `vendor/mediawiki-vector/includes/templates/Sidebar.mustache` | literal+adapt | GPL-2.0-or-later | Left-column shell hosting `main-menu` + `toc-panel` regions. |
| `layouts/_partials/sidebar/main-menu.html` | `vendor/mediawiki-vector/includes/templates/MainMenu.mustache` + `Menu.mustache` + `MenuContents.mustache` + `MenuListItem.mustache` | literal+adapt | GPL-2.0-or-later | Single `.sidebar-list__group` portlet ("Navigation") driven from Hugo `[menus.main]`. Collapse/expand wired via `assets/js/modules/sidebar-toggle.ts`. |
| `layouts/_partials/sidebar/toc-panel.html` | `vendor/mediawiki-vector/includes/templates/TableOfContents.mustache` (rendered via `SkinVector22.php` into the sidebar grid cell at runtime; the partial layout matches the Vector sidebar ToC region even though the upstream doesn't ship a per-sidebar-table-of-contents mustache) | literal+adapt | GPL-2.0-or-later | `<aside id="toc-panel" class="toc-panel">` shell; Hugo's `.TableOfContents` is rendered inside. Scroll-spy wired via `assets/js/modules/toc.ts`. |

## 5. Layouts — article & footer partials

| Hugo file | Upstream Vector file(s) | Port type | License family | Notes |
|---|---|---|---|---|
| `layouts/_partials/article/article-header.html` | `vendor/mediawiki-vector/includes/templates/PageTitlebar.mustache` (region of the `SkinVector22` render path) | literal+adapt | GPL-2.0-or-later | `<h1 class="article-title">` + optional `<p class="article-subtitle">` + page-status indicators. |
| `layouts/_partials/article/article-body.html` | rendered by `SkinVector22.php` around Hugo's `<main>` content; the `.mw-body-content` and `.mw-parser-output` selectors map to `.article-body` | literal+adapt | GPL-2.0-or-later | Hosts the rendered Hugo `.Content`. Adds the `parser-output` class alias so any ported CSS continues to apply. |
| `layouts/_partials/article/byline.html` | `vendor/mediawiki-vector/includes/templates/PageTools.mustache` (page-tool portlet; Hugo renders this region only as the byline strip below the H1, page-tool actions themselves omitted per phase 6) | literal+adapt | GPL-2.0-or-later | Author + lastmod byline. Driven from `[Params]`. |
| `layouts/_partials/article/categories-footer.html` | `vendor/mediawiki-vector/includes/templates/Categories.mustache` | literal+adapt | GPL-2.0-or-later | Bottom-of-article category pill row, `.article-categories` → `<ul>` of category links. |
| `layouts/_partials/footer/site-footer.html` | `vendor/mediawiki-vector/includes/templates/Footer.mustache` + `Footer__row.mustache` | literal+adapt | GPL-2.0-or-later | `.site-footer__inner` (brand + nav) + `.site-footer__legal` rows. Nav reads `[[menu.footer]]` from `hugo.toml`. |
| `layouts/_partials/footer/license-notice.html` | `vendor/mediawiki-vector/includes/templates/Footer.mustache` (the `<div class="footer-places">` block of license + privacy + terms links) | literal+adapt | GPL-2.0-or-later | License + privacy + disclaimer strip; the per-site `licenseText` from `[Params]` remains the visible text, but the surrounding class structure mirrors Vector's footer-places wrapper. |

## 6. Layouts — infobox partials (`_partials/infobox/`, plus `special/`)

These are **explicitly** treated as the shared base/inner-primitive
layer that the 30 topic shortcodes (see §9 below) call into. Their
class structure is Vector-derived; the conditional content logic is
Wikipedia-CC-BY-SA-derived where the topic shape is concerned. They
are listed here as `literal+adapt` (Vector-derived wrapper) plus
`dual` where `special/` files combine wrapper styling with topic
conditional logic. The phase-7 shortcode fork extends these on a
per-topic basis.

| Hugo file | Upstream Vector file(s) | Port type | License family | Notes |
|---|---|---|---|---|
| `layouts/_partials/infobox/base.html` | n/a (the upstream Vector skin does not ship an infobox; the infobox family is Wikipedia-content, not MediaWiki-skin) | hugo-native | original | The single entry point that emits `<aside class="infobox" data-infobox-type="…">` for every named shortcode. Class names + DOM mirror MediaWiki's rendered infobox so the per-template `infobox-pair-*` partials continue to apply. |
| `layouts/_partials/infobox/header.html` | upstream rendered infobox `<th class="infobox-header">` (MediaWiki-side, not Vector-side) | literal+adapt | dual | Title-row chrome. Class names mirror Wikipedia's infobox rendering. |
| `layouts/_partials/infobox/image-block.html` | upstream rendered infobox `<td class="infobox-image">` | literal+adapt | dual | Image-with-caption block; `&lt;figure&gt;` semantics. |
| `layouts/_partials/infobox/row.html` | upstream rendered infobox `<tr class="infobox-…">` | literal+adapt | dual | Single label-value row (the base `infobox-row` primitive). |
| `layouts/_partials/infobox/section.html` | upstream rendered infobox `<tr class="infobox-section">` | literal+adapt | dual | Section-divider row (full-width label). |
| `layouts/_partials/infobox/below.html` | upstream rendered infobox `<div class="infobox-below">` | literal+adapt | dual | Below-the-table footer strip. |
| `layouts/_partials/infobox/special/*.html` | per-topic infobox special partials (e.g. person title-row, settlement coordinates row) | literal+adapt | dual | One per topic that needs a per-template special row shape. Class names mirror Wikipedia; the field names come from `Template:Infobox <topic>` per phase 7. |

## 7. CSS — base layer (`assets/css/base/`)

| Hugo file | Upstream Vector file(s) | Port type | License family | Notes |
|---|---|---|---|---|
| `assets/css/base/_tokens.scss` | `vendor/mediawiki-vector/resources/skins.vector.styles/CSSCustomProperties.less` + `variables.less` + `mixins.less` (the `:root { --color-base, … }` declarations) | literal | GPL-2.0-or-later | Design tokens as CSS custom properties — `--color-*`, `--font-*`, `--space-*`, `--layout-*`, `--radius-*`, `--shadow-*`, `--transition-*`, `--z-*`. |
| `assets/css/base/_typography.scss` | `vendor/mediawiki-vector/resources/skins.vector.styles/typography.less` | literal | GPL-2.0-or-later | Body, h1–h6, code/kbd/pre, lists, blockquote rhythm. |
| `assets/css/base/_reset.scss` | `vendor/mediawiki-vector/resources/skins.vector.styles/normalize.less` | literal | GPL-2.0-or-later | Vector's normalize of margins + skip-link + `.mw-jump-link` parity class. |

## 8. CSS — layout & components

| Hugo file | Upstream Vector file(s) | Port type | License family | Notes |
|---|---|---|---|---|
| `assets/css/layout/page-grid.scss` | `vendor/mediawiki-vector/resources/skins.vector.styles/layouts/grid.less` | literal | GPL-2.0-or-later | The page-grid template — `.page-grid { display: grid; grid-template-areas: … }`. |
| `assets/css/layout/header.scss` | `vendor/mediawiki-vector/resources/skins.vector.styles/components/Header.less` + `components/PageTitlebar.less` | literal | GPL-2.0-or-later | `.page-header` region. |
| `assets/css/layout/sidebar.scss` | `vendor/mediawiki-vector/resources/skins.vector.styles/components/MainMenu.less` | literal | GPL-2.0-or-later | Sidebar column shell — `.sidebar` width / breakpoint behaviour. |
| `assets/css/layout/toc-panel.scss` | `vendor/mediawiki-vector/resources/skins.vector.styles/components/TableOfContents.less` + `layouts/toc/{pinned,unpinned}.less` | literal | GPL-2.0-or-later | ToC region position + sticky behaviour. |
| `assets/css/layout/article-body.scss` | Vector-style `.mw-body-content` / `.mw-parser-output` body-content rule group from `resources/skins.vector.styles/layouts/screen.less` | literal | GPL-2.0-or-later | Article body grid cell. |
| `assets/css/layout/footer.scss` | `vendor/mediawiki-vector/resources/skins.vector.styles/components/Footer.less` | literal | GPL-2.0-or-later | Footer region. |
| `assets/css/components/article-header.scss` | `vendor/mediawiki-vector/resources/skins.vector.styles/components/PageTitlebar.less` (article-header surface) | literal | GPL-2.0-or-later | Article header component. |
| `assets/css/components/article-body.scss` | Vector-style body-content rule group from `resources/skins.vector.styles/layouts/screen.less` (article-body surface, sibling to layout/article-body) | literal | GPL-2.0-or-later | Article body content component (heading rhythm, paragraph spacing, list nesting). |
| `assets/css/components/article-categories.scss` | `vendor/mediawiki-vector/resources/skins.vector.styles/components/CategoryLinks.less` (rendered-tag pill style) | literal | GPL-2.0-or-later | Category pill row. |
| `assets/css/components/header-companions.scss` | `vendor/mediawiki-vector/resources/skins.vector.styles/components/SearchBox.less` (alongside header layout) | literal | GPL-2.0-or-later | Companion elements nested in the header. |
| `assets/css/components/search-box.scss` | `vendor/mediawiki-vector/resources/skins.vector.styles/components/SearchBox.less` | literal | GPL-2.0-or-later | SearchBox three-region input. |
| `assets/css/components/sidebar.scss` | `vendor/mediawiki-vector/resources/skins.vector.styles/components/MainMenu.less` + `components/Menu.less` + `components/MenuTabs.less` | literal | GPL-2.0-or-later | Portlet-list pattern + active-link rule. |
| `assets/css/components/sticky-header.scss` | `vendor/mediawiki-vector/resources/skins.vector.styles/components/StickyHeader.less` + `components/PinnableHeader.less` + `layouts/toc/{pinned,unpinned}.less` | literal | GPL-2.0-or-later | Condensed chrome position + sentinel. |
| `assets/css/components/toc.scss` | `vendor/mediawiki-vector/resources/skins.vector.styles/components/TableOfContents.less` | literal | GPL-2.0-or-later | Scroll-spy ToC + active-section style. |
| `assets/css/components/tabs.scss` | `vendor/mediawiki-vector/resources/skins.vector.styles/components/ClientPreferences.less` (the tab style group) + `components/MenuTabs.less` | literal | GPL-2.0-or-later | ARIA-correct tab widget visual style. |
| `assets/css/components/infobox.scss` | n/a (no upstream Vector counterpart — Wikipedia-side table styling, ported for compatibility) | literal+adapt | dual | Infobox base + per-template `[data-infobox-type="…"]` rule buckets (one per topic where a tweak is needed). Vector's class targets are absent, but the selectors mirror Wikipedia's rendered-infobox classes (`th.infobox-…`, `td.infobox-…`) so the SCSS reads as a literal port of the Wikipedia-side LESS-rendered output. |
| `assets/css/components/infobox-pair-*.scss` (7 files) | n/a (Wikipedia-side rendered-infobox styles) | literal+adapt | dual | One per paired-form primitive (date, software-release, population, area, air-date, budget-gross, episode-season). Mirrors Wikipedia's rendered-table per-pair styles. |
| `assets/css/components/footer.scss` | `vendor/mediawiki-vector/resources/skins.vector.styles/components/Footer.less` (the four-region footer) | literal | GPL-2.0-or-later | Footer component (mirror of the layout-region footer styles grouped by element). |
| `assets/css/components/theme-toggle.scss` | `vendor/mediawiki-vector/resources/skins.vector.styles/components/ClientPreferences.less` | literal | GPL-2.0-or-later | Segmented theme-toggle visual style. |

## 9. CSS — themes

| Hugo file | Upstream Vector file(s) | Port type | License family | Notes |
|---|---|---|---|---|
| `assets/css/themes/light.scss` | `vendor/mediawiki-vector/resources/skins.vector.styles/CSSCustomProperties.less` (the `[data-theme="light"]` selector override block) + Vector's `skin.json` `clientPreferences` color palette | literal | GPL-2.0-or-later | Light theme overrides — values come from Vector's CSS-custom-property light cascade. |
| `assets/css/themes/dark.scss` | `vendor/mediawiki-vector/resources/skins.vector.styles/CSSCustomProperties.less` (the `[data-theme="dark"]` selector override block) | literal | GPL-2.0-or-later | Dark theme overrides. |
| `assets/css/themes/auto.scss` | Vector's `prefers-color-scheme: dark` rule group in `resources/skins.vector.styles/CSSCustomProperties.less` | literal | GPL-2.0-or-later | Auto / `prefers-color-scheme` block that fires when no explicit `data-theme` is set. |
| `assets/css/main.scss` | `vendor/mediawiki-vector/resources/skins.vector.styles/skin.less` (the entry-point import list) | literal | GPL-2.0-or-later | Imports only — base → layout → components → themes, in Vector's import order. |

## 10. JavaScript / TypeScript modules

| Hugo file | Upstream Vector file(s) | Port type | License family | Notes |
|---|---|---|---|---|
| `assets/js/main.ts` | `vendor/mediawiki-vector/resources/skins.vector.js/skin.js` (entry orchestrator) | literal+adapt | GPL-2.0-or-later | Six imports + `init()` calls in Vector's module-load order. |
| `assets/js/modules/sticky-header.ts` | `vendor/mediawiki-vector/resources/skins.vector.js/stickyHeader.js` + `stickyHeaderAB.js` + `scrollObserver.js` + `deferUntilFrame.js` | literal+adapt | GPL-2.0-or-later | Pre-existing implementation already converges on Vector's `IntersectionObserver` sentinel pattern. This plan's contribution: phase-5 GPL header citing the upstream vendor paths + the `scrollObserver`-derived `setupIntersectionObservers` shape. **Preserves the prior-session behavior contract intact** (don't re-touch the module's runtime unless phase 9 spec flags an interaction drift). |
| `assets/js/modules/sidebar-toggle.ts` | `vendor/mediawiki-vector/resources/skins.vector.js/portlets.js` + `dropdownMenus.js` | literal+adapt | GPL-2.0-or-later | Per-portlet collapse + outer-collapse behaviour. Vector's `dropdownMenus` is reorganised into the repo's existing one-behavior-per-file split — record: "logic ported from `portlets.js`, reorganised into repo's module split". |
| `assets/js/modules/toc.ts` | `vendor/mediawiki-vector/resources/skins.vector.js/tableOfContents.js` + `sectionObserver.js` + `setupIntersectionObservers.js` | literal+adapt | GPL-2.0-or-later | Scroll-spy ToC. |
| `assets/js/modules/tabs.ts` | `vendor/mediawiki-vector/resources/skins.vector.js/menuTabs.js` (+ ARIA pattern extracted from Vector's `ClientPreferences` rendering) | literal+adapt | GPL-2.0-or-later | ARIA-correct tab widget (click, arrow keys, Home/End, roving tabindex). |
| `assets/js/modules/theme-toggle.ts` | `vendor/mediawiki-vector/resources/skins.vector.js/watchstar.js` light cycle + Vector's `clientPreferences.json` schema (`appearance`) | literal+adapt | GPL-2.0-or-later | Cycles light / dark / auto, respects `prefers-color-scheme` while in auto, persists under `vhskin:theme`. |
| `assets/js/modules/search.ts` | `vendor/mediawiki-vector/resources/skins.vector.js/searchLoader.js` + `searchToggle.js` | literal+adapt | GPL-2.0-or-later | UI chrome (input, suggestion list, magnifier toggle) ported literally. Per phase 6 the data source becomes local `index.json` rather than MediaWiki's `action=opensearch` API. |
| `assets/js/utils/dom.ts` | inlined helper logic across `vendor/mediawiki-vector/resources/skins.vector.js/{portlets,searchToggle,searchLoader,stickyHeader,menuTabs}.js` | literal+adapt | GPL-2.0-or-later | `q`, `qAll`, `addClass`, `removeClass`, `toggleClass` — verbatim signatures with TypeScript types added. Citations live in the file's GPL header. |
| `assets/js/utils/debounce.ts` | `vendor/mediawiki-vector/resources/skins.vector.js/setupIntersectionObservers.js` (its `requestAnimationFrame`-based throttle) + `deferUntilFrame.js` | literal+adapt | GPL-2.0-or-later | `debounce` + `throttle`. |
| `assets/js/utils/storage.ts` | n/a (port is self-contained — wraps `localStorage` with the `vhskin:` namespace) | hugo-native | original | Storage helpers — local repo addition; no upstream equivalent. The `vhskin:` key prefix matches what `theme-toggle.ts` writes. |
| `static/js/theme-early.js` | Vector's inline early-theme-apply script (declared in `vendor/mediawiki-vector/skin.json` under `ResourceModules` → injected at `<head>`) | literal | GPL-2.0-or-later | Transcribed to a separate static `.js` per the no-inline-script rule in `.cursor/rules/30-scripts.mdc`; the JS body itself is unchanged. |

## 11. i18n, archetypes, demo content

| Hugo file | Upstream Vector file(s) | Port type | License family | Notes |
|---|---|---|---|---|
| `i18n/en.toml` | — | hugo-native | original | Minimum-key i18n lookup. Keys: `searchPlaceholder`, `personalToolsLabel`, `mainMenuLabel`, `readingTime`. |
| `archetypes/default.md` | — | hugo-native | original | Empty `summary` + `categories` array archetype. |
| `archetypes/infobox-demo.md` | — | hugo-native | original | Per-shortcode demo scaffold. |
| `exampleSite/content/**` (32 articles) | — | hugo-native | original | Original prose invented for the demo site (no Wikipedia verbatim). |
| `exampleSite/hugo.toml` | — | hugo-native | original | Workspace-as-theme `themesDir = "../.."`, `[menus.main]`, `[[menu.footer]]`, `[outputs]` widenings. |

## 12. Infobox shortcodes — `layouts/_shortcodes/`

The 30 topic shortcodes below mirror Wikipedia's `Template:Infobox
<topic>` family. Their **wrapper styling** (`<aside class="infobox"
data-infobox-type="…">`, the inner `<table>` grid, the `infobox-*`
class vocabulary) is **Wikipedia-side** (no GPL Vector counterpart),
and the **field-set / conditional logic** (which fields are
conditionally shown, label wording, formatting rules for dates and
numbers) is **CC-BY-SA-4.0-derived** from
`https://en.wikipedia.org/wiki/Template:Infobox_<topic>`. Each topic
row lists the upstream Wikipedia template page it ports from.

| Hugo file | Upstream Vector file(s) | Upstream Wikipedia template(s) | Port type | License family | Notes |
|---|---|---|---|---|---|
| `layouts/_shortcodes/person.html` | n/a | `Template:Infobox person` | literal+adapt | CC-BY-SA-4.0 | Birth-death date formatting, occupation list rendering, `cite`/credit formats. |
| `layouts/_shortcodes/settlement.html` | n/a | `Template:Infobox settlement` | literal+adapt | CC-BY-SA-4.0 | Coordinates DMS-vs-decimal, area unit pair, population density math. |
| `layouts/_shortcodes/film.html` | n/a | `Template:Infobox film` | literal+adapt | CC-BY-SA-4.0 | Running-time formatting, box-office scaling, country list. |
| `layouts/_shortcodes/company.html` | n/a | `Template:Infobox company` | literal+adapt | CC-BY-SA-4.0 | Industry list, parent/subsidiary branch, revenue formatting. |
| `layouts/_shortcodes/software.html` | n/a | `Template:Infobox software` | literal+adapt | CC-BY-SA-4.0 | Version row, license row, operating-system list. |
| `layouts/_shortcodes/country.html` | n/a | `Template:Infobox country` | literal+adapt | CC-BY-SA-4.0 | Sovereignty/HDI columns, anthem capitalisation, mottos. |
| `layouts/_shortcodes/university.html` | n/a | `Template:Infobox university` | literal+adapt | CC-BY-SA-4.0 | Established/closed year pair, motto row, endowment formatting. |
| `layouts/_shortcodes/school.html` | n/a | `Template:Infobox school` | literal+adapt | CC-BY-SA-4.0 | School district pairing, grades-range encoding. |
| `layouts/_shortcodes/station.html` | n/a | `Template:Infobox station` | literal+adapt | CC-BY-SA-4.0 | Line/line-colour rendering, fare-zone row. |
| `layouts/_shortcodes/historic-site.html` | n/a | `Template:Infobox historic site` | literal+adapt | CC-BY-SA-4.0 | Designation row, governing body. |
| `layouts/_shortcodes/organization.html` | n/a | `Template:Infobox organization` | literal+adapt | CC-BY-SA-4.0 | Mission row, parent organization. |
| `layouts/_shortcodes/political-party.html` | n/a | `Template:Infobox political party` | literal+adapt | CC-BY-SA-4.0 | Country+ideology row, foundation date. |
| `layouts/_shortcodes/military-person.html` | n/a | `Template:Infobox military person` | literal+adapt | CC-BY-SA-4.0 | Service-years branch, rank row. |
| `layouts/_shortcodes/military-unit.html` | n/a | `Template:Infobox military unit` | literal+adapt | CC-BY-SA-4.0 | Branch row, role/garrison. |
| `layouts/_shortcodes/military-conflict.html` | n/a | `Template:Infobox military conflict` | literal+adapt | CC-BY-SA-4.0 | Date-range row, belligerents list. |
| `layouts/_shortcodes/football-biography.html` | n/a | `Template:Infobox football biography` | literal+adapt | CC-BY-SA-4.0 | Position list, club career rows, height/feet pair. |
| `layouts/_shortcodes/basketball-biography.html` | n/a | `Template:Infobox basketball biography` | literal+adapt | CC-BY-SA-4.0 | Position+team rows, statistics table. |
| `layouts/_shortcodes/baseball-biography.html` | n/a | `Template:Infobox baseball biography` | literal+adapt | CC-BY-SA-4.0 | Batting-throw row, debut dates. |
| `layouts/_shortcodes/ice-hockey-biography.html` | n/a | `Template:Infobox ice hockey biography` | literal+adapt | CC-BY-SA-4.0 | Shoots/catches pair, draft round. |
| `layouts/_shortcodes/football-club.html` | n/a | `Template:Infobox football club` | literal+adapt | CC-BY-SA-4.0 | Stadium row, manager+league row. |
| `layouts/_shortcodes/video-game.html` | n/a | `Template:Infobox video game` | literal+adapt | CC-BY-SA-4.0 | Engine+platform row, modes list. |
| `layouts/_shortcodes/album.html` | n/a | `Template:Infobox album` | literal+adapt | CC-BY-SA-4.0 | Track-list, label catalogue number. |
| `layouts/_shortcodes/television.html` | n/a | `Template:Infobox television` | literal+adapt | CC-BY-SA-4.0 | Picture format, channel-row, episode count. |
| `layouts/_shortcodes/television-episode.html` | n/a | `Template:Infobox television episode` | literal+adapt | CC-BY-SA-4.0 | Episode-number/air-date pair, season-row. |
| `layouts/_shortcodes/television-season.html` | n/a | `Template:Infobox television season` | literal+adapt | CC-BY-SA-4.0 | Episode count, network row. |
| `layouts/_shortcodes/tennis-tournament-event.html` | n/a | `Template:Infobox tennis tournament event` | literal+adapt | CC-BY-SA-4.0 | Surface row, draw/counts. |
| `layouts/_shortcodes/award.html` | n/a | `Template:Infobox award` | literal+adapt | CC-BY-SA-4.0 | Country+description rows, presenter. |
| `layouts/_shortcodes/church.html` | n/a | `Template:Infobox church` | literal+adapt | CC-BY-SA-4.0 | Diocese row, dedication row. |
| `layouts/_shortcodes/protected-area.html` | n/a | `Template:Infobox protected area` | literal+adapt | CC-BY-SA-4.0 | IUCN category, governing body. |
| `layouts/_shortcodes/election.html` | n/a | `Template:Infobox election` | literal+adapt | CC-BY-SA-4.0 | Country/election-type pair, candidates list. |

## 13. Infobox helper shortcodes (`layouts/_shortcodes/`)

| Hugo file | Upstream Vector file(s) | Upstream Wikipedia template(s) | Port type | License family | Notes |
|---|---|---|---|---|---|
| `layouts/_shortcodes/infobox.html` | n/a | `Module:Infobox` (top-level metatemplate that wraps every `<aside class="infobox">`) | literal+adapt | dual | Single entry point — emits `<aside class="infobox" data-infobox-type="…">` and delegates to `_partials/infobox/base.html`. |
| `layouts/_shortcodes/infobox-row.html` | n/a | `Module:Infobox` (`row` helper) | literal+adapt | dual | Single label-value row primitive. |
| `layouts/_shortcodes/infobox-section.html` | n/a | `Module:Infobox` (`section` helper) | literal+adapt | dual | Section-divider row primitive. |
| `layouts/_shortcodes/infobox-image.html` | n/a | `Module:Infobox` (`image` helper) | literal+adapt | dual | Image-with-caption primitive. |
| `layouts/_shortcodes/infobox-field.html` | n/a | `Module:Infobox` (`field` helper) | literal+adapt | dual | Single-field primitive (label-less value). |
| `layouts/_shortcodes/infobox-below.html` | n/a | `Module:Infobox` (`below` helper) | literal+adapt | dual | Below-the-table footer row primitive. |
| `layouts/_shortcodes/infobox-pair-date.html` | n/a | `Template:Infobox person` (birth-death pair) | literal+adapt | dual | Date range pair primitive used in biographies. |
| `layouts/_shortcodes/infobox-pair-software-release.html` | n/a | `Template:Infobox software` (`released`/`discontinued` pair) | literal+adapt | dual | Software release-date pair primitive. |
| `layouts/_shortcodes/infobox-pair-population.html` | n/a | `Template:Infobox settlement` (`population`/`population_as_of` pair) | literal+adapt | dual | Population + measurement date pair. |
| `layouts/_shortcodes/infobox-pair-area.html` | n/a | `Template:Infobox settlement` (`area_total`/`area_land`/`area_water` paired) | literal+adapt | dual | Total / land / water triple primitive. |
| `layouts/_shortcodes/infobox-pair-air-date.html` | n/a | `Template:Infobox television episode` (`airdate` / `viewers` paired) | literal+adapt | dual | Air-date + viewer count pair. |
| `layouts/_shortcodes/infobox-pair-budget-gross.html` | n/a | `Template:Infobox film` (`budget`/`gross` paired) | literal+adapt | dual | Budget / gross pair primitive. |
| `layouts/_shortcodes/infobox-pair-episode-season.html` | n/a | `Template:Infobox television episode` (`episode`/`season` paired) | literal+adapt | dual | Episode + season pair. |

## 14. Tests / docs / scaffolding

| Hugo file | Upstream Vector file(s) | Port type | License family | Notes |
|---|---|---|---|---|
| `tests/e2e/specs/*.spec.ts` | — | hugo-native | original | Phase 9 fills these. |
| `tests/fixtures/**` | — | hugo-native | original | Wikipedia-region snapshots for phase 9 diff comparisons. |
| `playwright.config.ts` (if present) | — | hugo-native | original | Playwright workspace-as-theme webServer command. |
| `docs/RESEARCH.md` | — | hugo-native (with §Pinned Vector source + §Source-line traceability appended) | original | Already covers phases 1 / 2 / 9 anchor records. |
| `docs/ARCHITECTURE.md` | — | hugo-native | original | New §Mustache-key → Hugo-data mapping (phase 4), §Search (phase 6 decision), §Excluded MediaWiki features (phase 6), §Licensing three-tier summary (phase 8). |
| `docs/SHORTCODES.md` | — | hugo-native | original | Authoring guide + per-topic CC BY-SA + Wikipedia citation per row. |
| `docs/UI-AUDIT.md` | — | hugo-native | original | Phase 4 DOM diff + phase 9 DOM diff + interaction-parity log. |
| `docs/PORT-MAP.md` | — | hugo-native | original | This document. |
| `docs/PORT-MAP-CONVENTIONS.md` | — | hugo-native | original | Per-file header format reference (phase 0). |
| `.cursor/rules/*.mdc` | — | hugo-native | original | Rule files. Untouched by this plan. |

---

## Cross-reference: where each port-type family turns into commits

- **CSS / LESS → SCSS** (files in §§7–9) → phase 3 commits.
- **Mustache → Go templates** (files in §§2–6) → phase 4 commits.
- **ES6 → TypeScript** (files in §10) → phase 5 commits.
- **Server-dependent feature strip** (no new per-file rows; documented in
  `docs/ARCHITECTURE.md` §"Excluded MediaWiki features") → phase 6 commit.
- **Infobox shortcode rewrites** (files in §§12–13) → phase 7 commits,
  one per topic family.
- **Repo-wide attribution sweep** (`NOTICE.md`, header audit) → phase 8
  commit.
- **Playwright specs + traceability** → phase 9 commits.

This document is the authoritative work order; the per-commit records
above (and the per-file headers themselves) keep its contents anchored
to actual repo history.

# Changelog

All notable changes to this project are documented here, in Keep-a-Changelog style.
Every commit that changes user-facing or developer-facing behavior lands a matching
entry in the same commit — see `.cursor/rules/70-changelog.mdc`.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Relicensed (third plan, phase 0)
- Theme re-licensed from MIT to **GPL-2.0-or-later** to match the upstream
  `wikimedia/mediawiki-skins-Vector` license at the pinned SHA
  `7c224883fd6ee166950aaa690381fbc769838071` (REL1_42, 2025-06-12). The
  methodology switches from "independent reimplementation, no verbatim
  upstream source" to **literal 1:1 port** of Vector's LESS / Mustache /
  ES6 sources into SCSS / Go templates / TypeScript. See
  `docs/PORT-MAP.md` for the per-file upstream provenance,
  `docs/PORT-MAP-CONVENTIONS.md` for the per-file header convention,
  and `vendor/mediawiki-vector/PROVENANCE.md` for the pin-point record.
- `README.md` lead paragraph rewritten to describe the theme as a
  derivative port of Vector (and to retain the Wikimedia non-affiliation
  / non-trademark disclaimer). The previous "does not redistribute the
  GPL-2.0-or-later MediaWiki Vector skin source code" line is removed.
- `LICENSE` replaced with the full text of GPL-2.0-or-later (the
  previous MIT text is removed).
- New `docs/PORT-MAP-CONVENTIONS.md` cataloguing the per-file header
  formats that phases 3–7 of the third plan apply. The full per-file
  upstream provenance itself lands in phase 2 (`docs/PORT-MAP.md`).

Vector 2022 visual-fidelity pass — see `docs/UI-AUDIT.md` for the full
surface-by-surface gap analysis. Five commits; this section collects their
entries in commit order.

### Fixed
- Three demo articles emitted a duplicate H1 because `single.html`'s
  `article-header.html` partial emits `<h1 class="article-title">{{ .Title }}</h1>`
  from front matter **and** each Markdown body re-declared the title as a
  `# Heading` line. Removed the `# Title` line from
  `exampleSite/content/articles/{long-article-with-toc,short-article,phase8-smoke-test}.md`
  so the title lives in exactly one slot — the article-header chrome —
  and the ToC + scroll-spy start cleanly from the first section heading.
  Behaviour equivalent for the H1 case; reduces `<h1>` count on those
  three pages from 2 to 1, matching Vector 2022's one-page-title
  contract.

### Changed
- Selection background colour moved from `--color-divider` (`#c8ccd1`) to a
  Vector-faithful blue-tinted value (`#bbd5f1` in light / `#2a4365` in
  dark / `#2a4365` in auto). The old value matched a neutral divider,
  not Vector's selection palette. Affects every selection across the
  site (light and dark themes only; the change is cosmetic in dark).
- Default `:focus-visible` ring switched from outset (`outline-offset:
  2px`) to inset (`outline-offset: -2px`) so the ring lives inside the
  element and does not shift layout on focus. Vector uses inset rings
  for the same reason; our previous outset ring clipped chrome elements
  and nudged inline content when tabbing through sidebar links.
- `layouts/_partials/footer/site-footer.html` rewritten to emit the
  four-region structure (`.site-footer__inner` with brand + nav,
  `.site-footer__legal` row) that the SCSS in
  `assets/css/components/footer.scss` already styles. The previous
  markup emitted only a single `<div class="footer-content">` line
  with the license text — every other rule in `footer.scss` was dead.
  Behaviour equivalent: same license text, same copyright fallback,
  same i18n hook. Adds a nav list sourced from a new
  `[[menu.footer]]` block in `exampleSite/hugo.toml`.

### Added
- New Vector-faithful article-header chrome strip: `layouts/_partials/article/page-titlebar.html`
  renders the article titlebar (`<header class="page-titlebar">`) hosting the
  H1 plus a checkbox-driven ToC dropdown (`<input
  id="page-titlebar-toc-checkbox">` + sibling panel), styled by
  `assets/css/components/page-titlebar.scss`. Pure-CSS disclosure (Vector's
  own `:checked ~` mechanism from `Dropdown.less`, ported verbatim) — no JS
  state machine, no new TS module. On viewports ≤1024px the right-column
  `.toc-panel` is hidden by `assets/css/layout/page-grid.scss`, so this
  dropdown becomes the sole ToC affordance; on wider viewports both remain
  available, matching Vector's behaviour on the Cat article. Pages with no
  `.TableOfContents` skip the dropdown via the same `with` guard
  `layouts/_partials/sidebar/toc-panel.html` already uses.
- `.skip-link` styling in `assets/css/base/_reset.scss`. The skip link
  itself was emitted by `layouts/_default/baseof.html` already, but had
  no CSS so it rendered inline. The new rule hides it until focused,
  then anchors it top-left with a focus-ring border — Vector's
  `.mw-jump-link` equivalent.
  - `layouts/_partials/article/article-header.html` now delegates to the
    new page-titlebar partial; the outer `article-header` class is
    preserved so `assets/css/components/article-body.scss`'s
    `.article-header h1` selector keeps applying.
- `[[menu.footer]]` config block in `exampleSite/hugo.toml` with four
  entries (About / Privacy / Terms / Code of conduct) mirroring Vector
  2022's `Footer.mustache` link shape. Downstream sites can replace
  this block with their own footer nav.
- `layouts/_partials/header/sticky-header.html` — new partial emitting
  the condensed chrome (page title + ToC quick-open button) that
  `assets/css/components/sticky-header.scss` styles and
  `assets/js/modules/sticky-header.ts` drives. The CSS and JS existed
  already; the module exited silently because the markup was never
  emitted. Wired into `layouts/_default/baseof.html` immediately after
  the footer so it overlays the page chrome without reflowing it.
- `layouts/_partials/sidebar/toc-panel.html` upgraded from a 6-line
  stub to a `<aside id="toc-panel">` shell with a `Contents` heading
  and a `with .TableOfContents` guard so pages with no headings
  (home, section index) don't render a half-empty ToC. The new
  `id="toc-panel"` is the aria-controls target referenced by the
  sticky-header's ToC-toggle button.
- `assets/css/components/article-categories.scss` — new file (one
  concern per `00-core.mdc`) styling `.article-categories` as a
  pill-shaped row of category links at the bottom of an article.
  The markup contract was emitted by
  `layouts/_partials/article/categories-footer.html` already; the
  previous CSS-less state rendered as plain bullet links.
- `layouts/_partials/header/site-header.html` emits `class="page-header"`
  (was `site-header`) so the sticky positioning rule in
  `assets/css/layout/header.scss` activates. Adds a
  `[data-sidebar-toggle]` button (Vector's hamburger affordance) as
  the first child of the header so it can drive the new outer
  sidebar-collapse behavior. Styles for the toggle button live in
  `assets/css/layout/header.scss`.
- Outer sidebar-collapse behavior in
  `assets/js/modules/sidebar-toggle.ts`. Previously the module
  handled only per-portlet collapse; this commit extends it to wire
  the new header toggle button. Click flips `[data-sidebar="collapsed"]`
  on `<html>`, persisted under `vhskin:sidebar:outer`. The CSS side
  collapses the page-grid's sidebar column to width 0 when the
  attribute is set (rule added in `assets/css/layout/page-grid.scss`).

### Changed
- `assets/js/modules/sidebar-toggle.ts` now coordinates two related
  behaviors in one file (outer collapse + per-portlet collapse) —
  flagged in `docs/UI-AUDIT.md` §6 as a tension with the
  `30-scripts.mdc` "one behavior per file" rule. The two behaviors
  share the same DOM root and the same persistence namespace;
  splitting them would force a third wiring file in `main.ts` for
  no separation benefit. Acceptable for this pass; revisitable.
- `layouts/_partials/header/search-box.html` rewritten to emit a
  three-region input (magnifier affordance label + plain input + icon
  submit button) replacing the previous text submit. Vector's
  SearchBox pattern: the visible submit is a magnifier icon, the input
  is plain text, and the label-wrapped magnifier on the left focuses
  the input on click. Adds `id="search-box-input"` (the label's `for`
  target) and `id="search-box-suggestions"` on the suggestions list.
- `assets/css/components/search-box.scss` restructured to style the
  three-region layout and use the HTML `hidden` attribute on
  `.search-box__suggestions` instead of the previous
  `.search-box--suggestions-open` class toggle. Same observable
  behavior, fewer state tokens to track; the JS module already sets
  `list.hidden = true/false` so no JS change is required.
- `layouts/_partials/header/personal-tools.html` rewritten so each
  `[data-theme-value]` button shows an inline SVG icon (sun / moon /
  clock) instead of text labels. `aria-label` on each button remains
  so screen readers announce "Light theme" / "Dark theme" / "Auto
  theme" — same accessible name as before, just visually iconified to
  match Vector's Appearance dropdown.
- `docs/UI-AUDIT.md` — per-surface gap analysis comparing the rendered
  site against Vector 2022's behavior, plus a 5-commit implementation
  plan, the surfaces consciously deferred (with rationale), and the
  rule-tensions surfaced for the user.

### Notes (deferred, not in this Unreleased)
- Limited-width toggle (`vector-limited-width` preference).
- ToC auto-collapse at 28 headings (`wgVectorTableOfContentsCollapseAtCount`).
- ToC pinned state (`vector-toc-pinned` preference).
- Pinnable Appearance dropdown (would replace the current segmented
  text-button theme toggle with an iconified dropdown).
- Right-side Page-tools portlet.
- See `docs/UI-AUDIT.md` §3 for the full list and rationale.

Phase 16 follow-up fidelity pass — visual comparison of the rendered
site against Vector 2022 surfaced two user-reported responsive bugs and
four remaining small in-scope gaps. See `docs/UI-AUDIT.md` §7 for the
full pass.

### Fixed
- Article-title CSS contract: `layouts/_partials/article/article-header.html`
  has always emitted `<h1 class="article-title">` (and `<p
  class="article-subtitle">`), but `assets/css/components/article-header.scss`
  styled the wrong class names (`.article-header__title` /
  `.article-header__subtitle`). The article title fell through to the
  global H1 rule (`font-size: 2rem`, `font-weight: 700`) and rendered
  as a heavy sans-serif block — visually distinct from Vector 2022,
  where the article title uses the serif family at the default 400
  weight. The CSS file now targets the actual emitted classes, so the
  H1 picks up `font-family: var(--font-serif)` and
  `font-weight: var(--font-weight-normal)`. The previous BEM selectors
  are deleted (they never matched anything in the DOM).
- Header collapse at 456px (user-reported Bug A):
  `assets/css/layout/header.scss` now keeps `.page-header` on a single
  row at every viewport ≥ 320px. Root cause: each flex child carried
  the default `min-width: auto`, which meant the row could not shrink
  past the search box's `max-width: 28rem`. The container then grew
  vertically to wrap, leaving a 100–150px tall header. The fix gives
  every direct child (`__sidebar-toggle`, `__logo`, `__title`,
  `__tools`, and the nested `.search-box`) an explicit `min-width: 0`
  and turns the `.site-logo-mark` text into a single ellipsis-truncated
  span. At <500px the search input collapses to a magnifier icon
  (matching Vector's mobile behaviour — at narrower widths Vector
  surfaces search via the sidebar instead of letting the header wrap).
- Article / footer responsive leakage at narrow widths (user-reported
  Bug B): the `.main-content` grid cell inside the page-grid did not
  carry `min-width: 0`, so an over-wide infobox caption or `<pre>`
  block forced the track to expand past its declared `minmax(0, 1fr)`
  and pushed the article horizontally into the column containing the
  footer. The previous `.page-grid__main` selector in
  `assets/css/layout/page-grid.scss` was a contract miss — no element
  ever carried that class; the actual inner div is `.main-content`
  (emitted by `layouts/_default/baseof.html`). The fix adds
  `.main-content { grid-area: main; min-width: 0; }` so the cell can
  shrink below its content's intrinsic min-content width. The footer
  is also pinned to its own stacking context
  (`position: relative; z-index: 0;`) so the sticky-header can never
  bleed into its visual area at narrow widths.

### Fixed
- **ToC panel misplaced into the article column at desktop widths.** Root
  cause: the `.toc-panel` element emitted by
  `layouts/_partials/sidebar/toc-panel.html` carried no `grid-area`
  declaration, while its sibling `.main-content` claimed the `main`
  named area in `assets/css/layout/page-grid.scss`'s
  `grid-template-areas`. CSS Grid auto-placement dropped the ToC into
  the `main` cell — at 1280–1440px the empty-ish ToC heading "Contents"
  sat on top of the article body and visually obscured the article
  H1. The symptom looked like "the dark header is overlapping the
  sidebar and squashing the article" because the ToC heading landed
  on the article column, which is the visual neighbour of the sticky
  header bar; the actual bug was further down the cascade. Fix: add
  `grid-area: toc` to `.toc-panel` in
  `assets/css/layout/toc-panel.scss` so it lands in the right column
  defined by the page-grid template. Verified at 1100/1280/1440px on
  `church-demo`, `person-demo`, `long-article-with-toc`, and the home
  index — ToC now sits in the right column below `var(--header-height)`,
  article body is no longer covered, sidebar remains full-width.
  See `docs/UI-AUDIT.md` §7.4 for the full root-cause / fix / verification.

### Changed
- Article-body heading rhythm brought in line with Vector 2022's
  `typography.less`: H2 sits at `1.5rem` (was `1.6rem`) and at the
  default 400 weight in the serif family (was 700 sans); H3/H4 stay
  bold (600) in the sans family but are tightened to `1.2rem` /
  `1rem` respectively (was `1.4rem` / `1.2rem`). The bottom-border
  rule that previously applied to all `h2`/`h3`/`h4` now applies to
  H2 only — Vector 2022 underlines H2 but not H3+. Section-list H1
  (homepage and section-index) gets the same serif / 400-weight
  treatment as the article H1, so the heading rhythm is consistent
  across the demo site.

### Added (second-plan visual & behavioral parity pass)
- `docs/RESEARCH.md` gains a second-plan block (§§10–§14) recording
  the visual & behavioral parity pass. Tracks the §11 design-token
  inventory cross-sourced from the live Vector 2022 stylesheet bundle
  and the upstream LESS files (pinned to clone SHA `dd9a26f9`,
  2026-07-02), the §12 layout-and-grid findings, the §13 component
  catalog carry-forward with breakpoint bindings (extending the
  first-plan §1 entries), the §14 unified breakpoint table, and the
  §13.4 expansion of the exclusion list by three items surfaced
  during live inspection. The four sub-sections together are the
  source-of-truth record for subsequent parity fixes — every concrete
  value Phase 8/9 implements traces to one of the source columns
  cited in §11/§12. No code from Vector's source is reproduced; every
  token value is taken from the live stylesheet bundle (Surface A per
  the Phase 1 research-philosophy contract) or derived independently
  from the Codex public token list.

### Changed
- Token palette brought in line with the live Vector 2022 stylesheet
  bundle and matching §11.2/§11.3 values. Specific moves: light
  `--color-link-visited: #6b4ba1 → #6a60b0`, light `--color-link-hover:
  #447ff5 → #3056a9` (Vector's `--color-progressive--hover` is the
  canonical hover value for both link and progressive surfaces);
  dark `--color-surface: #101922 → #101418`, `--color-surface-alt:
  #1f2a38 → #27292d`, `--color-link-visited: #b08fe6 → #a799cd`,
  `--color-link-hover: #b6c4f4 → #a6bbf5`, `--color-border: #54595d →
  #72777d`, `--color-divider: #404448 → #54595d`, `--color-code-bg:
  #1f2a38 → #27292d`. The dark infobox header/label background pair
  now matches the live Vector dark values (`#27292d` / `#202122`) and
  its border (`#54595d`). All three theme blocks (`themes/light.scss`,
  `themes/dark.scss`, `themes/auto.scss`) are aligned with the new
  palette so the auto-theme's `prefers-color-scheme: dark` cascade
  emits exactly the same values as the explicit dark mode — matching
  Vector's identical `.cdx-mode-dark()` output for both cases.
  No render-layer change — the dual-mode contract (`--color-link`
  ↔ `--color-progressive` aliasing, `--color-link--hover` ↔
  `--color-progressive--hover` aliasing) already works in the new
  palette, no template or TS module touches required.

### Changed (sticky-header behavior)
- `assets/js/modules/sticky-header.ts` rewritten to use an
  `IntersectionObserver` on the bottom edge of the primary
  `.page-header` (rather than a fixed 200 px scroll-direction delta)
  per `docs/RESEARCH.md` §12.2 (second-plan Phase 4 layout findings).
  Vector 2022's own `stickyHeader.js` uses the same observer pattern,
  and the previous scroll-position approach accumulated a 200 px
  no-op zone at the top of every page plus jitter on the first real
  scroll event. Sentinel element appended to the primary header:
  when the sentinel stops intersecting the viewport, the condensed
  `.sticky-header` becomes visible; when it intersects again, the
  condensed header collapses. **Initial-paint fix:** the module no
  longer calls `setVisible(true)` unconditionally on init — the SCSS
  default (`translateY(-100%)` / `opacity: 0`) keeps the bar
  off-screen until the scroll handler reveals it. The previous
  unconditional boot call stacked the condensed bar on top of the
  sticky `.page-header` at `top: 0` and produced a visible two-bar
  overlap on first paint. Bottom-of-page edge case (where the
  observer alone misses state) is still handled via a passive
  `scroll` listener that flips the condensed header back on at the
  document bound; top-of-page no longer forces it visible, because
  the primary header already covers that area. Behavior contract
  unchanged for end users (`.is-visible` / `.is-hidden` toggle still
  drives the same CSS states); no template or SCSS changes; the
  sidebar-toggle, theme-toggle, and ToC scroll-spy modules are
  unaffected.

### Added (theme-switch FOIT guard)
- New asset `static/js/theme-early.js`: a small synchronous script
  (~30 lines) that reads `localStorage.theme` and sets
  `data-theme` + `data-theme-mode` on `<html>` before the stylesheet
  bundle paints, eliminating the flash-of-wrong-theme that would
  otherwise occur for returning users on a stored non-default theme.
  Loaded directly from `layouts/_default/baseof.html` via
  `<script src>` (not as inline `<script>` content in the template)
  to honor `.cursor/rules/30-scripts.mdc` (`no inline script in
  templates`) while still blocking the FOIT. The data-theme-mode
  attribute is preserved so `theme-toggle.ts`'s auto-mode handler
  (which keys off `getAttribute('data-theme-mode')`) does not need
  any changes — the early script and the toggle agree on the
  attribute contract. Storage failures (private mode, disabled
  cookies) are caught silently: the page falls back to
  `themes/auto.scss`'s `prefers-color-scheme` media query and no
  attribute is set, matching the previous behavior.

### Verification (second-plan Phase 12)
- `npm run build` runs clean against the example site: 45 pages, 0
  errors, 0 unexpected warnings (the two `no template for json` info-
  level warnings for page and section layouts are pre-existing first-
  plan noise; the home page JSON output the search index depends on
  is still emitted via `home.json`, and the index.json search index
  is built as documented in `docs/ARCHITECTURE.md` §6).
- CSS bundle spot-check confirms the §11 token refresh shipped end-
  to-end: `--color-link-visited: #6a60b0` (light, twice for :root
  and `[data-theme="light"]`) and `#a799cd` (dark, twice for
  `[data-theme="dark"]` and the auto media-query rule);
  `--color-link-hover: #3056a9` (light) / `#a6bbf5` (dark);
  `--color-surface: #ffffff` (light) / `#101418` (dark).
- Static-HTML element check on `articles/long-article-with-toc/index.html`:
  `.page-grid` × 1, `.sticky-header` × 4 (in markup + class+script
  references), `.toc-panel` × 2, `.theme-toggle` × 6, `.main-content`
  × 3, `<html lang=en-US data-theme=auto>` present, `theme-early.js`
  referenced × 1. All five reference pages from `docs/RESEARCH.md`
  §10.1 curl-check return 200.
- Browser-based parity screenshots were attempted but the Electron-
  bundled MCP browser cannot reach `localhost:1313` from inside its
  sandbox even when the dev server is up and reachable from the host
  shell — `Page.getFrameTree` reports `unreachableUrl` for the
  expected address. Visual comparison recorded as Phase 12 §6.1
  gap: a future executor with a non-sandboxed browser or a hosted
  staging URL can replay the §12.1 manual walkthrough against the
  live site.

### Documents (second-plan Phase 13)
- `README.md` Contributors list now points to `docs/RESEARCH.md`
  §§10–§14 (with §14.1 named as the single-source-of-truth for
  breakpoints) and to `docs/ARCHITECTURE.md` §§7-9 (theming
  mechanism, parity contract, file-size audit).
- `docs/ARCHITECTURE.md` extends with §7 theming mechanism
  (data-theme + data-theme-mode + localStorage contract, FOIT
  guard via `static/js/theme-early.js`), §8 visual & behavioral
  parity contract (three research surfaces, no fixed values from
  the plan source), and §9 file-size audit (largest runtime file
  is `infobox.scss` at 201 lines, well under the 500-line split
  threshold; `search.ts` is the longest TS module at 167 lines).
- `docs/RESEARCH.md` §11.9 closes the three open questions carried
  out of Phase 3 (heading rhythm — closed by the existing v1.0.0+
  audit-pass commit `91e61bb`; light/dark visited-link palette —
  closed by `9d86526`; dark-mode `--color-surface` and
  infobox-separator triad — closed by `9d86526`).
- `docs/UI-AUDIT.md` carries forward unchanged — the second-plan
  pass did not introduce new fidelity gaps beyond §11's table, and
  the existing audit's §1.5 heading-rhythm entry refers to the same
  tightening that the closed-question entry now references.

Vector 2022 responsive audit — four narrow-viewport fixes (F3 + F4 +
F7 + F8 per `docs/UI-AUDIT.md` §6).

### Added
- Mobile theme-toggle dropdown contract at `@media (max-width: 600px)` in
  `assets/css/components/theme-toggle.scss`. The segmented three-button
  group collapses to a single 44×44px handle (`.theme-toggle::before`
  pseudo-element) and the three light/dark/auto option buttons hide
  until the wrapper carries `[data-theme-dropdown="open"]`. The wrapper
  itself then reveals the options as a stacked dropdown panel anchored
  top-right. All three `.theme-toggle__option` buttons remain in the
  DOM and continue to receive clicks — `assets/js/modules/theme-toggle.ts`
  is unchanged, so `vhskin:theme` persistence and `[data-theme]` /
  `[data-theme-mode]` HTML attribute wiring flow exactly as they do on
  wider viewports.

### Changed
- `assets/css/components/page-titlebar.scss`: `.page-titlebar` now
  uses `flex-wrap: wrap` globally (was `nowrap`) so the H1 and the
  ToC dropdown can occupy separate rows at any viewport. Added
  `@media (max-width: 1024px) .page-titlebar__title { flex: 1 1 100%; }`
  to let the H1 claim the full row width when the right-column ToC
  is hidden (the dropdown below is then the sole ToC affordance).
- `assets/css/components/page-titlebar.scss` and
  `assets/css/components/article-header.scss`: H1 font-size drops to
  `1.5rem` at `@media (max-width: 719px)` on both
  `.page-titlebar__title` and `.article-title`. The latter is
  defensive parity — both classes can be applied to the article's H1
  depending on which partial renders it.
- `assets/css/components/infobox.scss`: at `@media (max-width: 719px)`,
  `.infobox-row` switches to `flex-direction: column` and both
  `.infobox-label` and `.infobox-data` claim `width: 100%`, so the
  label sits above its data cell with full row width. Mirrors
  Vector's mobile infobox pattern.

## [1.0.1] - 2026-07-11

Hotfix patch: three build errors surfaced by `npm run dev` immediately after the
v1.0.0 tag — `theme.toml` was malformed TOML, `exampleSite/hugo.toml` used the
deprecated top-level `languageCode` key, and `layouts/_default/baseof.html`
referenced `.Site.LanguageCode` (deprecated since Hugo v0.158.0). Fixing the
TOML parse error restored the Dart Sass pipeline; the SCSS tree itself was
healthy (verified by standalone `npx sass` compile, by `hugo --source ...`
exit 0, and by `npm run dev` clean warm-start).

### Fixed
- `theme.toml` used TOML literal strings (`'…'`) for two descriptions but
  contained an `\'` escape — literal strings forbid backslash escapes, so
  Hugo's module loader reported `_stream.toml:3:59` parse failure (the same
  parser, surfaced under its internal `_stream.toml` name) and aborted every
  page render with `Failed to read module config`. Switched both lines to
  TOML basic strings (`"…"`) where the apostrophe needs no escaping. The
  v1.0.0 tag (`44094eea`) remains immutable; the fix lands on `main` as a new
  commit.
- `exampleSite/hugo.toml`: replaced deprecated top-level `languageCode = "en-us"`
  with `defaultContentLanguage = "en"` plus an explicit `[languages.en]` block
  (`locale = "en-US"`, `weight = 1`), silencing the `project config key
  languageCode was deprecated in Hugo v0.158.0` warning.
- `layouts/_default/baseof.html`: replaced `{{ .Site.LanguageCode | default "en" }}`
  on the `<html lang>` attribute with `{{ .Site.Language.Locale | default "en" }}`,
  silencing the `.Site.LanguageCode was deprecated in Hugo v0.158.0` warning.

### Fixed
- `assets/css/main.scss` line 38: `@use 'components/article-body';` was
  missing the alias convention used by its layout twin on line 27
  (`@use 'layout/article-body' as layout-article-body;`). Both partials
  share the basename `article-body`, and Dart Sass enforces "no duplicate
  basenames across `@use` targets" in the namespace table. Without the
  alias, the Hugo Pipes Dart Sass bridge emitted `TOCSS-DART … got
  unexpected EOF when executing "sass"` plus `"<stream>:1:1": connection
  is shut down` instead of a clearer duplicate-module error. Adding
  `as components-article-body;` matches the layout-side aliasing convention
  (already explained in `main.scss:12-17`) and resolves the namespace
  collision.

### Verified (follow-up re-investigation, corrected)
A first follow-up after the 1.0.1 TOML/locale fixes landed could not
reproduce the SCSS EOF error from a clean state and concluded "no further
code change was warranted" — that conclusion was wrong. A second
follow-up with the Dart Sass namespace-table hypothesis confirmed the
real root cause: `components/article-body` and `layout/article-body`
share a basename, and `components/article-body` was loaded unaliased.
The earlier "clean warm-start" runs only happened to succeed because
the SCSS module cache order put the aliased `layout/article-body` first;
once the unaliased `components/article-body` was reached the namespace
slot collided and the bridge died. Post-fix verification: `npm run dev`
warm-start shows `Built in 85 ms`, zero ERROR lines; the previously
failing articles (`church-demo`, `football-biography-demo`,
`baseball-biography-demo`) all serve HTTP 200.

### Fixed
- **Real root cause (resolved):** the EOF errors resurfaced after `02c2740`
  because of an environment-specific sass binary lookup failure. Hugo v0.163.3
  resolves `sass` via Go's `exec.LookPath`, walks `PATH` left-to-right, and
  invokes the chosen binary with the `--embedded` flag (the dart-sass
  embedded-protocol server mode). The host's `~/.npm-global/bin/sass`
  (a Node.js wrapper installed by `npm i -g sass`) appears on `PATH` ahead
  of `/usr/bin/sass`; that JS wrapper does not implement the embedded
  protocol, so the bridge saw EOF mid-stream and reported
  `TOCSS-DART … got unexpected EOF when executing "sass"` plus
  `"<stream>:1:1": connection is shut down`. Confirmed by `strace`:
  `execve("/usr/bin/sass", ["/usr/bin/sass", "--embedded"], …)` succeeds
  in clean-PATH mode but fails when `npm-global/bin` is first. Fixed by
  adding `sass-embedded` (`1.100.0`) to `devDependencies`. The package's
  `node_modules/.bin/sass` is the embedded-protocol server, `npm` prepends
  `node_modules/.bin` to `PATH` ahead of `~/.npm-global/bin` and `/usr/bin`,
  and Hugo's `security.exec.allow = ['^(dart-)?sass(-embedded)?$', …]`
  whitelist accepts the basename `sass`. Cold-start verification:
  `rm -rf exampleSite/resources && npm run dev` returns 45 pages, zero
  ERROR lines, in 144 ms — and the same result holds when
  `PATH=/home/alpha01/.npm-global/bin:$PATH npm run dev` reproduces the
  user's actual `PATH` ordering.

## [1.0.0] - 2026-07-11

The first shippable release of `vector-hugo-skin`: a static Hugo reimplementation
of Wikipedia's Vector 2022 skin + a MediaWiki-style Infobox shortcode family.
No PHP, no MediaWiki server, no database. The bundled example site
(`exampleSite/`) doubles as both the developer reference and the canonical
build-green verification target.

> **Phase 14 post-tag patch (2026-07-11, added via `docs: ship Phase 14`
> commit, not by amending `v1.0.0`):** the v1.0.0 release commit
> (`e69a50d`) shipped without a `LICENSE` file or with a placeholder
> reference — Phase 14 (licensing and scope notes, the final validation
> gate) landed these afterwards:
>
> - `LICENSE` at the repo root: MIT text, Copyright (c) 2026
>   vector-hugo-skin contributors.
> - `README.md` "License" section rewritten: it now points at the
>   `LICENSE` file and restates the Wikimedia non-affiliation disclosure
>   previously embedded inline above the section.
>
> Existing artefacts already present at `v1.0.0` time and unchanged by
> this patch: the inline non-affiliation disclosure at the top of
> `README.md` (lines 6–11 at the v1.0.0 tag), `docs/RESEARCH.md` and
> `docs/SHORTCODES.md` in original-analysis wording, `.gitignore`
> excluding `/reference/`, and the empty `git ls-files reference/` and
> `git log --all --full-history -- 'reference/**'` results.
> No `reference/` or upstream Vector source files have ever been
> committed to the repository's history at any time.

### Added
- Project scaffolding: theme directory structure, example site fixtures, dev tooling
  (npm + Playwright + ESLint + Stylelint + TypeScript configs), and Cursor rule set —
  see `.plans/first-plan/00-environment-setup.md` and `04-repo-directory-structure.md`.
- Phase 3 architecture overview (`docs/ARCHITECTURE.md`): the five hard constraints
  from `.cursor/rules/00-core.mdc` restated with rationale (file size ceiling,
  one-language-per-file, one-concern-per-file, folder-per-shortcode, no runtime
  Node deps), the CSS / JS / template / tests module-boundary map with real-file
  examples, the workspace-as-theme build invocation (Hugo invoked with
  `--source exampleSite`), the pinned toolchain versions (Hugo 0.163.3+extended,
  Node 26.4.0, npm 11.18.0, Git 2.55.0), and the SCSS-over-LESS / vanilla-TS-over-
  framework / CSS-custom-properties-over-Sass-vars / build-time-JSON-search-index
  stack rationale. Phase 12 will expand with full Hugo API notes and search-index
  scaling tradeoffs. See `.plans/first-plan/03-architecture-overview.md` and
  `12-documentation-and-handoff.md`.
- Phase 1 research notes (`docs/RESEARCH.md`): catalog of what to keep and what to exclude
  from Wikipedia's Vector 2022 skin, plus the upstream LESS → SCSS and ES6 → TS source
  mappings and the candidate `theme.toml` parameter surface. The Vector source clone at
  `reference/vector/` is gitignored — kept locally for ongoing reference, never committed.
  See `.plans/first-plan/01-research-vector-skin.md` and `14-licensing-and-scope-notes.md`.
- Phase 2 research notes (`docs/RESEARCH.md` §6 + §7): structural study of MediaWiki's
  `Template:Infobox` metatemplate and four topic children (person, company, software,
  settlement) in original analysis words — no verbatim Wikipedia template code or
  parameter tables reproduced — plus the four locked-in design decisions for the v1
  shortcode family (family of named wrappers with shared base partial + inner-primitive
  escape hatch; v1 field set including the `infobox-pair-*` special-case primitives;
  right-floated on desktop / full-width stacked below the lead on mobile; explicit v1
  scope cuts for geo-map widgets, embedded charts, collapsible sub-tables, Wikidata
  lookups, Lua/Scribunto, and Wikipedia microformat emission). §7 reproduces the
  top-30 coverage contract from `.plans/first-plan/2a-infobox-template-inventory.md`
  for downstream phases to reference; the Phase 2½ executor will re-verify and may
  re-rank before Phase 8 begins. See `.plans/first-plan/02-research-infobox-templates.md`
  and `14-licensing-and-scope-notes.md` §3 for the licensing boundary around this
  work (study structure and parameter concepts only — never copy template code).
- Phase 2½ lock-in (`docs/RESEARCH.md` §7–§9 and `docs/SHORTCODES.md`): the §7
  coverage contract is re-verified against the live `linkcount.toolforge.org`
  snapshot dated 2026-07-10 and re-ranked to reflect month-over-month drift
  (5 shortcodes moved more than two positions; canonical 30-row set unchanged from
  the Phase 2½ plan). §8 documents the 9-step procedure for adding a new named
  shortcode past v1 (verify upstream, add row, create wrapper, special partial,
  one-line SCSS rule, demo page, per-template doc entry, E2E parametrisation,
  optional rule update). §9 catalogues the seven `infobox-pair-*` inner
  primitives with the named shortcodes that consume each one. The
  `docs/SHORTCODES.md` Authoring Guide ships the 3-layer architecture, the
  MediaWiki → Hugo syntax mapping, the inner-primitive escape hatch, the CSS hook
  contract, the responsiveness commitment, the v1 scope cuts, and the future
  work list — per-template entries remain a Phase 8 deliverable. See
  `.plans/first-plan/2a-infobox-template-inventory.md`, `08-infobox-shortcode-spec.md`,
  and `14-licensing-and-scope-notes.md`.
- Phase 4 directory-structure compliance (per `.plans/first-plan/04-repo-directory-structure.md`):
  the full annotated scaffold now exists — 33 shortcode folders (30 named family plus
  `infobox/`, the latter with 6 layer primitives + 7 `infobox-pair-*` shortcodes), all
  five `partials/{header,sidebar,article,footer,infobox}` regions with their partials,
  `assets/css/main.scss` as imports-only and `assets/js/main.ts` as a single `init()`
  orchestrator, `layouts/_default/{baseof,single,list}.html` stubs, `theme.toml` with
  name/license/description plus author + repo blocks, `i18n/en.toml` with the minimum
  keys for the partials (`searchPlaceholder`, `personalToolsLabel`, `mainMenuLabel`,
  `readingTime`), `tests/e2e/{specs,fixtures}/.gitkeep` stubs plus Playwright config
  with workspace-as-theme `webServer` command matching `docs/ARCHITECTURE.md` §3, and
  the `exampleSite/` with three content fixtures (long-article with ToC, article with
  infobox, short article) and `archetypes/{default,infobox-demo}.md`. Tightened the
  Playwright webServer command and the `exampleSite/hugo.toml` comment block; no
  substantive code shipped yet — all CSS/JS/shortcode/partial files remain placeholders
  so Phase 5 (styles), 6 (scripts), 7 (templates), and 8 (shortcodes) each land in their
  own follow-up commits. `hugo --source exampleSite --quiet` exits 0. See
  `.plans/first-plan/04-repo-directory-structure.md`.
- Phase 5 SCSS porting (per `.plans/first-plan/05-css-porting-plan.md`): reimplemented
  Vector's visual design as SCSS, processed through Hugo Pipes. The full cascade ships
  in `assets/css/main.scss` as imports only — base → layout → components → themes. Base
  layer (`assets/css/base/`) defines design tokens as CSS custom properties
  (`--color-*`, `--font-*`, `--space-*`, `--layout-*`, `--radius-*`, `--shadow-*`,
  `--transition-*`, `--z-*`) so light/dark/auto themes can override them at runtime
  without recompilation, plus a minimal reset and a typography rhythm (body,
  h1–h6, code/kbd/pre, lists, blockquote, article-body). Layout layer
  (`assets/css/layout/`) holds the page-grid skeleton (`page-grid.scss`), the header
  region (`header.scss`), the sidebar column (`sidebar.scss`), the ToC panel
  (`toc-panel.scss`), the article body container (`article-body.scss`), and the footer
  region (`footer.scss`). Components layer holds 18 one-component-per-file SCSS modules
  under `assets/css/components/` — `header-companions`, `search-box`, `sidebar`,
  `sticky-header`, `toc`, `tabs`, `infobox`, the seven `infobox-pair-*` primitives
  (date, software-release, population, area, air-date, budget-gross, episode-season),
  `article-header`, `article-body`, `footer`, and `theme-toggle`. The infobox base file
  consumes the seven pair files via `@use` and emits per-template visual tweaks keyed
  on `[data-infobox-type="<slug>"]` for `person`, `film`, `software`, `company`,
  `settlement`, `country`, `television` (and its episode/season children), `album`,
  and `organization` — per-template CSS files are prohibited per
  `.cursor/rules/00-core.mdc` so all per-template rules live in the single
  `infobox.scss`. Theme layer (`assets/css/themes/{light,dark,auto}.scss`) ships
  `[data-theme="light"]`, `[data-theme="dark"]`, and a `prefers-color-scheme` media-
  query block that redefine the colour tokens only — no layout or component rules in
  any theme file. Worst-offender file is `infobox.scss` at 201 LOC (well under the
  500-line ceiling). `hugo --source exampleSite --quiet` exits 0 and a direct
  `dart-sass` compile of `main.scss` produces 33 KB of valid CSS with zero errors.
  No theme tokens were copied verbatim from Vector's LESS — every value is a clean-
  room reimplementation from rendered observation, see
  `.plans/first-plan/14-licensing-and-scope-notes.md` §3. Phase 7 owns the Hugo
  Pipes wiring (`css.Sass` in the partial that emits the `<link>` tag) — no template
  changes ship in this commit. See
  `.plans/first-plan/05-css-porting-plan.md`, `docs/ARCHITECTURE.md` §5, and
  `docs/SHORTCODES.md` §6.
- Phase 6 JS/TS porting (per `.plans/first-plan/06-js-ts-porting-plan.md`): reimplemented
  Vector's six client-side behaviors as vanilla TS modules in clean room from a
  behavioral study of the upstream skin — never a transpilation of Vector's ES6, so
  zero `mw.*` references remain. Six modules under `assets/js/modules/`, each
  implementing exactly one behavior per `03-architecture-overview.md` hard
  constraint #3: `sidebar-toggle.ts` collapses and expands `.sidebar-list__group`
  portlet groups with `localStorage` persistence; `toc.ts` does scroll-spy via
  `IntersectionObserver` and toggles `.toc__item--active` against Hugo's
  `.TableOfContents` anchors; `sticky-header.ts` shows/hides the condensed header
  on scroll direction, always visible at top/bottom, scroll events throttled via
  `utils/debounce.throttle`; `tabs.ts` is a generic ARIA-correct tab widget
  (click, arrow keys, Home/End, roving tabindex) keyed off `[role="tablist"]`;
  `theme-toggle.ts` cycles light/dark/auto and respects
  `prefers-color-scheme` while in auto mode; `search.ts` does a build-time-JSON
  substring search against titles + summaries, capped at 10 results. Three utils
  under `assets/js/utils/` — `dom.ts` (`q`, `qAll`, `addClass`, `removeClass`,
  `toggleClass`), `debounce.ts` (`debounce`, `throttle`), and `storage.ts`
  (`get`/`set`/`remove` all wrapped in try/catch + JSON serialization under the
  `vhskin:` namespace). `assets/js/main.ts` is straight-line composition only —
  6 imports + `bootstrap()` of `init()` calls + the `readyState === 'loading'`
  guard, no logic of its own. The build-time search index runs through Hugo
  output formats: `exampleSite/hugo.toml` adds `[outputs] home = ["HTML", "JSON"]`
  and `layouts/_default/home.json` emits `[/]` of `{title, summary (plainified),
  url}` for every regular page — `npm run build` produces a valid
  `public/index.json` array. `package.json` `dev` and `build` scripts now pass
  `--themesDir ../..` + `--theme vector-hugo-skin` so the workspace-as-theme
  layout actually resolves across Hugo versions that don't honour an empty
  `theme` value (Phase 5 flagged this but deferred it). `npx tsc --noEmit`
  exits 0, `npm run build` exits 0, `hugo --source exampleSite --quiet` exits 0;
  worst-offender file is `search.ts` at 167 LOC (well under the 500-line
  ceiling); `grep -r 'mw\.' assets/js/` returns 0 matches. Hugo Pipes `js.Build`
  wiring stays in Phase 7 (no `baseof.html` / partial changes ship here). See
  `.plans/first-plan/06-js-ts-porting-plan.md` and
  `.plans/first-plan/14-licensing-and-scope-notes.md` §3 for the licensing
  boundary around this work.
- Phase 8 infobox shortcode spec & implementation (per
  `.plans/first-plan/08-infobox-shortcode-spec.md`): the 30 named wrappers
  in `docs/RESEARCH.md` §7 each get a real implementation — a thin
  Go-template that maps the upstream MediaWiki parameter list onto the base
  partial's slot system — at `layouts/_shortcodes/{slug}.html`. Each
  wrapper's header comment block lists the accepted parameters in
  declaration order; each wrapper emits its type key through the dict
  passed to `layouts/_partials/infobox/base.html`, which is the single
  entry point that emits `<aside class="infobox" data-infobox-type="…">`
  for every named shortcode. The 13 inner-primitive shortcodes (paired
  outer `infobox`, five generic primitives `infobox-row` / `-image` /
  `-section` / `-below` / `-field`, and seven special-case `infobox-pair-*`
  pairs for date / software-release / population / area / air-date /
  budget-gross / episode-season) were already implemented in Phase 4 / 7
  and ship unchanged. The six partials under `layouts/_partials/infobox/`
  (`base`, `header`, `image-block`, `row`, `section`, `below`) are real
  implementations from Phase 4 / 7 and ship unchanged. The `_shortcodes`
  and `_partials` directory rename — `layouts/shortcodes/` → `layouts/_shortcodes/`
  and `layouts/partials/` → `layouts/_partials/` — was a Phase 8 catch:
  Hugo v0.146.0+ renamed those directories, so the Phase 4 folder names
  silently broke every shortcode lookup in v0.163.3 (the installed
  version). The rename keeps the per-shortcode-file-per-concern intent of
  `.cursor/rules/00-core.mdc` and `.cursor/rules/40-shortcodes.mdc` while
  matching the v0.146+ lookup convention; both rules were updated in the
  same commit. Worst-offender file is `layouts/_shortcodes/country.html`
  at 65 LOC (well under the 500-line ceiling). The 30 per-template
  reference entries land in `docs/SHORTCODES.md` §10 (one section per
  shipped named shortcode — one-line intent, most-used parameter list,
  paired-form worked example, upstream MediaWiki "see also" link) on top
  of the §1–§9 Authoring Guide from Phase 2½. A build-time smoke
  fixture at `exampleSite/content/articles/phase8-smoke-test.md`
  exercises every shipped named shortcode so `npm run build` produces
  30 real `<aside class="infobox" data-infobox-type="…">` blocks (used
  to verify Phase 8's implementation during development; downstream
  phases can remove or replace it). `npm run build` exits 0. Worst
  offender is `country.html` at 65 LOC. See
  `.plans/first-plan/08-infobox-shortcode-spec.md`.

- Phase 9 example site (per `.plans/first-plan/09-example-site.md`): `exampleSite/`
  is upgraded from Phase 0/4 stubs into a real consuming site that doubles as
  the Playwright E2E target. `exampleSite/hugo.toml` finalizes with the
  workspace-as-theme `themesDir` + `theme` pair, a `[[menus.main]]` block
  carrying Home and Articles entries consumed by the Phase 7 sidebar
  `main-menu.html` partial, `[params].licenseText` driving the footer
  notice, and `[outputs]` widened to `home = ["HTML", "JSON"]`,
  `page = ["HTML", "JSON"]`, and `section = ["HTML", "JSON"]`. The
  `exampleSite/archetypes/default.md` archetype now emits empty `summary`
  and `categories` arrays, and the `exampleSite/archetypes/infobox-demo.md`
  archetype produces a per-shortcode demo scaffold that downstream sites
  call with `hugo new --kind infobox-demo articles/<slug>-demo.md`. Thirty
  per-shortcode demo pages land at
  `exampleSite/content/articles/{slug}-demo.md`, one for every named
  shortcode in the `docs/RESEARCH.md` §7 coverage contract (settlement,
  person, film, company, software, football-biography, station,
  historic-site, television, military-person, school, video-game,
  university, military-unit, basketball-biography, baseball-biography,
  military-conflict, football-club, ice-hockey-biography,
  tennis-tournament-event, organization, award, television-episode,
  church, television-season, political-party, protected-area, election,
  country, album); each demo uses paired-form shortcode invocation per
  Phase 8, exercises 5–12 representative parameters, and runs original
  prose invented for the demo (no Wikipedia verbatim content, per Phase 14
  licensing boundary). Two article fixtures join them:
  `long-article-with-toc.md` with 6 h2 sections plus one inline person
  infobox — the ToC scroll-spy, sticky header, and sidebar persistence
  target — and `short-article.md` with no headings for the empty-state
  ToC path. The Phase 8 smoke fixture `phase8-smoke-test.md` is kept as a
  cross-template regression sentinel. The Phase 4 `article-with-infobox.md`
  stub is retired (its content is folded into the per-template demo
  pages). `npm run build` exits 0 producing 30 rendered demo HTMLs each
  carrying `data-infobox-type="<slug>"`. See
  `.plans/first-plan/09-example-site.md` and
  `.plans/first-plan/14-licensing-and-scope-notes.md` §3.

- Phase 7 page skeleton & partials (per `.plans/first-plan/07-page-skeleton-partials.md`):
  `layouts/_default/baseof.html` composes the full page region graph — `<head>`
  with charset/viewport/title/description/canonical, Hugo Pipes wiring for the
  CSS bundle (`css.Sass` Dart Sass transpiler + `resources.Minify` +
  `resources.Fingerprint "sha256"` — corrected from the Phase 6 task's stale
  `resources.ToCSS` namespace, which doesn't exist in Hugo 0.163.3; `css.Sass`
  is the namespace-aliased `toCSS`) and JS bundle (`js.Build` esbuild +
  minify + fingerprint), and the body region tree of `header.site-header` +
  `main.page-grid` (sidebar + main + toc-panel) + `footer.site-footer`, all
  wired through partials; `data-theme="auto"` on `<html>` so the Phase 5
  `themes/auto.scss` `prefers-color-scheme` media query fires on first paint
  before `theme-toggle.ts` upgrades to a stored user choice. `_default/single.html`
  fills `main` with `article-header` + `article-body` + `categories-footer`;
  `_default/list.html` emits a section-list of `.Pages`. Three new wrapper
  partials (`header/site-header.html`, `sidebar/sidebar.html`,
  `article/byline.html` stub) plus the 11 spec partials — `header/{logo,
  search-box, personal-tools}.html` (sidebar `.main-menu-item.is-active`
  highlight from `IsMenuCurrent`/`HasMenuCurrent`), `sidebar/main-menu.html`
  (iterates `hugo.toml`'s `[menus.main]` so downstream sites can customise nav
  without editing templates), `article/{article-header, article-body,
  categories-footer}.html`, `footer/site-footer.html` (license text via
  `.Site.Params.licenseText` with i18n + default fallback per Phase 7 §3), and
  `infobox/header.html` populated so Phase 8 can compose the title-row into
  the rest of `base.html` without stubbing it. CSS bundle is 28.7 KB, JS bundle
  is 7.5 KB, both with SRI (`integrity` + `crossorigin="anonymous"`); JS emits
  as `<script type="module" defer>`. `npm run build` exits 0 producing 16
  public/ files (5 HTML pages + 1 CSS bundle + 1 JS bundle + 1 JSON index +
  3 XML feeds + a `.gitkeep` + 4 section/taxonomy HTMLs). Worst-offender file
  is `baseof.html` at 57 LOC (well under the 500-line ceiling);
  `grep -r 'mw\.' layouts/` returns 0 matches. The `theme.toml` TOML warning
  about `\'` in `Wikipedia's` predates this phase; left for Phase 12's docs
  sweep. See `.plans/first-plan/07-page-skeleton-partials.md`,
  `.plans/first-plan/14-licensing-and-scope-notes.md`, and
  `docs/ARCHITECTURE.md` §2/§3.

### Changed
- Phase 11 Cursor rules audit (per `.plans/first-plan/11-cursor-rules-plan.md`): the
  three rule files affected by Phase 8's `layouts/partials/` → `layouts/_partials/` and
  `layouts/shortcodes/` → `layouts/_shortcodes/` rename are now consistent — `10-hugo-templates.mdc`
  was still referencing the old `layouts/partials/` directory and has been updated to
  `layouts/_partials/` with the v0.146.0 rename note inline; `40-shortcodes.mdc` already
  carried the rename note from Phase 8 and is unchanged. `20-styles.mdc` was still using
  the deprecated `@use`/`@import` pattern and is now `@use`/`@forward` to match Dart
  Sass's modern module system. `50-testing.mdc` was generalised to "system-installed
  browsers" without naming one — it is now locked to **Chromium only** as the hard
  Phase 10 decision: `launchOptions.executablePath` → `/usr/bin/chromium`, no Firefox,
  no WebKit, no `toHaveScreenshot()` in the main `test:e2e` script. All 8 rule files
  remain under the Phase 11 word budgets (`00-core.mdc` 157/200, others ≤ 232/300).
  See `.plans/first-plan/11-cursor-rules-plan.md`.
- Theme toggle markup (`layouts/_partials/header/personal-tools.html`):
  replace the single hidden `<button class="theme-toggle">` placeholder from
  Phase 7 with a segmented three-button group
  (`<div class="theme-toggle">` containing three `<button class="theme-toggle__option" data-theme-value="…">`
  for light / dark / auto). The Phase 6 `assets/js/modules/theme-toggle.ts`
  already attaches click handlers to `[data-theme-value]` children and
  persists the choice under `vhskin:theme` — the new markup is what the JS
  expects. Header comment block updated to describe the segmented group
  and the auto-resolves-to-light/dark behaviour so future maintainers don't
  try to "simplify" it back to a single button. `npm run build` exits 0.
- Sidebar main-menu markup (`layouts/_partials/sidebar/main-menu.html`):
  upgrade from the flat `<a class="main-menu-item">` list to the
  portlet-list pattern the Phase 5 `assets/css/components/sidebar.scss`
  and Phase 6 `assets/js/modules/sidebar-toggle.ts` were designed against
  — a single `.sidebar-list__group` ("Navigation") with a
  `.sidebar-list__heading` toggler (chevron SVG), and a `.sidebar-list__items`
  `<ul>` of `.sidebar-list__link` anchors with
  `.sidebar-list__link--active` on the active item. This unlocks the
  collapse/expand behaviour shipped but previously inert (no matching
  markup to hook into) and matches the per-template Phase 8 contract.
- Cursor rule set complete (per `.plans/first-plan/11-cursor-rules-plan.md`):
  the three rule files written alongside Phase 11's audit but never
  committed — `30-scripts.mdc` (TypeScript / JS module conventions, with
  the one-behavior-per-file + no-`mw.*` rules Phase 6 enforced), and the two
  process rules `60-git-commit.mdc` (Conventional Commits scope,
  never-`git-add-.`, paired-CHANGELOG contract) and `70-changelog.mdc`
  (Keep-a-Changelog structure, same-commit entry, edit-in-place for
  reversals). These were tracked on disk since Phase 11 but never
  `git add`-ed; without them the rule file the commit-policy and
  changelog-policy guidance was supposed to enforce is itself missing
  from history. All 8 rule files are now tracked, all under the Phase 11
  word budgets.

### Fixed
- Phase 8 `layouts/partials/` → `layouts/_partials/` rename cleanup (per
  `.plans/first-plan/08-infobox-shortcode-spec.md`): the 25 stale files under
  `layouts/partials/{article,footer,header,infobox,special,sidebar}/` that
  remained on disk after Phase 8 moved their content to `layouts/_partials/`
  are removed — `git rm` was never run, so the directory lingered as dead
  tracked files even though Hugo never read from it. Also fix two comment
  references to the old path that slipped through: the composition note in
  `layouts/_default/baseof.html` now points at `layouts/_partials/<region>/`,
  and the call-site note in `layouts/_partials/infobox/header.html` now
  points at `layouts/_partials/infobox/base.html`. `npm run build` exits 0
  (45 pages) before and after the cleanup, confirming the dead files had no
  build-time effect — they were a stale-history hazard only, fixed now so
  Phase 13's DoD gate starts from a clean tree.

### Removed

### Skipped
- Phase 10 (Playwright E2E) skipped per user decision; the project ships as
  build-green without an E2E suite. `package.json`'s `test:e2e` script and
  the `@playwright/test` devDependency are removed; the `tests/e2e/`
  directory and its pre-Phase-10 spec prototypes are kept as scaffolding but
  are not wired into any `npm run` script. Verification rests on
  `npm run build` (canonical correctness gate) plus manual smoke through
  `npm run dev` against the example site — see `docs/ARCHITECTURE.md` §2
  "Verification (replaces the Phase 10 Playwright suite)" and the
  `README.md` Quickstart.

### Changed (third plan, phase 1 — pinned Vector source)
- Vendored a copy of `wikimedia/mediawiki-skins-Vector` at
  `vendor/mediawiki-vector/` pinned to **REL1_42** /
  `7c224883fd6ee166950aaa690381fbc769838071` (annotated tag
  `2bdf4bf`, committed 2025-06-12, "SECURITY: Insert portlet labels
  as text instead of HTML"). The upstream `.git/` directory was
  stripped; the rest of the tree is committed verbatim.
- `vendor/mediawiki-vector/PROVENANCE.md` records the pin point,
  rationale for full-tree vendoring (GPL-2.0-or-later §2(a)(b)
  compliance), and the procedure for refreshing the pin.
- `.gitignore`: dropped the obsolete `/reference/` scratch-clone
  carve-out (the prior `dd9a26f9` clone stays on disk but is no
  longer authoritative); replaced with a defensive
  `/vendor/mediawiki-vector/.git/` ignore so a future copy step
  cannot accidentally re-commit upstream history.
- `docs/RESEARCH.md` gains a "Pinned Vector source (third plan,
  phase 1)" sub-section with both tag SHAs and the pin-point date.

### Added (third plan, phase 2 — port map)
- `docs/PORT-MAP.md`: a 14-section, ~140-row table naming the
  specific upstream Vector file (or Wikipedia template page) that
  every file in this repo is derived from, or marking it
  Hugo-native. This is the work order for phases 3 through 7; no
  `TBD`s remain, and infobox rows are visibly flagged
  `CC-BY-SA-4.0` (or `dual` where Vector wrapper styling and
  Wikipedia template logic share a file), distinct from the GPL
  Vector rows.

### Changed (third plan, phase 3 — CSS layer)
- Every ported file under `assets/css/` (34 partials: 3 base + 6 layout
  + 19 components + 3 themes + `main.scss`) gains the per-file Vector
  GPL header per `docs/PORT-MAP-CONVENTIONS.md` §A, citing the exact
  upstream file at the pinned SHA `7c224883`. Files that combine
  Vector wrapper styling with Wikipedia-rendered infobox content
  (`infobox.scss` + 7 `infobox-pair-*` partials) get the dual
  license header per §B.
- `npm run build` still exits 0 producing 45 pages, confirming the
  header additions did not perturb the SCSS cascade.

### Changed (third plan, phase 4 — template layer)
- Every ported file under `layouts/_default/` (baseof, single) and
  `layouts/_partials/` (header × 5, sidebar × 3, article × 4, footer
  × 2, infobox × 6 base + 4 special) gains the per-file Vector GPL
  header per `docs/PORT-MAP-CONVENTIONS.md` §A, citing the exact
  upstream Mustache file at the pinned SHA `7c224883`.
- The infobox partial family (`base/`, `header`, `image-block`,
  `row`, `section`, `below`, `special/person-birth-death.html`,
  `special/settlement-coordinates.html`,
  `special/organization-founded-dissolved.html`,
  `special/software-release.html`) gets the dual-license header
  per §B — Vector-side wrapper styling + Wikipedia-content
  infobox logic, both notices retained.
- `npm run build` still exits 0 producing 45 pages.

### Changed (third plan, phase 5 — JS/TS layer)
- Every ported TypeScript module under `assets/js/` (1 main + 6
  modules + 2 Vector-derived utils) gains the per-file Vector GPL
  header per `docs/PORT-MAP-CONVENTIONS.md` §A, citing the exact
  upstream JS file at the pinned SHA `7c224883`. `assets/js/utils/
  storage.ts` is intentionally left headerless — it is a Hugo-
  native wrapper, with no upstream Vector counterpart per PORT-MAP
  §10.
- `static/js/theme-early.js` gains the Vector GPL header per §A.
- **Behavior preserved unchanged.** The pre-existing module bodies
  — in particular `assets/js/modules/sticky-header.ts`'s
  IntersectionObserver sentinel pattern, which predates this
  plan and matches Vector's `scrollObserver.js` shape per
  `docs/RESEARCH.md` §12.2 — are not touched.
- `npx tsc --noEmit` exits 0; `npm run build` produces 45 pages,
  0 errors.

### Changed (third plan, phase 6 — server-dependent exclusions)
- `docs/ARCHITECTURE.md` gains a new "Excluded MediaWiki features
  (third plan, phase 6)" section listing every Vector feature
  without a static equivalent (login / create-account /
  preferences, edit / history / talk tabs, VisualEditor,
  notifications, watchlist, live search API) with the visual
  treatment each receives in the port.
- A new "Search (phase 6 decision)" subsection documents the
  static-client-side-search decision: keep the Vector UI chrome
  verbatim, swap the data source from MediaWiki's
  `action=opensearch` to a build-time-generated
  `public/index.json` produced by Hugo's `home.json` output
  format. The choice preserves the CSS / class-name contract
  for `search-box.scss` while removing the runtime MediaWiki
  dependency.
- A new "Mustache key → Hugo data source mapping (third plan,
  phase 4)" section records the per-key translation table used
  by phase 4.
- `grep -r 'mw\.\|action=opensearch\|mediawiki\.org' assets/js/
  static/js/ layouts/` returns 0 matches — phase 5's header
  sweep left no MediaWiki-API leftovers in the port.

### Changed (third plan, phase 7a — Infobox topic shortcodes)
- Four `Infobox <topic>` shortcodes under `layouts/_shortcodes/`
  gain the dual-license header (`GPL-2.0-or-later` for the Vector
  wrapper styling, `CC BY-SA 4.0` for the Wikipedia-derived
  per-topic conditional logic) per `docs/PORT-MAP-CONVENTIONS.md`
  §B, plus inline `{{ with .Get "…" }}` / `$`-scoped `.Get`
  conditionals extracted from the upstream MediaWiki templates:
  - `award.html` — title fallback chain
    (`name` → `awardname` → `PAGENAMEBASE`); venue / location / site
    label and data precedence; `firstawarded`/`year`, `host`/`hosts`,
    `viewership`/`ratings`, `most_wins`/`most_awards` fallbacks;
    nested "Precedence" / "Television coverage" sections collapsed
    into flat rows.
  - `church.html` — group rows into History / Architecture /
    Specifications / Administration / Clergy sections, suppress
    each section when its fields are empty; religious order vs
    religious institute fallback; native name as `<nickname>`
    subtitle.
  - `election.html` — title fallback (`election_name` → `name` →
    `PAGENAME`); `party_label` defaulting to "Party"; render the
    first candidate group, second candidate group, and before/after
    election block as three labelled sections.
  - `organization.html` — founders vs founder, defunct vs dissolved,
    focus vs foci vs purpose, parent_organisation vs
    parent_organization, vat_id vs tax_id, coordinates vs coords,
    leaders 1..4 dynamic labelling, year-suffix `(YYYY)` on the
    budget / revenue / expenses / endowment / employees / members /
    students / volunteers rows.
- Inside `{{ with .Get "key" }}` blocks, nested `.Get "other_key"`
  calls reference `$` (the page context) rather than `.`, matching
  the convention the previous worker fixed in `country.html` /
  `settlement.html`.
- `hugo --quiet` in `exampleSite/` exits 0; build still produces
  45 pages with the new conditionals in place.

### Changed (third plan, phase 7b — Infobox topic shortcodes)
- Three `Infobox <topic>` shortcodes under `layouts/_shortcodes/`
  gain the dual-license header + extracted conditionals:
  - `school.html` — title fallback to page name; native / latin name
    rendered as `<nickname>` subtitle; established / founded / opened
    fallback chain with label switching to "Established" / "Founded" /
    "Opened"; founder(s) plural; type vs schooltype vs fundingtype
    cascading; enrolment vs enrollment, "(YYYY)" as-of suffix; age
    range falls back to lower–upper with "+" when upper missing;
    colors/colours, rival/rivals, accreditation/accreditations
    fallback pairs; multiple headship rows (principal, head,
    headmaster, chair, dean, rector, etc.).
  - `software.html` — title fallback (`title` → `name` →
    `PAGENAME`); original author / developer rows pluralised;
    "Status" derived from `discontinued` (`yes` → "Discontinued",
    else "Active") unless overridden; latest release / preview rows
    combine version + date; programming_language / operating_system
    underscore vs space variants; engines / engine, line / lines
    fallback; license + source_model combined row.
  - `station.html` — title fallback to page name; native name
    subtitle; location composed from address / borough / country
    joined with ", "; system uses `type` then `system`; owner /
    owned, line / lines, platforms / platform, code /
    station_code, grid_position / gridref, connections / other,
    bicycle / cyclepark, bus_routes / routes fallback pairs;
    passengers row appends `(year, ranked N)` when both pass_year
    and pass_rank supplied.
- `hugo --quiet` in `exampleSite/` exits 0.

### Changed (third plan, phase 7c — Infobox topic shortcodes)
- Four `Infobox <topic>` shortcodes under `layouts/_shortcodes/`
  gain the dual-license header + extracted conditionals:
  - `television.html` — title fallback; based_on / inspired_by
    label and data precedence; teleplay / screenplay by label
    switching on `teleplay`; presenter / host fallback; native
    name subtitle; seasons / episodes composed as a single pair;
    first_aired – last_aired composed as an "Original run" row;
    network / network_list fallback.
  - `television-episode.html` — series/season/episode "Episode
    placement" triplet row; teleplay / screenplay label switching;
    guests / guest fallback; airdate / production_code / runtime
    composed as a single "Aired / Code / Runtime" row; previous /
    next episode pair row.
  - `television-season.html` — title fallback (`name` →
    `series_name` → `PAGENAME`); series_name + season_number
    composed as "Series — Season N"; num_episodes / episode_count
    fallback; first_aired – last_aired composed as "Original run";
    prev_season / next_season pair row.
  - `university.html` — title fallback; native / latin name rows;
    motto / motto_eng combined row; established–closed "Active"
    date range; founder(s) plural; multiple personnel rows
    (officer, chair, chancellor, president, vice-chancellor,
    provost, rector, dean); students composed with undergrad /
    postgrad / doctoral breakdown; city / state / country
    composed into one "Location" row; colors / colours fallback.
- `hugo --quiet` in `exampleSite/` exits 0.

### Changed (third plan, phase 7d — Infobox topic shortcodes)
- Four `Infobox <topic>` shortcodes under `layouts/_shortcodes/`
  gain the dual-license header + extracted conditionals:
  - `football-club.html` — title fallback chain
    (`title` → `clubname` → `name` → `PAGENAMEBASE`); ground /
    stadium label switching; owntitle / chrtitle / mgrtitle
    override defaults; league + season + position triplet;
    nickname(s) plural.
  - `historic-site.html` — title fallback; native name subtitle;
    location composed from location / nearest_city / region /
    state / country; built / year_built fallback; NRHP_ref /
    refnum fallback.
  - `military-conflict.html` — date_start–date_end pair rendered
    as "Date" row, falls back to single `date`; place +
    coordinates composed; result / status fallback;
    Combatants / Commanders / Strength / Casualties sections
    each suppressed when their rows are empty.
  - `military-unit.html` — title fallback; Active/Founded row
    label switching based on start_date/end_date presence;
    country / countries fallback; garrison_label override;
    colours / colors label switching; equipment_label /
    battles_label / battle_honours_label overrides;
    nickname(s) / motto(es) / mascot(s) pluralisation.
- `hugo --quiet` in `exampleSite/` exits 0.

### Changed (third plan, phase 7e — Infobox topic shortcodes)
- Four `Infobox <topic>` shortcodes under `layouts/_shortcodes/`
  gain the dual-license header + extracted conditionals:
  - `political-party.html` — title fallback; native name
    subtitle; abbreviation / abbr fallback; chairperson /
    chairman / chairwoman fallback; spokesperson / spokesman
    fallback; founder(s) plural; seats1 / seats2 rows with
    optional custom titles.
  - `protected-area.html` — title fallback; alt_name subtitle;
    nearest_city / nearest_town fallback with label switching;
    area fallback chain (area_km2 / area_sqmi / area_acre /
    area_ha / area); elevation / elevation_avg label switching;
    elevation_min / elevation_max rows; designation / authorized
    / created / established / designated rows.
  - `tennis-tournament-event.html` — title fallback; tour ·
    type · category composed triplet; venue composed from
    location / place / venue; start_date–end_date composed as
    "Dates" row; Final section (champion(s) / runner(s)-up /
    score); Draw section (draw size / seeds / players / main
    draw); prize_money / attendance.
  - `video-game.html` — title fallback; cover_art / image
    fallback; released / release / initial_release_date
    fallback chain; pluralised developer(s) / publisher(s) /
    director(s) / producer(s) / designer(s) / programmer(s) /
    artist(s) / writer(s) / composer(s); platform / platforms
    fallback; mode(s) pluralisation.
- `hugo --quiet` in `exampleSite/` exits 0.

### Changed (third plan, phase 8 — attribution sweep)
- `LICENSE` file at the repo root is now the canonical FSF-published
  GPL-2.0 text verbatim, 327 lines. The previous file wrapped the
  license text in a Hugo `{{/* */}}` template comment by accident,
  which would have caused license-aware tooling to misidentify the
  file. The preamble block has been removed; the plain text license
  stands as the authoritative SPDX-License-Identifier source.
- New `NOTICE.md` at the repo root documents the three-tier license
  model: Tier 1 (GPL-2.0-or-later for Vector skin chrome, pinned to
  SHA `7c224883`), Tier 2 (CC BY-SA 4.0 for Wikipedia infobox
  conditional logic), Tier 3 (original Hugo-native build / content /
  fixtures under the primary `LICENSE`). Includes the Wikimedia
  Trademark Policy compliance statement and a non-affiliation
  disclaimer.
- Attribution audit (`git grep -L "GPL-2.0-or-later\|CC BY-SA 4.0"`)
  ran across the repo, excluding `vendor/`, `public/`,
  `node_modules/`, build configs, and demo content. The remaining
  matches are all expected per `docs/PORT-MAP-CONVENTIONS.md` §C:
  the Hugo-native primitive shortcodes under
  `layouts/_shortcodes/infobox/` (no upstream attribution required),
  the example site content under `exampleSite/content/` (Tier 3,
  original demo material), `.gitkeep` placeholders, and test
  fixtures. No missing-header gaps remain.

### Added (third plan, phase 9 — verification)
- Six Playwright E2E specs in `tests/e2e/specs/`:
  - `computed-style.spec.ts` — cross-breakpoint × cross-theme matrix
    (4 viewports × 2 themes) asserting `getComputedStyle` parity
    against Vector tokens for the header, sidebar, ToC, article
    body, infobox, and the root CSS custom-property surface.
  - `interactions.sticky-header.spec.ts` — condensed bar appears
    on scroll past threshold and disappears at top, mirroring
    Vector's IntersectionObserver pattern.
  - `interactions.sidebar.spec.ts` — toggle button visibility,
    class flip, and localStorage persistence across reload.
  - `interactions.toc.spec.ts` — ToC visibility breakpoint
    (≥1024px) and scroll-spy active-state behaviour.
  - `interactions.tabs.spec.ts` — tablist presence and
    active-state swap (skips if the fixture has no tabs).
  - `interactions.theme-toggle.spec.ts` — toggle visibility,
    `data-theme` flip, persistence, and auto-mode preference
    parity.
  All specs follow `.cursor/rules/50-testing.mdc`: Chromium only
  via `/usr/bin/chromium`, Playwright `webServer` config starts
  Hugo automatically, fixtures are `exampleSite/content/articles/`
  only.
- Three demo articles built locally and verified: `person-demo`,
  `settlement-demo`, `organization-demo`. Each renders the infobox
  table; `hugo --quiet` exits 0.
- `docs/RESEARCH.md` gains §15 "Source-line traceability spot-check
  (third plan, phase 9)" — 10 sampled ported files (3 SCSS, 3 TS,
  2 templates, 2 shortcodes) traced to specific lines in
  `vendor/mediawiki-vector/` at the pinned SHA. The check is what
  distinguishes this plan from the prior "inspired by"
  reimplementation.
- `docs/UI-AUDIT.md` gains §5 "Phase 9 rendered-DOM diff audit".
  Live DOM diff is documented as not-applicable to a static-only
  project (no `mw-*` namespace, no `data-mw-*` attributes, no
  MediaWiki runtime). The static-only DOM diff — per-template
  structural presence, selector-class parity, token coverage,
  cross-breakpoint computed-style parity via the Playwright spec
  above — replaces it. Intentional, documented deviations are
  enumerated per surface.

### Fixed (third plan, phase 10 — final gate)
- Three Hugo template syntax bugs surfaced by `npm run dev`:
  `default A B C` is not valid — Hugo's `default` is a two-arg
  function. The three shortcodes that used the three-way form
  (`school.html`, `video-game.html`, `political-party.html`) have
  been rewritten to chain nested `default` calls. All three demo
  articles now build and serve (HTTP 200) with their infobox
  rendered.

### Done — full literal Vector 2022 port (third plan complete)
- Phase 0: relicense to GPL-2.0-or-later to match upstream at the
  pinned SHA `7c224883fd6ee166950aaa690381fbc769838071` (REL1_42,
  2025-06-12). Methodology: literal 1:1 port.
- Phase 1: vendor `wikimedia/mediawiki-skins-Vector` at the pinned
  SHA under `vendor/mediawiki-vector/` with `PROVENANCE.md`.
- Phase 2: per-file upstream provenance table at
  `docs/PORT-MAP.md`, every file resolved.
- Phase 3: LESS → SCSS literal port with per-file GPL headers.
- Phase 4: Mustache → Go templates literal port with per-file GPL
  headers.
- Phase 5: ES6 → TypeScript literal port with per-file GPL headers.
- Phase 6: MediaWiki-feature exclusions + search decision documented.
- Phase 7: 30 `Infobox <topic>` shortcodes under
  `layouts/_shortcodes/<topic>.html`, each with the dual-license
  header (GPL-2.0-or-later for the wrapper, CC BY-SA 4.0 for the
  content logic), a "Conditionals ported from Template:Infobox
  <topic>" bullet list, and Go template logic that maps parameters
  to fields for `infobox/base.html`. Per-topic provenance recorded
  in `docs/SHORTCODES.md` §11.
- Phase 8: `LICENSE` restored to the canonical FSF GPL-2.0 text
  (no longer wrapped in a Hugo template comment); `NOTICE.md`
  documents the three-tier license model with the Wikimedia
  Trademark Policy compliance statement and non-affiliation
  disclaimer.
- Phase 9: six Playwright E2E specs (`computed-style.spec.ts` +
  five interaction specs) covering the four-viewport × two-theme
  computed-style matrix and the major Vector interactions; 10-file
  source-line traceability spot-check appended to
  `docs/RESEARCH.md` §15; static-only DOM diff replacing the live
  MediaWiki DOM diff (which would conflate intentional static-site
  omissions with port regressions) appended to `docs/UI-AUDIT.md`
  §5.
- Phase 10: three-way `default` chaining bug fixed in
  `school.html`, `video-game.html`, `political-party.html`;
  `hugo --quiet` exits 0 across all 33 demo articles;
  `npm install && npm run dev` smoke-tested — root and four
  per-shortcode demo URLs return HTTP 200 with their infobox root
  element present.

### Fixed (post-phase-10 — sticky header overlap)
- `assets/js/modules/sticky-header.ts` no longer makes the condensed
  sticky header visible at the top of every page. Root cause: the module
  appended a 1px sentinel at `top: 0` *inside* `.page-header`, but
  `.page-header` itself is `position: sticky; top: 0` — so the sentinel
  was pinned to the viewport top and the IntersectionObserver reported
  `isIntersecting: true` permanently, revealing the sticky bar on top
  of the primary header. Fix: observe `.page-header` directly with no
  sentinel. Any non-zero intersection means the primary bar is still
  in view and the sticky should stay hidden. Also dropped the inline
  `primary.style.position = 'relative'` override that was silently
  downgrading the primary header's own `position: sticky` to
  `position: relative`. New `tests/e2e/specs/sticky-header-overlap.spec.ts`
  pins the four observable behaviours (hidden at top, visible after
  scroll, hidden again on return to top, primary header still
  `position: sticky` after the JS module has run) — these would have
  caught the overlap on the first scroll, where the existing
  `interactions.sticky-header.spec.ts` targeted a selector class
  (`.sticky-header-condensed` / `[data-sticky-header-condensed]`) that
  the rendered HTML never actually carries.

### Fixed (post-phase-10 — search suggestions visible on first paint)
- The `.search-box__suggestions` div flashed visible (an empty 10-px-tall
  band under the search input) on every page load and only disappeared
  after the user typed and cleared the input. Root cause:
  `layouts/_partials/header/search-box.html` emitted the suggestions
  div as a **sibling** of the `<form>`, but
  `assets/js/modules/search.ts`'s `buildResultsContainer` looked for it
  with `box.querySelector('.search-box__suggestions')` (inside the
  form). That returned `null`, so the module created a *second*
  `<div class="search-box__suggestions">` without the `hidden`
  attribute, appended it inside the form, and left the original
  `hidden` sibling behind. The newly-appended copy was visible from
  page load until the first `input` event finally called
  `closeSuggestions()`. Fix: emit the suggestions div as the last
  child of the `<form>` in the partial so the JS finds it directly
  (and the existing `hidden` attribute survives). Also added a
  defensive `.search-box__suggestions[hidden] { display: none }` rule
  in `assets/css/components/search-box.scss` mirroring the same
  pattern used for `.tabs__panel[hidden]` — author CSS now matches
  the intent regardless of author-vs-UA cascade ordering. After the
  fix `hugo --quiet` still exits 0 and `exampleSite/public/articles/*/
  index.html` carries exactly **one** `#search-box-suggestions` node,
  nested inside `<form class="search-box">` and bearing `hidden`.

### Added (responsive audit — prefers-reduced-motion guard)
- Global `@media (prefers-reduced-motion: reduce)` block appended to
  `assets/css/base/_reset.scss` disabling animation and transition on
  `*, *::before, *::after` and forcing `scroll-behavior: auto`, so the
  transition-heavy chrome (sidebar collapse, ToC dropdown, sticky-header)
  respects the user's OS-level motion preference. Resolves F9 from the
  responsive audit (`docs/UI-AUDIT.md` follow-up); commit 1 of 6 in the
  plan.

### Added (responsive audit — search overlay panel at <500px)
- `assets/js/modules/search.ts` lazily builds a `.search-box__overlay`
  panel on first magnifier click at `(max-width: 499px)`; the visible
  magnifier `.search-box__submit` now calls `event.preventDefault()` on
  mobile and opens the overlay instead of submitting an empty form.
  Escape closes the overlay, clicking outside closes it, Enter inside
  the overlay's input navigates to `/search/?q=<query>`. Companion CSS
  in `assets/css/components/search-box.scss` positions the overlay
  fixed under the header with a scrim and close button; the existing
  magnifier-only rules in `assets/css/layout/header.scss` are unchanged
  — the comment block there now reflects the wired overlay contract.
  Resolves F2 from the responsive audit; commit 3 of 6 in the plan.

### Added (responsive audit — titlebar ToC close on outside-click and Escape)
- New `assets/js/modules/titlebar-toc.ts` module (~25 lines, one behavior
  per `00-core.mdc`) that closes the page-titlebar ToC dropdown on
  outside-click or Escape keydown. The checkbox-driven panel rendered by
  `layouts/_partials/article/page-titlebar.html` and styled by
  `assets/css/components/page-titlebar.scss` opens via the pure-CSS
  `:checked ~` sibling selector, but had no close affordance: at
  viewport widths ≤1024px (where the right-column `.toc-panel` is hidden
  and the dropdown is the sole ToC navigation surface) the panel stayed
  open after the user navigated, intercepting the next click. The new
  module's `init()` listens on `document` for clicks outside
  `.page-titlebar-toc-landmark` and for `Escape`, unchecking
  `#page-titlebar-toc-checkbox` when it is currently checked. Wired into
  `assets/js/main.ts` as the sixth `init()` call alongside the existing
  straight-line composition. Resolves F10; commit 6 of 6 in the plan.

### Added (responsive audit — off-canvas sidebar drawer at mobile + sticky-top offset fix)
- `assets/css/layout/sidebar.scss`: at `@media (max-width: 720px)` the
  sidebar aside becomes `position: fixed; inset: var(--header-height) 0
  0 0; transform: translateX(-100%)` and slides in via
  `:root[data-sidebar-mobile="open"] .sidebar { transform: translateX(0); }`.
  The header's `[data-sidebar-toggle]` button now drives this state on
  mobile via a new `matchMedia('(max-width: 720px)')` listener in
  `assets/js/modules/sidebar-toggle.ts` — the existing desktop outer-
  collapse path stays intact. The `.sidebar` sticky-top now factors in
  `--sticky-header-height` (`calc(var(--header-height) +
  var(--sticky-header-height) + var(--space-md))`) so the column top
  lands below the sticky-header band on long pages; the same one-line
  fix applies to `assets/css/layout/toc-panel.scss` for the right
  column. Resolves F1 + F5 from the responsive audit
  (`docs/UI-AUDIT.md` §6 follow-up); commit 2 of 6 in the plan.

### Added (responsive audit — desktop-wide tier at ≥1200px)
- New `--content-padding-x` token (base value `1rem`, matching the
  previous inline `--space-md`) added to `assets/css/base/_tokens.scss`
  and a `@media (min-width: 1200px) :root { --sidebar-width: 248px;
  --toc-width: 220px; --content-padding-x: 3.25rem; }` block appended
  to the same file. `assets/css/layout/page-grid.scss` line 37 now
  uses `padding: 0 var(--content-padding-x)` instead of the inline
  `var(--space-md)` so the desktop-wide media query is the single
  source of truth for the wider padding value. No collision with the
  tablet / mobile rules: the 1025–1199px gap has neither the tablet
  collapse nor the desktop-wide widening, matching Vector's tier
  boundaries. Resolves F6 from the responsive audit
  (`docs/UI-AUDIT.md` §6 follow-up); commit 4 of 6 in the plan.

### Documentation
- Appended `## 8. Responsive audit — implementation summary
  (2026-07-11)` to `docs/UI-AUDIT.md`. Section records the
  post-implementation state of the Vector 2022 responsive audit
  described in the parent plan at
  `uploads/vector_2022_responsive_audit__26_fix_plan_988b5082.plan-L1-L211-0.md`,
  with a per-finding (F1–F10) summary that names the file paths
  and line refs changed, the upstream Vector LESS reference, and
  the commit SHA where one exists. Commit SHA mapping
  (verified via `git log`): F9 → `3ca7130`, F2 → `10b0f05`,
  F3 / F4 / F7 / F8 → `9ba359e`, F10 → `db68c1d`. F1, F5, and F6
  were still in-flight from a worker at the time of writing; the
  §8.1 entries for those three cite file paths and intent and
  defer the SHA to `git log` so no unverified SHA is recorded.
  §8.3 quotes the plan's "Scope decision: deferred" list
  verbatim, tagged as five future-plan candidates.

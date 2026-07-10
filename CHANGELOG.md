# Changelog

All notable changes to this project are documented here, in Keep-a-Changelog style.
Every commit that changes user-facing or developer-facing behavior lands a matching
entry in the same commit — see `.cursor/rules/70-changelog.mdc`.

## [Unreleased]

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

### Fixed

### Removed

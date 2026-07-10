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

### Changed

### Fixed

### Removed

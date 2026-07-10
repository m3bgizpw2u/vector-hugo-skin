# Architecture

This document captures the architecture decisions locked in during the planning phase,
so anyone reading the finished repo (not the planning folder) can understand *why* the
theme is shaped the way it is. It is intentionally short — long-form rationale lives
in `docs/RESEARCH.md` and per-component docs; this file pins the constraints and module
boundaries everything else assumes.

## 1. Hard constraints

These five rules are non-negotiable and enforced by `.cursor/rules/00-core.mdc`. Every
later design choice — file layout, partial split decisions, build pipeline — must
respect them. The escape valve at the bottom is part of the contract: the rules can
be revisited, but only by flagging it, never by silently breaking them.

1. **File size ceiling: 500–1000 LOC.** No source file (TS, SCSS, or Go-template)
   may grow past one thousand lines, and any file approaching the ceiling must be
   split proactively rather than after the fact. The 500-line end of the range is a
   "start thinking about splitting" signal; the 1000-line end is a hard wall. The
   reason is operational, not aesthetic: smaller files mean smaller diffs, faster
   review, and a hard cap on how much damage any one regression can do. With this
   theme's expected per-component size (one behavior, one component, one region),
   most files should land well under 200 lines.

2. **One language per file.** Templates (`.html` Go templates) only reference assets
   — they never contain inline `<style>` or `<script>`. The reason is build-pipeline
   purity: anything inline bypasses Sass/TS compilation, fingerprinting, and source-map
   generation, and creates a maintenance tax when one of those inline blocks needs to
   grow. Every byte of CSS and JS belongs in `assets/`, gets processed by Hugo's
   pipes, and is loaded as a fingerprinted URL.

3. **One concern per file.** A SCSS file styles exactly one component. A TS module
   implements exactly one behavior. A partial renders exactly one page region. A
   shortcode (or shortcode family) does exactly one job. The reason is locality: a
   developer working on the table of contents should be able to open
   `assets/css/components/toc.scss` and `assets/js/modules/toc.ts` and find every
   relevant line in those two files — no scrolling, no grepping for which other
   file also styles `.toc-list`.

4. **Folder-per-shortcode.** Every shortcode lives in its own folder under
   `layouts/shortcodes/{name}/`, even when that folder currently contains a single
   file. The reason is that shortcodes grow — an `infobox` wrapper eventually wants
   separate `infobox-row`, `infobox-image`, and `infobox-section` files, and a
   named `person` wrapper eventually wants `person-birth-death.html` /
   `person-career-sections.html` siblings. Starting with the folder means growing
   the shortcode is purely additive; starting with a flat file means a directory
   restructure is required at exactly the moment the shortcode is shipping and
   under change pressure.

5. **No runtime Node dependency.** Everything in `node_modules/` is dev-time tooling
   (build, lint, test). The built `public/` output must be servable as plain static
   files with zero JS runtime dependencies beyond the browser's native APIs. The
   reason is that this theme is a *theme*, not a *framework* — the user installs
   it into a Hugo site and expects to deploy `public/` to any static host without
   a Node server, a Lambda, or a CDN edge worker. Adding a runtime dep would break
   that contract.

**Escape valve.** If a task would require violating any of the above, the executor
stops and surfaces the conflict to the user — the rule gets revisited, not silently
broken.

## 2. Module boundaries

The directory tree in `04-repo-directory-structure.md` is the literal scaffold; this
section explains what each grouping is *for* and what does not belong in it.

### CSS (`assets/css/`)

Four sub-folders, each with a single concern:

- `base/` — design tokens (color, spacing, typography) as CSS custom properties,
  plus the reset/normalize. No component styles. If a new file in `base/` wants
  to style a button or a panel, it has wandered out of its lane and belongs in
  `components/` instead.
- `components/` — one file per UI component (`sidebar.scss`, `toc.scss`,
  `sticky-header.scss`, `tabs.scss`, `search-box.scss`, `infobox.scss`). A
  component file only styles its own DOM subtree and never reaches into the
  page-level grid.
- `layout/` — the page-level skeleton: grid, header region, footer region. The
  structural bones that the components hang off of, not the components themselves.
- `themes/` — light and dark variable overrides only. No selectors that aren't
  `[data-theme="..."]`. Theme switching is achieved by redefining CSS custom
  properties; the rule bodies stay in their component files.

`assets/css/main.scss` exists only to `@use` the rest in cascade order
(base → layout → components → themes). It never grows rules of its own — when it
tries to, that is a sign a new component file is missing.

### JavaScript (`assets/js/`)

Three sub-folders with strict import boundaries:

- `utils/` — small, pure, dependency-free helpers (`dom.ts` for element queries,
  `debounce.ts` for throttling, `storage.ts` for `localStorage` access). No
  business logic, no DOM event listeners, no side effects. Every other module may
  import from `utils/`.
- `modules/` — one file per behavior. Each module owns its own DOM queries and
  listeners, exposes an `init()`-style entry point, and is invoked from
  `main.ts`. Modules do not import each other — if two behaviors need to
  coordinate, that coordination is added in `main.ts`, not by cross-importing.
- `main.ts` — the only file that imports more than one module. Wires them up,
  nothing else. Roughly a straight-line list of `init()` calls. When `main.ts`
  starts growing conditional wiring, that is a sign a new module is needed.

Six behavior modules exist in v1: `sidebar-toggle`, `toc`, `sticky-header`,
`tabs`, `theme-toggle`, `search`. New behaviors get a new file in `modules/`,
not a branch in an existing one.

### Templates (`layouts/`)

- `partials/{region}/` — one folder per page region (`header/`, `sidebar/`,
  `article/`, `footer/`), each containing small, composable partials. The
  `header/` folder holds `logo.html`, `search-box.html`, `personal-tools.html`;
  the `sidebar/` folder holds `main-menu.html`, `toc-panel.html`. A region folder
  is not a single mega-partial — that would violate the one-concern rule, since
  a region usually serves several distinct sub-widgets.
- `partials/infobox/` — the *rendering* primitives (not invocable shortcodes)
  shared by every named shortcode: `base.html`, `header.html`, `image-block.html`,
  `row.html`, `section.html`, `below.html`, plus a `special/` subfolder for
  pair/section templates reused across many named shortcodes
  (`person-birth-death.html`, `software-release.html`, etc.). Partial lookup is
  type-driven: the named shortcode sets `data-infobox-type` and the partial
  looks itself up by that key.
- `shortcodes/{name}/` — per the folder-per-shortcode rule. `infobox/`
  contains the inner primitive shortcodes (`infobox-row`, `infobox-image`,
  `infobox-section`, `infobox-below`, `infobox-field`, `infobox-pair-*`).
  The thirty named family shortcodes (`person/`, `company/`, `software/`,
  `settlement/`, `film/`, ...) each get their own folder whose contents
  compose the inner primitives into a topic-specific wrapper.

### Tests and example site

- `exampleSite/` — a real Hugo site consuming the theme. Doubles as the
  Playwright test target. Theme templates are never tested in isolation from a
  rendered site; the contract is what the user sees, not the internal partial
  graph.
- `tests/e2e/` — Playwright config plus one spec file per feature area
  (`sidebar.spec.ts`, `toc.spec.ts`, `infobox.spec.ts`, `theme-toggle.spec.ts`,
  `search.spec.ts`).

## 3. Build invocation

This workspace *is* the theme root, not a parent of it. `theme.toml` sits at the
top of the repo and `exampleSite/hugo.toml` declares `theme = "vector-hugo-skin"`
with `themesDir = "../"` so Hugo resolves the theme at `<workspace>/theme.toml`.

The consequence: `npm run build` (and `hugo` invocations generally) must run
with `--source exampleSite` so the source directory and the relative `themesDir`
resolve correctly. The workspace is not a Hugo site itself; treating it as one
would make Hugo fail to find a `hugo.toml`.

Phase 5+ may revisit this — moving to a sibling-dir layout or Hugo Modules would
change the build invocation. Until then, `--source exampleSite` is the canonical
way to build, and any new npm script that shells out to Hugo must include it.

## 4. Pinned toolchain versions

| Tool | Version | Why pinned |
|------|---------|------------|
| Hugo | 0.163.3+extended | Required for the Dart Sass asset pipeline. LibSass was deprecated; extended Hugo is the only configuration that gets the modern Sass compiler. |
| Node.js | 26.4.0 | LTS; needed for dev tooling (TypeScript, ESLint, Stylelint, Playwright). Not a runtime dep of the built site. |
| npm | 11.18.0 | Ships with Node 26.4.0; lockfile is `package-lock.json`. |
| Git | 2.55.0 | Standard; required identity configured for the auto-commit rule. |

These may need to be relaxed if the workspace-as-theme arrangement evolves
(e.g. moving to Hugo Modules, or supporting a build that runs against a sibling
theme directory). The pinned versions are recorded so a contributor hitting a
"works on my machine" error has a baseline to check against.

## 5. Stack rationale

The build is SCSS, vanilla TypeScript, and CSS custom properties — none of
which is an arbitrary choice, all of which is defensible against alternatives.

**SCSS over LESS.** Vector itself uses LESS, but this project *reimplements*
Vector rather than transpiling it, and Hugo's current recommended asset pipeline
is Dart Sass (LibSass was deprecated and is being removed). SCSS is the
natural fit for a modern Hugo theme; matching Vector's tooling would be cargo-
culting, not compatibility.

**Vanilla TypeScript over a framework (no React, Vue, or jQuery).** Vector's
JS depends on MediaWiki's `mw.*` global API, which doesn't exist outside a
MediaWiki install — so none of it can be transpiled 1:1 regardless of framework
choice. The behaviors we need (sidebar collapse, scroll-spy ToC, tab switch,
theme toggle, client-side search) are all small DOM-level interactions. A
runtime framework would add kilobytes and a hydration step for what should be a
fast static site. Vector itself moved away from jQuery in newer versions;
following the same path keeps the bundle small and the dependency surface flat.

**CSS custom properties over SCSS variables.** Theme values (color, spacing,
type scale) live as CSS custom properties in `assets/css/base/_tokens.scss`,
not as Sass variables. The reason is runtime themability: a `[data-theme="dark"]`
selector can redefine the same custom property at the document level and the
cascade does the rest, with no Sass recompilation. SCSS variables are
compile-time only and would force a second build per theme.

**Build-time JSON search index over Lunr/Fuse for v1.** The `search` module
reads a pre-built `/index.json` (generated by Hugo at build time from the site
content) and does its own simple substring matching client-side. This is fast
and dependency-free for small sites. The known scaling tradeoff: as the
content corpus grows past roughly 10k pages, substring matching starts to feel
sluggish and an inverted index (Lunr, Fuse, MiniSearch) becomes worth the
runtime weight. The upgrade path is documented but deferred — for the v1
shortcode-family scope and the typical personal-wiki or documentation-site use
case, the build-time JSON approach is the right floor.

---

*Phase 3 captures the constraints and module boundaries. Phase 12 will expand
this document with full Hugo API notes, scaling tradeoffs for the search
index, and the deeper rationale that lives in `docs/RESEARCH.md`.*

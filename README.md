# vector-hugo-skin

Static Hugo port of Wikipedia's Vector 2022 skin, plus a MediaWiki-style
Infobox shortcode family. **No PHP, no MediaWiki server, no database.**

> **Derivative port of `wikimedia/mediawiki-skins-Vector`** — pinned in this
> repo at SHA `7c224883fd6ee166950aaa690381fbc769838071` (REL1_42,
> 2025-06-12) under `vendor/mediawiki-vector/`. This theme is a literal,
> line-for-line translation of Vector's LESS, Mustache, and ES6 sources into
> SCSS, Go templates, and TypeScript, respectively. Licensed under
> **GPL-2.0-or-later** (see [`LICENSE`](LICENSE)). **Not affiliated with,
> endorsed by, or sponsored by the Wikimedia Foundation.** MediaWiki and
> Vector are trademarks of the Wikimedia Foundation; they are referenced
> here only for compatibility, never for redistribution of any
> trademark-bearing asset. See `docs/PORT-MAP.md` for the per-file
> upstream provenance and `vendor/mediawiki-vector/PROVENANCE.md` for
> the pin-point record.

## Quickstart

Five commands to a running theme + example site:

```sh
git clone <repo-url>
cd vector-hugo-skin
npm ci                            # uses the checked-in package-lock.json — first-time
                                  # contributors may use `npm install` instead if
                                  # they haven't cloned with the lockfile
# No git submodule, no Hugo Modules init — the theme ships in-tree.
npm run dev                       # → http://localhost:1313
```

`npm run dev` shells out to
`hugo server --source exampleSite --themesDir ../.. --theme vector-hugo-skin --port 1313`.
The workspace-as-theme layout means the theme root sits at the repository root, and
`exampleSite/hugo.toml` declares `themesDir = "../.."` to point at it — see
`docs/ARCHITECTURE.md` §3. To produce a deployable `public/` directory instead, run
`npm run build`.

## Features

- **30 named infobox shortcodes** — `{{< person >}}`, `{{< settlement >}}`,
  `{{< film >}}`, `{{< university >}}`, `{{< country >}}`, and 25 more, each a 1:1
  conceptual wrapper for the corresponding MediaWiki `Infobox <topic>` template.
  See `docs/SHORTCODES.md` §10 and the live demos under
  `exampleSite/content/articles/{slug}-demo.md`.
- **Light / dark / auto theme toggle** — persisted in `localStorage`, respects
  `prefers-color-scheme`, switches via CSS custom properties only (no Sass
  recompile, no JS framework hydration).
- **Collapsible left sidebar** with main-menu navigation derived from the site's
  `[menus.main]` block in `hugo.toml`.
- **Scroll-spy table of contents** for long articles, with a sticky page header
  on scroll.
- **Build-time JSON search index** + client-side substring matching — no runtime
  dependency on Lunr, Fuse, or MiniSearch for the v1 content scale.
- **Zero-runtime build** — `node_modules/` is dev tooling only; the produced
  `public/` directory runs on any static host with only the browser's native APIs.

## Local development tools

Two shortcode generators are available, co-located under `tools/`:

`npm run tools:shortcodes` — v1 generator. Pure HTML + vanilla TypeScript,
served by a tiny Node stdlib HTTP server on `localhost:8731`. Covers all
30 named shortcodes plus 12 inner primitives (`infobox-row`, `infobox-section`,
`infobox-pair-*`, …). YAML schemas under `tools/shortcodes-generator/data/`.
`npm run tools:check` asserts every YAML has a matching layout file.
See [`tools/shortcodes-generator/README.md`](tools/shortcodes-generator/README.md).

`npm run tools:shortcodes:v2` — v2 generator. React 18 + Vite + TypeScript,
served on `localhost:5173`. Typed TS specs under `tools/shortcodes-generator-v2/src/data/`
replace the runtime YAML layer; adds a freeform **Custom rows** builder for
infobox composition. `npm run tools:shortcodes:v2:check` asserts every TS spec
slug maps to a `layouts/_shortcodes/<slug>.html` file. React and Vite are
devDependencies only — zero runtime JS lands in `public/`. See
[`tools/shortcodes-generator-v2/README.md`](tools/shortcodes-generator-v2/README.md).

## Documentation

The full doc set lives under [`docs/`](docs/):

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — locked architecture decisions.
- [`docs/SHORTCODES.md`](docs/SHORTCODES.md) — author-facing reference for the 30 named
  infobox shortcodes.
- [`docs/shortcodes/`](docs/shortcodes/) — one standalone page per named shortcode
  with a Markdown parameter table and a worked example drawn from Wikipedia. Index
  lives at [`docs/shortcodes/README.md`](docs/shortcodes/README.md).
- [`docs/RESEARCH.md`](docs/RESEARCH.md) — visual & behavioral parity research record
  with the design-token inventory, layout/grid/StickyHeader mechanics, and the
  unified breakpoint table (§14.1).
- [`docs/PORT-MAP.md`](docs/PORT-MAP.md) — per-file upstream Vector 2022 provenance.
- [`docs/UI-AUDIT.md`](docs/UI-AUDIT.md) — visual + structural audit notes that
  catalog the user-facing decisions behind the current layout.
- [`docs/SHORTCODE-GAPS.md`](docs/SHORTCODE-GAPS.md) — per-shortcode gap inventory,
  documenting parameters the current wrappers do not accept (with workarounds via
  the inner primitives).
- [`CHANGELOG.md`](CHANGELOG.md) — Keep-a-Changelog record; every commit that
  changes user-facing or developer-facing behavior lands a matching entry in the
  same commit.

This README is the entry point — every other doc is one click away.

## Contributing

Read these before opening a change:

- **`.cursor/rules/00-core.mdc`** — five hard constraints: file size ceiling,
  one-language-per-file, one-concern-per-file, folder-per-shortcode, and no runtime
  Node dependencies. Every contribution must respect these.
- **`.cursor/rules/*.mdc`** — the remaining rule files cover CSS, JS, templates,
  shortcodes, and testing conventions.
- **`docs/ARCHITECTURE.md`** — locked architecture decisions: module boundaries,
  the 3-layer shortcode architecture (HTML → CSS hook → JS behavior), folder
  conventions, the workspace-as-theme build invocation, pinned toolchain versions,
  and stack rationale.
- **`docs/SHORTCODES.md`** — author-facing reference for the infobox shortcode
  family, with the per-template parameter tables in §10.
- **`docs/RESEARCH.md` §§10–§14** — the second-plan (visual & behavioral parity)
  research record: design-token inventory (light + dark, every value sourced
  from the live Vector 2022 stylesheet bundle and the upstream LESS files
  pinned at clone SHA `dd9a26f9`), layout/grid/StickyHeader mechanics,
  component catalog carry-forward with breakpoint bindings, and the unified
  breakpoint table. §14.1 is the single-source-of-truth for the project's
  five named breakpoints (mobile ≤ 719 / tablet 720–999 / desktop ≥ 1000 /
  desktop-wide ≥ 1200) — read it before adding any new `@media` rule.
- **`CHANGELOG.md`** + **`.cursor/rules/70-changelog.mdc`** — every commit that
  changes user-facing or developer-facing behavior gets a matching entry in the
  same commit, in Keep-a-Changelog style.

Commits follow Conventional Commits (`.cursor/rules/60-git-commit.mdc`), are scoped
narrowly to one logical unit of work, and never sweep in unrelated edits via
`git add .` / `git add -A`.

## License

Licensed under **GPL-2.0-or-later** — see the full text at
[`LICENSE`](LICENSE) in the repository root.

This is a derivative port of [`wikimedia/mediawiki-skins-Vector`][upstream],
which is itself distributed under GPL-2.0-or-later (per
`vendor/mediawiki-vector/COPYING`). The upstream copyright holder is the
Wikimedia Foundation and contributors; the port copyright is held by the
vector-hugo-skin contributors.

Infobox shortcode logic (the 30 topic shortcodes under `layouts/_shortcodes/` and
their supporting `infobox-pair-*` primitives) is **additionally derived from
Wikipedia's `Template:Infobox <topic>` wikitext** under the **CC BY-SA 4.0**
license. That attribution statement is reproduced at the top of each affected
shortcode file and catalogued in `docs/SHORTCODES.md` §11 and `NOTICE.md`.

This project is **not affiliated with, endorsed by, or sponsored by the
Wikimedia Foundation.** "MediaWiki" and "Vector" are trademarks of the
Wikimedia Foundation and are referenced here only to indicate
upstream-compatibility intent, never to redistribute any Wikimedia-owned
logo, wordmark, or asset.

[upstream]: https://github.com/wikimedia/mediawiki-skins-Vector
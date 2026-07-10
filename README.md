# vector-hugo-skin

Static Hugo reimplementation of Wikipedia's Vector 2022 skin, plus a MediaWiki-style
Infobox shortcode family. **No PHP, no MediaWiki server, no database.**

> **Independent reimplementation.** This project is not affiliated with the Wikimedia
> Foundation, is not an official Wikimedia project, and does not redistribute the
> GPL-2.0-or-later MediaWiki Vector skin source code. All CSS and JS is written from
> a behavioral study of Vector; the upstream source clone lives in `./reference/`
> (gitignored) for study only. See `docs/RESEARCH.md` and
> `.plans/first-plan/14-licensing-and-scope-notes.md` for the licensing boundary.

## Quickstart

Five commands to a running theme + example site:

```sh
git clone <repo-url>
cd vector-hugo-skin
npm install
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
- **`CHANGELOG.md`** + **`.cursor/rules/70-changelog.mdc`** — every commit that
  changes user-facing or developer-facing behavior gets a matching entry in the
  same commit, in Keep-a-Changelog style.

Commits follow Conventional Commits (`.cursor/rules/60-git-commit.mdc`), are scoped
narrowly to one logical unit of work, and never sweep in unrelated edits via
`git add .` / `git add -A`.

## License

Licensed under the **MIT License** — see [`LICENSE`](LICENSE) at the repository
root. Copyright (c) 2026 vector-hugo-skin contributors.

> **Independent reimplementation (restated).** This project is an independent
> reimplementation of the visual conventions of MediaWiki's Vector 2022 skin.
> It is **not affiliated with, endorsed by, or sponsored by the Wikimedia
> Foundation**. MediaWiki and Vector are trademarks of the Wikimedia Foundation;
> this project makes fair-use reference to those conventions for the purpose of
> compatibility, not redistribution of any Wikimedia source code or assets.
> See `docs/RESEARCH.md`, `docs/SHORTCODES.md`, and
> `.plans/first-plan/14-licensing-and-scope-notes.md` for the licensing
> boundary around the Phase 1 research notes, the Phase 2 infobox research,
> the per-template reference entries in `docs/SHORTCODES.md` §10, and the
> demo articles under `exampleSite/content/articles/` (all original
> prose invented for this theme — never Wikipedia verbatim). The upstream
> source clone at `./reference/` is gitignored and never tracked; see
> `docs/RESEARCH.md` for the file-level scope notes.
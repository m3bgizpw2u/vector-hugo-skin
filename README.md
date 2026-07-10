# vector-hugo-theme

Static Hugo reimplementation of Wikipedia's Vector 2022 skin, plus a MediaWiki-style
Infobox shortcode family. No PHP, no MediaWiki server, no database.

> **Independent reimplementation.** This project is not affiliated with the Wikimedia
> Foundation, is not an official Wikimedia project, and does not redistribute the
> GPL-2.0-or-licensed MediaWiki Vector skin source code. All CSS and JS is written from
> an understanding of Vector's behavior; the upstream source lives in `./reference/`
> (gitignored) for study only. See `docs/RESEARCH.md` for the research notes and
> Phase 14 of the build plan (`.plans/first-plan/14-licensing-and-scope-notes.md`)
> for the licensing rationale.

## Status

Phase 0 — environment & scaffolding. See `.plans/first-plan/` for the build plan.

## Quick start (planned, not yet implemented)

```sh
hugo server --source exampleSite --themesDir .. --theme vector-hugo-theme
```

## Architecture

See `.cursor/rules/*.mdc` and (eventually) `docs/ARCHITECTURE.md`.

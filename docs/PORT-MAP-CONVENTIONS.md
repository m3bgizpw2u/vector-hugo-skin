# Port-Map Conventions — Per-File Header Format

This document defines the license headers that every file in
`vector-hugo-skin` carries, depending on which upstream source it is
derived from. It is the single source of truth referenced by
`.cursor/rules/60-git-commit.mdc` and by phases 3–7 of the
third-plan literal port.

## Pinned upstream record

| Resource | Value |
|---|---|
| Upstream | `wikimedia/mediawiki-skins-Vector` |
| Pinned tag | `REL1_42` |
| Pinned commit SHA | `7c224883fd6ee166950aaa690381fbc769838071` |
| Commit date | `2025-06-12` |
| Vendored at | `vendor/mediawiki-vector/` |
| License | GPL-2.0-or-later (per `vendor/mediawiki-vector/COPYING`) |
| Companion upstream | `Template:Infobox <topic>` on `en.wikipedia.org` (CC BY-SA 4.0) |

When a ported file cites "the upstream SHA" or "the vendor SHA," it refers to
`7c224883fd6ee166950aaa690381fbc769838071` unless the file's own header
says otherwise.

## Header templates

### A. Vector-derived file (CSS / TS / templates)

Use when the file is a literal translation of an identifiable file under
`resources/skins.vector.styles/`, `resources/skins.vector.js/`, or
`includes/templates/` at the pinned SHA.

CSS (`/*.scss`):

```scss
// Derived from mediawiki-skins-Vector @ 7c224883 (REL1_42, 2025-06-12),
// file: resources/skins.vector.styles/<…>.less
// Original (c) Wikimedia Foundation and contributors, GPL-2.0-or-later.
// This file: GPL-2.0-or-later.
```

TypeScript (`/*.ts`):

```ts
/**
 * Derived from mediawiki-skins-Vector @ 7c224883 (REL1_42, 2025-06-12),
 * file: resources/skins.vector.js/<…>.js
 * Original (c) Wikimedia Foundation and contributors, GPL-2.0-or-later.
 * This file: GPL-2.0-or-later.
 */
```

HTML / Hugo template (`/*.html`):

```html
{{/*
Derived from mediawiki-skins-Vector @ 7c224883 (REL1_42, 2025-06-12),
file: includes/templates/<…>.mustache
Original (c) Wikimedia Foundation and contributors, GPL-2.0-or-later.
This file: GPL-2.0-or-later.
*/}}
```

### B. Wikipedia Infobox-derived file (shortcodes)

Use when the file ports the conditional logic from a Wikipedia
`Template:Infobox <topic>` page or its backing Lua module. The wrapper
markup itself may also be Vector-derived; in that case use the **dual
license** form.

CC BY-SA only (no Vector markup in the file):

```html
{{/*
Derived from Wikipedia "Template:Infobox <topic>" — see
https://en.wikipedia.org/wiki/Template:Infobox_<topic>?action=raw
Revision <rev-id>, fetched <YYYY-MM-DD>. Licensed CC BY-SA 4.0.
This file: CC BY-SA 4.0.
*/}}
```

Dual license — Vector wrapper styling plus Wikipedia template logic
(see phase 7 of the third plan):

```html
{{/*
Derived from mediawiki-skins-Vector @ 7c224883 (REL1_42, 2025-06-12) for
the wrapper styling (GPL-2.0-or-later) and from Wikipedia
"Template:Infobox <topic>" revision <rev-id> for the per-topic
conditional logic (CC BY-SA 4.0). Combined file: GPL-2.0-or-later for
the Vector-derived layout, CC BY-SA 4.0 for the Wikipedia-derived
content logic; both notices must be retained on redistribution.
*/}}
```

### C. Original / Hugo-native file

No header. Do not add a Vector or Wikipedia header reflexively. Files
under this category include: `theme.toml`, `package.json`,
`tsconfig.json`, `.eslintrc.json`, `.stylelintrc.json`,
`archetypes/`, `i18n/en.toml`, `.cursor/rules/*.mdc`, the build config
in `package.json`, `exampleSite/**`, and the prose in `docs/`
(excluding `docs/PORT-MAP.md` and `docs/SHORTCODES.md` per-template
entries, which themselves cite the upstream per row).

## Which header goes on which file

The expected mapping per file path is catalogued row-by-row in
`docs/PORT-MAP.md`. Files appear there in one of three buckets:

- **literal** — header **A** (Vector-derived).
- **literal+adapt** — header **A**; the `Notes` column in
  `docs/PORT-MAP.md` records whatever Hugo-idiom deviation was needed.
- **hugo-native** — no header (**C**).
- **CC-BY-SA-only** (the `infobox-pair-*` and topic shortcode bodies that
  reproduce template conditional logic directly) — header **B-CC-BY-SA**.
- **dual** (a single file that mixes Vector wrapper markup with Wikipedia
  template logic — e.g. an `infobox-pair-*` partial that ports Vector's
  `Infobox.less` chrome while applying Wikipedia template's
  conditional field rendering) — header **B-dual**.

## What this document is not

This document does not define what the *content* of any ported file
should be — that's `docs/PORT-MAP.md`. It defines the *header
mechanics only*. If a header format above disagrees with the format
applied in a specific file, the file is wrong and the header should be
corrected in a follow-up commit per phase 8 of the third plan.

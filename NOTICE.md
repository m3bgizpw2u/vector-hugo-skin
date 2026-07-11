# Notice — third-party attribution & license tiers

`vector-hugo-skin` is a derivative work that combines three licensing
tiers. Every file in this repository carries the appropriate header
per `docs/PORT-MAP-CONVENTIONS.md` §B; this file gives the
human-readable summary.

## Tier 1 — GPL-2.0-or-later (skin chrome)

The visual chrome of the theme — the layout system, the sidebar, the
sticky header, the table of contents, the search box, the footer, the
article frame, the design tokens, the infobox table styling, the
TypeScript behaviour modules, and the `layouts/_partials/infobox/`
base rendering partial — is a literal 1:1 port of the corresponding
parts of **`wikimedia/mediawiki-skins-Vector`** at the pinned SHA
`7c224883fd6ee166950aaa690381fbc769838071` (REL1_42, 2025-06-12).

Upstream copyright: Wikimedia Foundation and contributors. Upstream
license: GPL-2.0-or-later. The full upstream vendor copy is at
`vendor/mediawiki-vector/`; the upstream `COPYING` file (verbatim) is
mirrored at `LICENSE` in this repo.

The per-file license header at the top of every Vector-derived file
cites the exact upstream file at the pinned SHA per
`docs/PORT-MAP-CONVENTIONS.md` §A. On redistribution, both this
project's `LICENSE` and the per-file headers must be retained.

## Tier 2 — CC BY-SA 4.0 (infobox content logic)

The conditional field-rendering logic in each named
`Infobox <topic>` shortcode under `layouts/_shortcodes/<topic>.html`
is a port of the corresponding `Template:Infobox <topic>` (and its
backing Lua module, where present) on **`en.wikipedia.org`**.

Upstream authors: Wikipedia contributors (the relevant edit history is
the attribution chain). Upstream license: Creative Commons
Attribution-ShareAlike 4.0 International (CC BY-SA 4.0). See
<https://creativecommons.org/licenses/by-sa/4.0/> for the license text
and reuse conditions.

The per-file license header at the top of each topic shortcode cites
the exact upstream template and fetch date per
`docs/PORT-MAP-CONVENTIONS.md` §B (dual). The `docs/SHORTCODES.md`
§11 provenance table records the URL used for each port.

On redistribution, both license notices (the per-file header + the
`docs/SHORTCODES.md` §11 table) must be retained, and downstream
derivative works must also be released under CC BY-SA 4.0 to the
extent the original conditional logic is reproduced.

## Tier 3 — Original / Hugo-native (build, content, fixtures)

The following parts of the repository are original work and are
licensed under the project's primary `LICENSE` (GPL-2.0-or-later) but
have no upstream attribution requirement of their own:

- `theme.toml`, `package.json`, `tsconfig.json`, `.eslintrc.json`,
  `.stylelintrc.json`, `archetypes/`, `i18n/`, `.cursor/rules/`,
  the build configuration in `package.json`, and the prose in
  `docs/` (excluding `docs/SHORTCODES.md` per-shortcode rows, which
  cite the upstream per row).
- The example site content under `exampleSite/content/` and the
  fixture data under `tests/e2e/fixtures/`. These are demo material
  authored for this theme; any resemblance to Wikipedia articles is
  by authorial choice to demonstrate the shortcode family and not
  derivative of any specific Wikipedia article body.
- The inner primitive shortcodes under `layouts/_shortcodes/infobox/`
  (the `infobox`, `infobox-row`, `infobox-image`, `infobox-section`,
  `infobox-below`, and `infobox-pair-*` files) are original
  Hugo-template compositions. They render through the same Tier 1
  base partial but do not port any specific upstream conditional
  logic, so they are Tier 3 (no per-file attribution header needed
  per `docs/PORT-MAP-CONVENTIONS.md` §C).

## Wikimedia Trademark Policy compliance

"Wikipedia" and the Wikipedia logo are registered trademarks of the
Wikimedia Foundation. This project:

1. Is **not affiliated with, endorsed by, or sponsored by the
   Wikimedia Foundation**.
2. Does **not** redistribute Wikimedia Foundation trademarks or
   logos, except as required to identify the upstream source under
   the CC BY-SA 4.0 attribution clause.
3. Does **not** imply any business relationship with the Wikimedia
   Foundation, nor does it purport to be a replacement for the live
   `en.wikipedia.org` rendering pipeline.
4. Reproduces upstream source code under the upstream license
   (GPL-2.0-or-later for the Vector skin; CC BY-SA 4.0 for the
   infobox templates) and clearly identifies the upstream
   provenance at every relevant site (the per-file license headers
   and the `docs/SHORTCODES.md` §11 provenance table).
5. The infobox conditional logic ported from Wikipedia is reused
   under CC BY-SA 4.0, which permits reuse with attribution and
   share-alike. Any downstream site that uses these shortcodes must
   similarly credit the Wikipedia contributor chain and apply
   CC BY-SA 4.0 to the derivative content it ships.

For the full Wikimedia Trademark Policy, see
<https://foundation.wikimedia.org/wiki/Policy:Trademark_Policy>.

## Non-affiliation disclaimer

This project is a third-party derivative work. The author(s) of
`vector-hugo-skin` make no representation or warranty that the
behaviour of the theme matches the live Wikipedia rendering exactly;
the static-only port excludes MediaWiki server-side features
(login / edit / history / talk tabs, VisualEditor, live search API,
notifications, watchlist) by design. See `docs/ARCHITECTURE.md`
"Excluded MediaWiki features" for the full list.

## SPDX-License-Identifier

The repository root carries `SPDX-License-Identifier: GPL-2.0-or-later`
in the `LICENSE` file. Per-file SPDX identifiers (where present in
the per-file headers) take precedence for that file; the
infobox-derived files carry a dual license and so should be tagged
both `GPL-2.0-or-later` (for the Vector wrapper) and `CC-BY-SA-4.0`
(for the conditional logic) by downstream SPDX-aware tooling.
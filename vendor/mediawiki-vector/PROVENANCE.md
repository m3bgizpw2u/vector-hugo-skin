# Provenance — vendored `wikimedia/mediawiki-skins-Vector`

This tree is a vendored copy of the upstream MediaWiki Vector skin,
included in the repository so that every line of code in the
`vector-hugo-skin` Hugo port can be cited against an exact upstream
file at an exact upstream commit.

| Field | Value |
|---|---|
| Upstream URL | `https://github.com/wikimedia/mediawiki-skins-Vector` |
| Pinned tag | `REL1_42` |
| Pinned commit (peeled) | `7c224883fd6ee166950aaa690381fbc769838071` |
| Commit author/date | `Vulnerable Wiki bot` · 2025-06-12 02:14:16 +0200 |
| Commit subject | `SECURITY: Insert portlet labels as text instead of HTML` |
| Vendored on | 2026-07-11 |
| Vendored into | `vendor/mediawiki-vector/` |
| Vendored by | third-plan phase 1 (literal-port conversion) |
| Upstream license | GPL-2.0-or-later (see `vendor/mediawiki-vector/COPYING`) |
| Tree state | Vendored in full (no `node_modules`, no `.git`); original upstream layout preserved verbatim |

## Why vendored in full

GPL-2.0-or-later §2(a) requires that any work that contains or is
derived from a GPL-licensed program carry "prominent notices stating
that you changed the files and the date of any change" on the
modified files; §2(b) requires the entire derivative work to be
licensed under GPL. The cleanest way to honour both clauses for a
literal port is to keep the exact source the port cites, at the
exact SHA the port cites, in the same repository as the port.

This tree is **not built or served directly** — it is a reference
copy, kept here so that file-by-file provenance in `docs/PORT-MAP.md`
and `docs/SHORTCODES.md` can be checked out of the repo history
rather than reaching back to a moving upstream `main`. The Hugo
theme lives one directory up, at the repository root.

## How to update the pin

If a future commit needs to refresh the upstream SHA:

1. From the upstream remote, identify the new target commit (usually
   the tip of the `REL1_*` release series in use).
2. Re-clone the repo at the new SHA into a temporary location.
3. Run `rm -rf vendor/mediawiki-vector/` and re-copy the tree in.
4. Update the records at:
   - `vendor/mediawiki-vector/PROVENANCE.md` (this file)
   - `docs/RESEARCH.md` §"Pinned Vector source"
   - `docs/PORT-MAP.md` (the per-file SHA citation column)
   - `docs/PORT-MAP-CONVENTIONS.md` (the pinned-SHA line at the top)
   - Every per-file GPL header in `assets/css/`, `assets/js/`,
     `layouts/_default/`, `layouts/_partials/`, and
     `layouts/_shortcodes/` that cites the SHA.
5. Repeat phase 9's source-line traceability spot-check from
   `docs/RESEARCH.md` §"Source-line traceability spot-check" against
   the new SHA.

## What is NOT in this tree

- **No `.git/`** — the upstream's own history is deliberately stripped.
  Tracking provenance for the port is the responsibility of this
  repository's own commit history plus the records listed above; an
  unbounded upstream history does not need to live here.
- **No `node_modules/`** — the upstream ships only dev-time Node
  tooling. None of it executes against this tree (it is a reference
  copy, not a build target).
- **No MediaWiki core** — only the Vector skin repo. Vector itself
  only needs core's template/hook interfaces conceptually, not its
  code, for a static port.

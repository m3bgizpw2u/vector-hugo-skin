# Shortcodes — author reference

This directory is the **author-facing quick reference** for every shortcode
shipped by the theme. Each named shortcode has its own page; each inner
primitive has its own page; the [customizing and extending guide](customizing.md)
covers site authors who want to add new shortcodes or modify the existing
ones.

For the **architecture and conventions** (the three-layer model, the MediaWiki
→ Hugo mapping, the CSS hook contract, the responsiveness commitment, the
explicit v1 scope cuts), see [`docs/SHORTCODES.md`](../SHORTCODES.md). That
document is the conceptual map; the pages in this directory are the
shop-floor reference.

## Named shortcodes

The 30 named shortcodes below are 1:1 conceptual wrappers for
Wikipedia's `Template:Infobox <topic>` family. Each accepts the same
named parameters in the same order as the upstream MediaWiki template,
and renders through one shared base partial. Field names mirror the
upstream MediaWiki parameter naming convention (snake_case, reused
across templates) deliberately — an author copy-pasting a Wikipedia
infobox body into a Hugo article is a small quoting edit, not a rename.
See [`docs/SHORTCODES.md`](../SHORTCODES.md) §2 for the full mapping.

| Shortcode | Used for |
|---|---|
| [`{{< album >}}`](album.md) | Music albums |
| [`{{< award >}}`](award.md) | Awards, prizes, honours |
| [`{{< baseball-biography >}}`](baseball-biography.md) | Baseball players |
| [`{{< basketball-biography >}}`](basketball-biography.md) | Basketball players |
| [`{{< church >}}`](church.md) | Churches, religious buildings |
| [`{{< company >}}`](company.md) | Companies, corporations |
| [`{{< country >}}`](country.md) | Countries, sovereign states |
| [`{{< election >}}`](election.md) | Elections, referendums |
| [`{{< film >}}`](film.md) | Films |
| [`{{< football-biography >}}`](football-biography.md) | Football (soccer) players |
| [`{{< football-club >}}`](football-club.md) | Football (soccer) clubs |
| [`{{< historic-site >}}`](historic-site.md) | Historic sites, landmarks (NRHP) |
| [`{{< ice-hockey-biography >}}`](ice-hockey-biography.md) | Ice hockey players |
| [`{{< military-conflict >}}`](military-conflict.md) | Military conflicts, battles |
| [`{{< military-person >}}`](military-person.md) | Military personnel |
| [`{{< military-unit >}}`](military-unit.md) | Military units, formations |
| [`{{< organization >}}`](organization.md) | Organizations, NGOs, associations |
| [`{{< person >}}`](person.md) | People (general biography) |
| [`{{< political-party >}}`](political-party.md) | Political parties |
| [`{{< protected-area >}}`](protected-area.md) | Protected areas, parks |
| [`{{< school >}}`](school.md) | Schools, K–12 institutions |
| [`{{< settlement >}}`](settlement.md) | Cities, towns, villages |
| [`{{< software >}}`](software.md) | Software, applications, services |
| [`{{< station >}}`](station.md) | Transit, railway, metro stations |
| [`{{< television >}}`](television.md) | Television shows, series |
| [`{{< television-episode >}}`](television-episode.md) | Television episodes |
| [`{{< television-season >}}`](television-season.md) | Television seasons |
| [`{{< tennis-tournament-event >}}`](tennis-tournament-event.md) | Tennis tournament events |
| [`{{< university >}}`](university.md) | Universities, colleges |
| [`{{< video-game >}}`](video-game.md) | Video games |

## Building blocks

The **inner primitive** family is the escape hatch when a named wrapper's
fixed schema does not cover a field an author needs. See
[Building blocks — infobox primitives](infobox-primitives.md) for the
five generic primitives and seven special-case pair primitives.

## Article-body shortcodes

Shortcodes that model **article-body elements** — media embedded inline in
the prose between paragraphs, not inside the right-hand infobox column —
live in a separate bucket. They have no upstream `Template:Infobox <topic>`
mapping and so do not belong in the named-shortcodes list above. See
[`docs/SHORTCODES.md`](../SHORTCODES.md) §A for the rationale.

| Shortcode | Used for |
|---|---|
| [`{{< thumb >}}`](thumb.md) | Inline native-ratio thumbnail — the shared image-rendering surface (srcset/sizes, float alignment, magnify + lightbox) that every image-emitting shortcode delegates to |
| [`{{< figure >}}`](figure.md) | Inline figures — image / audio / video with caption, float alignment, and optional lightbox participation |
| [`{{< row-table >}}`](row-table.md) | Repeating `icon \| text \| photo` rows with fluid responsiveness and an opt-in expandable variant |

## Citations

The **`cite-ref` / `references`** pair reproduces Wikipedia's footnote
pattern from Markdown's native footnote syntax — no front matter
required. See [Citations](citations.md).

## Customizing and extending

Site authors who want to add a new named shortcode for a topic the theme
doesn't ship (or modify the look of an existing one) should read
[Customizing and extending](customizing.md). That page covers the
workflow for adding a new shortcode, the CSS hook contract for visual
tweaks, and the gotchas around the upstream MediaWiki licence.

## How to read these pages

Each per-shortcode page follows the same shape:

1. **Intent** — one sentence describing what the shortcode is for.
2. **Parameters** — the full parameter list, in the same order as the
   wrapper's comment header. Required parameters are marked.
3. **Worked example** — a Hugo shortcode form ready to paste into a
   Markdown article.
4. **See also** — link to the upstream MediaWiki template documentation
   on `en.wikipedia.org`.

The parameter list in the comment header at the top of each wrapper
file is the source of truth — the page mirrors that header in human-
readable form, but the header is what gets updated when upstream
Wikipedia changes its parameter set.

## Demo articles

Every named shortcode has a live demo article under
`exampleSite/content/articles/<topic>-demo.md`. The demo shows the
shortcode in its simplest configuration plus the variants an author
is most likely to want (paired-form primitive additions, image block,
`below` footer, citation markers). The patterns in those demos are
the patterns you should reach for in your own articles.

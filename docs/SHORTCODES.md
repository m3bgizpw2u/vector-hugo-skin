# Shortcodes

This document is the author-facing reference for the theme's shortcode family.
The per-template entries (one section per shipped named shortcode) land in
Phase 8 alongside the implementation. What ships now — as the Phase 2½
deliverable — is the **Authoring Guide**: the 3-layer architecture, the
MediaWiki → Hugo syntax mapping, the inner-primitive escape hatch, the CSS
hook contract, the responsiveness commitment, the explicit v1 scope cuts,
and the future-work list. By the end of Phase 8, every shipped named
shortcode in `docs/RESEARCH.md` §7 has a sub-section in §10 of this file;
until then, the Authoring Guide below is the whole document.

> **Licensing boundary.** Every worked example below uses original prose
> invented for this theme. Field names mirror the upstream MediaWiki parameter
> naming convention (snake_case, reused across templates) as a deliberate
> authoring choice, not because any upstream template text was reproduced —
> see `docs/RESEARCH.md` header and
> `.plans/first-plan/14-licensing-and-scope-notes.md` §3 for the boundary.

## §0. Licensing & attribution (third plan, phase 7+)

Every named `Infobox <topic>` shortcode under `layouts/_shortcodes/<topic>.html`
is a **dual-license derivative work**:

- **GPL-2.0-or-later** for the surrounding skin chrome and table-style
  layout, inherited from `wikimedia/mediawiki-skins-Vector` at the
  pinned SHA `7c224883fd6ee166950aaa690381fbc769838071`
  (REL1_42, 2025-06-12; vendor copy under `vendor/mediawiki-vector/`).
- **CC BY-SA 4.0** for the per-topic conditional logic, ported from the
  corresponding `Template:Infobox <topic>` (and its backing Lua module,
  where present) on `en.wikipedia.org`. The Wikipedia contributors are
  the joint authors of that conditional logic; the upstream is licensed
  CC BY-SA 4.0, and any downstream redistribution must retain both
  license notices.

Both notices are kept in the file header of each named shortcode per
`docs/PORT-MAP-CONVENTIONS.md` §B (dual). A per-shortcode provenance
table — fetched URL, byte size, and the conditionals extracted from
the source — is included at the bottom of this file (§§11-12 below
and in §10 worked-example entries as the canonical quick-reference).

The base rendering partial (`layouts/_partials/infobox/base.html`) and
the inner primitive shortcodes (`layouts/_shortcodes/infobox/`) are
under the same dual license; everything else in the theme (the
header / sidebar / footer / article chrome) is the standard
GPL-2.0-or-later Vector derivative.

### Non-affiliation & non-trademark

This theme is **not affiliated with, endorsed by, or sponsored by the
Wikimedia Foundation**. "Wikipedia" and the Wikipedia logo are
registered trademarks of the Wikimedia Foundation; this theme does not
redistribute Wikimedia Foundation trademarks or logos and is not a
replacement for the live `en.wikipedia.org` rendering pipeline. Use of
this theme's infobox shortcodes does not imply any relationship with
the Wikimedia Foundation. See `NOTICE.md` for the full Wikimedia
Trademark Policy compliance statement and the three-tier license
breakdown (skin chrome GPL-2.0-or-later, infobox content CC BY-SA 4.0,
Hugo-native example content / build / fixtures MIT or Apache-2.0 /
original).

---

## §1. Overview

The theme ships a **family of named shortcodes** that reproduce the visual
contract of Wikipedia's `Infobox <topic>` template family in a static Hugo
context. The mapping to MediaWiki is direct: every `{{< topic >}}` shortcode
the theme ships is a 1:1 conceptual wrapper for `{{Infobox topic …}}` on
Wikipedia, accepts the same named parameters in the same order, and renders
through one shared base partial. The 30 named shortcodes in
`docs/RESEARCH.md` §7 are the v1 coverage contract; the architecture below
makes adding more a small mechanical process (see `docs/RESEARCH.md` §8).

The architecture is three layers, top to bottom:

```
┌──────────────────────────────────────────────────────────────────┐
│  Layer 1: Named wrappers                                         │
│  layouts/_shortcodes/{slug}/{slug}.html                           │
│  One file per MediaWiki template (top 30 in RESEARCH.md §7).     │
│  Thin 15–30 line Go-template that maps the upstream param list    │
│  onto the base partial's slot list.                              │
│                                                                  │
│   {{< person name="…" birth_date="…" birth_place="…" />}}       │
│   {{< settlement name="…" population_total="…" area_total="…" >}}│
│   {{< film title="…" director="…" budget="…" gross="…" />}}      │
└──────────────────────────────────────────────────────────────────┘
                              │ delegates to
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│  Layer 2: Base rendering partial                                 │
│  layouts/partials/infobox/base.html                              │
│  One partial that renders every infobox: the header, the image   │
│  block, the row sequence, the special-case field groups, the     │
│  optional "below" footer. Receives a dict from layer 1, dispatches│
│  to the matching per-concept partials.                           │
└──────────────────────────────────────────────────────────────────┘
                              │ composed from
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│  Layer 3: Inner primitive shortcodes                            │
│  layouts/_shortcodes/infobox/infobox-{primitive}.html             │
│  Five generic building blocks (infobox-row, infobox-image,       │
│  infobox-section, infobox-below, the outer infobox paired         │
│  wrapper) plus seven infobox-pair-* special-case primitives.     │
│  The named wrappers compose these into their final row list.     │
└──────────────────────────────────────────────────────────────────┘
```

The shape matters: a named wrapper file is a **mechanical** map from upstream
parameter names to the base partial's slot list. Once the base partial and
the primitives are written, the per-template work is bookkeeping — and a
downstream site author who wants a new wrapper does not need to recompile
the theme.

---

## §2. Syntax mapping (MediaWiki → Hugo)

The transition from MediaWiki wikitext to a Hugo shortcode is mostly
mechanical. Field names are preserved verbatim. Only the delimiters and the
value-quoting convention change.

| MediaWiki wikitext | Hugo shortcode | Why the change |
|---|---|---|
| `{{Infobox person \| name = X }}` | `{{< person name="X" >}}` | `{{` → `{{<`; `}}` → `>}}`; pipes around the key become spaces; the `= value` part gains surrounding quotes. |
| `{{Infobox person \| name = X \| birth_date = 1990 }}` | `{{< person name="X" birth_date="1990" >}}` | Same — the trailing `}}` closes both forms identically. |
| `{{Infobox person` (paired form, opens a block) | `{{< person >}}…{{< /person >}}` | Hugo's paired form is the wikitext `{{Infobox person` / `}}` equivalent: everything between the open and close tag is `.Inner` inside the named wrapper. |
| `\| name = "X"` (with explicit quotes) | `name = "X"` | The quotes were never MediaWiki-mandatory; they are required for any value containing spaces in Hugo's shortcode parser. Authors can keep them everywhere for consistency, or only when the value has whitespace. |
| `\| name = ''` (empty string) | `name=""` | Empty strings render as no row in both. The base partial uses a `with`-style guard that suppresses the row when the value is empty or absent, matching MediaWiki's "absent values leave no empty rows" guarantee. |
| Nested templates: `{{Infobox settlement \| pushpin_map = {{Infobox map …}} }}` | Not yet supported in v1 | Hugo's shortcode parser evaluates args as raw strings, so nested `infobox-*` calls inside a parent's param list do not render. This is **flagged as future work** in §9. Authors who need a nested value can use the inner-primitive escape hatch (§5). |

**Why the param names are identical, not Hugo-idiomatic.** Wikipedia's
`Wikipedia:Manual of Style/Infoboxes` already specifies snake_case, lowercase
nouns, cross-template reuse of field names like `birth_date` / `death_date` /
`coordinates`. The Hugo shortcode family follows the same convention
deliberately: an author copy-pasting a Wikipedia infobox body into a Hugo
article is a small quoting edit, not a rename. The naming contract is locked
in `.cursor/rules/40-shortcodes.mdc`.

**Worked example — single-line form:**

```markdown
{{< person
    name          = "Douglas Adams"
    image         = "douglas-adams.jpg"
    alt           = "Black-and-white portrait of Douglas Adams"
    caption       = "Adams in 2001"
    birth_date    = "11 March 1952"
    birth_place   = "Cambridge, England"
    death_date    = "11 May 2001"
    death_place   = "Santa Barbara, California"
    occupation    = "Author, screenwriter"
    notable_works = "*The Hitchhiker's Guide to the Galaxy*"
>}}
```

**Worked example — paired form (inner-primitive escape hatch).** When the
named wrapper's fixed schema does not cover a field, the author can switch
to the paired form and insert inner primitives directly inside the
`.Inner` block:

```markdown
{{< person name="Ada Lovelace" birth_date="10 December 1815" >}}
  {{< infobox-section title="Recognition" >}}
    {{< infobox-row label="Honours" value="Ada Initiative (named for her)" >}}
    {{< infobox-row label="In popular culture" value="Featured in the film *Conceiving Ada*" >}}
  {{< /infobox-section >}}
{{< /person >}}
```

The two forms are visually identical at render time — the named wrapper's
fixed-schema rows precede the `.Inner` rows in the final output, and every
cell uses the same base styles.

---

## §3. Layer 1 — Named wrappers

A **named wrapper** is one Go-template file per MediaWiki `Infobox <topic>`
template. The 30 in v1 are the rows of `docs/RESEARCH.md` §7. The file lives
at `layouts/_shortcodes/{slug}/{slug}.html` per the folder-per-shortcode rule
in `.cursor/rules/00-core.mdc` and `.cursor/rules/40-shortcodes.mdc`.

A named wrapper is small — **15 to 30 lines**. The file does three things
and nothing else:

1. Opens `<aside class="infobox" data-infobox-type="{slug}">`. The
   `data-infobox-type` attribute is the SCSS hook Phase 5 keys per-template
   rules on; the wrapper is the only file that emits the attribute for a
   given slug.
2. Builds a `dict` of the upstream parameter list (and `.Inner` for the
   paired form) and calls `partial "infobox/base.html" .` with that dict.
   Special-case field groups are composed as inner `infobox-pair-*` shortcode
   calls inside the dict, not in the wrapper's body — that way the base
   partial can place them in the row sequence using the same dispatch logic
   it uses for primitives.
3. Closes the `<aside>`. That's it.

The wrapper's **comment block at the top of the file** lists the accepted
parameters in declaration order, mirroring the upstream MediaWiki template's
documentation. Reading the file is sufficient to know the wrapper's surface
without leaving the file. Phase 8 will fill in the per-wrapper parameter
tables from the upstream docs.

The wrapper never:

- emits HTML beyond the opening and closing `<aside>` tags
- runs business logic (no date parsing, no currency conversion, no
  unit normalisation — those happen in the special partials)
- contains conditional branching that varies the structural shape
  (the same rows are emitted in the same order; absent values are
  suppressed, but the row order never changes)
- grows past the 30-line ceiling; if it does, that's the signal to lift the
  row sequence into a `partials/infobox/special/{slug}.html` partial and
  have the wrapper call that partial from inside its dict instead

---

## §4. Layer 2 — Base partial

`layouts/partials/infobox/base.html` is the single rendering entrypoint for
every named shortcode in the family. It receives the dict that the named
wrapper built, and renders, in order:

1. **The header cell.** The `title` value, in a `<div class="infobox-header">`.
   Title is the only required field on every named shortcode. No title → no
   infobox (matches upstream, where an absent title is also a degenerate
   case).
2. **The image block** (if `image` is present). A `<figure>` containing the
   image, a `caption` underneath (rendered through `markdownify` to allow
   inline emphasis and links), and the `alt` attribute on the `<img>` itself
   for assistive tech. Absent image → block omitted entirely, no placeholder.
3. **The row sequence.** The `fields` value is a slice of `dict` entries,
   each one either:
   - a plain label/value pair (the wrapper provides a `label` and a `value`
     string), rendered as `<div class="infobox-row">` with
     `<div class="infobox-label">` and `<div class="infobox-data">` cells, or
   - a section divider, rendered as `<div class="infobox-section-header">`,
     or
   - a special-case pair primitive, rendered through its matching
     `partials/infobox/special/{pair-name}.html`.
4. **The optional `below` footer** (if present). A `<div class="infobox-below">`
   at the bottom of the box for footnotes, see-also links, or trailing
   commentary the author wants to keep inside the box instead of in the
   body. Rendered through `markdownify` so inline emphasis works.

The base partial emits no inline `<style>` or `<script>`. Every class name
on every element matches the contract in §6 exactly. The base partial
intentionally has no knowledge of which named wrapper called it — it reads
the dict, dispatches to the matching per-concept partials, and returns.
Adding a new named shortcode is the wrapper-only work in §3.

---

## §5. Layer 3 — Inner primitives

When the named wrapper's fixed schema does not cover a field an author
needs, the **inner primitive escape hatch** is the answer. Five generic
primitives plus seven `infobox-pair-*` special-case primitives make up
layer 3. All live at `layouts/_shortcodes/infobox/infobox-{name}.html`
(folder-per-shortcode rule applies) and render through the base partial's
slot system — so a primitive inside a `.Inner` block is visually
indistinguishable from the same primitive called from inside the named
wrapper's dict.

### §5.1 The five generic primitives

| Primitive | Paired? | What it renders |
|---|---|---|
| `infobox` | yes | The outer paired wrapper. Used when the content does not fit any named template; lets the author build the full row list from primitives. The named wrappers are thin shims around this primitive in concept. |
| `infobox-row` | yes | A single label/value row. Author writes the label as the `label` param and the value as the `value` param. Value is rendered through `markdownify` so inline bold/italic/links work. Absent value → row omitted. |
| `infobox-image` | yes | An image + caption + alt block, used standalone when the named wrapper does not cover the article's image. |
| `infobox-section` | yes | A grouping header that spans both columns. Useful for visual structure inside a long infobox; the section is a label that breaks the row list into thematic groups (e.g. "Personal life", "Career"). |
| `infobox-below` | yes | The freeform footer block at the bottom of the box. Mirrors the upstream `below` slot. |

### §5.2 The seven `infobox-pair-*` special-case primitives

Some field pairs appear in so many named templates that promoting them to
their own primitive is cheaper than asking the author to compose two
`infobox-row`s. The seven shipped in v1 are the `docs/RESEARCH.md` §9
catalogue: `infobox-pair-date`, `infobox-pair-software-release`,
`infobox-pair-population`, `infobox-pair-area`, `infobox-pair-air-date`,
`infobox-pair-budget-gross`, `infobox-pair-episode-season`. The named
wrappers for the templates that use each pair (the same list as
`docs/RESEARCH.md` §9) call the primitive from inside their dict. Authors
can also use them standalone in the paired form. The CSS hook
`[data-infobox-type="…"]` selector picks up per-template tweaks, so the
pairs never need per-template CSS files.

### §5.3 Escape hatch philosophy

The primitives are the **escape hatch**: anything the named wrapper's fixed
schema does not cover, the author can express by switching to the paired
form and inserting primitives directly. The author never has to fall back
to raw HTML or to a per-site CSS override to add an unusual field. The
escape hatch is the long tail of "every Wikipedia infobox ever had a
bespoke one-off field" — the primitives absorb the common cases, and
anything that escapes the primitive set is one paired shortcode away.

---

## §6. CSS hook contract

The base partial and every special partial emit a fixed set of class names
on every element. The class names are the **CSS hook contract**: anything
`assets/scss/components/infobox.scss` styles must use exactly these names,
and the templates must emit exactly these names — drift in either direction
is a bug. The contract is the source of truth for both directions; the
Phase 5 SCSS work and the Phase 8 template work read from this list and
contribute to it on either side as needed.

| Class name | Emitted on | Purpose |
|---|---|---|
| `infobox` | the outer `<aside>` | The root box. Selector for box-level styles (max-width, float, border, background). |
| `infobox-header` | the title `<div>` | The top header cell. Bold, centred or left-aligned, slightly larger than body text. |
| `infobox-image` | the image `<figure>` | Wraps the image element when present. |
| `infobox-caption` | the caption `<figcaption>` | Underneath the image, smaller text. |
| `infobox-row` | a label/value row `<div>` | The dominant row type; two-column key/value layout. |
| `infobox-label` | the label cell of a row | Left column; usually bolder and narrower. |
| `infobox-data` | the data cell of a row | Right column; usually wider and lighter. |
| `infobox-section-header` | a section divider `<div>` | Spans both columns; tonal background tint. |
| `infobox-below` | the footer block `<div>` | Full-width freeform area at the bottom. |

The named wrapper also emits a **`data-infobox-type="{slug}"`** attribute on
the outer `<aside>`. This is the per-template SCSS hook: any visual tweak
specific to one shortcode (e.g. a portrait aspect ratio for `person`) is a
single SCSS rule keyed on `[data-infobox-type="{slug}"]`. Per-template
SCSS files are prohibited by `.cursor/rules/00-core.mdc`; all per-template
rules live in the one `infobox.scss` file, keyed on the attribute.

The CSS hook contract is **fixed** for v1. Adding a new class name is a
plan-level change: it would require updating every named wrapper that
emits it, every special partial that uses it, and `infobox.scss` in the
same commit. New visual behaviours should be expressed as a new
attribute on the outer `<aside>` (e.g. `data-state="collapsed"`) or a
modifier on an existing class, not as a new class name.

---

## §7. Responsiveness

The infobox follows the rendered pattern observed on Wikipedia and the
Mobile-Friendly guidance in `Wikipedia:Manual of Style/Infoboxes`:

- **Desktop / wide viewport** (above the theme's configured mobile
  breakpoint): the infobox is floated to the right with a max-width
  (~22em per MoS, ~300px on standard desktop), and the body text wraps
  around it on the left. The `data-infobox-type` attribute on the outer
  `<aside>` is the SCSS hook the floating rule attaches to.
- **Mobile / narrow viewport** (below the breakpoint): the float is
  collapsed. The infobox becomes a full-width block, typically
  repositioned above the lead's first paragraph continuation or just
  below the lead — never floated alongside body text.

The breakpoint is the same one Phase 3 / Phase 5 adopt for the rest of
the Vector 2022 chrome (sidebar, ToC, sticky header). The infobox does
not redefine it; it follows whatever the site author configures as
"mobile" via `theme.toml`. The two-state commitment (floated at wide,
stacked at narrow) is what the §6.3 responsiveness decision in
`docs/RESEARCH.md` locks in. There is no intermediate "tablet" state in
v1.

---

## §8. Out of scope for v1

The following are explicitly **not** shipped in v1, with the rationale
recorded here so a future reader can tell scoping from oversight:

- **Geographic coordinate maps.** Upstream `{{coord}}` and the interactive
  map embed used by `settlement`, `country`, etc. pull in a JS map widget
  and an external tile service at runtime — incompatible with
  `public/`-as-static-output per `.cursor/rules/00-core.mdc`. Coordinates
  as **text** (decimal lat/long or `°N/°E`) are still accepted by the
  relevant shortcodes; only the map widget is excluded.
- **Embedded mini-charts and timelines.** Population-trend sparklines,
  length-of-reign bars, and similar in-box visualisations. Out of scope as
  image-generation; raw text data is still representable via `infobox-row`.
- **Collapsible sub-tables inside the infobox itself.** Nested
  per-season-statistics tables in sport-biography forks. Authors who need
  one can link to an external page or carry a per-template concrete
  decision in a later phase.
- **Wikidata property tracking.** The `P18` / `P946` / `P17` fallbacks
  the upstream templates perform against the live Wikidata API. Out of
  scope; the theme has no runtime to call an external lookup service.
- **Lua / Scribunto modules.** Every upstream template's runtime data
  shaping (`Module:Person date`, `Module:Coordinates`, etc.). The
  reimplementation accepts raw user-supplied strings and does not
  canonicalise.
- **Wikipedia microformat emission.** `hCard` / `hCalendar` markup on
  the rendered infobox. Relevant only if the theme is consumed by
  external Wikipedia-data scrapers, which is not the target use case.
- **Nested shortcodes as param values.** Hugo's shortcode parser
  evaluates params as raw strings, so `{{< settlement pushpin_map=<map …> >}}`
  does not render. Authors who need a nested value use the inner-primitive
  escape hatch in §5.3 instead. This is **future work**, not a permanent
  cut.

Each item above could be re-evaluated by a follow-on phase if there is
concrete author demand. Adding any of them is the §8 procedure in
`docs/RESEARCH.md` — it does not require theme recompilation for the
naming and rendering layers, but does require a plan amendment for any
new runtime dependency.

---

## §9. Future work

Items that are **deliberately deferred** from v1 to a follow-on phase,
with the trigger condition for picking them up:

- **`{{< cite-ref >}}` / `{{< references >}}` citation shortcodes.** ~~Mimicking
  Wikipedia's footnote / references-list pattern.~~ **Shipped, no
  front matter required.** The shortcodes drive off the Markdown
  footnote block (`[^key]: text`) at the bottom of the article body —
  see `layouts/_shortcodes/cite-ref.html` and
  `layouts/_shortcodes/references.html`. Goldmark's auto-footnote
  renderer is suppressed via `[markup.goldmark.extensions.footnote]
  enable = false` in `hugo.toml`. Worked example in
  `exampleSite/content/articles/long-article-with-toc.md`.
- **Nested shortcodes as param values.** See §8 last bullet. Trigger
  condition: a follow-on phase adopts a Hugo version that supports
  evaluating shortcodes inside param values, or the theme moves to a
  build-time templating step that pre-resolves them. Without one of
  those, nesting is the §5.3 escape-hatch territory.
- **Per-template CSS files.** Currently prohibited by
  `.cursor/rules/00-core.mdc`. All per-template visual tweaks must
  collapse into a single attribute-selector rule in `infobox.scss`.
  Trigger condition for revisiting: a future per-template rule grows past
  what a single attribute selector can express, which would suggest the
  visual contract itself should move to a per-template partial. Until
  then, one SCSS file is the rule.
- **Phase 8 — per-template entries.** Each of the 30 named shortcodes in
  `docs/RESEARCH.md` §7 will get its own sub-section in §10 of this file
  when Phase 8 lands: one-line description, parameter table matching the
  upstream MediaWiki docs, a worked example in MediaWiki form side-by-side
  with the Hugo form, and a "see also" link to the upstream template
  documentation on `en.wikipedia.org`. The Authoring Guide above is the
  whole document until that phase ships.

---

## §10. Per-template reference

One sub-section per shipped named shortcode, in the order from
`docs/RESEARCH.md` §7. Each entry follows the same shape: a one-line intent
statement, the most-used parameters, a worked example in Hugo shortcode form,
and a "see also" link to the upstream MediaWiki template documentation on
`en.wikipedia.org`. The full parameter list lives in the comment block at the
top of each wrapper file under `layouts/_shortcodes/{name}.html` — that
header comment is the source of truth, this section is the human-readable
companion.

> **Per-shortcode quick-reference.** Each named shortcode also has a
> standalone page under [`docs/shortcodes/<slug>.md`](shortcodes/README.md)
> with the full parameter table, a worked example, and the upstream
> Wikipedia link. That directory is the author-facing reference; this
> section is the in-architecture-doc companion.

> **Note on self-closing vs paired.** Hugo 0.146.0+ distinguishes paired from
> self-closing shortcodes at parse time based on whether the template
> references `.Inner`. Every named wrapper in this family does, so all
> examples below use the **paired form** (`{{< name … >}}…{{< /name >}}`)
> even when there is no body content. The empty-body paired form is still
> valid Hugo and matches what the Markdown author writes for the named
> infobox family. The inner-primitive escape hatch (e.g. `{{< infobox-row … >}}`)
> supports both forms because each primitive template reads `.Get` only.

### `{{< cite-ref "key" >}}`
**Intent:** Inline citation marker. Pairs with `{{< references >}}` to
produce the Wikipedia "References" footer pattern. Each marker renders
as a small bracketed superscript that links down to the matching entry
in the references list and back.
**Parameters:** The first positional argument is the citation key; it
must match a `[^key]: text` Markdown footnote definition somewhere in
the article body. The Markdown footnote syntax is exactly what
[markdownguide.org/extended-syntax/#footnotes](https://www.markdownguide.org/extended-syntax/#footnotes)
documents.
**Worked example:**

```go
… and the figures corroborate this {{< cite-ref "smith2026" >}} …

{{< references >}}

[^smith2026]: J. Smith, *A History of Footnotes*. Publisher, 2026.
```

The shortcode is named `cite-ref` to avoid colliding with Hugo's
built-in `{{< ref >}}` (page-relative URL helper, used throughout the
example site to link from the home page to article demos).

### `{{< references >}}`
**Intent:** Renders the Wikipedia-style `<section class="mw-references-wrap">`
footer block from the Markdown footnote definitions (`[^key]: text`) at
the bottom of the article body, in the order each citation was first
used. Goldmark's auto-footnote renderer is suppressed via
`[markup.goldmark.extensions.footnote] enable = false` in `hugo.toml`
so this shortcode is the only references block the page emits.
**Parameters:** None.
**Worked example:** see `{{< cite-ref >}}` above.

### `{{< settlement >}}`
**Intent:** Settlement / city / town / village infobox — replicates `Template:Infobox settlement` from Wikipedia.
**Most-used parameters:** `name`, `image`, `caption`, `alt`, `country`, `subdivision_type1`, `subdivision_name1`, `coordinates`, `population_total`, `population_as_of`, `area_total_km2`, `established_title1`, `established_date1`, `leader_title`, `leader_name`, `timezone`, `postal_code`, `area_code`, `website`, `below`.
**Worked example:**

```go
{{< settlement
    name        = "Springfield"
    image       = "springfield.jpg"
    caption     = "Downtown Springfield"
    country     = "United States"
    coordinates = "39.7817°N 89.6501°W"
    population_total = "114,738"
    area_total_km2  = "171.2"
    leader_title    = "Mayor"
    leader_name     = "Misty Vela"
>}}{{< /settlement >}}
```

**See also:** <https://en.wikipedia.org/wiki/Template:Infobox_settlement>

### `{{< person >}}`
**Intent:** Person infobox — replicates `Template:Infobox person` from Wikipedia (~570k transclusions, the second-most-used infobox template).
**Most-used parameters:** `name`, `image`, `caption`, `alt`, `birth_date`, `birth_place`, `death_date`, `death_place`, `nationality`, `occupation`, `years_active`, `known_for`, `notable_works`, `website`, `below`.
**Worked example:**

```go
{{< person
    name        = "Ada Lovelace"
    image       = "ada.jpg"
    caption     = "Portrait of Ada Lovelace, 1843"
    birth_date  = "10 December 1815"
    birth_place = "London, England"
    death_date  = "27 November 1852"
    occupation  = "Mathematician, writer"
    notable_works = "*Notes on the Analytical Engine*"
>}}{{< /person >}}
```

**See also:** <https://en.wikipedia.org/wiki/Template:Infobox_person>; for upstream parameters this wrapper does not yet accept (e.g. astronaut-specific `Spouse`, `Partner`, `Missions`, `Mission insignia`, `Time in space`, `Selection`, `Retirement`), see [`docs/SHORTCODE-GAPS.md`](SHORTCODE-GAPS.md#person).

### `{{< football-biography >}}`
**Intent:** Football (soccer) player biography infobox — replicates `Template:Infobox football biography` from Wikipedia (~218k transclusions).
**Most-used parameters:** `name`, `full_name`, `birth_date`, `birth_place`, `death_date`, `death_place`, `height`, `position`, `current_club`, `youth_years`, `youth_clubs`, `years`, `clubs`, `nationalyears`, `nationalteam`, `nationalcaps`, `nationalgoals`, `below`.
**Worked example:**

```go
{{< football-biography
    name        = "Marta"
    full_name   = "Marta Vieira da Silva"
    birth_date  = "19 February 1986"
    birth_place = "Dois Riachos, Alagoas, Brazil"
    height      = "1.63"
    position    = "Forward"
    clubs       = "Vasco da Gama, Umeå, Orlando Pride"
    nationalcaps = "179"
    nationalgoals = "115"
>}}{{< /football-biography >}}
```

**See also:** <https://en.wikipedia.org/wiki/Template:Infobox_football_biography>

### `{{< film >}}`
**Intent:** Film infobox — replicates `Template:Infobox film` from Wikipedia (~170k transclusions).
**Most-used parameters:** `name`, `director`, `producer`, `writer`, `starring`, `music`, `cinematography`, `editing`, `studio`, `distributor`, `released`, `runtime`, `country`, `language`, `budget`, `gross`, `currency`, `below`.
**Worked example:**

```go
{{< film
    name      = "Inception"
    director  = "Christopher Nolan"
    producer  = "Emma Thomas, Christopher Nolan"
    writer    = "Christopher Nolan"
    starring  = "Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page"
    music     = "Hans Zimmer"
    studio    = "Syncopy Films, Legendary Pictures"
    distributor = "Warner Bros. Pictures"
    released  = "8 July 2010"
    runtime   = "148"
    budget    = "160,000,000"
    gross     = "836,836,967"
    currency  = "USD"
>}}{{< /film >}}
```

**See also:** <https://en.wikipedia.org/wiki/Template:Infobox_film>

### `{{< album >}}`
**Intent:** Music album infobox — replicates `Template:Infobox album` from Wikipedia (~168k transclusions).
**Most-used parameters:** `name`, `type`, `artist`, `cover`, `released`, `recorded`, `studio`, `genre`, `length`, `label`, `producer`, `executive_producer`, `last_album`, `last_album_year`, `next_album`, `next_album_year`, `tracks`, `total_length`, `awards`, `certifications`, `below`.
**Worked example:**

```go
{{< album
    name      = "OK Computer"
    type      = "Studio"
    artist    = "Radiohead"
    cover     = "ok-computer.jpg"
    released  = "21 May 1997"
    recorded  = "1996–1997"
    studio    = "St Catherine's Court, Bath"
    genre     = "Art rock, alternative rock, electronica"
    length    = "53:30"
    label     = "Parlophone, Capitol"
    producer  = "Nigel Godrich, Radiohead"
    tracks    = "12"
>}}{{< /album >}}
```

**See also:** <https://en.wikipedia.org/wiki/Template:Infobox_album>

### `{{< software >}}`
**Intent:** Software / application infobox — replicates `Template:Infobox software` from Wikipedia (~14k transclusions).
**Most-used parameters:** `name`, `logo`, `developer`, `initial_release`, `latest_release`, `latest_release_date`, `latest_preview`, `status`, `operating_system`, `platform`, `available_languages`, `genre`, `license`, `source_model`, `programming_language`, `website`, `repo`, `below`.
**Worked example:**

```go
{{< software
    name              = "Hugo"
    developer         = "spf13, Bjørn Erik Pedersen, and contributors"
    initial_release   = "2013"
    latest_release    = "0.163.3"
    latest_release_date = "2026-06-19"
    status            = "Active"
    operating_system  = "Cross-platform"
    platform          = "Linux, macOS, Windows"
    license           = "Apache-2.0"
    source_model      = "Open-source"
    programming_language = "Go"
>}}{{< /software >}}
```

**See also:** <https://en.wikipedia.org/wiki/Template:Infobox_software>

### `{{< company >}}`
**Intent:** Company / corporation infobox — replicates `Template:Infobox company` from Wikipedia (~92k transclusions).
**Most-used parameters:** `name`, `trade_name`, `type`, `industry`, `founded`, `founder`, `defunct`, `hq_location`, `hq_location_country`, `num_employees`, `num_locations`, `key_people`, `products`, `revenue`, `operating_income`, `net_income`, `assets`, `equity`, `owner`, `parent`, `website`, `below`.
**Worked example:**

```go
{{< company
    name           = "Acme Corporation"
    trade_name     = "Acme Co."
    type           = "Public"
    industry       = "Conglomerate"
    founded        = "1 January 1907"
    founder        = "R. J. Acme"
    hq_location    = "Springfield"
    hq_location_country = "United States"
    key_people     = "W. E. Coyote (CEO)"
    products       = "Anvils, rockets, road runners"
    revenue        = "US$1.2 billion"
>}}{{< /company >}}
```

**See also:** <https://en.wikipedia.org/wiki/Template:Infobox_company>

### `{{< historic-site >}}`
**Intent:** Historic site infobox (canonical alias `nrhp`) — replicates `Template:Infobox NRHP` from Wikipedia (~74k transclusions).
**Most-used parameters:** `name`, `image`, `caption`, `location`, `nearest_city`, `coordinates`, `area`, `built`, `architect`, `architecture`, `added`, `NRHP_ref`, `governing_body`, `owner`, `website`, `below`.
**Worked example:**

```go
{{< historic-site
    name        = "Empire State Building"
    location    = "350 Fifth Avenue, Manhattan, New York City"
    coordinates = "40.7484°N 73.9857°W"
    built       = "1930–1931"
    architect   = "Shreve, Lamb and Harmon"
    architecture = "Art Deco"
    added       = "23 June 1986"
    NRHP_ref    = "86001256"
>}}{{< /historic-site >}}
```

**See also:** <https://en.wikipedia.org/wiki/Template:Infobox_NRHP>

### `{{< television >}}`
**Intent:** Television show infobox — replicates `Template:Infobox television` from Wikipedia (~64k transclusions).
**Most-used parameters:** `name`, `genre`, `creator`, `based_on`, `written_by`, `director`, `starring`, `voices`, `narrated`, `music`, `country_of_origin`, `original_language`, `num_seasons`, `num_episodes`, `executive_producer`, `producer`, `location`, `editor`, `camera`, `runtime`, `network`, `first_aired`, `last_aired`, `related`, `website`, `below`.
**Worked example:**

```go
{{< television
    name             = "Severance"
    genre            = "Science fiction, thriller"
    creator          = "Dan Erickson"
    starring         = "Adam Scott, Britt Lower, Patricia Arquette"
    num_seasons      = "2"
    num_episodes     = "19"
    network          = "Apple TV+"
    first_aired      = "18 February 2022"
    last_aired       = "present"
>}}{{< /television >}}
```

**See also:** <https://en.wikipedia.org/wiki/Template:Infobox_television>

### `{{< station >}}`
**Intent:** Transit / railway station infobox — replicates `Template:Infobox station` from Wikipedia (~57k transclusions).
**Most-used parameters:** `name`, `native_name`, `address`, `country`, `coordinates`, `line`, `connections`, `platforms`, `tracks`, `structure`, `depth`, `levels`, `type`, `opened`, `closed`, `rebuilt`, `electrified`, `ADA`, `code`, `owned`, `operator`, `zone`, `former`, `passengers`, `pass_year`, `pass_rank`, `services`, `below`.
**Worked example:**

```go
{{< station
    name        = "Waterloo"
    native_name = "London Waterloo"
    country     = "United Kingdom"
    coordinates = "51.5031°N 0.1132°W"
    line        = "South Western main line"
    platforms   = "22"
    tracks      = "24"
    opened      = "11 July 1848"
    code        = "WAT"
    operator    = "Network Rail"
>}}{{< /station >}}
```

**See also:** <https://en.wikipedia.org/wiki/Template:Infobox_station>

### `{{< military-person >}}`
**Intent:** Military person infobox — replicates `Template:Infobox military person` from Wikipedia (~54k transclusions).
**Most-used parameters:** `name`, `birth_date`, `birth_place`, `death_date`, `death_place`, `allegiance`, `branch`, `service_years`, `rank`, `unit`, `commands`, `battles`, `awards`, `alma_mater`, `spouse`, `relations`, `children`, `laterwork`, `website`, `below`.
**Worked example:**

```go
{{< military-person
    name          = "Patton"
    birth_date    = "11 November 1885"
    birth_place   = "San Gabriel, California, U.S."
    death_date    = "21 December 1945"
    allegiance    = "United States"
    branch        = "United States Army"
    service_years = "1909–1945"
    rank          = "General"
    battles       = "World War I, World War II"
>}}{{< /military-person >}}
```

**See also:** <https://en.wikipedia.org/wiki/Template:Infobox_military_person>

### `{{< school >}}`
**Intent:** School infobox — replicates `Template:Infobox school` from Wikipedia (~40k transclusions).
**Most-used parameters:** `name`, `motto`, `established`, `closed`, `type`, `affiliation`, `religion`, `president`, `principal`, `dean`, `head`, `faculty`, `staff`, `students`, `grades`, `gender`, `age_range`, `enrolment`, `campus`, `campus_size`, `area`, `colors`, `nickname`, `mascot`, `accreditation`, `website`, `below`.
**Worked example:**

```go
{{< school
    name        = "Springfield High School"
    motto       = "Veritas Lux in Tenebris"
    established = "1889"
    type        = "Public secondary"
    principal   = "John Smith"
    students    = "2,100"
    grades      = "9–12"
    nickname    = "Tigers"
    mascot      = "Tommy Tiger"
    colors      = "Orange and black"
>}}{{< /school >}}
```

**See also:** <https://en.wikipedia.org/wiki/Template:Infobox_school>

### `{{< video-game >}}`
**Intent:** Video game infobox — replicates `Template:Infobox video game` from Wikipedia (~30k transclusions).
**Most-used parameters:** `name`, `cover_art`, `developer`, `publisher`, `director`, `producer`, `designer`, `programmer`, `artist`, `writer`, `composer`, `series`, `engine`, `platform`, `initial_release_date`, `latest_release`, `genre`, `modes`, `requirements`, `ratings`, `input`, `language`, `format`, `status`, `website`, `below`.
**Worked example:**

```go
{{< video-game
    name      = "Hades"
    developer = "Supergiant Games"
    publisher = "Supergiant Games"
    director  = "Greg Kasavin"
    composer  = "Darren Korb"
    engine    = "Hades Engine"
    platform  = "Windows, macOS, Nintendo Switch"
    initial_release_date = "17 September 2020"
    latest_release = "1.0"
    genre     = "Roguelike"
    modes     = "Single-player"
    status    = "Released"
>}}{{< /video-game >}}
```

**See also:** <https://en.wikipedia.org/wiki/Template:Infobox_video_game>

### `{{< university >}}`
**Intent:** University / college infobox — replicates `Template:Infobox university` from Wikipedia (~26k transclusions).
**Most-used parameters:** `name`, `motto`, `motto_language`, `established`, `closed`, `type`, `affiliation`, `endowment`, `budget`, `president`, `chancellor`, `dean`, `faculty`, `students`, `undergrad`, `postgrad`, `doctoral`, `city`, `state`, `country`, `campus`, `colors`, `mascot`, `nickname`, `sporting_affiliations`, `website`, `below`.
**Worked example:**

```go
{{< university
    name        = "Massachusetts Institute of Technology"
    motto       = "Mens et Manus"
    established = "1861"
    type        = "Private research university"
    endowment   = "US$24.6 billion"
    president   = "Sally Kornbluth"
    students    = "11,934"
    city        = "Cambridge"
    state       = "Massachusetts"
    country     = "United States"
    colors      = "Cardinal red and silver gray"
    mascot      = "Tim the Beaver"
>}}{{< /university >}}
```

**See also:** <https://en.wikipedia.org/wiki/Template:Infobox_university>

### `{{< military-unit >}}`
**Intent:** Military unit infobox — replicates `Template:Infobox military unit` from Wikipedia (~29k transclusions).
**Most-used parameters:** `name`, `start_date`, `end_date`, `country`, `allegiance`, `branch`, `type`, `role`, `size`, `command`, `garrison`, `nickname`, `patron`, `motto`, `colors`, `march`, `battles`, `anniversaries`, `decorations`, `commander`, `notable_commanders`, `identification_symbol`, `website`, `below`.
**Worked example:**

```go
{{< military-unit
    name        = "101st Airborne Division"
    start_date  = "15 August 1942"
    country     = "United States"
    branch      = "United States Army"
    type        = "Airborne infantry"
    role        = "Air assault"
    garrison    = "Fort Campbell, Kentucky"
    nickname    = "Screaming Eagles"
    motto       = "Rendezvous with Destiny"
    commander   = "Major General Andrew C. Hilmes"
>}}{{< /military-unit >}}
```

**See also:** <https://en.wikipedia.org/wiki/Template:Infobox_military_unit>

### `{{< basketball-biography >}}`
**Intent:** Basketball player biography infobox — replicates `Template:Infobox basketball biography` from Wikipedia (~23k transclusions).
**Most-used parameters:** `name`, `birth_date`, `birth_place`, `death_date`, `death_place`, `nationality`, `height`, `weight`, `position`, `jersey_number`, `high_school`, `college`, `draft_year`, `draft_round`, `draft_pick`, `draft_team`, `career_start`, `career_end`, `hall_of_fame`, `highlights`, `stats`, `below`.
**Worked example:**

```go
{{< basketball-biography
    name        = "Lisa Leslie"
    birth_date  = "7 July 1972"
    birth_place = "Gardena, California, U.S."
    nationality = "American"
    height      = "1.96"
    position    = "Center"
    college     = "USC"
    draft_year  = "1997"
    draft_pick  = "7"
    draft_team  = "Los Angeles Sparks"
>}}{{< /basketball-biography >}}
```

**See also:** <https://en.wikipedia.org/wiki/Template:Infobox_basketball_biography>

### `{{< baseball-biography >}}`
**Intent:** Baseball player biography infobox — replicates `Template:Infobox baseball biography` from Wikipedia (~30k transclusions).
**Most-used parameters:** `name`, `birth_date`, `birth_place`, `death_date`, `death_place`, `bats`, `throws`, `debut`, `final_game`, `position`, `team`, `teams`, `highlights`, `awards`, `hall_of_fame`, `stat1label`, `stat1value`, `stat2label`, `stat2value`, `stat3label`, `stat3value`, `below`.
**Worked example:**

```go
{{< baseball-biography
    name      = "Babe Ruth"
    birth_date = "6 February 1895"
    birth_place = "Baltimore, Maryland, U.S."
    bats      = "Left"
    throws    = "Left"
    debut     = "11 July 1914"
    final_game = "30 May 1935"
    position  = "Outfielder, pitcher"
    teams     = "Boston Red Sox, New York Yankees"
    hall_of_fame = "Inducted 1936"
>}}{{< /baseball-biography >}}
```

**See also:** <https://en.wikipedia.org/wiki/Template:Infobox_baseball_biography>

### `{{< football-club >}}`
**Intent:** Football (soccer) club infobox — replicates `Template:Infobox football club` from Wikipedia (~29k transclusions).
**Most-used parameters:** `name`, `logo`, `full_name`, `nickname`, `founded`, `dissolved`, `ground`, `capacity`, `owntitle`, `owner`, `chrtitle`, `chairman`, `ceo`, `mgrtitle`, `manager`, `coach`, `league`, `position`, `season`, `website`, `below`.
**Worked example:**

```go
{{< football-club
    name      = "Manchester United"
    full_name = "Manchester United Football Club"
    nickname  = "The Red Devils"
    founded   = "1878"
    ground    = "Old Trafford"
    capacity  = "74,310"
    manager   = "Erik ten Hag"
    league    = "Premier League"
>}}{{< /football-club >}}
```

**See also:** <https://en.wikipedia.org/wiki/Template:Infobox_football_club>

### `{{< military-conflict >}}`
**Intent:** Military conflict / battle / war infobox — replicates `Template:Infobox military conflict` from Wikipedia (~28k transclusions).
**Most-used parameters:** `name`, `conflict`, `part_of`, `date_start`, `date_end`, `place`, `location`, `coordinates`, `territory`, `result`, `status`, `combatant1`, `combatant2`, `commander1`, `commander2`, `strength1`, `strength2`, `casualties1`, `casualties2`, `civilian_deaths`, `military_deaths`, `total_deaths`, `notes`, `website`, `below`.
**Worked example:**

```go
{{< military-conflict
    name        = "Battle of Gettysburg"
    part_of     = "American Civil War"
    date_start  = "1 July 1863"
    date_end    = "3 July 1863"
    place       = "Gettysburg, Pennsylvania, United States"
    result      = "Union victory"
    combatant1  = "United States (Union)"
    combatant2  = "Confederate States"
>}}{{< /military-conflict >}}
```

**See also:** <https://en.wikipedia.org/wiki/Template:Infobox_military_conflict>

### `{{< tennis-tournament-event >}}`
**Intent:** Tennis tournament event infobox — replicates `Template:Infobox tennis tournament event` from Wikipedia (~22k transclusions).
**Most-used parameters:** `name`, `tournament`, `tour`, `type`, `category`, `draw`, `surface`, `location`, `place`, `venue`, `coordinates`, `date`, `edition`, `champ_name`, `runner_name`, `score`, `prize_money`, `attendance`, `seeds`, `players`, `main_draw`, `website`, `below`.
**Worked example:**

```go
{{< tennis-tournament-event
    name      = "2024 Wimbledon Championships – Men's singles"
    tournament = "Wimbledon Championships"
    tour      = "Grand Slam"
    draw      = "128S / 64Q"
    surface   = "Grass"
    location  = "Wimbledon, London"
    venue     = "All England Lawn Tennis and Croquet Club"
    date      = "1–14 July 2024"
    champ_name = "Carlos Alcaraz"
>}}{{< /tennis-tournament-event >}}
```

**See also:** <https://en.wikipedia.org/wiki/Template:Infobox_tennis_tournament_event>

### `{{< ice-hockey-biography >}}`
**Intent:** Ice hockey player biography infobox — replicates `Template:Infobox ice hockey biography` from Wikipedia (~21k transclusions).
**Most-used parameters:** `name`, `birth_date`, `birth_place`, `death_date`, `death_place`, `height`, `weight`, `position`, `shoots`, `catches`, `played_for`, `national_team`, `draft_year`, `draft_team`, `draft_round`, `draft_pick`, `career_start`, `career_end`, `career_position`, `hall_of_fame`, `website`, `below`.
**Worked example:**

```go
{{< ice-hockey-biography
    name        = "Connor McDavid"
    birth_date  = "13 January 1997"
    birth_place = "Richmond Hill, Ontario, Canada"
    height      = "188"
    weight      = "88"
    position    = "Center"
    shoots      = "Left"
    played_for  = "Erie Otters, Edmonton Oilers"
    national_team = "Canada"
    draft_year  = "2015"
    draft_team  = "Edmonton Oilers"
>}}{{< /ice-hockey-biography >}}
```

**See also:** <https://en.wikipedia.org/wiki/Template:Infobox_ice_hockey_biography>

### `{{< organization >}}`
**Intent:** Organization infobox — replicates `Template:Infobox organization` from Wikipedia (~43k transclusions).
**Most-used parameters:** `name`, `native_name`, `logo`, `type`, `industry`, `founded`, `founder`, `defunct`, `hq_location`, `hq_location_country`, `coordinates`, `area_served`, `members`, `employees`, `volunteers`, `budget`, `key_people`, `products`, `services`, `parent`, `subsidiaries`, `affiliations`, `motto`, `formation`, `dissolution`, `registration_id`, `status`, `purpose`, `language`, `leader_name`, `leader_title`, `website`, `below`.
**Worked example:**

```go
{{< organization
    name           = "Wikimedia Foundation"
    logo           = "wikimedia-logo.svg"
    type           = "501(c)(3) nonprofit"
    founded        = "20 June 2003"
    founder        = "Jimmy Wales"
    hq_location    = "San Francisco, California"
    hq_location_country = "United States"
    area_served    = "Worldwide"
    key_people     = "Maryana Iskander (CEO)"
>}}{{< /organization >}}
```

**See also:** <https://en.wikipedia.org/wiki/Template:Infobox_organization>

### `{{< award >}}`
**Intent:** Award / prize infobox — replicates `Template:Infobox award` from Wikipedia (~16k transclusions).
**Most-used parameters:** `name`, `awarded_for`, `presenter`, `country`, `host`, `location`, `year`, `established`, `first_awarded`, `last_awarded`, `website`, `related`, `higher`, `lower`, `total`, `total_recipients`, `categories`, `network`, `viewership`, `below`.
**Worked example:**

```go
{{< award
    name          = "Academy Award for Best Picture"
    awarded_for   = "Excellence in cinematic achievements"
    presenter     = "Academy of Motion Picture Arts and Sciences"
    country       = "United States"
    established   = "16 May 1929"
    first_awarded = "1929"
>}}{{< /award >}}
```

**See also:** <https://en.wikipedia.org/wiki/Template:Infobox_award>

### `{{< television-episode >}}`
**Intent:** Television episode infobox — replicates `Template:Infobox television episode` from Wikipedia (~13k transclusions).
**Most-used parameters:** `name`, `series`, `season`, `episode`, `director`, `writer`, `teleplay`, `story`, `based_on`, `narrator`, `presenter`, `starring`, `guests`, `music`, `camera`, `editor`, `producer`, `executive_producer`, `airdate`, `network`, `production_code`, `runtime`, `channel`, `prev`, `next`, `episode_list`, `website`, `below`.
**Worked example:**

```go
{{< television-episode
    name        = "Ozymandias"
    series      = "Breaking Bad"
    season      = "5"
    episode     = "14"
    director    = "Rian Johnson"
    writer      = "Moira Walley-Beckett"
    airdate     = "15 September 2013"
    network     = "AMC"
    runtime     = "47"
>}}{{< /television-episode >}}
```

**See also:** <https://en.wikipedia.org/wiki/Template:Infobox_television_episode>

### `{{< church >}}`
**Intent:** Church / religious building infobox — replicates `Template:Infobox church` from Wikipedia (~17k transclusions).
**Most-used parameters:** `name`, `dedication`, `denomination`, `previous_denomination`, `status`, `heritage_designation`, `functional_status`, `location`, `country`, `coordinates`, `architecture_style`, `founded`, `founder`, `completed`, `capacity`, `length`, `width`, `nave`, `transept`, `tower_height`, `spire_height`, `materials`, `diocese`, `parish`, `archbishop`, `bishop`, `website`, `below`.
**Worked example:**

```go
{{< church
    name        = "St. Patrick's Cathedral"
    dedication  = "Saint Patrick"
    denomination = "Catholic (Roman)"
    location    = "New York City"
    country     = "United States"
    coordinates = "40.7587°N 73.9757°W"
    architecture_style = "Gothic Revival"
    founded     = "1809"
    completed   = "1878"
    capacity    = "2,400"
>}}{{< /church >}}
```

**See also:** <https://en.wikipedia.org/wiki/Template:Infobox_church>

### `{{< television-season >}}`
**Intent:** Television season infobox — replicates `Template:Infobox television season` from Wikipedia (~11k transclusions).
**Most-used parameters:** `name`, `series_name`, `season_number`, `num_episodes`, `host`, `starring`, `judges`, `director`, `presenter`, `narrator`, `music`, `country`, `network`, `channel`, `first_aired`, `last_aired`, `episode_list`, `prev_season`, `next_season`, `website`, `below`.
**Worked example:**

```go
{{< television-season
    name          = "Breaking Bad — Season 5"
    series_name   = "Breaking Bad"
    season_number = "5"
    num_episodes  = "16"
    network       = "AMC"
    first_aired   = "15 July 2012"
    last_aired    = "29 September 2013"
>}}{{< /television-season >}}
```

**See also:** <https://en.wikipedia.org/wiki/Template:Infobox_television_season>

### `{{< political-party >}}`
**Intent:** Political party infobox — replicates `Template:Infobox political party` from Wikipedia (~16k transclusions).
**Most-used parameters:** `name`, `logo`, `abbreviation`, `leader`, `founder`, `founder2`, `founded`, `dissolved`, `split`, `merged`, `headquarters`, `country`, `ideology`, `position`, `european`, `international`, `youth_wing`, `wing`, `membership`, `slogan`, `anthem`, `colors`, `seats1_title`, `seats1`, `seats2_title`, `seats2`, `website`, `below`.
**Worked example:**

```go
{{< political-party
    name        = "Green Party of England and Wales"
    abbreviation = "GPEW"
    leader      = "Co-leaders"
    founded     = "1990"
    headquarters = "London"
    country     = "United Kingdom"
    ideology    = "Green politics, eco-socialism"
    position    = "Left-wing"
    colors      = "Green"
>}}{{< /political-party >}}
```

**See also:** <https://en.wikipedia.org/wiki/Template:Infobox_political_party>

### `{{< protected-area >}}`
**Intent:** Protected area / national park infobox — replicates `Template:Infobox protected area` from Wikipedia (~15k transclusions).
**Most-used parameters:** `name`, `alt_name`, `location`, `nearest_city`, `coordinates`, `area`, `established`, `named_for`, `visitation_num`, `visitation_year`, `governing_body`, `administrator`, `owner`, `website`, `iucn_category`, `designation`, `created`, `world_heritage_site`, `below`.
**Worked example:**

```go
{{< protected-area
    name        = "Yellowstone National Park"
    location    = "Wyoming, Montana, Idaho"
    coordinates = "44.4280°N 110.5885°W"
    area        = "2,219,791 acres (8,987 km²)"
    established = "1 March 1872"
    governing_body = "U.S. National Park Service"
    iucn_category = "II (national park)"
>}}{{< /protected-area >}}
```

**See also:** <https://en.wikipedia.org/wiki/Template:Infobox_protected_area>

### `{{< election >}}`
**Intent:** Election infobox — replicates `Template:Infobox election` from Wikipedia (~40k transclusions).
**Most-used parameters:** `name`, `country`, `type`, `ongoing`, `previous_election`, `next_election`, `seats_for_election`, `majority_seats`, `election_date`, `turnout`, `opinion_polling`, `candidate`, `leader`, `party`, `alliance`, `last_election`, `seats_won`, `seats_before`, `popular_vote`, `percentage`, `swing`, `results`, `leader2`, `party2`, `last_election2`, `seats_won2`, `seats_before2`, `popular_vote2`, `percentage2`, `swing2`, `below`.
**Worked example:**

```go
{{< election
    name            = "2024 United States presidential election"
    country         = "United States"
    type            = "Presidential"
    election_date   = "5 November 2024"
    turnout         = "63.9%"
    leader          = "Donald Trump"
    party           = "Republican"
    seats_won       = "312 electoral votes"
    percentage      = "49.8%"
>}}{{< /election >}}
```

**See also:** <https://en.wikipedia.org/wiki/Template:Infobox_election>

### `{{< country >}}`
**Intent:** Country / sovereign state infobox — replicates `Template:Infobox country` from Wikipedia (~7k transclusions of the canonical form).
**Most-used parameters:** `name`, `native_name`, `alt_name`, `motto`, `anthem`, `royal_anthem`, `image_flag`, `image_coat`, `symbol`, `symbol_type`, `capital`, `largest_city`, `official_languages`, `recognized_languages`, `regional_languages`, `ethnic_groups`, `religion`, `demonym`, `government`, `leader_title1`, `leader_name1`, `leader_title2`, `leader_name2`, `sovereignty_type`, `established_event1`, `established_date1`, `area_km2`, `area_rank`, `percent_water`, `population_estimate`, `population_estimate_rank`, `population_census`, `population_density_km2`, `GDP_PPP`, `GDP_PPP_year`, `GDP_nominal`, `GDP_nominal_year`, `GDP_nominal_rank`, `Gini`, `HDI`, `currency`, `timezone`, `drives_on`, `calling_code`, `patron_saint`, `website`, `below`.
**Worked example:**

```go
{{< country
    name               = "France"
    native_name        = "République française"
    motto              = "Liberté, Égalité, Fraternité"
    capital            = "Paris"
    official_languages = "French"
    demonym            = "French"
    government         = "Unitary semi-presidential republic"
    leader_title1      = "President"
    leader_name1       = "Emmanuel Macron"
    area_km2           = "643,801"
    population_estimate = "68,070,000"
    currency           = "Euro (€) (EUR)"
>}}{{< /country >}}
```

**See also:** <https://en.wikipedia.org/wiki/Template:Infobox_country>

## §11. Provenance table (third plan, phase 7+)

The 30 named `Infobox <topic>` shortcodes under `layouts/_shortcodes/`
are all derived from Wikipedia's `Template:Infobox <topic>` (or its
backing Lua module). The per-template dual-header cites the upstream
fetch date and license; the table below records the URL used to fetch
each template, the fetched byte size, and the date of fetch. All
templates fetched 2026-07-11 are stored under `/tmp/wiki-templates/`
during the port and the byte sizes are from those local copies.

| Shortcode | URL | Bytes | License |
|---|---|---|---|
| `album` | <https://en.wikipedia.org/wiki/Template:Infobox_album?action=raw> | 7,242 | CC BY-SA 4.0 |
| `award` | <https://en.wikipedia.org/wiki/Template:Infobox_award?action=raw> | 9,606 | CC BY-SA 4.0 |
| `baseball-biography` | <https://en.wikipedia.org/wiki/Template:Infobox_baseball_biography?action=raw> | 15,689 | CC BY-SA 4.0 |
| `basketball-biography` | <https://en.wikipedia.org/wiki/Template:Infobox_basketball_biography?action=raw> | 16,125 | CC BY-SA 4.0 |
| `church` | <https://en.wikipedia.org/wiki/Template:Infobox_church?action=raw> | 9,628 | CC BY-SA 4.0 |
| `company` | <https://en.wikipedia.org/wiki/Template:Infobox_company?action=raw> | 12,900 | CC BY-SA 4.0 |
| `country` | <https://en.wikipedia.org/wiki/Template:Infobox_country?action=raw> | 50,951 | CC BY-SA 4.0 |
| `election` | <https://en.wikipedia.org/wiki/Template:Infobox_election?action=raw> | 27,785 | CC BY-SA 4.0 |
| `film` | <https://en.wikipedia.org/wiki/Template:Infobox_film?action=raw> | 4,224 | CC BY-SA 4.0 |
| `football-biography` | <https://en.wikipedia.org/wiki/Template:Infobox_football_biography?action=raw> | 36,036 | CC BY-SA 4.0 |
| `football-club` | <https://en.wikipedia.org/wiki/Template:Infobox_football_club?action=raw> | 6,545 | CC BY-SA 4.0 |
| `historic-site` | <https://en.wikipedia.org/wiki/Template:Infobox_NRHP?action=raw> | 15,509 | CC BY-SA 4.0 |
| `ice-hockey-biography` | <https://en.wikipedia.org/wiki/Template:Infobox_ice_hockey_biography?action=raw> | 8,217 | CC BY-SA 4.0 |
| `military-conflict` | <https://en.wikipedia.org/wiki/Template:Infobox_military_conflict?action=raw> + `Module:Infobox_military_conflict` | 1,011 + 9,027 | CC BY-SA 4.0 |
| `military-person` | <https://en.wikipedia.org/wiki/Template:Infobox_military_person?action=raw> | 6,760 | CC BY-SA 4.0 |
| `military-unit` | <https://en.wikipedia.org/wiki/Template:Infobox_military_unit?action=raw> | 9,791 | CC BY-SA 4.0 |
| `organization` | <https://en.wikipedia.org/wiki/Template:Infobox_organization?action=raw> | 11,064 | CC BY-SA 4.0 |
| `person` | <https://en.wikipedia.org/wiki/Template:Infobox_person?action=raw> | 12,531 | CC BY-SA 4.0 |
| `political-party` | <https://en.wikipedia.org/wiki/Template:Infobox_political_party?action=raw> | 12,664 | CC BY-SA 4.0 |
| `protected-area` | <https://en.wikipedia.org/wiki/Template:Infobox_protected_area?action=raw> | 6,581 | CC BY-SA 4.0 |
| `school` | <https://en.wikipedia.org/wiki/Template:Infobox_school?action=raw> | 23,469 | CC BY-SA 4.0 |
| `settlement` | <https://en.wikipedia.org/wiki/Template:Infobox_settlement?action=raw> | 61,925 | CC BY-SA 4.0 |
| `software` | <https://en.wikipedia.org/wiki/Template:Infobox_software?action=raw> | 9,310 | CC BY-SA 4.0 |
| `station` | <https://en.wikipedia.org/wiki/Template:Infobox_station?action=raw> | 15,185 | CC BY-SA 4.0 |
| `television` | <https://en.wikipedia.org/wiki/Template:Infobox_television?action=raw> | 9,366 | CC BY-SA 4.0 |
| `television-episode` | <https://en.wikipedia.org/wiki/Template:Infobox_television_episode?action=raw> | 5,806 | CC BY-SA 4.0 |
| `television-season` | <https://en.wikipedia.org/wiki/Template:Infobox_television_season?action=raw> | 6,019 | CC BY-SA 4.0 |
| `tennis-tournament-event` | <https://en.wikipedia.org/wiki/Template:Infobox_tennis_tournament_event?action=raw> | 6,928 | CC BY-SA 4.0 |
| `university` | <https://en.wikipedia.org/wiki/Template:Infobox_university?action=raw> | 9,391 | CC BY-SA 4.0 |
| `video-game` | <https://en.wikipedia.org/wiki/Template:Infobox_video_game?action=raw> | 11,210 | CC BY-SA 4.0 |

All fetches completed successfully on 2026-07-11 against the live
`en.wikipedia.org` wiki using the `?action=raw` API. The conditional
logic extracted from each source is documented inline in the file
header of each named shortcode — see the "Conditionals ported from
..." block at the top of each `layouts/_shortcodes/<topic>.html`.

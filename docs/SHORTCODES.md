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
│  layouts/shortcodes/{slug}/{slug}.html                           │
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
│  layouts/shortcodes/infobox/infobox-{primitive}.html             │
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
at `layouts/shortcodes/{slug}/{slug}.html` per the folder-per-shortcode rule
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
layer 3. All live at `layouts/shortcodes/infobox/infobox-{name}.html`
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

- **`{{< ref >}}` / `{{< reflist >}}` citation shortcodes.** Mimicking
  Wikipedia's footnote / references-list pattern. Already noted in
  `.plans/first-plan/08-infobox-shortcode-spec.md` §7 as a stretch goal.
  Only attempt after Phase 13's DoD is fully green for the infobox family
  and the rest of the theme. Trigger condition: a concrete site author
  need for inline citation rendering.
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

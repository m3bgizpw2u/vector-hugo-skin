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

The Fourth Plan rebuilt the infobox family **clean-slate** in 2026-07 and
ships a single public surface — **eight shortcodes** under
`layouts/_shortcodes/` — that compose into any Wikipedia-style infobox
the author needs. There is no separate named-wrapper layer for new
infobox types; everything goes through the v2 primitives.

The eight shortcodes are:

| Shortcode | Form | Purpose |
|---|---|---|
| `infobox` | paired | Outer `<aside class="infobox">` wrapper. Holds the rows, sections, images, and below block. |
| `infobox-section` | paired (or `title=` param) | Section divider that spans both columns. |
| `infobox-row` | paired (or `value=` param) | Label + data row, the most common shape. |
| `infobox-row-full` | paired (or `value=` param) | Label-less, full-width data row (cast lists, sourced citations). |
| `infobox-row-image` | paired | Data row with an inline thumbnail + lightbox-trigger figure. |
| `infobox-image` | single-tag | Additional image block below the main image, for multi-image carousels. |
| `infobox-subheader` | paired (or `value=` param) | Subtitle line under the title. |
| `infobox-below` | paired (or `value=` param) | Footer block at the bottom of the box. |

All eight are **paired-form-only**. The paired body is what makes them
work inside another paired shortcode: the shortcode template pulls the
author's Markdown through `.Page.RenderString`, so links, lists, bold,
italic, and **nested shortcodes** (e.g. `{{< figure >}}` or another
`{{< infobox subbox="true">}}`) all render through the same pipeline.
Hugo v0.164.0's shortcode AST scanner inspects `.Inner` references at
the top level of a template and forces paired invocation; every v2
shortcode therefore wraps its body in a `{{ define }}` block so the
scanner sees the right shape and the build does not error with
"shortcode does not evaluate .Inner" — see the comment block at the
top of `layouts/_shortcodes/infobox-row.html` for the rationale.

The author-facing composition rule:

```text
{{< infobox type="person" title="…" >}}

  {{< infobox-row label="…" >}}value or markdown{{</ infobox-row >}}
  {{< infobox-section title="…" >}}
  {{< infobox-row-image label="…" image="…" >}}optional caption + body{{</ infobox-row-image >}}

{{< /infobox >}}
```

A column-floated `<aside>` with a title, body rows organised into
sections, an embedded image, and a footer. The class contract
(`.infobox`, `.infobox-title`, `.infobox-row`, `.infobox-label`,
`.infobox-data`, `.infobox-section-header`, `.infobox-image-block`,
`.infobox-caption`, `.infobox-below`) is what the SCSS hook contract
in §6 keys off.

> **Note on the 30 named wrappers (`{{< person >}}`, `{{< film >}}`,
> etc.).** The 30 named top-level wrappers documented in §10 still
> ship and still accept their existing param dicts. They continue to
> route through `layouts/_partials/infobox/base.html`, a kept-for-
> backwards-compatibility shim that maps the old `.fields`-list /
> `.image` / `.caption` / `.below` contract onto the new
> v2 primitives. **New content should be written against the v2
> primitives directly.** Phase 3-7 will retire the shim when every
> named wrapper has been rewritten to emit the v2 `infobox` outer
> shortcode instead.

---

## §2. Authoring model: the eight v2 shortcodes

Every v2 shortcode is a flat single Hugo template at
`layouts/_shortcodes/<name>.html`. Each declares its parameter list in a
header comment block — that comment is the source of truth; this section
is the human-readable companion. Pairing is mandatory per the §1 note;
use the paired body for any field that may contain Markdown.

### §2.1 `{{< infobox >}}` (paired)

The outer wrapper. Renders `<aside class="infobox" data-infobox-type="…">`.
All other v2 shortcodes are placed inside it as `.Inner` content.

| Parameter | Type | Default | Purpose |
|---|---|---|---|
| `type` | string | `"custom"` | Sets `data-infobox-type` on the root; the SCSS hook the per-type overrides in `assets/css/components/infobox--per-type.scss` key on. |
| `title` | string | `""` | `.infobox-title` text (above the border). |
| `above` | string | `""` | `.infobox-above` text inside the border, above the image. |
| `subheaders` | slice of string | `(empty)` | Repeated `.infobox-subheader` lines below the title. For a single subtitle, prefer the `{{< infobox-subheader >}}` shortcode inside the body. |
| `title-class` | string | `""` | Extra CSS class on `.infobox-title`. |
| `body-class` | string | `""` | Extra CSS class on the root `<aside>` (Wikipedia `bodyclass` pass-through — supports microformats like `vcard biography`). |
| `child` | bool | `false` | Render without border, no title/above/subheader/below — wraps the inner rows as a child module inside the parent infobox. See §3 wrapper pattern. |
| `subbox` | bool | `false` | Same modifier but for full-width data cells (cast lists, track listings). See §3 subbox pattern. |
| `id` | string | `""` | Optional `id` attribute on the root. |

`child` and `subbox` are **mutually exclusive**. Setting both produces
the `child` modifier and silently drops `subbox` — see
`layouts/_partials/infobox/child.html` and §3 for the deterministic
rule.

Worked example:

```text
{{< infobox type="person" title="Sally Ride" body-class="vcard biography" >}}

  {{< infobox-row label="Born" >}}May 26, 1951{{</ infobox-row >}}
  {{< infobox-row label="Died" >}}July 23, 2012{{</ infobox-row >}}

  {{< infobox-section title="Education" >}}
  {{< infobox-row label="Alma mater" >}}Swarthmore; Stanford{{</ infobox-row >}}

{{< /infobox >}}
```

Renders:

```html
<aside class="infobox vcard biography" data-infobox-type="person">
  <div class="infobox-title">Sally Ride</div>
  <div class="infobox-row">
    <div class="infobox-label">Born</div>
    <div class="infobox-data"><p>May 26, 1951</p></div>
  </div>
  <div class="infobox-row">
    <div class="infobox-label">Died</div>
    <div class="infobox-data"><p>July 23, 2012</p></div>
  </div>
  <div class="infobox-section-header">Education</div>
  <div class="infobox-row">
    <div class="infobox-label">Alma mater</div>
    <div class="infobox-data"><p>Swarthmore; Stanford</p></div>
  </div>
</aside>
```

### §2.2 `{{< infobox-section >}}`

Section divider that spans both columns. Both the `title=` parameter and
a paired body are supported — title wins when both are present.

| Parameter | Type | Default | Purpose |
|---|---|---|---|
| `title` | string | `""` (paired body fallback) | Header text. |
| `class` | string | `""` | Extra CSS class. |

```text
{{< infobox-section title="Career" >}}
```

Renders:

```html
<div class="infobox-section-header">Career</div>
```

### §2.3 `{{< infobox-row >}}` (paired)

The label + data row — the most common shape. Value comes from one of
two equivalent sources, in priority order: paired `.Inner` body wins;
the `value=` parameter is the fallback.

| Parameter | Type | Default | Purpose |
|---|---|---|---|
| `label` | string | (required) | Row label text. |
| `value` | string | `""` | Fallback when the paired body is empty. Markdown-rendered. |
| `class` | string | `""` | Extra CSS class on `.infobox-data` (microformats). |
| `label-class` | string | `""` | Extra CSS class on `.infobox-label`. |
| `data-class` | string | `""` | Extra CSS class on the `.infobox-row` wrapper. |
| `id` | string | `""` | Optional `id` attribute on the row. |

Empty-row filter: a row whose label and value are both empty is removed
from the output by `layouts/_partials/infobox/body.html` before the row
ever reaches the page.

```text
{{< infobox-row label="Alma mater" value="Swarthmore; Stanford" >}}{{</ infobox-row >}}
```

is functionally identical to:

```text
{{< infobox-row label="Alma mater" >}}Swarthmore; Stanford{{</ infobox-row >}}
```

Markdown inside the paired body (`**bold**`, `[links](url)`, `- lists`)
renders through `.Page.RenderString`, so an arbitrary Markdown body —
**including nested shortcodes** like `{{< figure >}}` or another
`{{< infobox >}}` — produces the same DOM it would at article root.

### §2.4 `{{< infobox-row-full >}}` (paired)

Label-less, full-width data row. Used for sourced citations, cast lists,
track listings, or any block that benefits from breaking out of the
two-column key/value layout. Same paired-body vs `value=` fallback as
`infobox-row`.

| Parameter | Type | Default | Purpose |
|---|---|---|---|
| `value` | string | `""` | Fallback when the paired body is empty. Markdown-rendered. |
| `class` | string | `""` | Extra CSS class on `.infobox-data--full`. |

```text
{{< infobox-row-full >}}
  **Cast**: Mark Hamill, Harrison Ford, Carrie Fisher,
  Alec Guinness, Peter Cushing
{{</ infobox-row-full >}}
```

Renders a single data cell spanning the full infobox column.

### §2.5 `{{< infobox-row-image >}}` (paired)

Data row with an inline thumbnail (the "Mission insignia" pattern from
Phase 1-2). The figure is `data-lightbox`-enabled so it opens in the
lightbox overlay from §4, joined with `group=` for carousel scoping.

| Parameter | Type | Default | Purpose |
|---|---|---|---|
| `label` | string | `""` | Row label. |
| `image` | string | (required) | Image URL or page-resource path. |
| `image-alt` | string | `""` | Alt text for the embedded image. |
| `image-caption` | string | `""` | Caption under the embedded image (markdownified). |
| `image-upright` | float | `1.0` | Upright scaling factor (ports that use portrait images set this above 1). |
| `group` | string | `"default"` | Lightbox group key. |
| `value` | string | `""` | Additional body text in the data cell (markdownified). |
| `class` | string | `""` | Extra CSS class on `.infobox-data`. |

Note: `infobox-row-image` does not participate in the page-bundle /
`<picture>` pipeline the main image uses. It renders a single
`<img class="infobox-image" loading="lazy" decoding="async">` directly
inside a 60×60 `.infobox-row__figure` thumbnail container — see
`assets/css/components/infobox--image-data.scss` for the constrained
size and `assets/css/components/infobox.scss` for the lightbox wiring.

### §2.6 `{{< infobox-image >}}`

Additional image block below the main image, used to build a
multi-image carousel that opens through the lightbox with prev/next
navigation. Single-tag form.

| Parameter | Type | Default | Purpose |
|---|---|---|---|
| `src` | string | (required) | Image URL or page-resource path. |
| `caption` | string | `""` | Caption under the image (markdownified). |
| `alt` | string | `""` | Alt text. |
| `upright` | float | `1.0` | Upright scaling factor (maps to `data-upright` on the figure). |
| `group` | string | `"default"` | Lightbox group key — share the same value with sibling `infobox-image` shortcodes and the main image to form a navigable carousel. |

`infobox-image` runs through the full `image-block.html` pipeline
(`resolve-image.html` → `variants.html` → `srcset.html` →
`picture.html`), so a bundle or static asset receives the responsive
`<picture><source type="image/webp">…<img src=… srcset=… sizes=…></picture>`
stack the main image gets. Remote URLs fall back to a plain
`<img src=…>`.

### §2.7 `{{< infobox-subheader >}}` (paired)

Subtitle line below the title. Single subtitle use this shortcode; for
multiple subtitles, pass a `subheaders` slice to the `{{< infobox >}}`
outer instead.

| Parameter | Type | Default | Purpose |
|---|---|---|---|
| `value` | string | `""` | Fallback text when paired body is empty. |

```text
{{< infobox-subheader >}}American astronaut, 1951–2012{{</ infobox-subheader >}}
```

Renders:

```html
<div class="infobox-subheader">American astronaut, 1951–2012</div>
```

### §2.8 `{{< infobox-below >}}` (paired)

The footer block at the bottom of the box, used for footnotes, see-also
links, or trailing commentary the author wants to keep inside the box
rather than in the article body. Markdown-rendered through `markdownify`.

| Parameter | Type | Default | Purpose |
|---|---|---|---|
| `value` | string | `""` | Fallback text when paired body is empty. |

```text
{{< infobox-below >}}Source: Wikipedia, "Sally Ride", CC BY-SA 4.0.{{</ infobox-below >}}
```

---

## §3. Authoring patterns

The eight shortcodes above compose into the patterns Wikipedia uses
across its top-30 templates. Each pattern is a worked example the
author can copy.

### §3.1 Pattern A — Simple infobox (title + 3 rows)

```text
{{< infobox type="person" title="Sally Ride" >}}

  {{< infobox-row label="Born"  >}}May 26, 1951{{</ infobox-row >}}
  {{< infobox-row label="Died"  >}}July 23, 2012{{</ infobox-row >}}
  {{< infobox-row label="Nationality" >}}American{{</ infobox-row >}}

{{< /infobox >}}
```

### §3.2 Pattern B — Sectioned infobox

The section header divider organises rows into thematic groups (the
upstream Wikipedia "Personal life / Career / Education" pattern):

```text
{{< infobox type="person" title="Sally Ride" body-class="vcard biography" >}}

  {{< infobox-section title="Personal" >}}
  {{< infobox-row label="Born"  >}}May 26, 1951{{</ infobox-row >}}
  {{< infobox-row label="Died"  >}}July 23, 2012{{</ infobox-row >}}

  {{< infobox-section title="Education" >}}
  {{< infobox-row label="Alma mater" >}}Swarthmore; Stanford{{</ infobox-row >}}

  {{< infobox-section title="Career" >}}
  {{< infobox-row label="Occupation"   >}}Astronaut, physicist{{</ infobox-row >}}
  {{< infobox-row label="Years active" >}}1978–1987{{</ infobox-row >}}

{{< /infobox >}}
```

### §3.3 Pattern C — Image embedded in a data row

```text
{{< infobox type="astronaut" title="Sally Ride" body-class="vcard biography" >}}

  {{< infobox-row label="Born" >}}May 26, 1951{{</ infobox-row >}}

  {{< infobox-row-image
       label="Mission insignia"
       image="sts7-patch.png"
       image-alt="STS-7 mission patch"
       image-caption="STS-7"
       group="ride-gallery"
       >}}June 18–24, 1983{{</ infobox-row-image >}}

  {{< infobox-row label="Time in space" >}}14d 07h 46m{{</ infobox-row >}}

{{< /infobox >}}
```

The figure opens in the lightbox overlay (see §4) and joins the
`ride-gallery` carousel. The pair-body text after the figure is the
inline annotation that sits next to the thumbnail.

### §3.4 Pattern D — Full-width data-only row

```text
{{< infobox type="film" title="Star Wars" >}}

  {{< infobox-row label="Directed by" >}}George Lucas{{</ infobox-row >}}
  {{< infobox-row label="Produced by" >}}Gary Kurtz{{</ infobox-row >}}
  {{< infobox-row-full >}}**Cast**: Mark Hamill, Harrison Ford,
    Carrie Fisher, Alec Guinness, Peter Cushing{{</ infobox-row-full >}}
  {{< infobox-row label="Box office" >}}$775.4 million{{</ infobox-row >}}

{{< /infobox >}}
```

`infobox-row-full` escapes the two-column structure for sourced
citations, cast lists, or supporting paragraphs that need the full
column width.

### §3.5 Pattern E — Freeform paired body with markdown

The paired body is run through `.Page.RenderString`, so any Markdown
construct works inside a row:

```text
{{< infobox-row label="Notable works" >}}
- *The Pleasure of Finding Things Out* (1999)
- *Genius: The Life and Science of Richard Feynman* (1992)
{{</ infobox-row >}}
```

Renders the bullet list inside the data cell. The same `RenderString`
treatment lets authors nest shortcodes:

```text
{{< infobox-row label="Photo" >}}
{{< figure src="/media/ride-training.jpg" alt="Water survival training" >}}
{{</ infobox-row >}}
```

### §3.6 Pattern F — Multiple images grouped for a carousel

```text
{{< infobox
    type="person"
    title="Sally Ride"
    body-class="vcard biography"
>}}

  {{< infobox-image src="/media/ride-1984.jpg" caption="In 1984"
       alt="Portrait" group="ride-gallery" upright="0.8" >}}

  {{< infobox-image src="/media/ride-1985.jpg" caption="At a press conference, 1985"
       alt="Speaking at podium" group="ride-gallery" upright="0.8" >}}

  {{< infobox-row label="Born" >}}May 26, 1951{{</ infobox-row >}}

{{< /infobox >}}
```

Sharing the same `group="ride-gallery"` keys the three figures into one
navigable carousel in the lightbox overlay (ArrowLeft / ArrowRight cycle
through them).

### §3.7 Pattern G — Child module inside a parent infobox

The wrapper pattern mirrors Wikipedia's `Infobox artist` /
`Infobox football biography` and similar templates where an outer
template embeds the canonical `Infobox person` rows.

```text
{{< infobox
    type="person"
    title="Lionel Messi"
    body-class="vcard biography sportsperson football-biography"
>}}

  {{< infobox-row label="Nationality" >}}Argentine{{</ infobox-row >}}

  {{< infobox-section title="Club career" >}}
  {{< infobox-row label="Position"      >}}Forward{{</ infobox-row >}}
  {{< infobox-row label="Current club"  >}}Inter Miami CF{{</ infobox-row >}}

  {{< infobox child="true" type="person" body-class="vcard biography" >}}
    {{< infobox-row label="Height" >}}1.70 m (5 ft 7 in){{</ infobox-row >}}
    {{< infobox-row label="Weight" >}}72 kg (159 lb){{</ infobox-row >}}
    {{< infobox-row label="Spouse" >}}Antonela Roccuzzo{{</ infobox-row >}}
  {{</ infobox >}}

{{< /infobox >}}
```

The inner `{{< infobox child="true" …>}}` renders as
`<aside class="infobox infobox--child" data-infobox-type="person">`
inside the parent's row flow. The child has no border, no title, no
above, no below — its rows are visually part of the parent's section.
`assets/css/components/infobox--subbox.scss` strips the border and
shadow on the modifier, and `layouts/_partials/infobox/child.html`
skips the title/above/subheader/below blocks entirely.

### §3.8 Pattern H — Subbox inside a data cell (cast lists)

```text
{{< infobox type="film" title="Star Wars (1977)" body-class="vevent hproduct" >}}

  {{< infobox-row label="Directed by" >}}George Lucas{{</ infobox-row >}}
  {{< infobox-row label="Produced by" >}}Gary Kurtz{{</ infobox-row >}}

  {{< infobox-row-full >}}
    {{< infobox subbox="true" type="custom" body-class="film-cast" >}}
      {{< infobox-row label="" >}}Mark Hamill as Luke Skywalker{{</ infobox-row >}}
      {{< infobox-row label="" >}}Harrison Ford as Han Solo{{</ infobox-row >}}
      {{< infobox-row label="" >}}Carrie Fisher as Princess Leia{{</ infobox-row >}}
    {{</ infobox >}}
  {{</ infobox-row-full >}}

{{< /infobox >}}
```

The cast list subbox renders inside a full-width data row
(`infobox-row-full` wrapper), without its own border, so the cast list
breaks out of the label/data two-column structure into a self-contained
sub-region of the parent's row.

---

## §4. Image pipeline and lightbox integration

The infobox family runs every responsive image through one shared
pipeline (Phase 3-2) so portrait and landscape sources render at native
ratio with `srcset`/`sizes` and intrinsic dimensions for CLS-free
layout. The lightbox overlay (Phase 3-6) opens on any `data-lightbox`
trigger and exposes a full metadata panel.

### §4.1 Resource acquisition

The `layouts/_partials/infobox/resolve-image.html` partial tries three
sources for the `src` parameter, in order:

1. **Page bundle** — `ctx.Resources.GetMatch "<basename>.*"` matches a
   sibling image in the article's page bundle (`cover.jpg`,
   `cover.png`, `cover.webp`, etc.). This is the canonical authoring
   pattern: drop the image next to the article and reference it by
   filename.
2. **Static asset** — `resources.Get "<path>"` resolves a path under
   `static/` (the typical `/media/foo.jpg` pattern).
3. **Remote URL** — if `src` starts with `http(s)://`, the partial
   returns `nil` and the calling partial emits a plain
   `<img src=…>` fallback. The build does not break and the figure
   still renders, without the responsive `<picture>` stack.

A failed bundle or static lookup (no match, typo in the filename) emits
the fallback `<img>` rather than a broken image and the build still
passes — the partial is intentionally lossy on missing assets.

### §4.2 Variants, srcset, picture

When the partial resolves a real resource, the pipeline produces a
`<picture>` element with:

- Four sizes per format, **WebP and jpg**: 320, 640, 1024, 2048 px.
  Sizes larger than the source's intrinsic width are skipped so the
  `srcset` stays accurate. Output via
  `layouts/_partials/infobox/variants.html`.
- A `srcset` string per format, joined in the
  `"<url> 320w, <url> 640w, …"` shape the browser parses.
- A `sizes` attribute set to
  `"(max-width: 720px) 100vw, (max-width: 1200px) 50vw, 320px"` —
  three viewport tiers matching the §7 responsive breakpoints.
- Intrinsic `width` and `height` from the source resource for
  CLS-free layout.
- `loading="lazy"` and `decoding="async"` on every image; main
  infobox images opt into `loading="eager" fetchpriority="high"`
  when the caller passes `lazy=false`.

The full HTML shape:

```html
<figure class="infobox-image-block"
        data-lightbox
        data-lightbox-group="default"
        data-upright="1">
  <picture>
    <source type="image/webp"
            srcset="/media/ride_320x_hash.webp 320w,
                    /media/ride_640x_hash.webp 640w,
                    /media/ride_1024x_hash.webp 1024w,
                    /media/ride_2048x_hash.webp 2048w"
            sizes="(max-width: 720px) 100vw, (max-width: 1200px) 50vw, 320px">
    <img class="infobox-image"
         src="/media/ride_320x_hash.jpg"
         srcset="/media/ride_320x_hash.jpg 320w, …"
         sizes="(max-width: 720px) 100vw, …"
         alt="Sally Ride portrait"
         width="2790" height="3487"
         decoding="async"
         loading="lazy">
  </picture>
  <figcaption class="infobox-caption">In 1984, the year she became the first American woman in space.</figcaption>
</figure>
```

All three image-emitting v2 shortcodes share this pipeline:

- `{{< infobox >}}` does not have a dedicated main-image parameter; the
  main image is typically an `{{< infobox-image >}}` invoked inside
  the body (Pattern F). Authors who want a single image can rely on
  one `{{< infobox-image >}}` child.
- `{{< infobox-image >}}` runs the full pipeline.
- `{{< infobox-row-image >}}` runs a constrained 60×60 thumbnail
  pipeline — a single `<img>`, no `<picture>`, no srcset, no caption
  layout — because the figure has a fixed cell width by design.

### §4.3 Upright mode

Each figure carries a `data-upright="<factor>"` attribute (default `1`,
configurable via the `upright` / `image-upright` parameter, used above
`1` for portrait images whose container should be narrower than the
full column). The CSS in `assets/css/components/infobox.scss`
initialises `--infobox-upright: 1` on every `.infobox` and the
per-type overrides in `infobox--per-type.scss` use the value to size
the image block. Authors do not need to do anything — the default of
`1` renders the column at its full width.

### §4.4 Lightbox overlay and metadata panel

`assets/js/modules/lightbox.ts` (rewritten in Phase 3-6) opens a
full-screen overlay on click of any `<figure data-lightbox>` (and the
keyboard activation paths — Enter / Space — when the trigger has
focus). The overlay is mounted into `<body>` with
`role="dialog" aria-modal="true" aria-label="Image viewer"`, captures
focus on open, and returns it to the trigger on close.

The metadata panel — `.lightbox-metadata` — exposes five fields, each
hidden independently when its source is empty:

| Field | Source (priority order) |
|---|---|
| Caption | `<figcaption>` text → `data-lightbox-caption` attribute → empty |
| Filename | `data-lightbox-filename` attribute → `urls.Parse` basename of `src` (the figure shortcode emits this attribute automatically) → empty |
| Dimensions | `naturalWidth × naturalHeight` after the image loads |
| License | `data-lightbox-license` attribute → empty |
| Counter | always present: `"<index+1> / <total>"` |

A counter shows the position inside the group; keyboard navigation
(ArrowLeft / ArrowRight, RTL-aware; Home / End jumps to first / last;
Tab traps focus inside the overlay; Escape closes) cycles through the
carousel. `assets/js/main.ts` calls `lightboxInit()` on `DOMContentLoaded`
and the function is idempotent (safe under HMR / quick-reload).

Multiple figures sharing the same `data-lightbox-group` value form a
navigable carousel. Omitting the attribute gives a single-image group
where prev/next are hidden and the counter shows `"1 / 1"`.

> **For the article-body `{{< figure >}}` shortcode.** The figure
> shortcode emits `data-lightbox-filename` automatically (Phase 3-7)
> so the panel can show a useful filename without the author repeating
> it; pairing the data-lightbox with `data-halign` keeps the
> article-body float behaviour intact. See §A for figure's full
> shortcode reference.

---

## §5. File layout

The v2 implementation lives across three trees — shortcodes, partials,
and styles. One concern per file; one behaviour per TypeScript module.
Every file is well under the §1 `00-core.mdc` ceiling.

```
layouts/_shortcodes/
├── infobox.html              # Outer wrapper (paired, see §2.1)
├── infobox-section.html      # Section divider (paired, §2.2)
├── infobox-row.html          # Label + data row (paired, §2.3)
├── infobox-row-full.html     # Full-width data row (paired, §2.4)
├── infobox-row-image.html    # Data row with inline thumbnail (paired, §2.5)
├── infobox-image.html        # Additional image block (single-tag, §2.6)
├── infobox-subheader.html    # Subtitle (paired, §2.7)
└── infobox-below.html        # Footer (paired, §2.8)

layouts/_partials/infobox/
├── outer.html                # Outer non-child renderer (delegated by infobox.html)
├── child.html                # .infobox--child and .infobox--subbox modifier wrapper
├── title-block.html          # Title + above + subheaders block
├── body.html                 # .Inner wrapping + empty-row / autoheader RE2 filter
├── row.html                  # Shared row template (default / full / image-data shape)
├── image-block.html          # .infobox-image-block orchestration (uses resolve / variants / srcset / picture)
├── resolve-image.html        # Bundle → static → remote source resolution
├── variants.html             # 4-size WebP+jpg Resize() chain
├── srcset.html               # Variant-slice → srcset string
├── picture.html              # <picture><source type=image/webp>…<img></picture>
├── _link.html                # Optional autolink helper (not auto-invoked by any row)
└── base.html                 # Backwards-compatibility shim for the 30 named wrappers (person, film, …)

assets/css/components/
├── infobox.scss              # Root <aside>, title, above, subheader, image-block,
│                             # caption, row, label, data, section-header, below,
│                             # inline-link rules, external-link icon, three
│                             # responsive tiers (1200 / 720), print, upright.
├── infobox--full.scss        # .infobox-row--full / .infobox-data--full modifier
├── infobox--image-data.scss  # .infobox-row--image-data + 60×60 .infobox-row__figure thumbnail
├── infobox--subbox.scss      # .infobox--child and .infobox--subbox border strip
└── infobox--per-type.scss    # [data-infobox-type="…"] overrides for person / film /
                              # software / settlement / country / organization / album /
                              # election. Generic styling stays in infobox.scss.

assets/js/modules/
└── lightbox.ts               # Single-file lightbox module (Phase 3-6 rewrite):
                              # overlay, group collection, open/close, navigation,
                              # keyboard handling, focus trap, preload, metadata panel.
                              # Idempotent init() called from main.ts.
```

The `base.html` shim is the one part of the pipeline not rebuilt in the
v2 cut-over: it preserves the `{{< person name="…" birth_date="…" />}}`
etc. call surface so the 30 named wrappers in §10 continue to render.
Adding new infobox content should bypass the shim and write directly
against the v2 primitives in §2.

---

## §6. CSS hook contract

The v2 templates emit a fixed set of class names and data attributes on
every element. The CSS hook contract is the source of truth for both
directions: anything `assets/css/components/infobox*.scss` styles must
use these names; anything the templates emit must be in this table;
drift in either direction is a bug.

| Class / attribute | Emitted on | Purpose |
|---|---|---|
| `.infobox` | the outer `<aside>` | Root box. Selector for box-level styles (float, max-width, border, background). |
| `.infobox--child` | child wrapper aside | `border: 0; background: transparent; box-shadow: none`. See §3.7. |
| `.infobox--subbox` | subbox wrapper aside | Same modifier rules as child. See §3.8. |
| `[data-infobox-type]` | root `<aside>` | Per-template discriminator (default `"custom"`); the SCSS hook every per-type rule in `infobox--per-type.scss` keys on. |
| `.infobox-title` | title `<div>` | Above-the-border caption. |
| `.infobox-above` | top-of-box cell | Inside-the-border pre-image cell. |
| `.infobox-subheader` | each subtitle `<div>` | Repeated, between title and body. |
| `.infobox-image-block` | the image `<figure>` | Image block; lightbox-enabled; full pipeline from §4. |
| `.infobox-image` | the `<img>` (or `<picture>`'s `<img>`) | Native-ratio image — no aspect-ratio crop, no `object-fit: cover`. |
| `.infobox-caption` | the `<figcaption>` | Underneath the image. |
| `.infobox-row` | each label / data row `<div>` | Two-column key/value layout. |
| `.infobox-row--full` | full-width row variant | Single-cell full-width row from `infobox-row-full`. |
| `.infobox-row--image-data` | image-embedded row variant | `infobox-row-image` row. |
| `.infobox-row__figure` | the inline thumbnail `<figure>` | 60×60 (`80×80` mobile) cursor-zoom-in thumbnail inside an image-data row. |
| `.infobox-label` | the label `<div>` of a row | Left column; bolder, narrower. |
| `.infobox-data` | the data `<div>` of a row | Right column; wider, lighter. |
| `.infobox-data--full` | the full-width row's data cell | `flex-basis: auto; width: 100%`. |
| `.infobox-section-header` | each section divider | Spans both columns; tonal background tint. |
| `.infobox-below` | the footer block | Full-width freeform area at the bottom. |
| `[data-lightbox]` | image figures | Marks a figure as lightbox-trigger. |
| `[data-lightbox-group]` | image figures | Carousel key — share to form a navigable group. |
| `[data-upright]` | image figures | Per-image upright scaling factor (`infobox-image`'s `upright` and `infobox-row-image`'s `image-upright` parameters). |

Modifying the class contract is a plan-level change — adding a new
class name requires updating every shortcode that emits it and the
matching SCSS in the same commit. New visual behaviours should be
expressed as a new attribute on the existing `.infobox` (e.g.
`data-state="collapsed"`) or a modifier on an existing class, not as a
new class name.

### §6.1 Per-type rules

`assets/css/components/infobox--per-type.scss` holds every
`[data-infobox-type="…"]` override. The shipping set covers the most
common Wikipedia infobox templates the v2 family is likely to be
written against:

| Type | Rule |
|---|---|
| `person` | `.infobox-image-block { max-width: 70%; margin: 0 auto }` — portrait-friendly container width. |
| `film` | `.infobox-above { background: var(--color-text); color: var(--color-surface) }` — inverted header. |
| `software` | `.infobox-data { font-variant-numeric: tabular-nums }` — tabular figures. |
| `settlement` | `.infobox-section-header { text-transform: uppercase; letter-spacing: 0.05em }` — formal section feel. |
| `country` | `border-top: 3px solid var(--color-accent)` — accent divider. |
| `organization` | `.infobox-above { background: var(--color-accent); color: var(--color-accent-contrast) }`. |
| `album` | `.infobox-image-block .infobox-image { border-radius: var(--radius-sm) }` — softer corners on cover art. |
| `election` | `.infobox-image-block { max-width: 70%; margin: 0 auto }` — candidate-photo cap. |
| `custom` | (no overrides — explicit "intentionally empty" block documents the default.) |

Adding a per-type rule is a one-block addition in
`infobox--per-type.scss` plus, if the template gets a new
`data-infobox-type` value, the matching `type=…` parameter on the
outer `{{< infobox >}}` shortcode invocation.

---

## §7. Responsiveness

The infobox follows Wikipedia's Mobile-Friendly `Manual of Style` and
the responsive tokens in `assets/css/base/_tokens.scss`. Three viewport
tiers, all SCSS variables at compile time:

| Token / breakpoint | Range | Behaviour |
|---|---|---|
| `$breakpoint-tablet` (`1200px`) | `max-width: 1200px` | Float is dropped; infobox becomes a full-width block above the article body (no longer floats right of the prose). |
| `$breakpoint-mobile` (`720px`) | `max-width: 720px` | Each `.infobox-row` flips from horizontal flex (label 40% / data 60%) to a stacked layout: label on top, data below. Data cells no longer get squeezed into ~140px columns. |
| Mobile image-data | `max-width: 720px` | The 60×60 `.infobox-row__figure` grows to 80×80 for tap-target comfort; the row label goes full-width. |
| Print | `print` | Float and shadow are dropped; `border-color: var(--color-text)`; `page-break-inside: avoid` so an infobox doesn't split across pages. |

The `sizes` attribute on the image pipeline follows the same three
tiers — see §4.2:

```text
(max-width: 720px) 100vw, (max-width: 1200px) 50vw, 320px
```

These breakpoints match the §14 single-source-of-truth table in
`docs/RESEARCH.md` (which the rest of the theme — sidebar, ToC, sticky
header — uses too). The infobox does not redefine them; it follows
`assets/css/base/_tokens.scss`.

---

## §8. Migration: old API → v2 API

The Fourth Plan's clean-slate cutover retired the previous infobox
shortcode family with **no compatibility shim** for the inner
primitives. Content that used the old family must be rewritten against
the v2 family; there is no automatic migration.

### §8.1 Removed (no replacement at the same name)

| Old shortcode | Status | Migrate to |
|---|---|---|
| `{{< infobox-field >}}` | Deleted | `{{< infobox-row label="…" value="…" >}}` (parameter form) or `{{< infobox-row-full value="…" >}}` if the row had no label. |
| `{{< infobox-pair-date >}}` | Deleted | `{{< infobox-row label="Date" >}}YYYY-MM-DD{{</ infobox-row >}}` — inline markdown formatting. |
| `{{< infobox-pair-software-release >}}` | Deleted | `{{< infobox-row label="Version" >}}` + `{{< infobox-row label="Released" >}}`. |
| `{{< infobox-pair-population >}}` | Deleted | `{{< infobox-row label="Population" >}}` (or add a per-type rule in `infobox--per-type.scss` for tabular numerals). |
| `{{< infobox-pair-area >}}` | Deleted | `{{< infobox-row label="Area" >}}` + a per-type rule if needed. |
| `{{< infobox-pair-air-date >}}` | Deleted | Two `{{< infobox-row >}}`s for date and network. |
| `{{< infobox-pair-budget-gross >}}` | Deleted | Two `{{< infobox-row >}}`s. |
| `{{< infobox-pair-episode-season >}}` | Deleted | Two `{{< infobox-row >}}`s. |

The per-pair formatting that the deleted primitives used to encode is
now expressed either inline (the author writes `"$775.4 million"`
verbatim) or as a `[data-infobox-type]` rule in
`infobox--per-type.scss`. Wikipedia itself has no per-data-type
primitives in this sense; the upstream pattern is one `data(n)` field
formatted via wikitext. The v2 family matches that.

### §8.2 Kept (compatibility shim)

The 30 named `{{< person >}}`, `{{< film >}}`, `{{< settlement >}}`,
etc. wrappers under `layouts/_shortcodes/<topic>.html` continue to
ship and continue to accept their original parameter dicts. They
route through `layouts/_partials/infobox/base.html`, which maps the
old `.fields`-list / `.image` / `.caption` / `.below` contract onto
the v2 primitives.

The shim is a transitional aid; Phase 3-7 retires it when every named
wrapper has been rewritten to emit the v2 `{{< infobox >}}` outer
shortcode directly. **New content should be written against §2's
v2 primitives directly**, not the named-wrapper shorthand, so the
shim is the boundary between the maintained and the migration-
pend-rewrite surfaces.

### §8.3 What to migrate first

A content audit finds (or does not find) usages of the deleted
shortcodes in `exampleSite/content/**/*.md`. A grep for
`{{< infobox-` is enough — every match will be a v2 primitive
(compatible) or a deleted pair primitive (rewrite). The
`infobox-smoke.md` and `embedded-test.md` demo pages are the canonical
v2 examples to copy patterns from.

---

## §9. Future work

Items deliberately deferred beyond the v2 cut-over, with the trigger
condition for picking them up:

- **Native-ratio container width via `data-upright`.** The CSS hook is in
  place (`--infobox-upright` on `.infobox`) and the attribute is emitted
  on every figure, but no per-type rule currently consumes the value
  beyond the fixed `max-width` percentages. A future enhancement
  passes the figure's upright factor through to the container
  `max-width` via `clamp()`. The existing per-type rules give authors
  most of the value already — see §6.1.
- **Nested shortcodes as param values.** Hugo's shortcode parser still
  evaluates params as raw strings, so the v2 family cannot nest
  `{{< infobox >}}` calls as **parameter values** of another
  shortcode. Nesting inside a paired `.Inner` body works fine (it is
  the §3.5 escape-hatch path), and the §3.7 / §3.8 wrapper pattern
  covers the most-needed nested template cases. Trigger condition: a
  follow-on Hugo version or a build-time templating step that lets
  params evaluate other shortcodes.
- **Phase 3-7 — named-wrapper v2 migration.** Rewrite each of the 30
  named `{{< topic >}}` wrappers to emit the v2 `{{< infobox >}}` outer
  directly, then retire `layouts/_partials/infobox/base.html`. Until
  then, §10 documents the named wrappers as they are; the
  compatibility shim stays in place.
- **`{{< person-flexible >}}` and similar flexible-parameter
  wrappers.** A future enhancement exposes the inner v2 primitives
  as a single flexible-field wrapper (`{{< person-flexible
  name="…" image="…" >}}…rows…{{< /person-flexible >}}`) so authors
  who want the named-wrapper surface and the v2 `data-infobox-type`
  hooks get both. The Wikipedia upstream does not have an exact
  equivalent, so the API surface is a fresh design choice and is
  deferred to a follow-on plan.

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

---

## §A. Article-body shortcodes

Not every shortcode in this theme maps to a Wikipedia `Template:Infobox <topic>`.
Some shortcodes model **article-body elements** — the figures, media, and inline
blocks that live between paragraphs of prose rather than inside the right-hand
infobox column. The Sally Ride replication research
(`.plans/research-2026-07-12/sally-ride-replication-spec.md` lines 22–50)
cites these as Element 3 (audio-visual thumb) and Element 4 (standard
right-aligned thumbnail). They have **no upstream `Template:Infobox figure`
mapping** and so cannot live under §10 — §10 is locked to the 30-entry
per-template contract defined in §1.

This section is the home for non-infobox article-body shortcodes. The rest of
this document's taxonomy (layer 1 / layer 2 / layer 3, the §6 CSS hook contract,
the §7 responsiveness commitment, the §8 v1 scope cuts) applies to infobox
shortcodes only; figure stands outside that scope and uses its own minimal
CSS hook set keyed on `.figure`, `[data-halign]`, `[data-mw-size]`,
`[data-kind]`, `[data-lightbox]`, and `[data-lightbox-group]`.

New non-infobox article-body shortcodes land in this section by default; new
infobox-mapped shortcodes land in §10. The distinction is recorded per the
`40-shortcodes.mdc` rule that any new shortcode must be documented with a full
worked example before being considered done — the per-shortcode standalone
page under `docs/shortcodes/<slug>.md` is the canonical quick-reference for
both kinds.

> **Shared image-rendering partial.** Every shortcode that emits an image —
> `{{< thumb >}}`, `{{< figure >}}`, `{{< infobox-image >}}` and the
> `{{< row >}}` photo slot — delegates the actual `<img>` to one shared
> partial, `layouts/_partials/article/thumb.html`. That partial runs Hugo's
> image pipeline (`resources.GetRemote` / `resources.Get` → `.Resize` →
> `srcset`/`sizes` + intrinsic `width`/`height` for CLS) and renders every
> image at its **native ratio** inside a max-width-constrained container —
> the Wikipedia `figure[typeof~='mw:File/Thumb']` contract. There is no fixed
> `aspect-ratio` and no `object-fit: cover` cropping anywhere in the theme;
> the container's width is fixed and the height scales to the source ratio.
> The class hooks it emits (`.thumb`, `.thumb__image-wrap`, `.thumb__img`,
> `.thumb__magnify`, `.thumb__caption`) are styled by
> `assets/css/components/_thumb.scss` and enhanced by
> `assets/js/modules/thumb.ts`.

### `{{< thumb >}}`
**Intent:** The user-facing inline article-body thumbnail — a floated,
native-ratio image with an optional caption and an optional lightbox magnify
affordance. This is the direct expression of the Wikipedia thumbnail contract
(Element 4 of the Sally Ride research) and the canonical entry point for the
shared image-rendering partial described above. Use it for a standalone image
that flows beside prose; use `{{< figure >}}` when you also need the
bordered figure chrome or the audio/video `kind`s.
**Most-used parameters:** `src` (required), `alt`, `caption`, `align`
(`right` default \| `left` \| `none`), `width`, `lightbox`, `group`.
**Worked example — parameter-only, right-aligned:**

```go
{{< thumb
    src     = "/media/sally-ride-portrait.jpg"
    alt     = "Sally Ride in 1984"
    caption = "Ride in 1984, the year she became the first American woman in space."
    align   = "right"
    lightbox = "true"
>}}{{< /thumb >}}
```

**Worked example — paired body as the caption (inline Markdown link):**

```go
{{< thumb src="/media/ride-training.jpg" alt="Water survival training" align="left" >}}
Ride during water survival training at NASA's
[Neutral Buoyancy Laboratory](https://en.wikipedia.org/wiki/Neutral_Buoyancy_Laboratory).
{{</ thumb >}}
```

When the paired body is non-empty it becomes the caption (rendered through
`RenderString` so inline Markdown works); otherwise the `caption="…"`
parameter is used. A landscape and a portrait source both render with
correct, uncropped proportions from the same call — that is the whole point
of the native-ratio contract. On desktop/tablet the figure floats per
`align` and caps its width; at the mobile breakpoint (720px) the float is
dropped and the figure goes full-width.

**See also:** [`docs/shortcodes/thumb.md`](shortcodes/thumb.md) — the
canonical per-shortcode page (full parameter table, CSS hook contract,
responsiveness, accessibility, limitations).

### `{{< figure >}}`
**Intent:** Article-body figure — image, audio, or video embedded inline in
the prose, with optional caption, float alignment, and lightbox participation.
Replicates Element 4 (right-aligned thumbnail) and Element 3 (audio-visual
thumb) from the Sally Ride research in a single shortcode, distinguished by
the `kind` parameter. No upstream `Template:Infobox figure` mapping exists —
figure is an article-body element, not an infobox.
**Most-used parameters:** `src`, `alt`, `caption`, `attribution`, `halign`,
`kind`, `lightbox`, `group`, `width`.
**Worked example — parameter-only image (Sally Ride Element 4):**

```go
{{< figure
    src     = "/media/sally-ride-portrait.jpg"
    alt     = "Sally Ride in 1984"
    caption = "Ride in 1984, the year she became the first American woman in space."
    halign  = "right"
>}}{{< /figure >}}
```

The parameter-only form maps Element 4 onto the article body — a floated
right-aligned thumbnail with a captioned `<figure>`. The `[data-halign]`
float rule lives in `assets/css/components/figure.scss`; the `<img>` +
`<figcaption>` themselves are delegated to the shared
`layouts/_partials/article/thumb.html` partial, so the image renders at its
native ratio (no 4:3 crop) with a Hugo-processed `srcset`/`sizes` — the same
image-rendering policy every image-emitting shortcode now shares.

**Worked example — `kind="audio"` (Sally Ride Element 3):**

```go
{{< figure
    kind        = "audio"
    src         = "/media/audio/sally-ride-sts-7-launch-recording.mp3"
    attribution = "NASA Audio Recording, STS-7 launch commentary, 18 June 1983."
    caption     = "Launch commentary excerpt from STS-7, 18 June 1983."
>}}{{< /figure >}}
```

`kind="audio"` emits the native `<audio controls preload="metadata">` element
with a download-link fallback — browser-default controls, no custom player
UI in v1 (see §A `Limitations` below). Video is the analogous `<video>`
shape; the worked example here uses audio to keep this section short and
let `docs/shortcodes/figure.md` show the paired-with-inner form.

**Worked example — paired form (author-supplied caption):**

```go
{{< figure
    src     = "/media/sally-ride-water-survival-training.jpg"
    halign  = "right"
>}}Sally Ride during a water survival training session at NASA's
[Neutral Buoyancy Laboratory](https://en.wikipedia.org/wiki/Neutral_Buoyancy_Laboratory).
{{</ figure >}}
```

When inner content is non-empty it becomes the figure body, and the inner
text passes through `markdownify` so inline links, bold, and emphasis work
inside the caption block. This is the canonical pattern when the caption
needs a Markdown link that the `caption="…"` parameter cannot easily express.

**See also:** [`docs/shortcodes/figure.md`](shortcodes/figure.md) — the
canonical per-shortcode page (full parameter table, CSS hook contract,
lightbox integration); the §6 CSS hook contract applies to infobox
shortcodes only, so the figure class hooks live in
`assets/css/components/figure.scss` (ticket 002); no upstream
`Template:Infobox figure` mapping exists.

### `{{< row-table >}}`
**Intent:** Article-body element that renders a labelled section of
`icon | text | photo` rows. Each row pairs a small inline-SVG icon with
a heading + body and a fixed-aspect photograph, scaled fluidly between
a 360px phone and a 1920px desktop. A single structural breakpoint at
the project's mobile boundary (720px per `_tokens.scss`) re-maps the
grid to a stacked `icon + text` row with a full-width photo below — the
DOM order is unchanged. Fully static by default (no JS cost); a
`variant="expandable"` opt-in adds a narrow-viewport click-to-expand
interaction (clamped to 2 lines, expand on click / Enter / Space).
**Most-used parameters:** `eyebrow`, `title`, `level` (default `3`),
`description`, `footer`, `variant` (`compact` or `expandable`),
`group` (lightbox carousel key, inherited as default by every child
row that opts into `lightbox="true"` without its own `group=`).
**Worked example — static case:**

```go
{{< row-table
    eyebrow      = "1/4 · Example"
    title        = "Common houseplant leaf shapes"
    description  = "A reusable icon → text → photo layout."
>}}

{{< row
    icon  = "leaf-ovate"
    title = "Ovate"
    image = "/images/leaf-ovate.jpg"
    text  = "Egg-shaped leaf, wider near the base and tapering toward the tip." >}}

{{< row
    icon  = "leaf-palmate"
    title = "Palmate"
    image = "/images/leaf-palmate.jpg"
    text  = "Lobes radiate outward from a single point, like fingers from a palm." >}}

{{< /row-table >}}
```

**Worked example — `variant="expandable"` (narrow-viewport toggle):**

```go
{{< row-table variant="expandable" title="Long-form descriptions" >}}
  {{< row icon="leaf-pinnate" title="Pinnate" image="/images/leaf-pinnate.jpg"
        text="Long body copy that benefits from 2-line clamping on phones…" >}}
{{< /row-table >}}
```

**Worked example — `lightbox="true"` (full-screen photo overlay):**

```go
{{< row-table title="Leaf photos" group="leaves" >}}
  {{< row title="Ovate"   image="/images/leaf-ovate.jpg"   text="…" lightbox="true" >}}
  {{< row title="Palmate" image="/images/leaf-palmate.jpg" text="…" lightbox="true" group="other-set" >}}
  {{< row title="Pinnate" image="/images/leaf-pinnate.jpg" text="…" lightbox="true" >}}
{{< /row-table >}}
```

Opting a row into `lightbox="true"` adds `data-lightbox` +
`data-lightbox-group` + `data-lightbox-caption` to `.row-table__photo`
and the existing `assets/js/modules/lightbox.ts` module opens the
overlay on click / Enter / Space. The `group=` value is inherited
from the parent wrapper by default (so one key on the parent joins
every row into a single carousel) and can be overridden per row. The
caption is the row's `alt=` (falling back to `title=`). No extra JS
ships — the same module that powers `{{< figure >}}` handles both.

**See also:** [`docs/shortcodes/row-table.md`](shortcodes/row-table.md) —
the canonical per-shortcode page (full parameter tables, CSS hook
contract, responsiveness, accessibility). The parent is the paired
shortcode `layouts/_shortcodes/row-table.html`; the child is
`layouts/_shortcodes/row.html` (single-form, requires `title` + `text`
+ `image`). The CSS is `assets/css/components/_row-table.scss` (CSS
Grid with explicit areas; same DOM order at every viewport, area
re-map at the 720px breakpoint). The optional progressive-enhancement
JS lives in `assets/js/modules/row-table.ts` and is a no-op for the
default static case. `lightbox="true"` and `group=` on the child, or
`group=` on the parent (inherited as default), wire the photo into the
existing `assets/js/modules/lightbox.ts` overlay — see the worked
example above. No upstream `Template:Infobox row-table` mapping
exists.

## §12. Links in data cells (Fourth Plan, phase 3-4)

Infobox data cells render Markdown, so any standard link pattern works:

```go
{{< infobox-row label="Website" >}}[Official site](https://example.com){{< /infobox-row >}}
{{< infobox-row label="Born" >}}Santa Monica, [California]({{< ref "california.md" >}}){{< /infobox-row >}}
```

### Same-window default (no `target="_blank"`)

By design the v2 family does **not** add `target="_blank"` to links inside
data cells. Plain Markdown links render as `<a href="…">…</a>` and open in
the same tab. This matches the project's no-surprise-navigation policy and
keeps screen-reader / cognitive-load behaviour predictable.

### New-tab opt-in via raw HTML

Authors who need a new tab use raw HTML in the paired body or `value`
parameter:

```go
{{< infobox-row label="Docs" >}}<a href="https://example.com" target="_blank" rel="noopener noreferrer">External docs</a>{{</ infobox-row >}}
```

`rel="noopener noreferrer"` is required for any `target="_blank"` link
because it blocks reverse-tabnabbing and referrer leakage — Hugo's
markdownify does not enforce this automatically.

### External-link icon opt-in

Add `rel="external"` to any link to surface the outbound-arrow icon
(`↗`) via CSS:

```go
{{< infobox-row label="Profile" >}}<a href="https://example.com" rel="external">Open profile</a>{{</ infobox-row >}}
```

The CSS rule is `assets/css/components/infobox.scss` `.infobox-data a[rel~="external"]::after`. The marker is opt-in; authors who want plain `<a>`
without the icon simply omit `rel="external"`.

### Link styling

`.infobox-data a` uses the project's design tokens:

```scss
.infobox-data a {
  color: var(--color-link);
  text-decoration: underline;

  &:hover { text-decoration: none; }
  &:focus-visible {
    outline: 2px solid var(--color-focus-ring);
    outline-offset: 2px;
  }
}
```

The rule is scoped to `.infobox-data` so it does not affect link color
elsewhere in the article body.

### `_link.html` partial (advanced)

`layouts/_partials/infobox/_link.html` is an optional autolink helper for
callers who want every value rendered as a clickable link (rare pattern
— most call sites render values as plain text). It is **not** invoked by
default; authors opt in by calling the partial themselves:
`{{ partial "infobox/_link.html" (dict "url" "…" "text" "…") }}`. The
helper also auto-emits `target="_blank" rel="noopener noreferrer"` for
`http://` and `https://` URLs as a convenience for the rare autolink use
case, but it is not used by the row primitive.

### Accessibility

- Link text is meaningful. Avoid `[here](url)`; prefer `[Documentation](url)`.
- Multi-link cells separate links with `<br>` so the link phrases are
  clearly enumerable.

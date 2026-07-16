# `{{< row-table >}}`

Article-body element that renders a labelled section of
`icon | text | photo` rows. Each row pairs a small inline-SVG icon with
a heading + body and a photograph that renders at its native ratio
(via the shared `article/thumb.html` partial — no fixed aspect-ratio
crop), scaled fluidly between a 360px phone and a 1920px desktop. The
layout is fully static by
default (no JS cost); a `variant="expandable"` opt-in adds a
narrow-viewport click-to-expand interaction.

The shortcode is a paired parent (`{{< row-table >}}…{{< /row-table >}}`)
with one or more single-form children (`{{< row >}}`) nested inside.
Like the figure family, it has no upstream `Template:Infobox row-table`
mapping — it is an article-body element, not an infobox wrapper.

## When to use it vs. alternatives

Use `{{< row-table >}}` whenever a list of items wants a repeating
`icon | text | photo` pattern: catalog pages, "types of X" sections,
species overviews, feature lists with photographic reference. The
default static case is the right pick for almost every page; reach
for `variant="expandable"` only when the row's body copy is long
enough that a 2-line clamp on mobile is a real readability win.

For a single figure with caption and float alignment, the
`{{< figure >}}` shortcode is the right pick — it shares the same
shared `article/thumb.html` native-ratio image pipeline but doesn't
impose the row pattern. For data tables, Hugo's built-in Markdown table syntax
is the right pick. For infobox columns, the named `{{< person >}}`
/ `{{< settlement >}}` / etc. wrappers stay inside the right-hand
infobox column; `row-table` is the article-body counterpart.

## Parameters — parent

The full parameter list, in declaration order. The list mirrors the
comment header at the top of `layouts/_shortcodes/row-table.html`,
which is the source of truth.

| Parameter | Required | Purpose |
|---|---|---|
| `eyebrow` | optional | Small kicker label above the title; rendered as a `<p class="row-table__eyebrow">` |
| `title` | optional | Section heading text; rendered at `level` (default `3`) |
| `level` | optional | Heading level (`1`–`6`); default `3` |
| `description` | optional | Markdown-rendered intro paragraph under the title |
| `footer` | optional | Markdown-rendered closing note; rendered as a `<footer class="row-table__footer">` |
| `variant` | optional | `compact` (tighter padding/gap) or `expandable` (JS opt-in) |

## Parameters — child

The full parameter list for `{{< row >}}`. The list mirrors the
comment header at the top of `layouts/_shortcodes/row.html`, which
is the source of truth.

| Parameter | Required | Purpose |
|---|---|---|
| `title` | required | Row heading |
| `text` | required | Markdown-rendered body copy; can be multi-line |
| `image` | required | Image path/URL; local paths run through `relURL`, external URLs pass through |
| `icon` | optional | Filename (no extension) under `layouts/_partials/icons/`; mutually exclusive with `image2` |
| `image2` | optional | Image path/URL rendered into the icon slot at icon scale (`clamp(2.5rem…4rem)`); mutually exclusive with `icon`, takes priority |
| `alt` | optional | `<img alt=…>` text for the main photo; defaults to `title` |
| `image2alt` | optional | `<img alt=…>` text for `image2`; defaults to `alt` |
| `lightbox` | optional | `"true"` opts the main photo into the lightbox overlay |
| `image2lightbox` | optional | `"true"` opts `image2` into the lightbox overlay |
| `group` | optional | Lightbox carousel key; inherits from parent `{{< row-table >}}` |

## Parameters — quick-row

`{{< quick-row >}}` is a lightweight alternative to `{{< row >}}`. Only `title`
is required; `text` and `image` both default to empty so the slots are
omitted from the row when not needed. It also adds `href=` to turn the text
cell into a clickable link. All other params work identically to `{{< row >}}`.

| Parameter | Required | Purpose |
|---|---|---|
| `title` | required | Row heading |
| `text` | optional | Markdown body; omit to skip the text slot entirely |
| `image` | optional | Image path/URL; omit to skip the photo slot entirely |
| `icon` | optional | SVG filename under `layouts/_partials/icons/`; mutually exclusive with `image2` |
| `image2` | optional | Image path/URL rendered into the icon slot at icon scale; mutually exclusive with `icon`, takes priority |
| `alt` | optional | `<img alt=…>` text for the photo; defaults to `title` |
| `image2alt` | optional | `<img alt=…>` text for `image2`; defaults to `alt` |
| `href` | optional | When set, wraps the text cell in an `<a>` — the whole row becomes a clickable link |
| `lightbox` | optional | `"true"` opts the photo into the lightbox overlay |
| `image2lightbox` | optional | `"true"` opts `image2` into the lightbox overlay |
| `group` | optional | Lightbox carousel key; inherits from parent `{{< row-table >}}` |

## Worked example

**Static case (default):**

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

{{< row
    icon  = "leaf-pinnate"
    title = "Pinnate"
    image = "/images/leaf-pinnate.jpg"
    text  = "Leaflets arranged in pairs along a central stem, feather-like." >}}

{{< /row-table >}}
```

**Compact variant** (same shortcode, tighter padding via CSS modifier):

```go
{{< row-table variant="compact" title="Quick reference" >}}
  {{< row icon="leaf-ovate" title="Ovate" image="/images/leaf-ovate.jpg"
        text="Egg-shaped, base-wide." >}}
{{< /row-table >}}
```

**Expandable variant** (narrow-viewport click-to-expand, JS opt-in):

```go
{{< row-table variant="expandable" title="Long-form descriptions" >}}
  {{< row icon="leaf-pinnate" title="Pinnate" image="/images/leaf-pinnate.jpg"
        text="Long body copy that benefits from 2-line clamping on phones…" >}}
{{< /row-table >}}
```

**Image2 for the icon slot** (small photo or brand logo instead of an SVG):

```go
{{< row-table title="Featured authors" >}}
  {{< row
      image2    = "/images/author-portraits/maya.jpg"
      image2alt = "Portrait of Maya"
      title     = "Maya"
      image     = "/images/cover-maya.jpg"
      text      = "Science fiction and fantasy." >}}
  {{< row
      image2    = "/images/author-portraits/chinua.jpg"
      image2alt = "Portrait of Chinua"
      title     = "Chinua"
      image     = "/images/cover-achebe.jpg"
      text      = "Postcolonial literature." >}}
{{< /row-table >}}
```

## CSS hook contract

The base partial and the row partial emit a fixed set of class names
on every element. The class names are the CSS hook contract: the
SCSS file (`assets/css/components/_row-table.scss`) keys every rule
off these names, and the templates must emit exactly these names.

| Class name | Emitted on | Purpose |
|---|---|---|
| `row-table` | the section root | Selector for box-level styles (max-width, padding, border) |
| `row-table--compact` | root modifier | Tighter padding and gap |
| `row-table--expandable` | root modifier | JS opt-in via `data-expandable="true"` |
| `row-table__header` | the header block | eyebrow + title + description wrapper |
| `row-table__eyebrow` | the kicker label | Small uppercase label above the title |
| `row-table__title` | the section heading | h-level from `level` parameter |
| `row-table__description` | the intro paragraph | Markdown-rendered |
| `row-table__rows` | the children container | Wraps every `{{< row >}}` output |
| `row-table__row` | a single data row | The grid container; one per `{{< row >}}` |
| `row-table__row--linked` | row root | Added when `href=` is set on `quick-row` |
| `row-table__icon` | the icon slot | Inline SVG; `aria-hidden="true"` when decorative. Also wraps `image2` (rendered via `article/thumb.html`); `object-fit: contain` preserves the full image at icon scale |
| `row-table__text` | the text slot | title + body wrapper |
| `row-table__text-title` | the row heading | Bold row title; becomes an `<a>` when `href=` is set |
| `row-table__text-body` | the row body | Markdown-rendered, supports inline links/emphasis |
| `row-table__photo` | the photo slot | grid-area anchor wrapping a `.thumb` figure (rendered by `layouts/_partials/article/thumb.html`); the image renders at its native ratio with `srcset`/`sizes`, no `object-fit`/`aspect-ratio` crop |
| `row-table__footer` | the closing note | Markdown-rendered at the bottom of the section |

## Responsiveness

The layout is fluid by default. Every dimension that varies with
viewport uses `clamp()` so the layout scales smoothly between
~360px and ~1920px+ without a forest of fixed breakpoints:

- font-size (root, title, body, eyebrow) — clamp
- row gap, padding, section gap — clamp
- icon size — clamp (also constrains `image2` at icon scale)
- photo size — clamp

A single structural breakpoint at the project's documented mobile
boundary (720px per `assets/css/base/_tokens.scss`) re-maps the
grid from `icon | text | photo` to a stacked `icon + text` row with
a full-width photo below. The DOM order is unchanged at the
breakpoint — only the `grid-template-areas` value changes.

`prefers-reduced-motion: reduce` zeroes out transitions;
`prefers-color-scheme: dark` flips the local `--rt-*` token bridge
automatically (the bridge aliases `var(--color-text)` and friends,
which the existing `themes/dark.scss` and `themes/auto.scss` blocks
already override for the rest of the cascade).

## Accessibility

- Icons are decorative relative to the row heading — the icon slot
  gets `aria-hidden="true"` whenever a `title` is present on the row.
  When `image2` is used, the icon slot has no `aria-hidden` (the
  image carries its own `alt` text via `image2alt`).
- The `<img>` always gets `alt` text; falls back to the row `title`
  if no explicit `alt` is supplied.
- Heading levels come from the `level` parameter on the parent —
  never hardcoded `<h3>`, so nesting inside pages with different
  heading hierarchies stays valid.
- The `variant="expandable"` opt-in sets `role="button"`,
  `tabindex="0"`, and `aria-expanded` on each row only at narrow
  viewports (where the toggle is meaningful) and clears them at
  wide viewports via a `matchMedia` change listener.
- Visible focus ring (2px solid `var(--color-focus-ring)`) on rows
  when they become interactive.

## Limitations

- No per-template visual tweaks (no equivalent of the infobox's
  `[data-infobox-type="…"]` hook). Per-component overrides are
  possible by adding new `.row-table--<modifier>` classes to the
  SCSS file in a follow-on change; no per-template SCSS files
  (per `.cursor/rules/00-core.mdc`).
- Icon resolution is `templates.Exists`-guarded — a missing icon
  does not break the build, it just renders the row without the
  icon slot. Use the staged fixtures under
  `layouts/_partials/icons/` or drop your own SVGs in the same
  directory.
- The expandable variant's 2-line clamp is a
  `-webkit-line-clamp: 2` implementation; Firefox supports the
  unprefixed property in current versions, so the rule works in
  every browser the rest of the theme targets.

## Demo

A worked-example article lives at
[`exampleSite/content/articles/row-table-demo.md`](../../exampleSite/content/articles/row-table-demo.md)
covering the static, `compact`, and `expandable` variants against
a botanical "leaf shapes" catalogue. The demo is reachable from
the example site's Articles index.

## See also

- [`docs/SHORTCODES.md`](../SHORTCODES.md) §A "Article-body
  shortcodes" — the in-architecture-doc companion for this
  shortcode; §10 is locked to the 30-entry MediaWiki infobox
  contract and cannot host figure-style elements.
- [`layouts/_shortcodes/row-table.html`](../../layouts/_shortcodes/row-table.html)
  — the parent template (source of truth for the parent
  parameter list).
- [`layouts/_shortcodes/row.html`](../../layouts/_shortcodes/row.html)
  — the child template (source of truth for the child
  parameter list).
- [`layouts/_shortcodes/quick-row.html`](../../layouts/_shortcodes/quick-row.html)
  — the lightweight child template; only `title` is required.
- [`assets/css/components/_row-table.scss`](../../assets/css/components/_row-table.scss)
  — the SCSS that targets the class hook contract above.
- [`assets/js/modules/row-table.ts`](../../assets/js/modules/row-table.ts)
  — the progressive-enhancement module for the
  `variant="expandable"` opt-in (no-op when the variant is not
  used).

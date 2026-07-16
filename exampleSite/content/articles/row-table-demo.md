---
title: "Row-table demo"
date: 2026-07-14
draft: false
summary: "Demonstrates the {{< row-table >}} article-body shortcode — a reusable icon → text → photo layout, fully responsive across phone, tablet, laptop, and large desktop."
categories: ["Article-body demos", "Articles"]
tags: ["demo", "row-table", "article-body", "responsive"]
---


This page exercises the `{{</* row-table */>}}` shortcode — an article-body
element that renders a repeating `icon | text | photo` row layout. Each row
takes a small decorative SVG icon, a multi-line markdown body, and a photo;
the wrapper itself accepts an optional eyebrow, title, description, and
closing footer. The component is fully responsive — `clamp()`-driven
fluid typography, gap, and photo size scale from a 360px phone to a 1920px
desktop, and a single structural breakpoint at 720px (the project's
documented mobile boundary) reflows the grid from `icon | text | photo`
to a stacked `icon+text` row over a full-width photo.

The shortcode covers three shapes on this page: the default static case,
the `variant="compact"` tighter-spacing case, and the `variant="expandable"`
progressive-enhancement case (rows collapse to a 2-line preview on
narrow viewports and expand on tap / Enter / Space). Each example is
paired with a short prose explanation so the demo doubles as
documentation.

The photo slot now delegates its image to the shared
`layouts/_partials/article/thumb.html` partial, so row photos render at
their **native aspect ratio** (real `srcset`/`sizes` from Hugo image
processing, intrinsic `width`/`height` for zero layout shift) rather than
being cropped to a fixed 4/3 box with `object-fit: cover`. The
`.row-table__photo` cell is still the grid anchor and still supplies the
rounded surface and the lightbox zoom-in affordance; only the image inside
it stopped cropping.

## Default variant — three leaf shapes

The canonical shape: a wrapper with eyebrow + title + description,
followed by three rows. The icon column scales from ~2.5rem on a phone
to ~4rem on a large desktop; the photo column is `clamp(6rem, 4rem +
5vw, 10rem)` so it grows smoothly without dominating the text column.
At the 720px structural breakpoint the grid area remap stacks the
photo full-width below the icon+text row (no DOM order change, pure
`grid-template-areas` swap).

{{< row-table
    eyebrow     = "1/4 · Example"
    title       = "Common Houseplant Leaf Shapes"
    description = "A reusable icon → text → photo layout that scales fluidly between a 360px phone and a 1920px desktop."
    footer      = "All examples use staged fixtures from `exampleSite/static/media/` so the demo renders without external assets."
>}}

{{< row
    icon  = "leaf-ovate"
    title = "Ovate"
    image = "/media/sample-image-1.png"
    text  = "Egg-shaped leaf, wider near the base and tapering toward the tip. Common on **beeches**, **apples**, and a range of understory shrubs."
>}}

{{< row
    icon  = "leaf-palmate"
    title = "Palmate"
    image = "/media/sample-image-2.png"
    text  = "Lobes radiate outward from a single point, like fingers from a palm. *Maples*, *sycamores*, and the horse chestnut family show this pattern most clearly."
>}}

{{< row
    icon  = "leaf-pinnate"
    title = "Pinnate"
    image = "/media/sample-image-3.png"
    text  = "Leaflets arranged in pairs along a central stem, feather-like. *Ash*, *walnut*, and most legumes carry the trait."
>}}

{{< /row-table >}}

## `variant="compact"` — tighter spacing

The `compact` modifier tightens the row gap and padding, useful when the
table sits alongside prose in a busy article. The class hook is
`row-table--compact`; the variant is emitted automatically from the
`variant=` parameter so authors don't have to know the BEM suffix. (The
photo still renders at its native ratio — compact only changes the
surrounding spacing, not the image.)

{{< row-table
    eyebrow     = "2/4 · Compact"
    title       = "Same layout, less air"
    description = "The compact variant trims padding and gap while keeping the same icon → text → photo column structure."
    variant     = "compact"
>}}

{{< row
    icon  = "leaf-ovate"
    title = "Ovate (compact)"
    image = "/media/sample-image-4.png"
    text  = "Same component, smaller gap, narrower photo. Useful for sidebar summaries or in-flow comparison lists."
>}}

{{< row
    icon  = "leaf-pinnate"
    title = "Pinnate (compact)"
    image = "/media/sample-image-5.png"
    text  = "Pairs well with prose — the reduced padding keeps the rows reading as part of the article rather than a separate block."
>}}

{{< /row-table >}}

## `variant="expandable"` — progressive enhancement

The `expandable` variant adds `data-expandable="true"` to the wrapper
and makes the `assets/js/modules/row-table.ts` module opt in: on
viewports at or below 720px, each row shows a 2-line text preview and
toggles to full text on tap / Enter / Space. Above 720px the rows
render statically with the same 3-column grid as the default variant —
no click target, no `role="button"`, no keyboard affordance. The
default static case never runs the JS at all (the module short-
circuits when no `data-expandable` wrappers are present), so pages
that don't opt in pay no runtime cost beyond the loaded module.

To see the toggle: load this page on a phone or use the browser
devtools to set a viewport width ≤ 720px, then tap any row.

{{< row-table
    eyebrow     = "3/4 · Expandable"
    title       = "Tap to expand on narrow viewports"
    description = "Below the 720px structural breakpoint each row's text clamps to two lines and expands on tap. Above 720px the rows render identically to the default variant."
    variant     = "expandable"
>}}

{{< row
    icon  = "leaf-ovate"
    title = "Ovate (expandable)"
    image = "/media/sample-image-6.png"
    text  = "On narrow viewports this row's text is clamped to two lines and the whole row becomes a tap target — keyboard users get Enter / Space on the same row. Above 720px the row renders as a plain 3-column grid with no click target, so the static layout is never broken by stray clicks."
>}}

{{< row
    icon  = "leaf-palmate"
    title = "Palmate (expandable)"
    image = "/media/sample-image-7.png"
    text  = "The toggle keeps `aria-expanded` honest and respects `prefers-reduced-motion`: the 2-line clamp and full-text expansion are both immediate, with no animated transition when the user has asked for less motion."
>}}

{{< /row-table >}}

## `lightbox="true"` — full-screen photo viewer

Setting `lightbox="true"` on a `{{</* row */>}}` opts the photo into the
existing lightbox overlay (see `assets/js/modules/lightbox.ts` — same
overlay the figure shortcode uses, no extra JS shipped). The caption is
read from the row's `alt=` (falling back to `title=`), and a `group=`
value on the row — or inherited from the parent `{{</* row-table */>}}`
wrapper — joins the photos into a navigable carousel.

Click any photo below to open the overlay; ←/→ cycles through the
group, Escape closes, focus returns to the trigger.

{{< row-table
    eyebrow     = "4/4 · Lightbox"
    title       = "Leaf photos as a lightbox carousel"
    description = "One group key on the parent joins every photo into a single carousel — try the arrows once the overlay opens."
    group       = "leaf-photos"
>}}

{{< row
    icon  = "leaf-ovate"
    title = "Ovate"
    image = "/media/sample-image-1.png"
    text  = "First leaf in the carousel. Click the photo (or focus + Enter) to open the lightbox."
    lightbox = "true"
>}}

{{< row
    icon  = "leaf-palmate"
    title = "Palmate"
    image = "/media/sample-image-2.png"
    text  = "Same `group` value inherited from the parent — this photo opens in the same carousel as the one above."
    lightbox = "true"
>}}

{{< row
    icon  = "leaf-pinnate"
    title = "Pinnate"
    image = "/media/sample-image-3.png"
    text  = "A row can override the parent group with its own `group=` — useful for slotting a single row into a different carousel."
    lightbox = "true"
    group   = "leaf-photos-extra"
>}}

{{< /row-table >}}

## `quick-row` — fewer required params

The `quick-row` shortcode is a lightweight alternative to `row` for cases where
the full icon|text|photo triple is overkill. Only title is required; text,
image, icon, and alt are all optional. It also adds an href parameter
that turns the entire text cell into a clickable link — useful for directory
listings where each row links to a detail page.

Below: three `quick-row` examples inside a `row-table`. The first
omits image (icon + text only), the second omits text (icon + linked title
only), the third uses all four slots.

{{< row-table
    eyebrow     = "5/5 · Quick"
    title       = "Article types"
    description = "A `quick-row` is the right pick when you only need title, or title + text, or title + photo — without the ceremony of all three. It also adds `href=` for a fully clickable row."
>}}

{{< quick-row
    icon  = "leaf-palmate"
    title = "How-to articles"
    text  = "Step-by-step guides and tutorials. Supports code blocks, callouts, and embedded media."
    href  = "/articles/how-to/"
>}}

{{< quick-row
    icon  = "leaf-ovate"
    title = "Reference docs"
    text  = "API references, configuration guides, and technical specifications."
    href  = "/docs/"
>}}

{{< quick-row
    icon  = "leaf-pinnate"
    title = "Blog posts"
    href  = "/blog/"
>}}

{{< quick-row
    icon  = "leaf-ovate"
    title = "Community showcase"
    image = "/media/sample-image-5.png"
    text  = "Real-world sites built with the theme. Screenshots, descriptions, and links."
>}}

{{< /row-table >}}

## Parameters

| Parameter     | Required | Purpose |
|---------------|----------|---------|
| `eyebrow`     | optional | Small kicker label above the title. |
| `title`       | optional | Heading text; rendered at the level set by `level=`. |
| `level`       | optional | Heading level (default `3`); respects surrounding document outline. |
| `description` | optional | Markdown-rendered intro paragraph. |
| `footer`      | optional | Markdown-rendered closing note. |
| `variant`     | optional | `compact` or `expandable`; emitted as `row-table--{variant}`. |
| `group`       | optional | Lightbox carousel key inherited by every child row that opts into `lightbox="true"` without its own `group=`. |
| inner rows    | required | One or more `{{</* row */>}}` or `{{</* quick-row */>}}` children. |

The `{{</* row */>}}` child accepts: `title` (required), `text` (required,
markdown), `image` (required — rendered through the shared
`article/thumb.html` partial at native ratio with `srcset`/`sizes`, no
4:3 crop),
`icon` (optional, basename under `layouts/partials/icons/`), `image2`
(optional, image path/URL rendered into the icon slot at icon scale —
mutually exclusive with icon, image2 takes priority), `alt` (optional,
defaults to the row `title`), `lightbox` (optional, `"true"` opts the
photo into the lightbox overlay), `image2lightbox` (optional, `"true"`
opts image2 into the lightbox overlay), `group` (optional, lightbox
carousel key — overrides the parent default). Missing required parameters
raise a build-time `errorf` so empty rows never reach the rendered
output.

The `{{</* quick-row */>}}` child is a lightweight alternative where only
`title` is required. `text` and `image` are both optional (omitting either
skips that slot entirely), and `href=` turns the text cell into a clickable
link. All other params (`icon`, `image2`, `alt`, `image2alt`, `lightbox`,
`image2lightbox`, `group`) work the same as `{{</* row */>}}`. Use
`{{</* quick-row */>}}` for directory-style listings where you only need
a subset of the icon|text|photo triple.

The full per-shortcode reference lives at
[`docs/shortcodes/row-table.md`](../../../docs/shortcodes/row-table.md);
the in-architecture-doc companion is in `docs/SHORTCODES.md` §A.

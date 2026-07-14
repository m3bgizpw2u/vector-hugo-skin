---
title: "Thumb demo"
date: 2026-07-14
draft: false
summary: "Demonstrates the {{< thumb >}} inline thumbnail shortcode — native-ratio responsive rendering, alignment, paired caption, and lightbox."
categories: ["Infobox demos", "Articles"]
tags: ["demo", "thumb", "media", "article-body"]
---

This page exercises the `{{</* thumb */>}}` shortcode — the inline
article-body thumbnail that reproduces Wikipedia's responsive-image
pattern. Unlike the old `aspect-ratio: 4/3` crop, `{{</* thumb */>}}`
fixes the *container width* and lets the image's height scale to its
native ratio, so a landscape photo and a portrait photo rendered with
the identical shortcode call keep their true proportions — no cropping,
no distortion. Every image routes through the shared
`layouts/_partials/article/thumb.html` partial, which emits a real
Hugo-processed `srcset`/`sizes` set for responsive delivery.

Resize your browser from desktop to tablet to mobile and watch the
thumbnails: they float beside this text at desktop and tablet widths,
then drop the float and go full-width below the mobile breakpoint
(720px).

## Landscape source, right-aligned (the default)

The canonical right-aligned thumbnail. `align="right"` is the default,
so it can be omitted; the image floats right and body text wraps around
its left edge. The container caps at roughly 20rem on desktop and the
height follows the source's 16:9 ratio.

{{< thumb
    src     = "/media/sample-image-1.png"
    alt     = "A wide landscape sample image"
    caption = "A 16:9 landscape source, rendered at its native ratio."
>}}{{< /thumb >}}

```go
{{< thumb
    src     = "/media/sample-image-1.png"
    alt     = "A wide landscape sample image"
    caption = "A 16:9 landscape source, rendered at its native ratio."
>}}{{< /thumb >}}
```

The rendered `<img>` carries intrinsic `width` and `height` attributes
(the source's real pixel dimensions) so the browser reserves the correct
vertical space before the bytes arrive — no cumulative layout shift — even
though CSS uses `height: auto` to compute the final rendered height from
the container width.

The lead paragraph here and the following filler prose exist to give the
float something to wrap around. The float behaviour is identical to the
Wikipedia default-size thumb: the figure sits to the right, the text
column narrows to fill the remaining space, and at the mobile breakpoint
the figure stops floating and the text returns to full width.

## Portrait source, same shortcode

The exact same shortcode call, pointed at a 3:4 portrait source. This is
the whole point of the native-ratio pattern: the portrait renders *tall*,
uncropped, where the old fixed-ratio crop would have sliced it into a
4:3 letterbox. The container width is the cap; the height simply follows.

{{< thumb
    src     = "/media/sample-image-portrait.png"
    alt     = "A tall portrait sample image"
    caption = "A 3:4 portrait source at the same container width — taller, uncropped."
>}}{{< /thumb >}}

```go
{{< thumb
    src     = "/media/sample-image-portrait.png"
    alt     = "A tall portrait sample image"
    caption = "A 3:4 portrait source at the same container width — taller, uncropped."
>}}{{< /thumb >}}
```

Compare the two figures above: identical container width, different
heights, each true to its source. That is the native-ratio contract.

## Left-aligned

`align="left"` floats the figure to the left; body text wraps around its
right edge. Everything else is identical.

{{< thumb
    src     = "/media/sample-image-2.png"
    alt     = "A landscape sample image, left-aligned"
    caption = "Left-aligned — the text wraps around the right edge."
    align   = "left"
>}}{{< /thumb >}}

```go
{{< thumb
    src     = "/media/sample-image-2.png"
    alt     = "A landscape sample image, left-aligned"
    caption = "Left-aligned — the text wraps around the right edge."
    align   = "left"
>}}{{< /thumb >}}
```

This filler text wraps around the left-floated figure so the alignment
is visible. At the mobile breakpoint the float drops and the figure goes
full-width, just like the right-aligned case.

## Unaligned (block flow), paired caption with a Markdown link

`align="none"` renders the figure in normal block flow — no float — which
is useful for a centred hero image or a figure that should not have text
wrapping it. This example also uses the *paired body* form: the caption is
authored between the tags, so it can carry inline Markdown such as a
[link to the figure shortcode demo]({{< ref "figure-demo" >}}) or
*emphasis*.

{{< thumb
    src   = "/media/sample-image-3.png"
    alt   = "A landscape sample image in block flow"
    align = "none"
    width = "32rem"
>}}
Block-flow figure with a paired caption that carries a
[Markdown link]({{< ref "figure-demo" >}}) and *emphasis*.
{{< /thumb >}}

```go
{{< thumb
    src   = "/media/sample-image-3.png"
    alt   = "A landscape sample image in block flow"
    align = "none"
    width = "32rem"
>}}
Block-flow figure with a paired caption that carries a
[Markdown link]({{</* ref "figure-demo" */>}}) and *emphasis*.
{{< /thumb >}}
```

When `.Inner` (the paired body) is non-empty it becomes the caption and
wins over the `caption="…"` parameter, so authors can pick whichever form
fits the caption's complexity.

## Lightbox

`lightbox="true"` opts the figure into the shared lightbox overlay and
renders a magnify button in the corner of the image. Clicking the image
or the magnify button opens the full-resolution overlay;
`group="thumb-gallery"` scopes the carousel so the arrows cycle only
within the group.

{{< thumb
    src      = "/media/sample-image-4.png"
    alt      = "A landscape sample image with lightbox enabled"
    caption  = "Click the image or the magnify button to open the lightbox."
    lightbox = "true"
    group    = "thumb-gallery"
>}}{{< /thumb >}}

{{< thumb
    src      = "/media/sample-image-5.png"
    alt      = "A second landscape sample image in the same lightbox group"
    caption  = "A second image in the same carousel group."
    lightbox = "true"
    group    = "thumb-gallery"
>}}{{< /thumb >}}

```go
{{< thumb src="/media/sample-image-4.png" alt="…" caption="…" lightbox="true" group="thumb-gallery" >}}{{< /thumb >}}
{{< thumb src="/media/sample-image-5.png" alt="…" caption="…" lightbox="true" group="thumb-gallery" >}}{{< /thumb >}}
```

The magnify button is a real `<button>`, so it is keyboard-focusable and
announces its per-image label ("Open image: …"). The lightbox overlay,
carousel, and focus trap are reused verbatim from
`assets/js/modules/lightbox.ts` — the thumb module only wires the button
into that existing overlay.

## Parameters

| Parameter | Required | Purpose |
|---|---|---|
| `src` | required | Image URL (remote `http(s)://`) or a site-/assets-relative path. |
| `alt` | optional | Alt text; empty string is valid for a decorative image. |
| `caption` | optional | Caption markup; markdownified. Ignored when the paired body (`.Inner`) is non-empty. |
| `align` | optional | `"right"` (default) \| `"left"` \| `"none"`; emitted as `data-align`. |
| `width` | optional | CSS length cap for the desktop container; also feeds the `sizes` hint. |
| `lightbox` | optional | `"true"` opts into the lightbox overlay + magnify button. |
| `group` | optional | Lightbox carousel key; only meaningful when `lightbox="true"`. |

The list mirrors the comment header at the top of
`layouts/_shortcodes/thumb.html`, which is the source of truth. See
[`docs/shortcodes/thumb.md`](../../../docs/shortcodes/thumb.md) for the
full reference page (CSS hooks, responsiveness, accessibility, and the
research divergences baked into the shared partial).

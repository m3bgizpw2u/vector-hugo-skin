---
title: "Figure demo"
date: 2026-07-12
draft: false
summary: "Demonstrates the {{< figure >}} article-body shortcode — image, audio, video, paired-with-inner, and lightbox group."
categories: ["Infobox demos", "Articles"]
tags: ["demo", "figure", "media", "article-body"]
---

This page exercises the `{{</* figure */>}}` shortcode — the article-body
figure used between paragraphs of prose for inline media (Element 3 and
Element 4 of the Sally Ride research). The shortcode covers five shapes:
the parameter-only image, the paired image with author-supplied caption,
`kind="audio"`, `kind="video"`, and the lightbox `group` scoping. Each
example is paired with a short prose explanation so the demo doubles as
documentation.

## Parameter-only image (Element 4)

The canonical right-aligned thumbnail — a floated image with an
alt-text, a captioned figure caption, and a `halign="right"` data
attribute that the future `assets/css/components/figure.scss` (ticket 002)
will style as a float.

{{< figure
    src     = "/media/sally-ride-portrait.jpg"
    alt     = "Sally Ride in 1984"
    caption = "Ride in 1984, the year she became the first American woman in space."
    halign  = "right"
>}}{{< /figure >}}

```go
{{< figure
    src     = "/media/sally-ride-portrait.jpg"
    alt     = "Sally Ride in 1984"
    caption = "Ride in 1984, the year she became the first American woman in space."
    halign  = "right"
>}}{{< /figure >}}
```

The shortcode is paired-form because the underlying template references
`.Inner` (see `layouts/_shortcodes/figure.html` lines 70–98). Even when
there is no body content, the empty-body paired form is valid Hugo and is
the canonical write shape for the named wrapper family.

## Paired image (author-supplied caption with Markdown link)

When the caption needs a Markdown link that the `caption="…"` parameter
cannot easily express, the author drops the caption into the paired body.
The inner text passes through `markdownify` so inline links, bold, and
emphasis all work.

{{< figure
    src    = "/media/sally-ride-water-survival-training.jpg"
    halign = "right"
>}}Sally Ride during a water survival training session at NASA's
[Neutral Buoyancy Laboratory](https://en.wikipedia.org/wiki/Neutral_Buoyancy_Laboratory).
{{</ figure >}}

```go
{{< figure
    src    = "/media/sally-ride-water-survival-training.jpg"
    halign = "right"
>}}Sally Ride during a water survival training session at NASA's
[Neutral Buoyancy Laboratory](https://en.wikipedia.org/wiki/Neutral_Buoyancy_Laboratory).
{{</ figure >}}
```

This is the canonical pattern when the caption contains inline Markdown —
the `caption="…"` parameter works for plain text, but anything more
expressive belongs in the inner body.

## `kind="audio"` (Element 3)

`kind="audio"` emits a native `<audio controls preload="metadata">`
element with a download-link fallback. No custom player UI in v1 — the
browser-default controls are the v1 surface.

{{< figure
    kind        = "audio"
    src         = "/media/audio/sample.mp3"
    attribution = "NASA Audio Recording, STS-7 launch commentary, 18 June 1983."
    caption     = "Launch commentary excerpt from STS-7, 18 June 1983."
>}}{{< /figure >}}

```go
{{< figure
    kind        = "audio"
    src         = "/media/audio/sample.mp3"
    attribution = "NASA Audio Recording, STS-7 launch commentary, 18 June 1983."
    caption     = "Launch commentary excerpt from STS-7, 18 June 1983."
>}}{{< /figure >}}
```

The `src` here is a placeholder — this is a demo, the file does not need
to exist. The point of the example is to confirm the Hugo build pipeline
renders the `<audio>` element without crashing.

## `kind="video"` (Element 3)

`kind="video"` emits the analogous `<video controls preload="metadata">`
shape — same browser-default controls, same download-link fallback, same
static surface.

{{< figure
    kind        = "video"
    src         = "/media/video/sample.mp4"
    attribution = "NASA mission footage, STS-7 onboard recording, 1983."
    caption     = "Onboard footage excerpt from STS-7, 1983."
>}}{{< /figure >}}

```go
{{< figure
    kind        = "video"
    src         = "/media/video/sample.mp4"
    attribution = "NASA mission footage, STS-7 onboard recording, 1983."
    caption     = "Onboard footage excerpt from STS-7, 1983."
>}}{{< /figure >}}
```

As with the audio example, `src` is a placeholder; the goal is to verify
the build emits the `<video>` element cleanly.

## Lightbox group — two siblings sharing a `group` key

`lightbox="true"` opts the figure into the lightbox carousel, and
`group="gallery-1"` scopes the carousel so arrows cycle only within the
group. Two sibling figures sharing the same `group` key form one
carousel; figures without a group (or with `group="default"`) join the
default carousel.

{{< figure
    src        = "/media/sally-ride-gallery-1.jpg"
    alt        = "Sally Ride on the flight deck of STS-7"
    caption    = "Ride on the flight deck of STS-7, June 1983."
    lightbox   = "true"
    group      = "gallery-1"
>}}{{< /figure >}}

{{< figure
    src        = "/media/sally-ride-gallery-2.jpg"
    alt        = "Sally Ride in the middeck of STS-7"
    caption    = "Ride in the middeck of STS-7, June 1983."
    lightbox   = "true"
    group      = "gallery-1"
>}}{{< /figure >}}

```go
{{< figure src="/media/sally-ride-gallery-1.jpg" alt="…" caption="…" lightbox="true" group="gallery-1" >}}{{< /figure >}}
{{< figure src="/media/sally-ride-gallery-2.jpg" alt="…" caption="…" lightbox="true" group="gallery-1" >}}{{< /figure >}}
```

The trigger attribute on the rendered DOM is `data-lightbox` (booleany,
present on the `<figure>`); the scoping attribute is
`data-lightbox-group="gallery-1"`. The lightbox JS module
(`assets/js/modules/lightbox.ts`, ticket 009) reads those attributes
and wires up arrow-key navigation without further DOM coordination.

## Parameters

| Parameter | Required | Purpose |
|---|---|---|
| `src` | required | Image / audio / video URL. |
| `alt` | optional | Alt text for the inner `<img>`. |
| `caption` | optional | Caption text under the figure; passed through `markdownify`. |
| `attribution` | optional | Speaker / source credit for `kind="audio"` / `kind="video"`. |
| `halign` | optional | `"left"` \| `"right"` \| `""`; emitted as `data-halign="…"`. |
| `kind` | optional | `"image"` (default) \| `"audio"` \| `"video"`. |
| `lightbox` | optional | `"true"` opts the figure into the lightbox carousel. |
| `group` | optional | Lightbox group key; only meaningful when `lightbox="true"`. |
| `width` | optional | CSS length for the figure width; accepted for forward-compat but not yet emitted. |

The list mirrors the comment header at the top of
`layouts/_shortcodes/figure.html`, which is the source of truth. See
[`docs/shortcodes/figure.md`](../../../docs/shortcodes/figure.md) for
the full reference page (CSS hooks, lightbox integration, v1 scope
limits).
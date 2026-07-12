# `{{< figure >}}`

Article-body figure — image, audio, or video embedded inline in the prose,
with optional caption, float alignment, and lightbox participation.
Replicates Element 4 (right-aligned thumbnail) and Element 3 (audio-visual
thumb) from the Sally Ride research in a single shortcode, distinguished by
the `kind` parameter.

## When to use it vs. upstream alternatives

Use `{{< figure >}}` for any media that lives **between paragraphs of article
prose**: the standard right-aligned thumbnail (`halign="right"`), an inline
audio clip (`kind="audio"`), an inline video (`kind="video"`), or any of the
above opted into the lightbox carousel (`lightbox="true" group="…"`. The
shortcode is an article-body element — it is **not** an infobox wrapper and
has no upstream `Template:Infobox figure` mapping. Infobox portraits stay
inside the named `{{< person >}}` / `{{< settlement >}}` / etc. wrappers;
the right-hand infobox column is the infobox family's home, not figure's.

For an image without captioning, float alignment, or lightbox, a plain
Markdown `![alt](src)` is fine. For audio/video the shortcode is the only
author-friendly surface: Hugo's Markdown renderer emits `<audio>` and
`<video>` tags with no controls, no fallback link, and no consistent
attributes; `{{< figure >}}` standardises the wrapper.

## Parameters

The full parameter list, in declaration order. The list mirrors the comment
header at the top of `layouts/_shortcodes/figure.html`, which is the source
of truth.

| Parameter | Required | Purpose |
|---|---|---|
| `src` | required | Image / audio / video URL. |
| `alt` | optional | Alt text for the inner `<img>`. |
| `caption` | optional | Caption text under the figure; passed through `markdownify` so inline links / emphasis work. |
| `attribution` | optional | Speaker / source credit (used when `kind="audio"` or `kind="video"`). |
| `halign` | optional | `"left"` \| `"right"` \| `""`; emitted as `data-halign="…"`. Empty string when omitted. |
| `kind` | optional | `"image"` (default) \| `"audio"` \| `"video"`. |
| `lightbox` | optional | `"true"` opts the figure into the lightbox carousel via `data-lightbox`. |
| `group` | optional | Lightbox group key; only meaningful when `lightbox="true"`; ignored otherwise. |
| `width` | optional | CSS length for the figure width; accepted for forward-compat but not yet emitted as an inline style. The CSS hook is ticket 002's job. |

## Worked example

**Parameter-only image form:**

```go
{{< figure
    src     = "/media/sally-ride-portrait.jpg"
    alt     = "Sally Ride in 1984"
    caption = "Ride in 1984, the year she became the first American woman in space."
    halign  = "right"
>}}{{< /figure >}}
```

**Paired-with-inner form (author-supplied caption that includes a Markdown link):**

```go
{{< figure
    src    = "/media/sally-ride-water-survival-training.jpg"
    halign = "right"
>}}Sally Ride during a water survival training session at NASA's
[Neutral Buoyancy Laboratory](https://en.wikipedia.org/wiki/Neutral_Buoyancy_Laboratory).
{{</ figure >}}
```

When inner content is non-empty it becomes the figure body, and the inner
text passes through `markdownify` so inline links and emphasis work. Without
inner content the figure body falls back to the per-kind element (image /
audio / video) generated from the parameters.

## CSS hooks

The template emits a fixed set of class names and data attributes on every
`<figure>`. The class names are the CSS hook contract for the article-body
SCSS — anything `assets/css/components/figure.scss` (ticket 002) styles
must use exactly these names, and the template must emit exactly these
names. The list mirrors the comment header at the top of
`layouts/_shortcodes/figure.html`.

| Selector | Purpose |
|---|---|
| `.figure` | The root element. |
| `[data-halign="left\|right\|"]` | Float direction (empty string when `halign` is omitted). |
| `[data-mw-size="default"]` | MediaWiki size slot — CSS-controlled by `figure.scss`. |
| `[data-kind="image\|audio\|video"]` | Per-kind styling hook. |
| `[data-lightbox]` | Booleany; the lightbox JS module (`assets/js/modules/lightbox.ts`) consumes this. |
| `[data-lightbox-group="key"]` | Optional carousel scoping key; emitted only when `lightbox="true"` and `group` is set. |

The §6 CSS hook contract in `docs/SHORTCODES.md` applies to infobox
shortcodes only. Figure stands outside that scope and uses its own minimal
hook set above.

## Variant table

| `kind` | What it emits | When to use |
|---|---|---|
| `image` (default) | `<img src alt loading="lazy">` | The standard right-aligned thumbnail (Element 4). The default; can be omitted. |
| `audio` | `<audio controls preload="metadata" src>` with download-link fallback | Inline audio clip (Element 3); `<audio controls>` is the browser-default player. |
| `video` | `<video controls preload="metadata" src>` with download-link fallback | Inline video (Element 3); `<video controls>` is the browser-default player. |

## Lightbox integration

`lightbox="true"` opts the figure into the lightbox carousel — clicking the
figure opens the in-page carousel powered by `assets/js/modules/lightbox.ts`
(ticket 009), and arrow keys cycle through the carousel. Two or more
sibling figures that share a `group="key"` form one carousel; figures
without a group (or with `group="default"`) join the default carousel.
There is **no auto-grouping** across the page — the author opts in
explicitly per figure. Example:

```go
{{< figure src="/media/ride-1.jpg" lightbox="true" group="gallery-1" caption="…" >}}{{< /figure >}}
{{< figure src="/media/ride-2.jpg" lightbox="true" group="gallery-1" caption="…" >}}{{< /figure >}}
```

The trigger attribute on the rendered DOM is `data-lightbox` (booleany,
present on the `<figure>`); the optional scoping attribute is
`data-lightbox-group="key"`. Without `lightbox="true"` the figure renders
as a plain `<figure>` and the JS module never touches it.

## Limitations / v1 scope

- **Audio and video tags are static `<audio controls>` / `<video controls>`.**
  No custom player UI in v1 — the browser-default controls are the v1
  surface. Custom skins, caption tracks (`<track kind="captions">`),
  poster images, and inline play/pause buttons are out of scope until a
  follow-on phase adds them.
- **The `width` parameter is accepted but not yet emitted.** Ticket 002
  (figure SCSS) owns the actual width-handling logic; until then the
  parameter is recorded for forward-compat and the CSS hook is on hold.
- **No upstream `Template:Infobox figure` mapping exists.** Figure is an
  article-body element (Sally Ride Elements 3 / 4), not an infobox
  wrapper. There is no MediaWiki `Template:Infobox figure` to port from;
  the shortcode is original to this theme.
- **Lightbox is the v1 image carousel.** Audio and video figures do not
  participate in the lightbox carousel even when `lightbox="true"` is set;
  the carousel is image-only in v1.

## See also

- [`docs/SHORTCODES.md`](../SHORTCODES.md) §A — the in-architecture-doc entry for the figure shortcode.
- [`layouts/_shortcodes/figure.html`](../../layouts/_shortcodes/figure.html) — the shortcode template; its header docblock is the source of truth for parameters.
- `.plans/research-2026-07-12/sally-ride-replication-spec.md` lines 22–50 — the design source for figure as Element 3 / Element 4 of the Sally Ride replication.
- Demo article: [`exampleSite/content/articles/figure-demo.md`](../../exampleSite/content/articles/figure-demo.md)
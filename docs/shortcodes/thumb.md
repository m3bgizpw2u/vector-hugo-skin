# `{{< thumb >}}`

Article-body thumbnail — a single responsive image with an optional caption,
float alignment, and lightbox participation, rendered at the source image's
**native aspect ratio**. Reproduces Wikipedia's `figure[typeof~='mw:File/Thumb']`
pattern: the container's width is capped, the image's height scales to match
its intrinsic ratio (no cropping, no forced aspect ratio), the figure floats
beside body text on desktop/tablet, and it stacks full-width on mobile.

`{{< thumb >}}` is the user-facing entry point for the project's shared
image-rendering partial (`layouts/_partials/article/thumb.html`). That same
partial is what `{{< figure >}}`, the infobox image block, and the
`{{< row >}}` photo slot all delegate to — so a thumbnail rendered here is
pixel-for-pixel consistent with an image rendered by any other shortcode.

## When to use it vs. alternatives

Reach for `{{< thumb >}}` when you want the plain Wikipedia inline thumbnail:
one image, floated right (or left), with a caption, optionally clickable into
the lightbox. It is the lightest-weight image shortcode — no `kind` switch, no
audio/video branch, no border chrome.

- For an image that needs the bordered `<figure>` frame, or an audio/video
  player, use [`{{< figure >}}`](figure.md) — it wraps the same partial but adds
  the `.figure` chrome and the `kind="audio"` / `kind="video"` branches.
- For a repeating `icon | text | photo` layout, use
  [`{{< row-table >}}`](row-table.md).
- For an infobox portrait, use the named infobox wrapper
  (`{{< person >}}` / `{{< settlement >}}` / …) — the image column already
  routes through the shared partial.
- For a plain uncaptioned, unfloated image, Markdown `![alt](src)` is fine.

## Parameters

The list mirrors the comment header at the top of
`layouts/_shortcodes/thumb.html`, which is the source of truth.

| Parameter | Required | Purpose |
|---|---|---|
| `src` | required | Image URL — remote (`http(s)://`) or a site-relative / assets-relative path. Missing `src` raises a build-time `errorf`. |
| `alt` | optional | Alt text; an empty string is valid for a decorative image. |
| `caption` | optional | Caption markup; markdownified so inline links / emphasis work. Ignored when the paired body (`.Inner`) is non-empty. |
| `align` | optional | `"right"` (default) \| `"left"` \| `"none"`; emitted as `data-align` and driving the float direction. |
| `width` | optional | CSS length cap for the desktop container; also feeds the partial's `sizes` hint. |
| `lightbox` | optional | `"true"` opts into the lightbox overlay and renders the magnify button. |
| `group` | optional | Lightbox carousel key; only meaningful when `lightbox="true"`. |

## Worked examples

**Parameter-only form (right-aligned, the Wikipedia default placement):**

```go
{{< thumb
    src     = "/media/sample-image-1.png"
    alt     = "A landscape reference photo"
    caption = "A landscape source renders wider than it is tall."
    align   = "right"
>}}{{< /thumb >}}
```

**Portrait source, left-aligned — same shortcode, native ratio preserved:**

```go
{{< thumb
    src     = "/media/sample-image-portrait.png"
    alt     = "A portrait reference photo"
    caption = "A portrait source renders taller than it is wide — no cropping."
    align   = "left"
>}}{{< /thumb >}}
```

**Paired-with-inner form (caption carries an inline Markdown link):**

```go
{{< thumb src="/media/sample-image-2.png" alt="…" align="right" lightbox="true" >}}
Photographed on location. See the [source archive](https://example.com/archive).
{{< /thumb >}}
```

When the paired body is non-empty it becomes the caption (rendered through the
page's `RenderString`, so inline Markdown works); otherwise the `caption="…"`
parameter is used.

## CSS hooks

The shared partial emits a fixed set of class names and data attributes. The
component styles live in `assets/css/components/_thumb.scss`.

| Selector | Purpose |
|---|---|
| `.thumb` | The root `<figure>`. |
| `[data-align="right\|left\|none"]` | Float direction (desktop/tablet); dropped at the mobile breakpoint. |
| `[data-lightbox]` | Present when `lightbox="true"`; consumed by `assets/js/modules/lightbox.ts`. |
| `[data-lightbox-group="key"]` | Optional carousel scoping; emitted only when `group` is set. |
| `[data-thumb-width="…"]` | The desktop width override, when `width` is set (forward-compat styling hook). |
| `[data-revealed="true"]` | Set by `assets/js/modules/thumb.ts` when the figure scrolls into view. |
| `.thumb__image-wrap` | The `<img>` + magnify button positioning box. |
| `.thumb__img` | The `<img>` itself — `width: 100%; height: auto` (native ratio). |
| `.thumb__magnify` | The magnify button (lightbox trigger); rendered only when `lightbox="true"`. |
| `.thumb__caption` | The `<figcaption>`. |

## Responsive images

The partial runs `src` through Hugo's image processing (`resources.GetRemote`
for remote URLs, `resources.Get` for assets-relative paths) and emits a
3-width `srcset` (320 / 640 / 800w) plus a `sizes` hint. The `<img>` carries
intrinsic `width`/`height` attributes so the browser reserves the correct
vertical space before the bytes land (CLS-friendly), while CSS `height: auto`
computes the rendered height from the container width. If the source cannot be
resolved as a Hugo resource (e.g. a bare `static/` path), the partial falls
back to a plain `<img src>` with no `srcset` — the image still renders at its
native ratio, just without the responsive variants.

## Responsiveness

Three tiers, matching the project's documented breakpoints
(`assets/css/base/_tokens.scss`):

- **Mobile** (`< 720px`): float dropped, figure goes full-width; the magnify
  button stays visible (no hover on touch).
- **Tablet** (`720–1024px`): float retained, width clamped narrower.
- **Desktop** (`> 1024px`): float per `align`, width capped at `--thumb-max-width`
  (`20rem` by default).

## Accessibility

- `alt` is passed straight through; supply meaningful alt text (or `alt=""`
  for a purely decorative image).
- The magnify button is a real `<button>` with an `aria-label` derived from the
  caption (e.g. "Open image: …"), so it is tabbable and announces correctly.
- The reveal animation is skipped entirely under
  `prefers-reduced-motion: reduce` — the magnify button is shown immediately.

## Limitations / v1 scope

- **Images only.** Audio and video stay on `{{< figure >}}` with its
  `kind="audio"` / `kind="video"` branches.
- **No border chrome.** The bordered `<figure>` frame is `{{< figure >}}`'s
  surface; `thumb` is deliberately frame-free.
- **`srcset` requires an assets-resolvable source.** A `static/`-only path
  falls back to a plain `<img>` (see *Responsive images* above).
- **Lightbox is the shared overlay.** `thumb` does not ship its own overlay —
  the magnify button and figure click both open `assets/js/modules/lightbox.ts`.

## See also

- [`docs/SHORTCODES.md`](../SHORTCODES.md) §A — the in-architecture-doc entry.
- [`layouts/_shortcodes/thumb.html`](../../layouts/_shortcodes/thumb.html) — the shortcode template.
- [`layouts/_partials/article/thumb.html`](../../layouts/_partials/article/thumb.html) — the shared image-rendering partial (research notes + intentional divergences in its header).
- [`docs/shortcodes/figure.md`](figure.md) — the bordered / audio-video sibling that wraps the same partial.
- Demo article: [`exampleSite/content/articles/thumb-demo.md`](../../exampleSite/content/articles/thumb-demo.md)

# Building blocks — infobox primitives

The **infobox primitives** are the inner shortcodes the named wrappers
are built from. They are the escape hatch when a named wrapper's fixed
schema does not cover a field an author needs: switch the named
shortcode to its paired form, then drop primitives directly into the
`.Inner` block.

The primitives split into two groups:

- **Five generic primitives** — the building blocks of any infobox
  (outer wrapper, single row, image block, section divider, footer).
- **Seven special-case pair primitives** — common field pairs promoted
  to their own primitive because they appear in so many named
  templates that asking the author to compose two `infobox-row` calls
  would be wasted work.

All primitives render through the same base partial as the named
wrappers, so a primitive inside a `.Inner` block is visually
indistinguishable from the same primitive called from inside a named
wrapper's dict. The CSS hook contract in [`docs/SHORTCODES.md`](../SHORTCODES.md)
§6 applies identically.

## Outer wrapper — `{{< infobox >}}`

**Paired.** The outer paired wrapper, used when an article does not
fit any named template and the author wants to build the full row
list from primitives. The named wrappers are thin shims around this
primitive in concept — a named wrapper is just a fixed dict that the
`infobox` primitive consumes.

**Parameters:**

| Name | Required | Purpose |
|---|---|---|
| `type` | optional | The `data-infobox-type` attribute. Defaults to `"custom"`. The SCSS attribute-selector keys per-template visual tweaks off this value. |
| `title` | optional | The header cell text. Omit for an un-titled box. |
| `image` | optional | The image filename (resolved against the page bundle / `static/`). |
| `caption` | optional | The caption under the image. Rendered through `markdownify`, so inline emphasis and links work. |
| `alt` | optional | The `alt` text on the `<img>` for assistive tech. |
| `below` | optional | The optional freeform footer block. Rendered through `markdownify`. |

**Worked example:**

```go
{{< infobox type="custom" title="My Topic" image="placeholder.jpg" caption="*Sample caption*" alt="Sample image" >}}
  {{< infobox-section title="Details" >}}
    {{< infobox-row label="Field one" value="First value" >}}
    {{< infobox-row label="Field two" value="Second value" >}}
  {{< /infobox-section >}}
  {{< infobox-row label="Single row" value="Renders without a section" >}}
  {{< infobox-below content="Footer text with [a link](https://example.com)." >}}
{{< /infobox >}}
```

**When to reach for it:** when no named shortcode matches the article
type. Most articles use a named shortcode; this primitive is the
fallback for one-off boxes.

## Single row — `{{< infobox-row >}}`

**Paired.** A single label/value row. The dominant row type — two-
column key/value layout. Two equivalent forms:

- Parameter form: `{{< infobox-row label="Born" value="1990-01-15" >}}`
- Paired form: `{{< infobox-row >}}Born: 1990-01-15{{< /infobox-row >}}` — the body text becomes the label, no value.

The parameter form wins when both are present. The value is rendered
through `markdownify`, so `**bold**`, `*italic*`, and `[links](url)`
work inside the value.

**Parameters:**

| Name | Required | Purpose |
|---|---|---|
| `label` | optional | The label cell text. Falls back to the `.Inner` content if omitted. |
| `value` | optional | The data cell text. Markdown-rendered. |

**Worked example:**

```go
{{< infobox-row label="Born" value="11 March 1952" >}}
{{< infobox-row label="Notable works" value="*The Hitchhiker's Guide to the Galaxy*" >}}
```

A row is omitted entirely when both `label` and `value` are empty —
matching the named wrappers' "absent values leave no empty rows"
guarantee.

## Image block — `{{< infobox-image >}}`

**Paired but bodyless in practice.** The image + caption + alt block,
used standalone when a named wrapper does not cover the article's
image (most named wrappers accept their own `image` / `caption` /
`alt` params; reach for this primitive when the named wrapper does
not, or when composing a fully-custom `infobox` from primitives).

**Parameters:**

| Name | Required | Purpose |
|---|---|---|
| `image` | required | The image filename. |
| `caption` | optional | Caption under the image. Markdown-rendered. |
| `alt` | optional | Alt text for assistive tech. |

**Worked example:**

```go
{{< infobox-image image="placeholder.jpg" caption="*Sample caption with emphasis*" alt="Sample image" >}}
```

## Section divider — `{{< infobox-section >}}`

**Paired.** A grouping header that spans both columns. Breaks the row
list into thematic groups (e.g. "Personal life", "Career", "Awards").
Useful in long infoboxes where the row list otherwise runs together.

**Parameters:**

| Name | Required | Purpose |
|---|---|---|
| `title` | required | The section header text. |

**Worked example:**

```go
{{< infobox-section title="Personal life" >}}
  {{< infobox-row label="Spouse" value="Jane Doe" >}}
  {{< infobox-row label="Children" value="Two" >}}
{{< /infobox-section >}}
{{< infobox-section title="Career" >}}
  {{< infobox-row label="Years active" value="2010–present" >}}
{{< /infobox-section >}}
```

## Footer block — `{{< infobox-below >}}`

**Paired but bodyless in practice.** The freeform footer block at the
bottom of the box. Mirrors the upstream MediaWiki `below` slot. Use
it for footnotes, see-also links, or trailing commentary the author
wants kept inside the box rather than in the body.

**Parameters:**

| Name | Required | Purpose |
|---|---|---|
| `content` | optional | The footer text. Markdown-rendered so inline emphasis and links work. Falls back to `.Inner` if `content` is empty. |

**Worked example:**

```go
{{< infobox-below content="See also: [related article]({{< ref "related" >}})." >}}
```

## Inline field — `{{< infobox-field >}}`

**Paired but bodyless in practice.** A bare inline field — renders the
value inside a `<span class="infobox-field">` so it can be embedded in
prose or in a custom row the named wrapper does not enumerate. Used as
an escape-hatch building block alongside `infobox-row` when you want
the inline field to share the infobox's typography without becoming a
full label/value row.

**Parameters:**

| Name | Required | Purpose |
|---|---|---|
| `value` | optional | The field value. Falls back to `.Inner`. Rendered through `safeHTML`. |

**Worked example:**

```go
{{< infobox-field value="inline text" >}}
```

## Special-case pair primitives

Some field pairs appear in so many named templates that promoting
them to their own primitive is cheaper than asking the author to
compose two `infobox-row`s. Each pair primitive emits a row tagged
`data-pair="<name>"` so the SCSS attribute-selector keys per-pair
visual tweaks off that data attribute — the same attribute-selector
pattern the named wrappers use.

The pair primitives are written as inline `.Get` calls — the author
can drop them inside a named wrapper's paired form, or use them as
the row body of an `infobox` outer.

### `{{< infobox-pair-date >}}`

Date-and-place pair used in ~20 named shortcodes — "Born/Died",
"Founded/Dissolved", "Opened/Closed", "First-aired/Last-aired",
"Established/Added".

| Parameter | Required | Purpose |
|---|---|---|
| `label` | required | Row label, e.g. `"Born"`, `"Died"`, `"Founded"`. |
| `date` | required | Date value, e.g. `"11 March 1952"`. |
| `place` | optional | Place / location, e.g. `"Cambridge, England"`. |

```go
{{< infobox-pair-date label="Born" date="11 March 1952" place="Cambridge, England" >}}
```

### `{{< infobox-pair-software-release >}}`

Version + date pair for the "Stable release" / "Latest release"
pattern on `software` and `video-game` shortcodes.

| Parameter | Required | Purpose |
|---|---|---|
| `label` | required | Row label. |
| `version` | required | Version string, e.g. `"4.2.0"`. |
| `date` | optional | Release date, e.g. `"2026-03-15"`. |
| `platform` | optional | Platform chip when the wrapper passes per-platform data. |

```go
{{< infobox-pair-software-release label="Stable release" version="0.163.3" date="2026-06-19" >}}
```

### `{{< infobox-pair-population >}}`

Census + estimate pair with year labels. Used by `settlement` and
`country`.

| Parameter | Required | Purpose |
|---|---|---|
| `label` | required | Row label, e.g. `"Population"`. |
| `census` | optional | Census figure. |
| `census_year` | optional | Census year, e.g. `"2021"`. |
| `estimate` | optional | Estimate figure. |
| `estimate_year` | optional | Estimate year, e.g. `"2026"`. |

```go
{{< infobox-pair-population label="Population" census="114,738" census_year="2020" estimate="116,500" estimate_year="2026" >}}
```

### `{{< infobox-pair-area >}}`

Total / land / water area triple with optional unit annotation. Used
by `settlement` and `country`.

| Parameter | Required | Purpose |
|---|---|---|
| `label` | required | Row label. |
| `total` | required | Total area, e.g. `"1,572 km²"`. |
| `land` | optional | Land area. |
| `water` | optional | Water area. |
| `unit` | optional | Unit annotation, e.g. `"km²"`. |

```go
{{< infobox-pair-area label="Area" total="643,801" land="640,427" water="3,374" unit="km²" >}}
```

### `{{< infobox-pair-air-date >}}`

First-aired + last-aired + network triple. Used by `television`,
`television-episode`, `television-season`.

| Parameter | Required | Purpose |
|---|---|---|
| `label` | required | Row label, e.g. `"Original run"`. |
| `first` | optional | First-aired date. |
| `last` | optional | Last-aired date. |
| `network` | optional | Broadcasting network. |

```go
{{< infobox-pair-air-date label="Original run" first="18 February 2022" last="present" network="Apple TV+" >}}
```

### `{{< infobox-pair-budget-gross >}}`

Budget + gross numeric pair with currency. Used by `film`.

| Parameter | Required | Purpose |
|---|---|---|
| `label` | required | Row label, e.g. `"Box office"`. |
| `budget` | optional | Production budget, e.g. `"200,000,000"`. |
| `gross` | optional | Worldwide gross, e.g. `"858,373,000"`. |
| `currency` | optional | Currency code, e.g. `"USD"`. |

```go
{{< infobox-pair-budget-gross label="Box office" budget="160,000,000" gross="836,836,967" currency="USD" >}}
```

### `{{< infobox-pair-episode-season >}}`

Episodes × seasons count pair. Used by `television` and
`television-episode`.

| Parameter | Required | Purpose |
|---|---|---|
| `label` | required | Row label, e.g. `"Episodes"`. |
| `episodes` | optional | Episode count. |
| `seasons` | optional | Season count. |

```go
{{< infobox-pair-episode-season label="Episodes" episodes="19" seasons="2" >}}
```

## Escape-hatch philosophy

The primitives are the long tail of "every Wikipedia infobox ever
had a bespoke one-off field". The named wrappers absorb the common
cases; the primitives absorb the cases the named wrappers can't
predict. Anything that escapes both is one paired shortcode away:
switch the named wrapper to its paired form, then compose primitives
inside `.Inner`. The author never has to fall back to raw HTML or to
a per-site CSS override to add an unusual field.

When you find yourself composing the same primitive combination
across multiple articles, that's the signal to add a new named
shortcode. See [Customizing and extending](customizing.md) for the
workflow.

# `{{< award >}}`

Award / prize infobox — replicates `Template:Infobox award` from
Wikipedia (~16k transclusions).

## Parameters

The full parameter list, in declaration order. The list mirrors the
comment header at the top of `layouts/_shortcodes/award.html`, which
is the source of truth.

| Parameter | Required | Purpose |
|---|---|---|
| `name` | required | The award name (becomes the infobox header); falls back to `awardname`, then the page title. |
| `image` | optional | Award image / medal / trophy filename. |
| `caption` | optional | Caption under the image. Markdown-rendered. |
| `alt` | optional | Alt text on the image for assistive tech. |
| `awarded_for` | optional | Short description of what the award recognises, e.g. `"Excellence in cinematic achievements"`. |
| `type` | optional | Award category or class, e.g. `"Annual"`, `"Lifetime"`, `"Honorary"`. |
| `presenter` | optional | Organisation or individual that confers the award. |
| `country` | optional | Country where the award is presented. |
| `host` | optional | Ceremonial host; falls back to `hosts` (plural). |
| `location` | optional | Venue / city of the ceremony. |
| `year` | optional | Year of the first award, used as a `firstawarded` fallback. |
| `established` | optional | Year the award was established. |
| `first_awarded` | optional | Year of the first award; falls back to `firstawarded` then `year`. |
| `last_awarded` | optional | Year of the final award. |
| `status` | optional | Current status, e.g. `"Active"`, `"Discontinued"`. |
| `total` | optional | Total number of times the award has been given. |
| `total_recipients` | optional | Total distinct recipients. |
| `categories` | optional | Comma-separated list of award categories. |
| `network` | optional | TV network that broadcasts the ceremony. |
| `viewership` | optional | Average or peak viewership figure. |
| `website` | optional | Official website URL. |
| `related` | optional | Related awards (free text). |
| `higher` | optional | Next-higher award in a hierarchy. |
| `lower` | optional | Next-lower award in a hierarchy. |
| `below` | optional | Freeform footer block (footnotes, see-also links). |

## Worked example

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

## See also

- Upstream template: <https://en.wikipedia.org/wiki/Template:Infobox_award>
- Demo article: [`exampleSite/content/articles/award-demo.md`](../../../exampleSite/content/articles/award-demo.md)

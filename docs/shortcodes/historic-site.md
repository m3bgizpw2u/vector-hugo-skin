# `{{< historic-site >}}`

Historic site infobox (canonical alias `nrhp`) — replicates
`Template:Infobox NRHP` from Wikipedia (~74k transclusions).

## Parameters

The full parameter list, in declaration order. The list mirrors the
comment header at the top of `layouts/_shortcodes/historic-site.html`,
which is the source of truth.

| Parameter | Required | Purpose |
|---|---|---|
| `name` | required | The site's name (becomes the infobox header); falls back to the page title. |
| `native_name` | optional | Local-language or original name, rendered as a subtitle. |
| `other_name` | optional | Alternate or former name. |
| `image` | optional | Site photo or rendering filename. |
| `caption` | optional | Caption under the image; markdown-rendered. |
| `alt` | optional | Alt text on the image for assistive tech. |
| `type` | optional | Site type, e.g. `"Building"`, `"District"`, `"Archaeological site"`. |
| `etymology` | optional | Origin of the site's name. |
| `epochs` | optional | Historical periods of use, e.g. `"Pre-Columbian"`. |
| `cultures` | optional | Associated cultures or peoples. |
| `occupants` | optional | Historical occupants or associated persons. |
| `location` | optional | Street address or locality. |
| `nearest_city` | optional | Nearest city. |
| `region` | optional | Region or county. |
| `state` | optional | State or province. |
| `country` | optional | Country, e.g. `"United States"`. |
| `coordinates` | optional | Coordinates, e.g. `"40.7484°N 73.9857°W"`. |
| `area` | optional | Site area, e.g. `"2 acres"`. |
| `built` | optional | Construction date or span, e.g. `"1930–1931"`; falls back from `year_built`. |
| `builder` | optional | Original builder. |
| `architect` | optional | Architect or design firm. |
| `architecture` | optional | Architecture description; falls back from `architecture_style` and `style`. |
| `style` | optional | Architectural style; rendered as "Architectural style". |
| `added` | optional | Date added to the NRHP, e.g. `"23 June 1986"`. |
| `NRHP_ref` | optional | NRHP reference number; falls back from `refnum`. |
| `refnum` | optional | Alias for `NRHP_ref`. |
| `governing_body` | optional | Governing or managing authority. |
| `owner` | optional | Current owner. |
| `website` | optional | Official site URL. |
| `below` | optional | Freeform footer block (footnotes, see-also links). |

## Worked example

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

## See also

- Upstream template: <https://en.wikipedia.org/wiki/Template:Infobox_NRHP>
- Demo article: [`exampleSite/content/articles/historic-site-demo.md`](../../../exampleSite/content/articles/historic-site-demo.md)
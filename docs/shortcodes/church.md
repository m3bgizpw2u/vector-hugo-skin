# `{{< church >}}`

Church / religious building infobox — replicates `Template:Infobox church`
from Wikipedia (~17k transclusions).

## Parameters

The full parameter list, in declaration order. The list mirrors the
comment header at the top of `layouts/_shortcodes/church.html`, which
is the source of truth.

| Parameter | Required | Purpose |
|---|---|---|
| `name` | required | The church's name (becomes the infobox header); falls back to the page title. |
| `full_name` | optional | Formal / official name of the church. |
| `other_name` | optional | Alternative or colloquial name. |
| `native_name` | optional | Name in the church's original language. |
| `image` | optional | Photograph of the church. |
| `caption` | optional | Caption under the image. Markdown-rendered. |
| `alt` | optional | Alt text on the image for assistive tech. |
| `dedication` | optional | Saint or concept to whom the church is dedicated, e.g. `"Saint Patrick"`. |
| `denomination` | optional | Denomination, e.g. `"Catholic (Roman)"`, `"Anglican"`. |
| `previous_denomination` | optional | Earlier denomination, if the church changed affiliation. |
| `sui_iuris_church` | optional | Sui iuris church for Catholic churches of an Eastern rite. |
| `tradition` | optional | Liturgical tradition, e.g. `"Western"`, `"Byzantine"`. |
| `religious_order` | optional | Religious order running the church; falls back to `religious_institute`. |
| `status` | optional | Current status, e.g. `"Active"`, `"Parish church"`, `"Co-cathedral"`. |
| `founded` | optional | Year or date of foundation. |
| `founder` | optional | Founder(s) of the church. |
| `dedicated` | optional | Date the church was dedicated. |
| `consecrated` | optional | Date the church was consecrated. |
| `location` | optional | City / locality of the church. |
| `country` | optional | Country where the church is located. |
| `address` | optional | Street address. |
| `coordinates` | optional | Decimal lat/long or `°N/°E` text, e.g. `"40.7587°N 73.9757°W"`. |
| `architectural_type` | optional | Building type, e.g. `"Basilica"`, `"Hall church"`. |
| `style` | optional | Architectural style, e.g. `"Gothic Revival"`, `"Romanesque"`. |
| `years_built` | optional | Construction span, e.g. `"1220–1280"`. |
| `groundbreaking` | optional | Groundbreaking date. |
| `completed` | optional | Date of completion. |
| `capacity` | optional | Seating capacity, e.g. `"2,400"`. |
| `length` | optional | Internal length in metres. |
| `width` | optional | Internal width in metres. |
| `height` | optional | Interior height in metres. |
| `materials` | optional | Construction materials. |
| `architect` | optional | Architect(s) of the building. |
| `parish` | optional | Parish the church belongs to. |
| `diocese` | optional | Catholic diocese. |
| `archdiocese` | optional | Catholic archdiocese (when distinct from `diocese`). |
| `province` | optional | Ecclesiastical province. |
| `bishop` | optional | Bishop(s) associated with the church. |
| `archbishop` | optional | Archbishop, when applicable. |
| `website` | optional | Official website URL. |
| `below` | optional | Freeform footer block (footnotes, see-also links). |

## Worked example

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

## See also

- Upstream template: <https://en.wikipedia.org/wiki/Template:Infobox_church>
- Demo article: [`exampleSite/content/articles/church-demo.md`](../../../exampleSite/content/articles/church-demo.md)

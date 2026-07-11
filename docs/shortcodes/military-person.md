# `{{< military-person >}}`

Military person infobox — replicates `Template:Infobox military person` from
Wikipedia (~54k transclusions).

## Parameters

The full parameter list, in declaration order. The list mirrors the comment
header at the top of `layouts/_shortcodes/military-person.html`, which is the
source of truth.

| Parameter | Required | Purpose |
|---|---|---|
| `name` | required | The person's name (becomes the infobox header). |
| `image` | optional | Portrait image filename. |
| `caption` | optional | Caption under the portrait. Markdown-rendered. |
| `alt` | optional | Alt text on the portrait for assistive tech. |
| `birth_date` | optional | Date of birth, e.g. `"11 November 1885"`. |
| `birth_place` | optional | Place of birth, e.g. `"San Gabriel, California, U.S."`. |
| `death_date` | optional | Date of death, e.g. `"21 December 1945"`. |
| `death_place` | optional | Place of death. |
| `allegiance` | optional | Country / state the person served, e.g. `"United States"`. |
| `branch` | optional | Military branch, e.g. `"United States Army"`. |
| `service_years` | optional | Year service began, e.g. `"1909"`. Pairs with `service_end`. |
| `service_end` | optional | Year service ended. Defaults to `"present"` when omitted. |
| `rank` | optional | Highest rank attained, e.g. `"General"`. |
| `unit` | optional | Unit(s) the person served in. |
| `commands` | optional | Commands held by the person. |
| `battles` | optional | Battles / wars the person participated in. Comma-separated. |
| `awards` | optional | Military or civil awards received. |
| `alma_mater` | optional | Educational institution(s) attended. |
| `spouse` | optional | Spouse(s) of the person. |
| `relations` | optional | Notable family relations. |
| `children` | optional | Children of the person. |
| `laterwork` | optional | Career after military service. |
| `website` | optional | Official or reference URL. |
| `below` | optional | Freeform footer block (footnotes, see-also links). |

## Worked example

```go
{{< military-person
    name          = "Patton"
    birth_date    = "11 November 1885"
    birth_place   = "San Gabriel, California, U.S."
    death_date    = "21 December 1945"
    allegiance    = "United States"
    branch        = "United States Army"
    service_years = "1909–1945"
    rank          = "General"
    battles       = "World War I, World War II"
>}}{{< /military-person >}}
```

## See also

- Upstream template: <https://en.wikipedia.org/wiki/Template:Infobox_military_person>
- Demo article: [`exampleSite/content/articles/military-person-demo.md`](../../../exampleSite/content/articles/military-person-demo.md)
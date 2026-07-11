# `{{< country >}}`

Country / sovereign state infobox — replicates `Template:Infobox country`
from Wikipedia (~7k transclusions of the canonical form).

## Parameters

The full parameter list, in declaration order. The list mirrors the
comment header at the top of `layouts/_shortcodes/country.html`, which
is the source of truth.

| Parameter | Required | Purpose |
|---|---|---|
| `name` | required | The country's name (becomes the infobox header); falls back to the page title. |
| `native_name` | optional | Name in the country's principal language, e.g. `"République française"`. |
| `alt_name` | optional | Conventional long-form name, e.g. `"Russian Federation"`. |
| `motto` | optional | National motto, e.g. `"Liberté, Égalité, Fraternité"`. |
| `anthem` | optional | National anthem title. |
| `image_flag` | optional | Flag image filename. |
| `image_coat` | optional | Coat of arms image filename. |
| `capital` | optional | Capital city, e.g. `"Paris"`. |
| `largest_city` | optional | Largest city by population. |
| `official_languages` | optional | Official languages, comma-separated. |
| `recognized_languages` | optional | Recognised (but not official) languages, comma-separated. |
| `regional_languages` | optional | Regionally recognised languages, comma-separated. |
| `ethnic_groups` | optional | Ethnic groups and percentages. |
| `religion` | optional | Religion(s) and percentages. |
| `demonym` | optional | Name for residents, e.g. `"French"`. |
| `government` | optional | Government type, e.g. `"Unitary semi-presidential republic"`. |
| `leader_title1` | optional | Title of the head of state, e.g. `"President"`. |
| `leader_name1` | optional | Name of the head of state. |
| `sovereignty_type` | optional | Type of sovereignty, e.g. `"Independence"`. |
| `established_event1` | optional | First sovereignty-establishing event (label). |
| `established_date1` | optional | Date of `established_event1`. |
| `area_km2` | optional | Total area in square kilometres. |
| `area_rank` | optional | World rank by area. |
| `percent_water` | optional | Percentage of the area that is water. |
| `population_estimate` | optional | Population estimate. |
| `population_estimate_rank` | optional | World rank by population estimate. |
| `population_census` | optional | Most recent census population. |
| `population_density_km2` | optional | Population density, people per km². |
| `GDP_PPP` | optional | GDP at purchasing-power parity (amount). |
| `GDP_PPP_year` | optional | Reference year for `GDP_PPP`. |
| `GDP_nominal` | optional | GDP nominal (amount). |
| `GDP_nominal_rank` | optional | World rank by nominal GDP. |
| `Gini` | optional | Gini coefficient, e.g. `"32.4"`. |
| `HDI` | optional | Human Development Index, e.g. `"0.910"`. |
| `currency` | optional | Currency, e.g. `"Euro (€) (EUR)"`. |
| `timezone` | optional | Time zone(s), e.g. `"UTC+1 (CET)"`. |
| `drives_on` | optional | Side of the road traffic drives on, `"Right"` or `"Left"`. |
| `calling_code` | optional | International calling code, e.g. `"+33"`. |
| `patron_saint` | optional | National patron saint. |
| `website` | optional | Official government website URL. |
| `below` | optional | Freeform footer block (footnotes, see-also links). |

## Worked example

```go
{{< country
    name               = "France"
    native_name        = "République française"
    motto              = "Liberté, Égalité, Fraternité"
    capital            = "Paris"
    official_languages = "French"
    demonym            = "French"
    government         = "Unitary semi-presidential republic"
    leader_title1      = "President"
    leader_name1       = "Emmanuel Macron"
    area_km2           = "643,801"
    population_estimate = "68,070,000"
    currency           = "Euro (€) (EUR)"
>}}{{< /country >}}
```

## See also

- Upstream template: <https://en.wikipedia.org/wiki/Template:Infobox_country>
- Demo article: [`exampleSite/content/articles/country-demo.md`](../../../exampleSite/content/articles/country-demo.md)

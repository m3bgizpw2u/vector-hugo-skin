# `{{< settlement >}}`

Settlement / city / town / village infobox — replicates
`Template:Infobox settlement` from Wikipedia.

## Parameters

The full parameter list, in declaration order. The list mirrors the
comment header at the top of `layouts/_shortcodes/settlement.html`,
which is the source of truth.

| Parameter | Required | Purpose |
|---|---|---|
| `name` | required | The settlement name (becomes the infobox header). Falls back to `official_name`, then to `.Page.Title`. |
| `image` | optional | Photo filename. |
| `caption` | optional | Caption under the image. Markdown-rendered. |
| `alt` | optional | Alt text on the image for assistive tech. |
| `country` | optional | Country name, e.g. `"United States"`. |
| `subdivision_type1` | optional | Subdivision type label (defaults to `"Region"`), e.g. `"State"`. |
| `subdivision_name1` | optional | Subdivision value, e.g. `"Illinois"`. |
| `pushpin_map` | optional | Map identifier — accepted but no interactive map is rendered (per SHORTCODES.md §8). |
| `coordinates` | optional | Latitude/longitude as text, e.g. `"39.7817°N 89.6501°W"`. |
| `population_total` | optional | Population count, e.g. `"114,738"`. |
| `population_as_of` | optional | Year the population figure refers to; rendered in parentheses after the value. |
| `population_density_km2` | optional | Population density per km²; rendered only when both `population_total` and an area are supplied. |
| `area_total_km2` | optional | Total area in km²; composes into the "Area" row. |
| `area_footnotes` | optional | Footnote / source text for the area figure. |
| `area_land_km2` | optional | Land area in km²; composes into the "Area" row as `"... (land)"`. |
| `area_water_km2` | optional | Water area in km²; composes into the "Area" row as `"... (water)"`. |
| `elevation_m` | optional | Elevation in metres, e.g. `"182"`. |
| `established_title1` | optional | First establishment label (defaults to `"Established"`), e.g. `"Incorporated"`. |
| `established_date1` | optional | First establishment date, e.g. `"30 April 1847"`. |
| `established_title2` | optional | Second establishment label, e.g. `"Incorporated as a city"`. |
| `established_date2` | optional | Second establishment date. |
| `leader_title` | optional | Leader role label (defaults to `"Leader"`), e.g. `"Mayor"`. |
| `leader_name` | optional | Leader name, e.g. `"Misty Vela"`. |
| `timezone1_utc_offset` | optional | UTC offset for the timezone, e.g. `"UTC−06:00"`. |
| `utc_offset1` | optional | Alternate UTC offset parameter; accepted as the offset value. |
| `timezone1` | optional | Timezone name, e.g. `"Central (CST)"`. |
| `postal_code` | optional | Postal code / ZIP. |
| `area_code` | optional | Telephone area code(s). |
| `blank_name` | optional | Blank-name row label, e.g. `"FIPS"`. |
| `blank_info` | optional | Value paired with `blank_name`. |
| `website` | optional | Official website URL. |
| `below` | optional | Freeform footer block (footnotes, see-also links). |

## Worked example

```go
{{< settlement
    name        = "Springfield"
    image       = "springfield.jpg"
    caption     = "Downtown Springfield"
    country     = "United States"
    coordinates = "39.7817°N 89.6501°W"
    population_total = "114,738"
    area_total_km2  = "171.2"
    leader_title    = "Mayor"
    leader_name     = "Misty Vela"
>}}{{< /settlement >}}
```

## See also

- Upstream template: <https://en.wikipedia.org/wiki/Template:Infobox_settlement>
- Demo article: [`exampleSite/content/articles/settlement-demo.md`](../../../exampleSite/content/articles/settlement-demo.md)
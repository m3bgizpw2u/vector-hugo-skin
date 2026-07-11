# `{{< station >}}`

Transit / railway station infobox — replicates `Template:Infobox station`
from Wikipedia (~57k transclusions).

## Parameters

The full parameter list, in declaration order. The list mirrors the
comment header at the top of `layouts/_shortcodes/station.html`, which
is the source of truth.

| Parameter | Required | Purpose |
|---|---|---|
| `name` | required | The station's name (becomes the infobox header). |
| `native_name` | optional | Native-language name, rendered as a subtitle. |
| `image` | optional | Photo filename. |
| `caption` | optional | Caption under the image. Markdown-rendered. |
| `alt` | optional | Alt text on the image for assistive tech. |
| `address` | optional | Street address. |
| `borough` | optional | Borough / district. |
| `country` | optional | Country. |
| `coordinates` | optional | Latitude/longitude as text, e.g. `"51.5031°N 0.1132°W"`. |
| `grid_position` | optional | Grid reference, e.g. UK OS grid. |
| `elevation` | optional | Elevation above sea level. |
| `type` | optional | Station type — used first when supplied. |
| `system` | optional | Transit system — fallback for `type`. |
| `owner` | optional | Owner — falls back to `owned`. |
| `owned` | optional | Owner alternate parameter. |
| `operator` | optional | Operating company. |
| `manager` | optional | Managing entity. |
| `transit_authority` | optional | Transit authority overseeing the station. |
| `line` | optional | Single line — fallback for `lines`. |
| `lines` | optional | Lines served (plural). |
| `distance` | optional | Distance from a reference point. |
| `platforms` | optional | Platform count — used first when supplied. |
| `platform` | optional | Single platform — fallback for `platforms`. |
| `tracks` | optional | Track count. |
| `train_operators` | optional | Train operators serving the station. |
| `connections` | optional | Connecting services — falls back to `other`. |
| `structure` | optional | Structural type, e.g. `"At-grade"`, `"Underground"`. |
| `depth` | optional | Depth below ground, e.g. for underground stations. |
| `levels` | optional | Number of platform levels. |
| `parking` | optional | Parking availability note. |
| `bicycle` | optional | Bicycle facilities — falls back to `cyclepark`. |
| `opened` | optional | Opening date, e.g. `"11 July 1848"`. |
| `closed` | optional | Closure date. |
| `rebuilt` | optional | Rebuild / refurbishment date or event. |
| `electrified` | optional | Electrification status. |
| `ADA` | optional | Accessibility note, e.g. `"Yes"`, `"No"`. |
| `code` | optional | Station code — falls back to `station_code`. |
| `passengers` | optional | Annual passenger count. |
| `pass_year` | optional | Year the `passengers` figure refers to. |
| `pass_rank` | optional | Rank by passenger count, e.g. `"1 of 100"`. |
| `services` | optional | Services — falls back to `other_services`. |
| `zone` | optional | Fare zone. |
| `former` | optional | Former name(s). |
| `website` | optional | Official website URL. |
| `below` | optional | Freeform footer block (footnotes, see-also links). |

## Worked example

```go
{{< station
    name        = "Waterloo"
    native_name = "London Waterloo"
    country     = "United Kingdom"
    coordinates = "51.5031°N 0.1132°W"
    line        = "South Western main line"
    platforms   = "22"
    tracks      = "24"
    opened      = "11 July 1848"
    code        = "WAT"
    operator    = "Network Rail"
>}}{{< /station >}}
```

## See also

- Upstream template: <https://en.wikipedia.org/wiki/Template:Infobox_station>
- Demo article: [`exampleSite/content/articles/station-demo.md`](../../../exampleSite/content/articles/station-demo.md)
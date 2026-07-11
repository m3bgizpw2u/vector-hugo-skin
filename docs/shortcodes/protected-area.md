# `{{< protected-area >}}`

Protected area / national park infobox — replicates `Template:Infobox protected area`
from Wikipedia (~15k transclusions).

## Parameters

The full parameter list, in declaration order. The list mirrors the
comment header at the top of `layouts/_shortcodes/protected-area.html`,
which is the source of truth.

| Parameter | Required | Purpose |
|---|---|---|
| `name` | required | The protected area's title (becomes the infobox header). |
| `alt_name` | optional | Alternate or indigenous name, rendered as a subtitle. |
| `logo` | optional | Logo image filename (e.g. park service logo). |
| `image` | optional | Photo filename. |
| `caption` | optional | Caption under the image. Markdown-rendered. |
| `alt` | optional | Alt text on the image for assistive tech. |
| `location` | optional | Geographic location, e.g. `"Wyoming, Montana, Idaho"`. |
| `nearest_city` | optional | Nearest city — when present, label reads "Nearest city". |
| `nearest_town` | optional | Nearest town, fallback for `nearest_city` — label reads "Nearest town". |
| `coordinates` | optional | Latitude/longitude as text, e.g. `"44.4280°N 110.5885°W"`. |
| `area` | optional | Freeform area value, e.g. `"2,219,791 acres (8,987 km²)"`. |
| `area_km2` | optional | Area in km²; fallback for `area`. |
| `area_sqmi` | optional | Area in square miles; further fallback for `area`. |
| `area_acre` | optional | Area in acres; further fallback for `area`. |
| `area_ha` | optional | Area in hectares; further fallback for `area`. |
| `length` | optional | Length dimension, e.g. `"120 km"`. |
| `width` | optional | Width dimension, e.g. `"80 km"`. |
| `elevation` | optional | Elevation figure, e.g. `"2,400 m"`. |
| `elevation_avg` | optional | Average elevation — when present, label reads "Average elevation". |
| `elevation_max` | optional | Maximum elevation. |
| `elevation_min` | optional | Minimum elevation. |
| `dimensions` | optional | Freeform dimensions string. |
| `designation` | optional | Designation type, e.g. `"National park"`. |
| `authorized` | optional | Authorisation date / event. |
| `created` | optional | Creation date. |
| `established` | optional | Establishment date. |
| `designated` | optional | Designation date. |
| `iucn_category` | optional | IUCN management category, e.g. `"II (national park)"`. |
| `named_for` | optional | Person or feature the area is named after. |
| `visitation_num` | optional | Annual visitor count. |
| `visitation_year` | optional | Year the `visitation_num` figure refers to. |
| `governing_body` | optional | Authority that manages the area, e.g. `"U.S. National Park Service"`. |
| `administrator` | optional | Specific administrator. |
| `owner` | optional | Owner entity. |
| `world_heritage_site` | optional | World Heritage Site designation, e.g. `"Yes — since 1978"`. |
| `website` | optional | Official website URL. |
| `below` | optional | Freeform footer block (footnotes, see-also links). |

## Worked example

```go
{{< protected-area
    name        = "Yellowstone National Park"
    location    = "Wyoming, Montana, Idaho"
    coordinates = "44.4280°N 110.5885°W"
    area        = "2,219,791 acres (8,987 km²)"
    established = "1 March 1872"
    governing_body = "U.S. National Park Service"
    iucn_category = "II (national park)"
>}}{{< /protected-area >}}
```

## See also

- Upstream template: <https://en.wikipedia.org/wiki/Template:Infobox_protected_area>
- Demo article: [`exampleSite/content/articles/protected-area-demo.md`](../../../exampleSite/content/articles/protected-area-demo.md)
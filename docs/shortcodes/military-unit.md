# `{{< military-unit >}}`

Military unit infobox — replicates `Template:Infobox military unit` from
Wikipedia (~29k transclusions).

## Parameters

The full parameter list, in declaration order. The list mirrors the comment
header at the top of `layouts/_shortcodes/military-unit.html`, which is the
source of truth.

| Parameter | Required | Purpose |
|---|---|---|
| `name` | required | The unit's name (becomes the infobox header). |
| `unit_name` | optional | Alias for `name`; falls back first in the title resolution. |
| `native_name` | optional | Unit name in the unit's native language, rendered as a subtitle. |
| `image` | optional | Unit insignia / formation image filename. |
| `caption` | optional | Caption under the image. Markdown-rendered. |
| `alt` | optional | Alt text on the image for assistive tech. |
| `start_date` | optional | Date the unit was founded / activated, e.g. `"15 August 1942"`. |
| `end_date` | optional | Date the unit was disbanded, if applicable. |
| `dates` | optional | Legacy single-string date range used when `start_date`/`end_date` are absent. |
| `disbanded` | optional | Disbandment date, rendered as a "Disbanded" row. |
| `country` | optional | Country the unit belongs to, e.g. `"United States"`. |
| `countries` | optional | Plural form of `country`; switches the row label to "Countries". |
| `allegiance` | optional | State / organisation the unit owes allegiance to. |
| `branch` | optional | Military branch, e.g. `"United States Army"`. |
| `type` | optional | Unit type, e.g. `"Airborne infantry"`. |
| `role` | optional | Operational role, e.g. `"Air assault"`. |
| `specialization` | optional | Alias for `role`. |
| `size` | optional | Unit size / strength. |
| `command_structure` | optional | Higher-echelon formation this unit belongs to. |
| `garrison` | optional | Home garrison or HQ location. |
| `garrison_label` | optional | Custom label for the garrison row (defaults to `"Garrison/HQ"`). |
| `nickname` | optional | Informal unit nickname, e.g. `"Screaming Eagles"`. |
| `patron` | optional | Patron of the unit. |
| `motto` | optional | Unit motto, e.g. `"Rendezvous with Destiny"`. |
| `colors` | optional | American-English spelling of the unit's colours. |
| `colours` | optional | British-English spelling; takes precedence when supplied. |
| `colors_label` | optional | Custom label for the colour row. |
| `colours_label` | optional | Custom label for the colour row (British spelling). |
| `march` | optional | Unit's official march. |
| `mascot` | optional | Unit mascot. |
| `anniversaries` | optional | Anniversary dates commemorated by the unit. |
| `equipment` | optional | Notable equipment fielded by the unit. |
| `equipment_label` | optional | Custom label for the equipment row (defaults to `"Equipment"`). |
| `battles` | optional | Battles / engagements the unit participated in. |
| `battles_label` | optional | Custom label for the battles row (defaults to `"Engagements"`). |
| `decorations` | optional | Unit citations and decorations. |
| `battle_honours` | optional | Battle honours awarded to the unit. |
| `battle_honours_label` | optional | Custom label for the battle honours row. |
| `commander` | optional | Current commanding officer. |
| `notable_commanders` | optional | Historically notable commanders. |
| `identification_symbol` | optional | Unit insignia or identification symbol description. |
| `website` | optional | Official or reference URL. |
| `below` | optional | Freeform footer block (footnotes, see-also links). |

## Worked example

```go
{{< military-unit
    name        = "101st Airborne Division"
    start_date  = "15 August 1942"
    country     = "United States"
    branch      = "United States Army"
    type        = "Airborne infantry"
    role        = "Air assault"
    garrison    = "Fort Campbell, Kentucky"
    nickname    = "Screaming Eagles"
    motto       = "Rendezvous with Destiny"
    commander   = "Major General Andrew C. Hilmes"
>}}{{< /military-unit >}}
```

## See also

- Upstream template: <https://en.wikipedia.org/wiki/Template:Infobox_military_unit>
- Demo article: [`exampleSite/content/articles/military-unit-demo.md`](../../../exampleSite/content/articles/military-unit-demo.md)
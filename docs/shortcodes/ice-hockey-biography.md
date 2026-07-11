# `{{< ice-hockey-biography >}}`

Ice hockey player biography infobox — replicates
`Template:Infobox ice hockey biography` from Wikipedia (~21k transclusions).

## Parameters

The full parameter list, in declaration order. The list mirrors the
comment header at the top of `layouts/_shortcodes/ice-hockey-biography.html`,
which is the source of truth.

| Parameter | Required | Purpose |
|---|---|---|
| `name` | required | The player's name (becomes the infobox header). |
| `image` | optional | Portrait or action photo filename. |
| `caption` | optional | Caption under the image; markdown-rendered. |
| `alt` | optional | Alt text on the image for assistive tech. |
| `birth_date` | optional | Date of birth, e.g. `"13 January 1997"`. |
| `birth_place` | optional | Place of birth, e.g. `"Richmond Hill, Ontario, Canada"`. |
| `death_date` | optional | Date of death, where applicable. |
| `death_place` | optional | Place of death, where applicable. |
| `nationality` | optional | Player nationality, e.g. `"Canadian"`. |
| `height` | optional | Height in centimetres, e.g. `"188"`; falls back from `height_ft`/`height_in`. |
| `height_ft` | optional | Legacy height in feet, used when `height` is absent. |
| `height_in` | optional | Legacy height in inches, used when `height` is absent. |
| `weight` | optional | Weight in pounds, e.g. `"88"`; rendered with a `" lb"` suffix. |
| `position` | optional | Playing position(s); label pluralises when comma-separated. |
| `shoots` | optional | Shooting side, e.g. `"Left"`. |
| `catches` | optional | Catching side for goalies, e.g. `"Left"`. |
| `played_for` | optional | Club(s) played for. |
| `national_team` | optional | Senior national team. |
| `draft_year` | optional | NHL draft year, e.g. `"2015"`. |
| `draft_team` | optional | Team that drafted the player. |
| `draft_round` | optional | Round of the draft, e.g. `"1"`. |
| `draft_pick` | optional | Pick number within the round, e.g. `"1"`. |
| `career_start` | optional | First professional season year. |
| `career_end` | optional | Final professional season year. |
| `career_position` | optional | Position at career end, where it changed. |
| `hall_of_fame` | optional | Hall-of-Fame induction details. |
| `website` | optional | Official player website URL. |
| `below` | optional | Freeform footer block (footnotes, see-also links). |

## Worked example

```go
{{< ice-hockey-biography
    name        = "Connor McDavid"
    birth_date  = "13 January 1997"
    birth_place = "Richmond Hill, Ontario, Canada"
    height      = "188"
    weight      = "88"
    position    = "Center"
    shoots      = "Left"
    played_for  = "Erie Otters, Edmonton Oilers"
    national_team = "Canada"
    draft_year  = "2015"
    draft_team  = "Edmonton Oilers"
>}}{{< /ice-hockey-biography >}}
```

## See also

- Upstream template: <https://en.wikipedia.org/wiki/Template:Infobox_ice_hockey_biography>
- Demo article: [`exampleSite/content/articles/ice-hockey-biography-demo.md`](../../../exampleSite/content/articles/ice-hockey-biography-demo.md)
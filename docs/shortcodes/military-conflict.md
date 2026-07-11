# `{{< military-conflict >}}`

Military conflict / battle / war infobox — replicates
`Template:Infobox military conflict` from Wikipedia (~28k transclusions).

## Parameters

The full parameter list, in declaration order. The list mirrors the comment
header at the top of `layouts/_shortcodes/military-conflict.html`, which is
the source of truth.

| Parameter | Required | Purpose |
|---|---|---|
| `name` | required | The conflict title (becomes the infobox header). |
| `conflict` | optional | Legacy alias for `name`. |
| `part_of` | optional | The parent conflict this engagement belongs to, e.g. `"American Civil War"`. |
| `image` | optional | Image filename for the conflict. |
| `caption` | optional | Caption under the image. Markdown-rendered. |
| `alt` | optional | Alt text on the image for assistive tech. |
| `date` | optional | Legacy single-string date, e.g. `"July 1863"`. Used when `date_start`/`date_end` are absent. |
| `date_start` | optional | Conflict start date, e.g. `"1 July 1863"`. |
| `date_end` | optional | Conflict end date, e.g. `"3 July 1863"`. |
| `place` | optional | Conflict location, e.g. `"Gettysburg, Pennsylvania, United States"`. |
| `location` | optional | Alias for `place`. |
| `coordinates` | optional | Geo coordinates, e.g. `"39.8095°N 77.2356°W"`. |
| `territory` | optional | Territory contested or changed by the conflict. |
| `result` | optional | Outcome of the conflict, e.g. `"Union victory"`. |
| `status` | optional | Alias used when `result` is absent. |
| `combatant1` | optional | First combatant side. |
| `combatant2` | optional | Second combatant side. |
| `combatant3` | optional | Third combatant side (additional belligerent). |
| `commander1` | optional | Commanding officer(s) of combatant 1. |
| `commander2` | optional | Commanding officer(s) of combatant 2. |
| `commander3` | optional | Commanding officer(s) of combatant 3. |
| `strength1` | optional | Troop count for combatant 1. |
| `strength2` | optional | Troop count for combatant 2. |
| `casualties1` | optional | Casualties suffered by combatant 1. |
| `casualties2` | optional | Casualties suffered by combatant 2. |
| `civilian_deaths` | optional | Civilian casualty count. |
| `military_deaths` | optional | Military casualty count. |
| `total_deaths` | optional | Combined casualty count. |
| `notes` | optional | Freeform notes rendered as a Markdown row. |
| `website` | optional | Official or reference URL. |
| `below` | optional | Freeform footer block (footnotes, see-also links). |

## Worked example

```go
{{< military-conflict
    name        = "Battle of Gettysburg"
    part_of     = "American Civil War"
    date_start  = "1 July 1863"
    date_end    = "3 July 1863"
    place       = "Gettysburg, Pennsylvania, United States"
    result      = "Union victory"
    combatant1  = "United States (Union)"
    combatant2  = "Confederate States"
>}}{{< /military-conflict >}}
```

## See also

- Upstream template: <https://en.wikipedia.org/wiki/Template:Infobox_military_conflict>
- Demo article: [`exampleSite/content/articles/military-conflict-demo.md`](../../../exampleSite/content/articles/military-conflict-demo.md)
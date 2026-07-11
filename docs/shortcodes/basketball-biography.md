# `{{< basketball-biography >}}`

Basketball player biography infobox — replicates
`Template:Infobox basketball biography` from Wikipedia (~23k transclusions).

## Parameters

The full parameter list, in declaration order. The list mirrors the
comment header at the top of `layouts/_shortcodes/basketball-biography.html`,
which is the source of truth.

| Parameter | Required | Purpose |
|---|---|---|
| `name` | required | The player's name (becomes the infobox header). |
| `image` | optional | Player photograph filename. |
| `caption` | optional | Caption under the photo. Markdown-rendered. |
| `alt` | optional | Alt text on the photo for assistive tech. |
| `birth_date` | optional | Date of birth, e.g. `"7 July 1972"`. |
| `birth_place` | optional | City and country of birth. |
| `death_date` | optional | Date of death, e.g. `"12 January 2016"`. |
| `death_place` | optional | City and country of death. |
| `nationality` | optional | Player's nationality, e.g. `"American"`. |
| `height` | optional | Height in metres, e.g. `"1.96"`. |
| `weight` | optional | Weight in pounds, e.g. `"170"`. |
| `position` | optional | Position(s) played, e.g. `"Center"`, `"Guard, forward"`. |
| `jersey_number` | optional | Jersey / squad number. |
| `high_school` | optional | High school attended. |
| `college` | optional | College / university attended. |
| `draft_year` | optional | Year of the WNBA / NBA draft, e.g. `"1997"`. |
| `draft_round` | optional | Round in which the player was drafted. |
| `draft_pick` | optional | Overall pick number. |
| `draft_team` | optional | Team that drafted the player. |
| `career_start` | optional | Year professional career began. |
| `career_end` | optional | Year professional career ended. |
| `coach` | optional | Coaching career note. |
| `hall_of_fame` | optional | Hall of Fame induction note. |
| `highlights` | optional | Career highlights and awards (free text / markdown). |
| `stats` | optional | Career statistics summary. |
| `below` | optional | Freeform footer block (footnotes, see-also links). |

## Worked example

```go
{{< basketball-biography
    name        = "Lisa Leslie"
    birth_date  = "7 July 1972"
    birth_place = "Gardena, California, U.S."
    nationality = "American"
    height      = "1.96"
    position    = "Center"
    college     = "USC"
    draft_year  = "1997"
    draft_pick  = "7"
    draft_team  = "Los Angeles Sparks"
>}}{{< /basketball-biography >}}
```

## See also

- Upstream template: <https://en.wikipedia.org/wiki/Template:Infobox_basketball_biography>
- Demo article: [`exampleSite/content/articles/basketball-biography-demo.md`](../../../exampleSite/content/articles/basketball-biography-demo.md)

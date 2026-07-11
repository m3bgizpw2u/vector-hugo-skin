# `{{< baseball-biography >}}`

Baseball player biography infobox — replicates
`Template:Infobox baseball biography` from Wikipedia (~30k transclusions).

## Parameters

The full parameter list, in declaration order. The list mirrors the
comment header at the top of `layouts/_shortcodes/baseball-biography.html`,
which is the source of truth.

| Parameter | Required | Purpose |
|---|---|---|
| `name` | required | The player's name (becomes the infobox header). |
| `image` | optional | Player photograph filename. |
| `caption` | optional | Caption under the photo. Markdown-rendered. |
| `alt` | optional | Alt text on the photo for assistive tech. |
| `birth_date` | optional | Date of birth, e.g. `"6 February 1895"`. |
| `birth_place` | optional | City and country of birth. |
| `death_date` | optional | Date of death, e.g. `"16 August 1948"`. |
| `death_place` | optional | City and country of death. |
| `bats` | optional | Batting side, e.g. `"Left"`, `"Right"`, `"Switch"`. |
| `throws` | optional | Throwing hand, e.g. `"Left"`, `"Right"`. |
| `debut` | optional | MLB debut date, e.g. `"11 July 1914"`. |
| `final_game` | optional | Date of the player's final MLB game. |
| `position` | optional | Position(s) played, e.g. `"Outfielder"`, `"Outfielder, pitcher"`. |
| `team` | optional | Current team; falls back to `teams` if absent. |
| `teams` | optional | All teams the player appeared for; comma-separated. |
| `stat1label` | optional | Label for the first custom stat row, e.g. `"Batting average"`. |
| `stat1value` | optional | Value for `stat1label`, e.g. `".342"`. |
| `stat2label` | optional | Label for the second custom stat row. |
| `stat2value` | optional | Value for `stat2label`. |
| `stat3label` | optional | Label for the third custom stat row. |
| `stat3value` | optional | Value for `stat3label`. |
| `hall_of_fame` | optional | Hall of Fame induction note, e.g. `"Inducted 1936"`. |
| `highlights` | optional | Career highlights and awards (free text / markdown). |
| `awards` | optional | Awards the player has won. |
| `below` | optional | Freeform footer block (footnotes, see-also links). |

## Worked example

```go
{{< baseball-biography
    name      = "Babe Ruth"
    birth_date = "6 February 1895"
    birth_place = "Baltimore, Maryland, U.S."
    bats      = "Left"
    throws    = "Left"
    debut     = "11 July 1914"
    final_game = "30 May 1935"
    position  = "Outfielder, pitcher"
    teams     = "Boston Red Sox, New York Yankees"
    hall_of_fame = "Inducted 1936"
>}}{{< /baseball-biography >}}
```

## See also

- Upstream template: <https://en.wikipedia.org/wiki/Template:Infobox_baseball_biography>
- Demo article: [`exampleSite/content/articles/baseball-biography-demo.md`](../../../exampleSite/content/articles/baseball-biography-demo.md)

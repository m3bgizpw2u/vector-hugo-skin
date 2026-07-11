# `{{< football-biography >}}`

Football (soccer) player biography infobox — replicates
`Template:Infobox football biography` from Wikipedia (~218k transclusions).

## Parameters

The full parameter list, in declaration order. The list mirrors the
comment header at the top of `layouts/_shortcodes/football-biography.html`,
which is the source of truth.

| Parameter | Required | Purpose |
|---|---|---|
| `name` | required | The player's common name (becomes the infobox header). |
| `full_name` | optional | The player's full legal name. |
| `image` | optional | Portrait or action photo filename. |
| `caption` | optional | Caption under the image; markdown-rendered. |
| `alt` | optional | Alt text on the image for assistive tech. |
| `birth_date` | optional | Date of birth, e.g. `"19 February 1986"`. |
| `birth_place` | optional | Place of birth, e.g. `"Dois Riachos, Alagoas, Brazil"`. |
| `death_date` | optional | Date of death, where applicable. |
| `death_place` | optional | Place of death, where applicable. |
| `height` | optional | Height in metres, e.g. `"1.63"`. |
| `position` | optional | Playing position(s); label pluralises when comma-separated. |
| `current_club` | optional | Current club, or `"n/a"` / `"retired"` / `"free agent"` for no club. |
| `clubnumber` | optional | Squad number; suppressed when the current club is a free-agent value. |
| `youthyears` | optional | Years in youth academy. |
| `youthclubs` | optional | Youth-academy club(s). |
| `years` | optional | Senior career years. |
| `clubs` | optional | Senior-career club list. |
| `nationalyears` | optional | Years of national-team service. |
| `nationalteam` | optional | Senior national team. |
| `nationalcaps` | optional | Senior cap count. |
| `nationalgoals` | optional | Senior goal count. |
| `pcupdate` | optional | Last update date for club career, e.g. `"2026-01-15"`. |
| `ntupdate` | optional | Last update date for national-team career. |
| `below` | optional | Freeform footer block (footnotes, see-also links). |

## Worked example

```go
{{< football-biography
    name        = "Marta"
    full_name   = "Marta Vieira da Silva"
    birth_date  = "19 February 1986"
    birth_place = "Dois Riachos, Alagoas, Brazil"
    height      = "1.63"
    position    = "Forward"
    clubs       = "Vasco da Gama, Umeå, Orlando Pride"
    nationalcaps = "179"
    nationalgoals = "115"
>}}{{< /football-biography >}}
```

## See also

- Upstream template: <https://en.wikipedia.org/wiki/Template:Infobox_football_biography>
- Demo article: [`exampleSite/content/articles/football-biography-demo.md`](../../../exampleSite/content/articles/football-biography-demo.md)
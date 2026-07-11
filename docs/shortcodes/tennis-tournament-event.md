# `{{< tennis-tournament-event >}}`

Tennis tournament event infobox — replicates
`Template:Infobox tennis tournament event` from Wikipedia (~22k transclusions).

## Parameters

The full parameter list, in declaration order. The list mirrors the
comment header at the top of `layouts/_shortcodes/tennis-tournament-event.html`,
which is the source of truth.

| Parameter | Required | Purpose |
|---|---|---|
| `name` | required | Event title, e.g. `"2024 Wimbledon Championships – Men's singles"` (becomes the infobox header). |
| `event` | optional | Short event name (used as title fallback). |
| `tournament` | optional | Parent tournament name, e.g. `"Wimbledon Championships"`. |
| `tour` | optional | Tour tier, e.g. `"Grand Slam"`, `"ATP 1000"`. |
| `type` | optional | Event type, e.g. `"Singles"`, `"Doubles"`. |
| `category` | optional | Draw category, e.g. `"Grand Slam"`, `"WTA 1000"`. |
| `draw` | optional | Draw size, e.g. `"128S / 64Q"`. |
| `surface` | optional | Playing surface, e.g. `"Grass"`, `"Clay"`, `"Hard"`. |
| `location` | optional | City / region, e.g. `"Wimbledon, London"`. |
| `place` | optional | Specific place within the location. |
| `venue` | optional | Venue name, e.g. `"All England Lawn Tennis and Croquet Club"`. |
| `coordinates` | optional | Latitude / longitude, e.g. `"51.4340°N 0.2140°W"`. |
| `date` | optional | Single-date event, e.g. `"14 July 2024"`. |
| `start_date` | optional | First day of the event (paired with `end_date`). |
| `end_date` | optional | Last day of the event (paired with `start_date`). |
| `edition` | optional | Edition number, e.g. `"137th"`. |
| `champ_name` | optional | Champion name(s). Comma-separated for doubles. |
| `runner_name` | optional | Runner(s)-up name(s). |
| `score` | optional | Final score, e.g. `"6–2, 6–2, 6–7(4–7), 6–2"`. Falls back to `final_score`. |
| `prize_money` | optional | Prize money total, e.g. `"£50,000,000"`. |
| `attendance` | optional | Total attendance. |
| `seeds` | optional | Number of seeded players. |
| `players` | optional | Number of players. |
| `main_draw` | optional | Main-draw size, e.g. `"128"`. |
| `website` | optional | Official event URL. |
| `below` | optional | Freeform footer block (footnotes, see-also links). |

## Worked example

```go
{{< tennis-tournament-event
    name        = "2024 Wimbledon Championships – Men's singles"
    tournament  = "Wimbledon Championships"
    tour        = "Grand Slam"
    type        = "Singles"
    draw        = "128S / 64Q"
    surface     = "Grass"
    location    = "Wimbledon, London"
    venue       = "All England Lawn Tennis and Croquet Club"
    date        = "1–14 July 2024"
    edition     = "137th"
    champ_name  = "Carlos Alcaraz"
    runner_name = "Novak Djokovic"
    score       = "6–2, 6–2, 6–7(4–7), 6–2"
>}}{{< /tennis-tournament-event >}}
```

## See also

- Upstream template: <https://en.wikipedia.org/wiki/Template:Infobox_tennis_tournament_event>
- Demo article: [`exampleSite/content/articles/tennis-tournament-event-demo.md`](../../../exampleSite/content/articles/tennis-tournament-event-demo.md)

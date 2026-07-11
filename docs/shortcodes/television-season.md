# `{{< television-season >}}`

Television season infobox — replicates `Template:Infobox television season`
from Wikipedia (~11k transclusions).

## Parameters

The full parameter list, in declaration order. The list mirrors the
comment header at the top of `layouts/_shortcodes/television-season.html`,
which is the source of truth.

| Parameter | Required | Purpose |
|---|---|---|
| `name` | required | Season title (becomes the infobox header). |
| `series_name` | optional | Parent series name, e.g. `"Breaking Bad"`. |
| `season_number` | optional | Season number, e.g. `"5"`. |
| `image` | optional | Season promotional image filename. |
| `caption` | optional | Caption under the image. Markdown-rendered. |
| `alt` | optional | Alt text on the image for assistive tech. |
| `host` | optional | Host credit (for competition shows). |
| `starring` | optional | Starring cast. Comma-separated. |
| `judges` | optional | Judges panel (for competition shows). |
| `director` | optional | Series / season director. |
| `presenter` | optional | Presenter credit. |
| `narrator` | optional | Narrator credit. |
| `music` | optional | Music composer for the season. |
| `country` | optional | Country of origin, e.g. `"United States"`. |
| `network` | optional | Original network, e.g. `"AMC"`. Falls back to `channel`. |
| `channel` | optional | Channel (alternative to `network`). |
| `first_aired` | optional | First episode air date, e.g. `"15 July 2012"`. |
| `last_aired` | optional | Last episode air date, e.g. `"29 September 2013"`. |
| `num_episodes` | optional | Number of episodes. Falls back to `episode_count`. |
| `episode_list` | optional | Link to the season episode list. |
| `prev_season` | optional | Title of the previous season. |
| `next_season` | optional | Title of the next season. |
| `website` | optional | Official show URL. |
| `below` | optional | Freeform footer block (footnotes, see-also links). |

## Worked example

```go
{{< television-season
    name          = "Breaking Bad — Season 5"
    series_name   = "Breaking Bad"
    season_number = "5"
    num_episodes  = "16"
    network       = "AMC"
    first_aired   = "15 July 2012"
    last_aired    = "29 September 2013"
    prev_season   = "Season 4"
    next_season   = "—"
>}}{{< /television-season >}}
```

## See also

- Upstream template: <https://en.wikipedia.org/wiki/Template:Infobox_television_season>
- Demo article: [`exampleSite/content/articles/television-season-demo.md`](../../../exampleSite/content/articles/television-season-demo.md)

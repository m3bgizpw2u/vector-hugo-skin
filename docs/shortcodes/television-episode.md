# `{{< television-episode >}}`

Television episode infobox — replicates `Template:Infobox television episode`
from Wikipedia (~13k transclusions).

## Parameters

The full parameter list, in declaration order. The list mirrors the
comment header at the top of `layouts/_shortcodes/television-episode.html`,
which is the source of truth.

| Parameter | Required | Purpose |
|---|---|---|
| `name` | required | Episode title (becomes the infobox header). |
| `series` | optional | Parent series name, e.g. `"Breaking Bad"`. |
| `season` | optional | Season number, e.g. `"5"`. |
| `episode` | optional | Episode number within the season, e.g. `"14"`. |
| `image` | optional | Episode still filename. |
| `caption` | optional | Caption under the still. Markdown-rendered. |
| `alt` | optional | Alt text on the still for assistive tech. |
| `director` | optional | Episode director(s). Comma-separated for multiple. |
| `writer` | optional | Episode writer(s). |
| `teleplay` | optional | Teleplay credit (overrides `screenplay` when present). |
| `story` | optional | Original story credit. |
| `based_on` | optional | Source material, e.g. `"Stephen King's *The Mist*"`. |
| `narrator` | optional | Narrator credit. |
| `presenter` | optional | Presenter credit. |
| `starring` | optional | Starring cast. Comma-separated. |
| `guests` | optional | Guest stars. Falls back to `guest` if absent. |
| `music` | optional | Music composer. |
| `camera` | optional | Camera operator / setup. |
| `editor` | optional | Editor credit. |
| `producer` | optional | Producer(s). |
| `executive_producer` | optional | Executive producer(s). |
| `airdate` | optional | Original air date, e.g. `"15 September 2013"`. |
| `network` | optional | Original network, e.g. `"AMC"`. |
| `production_code` | optional | Production code, e.g. `"5B14"`. |
| `runtime` | optional | Runtime in minutes, e.g. `"47"`. |
| `channel` | optional | Channel (alternative to `network`). |
| `prev` | optional | Title of the previous episode. |
| `next` | optional | Title of the next episode. |
| `episode_list` | optional | Link to the season episode list. |
| `website` | optional | Official show URL. |
| `below` | optional | Freeform footer block (footnotes, see-also links). |

## Worked example

```go
{{< television-episode
    name        = "Ozymandias"
    series      = "Breaking Bad"
    season      = "5"
    episode     = "14"
    director    = "Rian Johnson"
    writer      = "Moira Walley-Beckett"
    airdate     = "15 September 2013"
    network     = "AMC"
    runtime     = "47"
    production_code = "5B14"
    prev        = "Gliding Over All"
    next        = "Felina"
>}}{{< /television-episode >}}
```

## See also

- Upstream template: <https://en.wikipedia.org/wiki/Template:Infobox_television_episode>
- Demo article: [`exampleSite/content/articles/television-episode-demo.md`](../../../exampleSite/content/articles/television-episode-demo.md)

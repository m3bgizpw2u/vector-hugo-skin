# `{{< television >}}`

Television show infobox — replicates `Template:Infobox television` from
Wikipedia (~64k transclusions).

## Parameters

The full parameter list, in declaration order. The list mirrors the
comment header at the top of `layouts/_shortcodes/television.html`,
which is the source of truth.

| Parameter | Required | Purpose |
|---|---|---|
| `name` | required | The show's title (becomes the infobox header). |
| `alt_name` | optional | Alternate / marketing title, e.g. `"The L Word: Generation Q"`. |
| `native_name` | optional | Native-language title, rendered as a subtitle. |
| `image` | optional | Promotional image / key art filename. |
| `caption` | optional | Caption under the image. Markdown-rendered. |
| `alt` | optional | Alt text on the image for assistive tech. |
| `genre` | optional | Genre(s), comma-separated, e.g. `"Science fiction, thriller"`. |
| `creator` | optional | Creator name(s), e.g. `"Dan Erickson"`. |
| `based_on` | optional | Source material — when present, label reads "Based on". |
| `inspired_by` | optional | Inspiration — when `based_on` empty, label reads "Inspired by". |
| `developer` | optional | Developer (for series developed from a format). |
| `showrunner` | optional | Showrunner(s). |
| `writer` | optional | Writer(s). |
| `screenplay` | optional | Screenplay credit — used first when supplied. |
| `teleplay` | optional | Teleplay credit — when present, label reads "Teleplay by". |
| `story` | optional | Story credit. |
| `director` | optional | Director(s). |
| `creative_director` | optional | Creative director(s). |
| `presenter` | optional | Presenter — used first when supplied. |
| `host` | optional | Host — fallback for `presenter`. |
| `starring` | optional | Lead cast, e.g. `"Adam Scott, Britt Lower, Patricia Arquette"`. |
| `voices` | optional | Voice cast (for animated shows). |
| `narrated` | optional | Narrator credit. |
| `music` | optional | Composer(s). |
| `country_of_origin` | optional | Country of origin, e.g. `"United States"`. |
| `original_language` | optional | Original broadcast language, e.g. `"English"`. |
| `num_seasons` | optional | Number of seasons. |
| `num_episodes` | optional | Number of episodes. |
| `executive_producer` | optional | Executive producer(s). |
| `producer` | optional | Producer(s). |
| `location` | optional | Production location. |
| `editor` | optional | Editor(s). |
| `camera` | optional | Camera setup, e.g. `"Single-camera"`. |
| `runtime` | optional | Episode runtime in minutes, e.g. `"47"`. |
| `network` | optional | Original network — used first when supplied. |
| `network_list` | optional | List of networks — fallback for `network`. |
| `first_aired` | optional | Premiere date, e.g. `"18 February 2022"`. |
| `last_aired` | optional | Final air date, e.g. `"present"` or `"16 April 2024"`. |
| `related` | optional | Related shows (spinoffs, parent series). |
| `website` | optional | Official website URL. |
| `below` | optional | Freeform footer block (footnotes, see-also links). |

## Worked example

```go
{{< television
    name             = "Severance"
    genre            = "Science fiction, thriller"
    creator          = "Dan Erickson"
    starring         = "Adam Scott, Britt Lower, Patricia Arquette"
    num_seasons      = "2"
    num_episodes     = "19"
    network          = "Apple TV+"
    first_aired      = "18 February 2022"
    last_aired       = "present"
>}}{{< /television >}}
```

## See also

- Upstream template: <https://en.wikipedia.org/wiki/Template:Infobox_television>
- Demo article: [`exampleSite/content/articles/television-demo.md`](../../../exampleSite/content/articles/television-demo.md)
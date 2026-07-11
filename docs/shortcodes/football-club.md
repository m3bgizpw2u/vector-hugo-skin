# `{{< football-club >}}`

Football (soccer) club infobox — replicates `Template:Infobox football club`
from Wikipedia (~29k transclusions).

## Parameters

The full parameter list, in declaration order. The list mirrors the
comment header at the top of `layouts/_shortcodes/football-club.html`,
which is the source of truth.

| Parameter | Required | Purpose |
|---|---|---|
| `name` | required | The club's common name (becomes the infobox header); falls back to `title` then `clubname` then the page title. |
| `full_name` | optional | The club's full legal name; falls back from `fullname`. |
| `fullname` | optional | Alias for `full_name`. |
| `nickname` | optional | Club nickname(s), e.g. `"The Red Devils"`. |
| `short_name` | optional | Short/abbreviated name; falls back from `shortname`. |
| `shortname` | optional | Alias for `short_name`. |
| `founded` | optional | Year or date the club was founded, e.g. `"1878"`. |
| `dissolved` | optional | Year or date the club was dissolved, where applicable. |
| `ground` | optional | Home ground; used when `stadium` is absent. |
| `stadium` | optional | Home stadium; label is "Stadium" when supplied, else "Ground". |
| `capacity` | optional | Stadium capacity, e.g. `"74,310"`. |
| `coordinates` | optional | Stadium coordinates, e.g. `"53.4631°N 2.2913°W"`. |
| `owntitle` | optional | Custom row label for the owner row; defaults to `"Owner(s)"`. |
| `owner` | optional | Club owner name. |
| `chrtitle` | optional | Custom row label for the chairman row; defaults to `"Chairman"`. |
| `chairman` | optional | Chairman name. |
| `ceo` | optional | Chief executive officer. |
| `mgrtitle` | optional | Custom row label for the manager row; defaults to `"Manager"`. |
| `manager` | optional | Manager name. |
| `coach` | optional | Head coach (separate from manager). |
| `league` | optional | Current league, e.g. `"Premier League"`. |
| `season` | optional | Current season year, e.g. `"2024–25"`. |
| `position` | optional | Current league position, e.g. `"3rd"`. |
| `website` | optional | Club website URL. |
| `below` | optional | Freeform footer block (footnotes, see-also links). |

## Worked example

```go
{{< football-club
    name      = "Manchester United"
    full_name = "Manchester United Football Club"
    nickname  = "The Red Devils"
    founded   = "1878"
    ground    = "Old Trafford"
    capacity  = "74,310"
    manager   = "Erik ten Hag"
    league    = "Premier League"
>}}{{< /football-club >}}
```

## See also

- Upstream template: <https://en.wikipedia.org/wiki/Template:Infobox_football_club>
- Demo article: [`exampleSite/content/articles/football-club-demo.md`](../../../exampleSite/content/articles/football-club-demo.md)
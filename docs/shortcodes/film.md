# `{{< film >}}`

Film infobox — replicates `Template:Infobox film` from
Wikipedia (~170k transclusions).

## Parameters

The full parameter list, in declaration order. The list mirrors the
comment header at the top of `layouts/_shortcodes/film.html`, which
is the source of truth.

| Parameter | Required | Purpose |
|---|---|---|
| `name` | required | The film title (becomes the infobox header). |
| `image` | optional | Poster or production still filename. |
| `caption` | optional | Caption under the image; markdown-rendered. |
| `alt` | optional | Alt text on the image for assistive tech. |
| `director` | optional | Director(s), comma-separated for multiple. |
| `producer` | optional | Producer(s), comma-separated for multiple. |
| `writer` | optional | Screenwriter(s), comma-separated for multiple. |
| `story` | optional | Original story credit. |
| `based_on` | optional | Source material. |
| `starring` | optional | Lead cast, comma-separated. |
| `music` | optional | Composer. |
| `cinematography` | optional | Director of photography. |
| `editing` | optional | Film editor(s). |
| `studio` | optional | Production company; rendered as "Production company". |
| `distributor` | optional | Distribution company; rendered as "Distributed by". |
| `released` | optional | Release date, e.g. `"8 July 2010"`. |
| `runtime` | optional | Running time in minutes; rendered with a `" minutes"` suffix. |
| `country` | optional | Country of production. |
| `language` | optional | Primary language(s). |
| `budget` | optional | Production budget (numeric string). |
| `gross` | optional | Box-office gross (numeric string). |
| `currency` | optional | Three-letter currency code, e.g. `"USD"`; prefixed on the budget/gross row. |
| `below` | optional | Freeform footer block (footnotes, see-also links). |

## Worked example

```go
{{< film
    name      = "Inception"
    director  = "Christopher Nolan"
    producer  = "Emma Thomas, Christopher Nolan"
    writer    = "Christopher Nolan"
    starring  = "Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page"
    music     = "Hans Zimmer"
    studio    = "Syncopy Films, Legendary Pictures"
    distributor = "Warner Bros. Pictures"
    released  = "8 July 2010"
    runtime   = "148"
    budget    = "160,000,000"
    gross     = "836,836,967"
    currency  = "USD"
>}}{{< /film >}}
```

## See also

- Upstream template: <https://en.wikipedia.org/wiki/Template:Infobox_film>
- Demo article: [`exampleSite/content/articles/film-demo.md`](../../../exampleSite/content/articles/film-demo.md)
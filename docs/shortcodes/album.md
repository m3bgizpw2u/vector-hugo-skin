# `{{< album >}}`

Music album infobox — replicates `Template:Infobox album` from
Wikipedia (~168k transclusions).

## Parameters

The full parameter list, in declaration order. The list mirrors the
comment header at the top of `layouts/_shortcodes/album.html`, which
is the source of truth.

| Parameter | Required | Purpose |
|---|---|---|
| `name` | required | The album title (becomes the infobox header). |
| `type` | optional | Album type, e.g. `"Studio"`, `"EP"`, `"Single"`, `"Live"`, `"Compilation"`. |
| `artist` | optional | Recording artist(s). Comma-separated for multiple. |
| `cover` | optional | Cover image filename. |
| `caption` | optional | Caption under the cover. Markdown-rendered. |
| `alt` | optional | Alt text on the cover image for assistive tech. |
| `released` | optional | Release date, e.g. `"21 May 1997"`. |
| `recorded` | optional | Recording dates / location, e.g. `"1996–1997"`. |
| `studio` | optional | Recording studio(s). |
| `genre` | optional | Genre(s). Comma-separated. |
| `length` | optional | Total runtime, e.g. `"53:30"`. |
| `label` | optional | Record label(s). |
| `producer` | optional | Producer(s). |
| `executive_producer` | optional | Executive producer(s). |
| `last_album` | optional | Title of the artist's previous album. |
| `last_album_year` | optional | Year of `last_album`. |
| `next_album` | optional | Title of the artist's next album. |
| `next_album_year` | optional | Year of `next_album`. |
| `tracks` | optional | Number of tracks. |
| `total_length` | optional | Total runtime of all tracks. |
| `awards` | optional | Awards the album has won. |
| `certifications` | optional | Sales certifications. |
| `below` | optional | Freeform footer block (footnotes, see-also links). |

## Worked example

```go
{{< album
    name      = "OK Computer"
    type      = "Studio"
    artist    = "Radiohead"
    cover     = "ok-computer.jpg"
    caption   = "Original 1997 Parlophone cover"
    alt       = "OK Computer cover art"
    released  = "21 May 1997"
    recorded  = "1996–1997"
    studio    = "St Catherine's Court, Bath"
    genre     = "Art rock, alternative rock, electronica"
    length    = "53:30"
    label     = "Parlophone, Capitol"
    producer  = "Nigel Godrich, Radiohead"
    tracks    = "12"
    awards    = "Grammy Award for Best Alternative Music Album"
>}}{{< /album >}}
```

## See also

- Upstream template: <https://en.wikipedia.org/wiki/Template:Infobox_album>
- Demo article: [`exampleSite/content/articles/album-demo.md`](../../../exampleSite/content/articles/album-demo.md)

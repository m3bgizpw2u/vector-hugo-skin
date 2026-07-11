# `{{< video-game >}}`

Video game infobox — replicates `Template:Infobox video game` from
Wikipedia (~30k transclusions).

## Parameters

The full parameter list, in declaration order. The list mirrors the
comment header at the top of `layouts/_shortcodes/video-game.html`, which
is the source of truth.

| Parameter | Required | Purpose |
|---|---|---|
| `name` | required | Game title (becomes the infobox header). |
| `title` | optional | Alternate title (used as title fallback). |
| `image` | optional | Cover or screenshot filename (used as cover fallback). |
| `caption` | optional | Caption under the image. Markdown-rendered. |
| `alt` | optional | Alt text on the image for assistive tech. |
| `cover_art` | optional | Cover-art filename (preferred over `image`). |
| `developer` | optional | Developer(s). Comma-separated for multiple. |
| `publisher` | optional | Publisher(s). |
| `director` | optional | Director(s). |
| `producer` | optional | Producer(s). |
| `designer` | optional | Designer(s). |
| `programmer` | optional | Programmer(s). |
| `artist` | optional | Artist(s). |
| `writer` | optional | Writer(s). |
| `composer` | optional | Music composer(s). |
| `series` | optional | Game series, e.g. `"The Legend of Zelda"`. |
| `engine` | optional | Game engine, e.g. `"Unreal Engine 5"`. |
| `platform` | optional | Platform(s). Falls back to `platforms`. |
| `platforms` | optional | Alternative to `platform` when used directly. |
| `initial_release_date` | optional | Initial release date, e.g. `"17 September 2020"`. |
| `released` | optional | Alias for `initial_release_date` (preferred when supplied). |
| `release` | optional | Alias for `released`. |
| `latest_release` | optional | Latest patch / version, e.g. `"1.0"`. |
| `genre` | optional | Genre(s). Comma-separated. |
| `modes` | optional | Game modes, e.g. `"Single-player"`, `"Multiplayer"`. |
| `requirements` | optional | System requirements summary. |
| `ratings` | optional | Age ratings, e.g. `"ESRB: T"`. |
| `input` | optional | Input devices, e.g. `"Keyboard, mouse, gamepad"`. |
| `language` | optional | Supported languages. |
| `format` | optional | Distribution format, e.g. `"Digital download"`. |
| `status` | optional | Release status, e.g. `"Released"`, `"Active"`. |
| `website` | optional | Official game URL. |
| `below` | optional | Freeform footer block (footnotes, see-also links). |

## Worked example

```go
{{< video-game
    name                = "Hades"
    developer           = "Supergiant Games"
    publisher           = "Supergiant Games"
    director            = "Greg Kasavin"
    composer            = "Darren Korb"
    engine              = "Hades Engine"
    platform            = "Windows, macOS, Nintendo Switch"
    initial_release_date = "17 September 2020"
    latest_release      = "1.0"
    genre               = "Roguelike"
    modes               = "Single-player"
    status              = "Released"
>}}{{< /video-game >}}
```

## See also

- Upstream template: <https://en.wikipedia.org/wiki/Template:Infobox_video_game>
- Demo article: [`exampleSite/content/articles/video-game-demo.md`](../../../exampleSite/content/articles/video-game-demo.md)

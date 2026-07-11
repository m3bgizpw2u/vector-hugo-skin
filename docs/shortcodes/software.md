# `{{< software >}}`

Software / application infobox — replicates `Template:Infobox software`
from Wikipedia (~14k transclusions).

## Parameters

The full parameter list, in declaration order. The list mirrors the
comment header at the top of `layouts/_shortcodes/software.html`, which
is the source of truth.

| Parameter | Required | Purpose |
|---|---|---|
| `name` | required | The software's name (becomes the infobox header). Falls back to `title`, then `.Page.Title`. |
| `title` | optional | Preferred title — used first when supplied. |
| `logo` | optional | Logo image filename (preferred over `screenshot` for the top image slot). |
| `screenshot` | optional | Screenshot image filename. |
| `caption` | optional | Caption under the image. Markdown-rendered. |
| `other_names` | optional | Alternate names or aliases. |
| `author` | optional | Original author(s), e.g. `"spf13, Bjørn Erik Pedersen, and contributors"`. |
| `developer` | optional | Current developer(s). |
| `released` | optional | Initial release date, e.g. `"2013"`. |
| `discontinued` | optional | Discontinuation marker — when non-empty, status defaults to `"Discontinued"`. |
| `latest_release_version` | optional | Latest stable version string, e.g. `"0.163.3"`. |
| `latest_release_date` | optional | Latest stable release date, e.g. `"2026-06-19"`. |
| `latest_preview_version` | optional | Latest pre-release version string. |
| `latest_preview_date` | optional | Latest pre-release date. |
| `status` | optional | Explicit status string, e.g. `"Active"`, `"Beta"`. |
| `programming_language` | optional | Language(s) the software is written in, e.g. `"Go"`. |
| `operating_system` | optional | Supported operating systems, e.g. `"Cross-platform"`. |
| `platform` | optional | Platform / hardware targets, e.g. `"Linux, macOS, Windows"`. |
| `available_languages` | optional | Localised languages available, e.g. `"English, French, German"`. |
| `genre` | optional | Software genre / category, e.g. `"Static site generator"`. |
| `license` | optional | Software license, e.g. `"Apache-2.0"`. |
| `source_model` | optional | Source availability, e.g. `"Open-source"`. |
| `repo` | optional | Source-code repository URL. |
| `website` | optional | Official website URL. |
| `below` | optional | Freeform footer block (footnotes, see-also links). |

## Worked example

```go
{{< software
    name              = "Hugo"
    developer         = "spf13, Bjørn Erik Pedersen, and contributors"
    initial_release   = "2013"
    latest_release    = "0.163.3"
    latest_release_date = "2026-06-19"
    status            = "Active"
    operating_system  = "Cross-platform"
    platform          = "Linux, macOS, Windows"
    license           = "Apache-2.0"
    source_model      = "Open-source"
    programming_language = "Go"
>}}{{< /software >}}
```

## See also

- Upstream template: <https://en.wikipedia.org/wiki/Template:Infobox_software>
- Demo article: [`exampleSite/content/articles/software-demo.md`](../../../exampleSite/content/articles/software-demo.md)
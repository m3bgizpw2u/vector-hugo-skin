# `{{< company >}}`

Company / corporation infobox — replicates `Template:Infobox company`
from Wikipedia (~92k transclusions).

## Parameters

The full parameter list, in declaration order. The list mirrors the
comment header at the top of `layouts/_shortcodes/company.html`, which
is the source of truth.

| Parameter | Required | Purpose |
|---|---|---|
| `name` | required | The company's name (becomes the infobox header). |
| `trade_name` | optional | Trade / DBA name if different from the legal name. |
| `logo` | optional | Company logo filename (used as the image). |
| `image` | optional | Alternative image filename; falls back to `logo`. |
| `caption` | optional | Caption under the logo. Markdown-rendered. |
| `alt` | optional | Alt text on the logo for assistive tech. |
| `type` | optional | Company type, e.g. `"Public"`, `"Private"`, `"Subsidiary"`, `"State-owned"`. |
| `industry` | optional | Industry / sector. |
| `founded` | optional | Date founded, e.g. `"1 January 1907"`. |
| `founder` | optional | Founder(s) of the company. |
| `defunct` | optional | Date the company became defunct; suppressed if equal to `founded`. |
| `hq_location` | optional | Full headquarters location as a single string (alias for `hq_location_city`). |
| `hq_location_city` | optional | Headquarters city. |
| `hq_location_country` | optional | Headquarters country. |
| `num_employees` | optional | Number of employees. |
| `num_locations` | optional | Number of office / branch locations. |
| `key_people` | optional | Key executives (CEO, chair, founder), e.g. `"W. E. Coyote (CEO)"`. |
| `products` | optional | Main products, comma-separated. |
| `services` | optional | Main services, comma-separated. |
| `revenue` | optional | Annual revenue figure, e.g. `"US$1.2 billion"`. |
| `operating_income` | optional | Operating income for the period. |
| `net_income` | optional | Net income for the period. |
| `assets` | optional | Total assets. |
| `equity` | optional | Total equity. |
| `owner` | optional | Owner(s) of the company. |
| `parent` | optional | Parent company. |
| `divisions` | optional | Major divisions, comma-separated. |
| `subsid` | optional | Subsidiaries, comma-separated. |
| `website` | optional | Official website URL. |
| `below` | optional | Freeform footer block (footnotes, see-also links). |

## Worked example

```go
{{< company
    name           = "Acme Corporation"
    trade_name     = "Acme Co."
    type           = "Public"
    industry       = "Conglomerate"
    founded        = "1 January 1907"
    founder        = "R. J. Acme"
    hq_location    = "Springfield"
    hq_location_country = "United States"
    key_people     = "W. E. Coyote (CEO)"
    products       = "Anvils, rockets, road runners"
    revenue        = "US$1.2 billion"
>}}{{< /company >}}
```

## See also

- Upstream template: <https://en.wikipedia.org/wiki/Template:Infobox_company>
- Demo article: [`exampleSite/content/articles/company-demo.md`](../../../exampleSite/content/articles/company-demo.md)

# `{{< political-party >}}`

Political party infobox — replicates `Template:Infobox political party` from
Wikipedia (~16k transclusions).

## Parameters

The full parameter list, in declaration order. The list mirrors the comment
header at the top of `layouts/_shortcodes/political-party.html`, which is the
source of truth.

| Parameter | Required | Purpose |
|---|---|---|
| `name` | required | The party's name (becomes the infobox header). |
| `native_name` | optional | Party name in the party's native language, rendered as a subtitle. |
| `logo` | optional | Party logo / emblem image filename. |
| `logo_alt` | optional | Alt text on the logo for assistive tech. |
| `abbreviation` | optional | Party abbreviation, e.g. `"GPEW"`. |
| `abbr` | optional | Alias for `abbreviation`. |
| `leader` | optional | Current party leader or leadership structure. |
| `president` | optional | Party president. |
| `chairperson` | optional | Party chairperson. |
| `chairman` | optional | Alias for `chairperson` (masculine). |
| `chairwoman` | optional | Alias for `chairperson` (feminine). |
| `secretary` | optional | Party secretary. |
| `general_secretary` | optional | General secretary. |
| `first_secretary` | optional | First secretary. |
| `secretary_general` | optional | Alias for `general_secretary`. |
| `spokesperson` | optional | Party spokesperson. |
| `spokesman` | optional | Alias for `spokesperson`. |
| `founder` | optional | Single founder of the party. |
| `founders` | optional | Multiple founders; row label becomes "Founder(s)". |
| `founder2` | optional | Secondary founder (rendered as "Other founder"). |
| `founded` | optional | Date / year the party was founded, e.g. `"1990"`. |
| `dissolved` | optional | Date / year the party was dissolved. |
| `split` | optional | Parent party this party split from. |
| `merged` | optional | Party this party merged into. |
| `headquarters` | optional | Headquarters location. |
| `country` | optional | Country the party operates in, e.g. `"United Kingdom"`. |
| `ideology` | optional | Party ideology, e.g. `"Green politics, eco-socialism"`. |
| `position` | optional | Political position, e.g. `"Left-wing"`. |
| `european` | optional | European-level affiliation. |
| `international` | optional | International affiliation. |
| `youth_wing` | optional | Youth wing organization. |
| `wing` | optional | Internal faction / wing. |
| `membership` | optional | Total party membership. |
| `slogan` | optional | Party slogan. |
| `anthem` | optional | Party anthem. |
| `colors` | optional | American-English spelling of the party's colours. |
| `colours` | optional | British-English spelling; preferred over `colors` when supplied. |
| `seats1_title` | optional | Label for the first seat count (defaults to `"Seats"`). |
| `seats1` | optional | First-house seat count. |
| `seats2_title` | optional | Label for the second seat count (defaults to `"Seats (lower)"`). |
| `seats2` | optional | Second-house seat count. |
| `website` | optional | Official URL. |
| `below` | optional | Freeform footer block (footnotes, see-also links). |

## Worked example

```go
{{< political-party
    name        = "Green Party of England and Wales"
    abbreviation = "GPEW"
    leader      = "Co-leaders"
    founded     = "1990"
    headquarters = "London"
    country     = "United Kingdom"
    ideology    = "Green politics, eco-socialism"
    position    = "Left-wing"
    colors      = "Green"
>}}{{< /political-party >}}
```

## See also

- Upstream template: <https://en.wikipedia.org/wiki/Template:Infobox_political_party>
- Demo article: [`exampleSite/content/articles/political-party-demo.md`](../../../exampleSite/content/articles/political-party-demo.md)
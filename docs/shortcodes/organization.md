# `{{< organization >}}`

Organization infobox — replicates `Template:Infobox organization` from
Wikipedia (~43k transclusions).

## Parameters

The full parameter list, in declaration order. The list mirrors the comment
header at the top of `layouts/_shortcodes/organization.html`, which is the
source of truth.

| Parameter | Required | Purpose |
|---|---|---|
| `name` | required | The organization's name (becomes the infobox header). |
| `full_name` | optional | Full legal name, used when `name` is an abbreviation. |
| `native_name` | optional | Name in the organization's native language, rendered as a subtitle. |
| `abbreviation` | optional | Common abbreviation, e.g. `"GPEW"`. |
| `nickname` | optional | Informal nickname. |
| `type` | optional | Legal / organisational type, e.g. `"501(c)(3) nonprofit"`. |
| `logo` | optional | Logo image filename. |
| `image` | optional | Generic image filename used when no logo is supplied. |
| `caption` | optional | Caption under the image. Markdown-rendered. |
| `founded` | optional | Date or year the organization was founded, e.g. `"20 June 2003"`. |
| `founder` | optional | Single founder of the organization. |
| `founders` | optional | Multiple founders; switches the row label to "Founders". |
| `formation` | optional | Formation event description. |
| `defunct` | optional | Date the organization ceased operating; switches the row label to "Defunct". |
| `dissolved` | optional | Alias for `defunct`; row label becomes "Dissolved" when this is used. |
| `headquarters` | optional | Headquarters location. |
| `location` | optional | Generic location description. |
| `coordinates` | optional | Geo coordinates of the headquarters. |
| `coords` | optional | Alias for `coordinates`. |
| `region_served` | optional | Geographic region served, e.g. `"Worldwide"`. |
| `services` | optional | Services offered. |
| `products` | optional | Products offered. |
| `product` | optional | Alias for `products`. |
| `members` | optional | Member count. |
| `membership` | optional | Alias for `members`. |
| `num_members` | optional | Numeric member count; preferred over `members`/`membership`. |
| `num_members_year` | optional | Year of the `num_members` figure; appended as `(YYYY)`. |
| `employees` | optional | Number of employees. |
| `volunteers` | optional | Number of volunteers. |
| `budget` | optional | Annual budget. |
| `budget_year` | optional | Year of the `budget` figure; appended as `(YYYY)`. |
| `key_people` | optional | Notable leaders / staff. |
| `leader_name` | optional | Generic leader name. |
| `leader_title` | optional | Title for the generic leader; defaults to `"Leader"` when only `leader_name` is given. |
| `leader_title1` | optional | Title for the first numbered leader. |
| `leader_name1` | optional | Name of the first numbered leader. |
| `leader_title2` | optional | Title for the second numbered leader. |
| `leader_name2` | optional | Name of the second numbered leader. |
| `leader_title3` | optional | Title for the third numbered leader. |
| `leader_name3` | optional | Name of the third numbered leader. |
| `leader_title4` | optional | Title for the fourth numbered leader. |
| `leader_name4` | optional | Name of the fourth numbered leader. |
| `parent` | optional | Parent organization. |
| `parent_organization` | optional | Alias for `parent`. |
| `parent_organisation` | optional | British-English alias for `parent`. |
| `subsidiaries` | optional | Subsidiary organizations. |
| `subs` | optional | Alias for `subsidiaries`. |
| `affiliations` | optional | Affiliated organizations. |
| `website` | optional | Official URL. |
| `below` | optional | Freeform footer block (footnotes, see-also links). |

## Worked example

```go
{{< organization
    name           = "Wikimedia Foundation"
    logo           = "wikimedia-logo.svg"
    type           = "501(c)(3) nonprofit"
    founded        = "20 June 2003"
    founder        = "Jimmy Wales"
    hq_location    = "San Francisco, California"
    hq_location_country = "United States"
    area_served    = "Worldwide"
    key_people     = "Maryana Iskander (CEO)"
>}}{{< /organization >}}
```

## See also

- Upstream template: <https://en.wikipedia.org/wiki/Template:Infobox_organization>
- Demo article: [`exampleSite/content/articles/organization-demo.md`](../../../exampleSite/content/articles/organization-demo.md)
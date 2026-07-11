# `{{< university >}}`

University / college infobox — replicates `Template:Infobox university`
from Wikipedia (~26k transclusions).

## Parameters

The full parameter list, in declaration order. The list mirrors the
comment header at the top of `layouts/_shortcodes/university.html`, which
is the source of truth.

| Parameter | Required | Purpose |
|---|---|---|
| `name` | required | Institution name (becomes the infobox header). |
| `native_name` | optional | Native-script name, e.g. `"東京大学"` (rendered as subtitle). |
| `latin_name` | optional | Latin name, e.g. `"Universitas Oxoniensis"`. |
| `motto` | optional | Latin motto, e.g. `"Mens et Manus"`. |
| `motto_eng` | optional | English translation of the motto. |
| `image` | optional | Campus or coat-of-arms filename. |
| `caption` | optional | Caption under the image. Markdown-rendered. |
| `alt` | optional | Alt text on the image for assistive tech. |
| `type` | optional | Institution type, e.g. `"Private research university"`. |
| `established` | optional | Founding date, e.g. `"1861"`. |
| `closed` | optional | Closure date, when applicable. |
| `founders` | optional | Founder(s). Comma-separated. |
| `parent` | optional | Parent institution, e.g. `"University of Cambridge"`. |
| `accreditation` | optional | Accrediting body. |
| `affiliations` | optional | General affiliations. |
| `religious_affiliation` | optional | Religious affiliation, e.g. `"Roman Catholic"`. |
| `academic_affiliations` | optional | Academic consortia, e.g. `"Ivy League"`. |
| `endowment` | optional | Endowment size, e.g. `"US$24.6 billion"`. |
| `budget` | optional | Annual operating budget. |
| `officer_in_charge` | optional | Officer-in-charge credit. |
| `chair` | optional | Chair of the governing body. |
| `chairman` | optional | Chairman of the board. |
| `chairperson` | optional | Chairperson of the board. |
| `visitor` | optional | Visitor credit (ceremonial head). |
| `chancellor` | optional | Chancellor credit. |
| `president` | optional | President / vice-chancellor credit. |
| `vice_president` | optional | Vice-president credit. |
| `superintendent` | optional | Superintendent credit. |
| `vice_chancellor` | optional | Vice-chancellor credit. |
| `provost` | optional | Provost credit. |
| `rector` | optional | Rector credit. |
| `dean` | optional | Dean credit. |
| `faculty` | optional | Faculty size, e.g. `"1,074"`. |
| `students` | optional | Total enrolment. |
| `undergrad` | optional | Undergraduate enrolment. |
| `postgrad` | optional | Postgraduate enrolment. |
| `doctoral` | optional | Doctoral enrolment. |
| `city` | optional | City, e.g. `"Cambridge"`. |
| `state` | optional | State / province, e.g. `"Massachusetts"`. |
| `country` | optional | Country, e.g. `"United States"`. |
| `campus` | optional | Campus setting, e.g. `"Urban"`, `"168 acres"`. |
| `colors` | optional | School colors, e.g. `"Cardinal red and silver gray"`. Falls back to `colours`. |
| `mascot` | optional | Mascot, e.g. `"Tim the Beaver"`. |
| `nickname` | optional | Nickname, e.g. `"Beavers"`. |
| `sporting_affiliations` | optional | Athletic conference, e.g. `"NCAA Division I — Pac-12"`. |
| `website` | optional | Official URL. |
| `below` | optional | Freeform footer block (footnotes, see-also links). |

## Worked example

```go
{{< university
    name        = "Massachusetts Institute of Technology"
    latin_name  = "Institutum Technologiae Massachusettense"
    motto       = "Mens et Manus"
    motto_eng   = "Mind and Hand"
    type        = "Private research university"
    established = "1861"
    endowment   = "US$24.6 billion"
    president   = "Sally Kornbluth"
    students    = "11,934"
    undergrad   = "4,576"
    postgrad   = "7,358"
    city        = "Cambridge"
    state       = "Massachusetts"
    country     = "United States"
    colors      = "Cardinal red and silver gray"
    mascot      = "Tim the Beaver"
>}}{{< /university >}}
```

## See also

- Upstream template: <https://en.wikipedia.org/wiki/Template:Infobox_university>
- Demo article: [`exampleSite/content/articles/university-demo.md`](../../../exampleSite/content/articles/university-demo.md)

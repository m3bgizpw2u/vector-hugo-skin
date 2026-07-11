# `{{< school >}}`

School infobox — replicates `Template:Infobox school` from Wikipedia
(~40k transclusions).

## Parameters

The full parameter list, in declaration order. The list mirrors the
comment header at the top of `layouts/_shortcodes/school.html`, which
is the source of truth.

| Parameter | Required | Purpose |
|---|---|---|
| `name` | required | The school's title (becomes the infobox header). |
| `native_name` | optional | Native-language name, rendered as a subtitle. |
| `latin_name` | optional | Latin name, rendered alongside `native_name`. |
| `logo` | optional | Logo image filename. |
| `seal_image` | optional | School seal image filename. |
| `image` | optional | Photo of the school. |
| `caption` | optional | Caption under the image. Markdown-rendered. |
| `address` | optional | Street address. |
| `location` | optional | Location label, e.g. suburb / district. |
| `city` | optional | City — falls back to `town`. |
| `town` | optional | Town, fallback for `city`. |
| `state` | optional | State / region. |
| `province` | optional | Province — when `state` empty, this row renders. |
| `country` | optional | Country — falls back to `country1`. |
| `country1` | optional | Country fallback. |
| `coordinates` | optional | Latitude/longitude as text, e.g. `"42.3601°N 71.0589°W"`. |
| `established` | optional | Established date — when present, label reads "Established". |
| `founded` | optional | Founding date — fallback for `established`; label reads "Founded". |
| `opened` | optional | Opening date — final fallback; label reads "Opened". |
| `closed` | optional | Closure date. |
| `status` | optional | Operational status, e.g. `"Open"`, `"Closed"`. |
| `motto` | optional | School motto — falls back to `mottoes`. |
| `motto_translation` | optional | English gloss on the motto; rendered in parentheses after `motto`. |
| `mottoes` | optional | Alternate motto — fallback for `motto`. |
| `type` | optional | Generic school type. |
| `schooltype` | optional | School type label, e.g. `"Public secondary"` — when set, label reads "School type". |
| `fundingtype` | optional | Funding source — used when `schooltype` empty; label reads "Funding type". |
| `religion` | optional | Religious affiliation in plain form. |
| `denomination` | optional | Specific denomination. |
| `religious_affiliation` | optional | Long-form religious affiliation string. |
| `patron` | optional | Patron saint(s). |
| `principal` | optional | Principal name. |
| `headmaster` | optional | Headmaster name. |
| `head_teacher` | optional | Head teacher name. |
| `head` | optional | Generic "head" of school. |
| `students` | optional | Student count. |
| `enrollment` | optional | Enrollment figure — falls back to `enrolment`. |
| `enrolment` | optional | British-spelling enrollment fallback. |
| `capacity` | optional | Student capacity. |
| `grades` | optional | Grades served, e.g. `"9–12"`. |
| `gender` | optional | Gender mix, e.g. `"Coeducational"`. |
| `age_range` | optional | Age range string, e.g. `"11–18"`. |
| `lower_age` | optional | Lower age — used when `age_range` empty; composes with `upper_age`. |
| `upper_age` | optional | Upper age — composes with `lower_age`; if missing, label reads "lower+". |
| `campus` | optional | Campus description. |
| `colors` | optional | School colors — falls back to `colours`. |
| `colours` | optional | British-spelling colors fallback. |
| `mascot` | optional | Mascot name. |
| `nickname` | optional | Athletic nickname. |
| `rival` | optional | Rival school — falls back to `rivals`. |
| `rivals` | optional | Plural rivals fallback. |
| `accreditation` | optional | Accreditation body — falls back to `accreditations`. |
| `accreditations` | optional | Plural accreditation fallback. |
| `website` | optional | Official website URL. |
| `below` | optional | Freeform footer block (footnotes, see-also links). |

## Worked example

```go
{{< school
    name        = "Springfield High School"
    motto       = "Veritas Lux in Tenebris"
    established = "1889"
    type        = "Public secondary"
    principal   = "John Smith"
    students    = "2,100"
    grades      = "9–12"
    nickname    = "Tigers"
    mascot      = "Tommy Tiger"
    colors      = "Orange and black"
>}}{{< /school >}}
```

## See also

- Upstream template: <https://en.wikipedia.org/wiki/Template:Infobox_school>
- Demo article: [`exampleSite/content/articles/school-demo.md`](../../../exampleSite/content/articles/school-demo.md)
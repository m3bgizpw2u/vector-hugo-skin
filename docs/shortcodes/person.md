# `{{< person >}}`

Person infobox — replicates `Template:Infobox person` from Wikipedia
(~570k transclusions, the second-most-used infobox template).

## Parameters

The full parameter list, in declaration order. The list mirrors the comment
header at the top of `layouts/_shortcodes/person.html`, which is the source of
truth.

| Parameter | Required | Purpose |
|---|---|---|
| `name` | required | The person's name (becomes the infobox header). |
| `image` | optional | Portrait image filename. |
| `caption` | optional | Caption under the portrait. Markdown-rendered. |
| `alt` | optional | Alt text on the portrait for assistive tech. |
| `birth_date` | optional | Date of birth, e.g. `"10 December 1815"`. |
| `birth_place` | optional | Place of birth, e.g. `"London, England"`. |
| `death_date` | optional | Date of death, e.g. `"27 November 1852"`. |
| `death_place` | optional | Place of death. |
| `age` | optional | Current age; appended to the Born row as `"(age N)"`. |
| `nationality` | optional | Nationality, e.g. `"British"`. |
| `occupation` | optional | Occupation(s). Comma-separated for multiple. |
| `years_active` | optional | Years the person was active in their field, e.g. `"1843–1852"`. |
| `known_for` | optional | What the person is best known for. |
| `notable_works` | optional | Notable works. Markdown-rendered. |
| `website` | optional | Official or reference URL. |
| `below` | optional | Freeform footer block (footnotes, see-also links). |

## Worked example

```go
{{< person
    name        = "Ada Lovelace"
    image       = "ada.jpg"
    caption     = "Portrait of Ada Lovelace, 1843"
    birth_date  = "10 December 1815"
    birth_place = "London, England"
    death_date  = "27 November 1852"
    occupation  = "Mathematician, writer"
    notable_works = "*Notes on the Analytical Engine*"
>}}{{< /person >}}
```

## See also

- Upstream template: <https://en.wikipedia.org/wiki/Template:Infobox_person>
- Demo article: [`exampleSite/content/articles/person-demo.md`](../../../exampleSite/content/articles/person-demo.md)
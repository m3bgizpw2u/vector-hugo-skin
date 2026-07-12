# Shortcode Gaps

> Maintained by the Sally Ride replication work. New gap analyses append as
> new `## <shortcode>` sections.

This document catalogues the **upstream MediaWiki parameters that named
shortcodes in this theme currently do not accept**, surfaced by the
[Sally Ride replication spec][sally-ride-spec] and the [Sally Ride element
research note][sally-ride-research]. Each gap section names the
upstream template, the missing parameters, the upstream citation, an
**authoring workaround** for the immediate Sally Ride article (and any
analogous article), and a forward-looking note for the future PR series
that picks the gap up.

The document does **not** propose new naming conventions, fix the gap in
code, or recommend a single design direction. It captures the gap, not
the solution.

## How to read this document

- **If you're authoring a Sally Ride-style article**, look up the
  relevant shortcode, copy the workaround from its gap section, and
  move on. The workaround uses shortcodes that **already ship in v1**.
- **If you're planning a follow-up PR series**, pick one section and
  propose the implementation plan. The forward-looking note per
  section points at the file paths that a code change would touch.

## Scope

These gaps are documented but **not** scheduled for implementation in
the Sally Ride replication work. Each gap is picked up by a future PR
series; see [`docs/RESEARCH.md` §2.1][research-21] (the upstream
`Template:Infobox` metatemplate description and the parameter-naming
convention guidance) for the upstream rationale.

> **Citation note.** The ticket that opened this document
> (`.plans/research-2026-07-12/issues/012-person-gap-documentation.md`)
> references `docs/RESEARCH.md §2.4` for parameter-naming conventions.
> The current `docs/RESEARCH.md` does not contain a §2.4 — the
> relevant sub-sections are §2.1 (the metatemplate), §2.2 (2–3 child
> templates), and §2.3 (renderer-side observations). The §2.1
> "parameters should be named, snake_case, lower-case unless a proper
> noun, consistent across templates" passage is the convention this
> document relies on for the upstream parameter names below.

## `person`

The `{{< person >}}` shortcode at [`layouts/_shortcodes/person.html`][person]
accepts 15 named parameters (`name`, `image`, `caption`, `alt`,
`birth_date`, `birth_place`, `death_date`, `death_place`, `age`,
`nationality`, `occupation`, `years_active`, `known_for`,
`notable_works`, `website`, `below`). The upstream
[`Template:Infobox person`][tpl-person] exposes roughly 60 named
parameters; the 7 below are the ones the Sally Ride page actually
exercises and that the current wrapper is silent on. Every other
upstream parameter (`title`, `term`, `office`, `citizenship`, `signature`,
etc.) is also unmodelled in v1 but not surfaced by Sally Ride.

### Missing parameters (Sally Ride-page exercises)

| Upstream parameter | Upstream label | Wikidata | Type | Notes |
|---|---|---|---|---|
| `spouse` | `Spouse` (sometimes `Spouse(s)`) | P26 | String, inline list, with optional `(m. YYYY; div. YYYY)` date suffix | Upstream allows `{{Marriage|name|YYYY|YYYY|reason=divorce}}` for the structured form. |
| `partner` | `Partner` (sometimes `Partner(s)`) | P451 | String, inline list, with optional `(YYYY–present)` date suffix | "Unmarried long-term partner" only; **not** business partner. |
| `education` | `Education` | P69 | String, inline list | Concise alternative: `alma_mater` (P69). Both are upstream options; Sally Ride uses `education`. |
| `mission_insignia` | `Mission insignia` | — | Image list (thumbnails), 1..N per row | Astronaut-specific row. Each insignia is a `<a href="File:…">` link to the SVG/PNG plus an `<img>` inside the cell. |
| `time_in_space` | `Time in space` | — | Duration string (e.g. `14d 7h 46m`) | Astronaut-specific. Upstream formats the duration via `{{Duration}}`. |
| `selection` | `Selection` | — | String (astronaut group + year) | Astronaut-specific. Sally Ride value: `[NASA Group 8 (1978)]`. |
| `missions` | `Missions` | — | Bulleted list of mission names (with dates and insignia) | Astronaut-specific. Each entry links to a mission article. |
| `retirement` | `Retirement` | — | Date (full date or year) | Astronaut-specific. Sally Ride value: `August 15, 1987`. |

The ticket's seven rows plus the ticket's note that `Awards` is
**already supported** by the existing `infobox-row` inner primitive —
and so is not a gap — are honoured here. `Education` is added
explicitly because the Sally Ride page renders an `Education` row that
the current wrapper would silently drop.

### Upstream citation

- **Source template:** [`Template:Infobox person`][tpl-person] on
  `en.wikipedia.org`, fetched 2026-07-11, 12,531 bytes, CC BY-SA 4.0
  (see `docs/SHORTCODES.md` §11 for the full provenance table).
- **Live URL:** <https://en.wikipedia.org/wiki/Template:Infobox_person>
- **Relevant parameter-block in upstream source:** the row block in
  the template body (lines ~140–151 for `spouse`, `partner`,
  `education`, `alma_mater`, `awards`); the parameter-documentation
  block in the documentation sub-page (the "Parameters" section,
  "Personal life" group).
- **Rendered DOM reference:** the Sally Ride article's infobox at
  <https://en.wikipedia.org/wiki/Sally_Ride> (the first `<table
  class="infobox biography vcard">` block on the page).
- **Local snapshot:** `Sally_Ride-0.md` lines 213–230 in
  `~/.cursor/projects/home-alpha01-gitrepo-vector-hugo-skin/uploads/`.
  Class attributes were stripped during Markdown conversion; structural
  confirmation leans on the upstream `Template:Infobox person`
  documentation above.

### Authoring workaround (immediate Sally Ride page)

The seven rows can be added inline using the `{{< infobox-row >}}`
inner primitive, which is the documented escape hatch in
[`docs/SHORTCODES.md` §5][shortcodes-5] and [`docs/shortcodes/infobox-primitives.md`][infobox-primitives].
The named wrapper does not need to grow any parameters:

```go
{{< person
    name        = "Sally Ride"
    image       = "sally-ride-1984.jpg"
    caption     = "Ride in 1984"
    alt         = "Black-and-white portrait of Sally Ride in 1984"
    birth_date  = "26 May 1951"
    birth_place = "Santa Monica, California, U.S."
    death_date  = "23 July 2012"
    death_place = "San Diego, California, U.S."
    nationality = "American"
    occupation  = "Physicist, astronaut"
    known_for   = "First American woman in space"
>}}
  {{< infobox-row label="Spouse" value="Steven Hawley (m. 1982; div. 1987)" >}}
  {{< infobox-row label="Partner" value="Tam O'Shaughnessy (1985–2012)" >}}
  {{< infobox-row label="Education" value="Swarthmore College; UCLA (BA, BS); Stanford University (MS, PhD)" >}}
  {{< infobox-section title="Space career" >}}
    {{< infobox-row label="Time in space" value="14d 7h 46m" >}}
    {{< infobox-row label="Selection" value="NASA Group 8 (1978)" >}}
    {{< infobox-row label="Missions" value="STS-7, STS-41-G" >}}
    {{< infobox-row label="Mission insignia" value="[STS-7 patch](sts-7-patch.svg), [STS-41-G patch](sts-41g-patch.svg)" >}}
    {{< infobox-row label="Retirement" value="15 August 1987" >}}
  {{< /infobox-section >}}
  {{< infobox-row label="Awards" value="Presidential Medal of Freedom (2013, posthumous)" >}}
{{< /person >}}
```

Notes on the workaround:

- **`{{< infobox-section title="Space career" >}}`** is used to group
  the astronaut-specific rows under a section header matching the
  upstream `**Space career**` divider in the Sally Ride infobox.
- **`{{< infobox-row >}}` values are markdownified** (per
  [`docs/SHORTCODES.md` §6][shortcodes-6]) — the `value="[STS-7
  patch](sts-7-patch.svg)"` form produces a link, the way the upstream
  row would.
- **`Mission insignia` does not have a clean markdown-only solution.**
  The upstream row embeds thumbnails (`<img>` inside `<a>`); the
  workaround above degrades to inline links. An author who needs the
  visual treatment can drop in raw HTML inside the markdownified
  value, but a future PR should grow a dedicated `infobox-pair-mission-insignia`
  primitive (see Forward-looking below).
- **`Spouse` and `Partner` are two distinct upstream parameters** with
  different date-format conventions — `(m. YYYY; div. YYYY)` for
  spouse, `(YYYY–present)` for partner. The upstream explicitly
  distinguishes them and so should the future work; do not collapse
  them into one row.

### Forward-looking (future PR series)

Expand [`layouts/_shortcodes/person.html`][person] to accept these
named parameters; thread them through the wrapper's `$fields` slice so
they render through `layouts/_partials/infobox/base.html` as additional
entries. Concretely:

1. **`spouse`** and **`partner`** — most natural as a new
   `infobox-pair-*` primitive that wraps the `(Name, date-suffix)`
   shape, e.g. `infobox-pair-relationship` accepting a `name` and a
   `daterange`. The two labels (`Spouse` / `Partner`) could be passed
   as separate `label` values to the same primitive, or be picked up
   from the parameter name. Alternative: a generic `infobox-pair-name-with-dates`
   primitive that the `military-person` shortcode (which already accepts
   `spouse` per `docs/SHORTCODES.md` §10) can also adopt.
2. **`education`** — single-row case; the existing `infobox-row`
   primitive works, but the upstream behaviour is `alma_mater` /
   `education` precedence (one wins). A future wrapper can hoist the
   precedence into a conditional (`{{ or (.Get "education") (.Get "alma_mater") }}`)
   that mirrors the upstream template's logic.
3. **`missions`** — bulleted list with each entry linking to a mission
   article plus the dates and insignia. The upstream renders this as
   an `<ul>` inside a single infobox cell. A new
   `infobox-pair-mission-list` primitive that takes `missions` as a
   slice of dicts (or repeated `{{< mission >}}` child shortcodes)
   would model it; alternatively a generic `infobox-list` primitive
   with optional `link-template` and `separator` params.
4. **`mission_insignia`** — image-list row. As above, a new primitive
   (`infobox-pair-mission-insignia` or a generic `infobox-image-list`)
   is the cleanest fit; the inline-workaround Markdown above degrades
   gracefully but loses the visual.
5. **`time_in_space`**, **`selection`**, **`retirement`** — single-row
   cases; the existing `infobox-row` primitive works. The future
   wrapper can add them as plain `$fields` entries. `time_in_space`
   could optionally call a future `infobox-pair-duration` primitive
   that splits `14d 7h 46m` into `<span>` chunks for CSS styling.

Tracked separately. The lock-in decision §2 of the Sally Ride
replication spec records that **this gap is documented but the wrapper
is left as-is in the Sally Ride replication round**; the future PR
series is owned by whichever executor picks up flexible-field
implementation next.

---

[sally-ride-spec]: ../../.plans/research-2026-07-12/sally-ride-replication-spec.md
[sally-ride-research]: ../../.plans/research-2026-07-12/sally-ride-lightbox-and-elements.md
[person]: ../layouts/_shortcodes/person.html
[tpl-person]: https://en.wikipedia.org/wiki/Template:Infobox_person
[research-21]: RESEARCH.md#21-the-templateinfobox-metatemplate-in-our-own-words
[shortcodes-5]: SHORTCODES.md#5-layer-3--inner-primitives
[shortcodes-6]: SHORTCODES.md#6-css-hook-contract
[infobox-primitives]: shortcodes/infobox-primitives.md

---
title: "Person demo"
date: 2026-07-10
draft: false
summary: "Demonstrates the v2 {{</* infobox */>}} shortcode with the typical person schema."
categories: ["Infobox demos"]
---

Lead paragraph introducing the Person demo. This page exercises the v2
`{{</* infobox */>}}` outer shortcode with the typical schema for an
individual biography infobox: a main image, a sectioned body, and a
footer. See `docs/SHORTCODES.md` §2 for the full parameter list and
§3 for the authoring patterns.

{{< infobox type="person" title="Demo Person" body-class="vcard biography" >}}

{{< infobox-image src="/media/sample-image-1.png" caption="Sample portrait"
    alt="Sample portrait of demo person" upright="1" >}}

{{< infobox-section title="Personal" >}}{{</ infobox-section >}}
{{< infobox-row label="Born"        >}}1 January 1990{{</ infobox-row >}}
{{< infobox-row label="Birth place" >}}Demo City, Demo Country{{</ infobox-row >}}
{{< infobox-row label="Nationality" >}}Demo nationality{{</ infobox-row >}}

{{< infobox-section title="Career" >}}{{</ infobox-section >}}
{{< infobox-row label="Occupation"   >}}Demo occupation{{</ infobox-row >}}
{{< infobox-row label="Years active" >}}2015–present{{</ infobox-row >}}
{{< infobox-row label="Notable works" >}}Demo work one; demo work two{{</ infobox-row >}}

{{< infobox-section title="External links" >}}{{</ infobox-section >}}
{{< infobox-row label="Website" >}}[Example site](https://example.com){{</ infobox-row >}}

{{< infobox-below >}}Demonstration page using the v2 infobox family — see
`docs/SHORTCODES.md` §2 / §3 for the full API surface.{{</ infobox-below >}}

{{< /infobox >}}

Second paragraph with text that wraps around the floated infobox. The
infobox should appear on the right at desktop widths, and stack above
the content below the 1200px breakpoint; rows flip to stacked
label-above-data below 720px. Every v2 shortcode is paired-form-only
because Hugo's AST scanner inspects `.Inner` references at the template
top level — see the comment block at the top of
`layouts/_shortcodes/infobox-row.html`.

Third paragraph reinforcing that the text-wrap behaviour is the key
visual test for this demo page. Use the long-form Markdown content to
give the float-right layout enough body copy to actually wrap
meaningfully across a typical viewport width. The `body-class="vcard
biography"` on the outer infobox passes through to the root `<aside>`
so downstream microformat consumers see the same markup Wikipedia's
`Infobox person` template emits.

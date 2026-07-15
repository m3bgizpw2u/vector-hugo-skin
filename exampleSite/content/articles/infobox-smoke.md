---
title: "Infobox smoke test"
date: 2026-01-01
draft: false
summary: "Smoke-tests the new v2 infobox shortcodes; pairs at each level of nesting."
---

This article exercises the eight new shortcodes end-to-end. All `infobox-*`
shortcodes are invoked in PAIRED form because Hugo's AST scanner inspects
`.Inner` references inside shortcode templates (see
`layouts/_shortcodes/infobox-row.html`) and forces paired invocation when
`.Inner` is referenced — see `.cursor/rules/40-shortcodes.mdc`.

## Title-only infobox

{{< infobox type="custom" title="Plain infobox" >}}

{{< infobox-section >}}Section A{{</ infobox-section >}}

{{< infobox-row label="Field one" >}}First value{{</ infobox-row >}}
{{< infobox-row label="Field two" >}}Second value{{</ infobox-row >}}
{{< infobox-row label="Field three" >}}Third value{{</ infobox-row >}}

{{< infobox-section >}}Section B{{</ infobox-section >}}

{{< infobox-row label="Empty row" value="" >}}{{</ infobox-row >}}
{{< infobox-row label="Real row" value="Has data" >}}{{</ infobox-row >}}

{{< infobox-row-full >}}This row spans both columns — used for sourced citations,
credentials, or supporting paragraphs that benefit from full-width text
flow rather than the cramped two-column key/value layout.{{</ infobox-row-full >}}

{{< infobox-below >}}Footnote-style content goes here. **Markdown** works, [links
work](https://example.com).{{</ infobox-below >}}

{{</ infobox >}}

## Single-section, no header

{{< infobox type="custom" title="Compact infobox" >}}

{{< infobox-subheader >}}Key facts{{</ infobox-subheader >}}

{{< infobox-row label="Born" >}}11 March 1952{{</ infobox-row >}}

{{</ infobox >}}

## Embedded child

{{< infobox type="parent" title="Parent with embedded child" >}}

{{< infobox-row label="Note" >}}This infobox contains an embedded child.{{</ infobox-row >}}

{{< infobox child="true" type="custom" >}}

{{< infobox-subheader >}}Embedded subheader{{</ infobox-subheader >}}

{{< infobox-row label="Embedded field" >}}Embedded value{{</ infobox-row >}}

{{</ infobox >}}

{{</ infobox >}}

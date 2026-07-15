---
title: "Embedded subbox test"
date: 2026-01-01
draft: false
summary: "Tests `child` and `subbox` embedding parameters on the v2 infobox shortcode."
---

## Subbox embedding

A subbox is an infobox embedded in the data cell of an outer infobox row. It
re-uses the same `.infobox` design tokens but with no border styling.

{{< infobox type="outer" title="Article with subbox" >}}

{{< infobox-section >}}Cast{{</ infobox-section >}}

{{< infobox-row label="Key cast" >}}

{{< infobox subbox="true" type="custom" >}}

{{< infobox-row label="Ada Lovelace" >}}1815–1852{{</ infobox-row >}}
{{< infobox-row label="Charles Babbage" >}}1791–1871{{</ infobox-row >}}

{{</ infobox >}}

{{</ infobox-row >}}

{{</ infobox >}}

## Child embedding

A child is an infobox nested directly inside another infobox as a full-width
sub-section rather than in a data cell.

{{< infobox type="outer" title="Article with child" >}}

{{< infobox-section >}}Awards{{</ infobox-section >}}

{{< infobox child="true" type="award" title="Award details" >}}

{{< infobox-row label="Year" >}}1843{{</ infobox-row >}}

{{</ infobox >}}

{{</ infobox >}}

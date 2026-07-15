---
title: "Per-type infobox test"
date: 2026-01-01
draft: false
summary: "Exercises each `data-infobox-type` per-type override."
---

Each section uses a different `type=` value to exercise the per-type
CSS overrides in `infobox--per-type.scss`.

## Person (portrait image hint)

{{< infobox type="person" title="Ada Lovelace" >}}

{{< infobox-row label="Born" >}}1815-12-10, London{{</ infobox-row >}}

{{</ infobox >}}

## Film (dark header)

{{< infobox type="film" above="A 2014 biopic" title="The Imitation Game" >}}

{{< infobox-row label="Director" >}}Morten Tyldum{{</ infobox-row >}}

{{</ infobox >}}

## Software (tabular numerals)

{{< infobox type="software" title="Hugo" >}}

{{< infobox-row label="Latest version" >}}0.164.0 released 2026-07-06{{</ infobox-row >}}

{{</ infobox >}}

## Settlement (uppercase sections)

{{< infobox type="settlement" title="Springfield" >}}

{{< infobox-section >}}Geography{{</ infobox-section >}}

{{< infobox-row label="Country" >}}USA{{</ infobox-row >}}

{{</ infobox >}}

## Country (accent top border)

{{< infobox type="country" title="Example Country" >}}

{{< infobox-row label="Capital" >}}Exampleton{{</ infobox-row >}}

{{</ infobox >}}

## Organization (accent-colored header)

{{< infobox type="organization" above="An organization" title="Acme Corp" >}}

{{< infobox-row label="Founded" >}}1985{{</ infobox-row >}}

{{</ infobox >}}

## Album (rounded image corners)

{{< infobox type="album" title="Sample Album" >}}

{{< infobox-row label="Released" >}}1985{{</ infobox-row >}}

{{</ infobox >}}

## Election (portrait hint)

{{< infobox type="election" title="Election 2024" >}}

{{< infobox-row label="Winner" >}}Candidate A{{</ infobox-row >}}

{{</ infobox >}}

## Custom (default)

{{< infobox type="custom" title="Plain infobox" >}}

{{< infobox-row label="Status" >}}No overrides.{{</ infobox-row >}}

{{</ infobox >}}

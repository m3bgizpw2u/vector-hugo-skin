---
title: "Freeform rows test"
date: 2026-01-01
draft: false
summary: "Tests markdown link rendering and lists in infobox data cells."
---

{{< infobox type="custom" title="Freeform rows" >}}

{{< infobox-row label="Inline link" >}}[Ada Lovelace](https://en.wikipedia.org/wiki/Ada_Lovelace) was a mathematician.{{</ infobox-row >}}

{{< infobox-row label="Emphasis" >}}*Important* information about the **subject**.{{</ infobox-row >}}

{{< infobox-row label="Multi-line" >}}First paragraph.

Second paragraph with another [link](https://example.com).{{</ infobox-row >}}

{{< infobox-section >}}Works{{</ infobox-section >}}

{{< infobox-row label="Notable works" >}}
- *The Pleasure of Finding Things Out* (1999)
- *Genius: The Life and Science of Richard Feynman* (1992)
- *Surely You're Joking, Mr. Feynman!* (1985)
{{</ infobox-row >}}

{{</ infobox >}}

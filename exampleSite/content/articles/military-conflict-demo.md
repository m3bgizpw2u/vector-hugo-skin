---
title: "Military conflict demo"
date: 2026-07-10
draft: false
summary: "Demonstrates the {{< military-conflict >}} infobox shortcode."
categories: ["Infobox demos"]
---

Lead paragraph introducing the Military conflict demo. This page exercises the military-conflict shortcode with representative parameters for a battle or war infobox.

{{< military-conflict
    name        = "Demo Engagement"
    part_of     = "Demo War"
    date_start  = "1 July 1900"
    date_end    = "3 July 1900"
    place       = "Demo Region"
    result      = "Demo outcome"
    combatant1  = "Demo Federation"
    combatant2  = "Demo Republic"
    commander1  = "Demo General A"
    commander2  = "Demo General B"
    strength1   = "50,000"
    strength2   = "40,000"
    casualties1 = "5,000"
    casualties2 = "7,000"
>}}{{< /military-conflict >}}

Second paragraph with text that wraps around the floated infobox. The infobox should appear on the right at desktop widths, and stack above the content below the mobile breakpoint. Each demo is in paired form because Phase 8 requires paired form for named wrappers that reference `.Inner`.

Third paragraph reinforcing that the text-wrap behavior is the key visual test for this demo page. Use the long-form Markdown content to give the float-right layout enough body copy to actually wrap meaningfully across a typical viewport width.
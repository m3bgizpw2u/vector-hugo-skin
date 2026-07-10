---
title: "Ice hockey biography demo"
date: 2026-07-10
draft: false
summary: "Demonstrates the {{< ice-hockey-biography >}} infobox shortcode."
categories: ["Infobox demos"]
---

Lead paragraph introducing the Ice hockey biography demo. This page exercises the ice-hockey-biography shortcode with representative parameters for a hockey player biography infobox.

{{< ice-hockey-biography
    name          = "Demo Skater"
    image         = "placeholder.jpg"
    caption       = "Sample player photo"
    birth_date    = "20 January 1996"
    birth_place   = "Demo City"
    height        = "185"
    weight        = "82"
    position      = "Center"
    shoots        = "Left"
    played_for    = "Demo Bears, Demo Wolves"
    national_team = "Demo Country"
    draft_year    = "2014"
    draft_team    = "Demo Wolves"
    draft_round   = "1"
    draft_pick    = "3"
    career_start  = "2014"
>}}{{< /ice-hockey-biography >}}

Second paragraph with text that wraps around the floated infobox. The infobox should appear on the right at desktop widths, and stack above the content below the mobile breakpoint. Each demo is in paired form because Phase 8 requires paired form for named wrappers that reference `.Inner`.

Third paragraph reinforcing that the text-wrap behavior is the key visual test for this demo page. Use the long-form Markdown content to give the float-right layout enough body copy to actually wrap meaningfully across a typical viewport width.
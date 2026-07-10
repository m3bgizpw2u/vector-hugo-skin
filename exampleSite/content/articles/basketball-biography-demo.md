---
title: "Basketball biography demo"
date: 2026-07-10
draft: false
summary: "Demonstrates the {{< basketball-biography >}} infobox shortcode."
categories: ["Infobox demos"]
---

Lead paragraph introducing the Basketball biography demo. This page exercises the basketball-biography shortcode with representative parameters for a basketball player biography infobox.

{{< basketball-biography
    name          = "Demo Center"
    image         = "placeholder.jpg"
    caption       = "Sample player photo"
    birth_date    = "10 March 1992"
    birth_place   = "Demo City"
    nationality   = "Demo nationality"
    height        = "2.05"
    position      = "Center"
    jersey_number = "12"
    college       = "Demo University"
    draft_year    = "2014"
    draft_round   = "1"
    draft_pick    = "5"
    draft_team    = "Demo Squad"
    career_start  = "2014"
    career_end    = "2024"
    hall_of_fame  = ""
>}}{{< /basketball-biography >}}

Second paragraph with text that wraps around the floated infobox. The infobox should appear on the right at desktop widths, and stack above the content below the mobile breakpoint. Each demo is in paired form because Phase 8 requires paired form for named wrappers that reference `.Inner`.

Third paragraph reinforcing that the text-wrap behavior is the key visual test for this demo page. Use the long-form Markdown content to give the float-right layout enough body copy to actually wrap meaningfully across a typical viewport width.
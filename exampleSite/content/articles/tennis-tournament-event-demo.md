---
title: "Tennis tournament event demo"
date: 2026-07-10
draft: false
summary: "Demonstrates the {{< tennis-tournament-event >}} infobox shortcode."
categories: ["Infobox demos"]
---

Lead paragraph introducing the Tennis tournament event demo. This page exercises the tennis-tournament-event shortcode with representative parameters for a single tennis event infobox.

{{< tennis-tournament-event
    name        = "Sample Open Final 2025"
    tournament  = "Sample Open"
    tour        = "Demo Tour"
    type        = "Outdoor"
    category    = "Demo category"
    draw        = "64S / 32Q"
    surface     = "Hard"
    location    = "Demo City"
    venue       = "Demo Tennis Center"
    date        = "15 March 2025"
    champ_name  = "Demo Champion"
    runner_name = "Demo Runner"
    score       = "6–4, 6–3"
    prize_money = "US$1,000,000"
>}}{{< /tennis-tournament-event >}}

Second paragraph with text that wraps around the floated infobox. The infobox should appear on the right at desktop widths, and stack above the content below the mobile breakpoint. Each demo is in paired form because Phase 8 requires paired form for named wrappers that reference `.Inner`.

Third paragraph reinforcing that the text-wrap behavior is the key visual test for this demo page. Use the long-form Markdown content to give the float-right layout enough body copy to actually wrap meaningfully across a typical viewport width.
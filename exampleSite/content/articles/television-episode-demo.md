---
title: "Television episode demo"
date: 2026-07-10
draft: false
summary: "Demonstrates the {{< television-episode >}} infobox shortcode."
categories: ["Infobox demos"]
---

Lead paragraph introducing the Television episode demo. This page exercises the television-episode shortcode with representative parameters for a single TV episode infobox.

{{< television-episode
    name           = "Sample Episode"
    series         = "Sample Series"
    image          = "placeholder.jpg"
    season         = "2"
    episode        = "5"
    director       = "Demo Director"
    writer         = "Demo Writer"
    starring       = "Demo Actor One, Demo Actor Two"
    airdate        = "15 March 2025"
    production_code = "S02E05"
    runtime        = "44"
    network        = "Demo Network"
>}}{{< /television-episode >}}

Second paragraph with text that wraps around the floated infobox. The infobox should appear on the right at desktop widths, and stack above the content below the mobile breakpoint. Each demo is in paired form because Phase 8 requires paired form for named wrappers that reference `.Inner`.

Third paragraph reinforcing that the text-wrap behavior is the key visual test for this demo page. Use the long-form Markdown content to give the float-right layout enough body copy to actually wrap meaningfully across a typical viewport width.
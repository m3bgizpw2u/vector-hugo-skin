---
title: "Television season demo"
date: 2026-07-10
draft: false
summary: "Demonstrates the {{< television-season >}} infobox shortcode."
categories: ["Infobox demos"]
---

Lead paragraph introducing the Television season demo. This page exercises the television-season shortcode with representative parameters for a single TV season infobox.

{{< television-season
    name           = "Sample Series — Season 2"
    series_name    = "Sample Series"
    image          = "/media/sample-image-1.png"
    season_number  = "2"
    num_episodes   = "10"
    starring       = "Demo Actor One, Demo Actor Two"
    country        = "Demo Country"
    network        = "Demo Network"
    first_aired    = "1 March 2025"
    last_aired     = "15 May 2025"
>}}{{< /television-season >}}

Second paragraph with text that wraps around the floated infobox. The infobox should appear on the right at desktop widths, and stack above the content below the mobile breakpoint. Each demo is in paired form because Phase 8 requires paired form for named wrappers that reference `.Inner`.

Third paragraph reinforcing that the text-wrap behavior is the key visual test for this demo page. Use the long-form Markdown content to give the float-right layout enough body copy to actually wrap meaningfully across a typical viewport width.
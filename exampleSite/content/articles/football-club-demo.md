---
title: "Football club demo"
date: 2026-07-10
draft: false
summary: "Demonstrates the {{< football-club >}} infobox shortcode."
categories: ["Infobox demos"]
---

Lead paragraph introducing the Football club demo. This page exercises the football-club shortcode with representative parameters for a football (soccer) club infobox.

{{< football-club
    name      = "Sample United"
    logo      = "placeholder.jpg"
    full_name = "Sample United Football Club"
    nickname  = "The Samples"
    founded   = "1878"
    ground    = "Demo Stadium"
    capacity  = "50,000"
    owner     = "Demo Holdings"
    chairman  = "Demo Chair"
    manager   = "Demo Manager"
    league    = "Demo Premier League"
    season    = "2025–26"
    website   = "https://example.com"
>}}{{< /football-club >}}

Second paragraph with text that wraps around the floated infobox. The infobox should appear on the right at desktop widths, and stack above the content below the mobile breakpoint. Each demo is in paired form because Phase 8 requires paired form for named wrappers that reference `.Inner`.

Third paragraph reinforcing that the text-wrap behavior is the key visual test for this demo page. Use the long-form Markdown content to give the float-right layout enough body copy to actually wrap meaningfully across a typical viewport width.
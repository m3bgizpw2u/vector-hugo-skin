---
title: "Settlement demo"
date: 2026-07-10
draft: false
summary: "Demonstrates the {{< settlement >}} infobox shortcode."
categories: ["Infobox demos"]
---

Lead paragraph introducing the Settlement demo. This page exercises the settlement shortcode with representative parameters for a city or town infobox.

{{< settlement
    name            = "Sample Town"
    image           = "/media/sample-image-1.png"
    caption         = "Downtown Sample Town"
    country         = "Demo Country"
    subdivision_name1 = "Demo Region"
    subdivision_type1 = "Region"
    population_total = "42,000"
    population_as_of = "2025"
    area_total_km2  = "12.5"
    established_date1 = "1875"
    leader_title    = "Mayor"
    leader_name     = "Demo Person"
    timezone        = "UTC+0"
    website         = "https://example.com"
>}}{{< /settlement >}}

Second paragraph with text that wraps around the floated infobox. The infobox should appear on the right at desktop widths, and stack above the content below the mobile breakpoint. Each demo is in paired form because Phase 8 requires paired form for named wrappers that reference `.Inner`.

Third paragraph reinforcing that the text-wrap behavior is the key visual test for this demo page. Use the long-form Markdown content to give the float-right layout enough body copy to actually wrap meaningfully across a typical viewport width.
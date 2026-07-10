---
title: "Protected area demo"
date: 2026-07-10
draft: false
summary: "Demonstrates the {{< protected-area >}} infobox shortcode."
categories: ["Infobox demos"]
---

Lead paragraph introducing the Protected area demo. This page exercises the protected-area shortcode with representative parameters for a national park or protected-area infobox.

{{< protected-area
    name            = "Sample Reserve"
    image           = "placeholder.jpg"
    location        = "Demo Region"
    nearest_city    = "Demo City"
    coordinates     = "0.0000°N 0.0000°E"
    area            = "500 km²"
    established     = "1 January 1975"
    visitation_num  = "100,000"
    visitation_year = "2024"
    governing_body  = "Demo Authority"
    iucn_category   = "II (national park)"
    designation     = "Demo designation"
    website         = "https://example.com"
>}}{{< /protected-area >}}

Second paragraph with text that wraps around the floated infobox. The infobox should appear on the right at desktop widths, and stack above the content below the mobile breakpoint. Each demo is in paired form because Phase 8 requires paired form for named wrappers that reference `.Inner`.

Third paragraph reinforcing that the text-wrap behavior is the key visual test for this demo page. Use the long-form Markdown content to give the float-right layout enough body copy to actually wrap meaningfully across a typical viewport width.
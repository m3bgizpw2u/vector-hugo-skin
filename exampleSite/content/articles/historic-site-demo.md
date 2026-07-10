---
title: "Historic site demo"
date: 2026-07-10
draft: false
summary: "Demonstrates the {{< historic-site >}} infobox shortcode."
categories: ["Infobox demos"]
---

Lead paragraph introducing the Historic site demo. This page exercises the historic-site shortcode (the canonical alias for the National Register of Historic Places infobox) with representative parameters.

{{< historic-site
    name        = "Sample Landmark"
    image       = "placeholder.jpg"
    caption     = "Sample landmark photo"
    location    = "100 Demo Street"
    nearest_city = "Demo City"
    coordinates = "0.0000°N 0.0000°E"
    area        = "2 acres"
    built       = "1905"
    architect   = "Demo Architect"
    architecture = "Demo style"
    added       = "15 June 1980"
    NRHP_ref    = "00000000"
    governing_body = "Demo Authority"
>}}{{< /historic-site >}}

Second paragraph with text that wraps around the floated infobox. The infobox should appear on the right at desktop widths, and stack above the content below the mobile breakpoint. Each demo is in paired form because Phase 8 requires paired form for named wrappers that reference `.Inner`.

Third paragraph reinforcing that the text-wrap behavior is the key visual test for this demo page. Use the long-form Markdown content to give the float-right layout enough body copy to actually wrap meaningfully across a typical viewport width.
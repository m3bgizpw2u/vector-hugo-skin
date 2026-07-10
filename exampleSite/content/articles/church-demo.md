---
title: "Church demo"
date: 2026-07-10
draft: false
summary: "Demonstrates the {{< church >}} infobox shortcode."
categories: ["Infobox demos"]
---

Lead paragraph introducing the Church demo. This page exercises the church shortcode with representative parameters for a church or religious building infobox.

{{< church
    name               = "Sample Cathedral"
    image              = "placeholder.jpg"
    caption            = "Sample cathedral photo"
    dedication         = "Demo saint"
    denomination       = "Demo denomination"
    location           = "Demo City"
    country            = "Demo Country"
    coordinates        = "0.0000°N 0.0000°E"
    architecture_style = "Demo style"
    founded            = "1820"
    completed          = "1880"
    capacity           = "800"
    length             = "80 m"
    website            = "https://example.com"
>}}{{< /church >}}

Second paragraph with text that wraps around the floated infobox. The infobox should appear on the right at desktop widths, and stack above the content below the mobile breakpoint. Each demo is in paired form because Phase 8 requires paired form for named wrappers that reference `.Inner`.

Third paragraph reinforcing that the text-wrap behavior is the key visual test for this demo page. Use the long-form Markdown content to give the float-right layout enough body copy to actually wrap meaningfully across a typical viewport width.
---
title: "Political party demo"
date: 2026-07-10
draft: false
summary: "Demonstrates the {{< political-party >}} infobox shortcode."
categories: ["Infobox demos"]
---

Lead paragraph introducing the Political party demo. This page exercises the political-party shortcode with representative parameters for a political party infobox.

{{< political-party
    name         = "Sample Party"
    logo         = "/media/sample-image-2.png"
    abbreviation = "SP"
    leader       = "Demo Leader"
    founder      = "Demo Founder"
    founded      = "1990"
    headquarters = "Demo City"
    country      = "Demo Country"
    ideology     = "Demo ideology"
    position     = "Centre"
    colors       = "Demo blue"
    seats1       = "50"
    seats2       = "12"
    website      = "https://example.com"
>}}{{< /political-party >}}

Second paragraph with text that wraps around the floated infobox. The infobox should appear on the right at desktop widths, and stack above the content below the mobile breakpoint. Each demo is in paired form because Phase 8 requires paired form for named wrappers that reference `.Inner`.

Third paragraph reinforcing that the text-wrap behavior is the key visual test for this demo page. Use the long-form Markdown content to give the float-right layout enough body copy to actually wrap meaningfully across a typical viewport width.
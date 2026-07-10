---
title: "Station demo"
date: 2026-07-10
draft: false
summary: "Demonstrates the {{< station >}} infobox shortcode."
categories: ["Infobox demos"]
---

Lead paragraph introducing the Station demo. This page exercises the station shortcode with representative parameters for a railway or transit station infobox.

{{< station
    name        = "Sample Central"
    native_name = "Demo Central"
    address     = "1 Demo Avenue"
    country     = "Demo Country"
    coordinates = "0.0000°N 0.0000°E"
    line        = "Demo main line"
    connections = "Demo branch line"
    platforms   = "6"
    tracks      = "8"
    structure   = "At-grade"
    opened      = "1 January 1900"
    code        = "DMO"
    operator    = "Demo Rail"
>}}{{< /station >}}

Second paragraph with text that wraps around the floated infobox. The infobox should appear on the right at desktop widths, and stack above the content below the mobile breakpoint. Each demo is in paired form because Phase 8 requires paired form for named wrappers that reference `.Inner`.

Third paragraph reinforcing that the text-wrap behavior is the key visual test for this demo page. Use the long-form Markdown content to give the float-right layout enough body copy to actually wrap meaningfully across a typical viewport width.
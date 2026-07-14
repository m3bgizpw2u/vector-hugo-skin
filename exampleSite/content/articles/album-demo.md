---
title: "Album demo"
date: 2026-07-10
draft: false
summary: "Demonstrates the {{< album >}} infobox shortcode."
categories: ["Infobox demos"]
tags: ["music", "demo", "infobox"]
---

Lead paragraph introducing the Album demo. This page exercises the album infobox shortcode with representative parameters for a music album infobox.

{{< album
    name      = "Sample Album"
    type      = "Studio"
    artist    = "Demo Artist"
    cover     = "/media/sample-image-2.png"
    released  = "15 March 2025"
    recorded  = "2024"
    studio    = "Demo Studios"
    genre     = "Demo genre"
    length    = "42:00"
    label     = "Demo Records"
    producer  = "Demo Producer"
    tracks    = "12"
    total_length = "42:00"
>}}{{< /album >}}

Second paragraph with text that wraps around the floated infobox. The infobox should appear on the right at desktop widths, and stack above the content below the mobile breakpoint. Each demo is in paired form because Phase 8 requires paired form for named wrappers that reference `.Inner`.

Third paragraph reinforcing that the text-wrap behavior is the key visual test for this demo page. Use the long-form Markdown content to give the float-right layout enough body copy to actually wrap meaningfully across a typical viewport width.
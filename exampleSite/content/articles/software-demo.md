---
title: "Software demo"
date: 2026-07-10
draft: false
summary: "Demonstrates the {{< software >}} infobox shortcode."
categories: ["Infobox demos"]
---

Lead paragraph introducing the Software demo. This page exercises the software shortcode with representative parameters for a software application infobox.

{{< software
    name                = "Demo Software"
    logo                = "/media/sample-image-2.png"
    developer           = "Demo Software Foundation"
    initial_release     = "2020"
    latest_release      = "1.0.0"
    latest_release_date = "15 March 2025"
    status              = "Active"
    operating_system    = "Cross-platform"
    platform            = "Linux, macOS, Windows"
    genre               = "Demo category"
    license             = "MIT"
    source_model        = "Open-source"
    programming_language = "Go"
    website             = "https://example.com"
>}}{{< /software >}}

Second paragraph with text that wraps around the floated infobox. The infobox should appear on the right at desktop widths, and stack above the content below the mobile breakpoint. Each demo is in paired form because Phase 8 requires paired form for named wrappers that reference `.Inner`.

Third paragraph reinforcing that the text-wrap behavior is the key visual test for this demo page. Use the long-form Markdown content to give the float-right layout enough body copy to actually wrap meaningfully across a typical viewport width.
---
title: "Video game demo"
date: 2026-07-10
draft: false
summary: "Demonstrates the {{< video-game >}} infobox shortcode."
categories: ["Infobox demos"]
---

Lead paragraph introducing the Video game demo. This page exercises the video-game shortcode with representative parameters for a video game infobox.

{{< video-game
    name                = "Sample Game"
    cover_art           = "/media/sample-image-1.png"
    developer           = "Demo Studio"
    publisher           = "Demo Publisher"
    director            = "Demo Director"
    composer            = "Demo Composer"
    engine              = "Demo Engine"
    platform            = "Windows, macOS, Linux"
    initial_release_date = "1 June 2024"
    latest_release      = "1.0.2"
    genre               = "Demo genre"
    modes               = "Single-player"
    status              = "Released"
    website             = "https://example.com"
>}}{{< /video-game >}}

Second paragraph with text that wraps around the floated infobox. The infobox should appear on the right at desktop widths, and stack above the content below the mobile breakpoint. Each demo is in paired form because Phase 8 requires paired form for named wrappers that reference `.Inner`.

Third paragraph reinforcing that the text-wrap behavior is the key visual test for this demo page. Use the long-form Markdown content to give the float-right layout enough body copy to actually wrap meaningfully across a typical viewport width.
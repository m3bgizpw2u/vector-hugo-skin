---
title: "Television demo"
date: 2026-07-10
draft: false
summary: "Demonstrates the {{< television >}} infobox shortcode."
categories: ["Infobox demos"]
---

Lead paragraph introducing the Television demo. This page exercises the television shortcode with representative parameters for a TV show infobox.

{{< television
    name             = "Sample Series"
    image            = "placeholder.jpg"
    caption          = "Sample series poster"
    genre            = "Drama"
    creator          = "Demo Creator"
    starring         = "Demo Actor One, Demo Actor Two"
    music            = "Demo Composer"
    country_of_origin = "Demo Country"
    num_seasons      = "3"
    num_episodes     = "30"
    network          = "Demo Network"
    first_aired      = "1 March 2020"
    last_aired       = "present"
>}}{{< /television >}}

Second paragraph with text that wraps around the floated infobox. The infobox should appear on the right at desktop widths, and stack above the content below the mobile breakpoint. Each demo is in paired form because Phase 8 requires paired form for named wrappers that reference `.Inner`.

Third paragraph reinforcing that the text-wrap behavior is the key visual test for this demo page. Use the long-form Markdown content to give the float-right layout enough body copy to actually wrap meaningfully across a typical viewport width.
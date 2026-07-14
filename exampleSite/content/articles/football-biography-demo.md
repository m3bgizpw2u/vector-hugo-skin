---
title: "Football biography demo"
date: 2026-07-10
draft: false
summary: "Demonstrates the {{< football-biography >}} infobox shortcode."
categories: ["Infobox demos"]
---

Lead paragraph introducing the Football biography demo. This page exercises the football-biography shortcode with representative parameters for a football (soccer) player biography infobox.

{{< football-biography
    name          = "Demo Player"
    image         = "/media/sample-image-portrait.png"
    caption       = "Sample action photo"
    full_name     = "Demo Full Name"
    birth_date    = "5 June 1995"
    birth_place   = "Demo City, Demo Country"
    height        = "1.80"
    position      = "Forward"
    current_club  = "Demo FC"
    years         = "2014–present"
    clubs         = "Demo FC, Sample United"
    nationalyears = "2016–present"
    nationalteam  = "Demo National Team"
    nationalcaps  = "55"
    nationalgoals = "12"
>}}{{< /football-biography >}}

Second paragraph with text that wraps around the floated infobox. The infobox should appear on the right at desktop widths, and stack above the content below the mobile breakpoint. Each demo is in paired form because Phase 8 requires paired form for named wrappers that reference `.Inner`.

Third paragraph reinforcing that the text-wrap behavior is the key visual test for this demo page. Use the long-form Markdown content to give the float-right layout enough body copy to actually wrap meaningfully across a typical viewport width.
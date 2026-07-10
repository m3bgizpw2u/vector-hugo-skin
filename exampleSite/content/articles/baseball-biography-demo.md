---
title: "Baseball biography demo"
date: 2026-07-10
draft: false
summary: "Demonstrates the {{< baseball-biography >}} infobox shortcode."
categories: ["Infobox demos"]
---

Lead paragraph introducing the Baseball biography demo. This page exercises the baseball-biography shortcode with representative parameters for a baseball player biography infobox.

{{< baseball-biography
    name        = "Demo Batter"
    image       = "placeholder.jpg"
    caption     = "Sample player photo"
    birth_date  = "15 April 1988"
    birth_place = "Demo City"
    bats        = "Right"
    throws      = "Right"
    debut       = "1 April 2010"
    final_game  = "30 September 2020"
    position    = "Outfielder"
    team        = "Demo Cubs"
    teams       = "Demo Cubs, Demo Sox"
    hall_of_fame = ""
>}}{{< /baseball-biography >}}

Second paragraph with text that wraps around the floated infobox. The infobox should appear on the right at desktop widths, and stack above the content below the mobile breakpoint. Each demo is in paired form because Phase 8 requires paired form for named wrappers that reference `.Inner`.

Third paragraph reinforcing that the text-wrap behavior is the key visual test for this demo page. Use the long-form Markdown content to give the float-right layout enough body copy to actually wrap meaningfully across a typical viewport width.
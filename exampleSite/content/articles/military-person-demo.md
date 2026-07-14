---
title: "Military person demo"
date: 2026-07-10
draft: false
summary: "Demonstrates the {{< military-person >}} infobox shortcode."
categories: ["Infobox demos"]
---

Lead paragraph introducing the Military person demo. This page exercises the military-person shortcode with representative parameters for a service-member biography infobox.

{{< military-person
    name          = "Demo Soldier"
    image         = "/media/sample-image-portrait.png"
    caption       = "Sample portrait"
    birth_date    = "1 January 1970"
    birth_place   = "Demo City"
    death_date    = ""
    allegiance    = "Demo Country"
    branch        = "Demo Army"
    service_years = "1990–2015"
    rank          = "Colonel"
    unit          = "Demo Regiment"
    battles       = "Demo conflict"
    awards        = "Demo Medal of Honor"
>}}{{< /military-person >}}

Second paragraph with text that wraps around the floated infobox. The infobox should appear on the right at desktop widths, and stack above the content below the mobile breakpoint. Each demo is in paired form because Phase 8 requires paired form for named wrappers that reference `.Inner`.

Third paragraph reinforcing that the text-wrap behavior is the key visual test for this demo page. Use the long-form Markdown content to give the float-right layout enough body copy to actually wrap meaningfully across a typical viewport width.
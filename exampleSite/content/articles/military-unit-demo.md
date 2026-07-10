---
title: "Military unit demo"
date: 2026-07-10
draft: false
summary: "Demonstrates the {{< military-unit >}} infobox shortcode."
categories: ["Infobox demos"]
---

Lead paragraph introducing the Military unit demo. This page exercises the military-unit shortcode with representative parameters for a military unit infobox.

{{< military-unit
    name        = "Sample Regiment"
    image       = "placeholder.jpg"
    start_date  = "1 January 1940"
    end_date    = ""
    country     = "Demo Country"
    allegiance  = "Demo Federation"
    branch      = "Demo Army"
    type        = "Infantry"
    role        = "Demo role"
    garrison    = "Demo Base"
    nickname    = "Demo Wolves"
    motto       = "Demo unit motto"
    commander   = "Demo Brigadier"
    website     = "https://example.com"
>}}{{< /military-unit >}}

Second paragraph with text that wraps around the floated infobox. The infobox should appear on the right at desktop widths, and stack above the content below the mobile breakpoint. Each demo is in paired form because Phase 8 requires paired form for named wrappers that reference `.Inner`.

Third paragraph reinforcing that the text-wrap behavior is the key visual test for this demo page. Use the long-form Markdown content to give the float-right layout enough body copy to actually wrap meaningfully across a typical viewport width.
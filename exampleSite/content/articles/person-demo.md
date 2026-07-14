---
title: "Person demo"
date: 2026-07-10
draft: false
summary: "Demonstrates the {{< person >}} infobox shortcode."
categories: ["Infobox demos"]
---

Lead paragraph introducing the Person demo. This page exercises the person shortcode with representative parameters for an individual biography infobox.

{{< person
    name          = "Demo Person"
    image         = "/media/sample-image-portrait.png"
    caption       = "Sample portrait"
    alt           = "Sample portrait of demo person"
    birth_date    = "1 January 1990"
    birth_place   = "Demo City, Demo Country"
    death_date    = ""
    nationality   = "Demo nationality"
    occupation    = "Demo occupation"
    years_active  = "2015–present"
    notable_works = "Demo work one; demo work two"
    website       = "https://example.com"
>}}{{< /person >}}

Second paragraph with text that wraps around the floated infobox. The infobox should appear on the right at desktop widths, and stack above the content below the mobile breakpoint. Each demo is in paired form because Phase 8 requires paired form for named wrappers that reference `.Inner`.

Third paragraph reinforcing that the text-wrap behavior is the key visual test for this demo page. Use the long-form Markdown content to give the float-right layout enough body copy to actually wrap meaningfully across a typical viewport width.
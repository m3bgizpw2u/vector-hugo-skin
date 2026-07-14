---
title: "Organization demo"
date: 2026-07-10
draft: false
summary: "Demonstrates the {{< organization >}} infobox shortcode."
categories: ["Infobox demos"]
---

Lead paragraph introducing the Organization demo. This page exercises the organization shortcode with representative parameters for a non-governmental organization infobox.

{{< organization
    name                = "Sample Foundation"
    logo                = "/media/sample-image-2.png"
    type                = "Non-profit"
    industry            = "Demo sector"
    founded             = "1 January 2005"
    founder             = "Demo Founder"
    hq_location         = "Demo City"
    hq_location_country = "Demo Country"
    area_served         = "Worldwide"
    members             = "5,000"
    employees           = "40"
    key_people          = "Demo Director"
    website             = "https://example.com"
>}}{{< /organization >}}

Second paragraph with text that wraps around the floated infobox. The infobox should appear on the right at desktop widths, and stack above the content below the mobile breakpoint. Each demo is in paired form because Phase 8 requires paired form for named wrappers that reference `.Inner`.

Third paragraph reinforcing that the text-wrap behavior is the key visual test for this demo page. Use the long-form Markdown content to give the float-right layout enough body copy to actually wrap meaningfully across a typical viewport width.
---
title: "Award demo"
date: 2026-07-10
draft: false
summary: "Demonstrates the {{< award >}} infobox shortcode."
categories: ["Infobox demos"]
tags: ["award", "demo", "infobox", "recognition"]
---

Lead paragraph introducing the Award demo. This page exercises the award shortcode with representative parameters for a prize or recognition infobox.

{{< award
    name          = "Sample Prize"
    image         = "/media/sample-image-1.png"
    awarded_for   = "Demo excellence"
    presenter     = "Demo Academy"
    country       = "Demo Country"
    location      = "Demo City"
    established   = "1 January 1995"
    first_awarded = "1995"
    total         = "30 (annual)"
    website       = "https://example.com"
>}}{{< /award >}}

Second paragraph with text that wraps around the floated infobox. The infobox should appear on the right at desktop widths, and stack above the content below the mobile breakpoint. Each demo is in paired form because Phase 8 requires paired form for named wrappers that reference `.Inner`.

Third paragraph reinforcing that the text-wrap behavior is the key visual test for this demo page. Use the long-form Markdown content to give the float-right layout enough body copy to actually wrap meaningfully across a typical viewport width.
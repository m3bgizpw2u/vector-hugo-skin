---
title: "University demo"
date: 2026-07-10
draft: false
summary: "Demonstrates the {{< university >}} infobox shortcode."
categories: ["Infobox demos"]
---

Lead paragraph introducing the University demo. This page exercises the university shortcode with representative parameters for a higher-education institution infobox.

{{< university
    name        = "Sample University"
    image       = "placeholder.jpg"
    motto       = "Demo university motto"
    established = "1850"
    type        = "Public research"
    president   = "Demo President"
    students    = "20,000"
    undergrad   = "15,000"
    postgrad    = "5,000"
    city        = "Demo City"
    state       = "Demo State"
    country     = "Demo Country"
    colors      = "Demo red and white"
    mascot      = "Demo Bear"
    nickname    = "Demo U"
    website     = "https://example.com"
>}}{{< /university >}}

Second paragraph with text that wraps around the floated infobox. The infobox should appear on the right at desktop widths, and stack above the content below the mobile breakpoint. Each demo is in paired form because Phase 8 requires paired form for named wrappers that reference `.Inner`.

Third paragraph reinforcing that the text-wrap behavior is the key visual test for this demo page. Use the long-form Markdown content to give the float-right layout enough body copy to actually wrap meaningfully across a typical viewport width.
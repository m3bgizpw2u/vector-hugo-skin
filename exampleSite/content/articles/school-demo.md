---
title: "School demo"
date: 2026-07-10
draft: false
summary: "Demonstrates the {{< school >}} infobox shortcode."
categories: ["Infobox demos"]
---

Lead paragraph introducing the School demo. This page exercises the school shortcode with representative parameters for a primary or secondary school infobox.

{{< school
    name        = "Sample Academy"
    image       = "placeholder.jpg"
    motto       = "Demo motto"
    established = "1900"
    type        = "Private"
    principal   = "Demo Principal"
    students    = "850"
    grades      = "K–12"
    nickname    = "Demo Eagles"
    mascot      = "Demo Eagle"
    colors      = "Blue and white"
    website     = "https://example.com"
>}}{{< /school >}}

Second paragraph with text that wraps around the floated infobox. The infobox should appear on the right at desktop widths, and stack above the content below the mobile breakpoint. Each demo is in paired form because Phase 8 requires paired form for named wrappers that reference `.Inner`.

Third paragraph reinforcing that the text-wrap behavior is the key visual test for this demo page. Use the long-form Markdown content to give the float-right layout enough body copy to actually wrap meaningfully across a typical viewport width.
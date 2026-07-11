---
title: "Film demo"
date: 2026-07-10
draft: false
summary: "Demonstrates the {{< film >}} infobox shortcode."
categories: ["Infobox demos"]
tags: ["film", "demo", "infobox", "entertainment"]
---

Lead paragraph introducing the Film demo. This page exercises the film shortcode with representative parameters for a movie infobox.

{{< film
    name        = "Sample Film"
    image       = "placeholder.jpg"
    caption     = "Sample film poster"
    director    = "Demo Director"
    producer    = "Demo Producer"
    writer      = "Demo Writer"
    starring    = "Demo Actor One, Demo Actor Two"
    music       = "Demo Composer"
    studio      = "Demo Studios"
    distributor = "Demo Distribution"
    released    = "15 March 2025"
    runtime     = "120"
    country     = "Demo Country"
    language    = "Demo Language"
    budget      = "50,000,000"
    gross       = "120,000,000"
    currency    = "USD"
>}}{{< /film >}}

Second paragraph with text that wraps around the floated infobox. The infobox should appear on the right at desktop widths, and stack above the content below the mobile breakpoint. Each demo is in paired form because Phase 8 requires paired form for named wrappers that reference `.Inner`.

Third paragraph reinforcing that the text-wrap behavior is the key visual test for this demo page. Use the long-form Markdown content to give the float-right layout enough body copy to actually wrap meaningfully across a typical viewport width.
---
title: "Company demo"
date: 2026-07-10
draft: false
summary: "Demonstrates the {{< company >}} infobox shortcode."
categories: ["Infobox demos"]
---

Lead paragraph introducing the Company demo. This page exercises the company shortcode with representative parameters for a corporate entity infobox.

{{< company
    name           = "Sample Company Inc."
    logo           = "placeholder.jpg"
    trade_name     = "Sample Co."
    type           = "Private"
    industry       = "Demo industry"
    founded        = "1 January 2000"
    founder        = "Demo Founder"
    hq_location    = "Demo City"
    hq_location_country = "Demo Country"
    num_employees  = "250"
    key_people     = "Demo CEO (CEO)"
    products       = "Demo product A; demo product B"
    revenue        = "US$10 million"
    owner          = "Demo Holding"
    website        = "https://example.com"
>}}{{< /company >}}

Second paragraph with text that wraps around the floated infobox. The infobox should appear on the right at desktop widths, and stack above the content below the mobile breakpoint. Each demo is in paired form because Phase 8 requires paired form for named wrappers that reference `.Inner`.

Third paragraph reinforcing that the text-wrap behavior is the key visual test for this demo page. Use the long-form Markdown content to give the float-right layout enough body copy to actually wrap meaningfully across a typical viewport width.
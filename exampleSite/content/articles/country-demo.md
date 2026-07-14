---
title: "Country demo"
date: 2026-07-10
draft: false
summary: "Demonstrates the {{< country >}} infobox shortcode."
categories: ["Infobox demos"]
---

Lead paragraph introducing the Country demo. This page exercises the country shortcode with representative parameters for a sovereign-state infobox.

{{< country
    name               = "Sample Republic"
    native_name        = "Demo Republic"
    image_flag         = "/media/sample-image-1.png"
    motto              = "Demo motto"
    capital            = "Demo Capital"
    largest_city       = "Demo Capital"
    official_languages = "Demo language"
    demonym            = "Demo people"
    government         = "Demo republic"
    leader_title1      = "President"
    leader_name1       = "Demo President"
    leader_title2      = "Prime Minister"
    leader_name2       = "Demo Prime Minister"
    sovereignty_type   = "Republic"
    established_event1 = "Independence"
    established_date1  = "1 January 1900"
    area_km2           = "100,000"
    population_estimate = "10,000,000"
    currency           = "Demo Dollar (DD)"
    timezone           = "UTC+0"
    calling_code       = "+000"
>}}{{< /country >}}

Second paragraph with text that wraps around the floated infobox. The infobox should appear on the right at desktop widths, and stack above the content below the mobile breakpoint. Each demo is in paired form because Phase 8 requires paired form for named wrappers that reference `.Inner`.

Third paragraph reinforcing that the text-wrap behavior is the key visual test for this demo page. Use the long-form Markdown content to give the float-right layout enough body copy to actually wrap meaningfully across a typical viewport width.
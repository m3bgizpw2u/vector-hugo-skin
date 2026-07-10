---
title: "Election demo"
date: 2026-07-10
draft: false
summary: "Demonstrates the {{< election >}} infobox shortcode."
categories: ["Infobox demos"]
---

Lead paragraph introducing the Election demo. This page exercises the election shortcode with representative parameters for an election infobox.

{{< election
    name            = "Sample General Election 2025"
    country         = "Demo Country"
    type            = "Parliamentary"
    ongoing         = "no"
    previous_election = "2021"
    next_election   = "2029"
    seats_for_election = "200"
    election_date   = "15 March 2025"
    turnout         = "65.0%"
    leader          = "Demo Leader A"
    party           = "Demo Party A"
    last_election   = "100 seats"
    seats_won       = "110"
    popular_vote    = "5,000,000"
    percentage      = "45.0%"
    swing           = "+2.0%"
    leader2         = "Demo Leader B"
    party2          = "Demo Party B"
    seats_won2      = "85"
>}}{{< /election >}}

Second paragraph with text that wraps around the floated infobox. The infobox should appear on the right at desktop widths, and stack above the content below the mobile breakpoint. Each demo is in paired form because Phase 8 requires paired form for named wrappers that reference `.Inner`.

Third paragraph reinforcing that the text-wrap behavior is the key visual test for this demo page. Use the long-form Markdown content to give the float-right layout enough body copy to actually wrap meaningfully across a typical viewport width.
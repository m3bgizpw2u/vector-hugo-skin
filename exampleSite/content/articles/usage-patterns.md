---
title: "Shortcode usage patterns"
date: 2026-07-11
draft: false
summary: "Walks through the basic, full-coverage, and `below`-footer usage patterns for any named shortcode — without touching inner primitives."
categories: ["Infobox demos", "Articles"]
tags: ["demo", "infobox", "patterns"]
---

This page demonstrates the **three canonical usage patterns** for any
named shortcode in the family: basic, full-coverage, and the
`below`-footer pattern. These are the patterns every author needs;
the inner-primitive escape hatch covered in
[`docs/shortcodes/infobox-primitives.md`](../../../docs/shortcodes/infobox-primitives.md)
builds on them.

The patterns are illustrated against `{{</* person */>}}`, but they
apply identically to every other named shortcode — only the parameter
names differ.

## Basic — title and a row or two

The shortest version that renders correctly: title plus the most
important rows. Use this shape for short articles where the full
schema would be overkill.

{{< person
    name        = "Ada Lovelace"
    birth_date  = "10 December 1815"
    birth_place = "London, England"
    occupation  = "Mathematician"
>}}{{< /person >}}

Absent rows are suppressed — passing `occupation = ""` (or omitting
the param entirely) leaves no empty row in the rendered output.

## Full — image, caption, alt, and below footer

When the article has a portrait or other image and additional context
worth highlighting, use the full-coverage version. The image block
uses the `image`, `caption`, and `alt` params. The `below` param
renders a freeform footer inside the box for footnotes or see-also
links.

{{< person
    name          = "Ada Lovelace"
    image         = "placeholder.jpg"
    caption       = "Portrait of Ada Lovelace, 1843"
    alt           = "Black-and-white portrait of Ada Lovelace"
    birth_date    = "10 December 1815"
    birth_place   = "London, England"
    death_date    = "27 November 1852"
    death_place   = "Marylebone, London"
    nationality   = "British"
    occupation    = "Mathematician, writer"
    years_active  = "1834–1852"
    known_for     = "First algorithm designed for processing on a computer"
    notable_works = "*Notes on the Analytical Engine*"
    website       = "https://example.com/ada-lovelace"
    below         = "**Source:** *Wikipedia, retrieved 2026-07-11.*"
>}}{{< /person >}}

The `below` text renders through `markdownify`, so inline emphasis
and links work inside it. The block sits at the bottom of the box,
full-width.

## Compose with other infoboxes

A long article can carry more than one infobox. Each renders
independently through the same base partial. At desktop widths they
float to the right of the prose, stacking vertically; at mobile widths
they stack above the body content.

### Country infobox

{{< country
    name      = "United Kingdom"
    capital   = "London"
    area_km2  = "242,495"
    population_estimate = "67,600,000"
    currency  = "Pound sterling (£) (GBP)"
>}}{{< /country >}}

### City infobox

{{< settlement
    name      = "London"
    country   = "United Kingdom"
    population_total = "8,961,989"
    area_total_km2  = "1,572"
>}}{{< /settlement >}}

Each wrapper emits its own `<aside class="infobox"
data-infobox-type="…">` so per-type SCSS rules from your own
stylesheet can target them individually.

## Citations — using `cite-ref` and `references`

The `cite-ref` / `references` pair reproduces Wikipedia's footnote
pattern from Markdown's native footnote syntax.

> Ada Lovelace is widely credited as the first computer programmer
> for her work on Charles Babbage's proposed Analytical Engine
> {{< cite-ref "lovelace1843" >}}. Her notes on the engine include
> what is recognised as the first algorithm intended to be processed
> by a machine {{< cite-ref "esa1990" >}}.

{{< references >}}

[^lovelace1843]: A. Lovelace, "Notes on the Analytical Engine", *Scientific Memoirs*, 1843.
[^esa1990]: E. A. Weiss, *A Computer Science Reader*. Springer, 1990.

Each `{{< cite-ref "key" >}}` marker renders as a small bracketed
superscript. The key must match a `[^key]: text` Markdown footnote
definition somewhere later in the article body. Numbering follows
first-citation document order.

## When you need fields the wrapper doesn't cover

When the named wrapper's fixed schema does not cover a field, the
inner-primitive escape hatch is the answer. Switch the wrapper to its
paired form and drop primitives (rows, sections, image blocks, the
footer block) directly inside `.Inner`. See
[`docs/shortcodes/infobox-primitives.md`](../../../docs/shortcodes/infobox-primitives.md)
for the five generic primitives and seven special-case pair
primitives, and
[`docs/shortcodes/person.md`](../../../docs/shortcodes/person.md) for
the `{{</* person */>}}` parameter reference.

## Adding a new shortcode

When you find yourself composing the same primitive combination
across multiple articles, that's the signal to add a new named
shortcode. The full workflow — folder structure, dual-license header,
the CSS hook contract — is in
[`docs/shortcodes/customizing.md`](../../../docs/shortcodes/customizing.md).

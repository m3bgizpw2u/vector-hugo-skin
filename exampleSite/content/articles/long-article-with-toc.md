---
title: "Long article with table of contents"
date: 2026-07-10
draft: false
summary: "Exercises the ToC scroll-spy and sidebar persistence on a long article."
categories: ["Articles"]
tags: ["demo", "toc", "scroll-spy"]
---

This fixture exercises every scrolling, sticky, and persistence behavior in the theme. It is intentionally long enough to require vertical scrolling on a desktop viewport, so the sticky header can show and hide, the table-of-contents scroll-spy can update, and the sidebar collapse state can be observed across reloads.

## Section A — Overview

This section introduces the demo content and the inline infobox. The body text below wraps around the floated infobox on desktop widths, giving the float-right layout enough copy to behave the way real articles do.

{{< person
    name        = "Demo Author"
    image       = "/media/sample-image-1.png"
    caption     = "Sample author portrait"
    birth_date  = "1 January 1980"
    birth_place = "Demo City"
    nationality = "Demo nationality"
    occupation  = "Demo occupation"
    website     = "https://example.com"
>}}{{< /person >}}

The infobox floats to the right of the prose on desktop widths. On narrow screens it collapses to a stacked layout above the lead continuation. This dual-state behavior is one of the most important responsive commitments of the theme.

{{< break >}}

## Section B — Background

Background context goes here. Three to five short paragraphs of invented content keep the article long enough to scroll meaningfully. The text intentionally has no Wikipedia verbatim material — every sentence is original prose invented for the demo.

The ToC panel to the right reflects the headings in this article. As you scroll, the heading nearest the top of the viewport gets an active class so the user can always see where they are in the document {{< cite-ref "tocScrollSpy" >}}.

## Section C — Approach

### Subsection C.1 — Inline shortcodes

This subsection shows that inner-primitive shortcodes can be dropped into the body of an article. The architecture decision was to keep them authorable directly in the Markdown body rather than via front matter or sidecar data files.

### Subsection C.2 — Two-column layout

The two-column layout — main content on the left and ToC on the right — is what gives Vector 2022 its distinctive look on desktop. On narrow screens, the ToC collapses back into the sticky header.

## Section D — Implementation notes

The implementation lives under `layouts/_shortcodes/` and `layouts/_partials/infobox/`. The shared base partial renders every named shortcode, while the named wrappers compose their parameter lists into the base partial's slot system.

## Section E — Future work

Future work for the example site is mostly about broadening the demo surface and adding Playwright coverage in Phase 10. The theme itself is feature-complete for the v1 contract documented in `docs/SHORTCODES.md`.

## Section F — Conclusion

This fixture is intentionally long so that scroll-spy, sticky-header, and sidebar-persistence behaviors all have a real page to operate on {{< cite-ref "stickyHeader-spec" >}}.

{{< references >}}

[^stickyHeader-spec]: Vector 2022 sticky-header behaviour and collapse animation.
[^tocScrollSpy]: Scroll-spy implementation for `.toc-panel` heading tracking.
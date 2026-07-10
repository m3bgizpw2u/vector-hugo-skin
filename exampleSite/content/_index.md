---
title: "Vector Hugo Skin — Demo Site"
description: "Demo of the vector-hugo-skin theme: a static Hugo reimplementation of Wikipedia's Vector 2022 skin, plus 30 MediaWiki-style infobox shortcodes."
---

The **vector-hugo-skin** theme re-implements Wikipedia's Vector 2022 skin as a
static Hugo theme, with a family of 30 MediaWiki-style named infobox
shortcodes (`person`, `settlement`, `film`, ...). This site is its built-in
smoke target — every article below renders through the real theme, with no
inline styles, no PHP, and no JavaScript framework runtime dependency.

Browse the **Articles** section in the sidebar for the full demo list, or jump
straight into one of the featured infoboxes below.

## Featured infoboxes

A representative slice of the 30 named shortcodes, each rendered against
original demo prose (no Wikipedia verbatim content):

- [Person]({{< ref "articles/person-demo.md" >}}) — the `person` wrapper with birth/death, occupation, and notable works.
- [Settlement]({{< ref "articles/settlement-demo.md" >}}) — the `settlement` wrapper with coordinates, population, and area.
- [Film]({{< ref "articles/film-demo.md" >}}) — the `film` wrapper with director, budget, gross, and the release pair primitive.
- [University]({{< ref "articles/university-demo.md" >}}) — the `university` wrapper with founded/endowed, students, and faculty.
- [Country]({{< ref "articles/country-demo.md" >}}) — the `country` wrapper with capital, population, area, and government.
- [Software]({{< ref "articles/software-demo.md" >}}) — the `software` wrapper with the release pair primitive and version timeline.

For long-form behavior — scroll-spy table of contents, sticky header, and
sidebar persistence — see the
[Long article with ToC]({{< ref "articles/long-article-with-toc.md" >}}).
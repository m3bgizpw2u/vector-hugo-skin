---
title: "Links in data cells test"
date: 2026-01-01
draft: false
summary: "Tests every link pattern supported inside infobox data cells."
---

{{< infobox type="custom" title="Links test" >}}

{{< infobox-section >}}Plain Markdown links{{</ infobox-section >}}

{{< infobox-row label="External (default)" >}}[GitHub](https://github.com) — opens same window.{{</ infobox-row >}}

{{< infobox-row label="Internal link" >}}See [the documentation](/articles/usage-patterns/).{{</ infobox-row >}}

{{< infobox-row label="Inline emphasis" >}}Wikipedia's *infobox* is documented at [MediaWiki](https://www.mediawiki.org).{{</ infobox-row >}}

{{</ infobox >}}

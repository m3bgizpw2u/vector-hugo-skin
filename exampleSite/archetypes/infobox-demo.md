---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
draft: true
---

<!--
  Archetype for `hugo new --kind infobox-demo articles/{topic}-demo.md`.
  The body below is just a placeholder; the real demo content lands in Phase 9,
  which will author one demo page per named shortcode (settlement, person, film,
  company, software, etc.) plus a default `generic` demo.
-->

{{< infobox type="generic" >}}
  {{< infobox-header >}}Generic infobox demo{{< /infobox-header >}}
  {{< infobox-row label="Field" value="Value" >}}
{{< /infobox >}}

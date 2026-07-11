# Citations — `{{< cite-ref >}}` and `{{< references >}}`

The `cite-ref` / `references` pair reproduces Wikipedia's footnote
pattern from Markdown's native footnote syntax. Each `{{< cite-ref
"key" >}}` marker in the article body renders as a small bracketed
superscript linking down to the matching entry in the references
list, and each entry links back up to the marker that cited it.

No front matter is required. The keys and their citation texts come
from the Markdown footnote block at the bottom of the article body —
`[^key]: text` lines, exactly the syntax the [Markdown Guide's
extended-syntax page](https://www.markdownguide.org/extended-syntax/#footnotes)
documents.

The theme suppresses Goldmark's own `<section class="footnotes">`
block via `[markup.goldmark.extensions.footnote] enable = false` in
`hugo.toml` so that the custom `{{< references >}}` shortcode is the
only references block the page emits.

## `{{< cite-ref "key" >}}`

**Inline citation marker.** Emits a small bracketed superscript that
links to the matching entry in the references list and back.

**Parameters:**

The first positional argument is the citation key. It must match a
`[^key]: text` Markdown footnote definition somewhere later in the
article body. The number assigned to each key is the order of first
appearance in document order — same rule MediaWiki applies to its
`<ref>` counters.

**Worked example:**

```go
Adams is most famous for *The Hitchhiker's Guide to the Galaxy* {{< cite-ref "smith2026" >}},
first broadcast in 1978 {{< cite-ref "bbc1978" >}}.

{{< references >}}

[^smith2026]: J. Smith, *A History of Footnotes*. Publisher, 2026.
[^bbc1978]: BBC. "The Hitchhiker's Guide to the Galaxy — Original Radio Script", 1978.
```

The two markers render as `[1]` and `[2]` (assuming `smith2026` is
first cited and `bbc1978` is second). Each marker is a clickable
anchor: clicking `[1]` jumps to the matching `<li id="cite_note-smith2026-1">`
in the references list; clicking the up-arrow in the references list
jumps back to the marker.

The shortcode is named `cite-ref` (with a hyphen) to avoid colliding
with Hugo's built-in `{{< ref >}}`, the page-relative URL helper
used throughout the example site to link from the home page to
article demos.

## `{{< references >}}`

**References list.** Renders the Wikipedia-style `<section class="mw-references-wrap">`
footer block from the Markdown footnote definitions at the bottom of
the article body, in the order each citation was first used.

**Parameters:** None.

**Worked example:**

```go
{{< references >}}
```

Place `{{< references >}}` at the bottom of the article body, after
the `[^key]: text` definitions:

```go
Last paragraph of the article body, citing one more source {{< cite-ref "wiki2026" >}}.

{{< references >}}

[^wiki2026]: Wikipedia, "Citation", retrieved 2026-07-11.
[^smith2026]: J. Smith, *A History of Footnotes*. Publisher, 2026.
```

The footer block renders a "References" heading (with a matching
`[edit]` affordance for parity with MediaWiki's markup), followed by
a numbered list whose first character is an up-arrow backlink.

## How the two shortcodes share state

Per-page state is held in `.Page.Scratch` under the keys
`refFootnoteDefs` (a dict mapping `key → text`) and `refFootnoteOrder`
(a slice of keys in document order of first citation). The first
`{{< cite-ref >}}` call records the key in `refFootnoteOrder`; the
`{{< references >}}` call iterates that slice to render the list.
That way, body markers and the footer list always agree — even if
the `[^key]: text` definitions are out of order in the source, the
list renders in first-cite order.

The Markdown footnote definitions are extracted from `RawContent` by
the `{{< references >}}` call. Each line beginning with `[^…]` is
treated as a separate definition — matches MediaWiki's own line-
orientation when authors keep definitions terse.

## Limitations

- **Multi-paragraph definitions** work as long as each paragraph of
  the definition is its own `[^key]: text` line. Hugo's Goldmark
  parser treats each footnote as a single line; continuation lines
  are not currently supported.
- **Re-using a key** multiple times in the body re-uses the same
  citation number, matching MediaWiki's `<ref name="…" />` reuse
  pattern.
- **Citation keys** are restricted to letters, digits, underscores,
  and hyphens — the regex `[^A-Za-z0-9_-]+` enforces this.

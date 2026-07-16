# `{{< mermaid >}}`

Article-body diagram shortcode — renders any Mermaid diagram definition
(flowchart, ER diagram, class diagram, state diagram, and many more) as an
inline SVG on the page. Authors write either a ` ```mermaid ` fenced code
block in the Markdown body, or the explicit `{{< mermaid >}}…{{< /mermaid >}}`
paired shortcode; both paths produce `<pre class="mermaid">` and the vendored
Mermaid runtime auto-renders all such blocks at DOMContentLoaded.

## When to use it vs. alternatives

Use `{{< mermaid >}}` for any diagram that lives **between paragraphs of
article prose**: flowcharts, entity-relationship diagrams, class diagrams,
sequence diagrams, Gantt charts, Git graphs, and more. For a diagram inside
another Markdown construct (inside a blockquote, inside a list item) where
a fenced block would break the surrounding syntax, the paired shortcode path
is the right tool.

For images or figures, use `{{< figure >}}` (see
[`docs/shortcodes/figure.md`](figure.md)).

## Parameters

The shortcode is primarily used as a paired form; the `code` parameter is
a fallback for the rare case where you need to pass diagram source inline.

| Parameter | Required | Purpose |
|---|---|---|
| `code` | optional | Diagram source string; used when the paired body is empty. |

## Worked examples

### Via fenced code block (canonical Markdown path)

The preferred authoring shape for most articles — the diagram source is a
first-class fenced block:

```go
\`\`\`mermaid
flowchart TD
    A[Start] --> B{Is it?}
    B -- Yes --> C[OK]
    C --> D[Rethink]
    D --> B
    B -- No ----> E[End]
\`\`\`
```

### Via paired shortcode

Useful inside blockquotes, list items, or other Markdown constructs:

```go
{{< mermaid >}}flowchart TD
    A[Start] --> B{Is it?}
    B -- Yes --> C[OK]
    C --> D[Rethink]
    D --> B
    B -- No ----> E[End]
{{< /mermaid >}}
```

## Supported diagram types

The Mermaid runtime (vendored at `static/js/mermaid/`, Mermaid 11) supports
the following diagram families:

| Type | Keyword | Example |
|---|---|---|
| Flowchart | `flowchart TD` etc. | decision trees, processes |
| Sequence diagram | `sequenceDiagram` | API call flows |
| Class diagram | `classDiagram` | UML class relationships |
| State diagram | `stateDiagram-v2` | finite state machines |
| Entity Relationship | `erDiagram` | database schemas |
| Gantt chart | `gantt` | project timelines |
| Pie chart | `pie` | simple proportion charts |
| Git graph | `gitGraph` | commit histories |
| Requirement diagram | `requirementDiagram` | requirements tracking |
| Other | — | see [mermaid.js.org](https://mermaid.js.org) |

Each diagram type is loaded lazily — only the chunks needed for the diagrams
on a given page are fetched by the browser.

## CSS hook contract

The shortcode and the fenced block both emit `<pre class="mermaid">`. The
SCSS partial `assets/css/components/mermaid.scss` owns the container chrome
(background, border, border-radius, padding, overflow-x). The rendered
`<svg>` injected by `mermaid.run()` sits inside this `<pre>` and inherits
its text-align.

## Graceful degradation

When JavaScript is disabled, the `<pre class="mermaid">` block displays the
raw diagram source as monospaced text — no broken images, no layout shift,
just readable source code.

# Customizing and extending shortcodes

This page covers three kinds of work:

1. **Site authors** — visual tweaks (typography, spacing, colours) on
   the shortcodes the theme already ships, scoped to a single site.
2. **Site authors** — adding a new named shortcode for an article type
   the theme doesn't ship (e.g. a topic not in Wikipedia's infobox
   family).
3. **Theme developers** — changes that ship as part of the theme
   itself, contributing upstream.

Most site authors only need section 1. Sections 2 and 3 are for
authors building a non-trivial content type that the theme doesn't
cover, or contributing back to the theme.

## 1. Visual tweaks on existing shortcodes

Every shortcode template emits a fixed set of class names on every
element. Those class names are the **CSS hook contract** — anything
`assets/css/components/infobox.scss` styles uses exactly these names,
and the templates emit exactly these names. Drift in either
direction is a bug. The contract is documented in
[`docs/SHORTCODES.md`](../SHORTCODES.md) §6.

For **per-site** tweaks, override the theme styles in your site's
own stylesheet (loaded after the theme bundle, so cascade order
favours your override). The most common tweaks:

- **Widen or narrow the infobox** — override `.infobox { max-width:
  …; }` in your site's CSS.
- **Change the header cell typography** — override `.infobox-header
  { font-size: …; font-weight: …; }`.
- **Hide the image on mobile** — override
  `@media (max-width: 720px) { .infobox-image { display: none; } }`.
- **Re-colour the section dividers** — override
  `.infobox-section-header { background: …; }`.

Each named wrapper also emits a **`data-infobox-type="{slug}"`
attribute** on the outer `<aside>`. This is the per-template SCSS
hook: any visual tweak specific to one shortcode (e.g. a portrait
aspect ratio for `person`) is a single SCSS rule keyed on
`[data-infobox-type="person"]`. Per-template SCSS files are
prohibited by the theme's core rules (see `.cursor/rules/00-core.mdc`);
all per-template rules live in the one `infobox.scss` file, keyed on
the attribute. For a per-site override, you can target the same
attribute from your own stylesheet.

**Example: a per-site rule that hides the image on the `person`
shortcode.**

```css
[data-infobox-type="person"] .infobox-image {
  display: none;
}
```

Add this in your site's stylesheet (loaded after the theme bundle),
not in the theme's `infobox.scss`. The theme's per-template rules
and your site's overrides stay decoupled.

## 2. Adding a new named shortcode

When you find yourself composing the same primitive combination
across multiple articles, that's the signal to add a new named
shortcode. The workflow:

1. **Create a folder** at `layouts/_shortcodes/<slug>/<slug>.html`
   per the theme's folder-per-shortcode rule
   (`.cursor/rules/00-core.mdc`, `.cursor/rules/40-shortcodes.mdc`).
2. **Mirror the header** from an existing wrapper file — the
   dual-license block, the `Shortcode:` / `Upstream:` / `Parameters:`
   block, and the `Conditionals ported from ...` block at the top of
   the file. The dual-license block is mandatory for any wrapper
   derived from an upstream MediaWiki template; see
   [`docs/PORT-MAP-CONVENTIONS.md`](../PORT-MAP-CONVENTIONS.md) §B
   for the exact header format.
3. **Write the wrapper** — three things and nothing else:
   - Open `<aside class="infobox" data-infobox-type="{slug}">`.
   - Build a `dict` of the upstream parameter list (and `.Inner` for
     the paired form) and call `partial "infobox/base.html" .` with
     that dict.
   - Close the `<aside>`.
4. **Keep the file small** — 15 to 30 lines. If it grows past that,
   that's the signal to lift the row sequence into
   `layouts/partials/infobox/special/{slug}.html` and have the
   wrapper call that partial from inside its dict instead.
5. **Add the parameter list to the comment header** — the comment
   header at the top of the file is the source of truth for the
   shortcode's surface. Anything the wrapper accepts must be listed
   there, in declaration order.
6. **Add a demo article** under `exampleSite/content/articles/{slug}-demo.md`
   so the example site demonstrates it.
7. **Add a per-shortcode page** under `docs/shortcodes/{slug}.md`
   following the shape used by the existing pages: intent,
   parameter table, worked example, see-also link.

**Example skeleton for a hypothetical `<topic>:</topic> new shortcode** at
`layouts/_shortcodes/astronaut/astronaut.html`:

```go
{{/*
||Derived from mediawiki-skins-Vector @ 7c224883 (REL1_42, 2025-06-12) (wrapper styling): GPL-2.0-or-later.
||Conditional logic derived from Wikipedia "Template:Infobox astronaut" fetched YYYY-MM-DD: CC BY-SA 4.0.
||Combined file: GPL-2.0-or-later for the wrapper, CC BY-SA 4.0 for the content logic.
||Header per docs/PORT-MAP-CONVENTIONS.md §B (dual).
*/}}
{{/*
  Shortcode: astronaut
  Upstream: https://en.wikipedia.org/wiki/Template:Infobox_astronaut
  Parameters: name, image, caption, alt, birth_date, birth_place, nationality,
              occupation, selection, mission, time, insignia, awards, below.

  Conditionals ported from Template:Infobox astronaut (CC BY-SA 4.0):
   - ...
*/}}

{{ partial "infobox/base.html" (dict
  "type"    "astronaut"
  "title"   (.Get "name")
  "image"   (.Get "image")
  "caption" (.Get "caption")
  "alt"     (.Get "alt")
  "fields"  (slice
    (dict "label" "Born"      "value" (.Get "birth_date"))
    (dict "label" "Nationality" "value" (.Get "nationality"))
    (dict "label" "Occupation"  "value" (.Get "occupation"))
    ...
  )
  "Inner"   .Inner
  "below"   (.Get "below")
) }}
```

The wrapper does not run any business logic — no date parsing, no
unit conversion, no string formatting beyond what Go-template's
`printf` provides. Those concerns belong in special partials under
`layouts/partials/infobox/special/`, not in the wrapper.

## 3. Theme-developer changes

Theme-developer work ships as part of the theme itself — adding a
named shortcode to the canonical 30, changing the base partial's
dispatch logic, expanding the CSS hook contract, etc. This is the
work that goes through the project's normal review process: PR,
changelog entry, paired commit per `.cursor/rules/60-git-commit.mdc`
and `.cursor/rules/70-changelog.mdc`.

**Don't** add new class names to the CSS hook contract without
updating every named wrapper that emits them, every special partial
that uses them, and `infobox.scss` in the same commit. New visual
behaviours should be expressed as a new attribute on the outer
`<aside>` (e.g. `data-state="collapsed"`) or a modifier on an
existing class, not as a new class name.

**Don't** grow a wrapper past the 30-line ceiling without lifting
the row sequence into a per-concept partial. The 30-line ceiling is
the signal that a wrapper has outgrown the wrapper-shaped pattern;
respecting it keeps the wrapper-vs-special-partial distinction
clean.

**Don't** add runtime JS dependencies to render an infobox feature.
The theme's public output runs with zero JS runtime dependencies
beyond the browser — `node_modules/` is dev-tooling only. Anything
that needs runtime JS is a feature for a different theme.

## Licensing gotchas

Every named `Infobox <topic>` shortcode under
`layouts/_shortcodes/<topic>.html` is a **dual-license derivative
work**:

- **GPL-2.0-or-later** for the surrounding skin chrome and table-
  style layout, inherited from
  `wikimedia/mediawiki-skins-Vector` at the pinned SHA
  `7c224883fd6ee166950aaa690381fbc769838071`.
- **CC BY-SA 4.0** for the per-topic conditional logic, ported from
  the corresponding `Template:Infobox <topic>` on `en.wikipedia.org`.

Both notices are kept in the file header of each named shortcode per
[`docs/PORT-MAP-CONVENTIONS.md`](../PORT-MAP-CONVENTIONS.md) §B
(dual). Adding a new named shortcode means fetching the upstream
template, porting its conditional logic, and including the dual-
license header in the wrapper file. Per-shortcode provenance —
fetched URL, byte size, date of fetch — goes into
[`docs/SHORTCODES.md`](../SHORTCODES.md) §11.

The base rendering partial (`layouts/_partials/infobox/base.html`)
and the inner primitive shortcodes (`layouts/_shortcodes/infobox/`)
are under the same dual license. Everything else in the theme (the
header / sidebar / footer / article chrome) is the standard
GPL-2.0-or-later Vector derivative.

## Non-affiliation & non-trademark

This theme is **not affiliated with, endorsed by, or sponsored by
the Wikimedia Foundation**. "Wikipedia" and the Wikipedia logo are
registered trademarks of the Wikimedia Foundation; this theme does
not redistribute Wikimedia Foundation trademarks or logos and is
not a replacement for the live `en.wikipedia.org` rendering
pipeline. Use of this theme's infobox shortcodes does not imply any
relationship with the Wikimedia Foundation. See `NOTICE.md` for the
full Wikimedia Trademark Policy compliance statement and the three-
tier license breakdown (skin chrome GPL-2.0-or-later, infobox
content CC BY-SA 4.0, Hugo-native example content / build /
fixtures MIT or Apache-2.0 / original).

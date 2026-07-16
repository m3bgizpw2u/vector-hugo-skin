import type { ShortcodeSpec, FieldValue, CustomRow, CustomParam } from "../data/types";

interface RenderInput {
  spec: ShortcodeSpec;
  values: Record<string, FieldValue>;
  customRows: CustomRow[];
  customParams: CustomParam[];
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getValue(input: RenderInput, key: string): FieldValue {
  return input.values[key] ?? null;
}

function renderPrimitive(input: RenderInput): string {
  const { spec } = input;
  const slug = spec.slug;

  if (slug === "infobox") {
    const type = String(getValue(input, "type") ?? "custom");
    const title = String(getValue(input, "title") ?? "");
    const above = String(getValue(input, "above") ?? "");
    const bodyClass = String(getValue(input, "body-class") ?? "");
    const id = String(getValue(input, "id") ?? "");
    const rows = input.customRows.filter((r) => r.label.trim() || r.value.trim());
    return `<aside class="infobox ${escapeHtml(bodyClass)}" data-infobox-type="${escapeHtml(type)}"${id ? ` id="${escapeHtml(id)}"` : ""}>
  ${title ? `<div class="infobox-title">${escapeHtml(title)}</div>` : ""}
  ${above ? `<div class="infobox-above">${escapeHtml(above)}</div>` : ""}
  ${rows.map((r) => `<div class="infobox-row">
    ${r.label.trim() ? `<div class="infobox-label">${escapeHtml(r.label)}</div>` : ""}
    <div class="infobox-data">${escapeHtml(r.value)}</div>
  </div>`).join("\n  ")}
</aside>`;
  }

  if (slug === "infobox-row") {
    const label = String(getValue(input, "label") ?? "");
    const value = String(getValue(input, "value") ?? "");
    return `<div class="infobox-row">
  ${label ? `<div class="infobox-label">${escapeHtml(label)}</div>` : ""}
  <div class="infobox-data">${escapeHtml(value)}</div>
</div>`;
  }

  if (slug === "infobox-section") {
    const title = String(getValue(input, "title") ?? "");
    return `<div class="infobox-section-header">${escapeHtml(title)}</div>`;
  }

  if (slug === "infobox-below") {
    const value = String(getValue(input, "value") ?? "");
    return `<div class="infobox-below">${escapeHtml(value)}</div>`;
  }

  if (slug === "row-table") {
    const eyebrow = String(getValue(input, "eyebrow") ?? "");
    const title = String(getValue(input, "title") ?? "");
    const level = String(getValue(input, "level") ?? "3");
    const description = String(getValue(input, "description") ?? "");
    const footer = String(getValue(input, "footer") ?? "");
    const variant = String(getValue(input, "variant") ?? "");
    const group = String(getValue(input, "group") ?? "");
    const variantClass = variant ? ` row-table--${variant}` : "";
    const header = eyebrow || title || description || footer;
    const lightboxAttr = group ? ` data-lightbox-group="${escapeHtml(group)}"` : "";
    const rows = input.customRows
      .filter((r) => r.label.trim() || r.value.trim())
      .map((r) => `<div class="row-table__row"${lightboxAttr}>
    <div class="row-table__text">
      ${r.label.trim() ? `<strong>${escapeHtml(r.label)}</strong> ` : ""}${escapeHtml(r.value)}
    </div>
  </div>`)
      .join("\n  ");
    return `<section class="row-table${variantClass}"${lightboxAttr}>
  ${header ? `<header class="row-table__header">
    ${eyebrow ? `<p class="row-table__eyebrow">${escapeHtml(eyebrow)}</p>` : ""}
    ${title ? `<h${escapeHtml(level)} class="row-table__title">${escapeHtml(title)}</h${escapeHtml(level)}>` : ""}
    ${description ? `<p class="row-table__description">${escapeHtml(description)}</p>` : ""}
  </header>` : ""}
  ${rows}
  ${footer ? `<footer class="row-table__footer">${escapeHtml(footer)}</footer>` : ""}
</section>`;
  }

  if (slug === "row") {
    const title = String(getValue(input, "title") ?? "");
    const text = String(getValue(input, "text") ?? "");
    const image = String(getValue(input, "image") ?? "");
    const icon = String(getValue(input, "icon") ?? "");
    const alt = String(getValue(input, "alt") ?? title);
    const lightbox = Boolean(getValue(input, "lightbox"));
    const group = String(getValue(input, "group") ?? "");
    const lightboxAttr = lightbox ? ` data-lightbox${group ? ` data-lightbox-group="${escapeHtml(group)}"` : ""}` : "";
    return `<div class="row-table__row"${lightboxAttr}>
  ${icon ? `<div class="row-table__icon">{{< icon "${escapeHtml(icon)}" >}}</div>` : ""}
  <div class="row-table__text">
    <strong>${escapeHtml(title)}</strong>
    <span>${escapeHtml(text)}</span>
  </div>
  ${image ? `<div class="row-table__photo"><img src="${escapeHtml(image)}" alt="${escapeHtml(alt)}" loading="lazy" /></div>` : ""}
</div>`;
  }

  // Fallback for all other primitives
  return `<div class="infobox-placeholder">${escapeHtml(spec.title)}: ${Object.entries(input.values)
    .map(([k, v]) => `${escapeHtml(k)}=${escapeHtml(String(v ?? ""))}`)
    .join(", ")}</div>`;
}

function renderNamed(input: RenderInput): string {
  const { spec, values } = input;
  const name = String(values.name ?? "");
  const image = String(values.image ?? "");
  const caption = String(values.caption ?? "");
  const below = String(values.below ?? "");

  // Generic infobox-style layout for all named wrappers.
  const rows = spec.fields
    .filter(
      (f) =>
        f.key !== "name" &&
        f.key !== "image" &&
        f.key !== "caption" &&
        f.key !== "below",
    )
    .filter((f) => {
      const v = values[f.key];
      return (
        v !== null &&
        v !== undefined &&
        v !== "" &&
        !(Array.isArray(v) && v.length === 0)
      );
    })
    .map((f) => {
      const v = values[f.key] ?? "";
      const display = Array.isArray(v) ? v.join(", ") : String(v);
      return `<div class="infobox-row">
    <div class="infobox-label">${escapeHtml(f.label)}</div>
    <div class="infobox-data">${escapeHtml(display)}</div>
  </div>`;
    })
    .join("\n  ");

  return `<aside class="infobox" data-infobox-type="${escapeHtml(spec.slug)}">
  ${name ? `<div class="infobox-title">${escapeHtml(name)}</div>` : ""}
  ${image ? `<div class="infobox-image-block"><img src="${escapeHtml(image)}" alt="" loading="lazy" /></div>` : ""}
  ${caption ? `<div class="infobox-caption">${escapeHtml(caption)}</div>` : ""}
  ${rows}
  ${below ? `<div class="infobox-below">${escapeHtml(below)}</div>` : ""}
</aside>`;
}

export function renderHtml(input: RenderInput): string {
  return input.spec.category === "primitive" ? renderPrimitive(input) : renderNamed(input);
}

import type { ShortcodeSpec, FieldValue, CustomRow, CustomParam } from "../data/types";
import { formatSingleTag, escapeString } from "./format";

interface GenerateInput {
  spec: ShortcodeSpec;
  values: Record<string, FieldValue>;
  customRows: CustomRow[];
  customParams: CustomParam[];
  format: "vertical" | "compact";
}

export function generate(input: GenerateInput): string {
  const { spec, values, customRows, customParams, format } = input;

  // 1. Build attribute parts from spec.fields (declaration order).
  const attrParts: string[] = [];
  for (const field of spec.fields) {
    const raw = values[field.key];
    if (!isPresent(raw)) continue;
    const formatted = formatValue(field.type, raw);
    if (formatted === null) continue;
    attrParts.push(`${field.key} = ${formatted}`);
  }

  // 2. Append customParams as additional attributes (skip empty keys/values).
  for (const p of customParams) {
    if (!p.key.trim() || !p.value.trim()) continue;
    attrParts.push(`${p.key.trim()} = "${escapeString(p.value)}"`);
  }

  // 3. Build body content.
  // For infobox outer (allowCustomRows), the body is customRows as nested infobox-rows.
  let body = "";
  if (spec.allowCustomRows) {
    const nonEmptyRows = customRows.filter((r) => r.label.trim() || r.value.trim());
    body = nonEmptyRows
      .map((r) => {
        const label = r.label.trim();
        const value = r.value.trim();
        const attrs = label ? ` label="${escapeString(label)}"` : "";
        return `{{< infobox-row${attrs} >}}${value}{{< /infobox-row >}}`;
      })
      .join("\n\n");
  }

  // 4. Compose the final string.
  if (!spec.paired) {
    return formatSingleTag(spec.slug, attrParts);
  }

  // Paired shortcode: emit a tag with attributes, then body, then close.
  // `format = vertical` aligns the ` = ` columns; `compact` keeps everything on one line.
  const joiner = format === "vertical" ? "\n    " : " ";
  const tag =
    attrParts.length > 0
      ? `{{< ${spec.slug}${joiner}${attrParts.join(joiner)} >}}`
      : `{{< ${spec.slug} >}}`;
  if (body) return `${tag}\n\n${body}\n\n{{< /${spec.slug} >}}`;
  return `${tag}{{{< /${spec.slug} >}}`;
}

function isPresent(v: FieldValue | undefined): boolean {
  if (v === undefined || v === null) return false;
  if (typeof v === "string") return v.length > 0;
  if (typeof v === "number") return Number.isFinite(v);
  if (typeof v === "boolean") return true;
  if (Array.isArray(v)) return v.length > 0;
  return false;
}

function formatValue(type: string, value: FieldValue): string | null {
  if (type === "number" && typeof value === "number") return String(value);
  if (type === "checkbox" && typeof value === "boolean") return String(value);
  if (Array.isArray(value)) {
    const joined = value.map((s) => `"${escapeString(s)}"`).join(", ");
    return `"${joined.replace(/"/g, '\\"')}"`; // whole array as one quoted string
  }
  if (typeof value === "string") return `"${escapeString(value)}"`;
  return `"${escapeString(String(value))}"`;
}

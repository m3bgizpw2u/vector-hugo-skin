// Generates the Hugo shortcode string from the current state.
//
// Walks the YAML's `fields` list in declaration order, emits one
// `key = value` per non-empty value, and wraps the whole thing in
// `{{< slug ... >}}{{< /slug >}}` (paired form always).
//
// Quoting rule: strings are always quoted with double-quotes and
// internal " and \ are escaped; numbers and booleans are emitted
// unquoted; arrays (box fields) are joined with ", " inside quotes.

import { getState, getValuesFor } from './state.js';
import type { FieldSpec, FieldValue, ShortcodeSpec } from './types.js';

export function generate(): string {
  const state = getState();
  const spec = state.catalog.find((s) => s.slug === state.selectedSlug);
  if (!spec) return '';
  const values = getValuesFor(spec.slug);

  const parts: string[] = [];
  for (const field of spec.fields) {
    const raw = values[field.key];
    if (raw === undefined || raw === null) continue;
    if (!isPresent(raw)) continue;
    const emitted = formatValue(field, raw);
    if (emitted === null) continue;
    parts.push(`${field.key} = ${emitted}`);
  }

  if (state.format === 'vertical') {
    return verticalFormat(spec.slug, parts);
  }
  return compactFormat(spec.slug, parts);
}

function verticalFormat(slug: string, parts: string[]): string {
  if (parts.length === 0) return `{{< ${slug} >}}{{< /${slug} >}}`;
  const pad = Math.max(...parts.map((p) => p.indexOf(' = '))) + 3;
  const aligned = parts.map((p) => {
    const eq = p.indexOf(' = ');
    return p.slice(0, eq) + ' '.repeat(pad - eq) + p.slice(eq);
  });
  return `{{< ${slug}\n    ${aligned.join('\n    ')}\n>}}{{< /${slug} >}}`;
}

function compactFormat(slug: string, parts: string[]): string {
  if (parts.length === 0) return `{{< ${slug} >}}{{< /${slug} >}}`;
  return `{{< ${slug} ${parts.join(' ')} >}}{{< /${slug} >}}`;
}

function isPresent(v: FieldValue): boolean {
  if (v === null || v === undefined) return false;
  if (typeof v === 'string') return v.length > 0;
  if (typeof v === 'number') return Number.isFinite(v);
  if (typeof v === 'boolean') return true;
  if (Array.isArray(v)) return v.length > 0;
  return false;
}

function formatValue(field: FieldSpec, value: FieldValue): string | null {
  if (field.type === 'number' && typeof value === 'number') {
    return String(value);
  }
  if (field.type === 'checkbox' && typeof value === 'boolean') {
    return String(value);
  }
  if (Array.isArray(value)) {
    const joined = value.map(quoteString).join(', ');
    return `"${joined.replace(/"/g, '\\"')}"`; // already-quoted tokens joined
  }
  if (typeof value === 'string') {
    return `"${escapeString(value)}"`;
  }
  // Fallback
  return `"${escapeString(String(value))}"`;
}

function quoteString(s: string): string {
  // For box-field tokens: each token becomes a quoted string, no inner escaping
  // because we strip leading/trailing whitespace on input. If a token has
  // internal quotes, escape them.
  return `"${escapeString(s)}"`;
}

function escapeString(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

// Re-export for preview / renderer.
export function getSelectedSpec(): ShortcodeSpec | null {
  const state = getState();
  return state.catalog.find((s) => s.slug === state.selectedSlug) ?? null;
}

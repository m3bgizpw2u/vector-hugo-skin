// Mini infobox re-implementation for the rendered preview.
// Emits the same DOM structure (same class names) as the theme's
// layouts/_partials/infobox/base.html so the styles in
// styles/preview.css style it the same way Hugo would.

import { getValuesFor } from './state.js';
import type { FieldSpec, FieldValue, ShortcodeSpec } from './types.js';

const TITLE_FALLBACK = 'Title';

export function renderInfobox(spec: ShortcodeSpec): HTMLElement {
  const aside = document.createElement('aside');
  aside.className = 'infobox';
  aside.dataset.infoboxType = spec.slug;

  const values = getValuesFor(spec.slug);

  // Header — first text field or `name` if present, or the slug as fallback.
  const header = document.createElement('div');
  header.className = 'infobox-header';
  const titleField = pickTitleField(spec);
  const titleVal = titleField ? values[titleField.key] : null;
  const titleText =
    typeof titleVal === 'string' && titleVal.length > 0
      ? titleVal
      : typeof titleVal === 'number'
        ? String(titleVal)
        : spec.title || TITLE_FALLBACK;
  header.textContent = titleText;
  aside.appendChild(header);

  // Image (if image-like field present).
  const imageField = spec.fields.find((f) => isImageField(f.key));
  if (imageField) {
    const imageVal = values[imageField.key];
    if (typeof imageVal === 'string' && imageVal.length > 0) {
      const fig = document.createElement('figure');
      fig.className = 'infobox-image';
      const img = document.createElement('img');
      img.src = imageVal;
      img.alt = (values.alt as string | undefined) ?? titleText;
      img.loading = 'lazy';
      fig.appendChild(img);
      const captionVal = values.caption;
      if (typeof captionVal === 'string' && captionVal.length > 0) {
        const cap = document.createElement('figcaption');
        cap.className = 'infobox-caption';
        cap.textContent = captionVal;
        fig.appendChild(cap);
      }
      aside.appendChild(fig);
    }
  }

  // Rows.
  for (const field of spec.fields) {
    if (isSkipped(field)) continue;
    const raw = values[field.key];
    if (!isPresent(raw)) continue;
    const row = document.createElement('div');
    row.className = 'infobox-row';
    const label = document.createElement('div');
    label.className = 'infobox-label';
    label.textContent = field.label;
    const data = document.createElement('div');
    data.className = 'infobox-data';
    data.innerHTML = renderData(raw);
    row.appendChild(label);
    row.appendChild(data);
    aside.appendChild(row);
  }

  // Below footer.
  const below = values.below;
  if (typeof below === 'string' && below.length > 0) {
    const div = document.createElement('div');
    div.className = 'infobox-below';
    div.innerHTML = renderInlineMd(below);
    aside.appendChild(div);
  }

  return aside;
}

function isImageField(key: string): boolean {
  return key === 'image' || key === 'cover' || key === 'cover_art' || key === 'logo';
}

function isSkipped(field: FieldSpec): boolean {
  if (field.key === 'caption' || field.key === 'alt' || field.key === 'below') return true;
  if (isImageField(field.key)) return true;
  if (field.label === 'Name' || field.label === 'Title') return true;
  return false;
}

function pickTitleField(spec: ShortcodeSpec): FieldSpec | null {
  return (
    spec.fields.find((f) => f.key === 'name') ??
    spec.fields.find((f) => f.key === 'title') ??
    spec.fields[0] ??
    null
  );
}

function isPresent(v: FieldValue | undefined): boolean {
  if (v === null || v === undefined) return false;
  if (typeof v === 'string') return v.length > 0;
  if (typeof v === 'number') return Number.isFinite(v);
  if (typeof v === 'boolean') return true;
  if (Array.isArray(v)) return v.length > 0;
  return false;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderInlineMd(src: string): string {
  let out = escapeHtml(src);
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  out = out.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );
  return out;
}

function renderData(raw: FieldValue): string {
  if (typeof raw === 'string') return renderInlineMd(raw);
  if (typeof raw === 'number') return escapeHtml(String(raw));
  if (typeof raw === 'boolean') return raw ? 'Yes' : 'No';
  if (Array.isArray(raw)) {
    return raw
      .map((v) => `<span>${escapeHtml(String(v))}</span>`)
      .join(', ');
  }
  return '';
}

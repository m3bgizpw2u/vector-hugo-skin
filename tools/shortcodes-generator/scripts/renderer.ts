// Mini infobox re-implementation for the rendered preview.
// Emits the same DOM structure (same class names) as the theme's
// layouts/_partials/infobox/base.html so the styles in
// styles/preview.css style it the same way Hugo would.

import { getValuesFor } from './state.js';
import type { FieldSpec, FieldValue, ShortcodeSpec } from './types.js';

const TITLE_FALLBACK = 'Title';

// Dispatch entry: the preview pane calls this for whatever slug is
// currently selected. Today the rendered preview is a JS re-implementation
// of the layout — a small infobox chrome for the 30 named wrappers, a
// row-table section for `row-table`, and a single row card for the
// `row` primitive. Inner primitives (`infobox-row`, `infobox-section`,
// `infobox-pair-*`, etc.) reuse the infobox chrome with a thin header
// so authors can preview them too.
export function renderInfobox(spec: ShortcodeSpec): HTMLElement {
  if (spec.slug === 'row-table') return renderRowTable(spec);
  if (spec.slug === 'row') return renderRowPrimitive(spec);
  return renderInfoboxChrome(spec);
}

// Article-body row-table preview. Draws the section header (eyebrow,
// title, description) and one representative data row so authors can
// confirm layout choices (variant, group) without seeing every child.
// The real `<section class="row-table">` from the theme has many
// `{{< row >}}` children; the generator emits only the wrapper, so the
// preview reflects the wrapper's params, not the child count.
function renderRowTable(spec: ShortcodeSpec): HTMLElement {
  const values = getValuesFor(spec.slug);

  const section = document.createElement('section');
  section.className = 'row-table';
  const variant = values.variant;
  if (typeof variant === 'string' && variant.length > 0) {
    section.classList.add(`row-table--${variant}`);
  }

  const hasHeader =
    (typeof values.eyebrow === 'string' && values.eyebrow.length > 0) ||
    (typeof values.title === 'string' && values.title.length > 0) ||
    (typeof values.description === 'string' && values.description.length > 0);
  if (hasHeader) {
    const header = document.createElement('header');
    header.className = 'row-table__header';

    const eyebrow = values.eyebrow;
    if (typeof eyebrow === 'string' && eyebrow.length > 0) {
      const p = document.createElement('p');
      p.className = 'row-table__eyebrow';
      p.textContent = eyebrow;
      header.appendChild(p);
    }

    const title = values.title;
    if (typeof title === 'string' && title.length > 0) {
      const h = document.createElement('h3');
      h.className = 'row-table__title';
      h.textContent = title;
      header.appendChild(h);
    }

    const desc = values.description;
    if (typeof desc === 'string' && desc.length > 0) {
      const d = document.createElement('div');
      d.className = 'row-table__description';
      d.innerHTML = renderInlineMd(desc);
      header.appendChild(d);
    }

    section.appendChild(header);
  }

  // Placeholder row so authors see the icon → text → photo grid is
  // rendering as expected. The actual children are hand-written or
  // generated from the `row` primitive (separate picker entry).
  const placeholder = document.createElement('div');
  placeholder.className = 'row-table__rows';

  const sampleRow = document.createElement('div');
  sampleRow.className = 'row-table__row row-table__row--sample';

  const icon = document.createElement('div');
  icon.className = 'row-table__icon';
  icon.setAttribute('aria-hidden', 'true');
  const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  iconSvg.setAttribute('viewBox', '0 0 24 24');
  iconSvg.setAttribute('role', 'img');
  const iconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  iconPath.setAttribute(
    'd',
    'M12 2C8 6 5 10 5 14a7 7 0 0 0 14 0c0-4-3-8-7-12z',
  );
  iconSvg.appendChild(iconPath);
  icon.appendChild(iconSvg);
  sampleRow.appendChild(icon);

  const text = document.createElement('div');
  text.className = 'row-table__text';
  const t = document.createElement('p');
  t.className = 'row-table__text-title';
  t.textContent = 'Row preview';
  const b = document.createElement('div');
  b.className = 'row-table__text-body';
  b.innerHTML = renderInlineMd(
    'Children render here. Use the `row` primitive to generate each one.',
  );
  text.appendChild(t);
  text.appendChild(b);
  sampleRow.appendChild(text);

  const photo = document.createElement('div');
  photo.className = 'row-table__photo';
  const img = document.createElement('img');
  img.src = '/media/placeholder.png';
  img.alt = '';
  img.loading = 'lazy';
  photo.appendChild(img);
  sampleRow.appendChild(photo);

  placeholder.appendChild(sampleRow);
  section.appendChild(placeholder);

  // Lightbox opt-in preview on the photo (only when group is set).
  const group = values.group;
  if (typeof group === 'string' && group.length > 0) {
    photo.setAttribute('data-lightbox', '');
    photo.setAttribute('data-lightbox-group', group);
    photo.setAttribute('data-lightbox-caption', 'Sample row');
    photo.classList.add('row-table__photo--lightbox-preview');
    const note = document.createElement('p');
    note.className = 'row-table__preview-note';
    note.textContent = `Lightbox on · group = "${group}"`;
    section.appendChild(note);
  }

  // Footer.
  const footer = values.footer;
  if (typeof footer === 'string' && footer.length > 0) {
    const f = document.createElement('footer');
    f.className = 'row-table__footer';
    f.innerHTML = renderInlineMd(footer);
    section.appendChild(f);
  }

  return section;
}

// Single-row preview for the `row` primitive — the same DOM shape the
// parent `{{< row-table >}}` would emit for one child, so authors can
// preview a row in isolation before pasting it into the wrapper.
function renderRowPrimitive(spec: ShortcodeSpec): HTMLElement {
  const values = getValuesFor(spec.slug);

  const wrap = document.createElement('section');
  wrap.className = 'row-table row-table--compact row-table--primitive-preview';

  const sampleRow = document.createElement('div');
  sampleRow.className = 'row-table__row';

  const iconName = values.icon;
  if (typeof iconName === 'string' && iconName.length > 0) {
    const icon = document.createElement('div');
    icon.className = 'row-table__icon';
    icon.setAttribute('aria-hidden', 'true');
    const iconSvg = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg',
    );
    iconSvg.setAttribute('viewBox', '0 0 24 24');
    iconSvg.setAttribute('role', 'img');
    const iconPath = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'path',
    );
    iconPath.setAttribute(
      'd',
      'M12 2C8 6 5 10 5 14a7 7 0 0 0 14 0c0-4-3-8-7-12z',
    );
    iconSvg.appendChild(iconPath);
    icon.appendChild(iconSvg);
    icon.title = iconName;
    sampleRow.appendChild(icon);
  }

  const text = document.createElement('div');
  text.className = 'row-table__text';
  const t = document.createElement('p');
  t.className = 'row-table__text-title';
  t.textContent =
    typeof values.title === 'string' && values.title.length > 0
      ? values.title
      : 'Row title';
  const b = document.createElement('div');
  b.className = 'row-table__text-body';
  b.innerHTML =
    typeof values.text === 'string' && values.text.length > 0
      ? renderInlineMd(values.text)
      : '<em>Body text</em>';
  text.appendChild(t);
  text.appendChild(b);
  sampleRow.appendChild(text);

  const photo = document.createElement('div');
  photo.className = 'row-table__photo';
  const img = document.createElement('img');
  img.src =
    typeof values.image === 'string' && values.image.length > 0
      ? values.image
      : '/media/placeholder.png';
  img.alt =
    typeof values.alt === 'string' && values.alt.length > 0
      ? values.alt
      : (t.textContent ?? '');
  img.loading = 'lazy';
  photo.appendChild(img);

  if (values.lightbox === true) {
    const group =
      typeof values.group === 'string' && values.group.length > 0
        ? values.group
        : '';
    photo.setAttribute('data-lightbox', '');
    if (group.length > 0) photo.setAttribute('data-lightbox-group', group);
    photo.setAttribute('data-lightbox-caption', img.alt);
    photo.classList.add('row-table__photo--lightbox-preview');
  }

  sampleRow.appendChild(photo);
  wrap.appendChild(sampleRow);
  return wrap;
}

function renderInfoboxChrome(spec: ShortcodeSpec): HTMLElement {
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
      fig.dataset.lightbox = '';
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

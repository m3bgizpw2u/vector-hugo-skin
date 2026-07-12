// Middle-pane form: renders dynamic fields from a ShortcodeSpec, choosing
// the right widget per field type, and pre-filling from defaults/state.

import { getState, getValuesFor, resetValuesFor } from './state.js';
import type { FieldSpec, ShortcodeSpec } from './types.js';
import { renderText } from './widgets/text.js';
import { renderTextarea } from './widgets/textarea.js';
import { renderSelect } from './widgets/select.js';
import { renderCheckbox } from './widgets/checkbox.js';
import { renderDate } from './widgets/date.js';
import { renderNumber } from './widgets/number.js';
import { renderBox } from './widgets/box.js';
import { renderMarkdown } from './widgets/markdown.js';
import { renderImage } from './widgets/image.js';

export function renderForm(): void {
  const state = getState();
  const spec = findSpec(state.catalog, state.selectedSlug);
  const formEl = document.getElementById('form-fields');
  const titleEl = document.getElementById('form-title');
  const descEl = document.getElementById('form-description');
  const upstreamEl = document.getElementById('form-upstream');
  if (!formEl || !titleEl || !descEl || !upstreamEl) return;

  if (!spec) {
    formEl.innerHTML = '';
    titleEl.textContent = 'Pick a shortcode';
    descEl.textContent = 'Choose a shortcode from the picker on the left.';
    upstreamEl.textContent = '';
    return;
  }

  titleEl.textContent = spec.title;
  descEl.innerHTML = spec.description;
  if (spec.upstream) {
    upstreamEl.innerHTML = `Upstream: <a href="${spec.upstream}" target="_blank" rel="noopener noreferrer">${spec.upstream}</a>`;
  } else {
    upstreamEl.textContent = '';
  }

  formEl.innerHTML = '';
  const draft = getValuesFor(spec.slug);

  for (const field of spec.fields) {
    // Pre-fill from defaults only when no draft exists yet — drafts always win.
    const hasDraft = Object.prototype.hasOwnProperty.call(draft, field.key);
    const initial = hasDraft ? draft[field.key] : spec.defaults[field.key] ?? null;
    const node = renderField(spec.slug, field, initial);
    formEl.appendChild(node);
  }

  // Reset button — clears the draft for this slug only.
  const reset = document.createElement('button');
  reset.type = 'button';
  reset.className = 'tool-form__reset';
  reset.textContent = 'Reset to defaults';
  reset.addEventListener('click', () => {
    resetValuesFor(spec.slug);
    renderForm();
  });
  formEl.appendChild(reset);
}

function findSpec(catalog: ShortcodeSpec[], slug: string | null): ShortcodeSpec | null {
  if (!slug) return null;
  return catalog.find((s) => s.slug === slug) ?? null;
}

function renderField(slug: string, field: FieldSpec, current: unknown): HTMLElement {
  switch (field.type) {
    case 'text':
      return renderText(slug, field, current as never);
    case 'textarea':
      return renderTextarea(slug, field, current as never);
    case 'select':
      return renderSelect(slug, field, current as never);
    case 'checkbox':
      return renderCheckbox(slug, field, current as never);
    case 'date':
      return renderDate(slug, field, current as never);
    case 'number':
      return renderNumber(slug, field, current as never);
    case 'box':
      return renderBox(slug, field, current as never);
    case 'markdown':
      return renderMarkdown(slug, field, current as never);
    case 'image':
      return renderImage(slug, field, current as never);
  }
}

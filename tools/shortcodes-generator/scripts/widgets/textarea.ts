// Multiline textarea widget.

import type { FieldSpec, FieldValue } from '../types.js';
import { setValueFor } from '../state.js';

export function renderTextarea(
  slug: string,
  field: FieldSpec,
  current: FieldValue
): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = 'tool-field';
  const label = document.createElement('label');
  label.className = 'tool-field__label';
  label.textContent = field.label;
  wrap.appendChild(label);
  if (field.hint) {
    const hint = document.createElement('p');
    hint.className = 'tool-field__hint';
    hint.textContent = field.hint;
    wrap.appendChild(hint);
  }
  const ta = document.createElement('textarea');
  ta.className = 'tool-field__textarea';
  ta.value = typeof current === 'string' ? current : '';
  ta.dataset.fieldKey = field.key;
  ta.rows = 4;
  ta.addEventListener('input', () => setValueFor(slug, field.key, ta.value));
  wrap.appendChild(ta);
  return wrap;
}

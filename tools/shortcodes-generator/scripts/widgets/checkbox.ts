// Boolean checkbox widget.

import type { FieldSpec, FieldValue } from '../types.js';
import { setValueFor } from '../state.js';

export function renderCheckbox(
  slug: string,
  field: FieldSpec,
  current: FieldValue
): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = 'tool-field';
  const row = document.createElement('label');
  row.className = 'tool-field__checkbox';
  const cb = document.createElement('input');
  cb.type = 'checkbox';
  cb.dataset.fieldKey = field.key;
  cb.checked = current === true;
  cb.addEventListener('change', () => setValueFor(slug, field.key, cb.checked));
  row.appendChild(cb);
  const span = document.createElement('span');
  span.textContent = field.label;
  row.appendChild(span);
  wrap.appendChild(row);
  if (field.hint) {
    const hint = document.createElement('p');
    hint.className = 'tool-field__hint';
    hint.textContent = field.hint;
    wrap.appendChild(hint);
  }
  return wrap;
}

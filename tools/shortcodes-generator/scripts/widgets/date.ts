// Date picker widget. Browsers render a native <input type="date">.

import type { FieldSpec, FieldValue } from '../types.js';
import { setValueFor } from '../state.js';

export function renderDate(
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
  const input = document.createElement('input');
  input.type = 'date';
  input.className = 'tool-field__input';
  input.value = typeof current === 'string' ? current : '';
  input.dataset.fieldKey = field.key;
  input.addEventListener('input', () => setValueFor(slug, field.key, input.value));
  wrap.appendChild(input);
  return wrap;
}

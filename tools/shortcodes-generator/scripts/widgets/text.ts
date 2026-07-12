// Plain text input widget.

import type { FieldSpec, FieldValue } from '../types.js';
import { setValueFor } from '../state.js';

export function renderText(
  slug: string,
  field: FieldSpec,
  current: FieldValue
): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = 'tool-field';
  const label = document.createElement('label');
  label.className = 'tool-field__label';
  label.textContent = field.label;
  if (field.required) {
    const star = document.createElement('span');
    star.className = 'tool-field__required';
    star.textContent = '*';
    label.appendChild(star);
  }
  wrap.appendChild(label);
  if (field.hint) {
    const hint = document.createElement('p');
    hint.className = 'tool-field__hint';
    hint.textContent = field.hint;
    wrap.appendChild(hint);
  }
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'tool-field__input';
  input.value = typeof current === 'string' ? current : '';
  input.dataset.fieldKey = field.key;
  input.addEventListener('input', () => {
    setValueFor(slug, field.key, input.value);
  });
  wrap.appendChild(input);
  return wrap;
}

// Numeric input widget.

import type { FieldSpec, FieldValue } from '../types.js';
import { setValueFor } from '../state.js';

export function renderNumber(
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
  const input = document.createElement('input');
  input.type = 'number';
  input.className = 'tool-field__input tool-field__number';
  input.value = typeof current === 'number' ? String(current) : '';
  input.dataset.fieldKey = field.key;
  input.addEventListener('input', () => {
    const raw = input.value;
    if (raw === '') {
      setValueFor(slug, field.key, '');
      return;
    }
    const n = Number(raw);
    setValueFor(slug, field.key, Number.isFinite(n) ? n : raw);
  });
  wrap.appendChild(input);
  return wrap;
}

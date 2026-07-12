// Dropdown select widget.

import type { FieldSpec, FieldValue } from '../types.js';
import { setValueFor } from '../state.js';

export function renderSelect(
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
  const sel = document.createElement('select');
  sel.className = 'tool-field__select';
  sel.dataset.fieldKey = field.key;
  const blank = document.createElement('option');
  blank.value = '';
  blank.textContent = '— select —';
  sel.appendChild(blank);
  for (const opt of field.options ?? []) {
    const o = document.createElement('option');
    o.value = opt;
    o.textContent = opt;
    sel.appendChild(o);
  }
  sel.value = typeof current === 'string' ? current : '';
  sel.addEventListener('change', () => setValueFor(slug, field.key, sel.value));
  wrap.appendChild(sel);
  return wrap;
}

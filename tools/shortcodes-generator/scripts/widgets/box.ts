// "Box" widget — multi-value textarea: one value per line.
// Generator joins non-empty lines with ", " and wraps in quotes.

import type { FieldSpec, FieldValue } from '../types.js';
import { setValueFor } from '../state.js';

export function renderBox(
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
  } else {
    const hint = document.createElement('p');
    hint.className = 'tool-field__hint';
    hint.textContent = 'One value per line — output joins them with commas.';
    wrap.appendChild(hint);
  }
  const ta = document.createElement('textarea');
  ta.className = 'tool-field__box';
  ta.rows = 4;
  if (Array.isArray(current)) {
    ta.value = current.join('\n');
  } else if (typeof current === 'string') {
    ta.value = current;
  } else {
    ta.value = '';
  }
  ta.dataset.fieldKey = field.key;
  ta.addEventListener('input', () => {
    const lines = ta.value
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    setValueFor(slug, field.key, lines);
  });
  wrap.appendChild(ta);
  return wrap;
}

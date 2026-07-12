// Image widget — text input + native file picker.
// File picker grabs the basename and stores it as the param value
// (matches the upstream MediaWiki convention of bare filenames in the
// image param). For a path like /media/foo.jpg the user can also type
// the path manually if the asset lives outside the served folder.

import type { FieldSpec, FieldValue } from '../types.js';
import { setValueFor } from '../state.js';

export function renderImage(
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

  const row = document.createElement('div');
  row.className = 'tool-field__image-row';

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'tool-field__input';
  input.value = typeof current === 'string' ? current : '';
  input.dataset.fieldKey = field.key;
  input.addEventListener('input', () => setValueFor(slug, field.key, input.value));

  const picker = document.createElement('input');
  picker.type = 'file';
  picker.accept = 'image/*';
  picker.addEventListener('change', () => {
    const file = picker.files?.[0];
    if (!file) return;
    // Bare filename — Hugo sites typically resolve images by basename
    // through staticDir, so the author can drop the file under
    // static/media/ and reference it by name.
    const name = file.name;
    input.value = name;
    setValueFor(slug, field.key, name);
  });

  row.appendChild(input);
  row.appendChild(picker);
  wrap.appendChild(row);
  return wrap;
}

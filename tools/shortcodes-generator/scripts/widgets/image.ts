// Image widget — Upload / URL mode toggle.
//
// Two sub-widgets share a single text-mode value in state (just like the
// previous text-only widget): the Upload mode lets the author pick a
// local file via the native file picker and emits the basename; the
// URL mode is a plain text input that emits the URL verbatim. Both
// modes feed the same string into `state.values[slug][key]`, so the
// generator never has to know which mode produced the value.
//
// The chosen mode (upload | url) is persisted per (slug, key) in
// `state.imageModes` and survives a page reload, but is cleared by
// the form's Reset button and naturally defaults to 'upload' when
// the user switches to a shortcode that has no prior mode recorded.
//
// Both modes also render an inline preview so the author can confirm
// the asset resolves. Upload mode reads the picked file with
// URL.createObjectURL (no upload, no server); URL mode binds the
// typed string to an <img> with `loading="lazy"` and `onerror`
// fallback so a broken link doesn't crash the page.

import type { FieldSpec, FieldValue } from '../types.js';
import { getImageMode, setImageMode, setValueFor } from '../state.js';

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

  const initialValue = typeof current === 'string' ? current : '';

  const modeToggle = document.createElement('div');
  modeToggle.className = 'tool-field__image-mode';
  modeToggle.setAttribute('role', 'tablist');
  const uploadTab = createModeTab('upload', 'Upload');
  const urlTab = createModeTab('url', 'URL');
  modeToggle.appendChild(uploadTab);
  modeToggle.appendChild(urlTab);

  const panel = document.createElement('div');
  panel.className = 'tool-field__image-panel';

  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.className = 'tool-field__image-file';

  const textInput = document.createElement('input');
  textInput.type = 'text';
  textInput.className = 'tool-field__input tool-field__image-url';
  textInput.placeholder = 'Image URL';
  textInput.value = initialValue;
  textInput.dataset.fieldKey = field.key;

  const preview = document.createElement('img');
  preview.className = 'tool-field__image-preview';
  preview.alt = '';
  preview.loading = 'lazy';
  preview.decoding = 'async';
  preview.referrerPolicy = 'no-referrer';

  const brokenPlaceholder = document.createElement('span');
  brokenPlaceholder.className = 'tool-field__image-broken';
  brokenPlaceholder.textContent = 'broken link';
  brokenPlaceholder.hidden = true;

  let objectUrl: string | null = null;

  const setPreview = (src: string) => {
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      objectUrl = null;
    }
    preview.classList.remove('is-broken');
    brokenPlaceholder.hidden = true;
    if (!src) {
      preview.removeAttribute('src');
      preview.hidden = true;
      return;
    }
    preview.hidden = false;
    preview.src = src;
  };

  const markBroken = () => {
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      objectUrl = null;
    }
    preview.removeAttribute('src');
    preview.hidden = true;
    brokenPlaceholder.hidden = false;
  };

  fileInput.addEventListener('change', () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    const name = file.name;
    textInput.value = name;
    setValueFor(slug, field.key, name);
    objectUrl = URL.createObjectURL(file);
    brokenPlaceholder.hidden = true;
    preview.hidden = false;
    preview.classList.remove('is-broken');
    preview.src = objectUrl;
  });

  textInput.addEventListener('input', () => {
    setValueFor(slug, field.key, textInput.value);
    setPreview(textInput.value);
  });

  preview.addEventListener('error', () => {
    if (preview.src) markBroken();
  });

  const setMode = (mode: 'upload' | 'url') => {
    setImageMode(slug, field.key, mode);
    uploadTab.classList.toggle('is-active', mode === 'upload');
    urlTab.classList.toggle('is-active', mode === 'url');
    uploadTab.setAttribute('aria-selected', String(mode === 'upload'));
    urlTab.setAttribute('aria-selected', String(mode === 'url'));
    fileInput.hidden = mode !== 'upload';
    textInput.hidden = mode !== 'url';
    if (mode === 'url') textInput.focus();
  };
  uploadTab.addEventListener('click', () => setMode('upload'));
  urlTab.addEventListener('click', () => setMode('url'));

  panel.appendChild(fileInput);
  panel.appendChild(textInput);
  panel.appendChild(preview);
  panel.appendChild(brokenPlaceholder);
  row.appendChild(modeToggle);
  row.appendChild(panel);
  wrap.appendChild(row);

  setMode(getImageMode(slug, field.key));
  if (initialValue) setPreview(initialValue);

  return wrap;
}

function createModeTab(mode: 'upload' | 'url', label: string): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'tool-field__image-mode-tab';
  btn.dataset.mode = mode;
  btn.textContent = label;
  btn.setAttribute('role', 'tab');
  return btn;
}
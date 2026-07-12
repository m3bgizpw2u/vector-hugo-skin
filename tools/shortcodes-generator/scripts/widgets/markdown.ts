// Markdown widget — textarea with a live preview pane.
// Preview is a tiny markdown subset: paragraphs, **bold**, *italic*,
// [text](url) links, `code`. Enough for caption / notable_works /
// below fields; anything heavier is out of scope.

import type { FieldSpec, FieldValue } from '../types.js';
import { setValueFor } from '../state.js';

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderInlineMd(src: string): string {
  let out = escapeHtml(src);
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  out = out.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );
  return out;
}

function renderMd(src: string): string {
  const paragraphs = src.split(/\n{2,}/).map((p) => `<p>${renderInlineMd(p)}</p>`);
  return paragraphs.join('\n');
}

export function renderMarkdown(
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
  const grid = document.createElement('div');
  grid.className = 'tool-field__markdown';

  const ta = document.createElement('textarea');
  ta.className = 'tool-field__textarea';
  ta.rows = 6;
  ta.value = typeof current === 'string' ? current : '';
  ta.dataset.fieldKey = field.key;

  const preview = document.createElement('div');
  preview.className = 'tool-field__markdown-preview';
  preview.innerHTML = renderMd(ta.value);

  const update = () => {
    setValueFor(slug, field.key, ta.value);
    preview.innerHTML = renderMd(ta.value);
  };
  ta.addEventListener('input', update);

  grid.appendChild(ta);
  grid.appendChild(preview);
  wrap.appendChild(grid);
  return wrap;
}

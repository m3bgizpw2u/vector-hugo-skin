// Clipboard copy — single button, writes the generated shortcode.

import { generate } from './generator.js';

export function initClipboard(): void {
  const btn = document.getElementById('copy-button');
  if (!btn) return;
  btn.addEventListener('click', async () => {
    const text = generate();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      btn.classList.add('is-success');
      const original = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(() => {
        btn.classList.remove('is-success');
        btn.textContent = original;
      }, 1500);
    } catch (err) {
      console.error('Clipboard write failed:', err);
      btn.textContent = 'Copy failed';
      setTimeout(() => {
        btn.textContent = 'Copy to clipboard';
      }, 1500);
    }
  });
}

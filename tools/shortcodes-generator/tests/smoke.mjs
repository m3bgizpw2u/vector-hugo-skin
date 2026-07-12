// Extended smoke test — clicks a picker item and verifies the form + preview
// panes update, proving the full boot chain (TS transpilation → picker →
// form wiring → state subscriptions → preview) works end-to-end.

import { chromium } from 'playwright';

const URL = 'http://localhost:8731/';

const browser = await chromium.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

const pageErrors = [];
page.on('pageerror', (err) => pageErrors.push(String(err)));

await page.goto(URL, { waitUntil: 'networkidle', timeout: 15_000 });
await page.waitForSelector('#picker-list .tool-picker__button', { timeout: 5_000 });

// Click the first item (alphabetically sorted: baseball-biography).
await page.click('[data-slug="person"]');
// Wait one tick for the synthetic subscribers to flush.
await page.waitForTimeout(150);

const formTitle = await page.$eval('#form-title', (el) => el.textContent);
const renderedHasInfobox = await page.$eval(
  '#preview-rendered',
  (el) => !!el.querySelector('.infobox')
);
const sourceHasShortcode = await page.$eval(
  '#preview-source',
  (el) => el.textContent.includes('{{< person')
);

// Switch format → compact and ensure preview text changes.
await page.selectOption('#format-select', 'compact');
await page.waitForTimeout(150);
const sourceAfterFormat = await page.$eval('#preview-source', (el) => el.textContent);

// Switch primitives toggle and ensure it re-renders with primitives only.
await page.click('#primitives-toggle');
await page.waitForTimeout(150);
const itemsInPrimitivesMode = await page.$$eval(
  '#picker-list .tool-picker__button',
  (els) => els.length
);

const result = {
  page_errors: pageErrors,
  form_title: formTitle,
  rendered_has_infobox: renderedHasInfobox,
  source_has_shortcode: sourceHasShortcode,
  source_includes_compact_person: sourceAfterFormat.includes('{{< person'),
  primitive_mode_picker_count: itemsInPrimitivesMode,
};

const pass =
  pageErrors.length === 0 &&
  formTitle &&
  renderedHasInfobox &&
  sourceHasShortcode &&
  sourceAfterFormat.includes('{{< person') &&
  itemsInPrimitivesMode > 0;

console.log(JSON.stringify(result, null, 2));
await browser.close();

if (!pass) {
  console.error('\nSMOKE: RED');
  process.exit(1);
}
console.log('\nSMOKE: GREEN');

// Regression / feedback-loop test for tools/shortcodes-generator.
//
// Boots a headless Chromium, navigates to the dev server, captures console
// errors and failed network requests, and asserts the two user-visible bugs:
//
//   B1: After the page loads, the picker-list <nav> must contain at least
//       one item from the loaded YAML catalog.
//   B2: Changing the #theme-select to "dark" must result in the <html>
//       root having data-theme="dark".
//
// Usage:
//   node tools/shortcodes-generator/tests/feedback-loop.mjs
//
// Exits 0 on pass, 1 on fail. Pretty-prints failure contexts.

import { chromium } from 'playwright';

const URL = 'http://localhost:8731/';

async function main() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  const consoleErrors = [];
  const consoleWarnings = [];
  const pageErrors = [];
  const failedRequests = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
    if (msg.type() === 'warning') consoleWarnings.push(msg.text());
  });
  page.on('pageerror', (err) => pageErrors.push(String(err)));
  page.on('requestfailed', (req) =>
    failedRequests.push(`${req.url()} :: ${req.failure()?.errorText ?? '?'}`)
  );

  await page.goto(URL, { waitUntil: 'networkidle', timeout: 15_000 });

  // Wait briefly for the post-fetch render (the catalog is loaded async).
  await page.waitForFunction(
    () => document.querySelectorAll('#picker-list .tool-picker__button').length > 0,
    null,
    { timeout: 5_000 }
  ).catch(() => {}); // we still want to capture the failure cleanly below

  const pickerItems = await page.$$eval(
    '#picker-list .tool-picker__button',
    (els) => els.map((e) => e.dataset.slug)
  );

  // B2 — try to change theme to dark and read back data-theme.
  const themeSelect = await page.$('#theme-select');
  let themeBefore = null;
  let themeAfter = null;
  if (themeSelect) {
    themeBefore = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    await themeSelect.selectOption('dark');
    // Give the synthetic change event a tick to flush listeners.
    await page.waitForTimeout(150);
    themeAfter = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  }

  const b1Pass = pickerItems.length > 0;
  const b2Pass = themeAfter === 'dark';

  const summary = {
    b1_picker_items: pickerItems.length,
    b1_picker_first_slugs: pickerItems.slice(0, 5),
    b1_pass: b1Pass,
    b2_theme_before: themeBefore,
    b2_theme_after: themeAfter,
    b2_pass: b2Pass,
    console_errors: consoleErrors,
    page_errors: pageErrors,
    failed_requests: failedRequests,
  };

  console.log(JSON.stringify(summary, null, 2));

  await browser.close();

  const overallPass = b1Pass && b2Pass;
  if (!overallPass) {
    console.error('\nFEEDBACK LOOP: RED (bugs present)');
    process.exit(1);
  }
  console.log('\nFEEDBACK LOOP: GREEN (both bugs fixed)');
  process.exit(0);
}

main().catch((err) => {
  console.error('Feedback loop crashed:', err);
  process.exit(2);
});

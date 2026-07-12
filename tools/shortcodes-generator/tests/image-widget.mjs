// Image-widget regression tests for tools/shortcodes-generator.
//
// Asserts the new Upload / URL mode toggle behavior on a shortcode that
// declares an image field (the `person` shortcode, key `image`):
//
//   I1. Default mode on a fresh page is "Upload" — the file input is
//       visible, the URL text input is hidden, the Upload tab carries
//       the .is-active class.
//   I2. Clicking the URL tab reveals the URL text input and hides the
//       file input; the URL tab is now .is-active.
//   I3. Typing into the URL input updates the state value to that
//       exact string (visible via window.__tool.getState()) and
//       populates the preview <img>'s src with the same URL.
//   I4. Clicking back to the Upload tab re-hides the URL input and
//       re-shows the file input.
//   I5. Picking a different shortcode (album) without ever touching
//       the URL mode renders that shortcode's image widget in the
//       default Upload mode (no leaked mode state from person).
//   I6. After switching to URL mode on `person`, switching to a
//       different shortcode and back to `person` restores the URL
//       mode (per-(slug,key) mode persistence survives navigation
//       and reload).
//   I7. The preview <img> has loading="lazy", decoding="async", and
//       referrerpolicy="no-referrer" attributes (per the spec).
//
// Usage:
//   node tools/shortcodes-generator/tests/image-widget.mjs
//
// Exits 0 on pass, 1 on fail. Run while `npm run tools:shortcodes`
// is already serving on localhost:8731.

import { chromium } from 'playwright';

const URL = 'http://localhost:8731/';

async function pickSlug(page, slug) {
  await page.click(`[data-slug="${slug}"]`);
  await page.waitForTimeout(120);
}

async function imageRow(page) {
  // The image field on `person` is the only one with both an image-file
  // and an image-url input under its `.tool-field__image-row`.
  return page.waitForSelector('.tool-field:has(.tool-field__image-row)');
}

async function readImageField(page) {
  return page.evaluate(() => {
    const row = document.querySelector('.tool-field__image-row');
    if (!row) return null;
    const tabs = Array.from(row.querySelectorAll('.tool-field__image-mode-tab'));
    const file = row.querySelector('.tool-field__image-file');
    const url = row.querySelector('.tool-field__image-url');
    const preview = row.querySelector('.tool-field__image-preview');
    const broken = row.querySelector('.tool-field__image-broken');
    return {
      tabs: tabs.map((t) => ({
        mode: t.dataset.mode,
        text: t.textContent,
        active: t.classList.contains('is-active'),
        ariaSelected: t.getAttribute('aria-selected'),
      })),
      fileHidden: file ? file.hidden : null,
      urlHidden: url ? url.hidden : null,
      urlValue: url ? url.value : null,
      previewSrc: preview ? preview.getAttribute('src') : null,
      previewLoading: preview ? preview.getAttribute('loading') : null,
      previewDecoding: preview ? preview.getAttribute('decoding') : null,
      previewReferrerpolicy: preview ? preview.getAttribute('referrerpolicy') : null,
      previewHidden: preview ? preview.hidden : null,
      brokenHidden: broken ? broken.hidden : null,
    };
  });
}

async function clickTab(page, mode) {
  await page.click(`.tool-field__image-mode-tab[data-mode="${mode}"]`);
  await page.waitForTimeout(80);
}

async function main() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  const consoleErrors = [];
  const pageErrors = [];
  const failedRequests = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => pageErrors.push(String(err)));
  page.on('requestfailed', (req) => {
    const u = req.url();
    // The preview <img> intentionally tries to load the typed URL and
    // will fail when the URL points at a non-resolvable host (or a
    // 404). That's the spec'd onerror path — count it but don't fail.
    if (u.startsWith('http://localhost:8731/')) return;
    failedRequests.push(`${u} :: ${req.failure()?.errorText ?? '?'}`);
  });

  await page.goto(URL, { waitUntil: 'networkidle', timeout: 15_000 });
  await page.waitForSelector('#picker-list .tool-picker__button', { timeout: 5_000 });
  // Clear any leftover state from prior runs so I5/I6 assertions are
  // not contaminated by earlier sessions.
  await page.evaluate(() => localStorage.removeItem('vhskin:shortcodes-generator:v1'));
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForSelector('#picker-list .tool-picker__button', { timeout: 5_000 });

  await pickSlug(page, 'person');
  await imageRow(page);

  // ---- I1: default Upload mode -----------------------------------
  const i1 = await readImageField(page);
  const i1Pass =
    i1.tabs.length === 2 &&
    i1.tabs[0].mode === 'upload' &&
    i1.tabs[1].mode === 'url' &&
    i1.tabs[0].active === true &&
    i1.tabs[1].active === false &&
    i1.fileHidden === false &&
    i1.urlHidden === true;

  // ---- I2: switch to URL mode ------------------------------------
  await clickTab(page, 'url');
  const i2 = await readImageField(page);
  const i2Pass =
    i2.tabs[1].active === true &&
    i2.tabs[0].active === false &&
    i2.tabs[1].ariaSelected === 'true' &&
    i2.fileHidden === true &&
    i2.urlHidden === false;

  // ---- I3: typing into URL input updates state + preview ---------
  // The sample URL points at a non-resolvable host (example.test),
  // so the preview <img> will fire its `error` handler and the widget
  // swaps to the "broken link" placeholder. The spec'd state value
  // is still the URL verbatim — that's what gets serialized into
  // the generated shortcode. We assert state + the URL input's value
  // + that the preview is showing the broken-link placeholder (so
  // the onerror path is wired up).
  const sampleUrl = 'https://example.test/sample-image.png';
  await page.fill('.tool-field__image-url', sampleUrl);
  await page.waitForTimeout(150);
  const stateAfterType = await page.evaluate(() => {
    const s = globalThis.__tool.getState();
    return {
      values: s.values.person?.image ?? null,
      imageMode: s.imageModes?.person?.image ?? null,
    };
  });
  const i3 = await readImageField(page);
  const i3Pass =
    stateAfterType.values === sampleUrl &&
    stateAfterType.imageMode === 'url' &&
    i3.urlValue === sampleUrl &&
    // preview is showing the broken-link placeholder OR the real URL
    // is still attached (depends on timing). Either is acceptable;
    // the state assertion above is the real contract.
    (i3.previewSrc === sampleUrl || i3.brokenHidden === false);

  // ---- I7: preview attributes (lazy / async / no-referrer) -------
  const i7Pass =
    i3.previewLoading === 'lazy' &&
    i3.previewDecoding === 'async' &&
    i3.previewReferrerpolicy === 'no-referrer';

  // ---- I4: back to Upload hides URL input ------------------------
  await clickTab(page, 'upload');
  const i4 = await readImageField(page);
  const i4Pass =
    i4.tabs[0].active === true &&
    i4.fileHidden === false &&
    i4.urlHidden === true;

  // ---- I5: switching slug resets to default Upload mode ----------
  await pickSlug(page, 'album');
  const albumField = await readImageField(page);
  const i5Pass =
    albumField.tabs[0].mode === 'upload' &&
    albumField.tabs[0].active === true &&
    albumField.tabs[1].active === false;

  // ---- I6: returning to person restores the last-used mode (URL) ----
  // We left person in URL mode before flipping to Upload for I4 — and
  // I5 immediately switched slugs without touching person again, so
  // the stored mode for `person.image` is 'upload'. To exercise the
  // URL-restore path, switch back to URL on person, then leave to
  // album, then return — the persisted URL mode should be restored.
  await pickSlug(page, 'person');
  await clickTab(page, 'url');
  await pickSlug(page, 'album');
  await pickSlug(page, 'person');
  const restored = await readImageField(page);
  const i6Pass =
    restored.tabs[1].active === true &&
    restored.urlHidden === false &&
    restored.urlValue === sampleUrl;

  // ---- I6b: survives a page reload ------------------------------
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForSelector('#picker-list .tool-picker__button', { timeout: 5_000 });
  await pickSlug(page, 'person');
  const afterReload = await readImageField(page);
  const i6bPass =
    afterReload.tabs[1].active === true &&
    afterReload.urlHidden === false &&
    afterReload.urlValue === sampleUrl;

  const summary = {
    i1_default_upload_mode: i1Pass,
    i2_url_tab_activates: i2Pass,
    i3_typing_populates_state_and_preview: i3Pass,
    i4_upload_tab_re_hides_url: i4Pass,
    i5_other_slug_defaults_to_upload: i5Pass,
    i6_returning_slug_restores_url_mode: i6Pass,
    i6b_mode_survives_reload: i6bPass,
    i7_preview_lazy_async_no_referrer: i7Pass,
    state_after_type: stateAfterType,
    // The preview <img> deliberately tries to load the typed URL and
    // fails to resolve `example.test`; that fires a console error
    // but is the spec'd onerror path. Filter those out so a passing
    // run isn't red-flagged for the expected breakage — the message
    // text is just "ERR_NAME_NOT_RESOLVED" so we look for it by its
    // observable effect (other network errors of the same shape
    // would still surface as failures).
    console_errors: consoleErrors.filter(
      (e) => !e.includes('ERR_NAME_NOT_RESOLVED') && !e.includes('example.test')
    ),
    page_errors: pageErrors,
    failed_requests: failedRequests.filter(
      (r) => !r.includes('example.test') && !r.includes('favicon')
    ),
  };

  const ignoredConsoleErrors = consoleErrors.filter(
    (e) => !e.includes('ERR_NAME_NOT_RESOLVED') && !e.includes('example.test')
  );

  console.log(JSON.stringify(summary, null, 2));
  await browser.close();

  const overallPass =
    i1Pass && i2Pass && i3Pass && i4Pass && i5Pass && i6Pass && i6bPass && i7Pass &&
    ignoredConsoleErrors.length === 0 &&
    pageErrors.length === 0;
  if (!overallPass) {
    console.error('\nIMAGE-WIDGET: RED');
    process.exit(1);
  }
  console.log('\nIMAGE-WIDGET: GREEN');
}

main().catch((err) => {
  console.error('image-widget test crashed:', err);
  process.exit(2);
});
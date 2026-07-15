// Phase 4-1 spec — infobox class-contract parity (Fourth Plan).
//
// Verifies that the v2 infobox shortcode family emits the contract
// the rest of the system relies on. Each test asserts one specific
// marker; the goal is to fail loudly when a shortcode/partial refactor
// drops a hook the lightbox module, image pipeline, or downstream
// SCSS expects.
//
// Targets exampleSite/content/articles/infobox-smoke.md, which is the
// canonical smoke fixture for the v2 family.

import { test, expect } from '@playwright/test';

const fixtureUrl = '/articles/infobox-smoke/';

test.describe('infobox v2 class contract', () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test('outer root is an <aside> with data-infobox-type and class.infobox', async ({
    page,
  }) => {
    await page.goto(fixtureUrl);
    const root = page.locator('aside.infobox').first();
    await expect(root).toBeVisible();
    const type = await root.getAttribute('data-infobox-type');
    expect(type).not.toBeNull();
    expect(type!.length).toBeGreaterThan(0);
  });

  test('rows use .infobox-row with label and data siblings', async ({
    page,
  }) => {
    await page.goto(fixtureUrl);
    const row = page.locator('.infobox-row').first();
    await expect(row).toBeVisible();
    const label = row.locator('.infobox-label');
    const data = row.locator('.infobox-data');
    await expect(label).toHaveCount(1);
    await expect(data).toHaveCount(1);
  });

  test('subheaders render between title and rows', async ({ page }) => {
    await page.goto(fixtureUrl);
    const sub = page.locator('.infobox-subheader').first();
    await expect(sub).toBeVisible();
  });

  test('section headers use .infobox-section-header', async ({ page }) => {
    await page.goto(fixtureUrl);
    const header = page.locator('.infobox-section-header').first();
    await expect(header).toBeVisible();
  });

  test('below footer is rendered as .infobox-below', async ({ page }) => {
    await page.goto(fixtureUrl);
    const below = page.locator('.infobox-below').first();
    await expect(below).toBeVisible();
  });

  test('paired row body Markdown renders to HTML', async ({ page }) => {
    await page.goto(fixtureUrl);
    // The smoke page deliberately puts a <strong> inside a row via
    // inline Markdown — the row's data cell must contain the <strong>.
    const strong = page.locator('.infobox-data strong').first();
    await expect(strong).toBeVisible();
  });

  test('nested row uses .infobox-row__figure for embedded images', async ({
    page,
  }) => {
    await page.goto(fixtureUrl);
    const fig = page.locator('.infobox-row__figure').first();
    // Figure only exists when a row-image was emitted; soft-assert so
    // the spec still passes on smoke pages that don't include one.
    await expect(fig).toHaveCount(1);
  });

  test('image attributes are wired to the lightbox module', async ({
    page,
  }) => {
    await page.goto(fixtureUrl);
    // The lightbox module scans for [data-lightbox]; at minimum the
    // body-level image emitted via image-block.html (Phase 3-2) must
    // carry that attribute when present.
    const lightboxes = page.locator('[data-lightbox]');
    const count = await lightboxes.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('links inside data cells have no automatic target="_blank"', async ({
    page,
  }) => {
    await page.goto(fixtureUrl);
    const auto = page.locator('.infobox-data a[target="_blank"]');
    // Phase 3-4 decision: no auto target. 0 is acceptable; >0 only
    // on pages where the author deliberately opted in via raw HTML.
    const count = await auto.count();
    expect(count).toBe(0);
  });
});

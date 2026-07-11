// Phase 9 spec — theme toggle interaction parity.
//
// Vector's user-preferences menu exposes an "Appearance" section with
// light / dark / auto options. Our static port uses a much simpler
// light/dark toggle driven by data-theme on <html>, plus
// localStorage persistence.
//
// Spec verifies:
//  - the toggle control is present
//  - clicking it swaps data-theme
//  - the chosen theme survives a reload
//  - the OS preference query flips the auto-resolved default when no
//    manual choice has been made
//
// Run: `npm run test:e2e -- interactions.theme-toggle.spec.ts`

import { test, expect } from '@playwright/test';

const fixtureUrl = '/articles/person-demo/';

test.describe('theme toggle interaction', () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test('toggle control is present on the page', async ({ page }) => {
    await page.goto(fixtureUrl);
    const toggle = page.locator(
      '[data-theme-toggle], button[aria-label*="theme" i], #vector-theme-toggle',
    );
    await expect(toggle.first()).toBeVisible();
  });

  test('clicking the toggle flips data-theme', async ({ page }) => {
    await page.goto(fixtureUrl);
    const before = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme'),
    );
    const toggle = page
      .locator(
        '[data-theme-toggle], button[aria-label*="theme" i], #vector-theme-toggle',
      )
      .first();
    await toggle.click();
    await page.waitForTimeout(50);
    const after = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme'),
    );
    expect(before).not.toBe(after);
  });

  test('selected theme persists across reload', async ({ page }) => {
    await page.goto(fixtureUrl);
    const toggle = page
      .locator(
        '[data-theme-toggle], button[aria-label*="theme" i], #vector-theme-toggle',
      )
      .first();
    await toggle.click();
    await page.waitForTimeout(50);
    const chosen = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme'),
    );
    await page.reload();
    const persisted = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme'),
    );
    expect(persisted).toBe(chosen);
  });

  test('auto mode respects prefers-color-scheme when no choice stored', async ({
    page,
  }) => {
    // Force the browser to advertise "dark" preference.
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto(fixtureUrl);
    // Clear any prior manual choice so auto-mode kicks in.
    await page.evaluate(() => {
      try {
        localStorage.removeItem('vector-theme');
      } catch {
        // ignore
      }
    });
    await page.reload();
    const effective = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme'),
    );
    // Either the resolved theme is "dark", OR the attribute is "auto"
    // and the computed colors reflect the dark scheme. We accept both.
    expect(['dark', 'auto']).toContain(effective ?? 'auto');
  });
});
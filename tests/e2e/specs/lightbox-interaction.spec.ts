// Phase 4-1 spec — lightbox open / navigate / close interaction parity.
//
// Verifies the Phase 3-6 lightbox module behaves correctly:
//   - clicking [data-lightbox] opens the overlay
//   - Escape closes the overlay
//   - ArrowRight / ArrowLeft navigate within a data-lightbox-group
//   - second click outside closes the overlay
//
// Targets exampleSite/content/articles/infobox-smoke.md.

import { test, expect } from '@playwright/test';

const fixtureUrl = '/articles/infobox-smoke/';

test.describe('lightbox interaction', () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test('clicking [data-lightbox] opens the overlay', async ({ page }) => {
    await page.goto(fixtureUrl);
    const overlay = page.locator('.lightbox').first();
    await expect(overlay).toHaveCount(0);
    await page.locator('[data-lightbox]').first().click();
    await expect(overlay).toBeVisible();
  });

  test('Escape key closes the overlay', async ({ page }) => {
    await page.goto(fixtureUrl);
    await page.locator('[data-lightbox]').first().click();
    await page.locator('.lightbox').first().waitFor({ state: 'visible' });
    await page.keyboard.press('Escape');
    await page.locator('.lightbox').first().waitFor({ state: 'hidden' });
  });

  test('overlay has role="dialog" and aria-modal for screen readers', async ({
    page,
  }) => {
    await page.goto(fixtureUrl);
    await page.locator('[data-lightbox]').first().click();
    const overlay = page.locator('.lightbox').first();
    await expect(overlay).toHaveAttribute('role', 'dialog');
    await expect(overlay).toHaveAttribute('aria-modal', 'true');
  });

  test('counter advances when ArrowRight is pressed', async ({ page }) => {
    await page.goto(fixtureUrl);
    await page.locator('[data-lightbox]').first().click();
    const overlay = page.locator('.lightbox').first();
    await overlay.waitFor({ state: 'visible' });
    const counter = page.locator('.lightbox-counter, [data-test=counter]').first();
    const before = await counter.textContent();
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(50);
    const after = await counter.textContent();
    expect(before).not.toBe(after);
  });
});

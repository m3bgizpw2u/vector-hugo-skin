// Phase 9 spec — sidebar collapse / pin interaction parity.
//
// Vector's sidebar collapses to icon-only mode on desktop by
// clicking the "hide" button in the header. The static port mirrors
// this with assets/js/modules/sidebar.ts — toggling the .sidebar-
// icon-only class on <body> or on a sidebar state container.
//
// Spec verifies the toggle button, the resulting class state on
// <html>, and the persistence to localStorage so the choice
// survives a page reload.
//
// Run: `npm run test:e2e -- interactions.sidebar.spec.ts`

import { test, expect } from '@playwright/test';

const fixtureUrl = '/articles/long-article-with-toc/';

test.describe('sidebar collapse interaction', () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test('toggle button is present in the header on desktop', async ({ page }) => {
    await page.goto(fixtureUrl);
    const toggle = page.locator(
      '[data-sidebar-toggle], button[aria-controls*="sidebar"], button[aria-label*="sidebar" i]',
    );
    await expect(toggle.first()).toBeVisible();
  });

  test('clicking the toggle adds the icon-only class', async ({ page }) => {
    await page.goto(fixtureUrl);
    const before = await page.evaluate(() =>
      document.documentElement.classList.contains('sidebar-icon-only'),
    );
    const toggle = page
      .locator(
        '[data-sidebar-toggle], button[aria-controls*="sidebar"], button[aria-label*="sidebar" i]',
      )
      .first();
    await toggle.click();
    const after = await page.evaluate(() =>
      document.documentElement.classList.contains('sidebar-icon-only'),
    );
    expect(before).not.toBe(after);
  });

  test('collapsed state persists across reload', async ({ page }) => {
    await page.goto(fixtureUrl);
    const toggle = page
      .locator(
        '[data-sidebar-toggle], button[aria-controls*="sidebar"], button[aria-label*="sidebar" i]',
      )
      .first();
    await toggle.click();
    await page.waitForTimeout(50);
    await page.reload();
    const isCollapsed = await page.evaluate(() =>
      document.documentElement.classList.contains('sidebar-icon-only'),
    );
    expect(isCollapsed).toBe(true);
  });
});
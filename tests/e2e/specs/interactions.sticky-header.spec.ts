// Phase 9 spec — sticky-header interaction parity.
//
// Vector 2022 collapses the full personal-tools / search / language
// portlet bar into a compact condensed bar once the user scrolls
// past the threshold (Vector uses 96px in resources/skins.vector.js
// /watchScrolling.js). Our port implements the same behavior in
// assets/js/modules/sticky-header.ts.
//
// Spec verifies that, on a long-article fixture, the condensed bar
// appears once we scroll past the threshold, and disappears when
// we return to the top.
//
// Run: `npm run test:e2e -- interactions.sticky-header.spec.ts`

import { test, expect } from '@playwright/test';

const longArticleUrl = '/articles/long-article-with-toc/';

test.describe('sticky header interaction', () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test('condensed bar is hidden at scroll-y = 0', async ({ page }) => {
    await page.goto(longArticleUrl);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(50);
    const condensedVisible = await page
      .locator('[data-sticky-header-condensed], .sticky-header-condensed')
      .first()
      .evaluate((el) => {
        const style = getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden';
      })
      .catch(() => false);
    expect(condensedVisible).toBe(false);
  });

  test('condensed bar appears after scrolling past threshold', async ({ page }) => {
    await page.goto(longArticleUrl);
    await page.evaluate(() => window.scrollTo(0, 400));
    await page.waitForTimeout(150);
    const condensedVisible = await page
      .locator('[data-sticky-header-condensed], .sticky-header-condensed')
      .first()
      .evaluate((el) => {
        const style = getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden';
      })
      .catch(() => false);
    expect(condensedVisible).toBe(true);
  });

  test('condensed bar disappears after scrolling back to top', async ({ page }) => {
    await page.goto(longArticleUrl);
    await page.evaluate(() => window.scrollTo(0, 400));
    await page.waitForTimeout(150);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(150);
    const condensedVisible = await page
      .locator('[data-sticky-header-condensed], .sticky-header-condensed')
      .first()
      .evaluate((el) => {
        const style = getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden';
      })
      .catch(() => false);
    expect(condensedVisible).toBe(false);
  });
});
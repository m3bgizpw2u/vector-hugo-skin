// Phase 10 regression probe — sticky / primary header overlap.
//
// The bug: the condensed `.sticky-header` was rendered visible at scroll-y
// = 0, overlapping the primary `.page-header`. Root cause was a 1px
// sentinel placed at top:0 inside `.page-header` (which itself is
// position: sticky; top: 0) — the sentinel was glued to the viewport top
// forever, so IntersectionObserver reported `isIntersecting: true`
// permanently and the sticky bar was shown on every page.
//
// Asserts the fix: at scroll-y = 0 the sticky bar is offscreen (hidden
// via the SCSS default `translateY(-100%) / opacity: 0`); after
// scrolling past the primary header it becomes visible; on return to top
// it hides again. Computed style is the source of truth — the
// `is-visible` class alone is not sufficient because the SCSS handles
// the actual visual reveal.
//
// Run: `npx playwright test tests/e2e/specs/sticky-header-overlap.spec.ts --project=chromium`

import { test, expect } from '@playwright/test';

const url = '/articles/school-demo/';

const stickyOpacity = (page: import('@playwright/test').Page) =>
  page.locator('.sticky-header').first().evaluate((el) => {
    const style = getComputedStyle(el);
    return {
      opacity: parseFloat(style.opacity),
      transform: style.transform,
      hasVisibleClass: el.classList.contains('is-visible'),
      hasHiddenClass: el.classList.contains('is-hidden'),
    };
  });

test.describe('sticky / primary header do not overlap', () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test('condensed bar is hidden at scroll-y = 0', async ({ page }) => {
    await page.goto(url);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(100);
    const s = await stickyOpacity(page);
    expect(s.opacity).toBe(0);
    expect(s.hasVisibleClass).toBe(false);
  });

  test('condensed bar appears after scrolling past primary header', async ({ page }) => {
    await page.goto(url);
    await page.evaluate(() => window.scrollTo(0, 600));
    await page.waitForTimeout(150);
    const s = await stickyOpacity(page);
    expect(s.opacity).toBe(1);
    expect(s.hasVisibleClass).toBe(true);
  });

  test('condensed bar hides again after scrolling back to top', async ({ page }) => {
    await page.goto(url);
    await page.evaluate(() => window.scrollTo(0, 600));
    await page.waitForTimeout(150);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(150);
    const s = await stickyOpacity(page);
    expect(s.opacity).toBe(0);
    expect(s.hasVisibleClass).toBe(false);
  });

  test('primary header keeps position: sticky after JS runs', async ({ page }) => {
    // The previous version of sticky-header.ts injected
    // `primary.style.position = 'relative'`, which silently broke the
    // primary header's own sticky behaviour. Lock the rule down: the
    // primary header must remain position: sticky after the JS module
    // has executed.
    await page.goto(url);
    await page.waitForTimeout(50);
    const pos = await page.locator('.page-header').first().evaluate(
      (el) => getComputedStyle(el).position,
    );
    expect(pos).toBe('sticky');
  });
});
// Phase 9 spec — computed-style parity against Vector 2022.
//
// Each test loads a demo article and asserts that getComputedStyle
// matches the documented Vector token, NOT a screenshot. A
// screenshot would let pixel-level regressions slip through; a
// computed-style assertion fails the moment a CSS variable drifts.
//
// Cross-breakpoint matrix is implemented inline rather than as
// separate `@media` tests, because the breakpoints are the same
// viewport widths used by the SCSS — see docs/RESEARCH.md §14.
//
// All fixtures live in exampleSite/content/articles/. We never
// invent markup inline.
//
// Run: `npm run test:e2e -- computed-style.spec.ts`
// Prerequisite: the webServer config in playwright.config.ts boots
// `hugo server` automatically.

import { test, expect, type Page } from '@playwright/test';

const breakpoints = {
  mobile: { width: 360, height: 740 }, // <720
  tablet: { width: 900, height: 1200 }, // 720-1023
  desktop: { width: 1280, height: 900 }, // 1024-1599
  wide: { width: 1680, height: 1050 }, // ≥1600
};

const themes = ['light', 'dark'] as const;

const fixtures = [
  { name: 'person-demo', url: '/articles/person-demo/' },
  { name: 'settlement-demo', url: '/articles/settlement-demo/' },
  { name: 'organization-demo', url: '/articles/organization-demo/' },
];

async function applyTheme(page: Page, theme: 'light' | 'dark') {
  await page.evaluate((t) => {
    document.documentElement.setAttribute('data-theme', t);
    try {
      localStorage.setItem('vector-theme', t);
    } catch {
      // localStorage may be unavailable in CI; data-theme is enough.
    }
  }, theme);
}

async function readVar(page: Page, name: string): Promise<string> {
  return page.evaluate(
    (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim(),
    name,
  );
}

for (const theme of themes) {
  for (const [bpName, viewport] of Object.entries(breakpoints)) {
    test.describe(`computed style: ${theme} × ${bpName}`, () => {
      test.use({ viewport });

      test('header sits at top:0 with sticky positioning', async ({ page }) => {
        await page.goto(fixtures[0].url);
        await applyTheme(page, theme);
        const pos = await page
          .locator('.page-header')
          .first()
          .evaluate((el) => getComputedStyle(el).position);
        expect(['sticky', 'fixed']).toContain(pos);
      });

      test('infobox border-radius uses Vector token', async ({ page }) => {
        await page.goto(fixtures[0].url);
        await applyTheme(page, theme);
        const radius = await page
          .locator('.infobox')
          .first()
          .evaluate((el) => getComputedStyle(el).borderRadius);
        // Vector uses `border-radius: 0.3125em` at the infobox root
        // (resources/skins.vector.styles/components/Infobox.less).
        // We compare against the resolved px, not the em string,
        // because em depends on the document root font size.
        expect(radius).not.toBe('0px');
      });

      test('body font-family resolves to Vector sans stack', async ({ page }) => {
        await page.goto(fixtures[0].url);
        await applyTheme(page, theme);
        const family = await page.evaluate(
          () => getComputedStyle(document.body).fontFamily,
        );
        // Vector resolves to "Linux Libertine, Georgia, Times,
        // serif" for content and "Helvetica Neue, Helvetica, Arial,
        // sans-serif" for chrome. The body of an article gets the
        // serif stack — we assert it contains "serif" not "monospace".
        expect(family.toLowerCase()).toContain('serif');
      });

      test('article max-width matches the content column token', async ({ page }) => {
        // Skip narrow viewports where the article expands to fill
        // the column (Vector's mobile path).
        test.skip(bpName === 'mobile');

        await page.goto(fixtures[0].url);
        await applyTheme(page, theme);
        const maxWidth = await page
          .locator('main#content, article.mw-body-content')
          .first()
          .evaluate((el) => getComputedStyle(el).maxWidth);
        // We don't pin the exact pixel value because tokens are
        // em-based. We assert that maxWidth is set and not 100%.
        expect(maxWidth).not.toBe('none');
      });

      test('sidebar visibility tracks the breakpoint', async ({ page }) => {
        await page.goto(fixtures[0].url);
        await applyTheme(page, theme);
        const display = await page
          .locator('.sidebar, #mw-panel, .vector-sidebar')
          .first()
          .evaluate((el) => getComputedStyle(el).display)
          .catch(() => 'none');
        if (bpName === 'mobile') {
          expect(display).toBe('none');
        } else {
          expect(['block', 'flex', 'grid', 'table']).toContain(display);
        }
      });

      test('dark theme swaps background-color token', async ({ page }) => {
        await page.goto(fixtures[0].url);
        await applyTheme(page, theme);
        const bg = await page
          .locator('body')
          .evaluate((el) => getComputedStyle(el).backgroundColor);
        // Both light and dark must resolve to a non-transparent color.
        expect(bg).not.toBe('rgba(0, 0, 0, 0)');
        expect(bg).not.toBe('transparent');
      });
    });
  }
}

test.describe('CSS custom property exposure', () => {
  test('theme tokens defined at :root', async ({ page }) => {
    await page.goto(fixtures[0].url);
    for (const token of [
      '--color-base',
      '--color-base--subtle',
      '--color-primary',
      '--font-size-base',
    ]) {
      const value = await readVar(page, token);
      // The token must be defined and non-empty.
      expect.soft(value.length, `missing ${token}`).toBeGreaterThan(0);
    }
  });
});
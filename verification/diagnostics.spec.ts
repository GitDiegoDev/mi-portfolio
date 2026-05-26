import { test, expect } from '@playwright/test';

const breakpoints = [
  { width: 320, height: 568, name: 'mobile-small' },
  { width: 375, height: 667, name: 'mobile-medium' },
  { width: 414, height: 896, name: 'mobile-large' },
  { width: 768, height: 1024, name: 'tablet' },
  { width: 1024, height: 768, name: 'desktop-small' },
  { width: 1440, height: 900, name: 'desktop-large' },
];

test('Verify mobile-first and no horizontal overflow', async ({ page }) => {
  await page.goto('http://localhost:8000');

  for (const bp of breakpoints) {
    await page.setViewportSize({ width: bp.width, height: bp.height });
    await page.waitForTimeout(500); // Wait for styles to settle

    const dimensions = await page.evaluate(() => {
      return {
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      };
    });

    console.log(`Breakpoint ${bp.name} (${bp.width}px): ScrollWidth=${dimensions.scrollWidth}, ClientWidth=${dimensions.clientWidth}`);

    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);

    await page.screenshot({
      path: `verification/screenshots/final_${bp.name}.png`,
      fullPage: true
    });
  }
});

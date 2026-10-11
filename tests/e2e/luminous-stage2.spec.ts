import { test, expect } from '@playwright/test'

test.use({ viewport: { width: 390, height: 844 } })

const checks = [
  { path: '/', selector: '.xk-light-worlds .xk-light-world', expectedCount: 4 },
  { path: '/world-of-xethkioz/elemental-realms', selector: '#alpha-2 video', expectedCount: 1 },
  { path: '/digital', selector: '#veyr', expectedCount: 1 },
  { path: '/green-node', selector: '#green-title', expectedCount: 1 },
  { path: '/mascotas/', selector: 'main', expectedCount: 1 },
] as const

for (const { path, selector, expectedCount } of checks) {
  test('Luminous stage 2 mobile smoke: ' + path, async ({ page }) => {
    const response = await page.goto(path, { waitUntil: 'domcontentloaded' })
    expect(response?.status()).toBeLessThan(400)
    await expect(page.locator(selector).first()).toBeVisible()
    expect(await page.locator(selector).count()).toBeGreaterThanOrEqual(expectedCount)
    const overflow = await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body?.scrollWidth ?? 0) - innerWidth)
    expect(overflow, path + ' horizontal overflow').toBeLessThanOrEqual(2)
  })
}

test('Luminous stage 2 desktop links preserve all four portals', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await expect(page.locator('.xk-light-worlds .xk-light-world')).toHaveCount(4)
  for (const href of ['/world-of-xethkioz/elemental-realms', '/mascotas/', '/digital', '/green-node']) {
    expect(await page.locator('.xk-light-worlds a').evaluateAll((nodes, expected) => nodes.some(n => (n as HTMLAnchorElement).getAttribute('href') === expected), href)).toBe(true)
  }
  const overflow = await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth)
  expect(overflow).toBeLessThanOrEqual(2)
})

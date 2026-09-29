import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { readFileSync } from 'node:fs'

// Local fixtures only. Never register visits or submit real community posts during QA.
test.beforeEach(async ({ page }) => {
  await page.route('**/rest/v1/pet_posts?**', route => route.fulfill({ json: [] }))
  await page.route('**/api/huellas-stats', route => route.fulfill({ json: {
    visits: 12345, active_posts: 4, reunited: 2, adoptions: 1, registrationAvailable: true,
  } }))
})

test('Huellas: late-mounted community statistics keep nature contrast and fit every viewport', async ({ page }, info) => {
  test.setTimeout(90_000)
  for (const width of [320, 390, 691, 980, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/mascotas/')
    const stats = page.locator('.community-stats')
    await expect(stats.locator('[data-stat="visits"]')).toHaveText('12.345')
    await stats.scrollIntoViewIfNeeded()
    await expect(stats.locator('.community-stat')).toHaveCount(4)
    await expect(stats.locator('.community-stat').first()).toHaveCSS('background-color', 'rgba(255, 255, 255, 0.72)')
    await expect(stats.locator('strong').first()).toHaveCSS('color', 'rgb(35, 75, 45)')
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
    const result = await new AxeBuilder({ page }).include('.community-stats').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
    expect(result.violations).toEqual([])
    if ([390, 1440].includes(width)) await stats.screenshot({ path: info.outputPath(`community-${width}.png`) })
  }
})

test('Huellas: unavailable statistics remain readable without invented counts', async ({ page }) => {
  await page.route('**/api/huellas-stats', route => route.fulfill({ status: 503, json: { error: 'unavailable' } }))
  await page.setViewportSize({ width: 320, height: 844 })
  await page.goto('/mascotas/')
  const stats = page.locator('.community-stats')
  await expect(stats.locator('.community-stats-live')).toContainText('temporalmente no disponibles')
  await expect(stats.locator('[data-stat="visits"]')).toHaveText('—')
  await stats.scrollIntoViewIfNeeded()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
  const result = await new AxeBuilder({ page }).include('.community-stats').analyze()
  expect(result.violations).toEqual([])
})

test('Huellas: fireflies pause offscreen, preserve the switch and follow system motion changes', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/mascotas/')
  const fx = page.locator('.nature-fireflies'), button = page.locator('.pet-portal-effects')
  await expect(fx).toHaveAttribute('data-running', 'true')
  await button.click()
  await expect(fx).toHaveAttribute('data-running', 'false')
  await page.reload()
  await expect(button).toHaveAttribute('aria-pressed', 'false')
  await button.click()
  await expect(fx).toHaveAttribute('data-running', 'true')
  await page.locator('.community-stats').scrollIntoViewIfNeeded()
  await expect(fx).toHaveAttribute('data-running', 'false')
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await expect(fx).toHaveAttribute('data-running', 'true')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(button).toHaveAttribute('aria-pressed', 'false')
  await expect(fx).toHaveAttribute('data-running', 'false')
  await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'auto')
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await expect(fx).toHaveAttribute('data-running', 'true')
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pagehide')))
  await expect(fx).toHaveAttribute('data-running', 'false')
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true })))
  await expect(fx).toHaveAttribute('data-running', 'true')
  await page.setViewportSize({ width: 390, height: 844 })
  await expect(page.locator('.nature-fireflies i:visible')).toHaveCount(3)
})

test('Huellas: version endpoint and community footer match the release package', async ({ page }) => {
  const version = JSON.parse(readFileSync('package.json', 'utf8')).version
  await page.goto('/mascotas/')
  await expect(page.locator('.footer-grid')).toContainText(`v${version}`)
  const response = await page.request.get('/version.json')
  expect((await response.json()).version).toBe(version)
})

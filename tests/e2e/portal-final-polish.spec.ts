import { test, expect } from '@playwright/test'
const key = 'xethkioz.portal-effects'

test.beforeEach(async ({ page }) => {
  // Test data stays inside intercepted responses, never in live statistics.
  await page.route('**/api/huellas-stats', route => route.fulfill({ json: { visits: 12, active_posts: 0, reunited: 1, adoptions: 0, registrationAvailable: true } }))
  await page.route('**/rest/v1/pet_posts?**', route => route.fulfill({ json: [] }))
})

test('Final polish: nature navigation stays opaque and clickable over scrolled content', async ({ page }) => {
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/mascotas/')
    await page.locator('.community-stats').scrollIntoViewIfNeeded()
    const header = page.locator('.top')
    await expect(header).toHaveCSS('background-color', 'rgb(9, 23, 17)')
    expect(await header.evaluate(el => Math.abs(el.getBoundingClientRect().top))).toBeLessThan(1)
    expect(await page.locator('.back').evaluate(el => { const r = el.getBoundingClientRect(); return el.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)) })).toBe(true)
  }
})

test('Final polish: reduced motion pauses temporarily without changing the explicit preference', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.addInitScript(k => localStorage.setItem(k, 'on'), key)
  await page.goto('/')
  const html = page.locator('html'), button = page.locator('.portal-effects-toggle')
  await expect(html).toHaveAttribute('data-portal-effects', 'on')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(button).toHaveAttribute('aria-pressed', 'false')
  await expect(button).toHaveAttribute('aria-disabled', 'true')
  expect(await page.evaluate(k => localStorage.getItem(k), key)).toBe('on')
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await expect(html).toHaveAttribute('data-portal-effects', 'on')
  await button.click()
  await expect(html).toHaveAttribute('data-portal-effects', 'off')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await expect(button).toHaveAttribute('aria-pressed', 'false')
  expect(await page.evaluate(k => localStorage.getItem(k), key)).toBe('off')
})

test('Final polish: data saver pauses effects without discarding the saved choice', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.addInitScript(k => {
    localStorage.setItem(k, 'on')
    const network = Object.assign(new EventTarget(), { saveData: true })
    Object.defineProperty(navigator, 'connection', { configurable: true, value: network })
  }, key)
  await page.goto('/digital')
  await expect(page.locator('html')).toHaveAttribute('data-portal-effects', 'off')
  await expect(page.locator('.portal-effects-toggle')).toHaveAttribute('aria-disabled', 'true')
  expect(await page.evaluate(k => localStorage.getItem(k), key)).toBe('on')
  await page.evaluate(() => {
    const network = (navigator as Navigator & { connection: EventTarget & { saveData: boolean } }).connection
    network.saveData = false; network.dispatchEvent(new Event('change'))
  })
  await expect(page.locator('html')).toHaveAttribute('data-portal-effects', 'on')
})

test('Final polish: page lifecycle pauses particles and resumes only a visible page', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/digital')
  const fx = page.locator('.portal-fx').first()
  await expect(fx).toHaveAttribute('data-running', 'true')
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pagehide')))
  await expect(fx).toHaveAttribute('data-running', 'false')
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true })))
  await expect(fx).toHaveAttribute('data-running', 'true')
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true })
    document.dispatchEvent(new Event('visibilitychange'))
  })
  await expect(fx).toHaveAttribute('data-running', 'false')
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => false })
    document.dispatchEvent(new Event('visibilitychange'))
  })
  await expect(fx).toHaveAttribute('data-running', 'true')
})

test('Final polish: keyboard focus leaving the menu closes it without stealing focus', async ({ page }) => {
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 }); await page.goto('/')
    const consent = page.getByRole('button', { name: /solo esenciales/i }).first()
    if (await consent.isVisible()) await consent.click()
    const toggle = page.locator('.portal-navigation__controls button[aria-controls]')
    await toggle.click(); await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await page.locator('.portal-navigation__more a').last().focus(); await page.keyboard.press('Tab')
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await expect(page.locator('.portal-navigation__more')).toBeHidden()
    await toggle.click(); await page.keyboard.press('Escape')
    await expect(toggle).toBeFocused(); await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
  }
})

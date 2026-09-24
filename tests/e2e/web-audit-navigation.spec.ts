import { test, expect, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

async function essentials(page: Page) {
  const button = page.getByRole('button', { name: /solo esenciales|essential only/i }).first()
  if (await button.isVisible()) await button.click()
}
async function openMenu(page: Page) {
  await expect(page.locator('.xkf-header')).toBeVisible()
  const summary = page.locator('button.xkf-mobile')
  if (await summary.isVisible()) await summary.click()
}

test('WEB-02: discover the game from English Home, switch language, preserve anchors and canonical', async ({ page }) => {
  await page.goto('/en'); await essentials(page)
  await page.locator('.wox-actions a').first().click()
  await expect(page).toHaveURL(/\/en\/world-of-xethkioz$/)
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://www.xethkioz.com.ar/en/world-of-xethkioz')
  await page.locator('.wox-portal-anchor-nav a[href="#mundo"]').click()
  await page.getByRole('button', { name: 'Switch to Spanish', exact: true }).click()
  await expect(page).toHaveURL(/\/world-of-xethkioz#mundo$/)
  await expect(page.locator('html')).toHaveAttribute('lang', 'es-AR')
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', 'https://www.xethkioz.com.ar/en/world-of-xethkioz')
  await page.getByRole('button', { name: 'Cambiar a inglés', exact: true }).click()
  await expect(page).toHaveURL(/\/en\/world-of-xethkioz#mundo$/)
  await expect.poll(() => page.locator('#mundo').evaluate(el => Math.abs(el.getBoundingClientRect().top))).toBeLessThan(120)
})

for (const lang of ['es', 'en']) test(`WEB-03: fresh ${lang} visitor reaches Green Node through Wisp`, async ({ page }) => {
  const prefix = lang === 'en' ? '/en' : ''
  await page.goto(prefix || '/'); await essentials(page)
  const wisp = page.locator('.xk-wisp.is-home-entry')
  await expect(wisp).toBeVisible()
  await wisp.click()
  await expect(page).toHaveURL(new RegExp(`${prefix}/green-nodeimport { test, expect, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

async function essentials(page: Page) {
  const button = page.getByRole('button', { name: /solo esenciales|essential only/i }).first()
  if (await button.isVisible()) await button.click()
}
async function openMenu(page: Page) {
  await expect(page.locator('.xkf-header')).toBeVisible()
  const summary = page.locator('button.xkf-mobile')
  if (await summary.isVisible()) await summary.click()
}

test('WEB-02: discover the game from English Home, switch language, preserve anchors and canonical', async ({ page }) => {
  await page.goto('/en'); await essentials(page)
  await page.locator('.wox-actions a').first().click()
  await expect(page).toHaveURL(/\/en\/world-of-xethkioz$/)
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://www.xethkioz.com.ar/en/world-of-xethkioz')
  await page.locator('.wox-portal-anchor-nav a[href="#mundo"]').click()
  await page.getByRole('button', { name: 'Switch to Spanish', exact: true }).click()
  await expect(page).toHaveURL(/\/world-of-xethkioz#mundo$/)
  await expect(page.locator('html')).toHaveAttribute('lang', 'es-AR')
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', 'https://www.xethkioz.com.ar/en/world-of-xethkioz')
  await page.getByRole('button', { name: 'Cambiar a inglés', exact: true }).click()
  await expect(page).toHaveURL(/\/en\/world-of-xethkioz#mundo$/)
  await expect.poll(() => page.locator('#mundo').evaluate(el => Math.abs(el.getBoundingClientRect().top))).toBeLessThan(120)
})

))
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/GREEN NODE/i)
})
test('WEB-03: denied session storage cannot crash or silently redirect the public entry', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(window, 'sessionStorage', { get() { throw new DOMException('Blocked for test', 'SecurityError') } }))
  await page.goto('/green-node'); await essentials(page)
  await expect(page.locator('.xk-green-entry')).toBeVisible()
  await page.getByRole('button', { name: 'Entrar a Green Node' }).click()
  await expect(page.locator('.xk-green-entry')).toHaveCount(0)
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/GREEN NODE/i)
  await expect(page).toHaveURL(/\/green-node$/)
})
test('WEB-06: mobile menu closes with Escape and keeps its links above the hero', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 }); await page.goto('/'); await essentials(page)
  await openMenu(page); await expect(page.locator('.xkf-mobile')).toHaveAttribute('aria-expanded', 'true')
  expect(await page.evaluate(() => document.querySelector('.xkf-header')!.getBoundingClientRect().bottom <= document.querySelector('.wox-hero')!.getBoundingClientRect().top + 1)).toBe(true)
  await page.locator('.xkf-mobile-panel a').first().focus(); await page.keyboard.press('Escape')
  await expect(page.locator('.xkf-mobile')).toHaveAttribute('aria-expanded', 'false')
  await expect(page.locator('button.xkf-mobile')).toBeFocused()
})

test('WEB-01/07: shared navigation has no text collision across the audit viewport matrix', async ({ page }, testInfo) => {
  test.setTimeout(180_000)
  const records: unknown[] = []
  await page.addInitScript(() => window.localStorage.removeItem('xethkioz.lang'))
  for (const width of [320,360,390,430,768,1024,1366,1440]) {
    await page.setViewportSize({ width, height: 936 })
    for (const route of ['/', '/world-of-xethkioz', '/en', '/en/world-of-xethkioz']) {
      await page.goto(route); await essentials(page); await expect(page.locator('.xkf-header')).toBeVisible()
      await expect(page).toHaveURL(new RegExp(route === '/' ? '/$' : route + '$'))
      const geometry = await page.evaluate(() => {
        const header = document.querySelector('.xkf-header')!.getBoundingClientRect()
        const hero = document.querySelector('.wox-hero,.wox-portal-hero')!.getBoundingClientRect()
        const controls = Array.from(document.querySelectorAll('.xkf-header a,.xkf-header button,.xkf-header summary')).filter(el => el.getBoundingClientRect().width > 0 && el.getBoundingClientRect().height > 0)
        return { overflow: document.documentElement.scrollWidth > innerWidth + 1, headerOverHero: header.bottom > hero.top + 1, minFont: Math.min(...controls.map(el => parseFloat(getComputedStyle(el).fontSize))), minHeight: Math.min(...controls.map(el => el.getBoundingClientRect().height)) }
      })
      const intentionalHomeOverlay = width >= 1280 && (route === '/' || route === '/en')
      records.push({ width, route, intentionalHomeOverlay, ...geometry })
      expect(geometry.overflow, `${width} ${route}`).toBe(false)
      expect(geometry.headerOverHero, `${width} ${route}`).toBe(intentionalHomeOverlay)
      expect(geometry.minFont).toBeGreaterThanOrEqual(12)
      expect(geometry.minHeight).toBeGreaterThanOrEqual(43)
    }
  }
  await testInfo.attach('navigation-geometry.json', { body: JSON.stringify(records, null, 2), contentType: 'application/json' })
})
test('WEB-06: complete fantasy shell passes automated accessibility checks', async ({ page }) => {
  await page.goto('/world-of-xethkioz'); await essentials(page)
  const result = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()
  expect(result.violations).toEqual([])
})

test('WEB-01: idle launchers do not cover the initial hero actions, art caption or chapter menu', async ({ page }) => {
  for (const viewport of [{ width:390,height:844 },{ width:1440,height:936 }]) {
    await page.setViewportSize(viewport)
    for (const route of ['/', '/world-of-xethkioz']) {
      await page.goto(route); await essentials(page); await expect(page.locator('.xk-wisp')).toBeVisible()
      const hits = await page.evaluate(() => {
        const wisp = document.querySelector('.xk-wisp')!.getBoundingClientRect()
        const intersects = (r: DOMRect) => r.bottom > 0 && r.top < innerHeight && r.left < wisp.right && r.right > wisp.left && r.top < wisp.bottom && r.bottom > wisp.top
        return Array.from(document.querySelectorAll('.wox-actions a,.woxp-actions a,.wox-art-credit,.woxp-art-caption,.wox-portal-anchor-nav')).filter(el => intersects(el.getBoundingClientRect())).map(el => el.className)
      })
      expect(hits, `${viewport.width} ${route}`).toEqual([])
    }
  }
})

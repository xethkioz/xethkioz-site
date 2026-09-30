import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('xethkioz.privacy-consent.v1', JSON.stringify({ version: 1, analytics: false, marketing: false, updatedAt: new Date().toISOString() })))
})

test('Digital: four aligned desktop cards, responsive layout and course navigation', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  for (const width of [1440, 1000, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('/digital')
    const cards = page.locator('.digital-service')
    await expect(cards).toHaveCount(4)
    if (width === 1440) {
      const tops = await cards.evaluateAll(elements => elements.map(element => element.getBoundingClientRect().top))
      expect(Math.max(...tops) - Math.min(...tops)).toBeLessThan(2)
    }
    await page.getByRole('link', { name: 'Explorar cursos digitales', exact: true }).click()
    await expect(page).toHaveURL(/\/digital\/cursos$/)
    await expect(page.getByRole('heading', { level: 1, name: 'Cursos digitales' })).toBeVisible()
    await expect(page.getByRole('region', { name: 'IA — Inteligencia Artificial' })).toContainText('USD 15')
    await expect(page.getByRole('region', { name: 'Proyectos Base' })).toContainText('USD 50')
    await expect(page.locator('.portal-navigation')).toHaveCount(1)
    await expect(page.locator('.portal-footer')).toHaveCount(1)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
    await page.getByRole('link', { name: 'Volver a Xethkioz Digital', exact: true }).click()
    await expect(page).toHaveURL(/\/digital$/)
  }
  expect(errors).toEqual([])
})

test('Courses: direct links, reciprocal language metadata, language switch and accessible sections', async ({ page }) => {
  await page.goto('/digital/cursos')
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://www.xethkioz.com.ar/digital/cursos')
  const result = await new AxeBuilder({ page }).include('#main-content').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
  expect(result.violations.map(violation => ({ id: violation.id, nodes: violation.nodes.map(node => node.target) }))).toEqual([])
  await page.getByRole('button', { name: 'Cambiar a inglés' }).click()
  await expect(page).toHaveURL(/\/en\/digital\/cursos$/)
  await page.reload()
  await expect(page.getByRole('heading', { level: 1, name: 'Digital courses' })).toBeVisible()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://www.xethkioz.com.ar/en/digital/cursos')
  await expect(page.locator('link[hreflang="es-AR"]')).toHaveAttribute('href', 'https://www.xethkioz.com.ar/digital/cursos')
  await page.getByRole('link', { name: 'Back to Xethkioz Digital', exact: true }).click()
  await expect(page).toHaveURL(/\/en\/digital$/)
  await page.getByRole('link', { name: 'Explore digital courses', exact: true }).click()
  await expect(page).toHaveURL(/\/en\/digital\/cursos$/)
})

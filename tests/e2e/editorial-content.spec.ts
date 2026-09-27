import { expect, test } from '@playwright/test'

test.describe('contenido editorial 11.0', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(/^https?:\/\//, async (route) => {
      const url = new URL(route.request().url())
      if (url.hostname === '127.0.0.1' || url.hostname === 'localhost') await route.continue()
      else await route.abort()
    })
  })

  test('Huellas ofrece guías completas con límites y respaldo oficial', async ({ page }) => {
    await page.goto('/mascotas/#cuidados', { waitUntil: 'domcontentloaded' })

    await expect(page.getByRole('heading', { level: 2, name: 'Cuidados responsables' })).toBeVisible()
    const rabiesGuide = page.locator('details').filter({ hasText: 'Vacunación antirrábica' })
    await rabiesGuide.locator('summary').click()
    await expect(rabiesGuide.getByText(/Qué controlar y cuándo consultar\./i)).toBeVisible()
    await expect(page.locator('[data-knowledge-sector="pets"]').getByRole('link', { name: /SENASA/i }).first()).toHaveAttribute('href', /argentina\.gob\.ar\/senasa/)
  })
})

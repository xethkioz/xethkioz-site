import { expect, test } from '@playwright/test'

test.describe('contenido editorial 11.0', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(/^https?:\/\//, async (route) => {
      const url = new URL(route.request().url())
      if (url.hostname === '127.0.0.1' || url.hostname === 'localhost') await route.continue()
      else await route.abort()
    })
  })

  test('COMICON conserva noticias oficiales y un mini-cómic semanal funcional', async ({ page }) => {
    await page.goto('/comicon', { waitUntil: 'domcontentloaded' })

    await expect(page.getByRole('heading', { level: 1, name: /COMICON/i })).toBeVisible()
    await expect(page.getByText('Nueva entrega cada viernes')).toBeVisible()
    await expect(page.getByRole('button', { name: /02.*La ciudad detrás del código/i })).toBeEnabled()

    await page.getByRole('button', { name: /02.*La ciudad detrás del código/i }).click()
    await expect(page.getByRole('region', { name: /Lector vertical.*La ciudad detrás del código/i })).toBeVisible()
    await expect(page.getByText(/La sombra reconoció esa voz/)).toBeVisible()

    await expect(page.getByRole('heading', { name: /La semana Marvel del 12 de agosto/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /Fuente oficial: marvel.com/i })).toHaveAttribute('href', /marvel\.com\/articles\/comics/)
  })

  test('Huellas ofrece guías completas con límites y respaldo oficial', async ({ page }) => {
    await page.goto('/mascotas/#cuidados', { waitUntil: 'domcontentloaded' })

    await expect(page.getByRole('heading', { level: 2, name: 'Cuidados responsables' })).toBeVisible()
    const rabiesGuide = page.locator('details').filter({ hasText: 'Vacunación antirrábica' })
    await rabiesGuide.locator('summary').click()
    await expect(rabiesGuide.getByText(/Límite:/)).toBeVisible()
    await expect(rabiesGuide.getByRole('link', { name: /Fuente oficial: SENASA/i })).toHaveAttribute('href', /argentina\.gob\.ar\/senasa/)
  })
})

import { expect, test } from '@playwright/test'

async function mockPetFeed(page: import('@playwright/test').Page) {
  await page.route('https://pascicauudfyydzknoop.supabase.co/rest/v1/pet_posts**', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
  })
}

test.describe('Huellas Argentina · expansión nacional', () => {
  test.beforeEach(async ({ page }) => {
    await mockPetFeed(page)
  })

  test('expone las 24 jurisdicciones y permite publicar con provincia + localidad', async ({ page }) => {
    await page.goto('/mascotas/', { waitUntil: 'domcontentloaded' })
    await expect(page.getByRole('heading', { level: 1, name: 'Huellas Argentina' })).toBeVisible()
    await expect(page.locator('.province-chip')).toHaveCount(24)

    await page.getByRole('button', { name: /Publicar/ }).first().click()
    const province = page.locator('#province')
    await expect(province.locator('option')).toHaveCount(24)
    await expect(province.locator('option', { hasText: 'Tierra del Fuego' })).toHaveCount(1)
    await expect(page.locator('#locality')).toHaveAttribute('placeholder', /Puan, Córdoba Capital, Ushuaia/)
  })

  test('directorio muestra fuentes nacionales y recursos de varias provincias', async ({ page }) => {
    await page.goto('/mascotas/#directorio', { waitUntil: 'domcontentloaded' })
    await expect(page.getByRole('heading', { level: 2, name: 'Protectoras, veterinarias y ayuda oficial' })).toBeVisible()
    await expect(page.getByText('Federación Veterinaria Argentina (FeVA)')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Proyecto 4 Patas' })).toBeVisible()

    await page.locator('#directoryProvince').selectOption({ label: 'Córdoba' })
    await expect(page.getByText('Colegio Médico Veterinario de Córdoba')).toBeVisible()
    await expect(page.getByText('BioCórdoba · Programa de adopción')).toBeVisible()

    await page.locator('#directoryProvince').selectOption({ label: 'Santa Fe' })
    await expect(page.getByText('Rosario · Red de Salud Animal')).toBeVisible()
    await expect(page.getByText('Centro de Adopción Animal Municipal de Rosario')).toBeVisible()
  })

  test('donaciones explica el destino y usa los canales de apoyo correctos', async ({ page }) => {
    await page.goto('/mascotas/#donaciones', { waitUntil: 'domcontentloaded' })
    await expect(page.getByRole('heading', { level: 2, name: 'Donaciones para Huellas Argentina' })).toBeVisible()
    await expect(page.getByText(/Aporte voluntario/)).toBeVisible()
    await expect(page.getByRole('link', { name: /PayPal/ })).toHaveAttribute('href', 'https://www.paypal.com/ncp/payment/VT4476UQ76F4S')
    await expect(page.locator('[data-copy-alias="xethkioz"]')).toContainText('Alias: xethkioz')
    await expect(page.getByRole('link', { name: /XETHKIOZ Support/ })).toHaveAttribute('href', '/support')
  })

  test('no introduce desborde horizontal en desktop ni mobile', async ({ page }) => {
    for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 1000 }]) {
      await page.setViewportSize(viewport)
      await page.goto('/mascotas/', { waitUntil: 'domcontentloaded' })
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1)

      await page.getByRole('button', { name: /Directorio/ }).first().click()
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1)

      await page.getByRole('button', { name: /Donaciones/ }).first().click()
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1)
    }
  })
})

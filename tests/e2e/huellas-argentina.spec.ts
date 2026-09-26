import { expect, test } from '@playwright/test'

test('Huellas Argentina cubre todo el país y expone recursos nacionales', async ({ page }) => {
  await page.goto('/mascotas/', { waitUntil: 'networkidle' })
  await expect(page).toHaveTitle(/Huellas Argentina/i)
  await expect(page.getByRole('heading', { level: 1, name: /Huellas/i })).toContainText('Huellas')
  await expect(page.getByText('Red comunitaria animal de Argentina', { exact: false })).toBeVisible()

  const provinceSelect = page.locator('#province')
  expect(await provinceSelect.locator('option').count()).toBe(24)
  await expect(provinceSelect.locator('option')).toContainText(['Buenos Aires','CABA','Tierra del Fuego','Tucumán'])

  await page.locator('button[data-section="organizaciones"]').click()
  await expect(page.getByRole('heading', { name: /Protectoras, refugios y organizaciones/i })).toBeVisible()
  await expect(page.getByText('Proyecto 4 Patas', { exact: true })).toBeVisible()
  await expect(page.getByText('Fundación Viva la Vida', { exact: true })).toBeVisible()
  await expect(page.getByText('Federación Veterinaria Argentina', { exact: true })).toBeVisible()

  await page.locator('button[data-section="veterinarias"]').click()
  await expect(page.getByText('Hospital Escuela FCV UBA', { exact: true })).toBeVisible()
  await expect(page.getByText('Hospital Escuela FCV UNLP', { exact: true })).toBeVisible()
  await expect(page.getByText('Hospital Escuela FCV UNL', { exact: true })).toBeVisible()

  await page.getByRole('button', { name: /Donaciones/i }).click()
  await expect(page.getByRole('link', { name: /PayPal/i })).toHaveAttribute('href', 'https://www.paypal.com/ncp/payment/VT4476UQ76F4S')
  await expect(page.getByRole('link', { name: /Mercado Pago/i })).toHaveAttribute('href', 'https://link.mercadopago.com.ar/xethkioz')
  await expect(page.locator('#donar .donation-card').first()).toContainText('Alias Mercado Pago: xethkioz')

  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy()
})

test('Huellas Argentina publica provincia + localidad sin domicilio exacto', async ({ page }) => {
  await page.goto('/mascotas/#publicar', { waitUntil: 'networkidle' })
  await expect(page.locator('#publicar')).toHaveClass(/active/)
  await expect(page.locator('select[name="province"]')).toBeVisible()
  await expect(page.locator('input[name="locality"]')).toBeVisible()
  await expect(page.getByText(/No publiques domicilio exacto/i)).toBeVisible()
  await expect(page.locator('select[name="province"] option')).toHaveCount(24)
})
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

test('Huellas mantiene Publicar visible y la cabecera sin solapamientos en escritorio', async ({ page }) => {
  for (const width of [1180, 1440, 1918]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/mascotas/', { waitUntil: 'networkidle' })
    const publish = page.locator('.header-publish')
    const back = page.locator('.back')
    await expect(publish).toBeVisible()
    await expect(back).toBeVisible()
    const geometry = await page.evaluate(() => {
      const rect = (selector: string) => document.querySelector(selector)!.getBoundingClientRect()
      const a = rect('.header-publish')
      const b = rect('.back')
      const overlap = !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom)
      return {
        overlap,
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        publishRight: a.right,
        viewport: innerWidth,
      }
    })
    expect(geometry.overlap, `header overlap at ${width}px`).toBe(false)
    expect(geometry.overflow, `horizontal overflow at ${width}px`).toBe(false)
    expect(geometry.publishRight).toBeLessThanOrEqual(geometry.viewport + 1)
    if (width >= 1800) {
      const aligned = await page.evaluate(() => {
        const publish = document.querySelector('.header-publish')!.getBoundingClientRect()
        const back = document.querySelector('.back')!.getBoundingClientRect()
        return Math.abs(publish.y - back.y) < 8
      })
      expect(aligned, 'wide desktop actions should share one row').toBe(true)
    }
  }
})

test('Huellas usa naturaleza luminosa y mantiene mascotas visibles en el hero', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/mascotas/', { waitUntil: 'networkidle' })
  const petArt = page.locator('.hero-photo')
  await expect(petArt).toBeVisible()
  await expect(petArt).toHaveAttribute('src', '/assets/huellas-hero-real.svg')
  const visual = await page.evaluate(() => {
    const hero = document.querySelector('.hero')!
    const pet = document.querySelector('.hero-photo')!
    return {
      petOpacity: Number.parseFloat(getComputedStyle(pet).opacity),
      portalBackground: getComputedStyle(hero, '::before').backgroundImage,
      actionBackground: getComputedStyle(document.querySelector('.action-card')!).backgroundImage,
    }
  })
  expect(visual.petOpacity).toBeGreaterThanOrEqual(.3)
  expect(visual.portalBackground).toContain('nature-portal.webp')
  expect(visual.actionBackground).toContain('linear-gradient')
})

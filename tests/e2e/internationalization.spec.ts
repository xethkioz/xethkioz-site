import { expect, test } from '@playwright/test'

const SITE_URL = 'https://www.xethkioz.com.ar'

test.describe('internacionalización indexable', () => {
  test('la ruta inglesa de Gaming expone idioma, canonical y alternates', async ({ page }) => {
    const response = await page.goto('/en/gaming', { waitUntil: 'domcontentloaded' })
    expect(response?.status()).toBeLessThan(400)

    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${SITE_URL}/en/gaming`)
    await expect(page.locator('link[rel="alternate"][hreflang="es-AR"]')).toHaveAttribute('href', `${SITE_URL}/gaming`)
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', `${SITE_URL}/en/gaming`)
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute('href', `${SITE_URL}/gaming`)
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', 'en_US')
  })

  test('el selector de idioma conserva la sección actual', async ({ page }) => {
    await page.goto('/gaming')
    const header = page.getByRole('banner')
    await header.getByRole('button', { name: 'Cambiar a inglés' }).click()
    await expect(page).toHaveURL(/\/en\/gaming$/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')

    await header.getByRole('button', { name: 'Switch to Spanish' }).click()
    await expect(page).toHaveURL(/\/gaming$/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'es-AR')
  })

  test('la navegación principal y el footer conservan el prefijo inglés', async ({ page }) => {
    await page.goto('/en/science')

    await expect(page.getByRole('link', { name: 'Gaming', exact: true }).first()).toHaveAttribute('href', '/en/gaming')
    await expect(page.getByRole('link', { name: 'Fun', exact: true }).first()).toHaveAttribute('href', '/en/fun')
    await expect(page.getByRole('link', { name: 'About us', exact: true })).toHaveAttribute('href', '/en/about')
    await expect(page.getByRole('link', { name: 'Editorial policy', exact: true })).toHaveAttribute('href', '/en/editorial-policy')
  })

  test('una preferencia inglesa persistida lleva a la URL inglesa sin usar geolocalización', async ({ page }) => {
    await page.addInitScript(() => window.localStorage.setItem('xethkioz.lang', 'en'))
    await page.goto('/science')
    await expect(page).toHaveURL(/\/en\/science$/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  })

  test('Noticias no publica una traducción inglesa inexistente', async ({ page }) => {
    await page.goto('/news')
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${SITE_URL}/news`)
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveCount(0)

    const response = await page.goto('/en/news')
    expect(response?.status()).toBeLessThan(500)
    await expect(page.getByRole('heading', { level: 1, name: '404' })).toBeVisible()
  })
})

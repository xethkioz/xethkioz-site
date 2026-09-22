import { expect, test, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

async function essentials(page: Page) {
  const button = page.getByRole('button', { name: /solo esenciales|essential only/i }).first()
  if (await button.isVisible()) await button.click()
}
test.beforeEach(async ({ page }) => {
  await page.route(/^https?:\/\//, async route => {
    const url = new URL(route.request().url())
    if (['127.0.0.1', 'localhost'].includes(url.hostname)) await route.continue()
    else await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
  })
})
const routes = ['/gaming', '/en/gaming', '/news', '/creacion-web', '/en/creacion-web']
for (const route of routes) {
  test(`${route}: jerarquía, enlaces y lectura responsive`, async ({ page }, info) => {
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto(route); await essentials(page)
      await expect(page.locator('.xke-page h1')).toBeVisible()
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(2)
      await expect(page.locator('.xke-page video, .xke-page iframe, .xke-page canvas')).toHaveCount(0)
      if (width === 390 || width === 1440) await page.screenshot({ path: info.outputPath(`view-${width}.png`), fullPage: false })
      const links = page.locator('.xke-crosslinks nav a')
      await expect(links.nth(0)).toHaveAttribute('href', 'https://www.xethkioz.com.ar')
      await expect(links.nth(1)).toHaveAttribute('href', 'https://www.threads.com/@xethkioz')
      await expect(links.nth(2)).toHaveAttribute('href', route.startsWith('/en/') ? '/en/world-of-xethkioz' : '/world-of-xethkioz')
      expect((await page.locator('.xke-page').innerText())).not.toMatch(/Nexus City|MMORPG en desarrollo|PUBLICATION_STATUS|NEWS_ENGINE/)
    }
    expect(errors).toEqual([])
  })
  test(`${route}: accesibilidad de la superficie editorial`, async ({ page }) => {
    await page.goto(route); await essentials(page)
    await expect(page.locator('.xke-page h1')).toBeVisible()
    const result = await new AxeBuilder({ page }).include('.xke-page').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()
    expect(result.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) }))).toEqual([])
  })
}
test('Gaming mantiene cuatro rutas, elimina Directos y no consulta streams', async ({ page }) => {
  let streams = 0
  page.on('request', r => { if (r.url().includes('/rest/v1/streams')) streams++ })
  await page.goto('/en/gaming'); await essentials(page)
  await expect(page.locator('.xke-page h1')).toHaveText('Gaming library')
  expect(streams).toBe(0)
  const nav = page.getByRole('navigation', { name: 'Gaming sections' })
  await expect(nav.getByRole('button')).toHaveCount(4)
  await expect(nav.getByRole('button', { name: /Live|Directos/i })).toHaveCount(0)
  await nav.getByRole('button', { name: /Radar$/ }).click()
  await expect(page).toHaveURL(/\/en\/gaming\?section=news$/)
  await expect(page.getByRole('heading', { name: 'New updates appear on our social channels first.' })).toBeVisible()
  expect(streams).toBe(0)
  const navHeight = await page.locator('.xk-gaming-section-nav button').first().evaluate(el => parseFloat(getComputedStyle(el).minHeight))
  expect(navHeight).toBeGreaterThanOrEqual(48)
})
test('Noticias limpia filtro y búsqueda también en la URL', async ({ page }) => {
  await page.goto('/news?category=gaming&q=__no_match_editorial__'); await essentials(page)
  await expect(page.getByLabel('Buscar noticias')).toHaveValue('__no_match_editorial__')
  await expect(page.getByRole('heading', { name: 'No encontramos noticias con esos filtros' })).toBeVisible()
  const clear = page.locator('article').filter({ has: page.getByRole('heading', { name: 'No encontramos noticias con esos filtros' }) })
  await clear.getByRole('button').click()
  await expect(page).toHaveURL(/\/news$/)
  await expect(page.getByLabel('Buscar noticias')).toHaveValue('')
  await expect(page.locator('[data-news-featured-article]')).toBeVisible()
  await expect(page.locator('.xke-news-tools a')).toHaveAttribute('href','/editorial-policy')
  await expect(page.locator('.xke-page a[href="/cms/news"]')).toHaveCount(0)
})
test('Presupuesto conserva validación, foco y consentimiento sin envío real', async ({ page }) => {
  let requests = 0
  await page.route('**/api/web-quote', async route => {
    requests++
    expect(route.request().postDataJSON().consent).toBe(true)
    await route.fulfill({ status: 201, contentType: 'application/json', body: '{"ok":true,"requestId":"12345678-1234-4123-8123-123456789abc"}' })
  })
  await page.goto('/creacion-web'); await essentials(page)
  await page.getByRole('button', { name: /Continuar con mis datos/ }).click()
  expect(requests).toBe(0)
  await expect(page.getByRole('heading', { name: 'Primero, definamos la idea.' })).toBeVisible()
  await page.getByRole('button', { name: 'Agregar Creación web', exact: true }).click()
  await page.locator('#presupuesto textarea').fill('Sitio de demostración para probar la navegación y el formulario.')
  await page.getByRole('button', { name: /Continuar con mis datos/ }).click()
  await expect(page.getByRole('heading', { name: 'Ahora, ¿cómo te contactamos?' })).toBeFocused()
  await page.getByLabel('Nombre y apellido', { exact: true }).fill('Prueba editorial')
  await page.getByLabel('Email', { exact: true }).fill('qa@example.invalid')
  await page.getByRole('button', { name: 'Enviar solicitud', exact: false }).click()
  expect(requests).toBe(0)
  await page.locator('#presupuesto input[type=checkbox]').check()
  await page.getByRole('button', { name: 'Enviar solicitud', exact: false }).click()
  await expect(page.getByRole('heading', { name: 'Tu idea ya está en camino.' })).toBeVisible()
  expect(requests).toBe(1)
})

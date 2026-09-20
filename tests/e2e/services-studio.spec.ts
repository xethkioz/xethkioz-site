import { test, expect, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { normalizeSelection, buildStudioBrief, studioDetailsLimit, studioSelectionUrl, STUDIO_SERVICES, STUDIO_EXTRAS } from '../../src/data/serviceStudio'
const reference = '12345678-1234-4123-8123-123456789abc'
const details = 'Necesito organizar mis contenidos y aprender a usar herramientas de IA con datos de ejemplo.'
test.beforeEach(async ({ page }) => {
  await page.route(/^https?:\/\//, async route => {
    const url = new URL(route.request().url())
    if (['127.0.0.1', 'localhost'].includes(url.hostname)) await route.continue()
    else await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
  })
})
async function boot(page: Page, lang = 'es', query = '') {
  await page.goto(`${lang === 'en' ? '/en' : ''}/creacion-web${query}`)
  await expect(page.locator('#web-creation-title')).toBeVisible()
  const privacy = page.getByRole('button', { name: /solo esenciales|essential only/i }).first()
  if (await privacy.isVisible()) await privacy.click()
}
async function contactStep(page: Page) {
  await page.getByRole('button', { name: 'Agregar IA aplicada', exact: true }).click()
  await page.locator('#presupuesto textarea').fill(details)
  await page.getByRole('button', { name: /Continuar con mis datos/ }).click()
  await expect(page.getByRole('heading', { name: 'Ahora, ¿cómo te contactamos?' })).toBeFocused()
  await page.getByLabel('Nombre y apellido', { exact: true }).fill('Prueba Estudio')
  await page.getByLabel('Email', { exact: true }).fill('studio@example.invalid')
  await page.locator('#presupuesto input[type=checkbox]').check()
}
test('Selection is allowlisted, deduplicated and excludes incompatible extras', () => {
  expect(normalizeSelection({ services: ['pc', 'pc', 'unknown'], extras: ['identidad', 'seguimiento', 'invalid'] })).toEqual({ services: ['pc'], extras: ['seguimiento'] })
  expect(normalizeSelection(null)).toEqual({ services: [], extras: [] })
  const all = normalizeSelection({ services: STUDIO_SERVICES.map(s => s.id), extras: STUDIO_EXTRAS.map(e => e.id) })
  const limit = studioDetailsLimit(all)
  for (const lang of ['es','en'] as const) expect(buildStudioBrief(all, lang, 'x'.repeat(limit)).length).toBeLessThanOrEqual(2000)
  expect(() => buildStudioBrief(all, 'es', 'x'.repeat(limit + 1))).toThrow('BRIEF_TOO_LONG')
  expect(studioSelectionUrl(all, 'en')).not.toMatch(/email|name|details|password/)
})
for (const lang of ['es', 'en'] as const) {
  test(`Studio ${lang}: responsive, accessible, no video/3D or hidden controls`, async ({ page }, info) => {
    const errors: string[] = []; page.on('pageerror', error => errors.push(error.message))
    for (const width of [320, 390, 430, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 }); await boot(page, lang)
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(2)
      await expect(page.locator('.xks-page h1')).toHaveCount(1)
      await expect(page.locator('.xks-card')).toHaveCount(4)
      await expect(page.locator('.xks-page video,.xks-page canvas,.xks-page iframe')).toHaveCount(0)
      if (width === 390 || width === 1440) await page.screenshot({ path: info.outputPath(`studio-${lang}-${width}.png`), fullPage: false })
    }
    const audit = await new AxeBuilder({ page }).include('.xks-page').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
    expect(audit.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) }))).toEqual([])
    expect(errors).toEqual([])
  })
}
test('Bundles, filters, extras and removing services keep the basket consistent', async ({ page }) => {
  await boot(page)
  await page.getByRole('button', { name: /^Lanzar mi marca/ }).click()
  await expect(page.locator('.xks-count')).toHaveText('2 servicios seleccionados')
  await page.locator('.xks-extras').getByLabel('Identidad visual', { exact: true }).check()
  await page.getByRole('group', { name: 'Filtrar servicios' }).getByRole('button', { name: 'Soporte de PC', exact: true }).click()
  await expect(page.locator('.xks-card')).toHaveCount(1)
  await expect(page.locator('.xks-count')).toHaveText('2 servicios seleccionados')
  await page.getByRole('button', { name: 'Vaciar selección', exact: true }).click()
  await expect(page.locator('.xks-count')).toHaveText('0 servicios seleccionados')
  await expect(page.locator('.xks-extras')).toHaveCount(0)
  await page.getByRole('button', { name: 'Agregar Soporte de PC', exact: true }).click()
  await expect(page.locator('#mi-proyecto')).toContainText('Soporte de PC')
  await expect(page.locator('.xks-extras')).not.toContainText('Identidad visual')
  await page.reload(); await expect(page.locator('.xks-count')).toHaveText('1 servicio seleccionado')
  await expect(page.locator('#mi-proyecto')).toContainText('Soporte de PC')
})
test('Services work with session storage blocked and sanitize shared selections', async ({ page }) => {
  await page.addInitScript(() => { Object.defineProperty(window, 'sessionStorage', { configurable: true, get() { throw new DOMException('Denied', 'SecurityError') } }) })
  await boot(page, 'es', '?servicios=ia,ia,unknown&extras=identidad,plantilla')
  await expect(page.locator('.xks-count')).toHaveText('1 servicio seleccionado')
  await expect(page.locator('#mi-proyecto')).toContainText('Plantilla reutilizable')
  await expect(page.locator('#mi-proyecto')).not.toContainText('Identidad visual')
  await page.getByRole('button', { name: 'Agregar Contenido y diseño', exact: true }).click()
  await expect(page.locator('.xks-count')).toHaveText('2 servicios seleccionados')
})
test('Share links contain only selection IDs, with a clipboard fallback', async ({ page }) => {
  await page.addInitScript(() => { Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw new Error('Denied') } } }) })
  await boot(page); await contactStep(page)
  await page.getByRole('button', { name: 'Compartir selección', exact: true }).click()
  const link = await page.getByLabel('Enlace de selección', { exact: true }).inputValue()
  expect(link).toContain('https://www.xethkioz.com.ar/creacion-web?servicios=ia')
  expect(link).not.toContain('Prueba'); expect(link).not.toContain('studio%40'); expect(link).not.toContain('Necesito')
  const stored = await page.evaluate(() => sessionStorage.getItem('xethkioz.services.selection.v1'))
  expect(stored).toBe('{"services":["ia"],"extras":[]}')
})
test('Quote submits a bounded service brief once and requires a real reference', async ({ page }) => {
  let requests = 0
  await page.route('**/api/web-quote', async route => {
    requests++; const payload = route.request().postDataJSON()
    expect(payload.consent).toBe(true); expect(payload.serviceId).toBeNull(); expect(payload.serviceSlug).toBeNull()
    expect(payload.projectType).toBe('other'); expect(payload.details).toContain('IA aplicada'); expect(payload.details).toContain(details)
    expect(payload.details.length).toBeLessThanOrEqual(2000)
    await new Promise(resolve => setTimeout(resolve, 180))
    await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ ok: true, requestId: reference }) })
  })
  await boot(page); await contactStep(page)
  await page.locator('#presupuesto form').evaluate(form => { (form as HTMLFormElement).requestSubmit(); (form as HTMLFormElement).requestSubmit() })
  await expect(page.getByRole('heading', { name: 'Tu idea ya está en camino.' })).toBeVisible()
  await expect(page.locator('.xks-reference-id')).toContainText(reference); expect(requests).toBe(1)
  await expect(page.locator('#presupuesto')).toContainText('Todavía no hay una compra ni un pago')
})
for (const status of [200, 202, 503]) {
  test(`An unconfirmed ${status} response never shows a purchase or a received request`, async ({ page }) => {
    await page.route('**/api/web-quote', route => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(status === 503 ? { ok: false, error: 'SERVICE_UNAVAILABLE' } : { ok: true }) }))
    await boot(page); await contactStep(page)
    await page.getByRole('button', { name: /Enviar solicitud/ }).click()
    await expect(page.locator('#presupuesto [role=alert]')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Tu idea ya está en camino.' })).toHaveCount(0)
    await expect(page.getByLabel('Email', { exact: true })).toHaveValue('studio@example.invalid')
    await page.getByRole('button', { name: /Volver al proyecto/ }).click()
    await expect(page.locator('#presupuesto textarea')).toHaveValue(details)
    await expect(page.locator('.xks-count')).toHaveText('1 servicio seleccionado')
  })
}
test('Empty selections and whitespace briefs cannot proceed; demo buttons work with keyboard', async ({ page }) => {
  await boot(page)
  await expect(page.getByRole('button', { name: /Solicitar mi propuesta/ })).toBeDisabled()
  await page.getByRole('button', { name: /Continuar con mis datos/ }).click()
  await expect(page.locator('#presupuesto [role=alert]')).toHaveText('Elegí al menos un servicio antes de continuar.')
  await page.getByRole('button', { name: 'Agregar IA aplicada', exact: true }).click()
  await page.locator('#presupuesto textarea').fill(' '.repeat(25))
  await page.getByRole('button', { name: /Continuar con mis datos/ }).click()
  await expect(page.getByRole('heading', { name: 'Primero, definamos la idea.' })).toBeVisible()
  const demo = page.getByRole('group', { name: 'Cambiar demostración de estructura' }).getByRole('button', { name: 'Creador', exact: true })
  await demo.focus(); await page.keyboard.press('Enter')
  await expect(demo).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('.xks-browser')).toContainText('Ideas que')
})
test('Studio navigation reaches every real section without changing the selection', async ({ page }) => {
  await boot(page)
  await page.getByRole('button', { name: 'Agregar IA aplicada', exact: true }).click()
  for (const id of ['propuestas','mi-proyecto','proceso','web-faq-title']) {
    await page.locator(`.xks-local-nav a[href="#${id}"]`).click()
    await expect(page).toHaveURL(new RegExp(`#${id}$`))
    await expect(page.locator(`#${id}`)).toBeInViewport()
    await expect(page.locator('.xks-count')).toHaveText('1 servicio seleccionado')
  }
})

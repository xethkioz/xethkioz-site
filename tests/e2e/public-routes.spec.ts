import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

const publicRoutes = [
  '/',
  '/gaming',
  '/science',
  '/news',
  '/about',
  '/account',
  '/en',
  '/en/gaming',
  '/en/science',
] as const

function observeRuntimeErrors(page: Page) {
  const pageErrors: string[] = []
  const consoleErrors: string[] = []

  page.on('pageerror', (error) => {
    pageErrors.push(error.message)
  })

  page.on('console', (message) => {
    if (message.type() !== 'error') return

    const text = message.text()
    if (/ResizeObserver loop/i.test(text)) return
    consoleErrors.push(text)
  })

  return { pageErrors, consoleErrors }
}

async function expectHealthyDocument(page: Page, path: string) {
  const response = await page.goto(path, { waitUntil: 'domcontentloaded' })

  expect(response, `No hubo respuesta navegando a ${path}`).not.toBeNull()
  expect(response?.status(), `Estado HTTP inesperado en ${path}`).toBeLessThan(400)

  await expect(page.locator('#root')).not.toBeEmpty()
  await expect(page.locator('#main-content')).toBeVisible()
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible()

  const title = await page.title()
  expect(title.trim(), `El título está vacío en ${path}`).not.toBe('')
  expect(title, `Título de plantilla detectado en ${path}`).not.toMatch(/^Vite/i)

  const horizontalOverflow = await page.evaluate(() => {
    const documentWidth = Math.max(
      document.documentElement.scrollWidth,
      document.body?.scrollWidth ?? 0,
    )
    return documentWidth - window.innerWidth
  })

  expect(horizontalOverflow, `Desborde horizontal de ${horizontalOverflow}px en ${path}`).toBeLessThanOrEqual(2)
}

test.describe('rutas públicas', () => {
  for (const path of publicRoutes) {
    test(`${path} renderiza sin fallos de navegador`, async ({ page }) => {
      const runtime = observeRuntimeErrors(page)
      await expectHealthyDocument(page, path)

      expect(runtime.pageErrors, `Errores no controlados en ${path}`).toEqual([])
      expect(runtime.consoleErrors, `console.error detectado en ${path}`).toEqual([])
    })
  }

  test('Huellas de Puan carga como portal estático dedicado', async ({ page }) => {
    const response = await page.goto('/mascotas/', { waitUntil: 'domcontentloaded' })
    expect(response?.status()).toBeLessThan(400)
    await expect(page.getByRole('heading', { level: 1, name: /Huellas/i })).toBeVisible()
    await expect(page.getByRole('navigation', { name: 'Navegación' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Volver a XETHKIOZ' })).toHaveAttribute('href', '/')
  })
})

test.describe('accesibilidad automatizada', () => {
  for (const path of publicRoutes) {
    test(`${path} no tiene violaciones Axe serias o críticas`, async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== 'chromium-desktop', 'Axe se ejecuta una vez por ruta en escritorio')

      await expectHealthyDocument(page, path)

      const result = await new AxeBuilder({ page })
        .include('#root')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze()

      const blockingViolations = result.violations.filter(
        (violation) => violation.impact === 'serious' || violation.impact === 'critical',
      )

      expect(
        blockingViolations,
        blockingViolations
          .map((violation) => `${violation.id}: ${violation.help} (${violation.nodes.length} nodos)`)
          .join('\n'),
      ).toEqual([])
    })
  }

  test('Huellas no tiene violaciones Axe serias o críticas', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium-desktop', 'Axe se ejecuta una vez en escritorio')
    await page.goto('/mascotas/', { waitUntil: 'domcontentloaded' })
    const result = await new AxeBuilder({ page })
      .include('main')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze()
    const blockingViolations = result.violations.filter(
      (violation) => violation.impact === 'serious' || violation.impact === 'critical',
    )
    expect(blockingViolations).toEqual([])
  })
})

test.describe('navegación y estados especiales', () => {
  test('las rutas heredadas redirigen dentro de la SPA', async ({ page }) => {
    await page.goto('/register')
    await expect(page).toHaveURL(/\/account$/)

    await page.goto('/web-creation')
    await expect(page).toHaveURL(/\/creacion-web$/)

    await page.goto('/nexus-city')
    await expect(page).toHaveURL(/\/fun#nexus-city$/)
  })

  test('/fun conserva compatibilidad y deriva al portal Huellas del mismo origen', async ({ page }) => {
    await page.goto('/fun')
    await expect(page).toHaveURL(/\/mascotas\/$/)
    await expect(page.getByRole('heading', { level: 1, name: /Huellas/i })).toBeVisible()
  })

  test('una ruta inexistente muestra el estado 404', async ({ page }) => {
    await page.goto('/__xethkioz_e2e_missing__')
    await expect(page.getByRole('heading', { level: 1, name: '404' })).toBeVisible()
  })

  test('la aplicación inicia con preferencia de movimiento reducido', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await expectHealthyDocument(page, '/')

    const reducedMotionEnabled = await page.evaluate(
      () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    )
    expect(reducedMotionEnabled).toBe(true)
  })
})

test.describe('telemetría con consentimiento', () => {
  test('no envía eventos sin consentimiento de analítica', async ({ page }) => {
    let requests = 0
    await page.route('**/api/visit-log', async (route) => {
      requests += 1
      await route.fulfill({ status: 202, contentType: 'application/json', body: '{"ok":true}' })
    })

    await expectHealthyDocument(page, '/about')
    await page.waitForTimeout(700)
    expect(requests).toBe(0)
  })

  test('reintenta un fallo transitorio con el mismo eventId cuando la telemetría está habilitada', async ({ page }) => {
    const payloads: Array<{ eventId?: string; route?: string }> = []

    await page.addInitScript(() => {
      window.localStorage.setItem('xethkioz.privacy-consent.v1', JSON.stringify({
        version: 1,
        analytics: true,
        marketing: false,
        updatedAt: new Date().toISOString(),
      }))
    })

    await page.route('**/api/visit-log', async (route) => {
      const payload = route.request().postDataJSON() as { eventId?: string; route?: string }
      payloads.push(payload)
      if (payloads.length === 1) {
        await route.fulfill({
          status: 503,
          contentType: 'application/json',
          body: '{"ok":false,"error":"SERVICE_UNAVAILABLE"}',
        })
        return
      }
      await route.fulfill({ status: 202, contentType: 'application/json', body: '{"ok":true}' })
    })

    await expectHealthyDocument(page, '/about')
    await expect.poll(() => payloads.length, { timeout: 6_000 }).toBe(2)

    expect(payloads[0].route).toBe('/about')
    expect(payloads[0].eventId).toMatch(/^[0-9a-f-]{36}$/i)
    expect(payloads[1].eventId).toBe(payloads[0].eventId)

    await expect.poll(async () => page.evaluate(() => window.sessionStorage.getItem('xethkioz.telemetry./about')))
      .toMatch(/^sent:/)
  })
})

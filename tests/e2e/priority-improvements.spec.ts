import { expect, test } from '@playwright/test'

test.describe('mejoras priorizadas de experiencia', () => {
  test('Huellas y Nexus City tienen destinos inequívocos', async ({ page }) => {
    await page.goto('/')

    const petsLink = page.getByRole('link', { name: /Mascotas|Huellas de Puan/i }).first()
    await expect(petsLink).toHaveAttribute('href', '/mascotas/')

    await page.goto('/fun')
    await expect(page).toHaveURL(/\/nexus-city$/)
    await expect(page.getByText(/NEXUS CITY \/\//i).first()).toBeVisible()
  })

  test('COMICON abre con un mapa compacto y conserva vistas enlazables', async ({ page }) => {
    await page.goto('/comicon')

    await expect(page.getByRole('heading', { name: /Elegí qué querés explorar|Choose what you want to explore/i })).toBeVisible()
    await expect(page.locator('.xk-comicon-library')).toHaveCount(0)

    await page.getByRole('button', { name: /Archivo/i }).first().click()
    await expect(page).toHaveURL(/\/comicon\?view=archive$/)
    await expect(page.locator('.xk-comicon-library')).toBeVisible()

    await page.getByRole('button', { name: /Noticias|News/i }).first().click()
    await expect(page).toHaveURL(/\/comicon\?view=news$/)
    await expect(page.locator('#comicon-transmissions')).toBeVisible()
  })

  test('el perfil invitado muestra acciones reales y no contenido de prueba', async ({ page }) => {
    await page.goto('/profile')

    await expect(page.getByRole('heading', { level: 2, name: /Tu espacio XETHKIOZ|Your XETHKIOZ space/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /Crear cuenta|Create account/i })).toHaveAttribute('href', '/account?mode=signup')
    await expect(page.getByRole('heading', { name: /Antes de crear tu cuenta|Before creating your account/i })).toBeVisible()
    await expect(page.getByText(/XP DEL SERVIDOR|SERVER XP/i)).toBeVisible()
    await expect(page.getByText(/perfil local de prueba|local test profile|futuras insignias|future badges/i)).toHaveCount(0)
  })

  test('Gaming ofrece guías y radar desde el primer pantallazo', async ({ page }) => {
    await page.goto('/gaming')

    await expect(page.getByRole('link', { name: /Abrir guías|Open guides/i }).first()).toHaveAttribute('href', '/gaming/guides')
    await page.getByRole('button', { name: /Ver radar|Open radar/i }).first().click()
    await expect(page).toHaveURL(/\/gaming\?section=news$/)
  })

  test('Green Node acorta la primera entrada y no la repite en la sesión', async ({ page }) => {
    await page.addInitScript(() => window.sessionStorage.setItem('xethkioz.greenNodeUnlocked', String(Date.now())))
    await page.goto('/green-node/vault', { waitUntil: 'domcontentloaded' })

    const intro = page.locator('.xk-green-access-sequence')
    await expect(intro).toBeVisible()
    await expect(intro).toHaveCount(0, { timeout: 2000 })
    await page.reload({ waitUntil: 'domcontentloaded' })
    await expect(page.locator('.xk-green-access-sequence')).toHaveCount(0)
  })

  test('equipos limitados arrancan en LITE y respetan una elección manual', async ({ page }) => {
    await page.addInitScript(() => {
      if (!window.sessionStorage.getItem('xethkioz.performance-test-ready')) {
        window.localStorage.removeItem('xethkioz.experience.graphics.v2')
        window.localStorage.setItem('xethkioz.experience.graphics.v1', 'full')
        window.sessionStorage.setItem('xethkioz.performance-test-ready', '1')
      }
      Object.defineProperty(navigator, 'hardwareConcurrency', { configurable: true, value: 2 })
    })
    await page.goto('/')

    await expect(page.locator('html')).toHaveAttribute('data-xk-graphics', 'lite')
    await expect(page.locator('.xk-rb-bg-video')).toHaveCount(0)

    await page.evaluate(() => window.localStorage.setItem('xethkioz.experience.graphics.v2', 'full'))
    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('data-xk-graphics', 'full')
  })

  test('Comunidad muestra funciones reales y abre Nexus Chat', async ({ page }) => {
    await page.goto('/community')

    await expect(page.getByRole('heading', { name: /Elegí cómo participar|Choose how to participate/i })).toBeVisible()
    await expect(page.getByText(/Cola editorial|Editorial queue/i)).toHaveCount(0)
    await page.getByRole('button', { name: /Abrir chat|Open chat/i }).click()
    await expect(page.locator('#nexus-chat-panel')).toBeVisible()
  })

  test('Creación Web mantiene presupuesto y navegación sin desborde', async ({ page }) => {
    await page.goto('/creacion-web')

    await expect(page.locator('#presupuesto')).toBeVisible()
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    expect(overflow).toBeLessThanOrEqual(2)
  })
})

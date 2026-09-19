import { expect, test } from '@playwright/test'

test.describe('orden y navegación de secciones', () => {
  test('Inicio prioriza World of Xethkioz y conserva el ecosistema', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { level: 1, name: 'World of Xethkioz' })).toBeAttached()

    const mobileEcosystem = page.locator('.wox-mobile-ecosystem')
    if (await mobileEcosystem.isVisible()) {
      await mobileEcosystem.locator('summary').click()
    }

    const ecosystem = page.locator(
      'nav[aria-label="Ecosistema XETHKIOZ"]:visible, nav[aria-label="Ecosistema XETHKIOZ móvil"]:visible',
    )
    await expect(ecosystem).toBeVisible()
    await expect(ecosystem.getByRole('link')).toHaveCount(8)
    await expect(ecosystem.getByRole('link', { name: 'JUEGO', exact: true })).toHaveAttribute('href', '/world-of-xethkioz')
    await expect(ecosystem.getByRole('link', { name: 'BIBLIOTECA DE JUEGOS', exact: true })).toHaveAttribute('href', '/gaming')
    await expect(ecosystem.getByRole('link', { name: /ARGENCIENCIA/ })).toHaveAttribute('href', 'https://argenciencia.com/')
    await expect(ecosystem.getByRole('link', { name: 'MASCOTAS', exact: true })).toHaveAttribute('href', '/mascotas/')
    await expect(ecosystem.getByRole('link', { name: 'NEXUS CITY', exact: true })).toHaveAttribute('href', '/nexus-city')
    await expect(ecosystem.getByRole('link', { name: 'CREACIÓN WEB', exact: true })).toHaveAttribute('href', '/creacion-web')
    await expect(page.locator('a.wox-news-link').first()).toHaveAttribute('href', '/news')

    await expect(page.locator('.wox-hero')).toBeVisible()
    await expect(page.getByText('UNITY 6 · URP · 3D/2.5D', { exact: true })).toBeVisible()
    await expect(page.locator('#origin, #worlds, #characters, #media-3d')).toHaveCount(0)
  })

  test('Gaming muestra una sola navegación antes del contenido y conserva inglés', async ({ page }) => {
    await page.goto('/en/gaming')

    const navigation = page.getByRole('navigation', { name: 'Gaming sections' })
    await expect(navigation).toBeVisible()
    await expect(navigation).toHaveCSS('display', 'grid')
    await expect(page.getByRole('heading', { name: 'GAMING NEXUS' })).toBeVisible()
    await expect(page.locator('.xk-gaming-ticker')).toHaveCount(0)
    await expect(page.getByText('98.7%', { exact: true })).toHaveCount(0)
    await expect(page.getByRole('region', { name: /Choose what to do next in Gaming/i })).toHaveCount(0)

    await navigation.getByRole('button', { name: /Live$/ }).click()
    await expect(page).toHaveURL(/\/en\/gaming\?section=live$/)
    await expect(page.getByRole('heading', { name: 'Streams and videos in one place' })).toBeVisible()
  })

  test('Gaming reemplaza placeholders de hardware por información útil de comunidad', async ({ page }) => {
    await page.goto('/gaming?section=community')

    await expect(page.getByRole('heading', { name: 'Prepará tu perfil para encontrar grupo' })).toBeVisible()
    await expect(page.getByText('Especificaciones en verificación', { exact: true })).toHaveCount(0)
    await expect(page.getByRole('link', { name: /Abrir biblioteca/i })).toHaveAttribute('href', '/gaming/guides')
  })

  test('Green Node evita navegación duplicada y conserva sus cuatro secciones', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => window.sessionStorage.setItem('xethkioz.greenNodeUnlocked', String(Date.now())))
    await page.goto('/green-node')

    await expect(page.locator('.xk-nexus-district.is-green')).toHaveCount(0)
    const navigation = page.getByRole('navigation', { name: 'Elegir sección de Green Node' })
    await expect(navigation).toBeVisible()
    await expect(navigation.getByRole('button')).toHaveCount(4)
  })

  test('Science muestra el radar verificable antes de módulos secundarios', async ({ page }) => {
    await page.goto('/en/science')

    const primary = page.locator('[data-science-primary-content]')
    await expect(primary).toBeVisible()
    const primaryComesFirst = await primary.evaluate((element) => {
      const learning = document.querySelector('.xk-learning-routes')
      const network = document.querySelector('.xk-argenciencia-link')
      if (!learning || !network) return false
      return Boolean(element.compareDocumentPosition(learning) & Node.DOCUMENT_POSITION_FOLLOWING)
        && Boolean(element.compareDocumentPosition(network) & Node.DOCUMENT_POSITION_FOLLOWING)
    })
    expect(primaryComesFirst).toBe(true)

    const district = page.getByRole('region', { name: /Sources, tools and projects in one place/i })
    const links = district.getByRole('navigation').getByRole('link')
    await expect(links.nth(0)).toContainText('Sourced news')
    await expect(links.nth(0)).toHaveAttribute('href', '/news?category=science')
    await expect(district.getByRole('link', { name: /Tools and answers/i })).toHaveAttribute('href', '/en/science#lab-assistant')
    await expect(district.getByRole('link', { name: /Web Creation/i })).toHaveAttribute('href', '/en/creacion-web')
  })

  test('Science dirige cada ruta práctica a un destino distinto y concreto', async ({ page }) => {
    await page.goto('/en/science')

    await expect(page.getByRole('link', { name: /View science/i })).toHaveAttribute('href', '/news?category=science')
    await expect(page.getByRole('link', { name: /Open tools/i }).first()).toHaveAttribute('href', '#tech-stack')
    await expect(page.getByRole('link', { name: /Ask the laboratory/i }).first()).toHaveAttribute('href', '#lab-assistant')
    await expect(page.getByRole('link', { name: /View technology/i })).toHaveAttribute('href', '/news?category=tech')
  })
})

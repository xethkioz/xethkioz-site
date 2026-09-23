import { expect, test } from '@playwright/test'

test.describe('orden y navegación de secciones', () => {
  test('Inicio presenta los tres proyectos como portales y conserva el ecosistema', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { level: 1, name: /XETHKIOZ.*Historias para jugar/ })).toBeAttached()
    const portals = page.getByRole('navigation', { name: 'Red de portales: elegí un proyecto' })
    await expect(portals.getByRole('link')).toHaveCount(3)
    await expect(portals.getByRole('link', { name: /World of Xethkioz/ })).toHaveAttribute('href', '/world-of-xethkioz')
    await expect(portals.getByRole('link', { name: /VEYR/ })).toHaveAttribute('href', '#veyr')
    await expect(portals.getByRole('link', { name: /XETHKIOZ Studio/ })).toHaveAttribute('href', '/creacion-web#landing-esencial')

    const mobileEcosystem = page.locator('.xkf-mobile')
    if (await mobileEcosystem.isVisible()) {
      await mobileEcosystem.click()
    }

    const ecosystem = page.locator(
      'nav[aria-label="Ecosistema XETHKIOZ"]:visible, nav[aria-label="Ecosistema XETHKIOZ móvil"]:visible',
    )
    await expect(ecosystem).toBeVisible()
    await expect(ecosystem.getByRole('link')).toHaveCount(8)
    await expect(ecosystem.getByRole('link', { name: 'World of Xethkioz', exact: true })).toHaveAttribute('href', '/world-of-xethkioz')
    await expect(ecosystem.getByRole('link', { name: 'Biblioteca gamer', exact: true })).toHaveAttribute('href', '/gaming')
    await expect(ecosystem.getByRole('link', { name: /ArgenCiencia/ })).toHaveAttribute('href', 'https://argenciencia.com/')
    await expect(ecosystem.getByRole('link', { name: 'Mascotas', exact: true })).toHaveAttribute('href', '/mascotas/')
    await expect(ecosystem.getByRole('link', { name: 'Nexus City', exact: true })).toHaveCount(0)
    await expect(ecosystem.getByRole('link', { name: 'Creación web', exact: true })).toHaveAttribute('href', '/creacion-web')
    await expect(ecosystem.getByRole('link', { name: 'VEYR IA', exact: true })).toHaveAttribute('href', '/#veyr')
    await expect(page.locator('.xkf-header a[href="/news"]').first()).toHaveAttribute('href', '/news')

    await expect(page.locator('.wox-hero')).toBeVisible()
    await expect(page.getByText('UNITY 6 · URP · 3D/2.5D', { exact: true })).toBeVisible()
    await expect(page.locator('#origin, #worlds, #characters, #media-3d')).toHaveCount(0)
  })

  test('Gaming conserva una sola navegación de cuatro rutas y el idioma queda en el header global', async ({ page }) => {
    await page.goto('/en/gaming')

    const navigation = page.getByRole('navigation', { name: 'Gaming sections' })
    await expect(navigation).toBeVisible()
    await expect(navigation).toHaveCSS('display', 'grid')
    await expect(navigation.getByRole('button')).toHaveCount(4)
    await expect(page.getByRole('heading', { name: 'Gaming library' })).toBeVisible()
    await expect(page.locator('.xk-gaming-ticker')).toHaveCount(0)
    await expect(navigation.getByRole('button', { name: /Live|Directos/i })).toHaveCount(0)
    await expect(page.locator('.xk-gaming-hero').getByRole('button', { name: /Switch to Spanish|Cambiar a inglés/i })).toHaveCount(0)
    await expect(page.locator('.xk-quick-launcher')).toHaveCount(0)
    await expect(page.getByRole('button', { name: /Open Green Node through Wisp|Abrir Green Node mediante Wisp/i })).toHaveCount(0)

    const topNav = page.getByRole('navigation', { name: 'Primary navigation' })
    if ((page.viewportSize()?.width ?? 0) >= 1024) {
      await expect(topNav).toBeVisible()
      const labels = await topNav.locator('a').allTextContents()
      expect(labels.map(label => label.trim().replace(/\s+/g, ' '))).toEqual([
        'HOME', 'THE GAME', 'Gaming', 'Pets', 'Science & Tech ↗', 'Web creation',
      ])
    } else {
      await expect(topNav).toBeHidden()
      await expect(page.getByRole('navigation', { name: 'Primary mobile navigation' })).toBeVisible()
    }

    const veyr = page.locator('.xk-wisp.is-gaming-veyr')
    await expect(veyr).toBeVisible()
    await expect(veyr.locator('.xk-wisp-specter-veyr')).toHaveAttribute('src', /veyr-good\.webp$/)

    await navigation.getByRole('button', { name: /Radar$/ }).click()
    await expect(page).toHaveURL(/\/en\/gaming\?section=news$/)
    await expect(page.getByRole('heading', { name: 'New updates appear on our social channels first.' })).toBeVisible()
  })

  test('Gaming usa Threads e Instagram como Radar y Comunidad reales', async ({ page }) => {
    await page.goto('/gaming?section=community')

    const socialRoute = page.locator('.xk-gaming-social-route.is-community')
    await expect(socialRoute.getByRole('heading', { name: 'Acompañá XETHKIOZ mientras crece.' })).toBeVisible()
    await expect(socialRoute.getByRole('link', { name: /Threads/i })).toHaveAttribute('href', 'https://www.threads.com/@xethkioz')
    await expect(socialRoute.getByRole('link', { name: /Instagram/i })).toHaveAttribute('href', 'https://www.instagram.com/xethkioz')
    await expect(page.getByText('Especificaciones en verificación', { exact: true })).toHaveCount(0)
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

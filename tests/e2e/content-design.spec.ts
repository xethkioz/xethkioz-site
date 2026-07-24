import { expect, test } from '@playwright/test'

test.describe('orden y navegación de secciones', () => {
  test('Inicio ofrece tres accesos principales y un radar editorial compacto', async ({ page }) => {
    await page.goto('/')

    const district = page.getByRole('region', { name: /Elegí qué parte de XETHKIOZ querés explorar/i })
    const access = district.getByRole('navigation', { name: /accesos/i })
    await expect(district).toBeVisible()
    await expect(access.getByRole('link')).toHaveCount(3)
    await expect(access.getByRole('link', { name: /Gaming/i })).toHaveAttribute('href', '/gaming')
    await expect(access.getByRole('link', { name: /Science & Tech/i })).toHaveAttribute('href', '/science')
    await expect(district.locator('.xk-nexus-transit')).toHaveCount(0)

    const radar = page.locator('[data-home-recent-radar]')
    await expect(radar).toBeVisible()
    await expect(radar.getByRole('heading', { name: 'Lo nuevo en XETHKIOZ' })).toBeVisible()
    await expect(radar.getByRole('link', { name: /Ver todas las noticias/i })).toHaveAttribute('href', '/news')
    await expect.poll(async () => radar.getByRole('link').count()).toBeGreaterThanOrEqual(1)
  })

  test('Gaming muestra una sola navegación antes del contenido y conserva inglés', async ({ page }) => {
    await page.goto('/en/gaming')

    const navigation = page.getByRole('navigation', { name: 'Gaming sections' })
    await expect(navigation).toBeVisible()
    await expect(page.locator('.xk-gaming-ticker')).toHaveCount(0)
    await expect(page.getByText('98.7%', { exact: true })).toHaveCount(0)
    await expect(page.getByRole('region', { name: /Choose what to do next in Gaming/i })).toHaveCount(0)

    await navigation.getByRole('button', { name: 'Live', exact: true }).click()
    await expect(page).toHaveURL(/\/en\/gaming\?section=live$/)
    await expect(page.getByRole('heading', { name: 'Streams and videos in one place' })).toBeVisible()
  })

  test('Gaming reemplaza placeholders de hardware por información útil de comunidad', async ({ page }) => {
    await page.goto('/gaming?section=community')

    await expect(page.getByRole('heading', { name: 'Prepará tu perfil para encontrar grupo' })).toBeVisible()
    await expect(page.getByText('Especificaciones en verificación', { exact: true })).toHaveCount(0)
    await expect(page.getByRole('link', { name: /Abrir biblioteca/i })).toHaveAttribute('href', '/gaming/guides')
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

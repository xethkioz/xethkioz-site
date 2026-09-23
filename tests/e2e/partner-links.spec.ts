import { expect, test } from '@playwright/test'

async function essentials(page: import('@playwright/test').Page) {
  const button = page.getByRole('button', { name: /solo esenciales|essential only/i })
  if (await button.first().isVisible().catch(() => false)) await button.first().click()
}

test('Home muestra Tripo y Starlink como colaboradores/referidos sin invadir la interfaz', async ({ page }) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: width < 600 ? 844 : 1000 })
    await page.goto('/')
    await essentials(page)

    const corner = page.locator('.xk-partner-corner')
    await expect(corner).toBeVisible()
    const links = corner.locator('.xk-partner-links a')
    await expect(links).toHaveCount(2)

    await expect(links.nth(0)).toHaveAttribute('href', 'https://www.xethkioz.com.ar/tripo')
    await expect(links.nth(1)).toHaveAttribute('href', 'https://www.xethkioz.com.ar/starlink')
    await expect(links.nth(0)).toHaveAttribute('rel', /sponsored/)
    await expect(links.nth(1)).toHaveAttribute('rel', /sponsored/)

    await expect(corner.locator('img[src="/assets/partners/tripo-logo.png"]')).toBeVisible()
    await expect(corner.locator('img[src="/assets/partners/starlink-logo.png"]')).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy()

    const order = await page.evaluate(() => {
      const support = document.querySelector('#support')
      const partners = document.querySelector('.xk-partner-corner')
      return support && partners ? Boolean(support.compareDocumentPosition(partners) & Node.DOCUMENT_POSITION_FOLLOWING) : false
    })
    expect(order).toBe(true)
  }
})

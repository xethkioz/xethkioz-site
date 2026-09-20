import { expect, test } from '@playwright/test'

const portals = [
  ['/gaming', 'gaming'],
  ['/science', 'science'],
  ['/green-node', 'green'],
  ['/mascotas/', 'pets'],
  ['/creacion-web', 'web'],
] as const

test.describe('guías verificadas de los portales', () => {
  for (const [route, sector] of portals) {
    test(`${sector} explica pasos y enlaza una fuente oficial`, async ({ page }) => {
      if (sector === 'green') {
        await page.addInitScript(() => window.sessionStorage.setItem('xethkioz.greenNodeUnlocked', '1'))
      }
      await page.goto(route)
      if (sector === 'pets') await page.getByRole('button', { name: /Cuidados/i }).click()
      const briefing = page.locator(`[data-knowledge-sector="${sector}"]`)
      await expect(briefing).toBeVisible()
      await briefing.locator('summary').first().click()
      await expect(briefing.locator('ol li').first()).toBeVisible()
      await expect(briefing.getByRole('link', { name: /Fuente oficial/i }).first()).toHaveAttribute('href', /^https:\/\//)
      await expect(briefing.locator('img')).toHaveCount(0)
    })
  }
})

// The retired game section is a compatibility route, not an active knowledge portal.
for (const prefix of ['', '/en']) {
  test(`retired City route preserves the active community (${prefix || 'es'})`, async ({ page }) => {
    await page.goto(`${prefix}/nexus-city`)
    await expect(page).toHaveURL(new RegExp(`${prefix}/community$`))
    await expect(page.locator('[data-knowledge-sector="nexus"]')).toHaveCount(0)
    await expect(page.locator('#main-content')).not.toContainText('Nexus City')
    await expect(page.getByRole('button', { name: prefix ? 'Open chat' : 'Abrir chat', exact: true })).toBeVisible()
  })
}

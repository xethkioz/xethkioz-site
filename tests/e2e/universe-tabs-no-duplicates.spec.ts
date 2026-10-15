import { test, expect } from '@playwright/test'

test('AION 2 / WoW Forever tabs replace the active panel without duplicating cards', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' })

  const essential = page.getByRole('button', { name: /solo esenciales|essential only/i })
  if (await essential.count()) await essential.first().click({ timeout: 1200 }).catch(() => {})

  const panel = page.locator('#universe-panel')
  const card = page.locator('.xk-launcher-main > .xk-launcher-hero')
  const dossier = page.locator('.xk-game-dossier')

  await expect(panel).toHaveCount(1)
  await expect(card).toHaveCount(1)
  await expect(dossier).toHaveCount(1)

  for (let i = 0; i < 10; i++) {
    const isWow = i % 2 === 0
    const tab = page.locator(isWow ? '#tab-wowforever' : '#tab-aion2')
    await tab.click()
    await expect(tab).toHaveAttribute('aria-selected', 'true')
    await expect(panel).toHaveCount(1)
    await expect(card).toHaveCount(1)
    await expect(dossier).toHaveCount(1)
    await expect(panel).toHaveAttribute('aria-labelledby', isWow ? 'tab-wowforever' : 'tab-aion2')
    await expect(page.locator('main.xk-launcher-home')).toHaveAttribute('data-portal-theme', isWow ? 'wow' : 'aion2')
    await expect(panel.locator('h2')).toContainText(isWow ? 'FOREVER' : 'AION')

    const overflow = await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth)
    expect(overflow, 'No horizontal overflow after switching tabs').toBeLessThanOrEqual(2)
  }

  await page.locator('.xk-universe-archive-toggle__button').click()
  await expect(page.locator('#xk-universe-archive-content')).toBeVisible()
  await page.locator('#tab-wowforever').click()
  await expect(page.locator('#xk-universe-archive-content')).toHaveCount(0)
  await expect(panel).toHaveCount(1)
})

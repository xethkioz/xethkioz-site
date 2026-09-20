import { test, expect, type Page } from '@playwright/test'

// Navigation must not let the support page's stylesheet restyle the service shop.
test.beforeEach(async ({ page }) => {
  await page.route(/^https?:\/\//, async route => {
    const url = new URL(route.request().url())
    if (['127.0.0.1', 'localhost'].includes(url.hostname)) await route.continue()
    else await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
  })
})
async function dismissConsent(page: Page) {
  const essential = page.getByRole('button', { name: /solo esenciales|essential only/i }).first()
  if (await essential.isVisible()) await essential.click()
}
async function styleSnapshot(page: Page, selector: string) {
  return page.locator(selector).evaluate(element => {
    const style = getComputedStyle(element)
    const before = getComputedStyle(element, '::before')
    return { columns: style.gridTemplateColumns, padding: style.padding, border: style.borderTop,
      background: style.backgroundImage, beforeContent: before.content, beforeBackground: before.backgroundImage }
  })
}
for (const lang of ['es', 'en'] as const) {
  test(`Studio ${lang} keeps its design and basket after a support-page round trip`, async ({ page }) => {
    const prefix = lang === 'en' ? '/en' : ''
    await page.goto(`${prefix}/creacion-web`)
    await expect(page.locator('.xks-page .xks-hero')).toBeVisible()
    await dismissConsent(page)
    await page.getByRole('button', { name: lang === 'es' ? 'Agregar IA aplicada' : 'Add Practical AI', exact: true }).click()
    const studioBefore = await styleSnapshot(page, '.xks-page .xks-hero')
    await page.locator(`a[href="${prefix}/support"]:visible`).first().click()
    await expect(page.locator('.xks-support .xks-hero')).toBeVisible()
    await expect(page.locator('.xks-support')).toContainText(lang === 'es' ? 'El aporte es voluntario' : 'Support is voluntary')
    const supportBefore = await styleSnapshot(page, '.xks-support .xks-hero')
    await page.locator(`a[href="${prefix}/creacion-web"]:visible`).first().click()
    await expect(page.locator('.xks-page .xks-hero')).toBeVisible()
    expect(await styleSnapshot(page, '.xks-page .xks-hero')).toEqual(studioBefore)
    await expect(page.locator('.xks-count')).toHaveText(lang === 'es' ? '1 servicio seleccionado' : '1 service selected')
    await page.locator(`a[href="${prefix}/support"]:visible`).first().click()
    await expect(page.locator('.xks-support .xks-hero')).toBeVisible()
    expect(await styleSnapshot(page, '.xks-support .xks-hero')).toEqual(supportBefore)
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(2)
  })
}

test('Studio outgoing links and source copy do not restore retired owner channels', async ({ page }) => {
  await page.goto('/creacion-web')
  await expect(page.locator('.xks-page .xks-hero')).toBeVisible()
  await dismissConsent(page)
  await expect(page.locator('a[href*="twitch.tv/xethkioz"],a[href*="kick.com/xethkioz"]')).toHaveCount(0)
  await expect(page.locator('a[href="/nexus-city"],a[href="/en/nexus-city"]')).toHaveCount(0)
  await expect(page.locator('.xks-page')).not.toContainText(/Twitch|Kick/)
  await expect(page.locator('.xks-page a[href="https://www.threads.com/@xethkioz"]')).toHaveCount(1)
})

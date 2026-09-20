import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

for (const lang of ['es', 'en'] as const) {
  const prefix = lang === 'en' ? '/en' : ''
  test(`retired City aliases preserve ${lang} community without loading the old game`, async ({ page }) => {
    test.setTimeout(90_000)
    const requests: string[] = []
    page.on('request', request => requests.push(request.url()))
    for (const path of ['/fun', '/nexus-city', '/nexus-city/room/xethkioz', '/nexus-city/room/example', '/nexus-city/u/example', '/nexus-city/vip']) {
      await page.goto(prefix + path)
      await expect(page).toHaveURL(new RegExp(prefix + '/community$'))
      await expect(page.getByRole('button', { name: lang === 'es' ? 'Abrir chat' : 'Open chat', exact: true })).toBeVisible()
      await expect(page.locator('#main-content')).not.toContainText('Nexus City')
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://www.xethkioz.com.ar' + prefix + '/community')
    }
    expect(requests.filter(url => /\/(?:FunPortal|NexusCity|NexusPixelWorld|NexusVipRooms|NexusPassport|NexusRoom)-[^/]+\.js/.test(url))).toEqual([])
    const consent = page.getByRole('button', { name: /solo esenciales|essential only/i }).first()
    if (await consent.isVisible()) await consent.click()
    await page.getByRole('button', { name: lang === 'es' ? 'Abrir chat' : 'Open chat', exact: true }).click()
    await expect(page.locator('#nexus-chat-panel')).toBeVisible()
    await expect(page.locator('.xk-wisp')).toBeHidden()
    await page.locator('button[aria-controls="nexus-chat-panel"]').click()
    await expect(page.locator('.xk-wisp')).toBeVisible()
  })
  test(`support preserves official destinations and is usable in ${lang}`, async ({ page }, testInfo) => {
    await page.goto(prefix + '/support')
    const support = page.locator('.xks-support')
    await expect(support.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(support.locator('.xks-voluntary')).toContainText(lang === 'es' ? 'voluntario' : 'voluntary')
    await expect(support.locator('a[href*="paypal.com"]')).toHaveAttribute('href', 'https://www.paypal.com/ncp/payment/VT4476UQ76F4S')
    await expect(support.locator('a[href*="mercadopago.com"]')).toHaveAttribute('href', 'https://link.mercadopago.com.ar/xethkioz')
    await expect(support.locator('a[href*="threads.com"]')).toHaveAttribute('href', 'https://www.threads.com/@xethkioz')
    await expect(support.locator('a[href$="/contact"]').first()).toHaveAttribute('href', prefix + '/contact')
    await expect(support.locator('video,iframe,canvas')).toHaveCount(0)
    await expect(support.locator('code')).toHaveText('xethkioz')
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
    const consent = page.getByRole('button', { name: /solo esenciales|essential only/i }).first()
    if (await consent.isVisible()) await consent.click()
    await testInfo.attach('support-preview.png', { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' })
    const result = await new AxeBuilder({ page }).include('.xks-support').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()
    expect(result.violations.filter(item => item.impact === 'serious' || item.impact === 'critical')).toEqual([])
  })
}

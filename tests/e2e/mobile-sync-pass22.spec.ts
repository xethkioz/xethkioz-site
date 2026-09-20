import { test, expect } from '@playwright/test'

for (const language of ['es', 'en'] as const) {
  test(`Pass22: expanded ${language} menu uses the full width without broken words`, async ({ page }, testInfo) => {
    test.setTimeout(120_000)
    const records: unknown[] = []
    for (const width of [320, 360, 390, 430, 768]) {
      await page.setViewportSize({ width, height: 844 })
      await page.goto(language === 'es' ? '/' : '/en')
      const consent = page.getByRole('button', { name: /solo esenciales|essential only/i }).first()
      if (await consent.isVisible()) await consent.click()
      const toggle = page.locator('button.xkf-mobile')
      await toggle.click()
      await expect(toggle).toHaveAttribute('aria-expanded', 'true')
      await expect(page.locator('.xk-wisp')).toBeHidden()
      await expect(page.locator('button[aria-controls="nexus-chat-panel"]')).toBeHidden()
      await expect(page.locator('.xkf-mobile-panel a')).toHaveCount(8)
      const result = await page.evaluate(() => {
        const header = document.querySelector('.xkf-header')!.getBoundingClientRect()
        const panel = document.querySelector('.xkf-mobile-panel')!.getBoundingClientRect()
        const hero = document.querySelector('.wox-hero')!.getBoundingClientRect()
        const broken: string[] = []
        for (const link of document.querySelectorAll('.xkf-mobile-panel a')) {
          const nodes = document.createTreeWalker(link, NodeFilter.SHOW_TEXT)
          for (let node = nodes.nextNode(); node; node = nodes.nextNode()) {
            for (const match of (node.textContent || '').matchAll(/\p{L}+/gu)) {
              const range = document.createRange(); range.setStart(node, match.index!); range.setEnd(node, match.index! + match[0].length)
              if (range.getClientRects().length > 1) broken.push(match[0])
            }
          }
        }
        return { width: innerWidth, ratio: panel.width / header.width, broken, headerBottom: header.bottom, heroTop: hero.top, overflow: document.documentElement.scrollWidth > innerWidth + 1 }
      })
      records.push(result)
      expect(result.ratio).toBeGreaterThan(.95); expect(result.broken).toEqual([])
      expect(result.overflow).toBe(false); expect(result.headerBottom).toBeLessThanOrEqual(result.heroTop + 1)
      await expect(page.locator('.xkf-mobile-panel a[href="/nexus-city"]')).toHaveCount(0)
      await page.locator('.xkf-mobile-panel a').first().focus(); await page.keyboard.press('Escape')
      await expect(toggle).toHaveAttribute('aria-expanded', 'false'); await expect(toggle).toBeFocused()
      await expect(page.locator('.xkf-mobile-panel')).toBeHidden()
    }
    await testInfo.attach('expanded-menu-widths.json', { body: JSON.stringify(records, null, 2), contentType: 'application/json' })
  })
}

test('Pass22: logo precedes the subtitle and starts near the mobile header', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 }); await page.goto('/')
  await expect(page.locator('.wox-world-logo')).toBeVisible()
  const geometry = await page.evaluate(() => {
    const logo = document.querySelector('.wox-logo-wrap')!.getBoundingClientRect()
    const subtitle = document.querySelector('.wox-status')!.getBoundingClientRect()
    const header = document.querySelector('.xkf-header')!.getBoundingClientRect()
    return { logoBottom: logo.bottom, subtitleTop: subtitle.top, topGap: logo.top - header.bottom }
  })
  expect(geometry.logoBottom).toBeLessThanOrEqual(geometry.subtitleTop)
  expect(geometry.topGap).toBeGreaterThanOrEqual(0); expect(geometry.topGap).toBeLessThan(64)
  await expect(page.locator('.wox-status')).toContainText('ACTION RPG INDEPENDIENTE')
})

test('Pass22: Veyr cannot cover the chat composer and returns after closing', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  for (const route of ['/', '/world-of-xethkioz']) {
    await page.goto(route)
    const consent = page.getByRole('button', { name: /solo esenciales|essential only/i }).first()
    if (await consent.isVisible()) await consent.click()
    await expect(page.locator('.xk-wisp')).toBeVisible()
    const launcher = page.locator('button[aria-controls="nexus-chat-panel"]')
    await launcher.click(); await expect(page.locator('#nexus-chat-panel')).toBeVisible()
    await expect(page.locator('.xk-wisp')).toBeHidden()
    const send = page.locator('#nexus-chat-panel button[type="submit"]')
    await expect(send).toBeVisible()
    expect(await send.evaluate(el => { const r = el.getBoundingClientRect(); return el.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)) })).toBe(true)
    await launcher.click(); await expect(page.locator('#nexus-chat-panel')).toHaveCount(0)
    await expect(page.locator('.xk-wisp')).toBeVisible()
    await expect(page.locator('html')).not.toHaveAttribute('data-nexus-chat-open', '')
  }
})

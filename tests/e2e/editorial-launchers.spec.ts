import { expect, test } from '@playwright/test'

for (const path of ['/gaming', '/news', '/creacion-web', '/support', '/en/gaming', '/en/creacion-web', '/en/support']) {
  test(`mobile launchers remain separate and chat stays usable: ${path}`, async ({ page }) => {
    await page.route('**/*.supabase.co/rest/v1/**', route => route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }))
    for (const width of [320, 390, 430]) {
      await page.setViewportSize({ width, height: 844 })
      await page.goto(path)
      const consent = page.getByRole('button', { name: /solo esenciales|essential only/i }).first()
      if (await consent.isVisible()) await consent.click()
      const guide = page.locator('.xk-wisp')
      const chat = page.locator('button[aria-controls="nexus-chat-panel"]')
      await expect(guide).toBeVisible(); await expect(chat).toBeVisible()
      const g = await guide.boundingBox(); const c = await chat.boundingBox()
      expect(g).not.toBeNull(); expect(c).not.toBeNull()
      expect(g!.width).toBeGreaterThanOrEqual(44)
      expect(g!.x + g!.width + 8).toBeLessThanOrEqual(c!.x)
      await chat.click()
      await expect(page.locator('#nexus-chat-panel')).toBeVisible()
      await expect(guide).toBeHidden()
      const send = page.locator('#nexus-chat-panel button[type="submit"]')
      await send.click({ trial: true })
      await chat.click()
      await expect(guide).toBeVisible()
    }
  })
}

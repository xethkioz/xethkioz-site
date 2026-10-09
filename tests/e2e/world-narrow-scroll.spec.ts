import { test, expect } from '@playwright/test'

for (const width of [320, 360]) for (const language of ['es', 'en']) {
  test(`InnerCircle remains usable during narrow scroll: ${width} ${language}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 })
    await page.addInitScript(() => { try { localStorage.removeItem('xethkioz.lang') } catch {} })
    await page.goto(language === 'en' ? '/en/aion2/innercircle' : '/aion2/innercircle')
    await expect(page.locator('h1')).toBeVisible()
    const consent = page.getByRole('button', { name: /solo esenciales|essential only/i }).first()
    if (await consent.isVisible()) await consent.click()

    for (let step = 0; step <= 12; step++) {
      await page.evaluate(fraction => window.scrollTo({ top: (document.documentElement.scrollHeight - innerHeight) * fraction, behavior: 'instant' }), step / 12)
      await expect.poll(() => page.locator('.innercircle-recruit, .innercircle-grid, .innercircle-final').evaluateAll(elements => elements.filter(element => {
        const rect = element.getBoundingClientRect()
        if (rect.width < 1 || rect.top < 0 || rect.bottom > innerHeight) return false
        const top = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2)
        return top !== null && top !== element && !element.contains(top)
      }).map(element => element.className)), { message: `scroll position ${step}` }).toEqual([])
    }

    await page.locator('.innercircle-cta').click()
    await expect(page).toHaveURL(new RegExp(`${language === 'en' ? '/en' : ''}/aion2/innercircle#reclutamiento$`))
    await expect(page.locator('#reclutamiento')).toBeVisible()
  })
}

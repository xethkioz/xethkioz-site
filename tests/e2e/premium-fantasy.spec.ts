import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

async function essentials(page: import('@playwright/test').Page) {
  const button = page.getByRole('button', { name: /solo esenciales|essential only/i })
  if (await button.first().isVisible()) await button.first().click()
}
test('Premium Home conserva rutas, CTA real y canales oficiales sin video', async ({ page }) => {
  await page.goto('/'); await essentials(page)
  await expect(page.locator('.wox-actions a').first()).toHaveAttribute('href', '/world-of-xethkioz')
  await expect(page.locator('.wox-logo-wrap')).toBeVisible()
  await expect(page.locator('.wox-status')).toHaveText('ACTION RPG INDEPENDIENTE')
  await expect(page.locator('video, iframe, canvas')).toHaveCount(0)
  await expect(page.locator('.wox-ecosystem-card')).toHaveCount(4)
  await expect(page.locator('.wox-support-side li')).toHaveCount(3)
  await expect(page.locator('.wox-footer-premium')).toBeVisible()
  const links = await page.locator('.wox-footer-social a').evaluateAll(items => items.map(a => a.getAttribute('href')))
  expect(links[0]).toBe('https://www.xethkioz.com.ar')
  expect(links[1]).toBe('https://www.threads.com/@xethkioz')
  expect(links.join(' ')).not.toMatch(/twitch|kick\.com/i)
  const result = await new AxeBuilder({ page }).include('.wox-home').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()
  expect(result.violations).toEqual([])
})
test('Portal fantasy: tabs accesibles, FAQ y contenido público reservado', async ({ page }) => {
  await page.goto('/world-of-xethkioz'); await essentials(page)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Atravesá el umbral.')
  await expect(page.locator('.woxp-game-logo')).toBeVisible()
  await expect(page.locator('.woxp-game-status')).toHaveText('ACTION RPG INDEPENDIENTE')
  await expect(page.locator('.woxp-concept-gallery figure')).toHaveCount(3)
  await expect(page.locator('video, iframe, canvas')).toHaveCount(0)
  await page.getByRole('tab', { name: 'Panorama', exact: true }).click()
  await page.keyboard.press('ArrowRight')
  await expect(page.getByRole('tab', { name: 'Arquitectura', exact: true })).toBeFocused()
  await expect(page.getByRole('tab', { name: 'Arquitectura', exact: true })).toHaveAttribute('aria-selected','true')
  await page.keyboard.press('End')
  await expect(page.getByRole('tab', { name: 'Luz', exact: true })).toBeFocused()
  await page.locator('#preguntas summary').first().click()
  await expect(page.locator('#preguntas details').first()).toHaveAttribute('open','')
  expect(await page.locator('.wox-portal').innerText()).not.toMatch(/M\d{2}[–-]M\d{2}|QuestID|Boss\d+/)
  await expect(page.locator('.woxp-art-caption')).toContainText('NO ES GAMEPLAY')
  const result = await new AxeBuilder({ page }).include('.wox-portal').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()
  expect(result.violations).toEqual([])
})
test('English game portal conserva idioma, rutas y sin duplicar cabecera', async ({ page }) => {
  await page.goto('/en/world-of-xethkioz'); await essentials(page)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Cross the threshold.')
  await expect(page.locator('.xkf-header')).toHaveCount(1)
  await expect(page.getByRole('tab', { name: 'Architecture', exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Switch to Spanish', exact: true }).click()
  await expect(page).toHaveURL(/\/world-of-xethkioz$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Atravesá el umbral.')
})
test('Fantasy conserva lectura sin desborde en teléfonos estrechos', async ({ page }) => {
  for (const width of [320,390,768]) {
    await page.setViewportSize({width,height:844})
    for(const route of ['/', '/world-of-xethkioz']) {
      await page.goto(route); await essentials(page)
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy()
      await expect(page.locator('main[data-public-presentation="fantasy"]')).toBeVisible()
    }
  }
})

import { expect, test, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

async function visit(page: Page, route = '/world-of-xethkioz') {
  await page.goto(route)
  const essentials = page.getByRole('button', { name: /solo esenciales|essential only/i }).first()
  if (await essentials.isVisible()) await essentials.click()
  await expect(page.locator('.wox-artwork-toolbar')).toBeAttached()
}

test('public viewer is user-opened and reuses only the published image', async ({ page }) => {
  await visit(page)
  await expect(page.locator('.wox-artwork-dialog')).toHaveCount(0)
  await expect(page.locator('.wox-artwork-toolbar button')).toHaveAttribute('aria-expanded', 'false')
  await page.locator('.wox-artwork-toolbar button').click()
  const modal = page.getByRole('dialog')
  await expect(modal).toBeVisible()
  await expect(modal).toHaveAccessibleName('Una mirada completa.')
  await expect(modal.locator('img')).toHaveAttribute('src', '/assets/portal-games-world-v3.webp')
  await expect(modal).toContainText('No es gameplay')
  await expect(modal.locator('img')).toHaveJSProperty('naturalWidth', 800)
  await expect(page.locator('video, iframe, canvas')).toHaveCount(0)
  const imageRequests = await page.evaluate(() => performance.getEntriesByType('resource').filter(r => new URL(r.name).pathname === '/assets/portal-games-world-v3.webp').length)
  expect(imageRequests).toBe(1)
  const results = await new AxeBuilder({ page }).include('.wox-artwork-dialog').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
  expect(results.violations).toEqual([])
})
test('modal keyboard, background isolation, crop and scroll restoration', async ({ page }) => {
  await visit(page)
  await page.getByRole('tab', { name: 'Arquitectura', exact: true }).click()
  const trigger = page.getByRole('button', { name: 'Ver ilustración completa', exact: true })
  await trigger.scrollIntoViewIfNeeded()
  await trigger.focus()
  const initialScroll = await page.evaluate(() => scrollY)
  await page.keyboard.press('Enter')
  const modal = page.getByRole('dialog')
  await expect(modal.getByRole('button', { name: 'Cerrar vista' })).toBeFocused()
  expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe('hidden')
  for (const key of ['Tab', 'Shift+Tab', 'Tab']) {
    await page.keyboard.press(key)
    expect(await modal.evaluate(el => el.contains(document.activeElement))).toBeTruthy()
  }
  await page.keyboard.press('Escape')
  await expect(modal).toHaveCount(0)
  await expect(trigger).toBeFocused()
  await expect(page.getByRole('tab', { name: 'Arquitectura', exact: true })).toHaveAttribute('aria-selected', 'true')
  expect(await page.evaluate(() => document.documentElement.style.overflow)).not.toBe('hidden')
  expect(Math.abs(await page.evaluate(() => scrollY) - initialScroll)).toBeLessThan(2)
})

test('English labels and backdrop dismissal remain usable', async ({ page }) => {
  await visit(page, '/en/world-of-xethkioz')
  await page.getByRole('button', { name: 'View full illustration' }).click()
  await expect(page.getByRole('dialog')).toHaveAccessibleName('The complete picture.')
  await page.mouse.click(1, 1)
  await expect(page.getByRole('dialog')).toHaveCount(0)
})
test('viewer fits narrow phones, tablets and desktop with touch-sized close control', async ({ page }) => {
  for (const width of [320, 360, 390, 430, 768, 1024, 1366, 1440]) {
    await page.setViewportSize({ width, height: 700 })
    await visit(page)
    await page.getByRole('button', { name: 'Ver ilustración completa', exact: true }).click()
    const modal = page.getByRole('dialog')
    await expect(modal).toBeVisible()
    const geometry = await modal.evaluate(el => {
      const box = el.getBoundingClientRect(), close = el.querySelector('button')!.getBoundingClientRect()
      return { left: box.left, right: box.right, overflow: el.scrollWidth > el.clientWidth + 1, closeWidth: close.width, closeHeight: close.height, closeBottom: close.bottom, viewport: innerWidth, height: innerHeight }
    })
    expect(geometry.left).toBeGreaterThanOrEqual(0)
    expect(geometry.right).toBeLessThanOrEqual(geometry.viewport)
    expect(geometry.overflow).toBeFalsy()
    expect(geometry.closeWidth).toBeGreaterThanOrEqual(44)
    expect(geometry.closeHeight).toBeGreaterThanOrEqual(44)
    expect(geometry.closeBottom).toBeLessThanOrEqual(geometry.height)
    await modal.getByRole('button', { name: 'Cerrar vista' }).click()
    await expect(modal).toHaveCount(0)
  }
})

test('failed image remains explained and the viewer can still close', async ({ page }) => {
  await page.route('**/assets/portal-games-world-v3.webp', route => route.abort())
  await visit(page)
  await page.getByRole('button', { name: 'Ver ilustración completa', exact: true }).click()
  await expect(page.getByRole('dialog').getByRole('status')).toContainText('No se pudo cargar')
  await page.getByRole('dialog').getByRole('button', { name: 'Cerrar vista' }).click()
  await expect(page.getByRole('dialog')).toHaveCount(0)
})

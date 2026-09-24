import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

async function essentials(page: import('@playwright/test').Page) {
  const button = page.getByRole('button', { name: /solo esenciales|essential only/i })
  if (await button.first().isVisible()) await button.first().click()
}
test('Premium Home conserva rutas, CTA real y canales oficiales sin video', async ({ page }) => {
  await page.goto('/'); await essentials(page)
  await expect(page.locator('.wox-actions a').first()).toHaveAttribute('href', '/world-of-xethkioz')
  await expect(page.locator('.wox-bg img')).toHaveAttribute('src', '/assets/xethkioz-world-panorama-2026.webp')
  await expect(page.locator('.xk-world-signature img')).toHaveAttribute('src', '/assets/world-of-xethkioz/world-of-xethkioz-logo.png')
  await expect(page.locator('.wox-status')).toHaveText('GAMING · TECNOLOGÍA · CREACIÓN')
  await expect(page.locator('.xk-hero-doors a')).toHaveCount(3)
  await expect(page.locator('.xk-doors-grid a')).toHaveCount(3)
  await expect(page.locator('.xk-veyr-art img')).toHaveAttribute('src', '/assets/xethkioz-veyr-local-atmosphere-2026.webp')
  await expect(page.locator('#veyr')).toContainText('VEYR es un asistente local')
  await expect(page.locator('.xk-studio-story')).toContainText('USD 350 de referencia')
  await expect(page.locator('video, iframe, canvas')).toHaveCount(0)
  await expect(page.locator('.wox-ecosystem-card')).toHaveCount(3)
  await expect(page.locator('.xk-network-links a')).toHaveCount(2)
  await expect(page.locator('.wox-support-side li')).toHaveCount(3)
  await expect(page.locator('.xk-global-footer')).toBeVisible()
  const links = await page.locator('.xk-global-footer__social a').evaluateAll(items => items.map(a => a.getAttribute('href')))
  expect(links).toContain('https://www.threads.com/@xethkioz')
  expect(links).toContain('https://www.instagram.com/xethkioz')
  expect(links.join(' ')).not.toMatch(/twitch|kick\.com/i)
  const result = await new AxeBuilder({ page }).include('.wox-home').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()
  expect(result.violations).toEqual([])
})
test('El panorama aprobado se ve detrás de tres portales legibles en escritorio', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 936 })
  await page.goto('/'); await essentials(page)
  const logo = page.locator('.xk-world-signature img')
  await expect(logo).toHaveAttribute('src', '/assets/world-of-xethkioz/world-of-xethkioz-logo.png')
  await expect(logo).toBeHidden() // La ilustración ya incorpora la firma visual.
  const geometry = await page.evaluate(() => {
    const hero = document.querySelector('.wox-hero')!.getBoundingClientRect()
    const portals = [...document.querySelectorAll('.xk-hero-doors a')].map(link => link.getBoundingClientRect())
    return {
      heroLeft: hero.left,
      heroRight: hero.right,
      viewport: innerWidth,
      portalsFit: portals.every(rect => rect.left >= 0 && rect.right <= innerWidth + 1 && rect.width >= 200),
      background: document.querySelector('.wox-bg img')?.getAttribute('src'),
    }
  })
  expect(geometry.heroLeft).toBeLessThanOrEqual(1)
  expect(geometry.heroRight).toBeGreaterThanOrEqual(geometry.viewport - 1)
  expect(geometry.portalsFit).toBe(true)
  expect(geometry.background).toBe('/assets/xethkioz-world-panorama-2026.webp')
})
test('Portal fantasy: fundador, Alpha 5 demo, Veyr canónica, FAQ y contenido público reservado', async ({ page }) => {
  await page.goto('/world-of-xethkioz'); await essentials(page)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Atravesá el umbral.')
  await expect(page.locator('.woxp-world-name')).toHaveText(/WORLD OF XETHKIOZ/)
  await expect(page.locator('.woxp-hero-art img')).toHaveAttribute('src', '/assets/xethkioz-world-panorama-2026.webp')
  await expect(page.locator('.woxp-game-status')).toHaveText('ACTION RPG INDEPENDIENTE')
  const founderVideo = page.locator('.woxp-founder-video:not(.woxp-alpha-video)')
  await expect(founderVideo).toBeVisible()
  await expect(founderVideo).toHaveAttribute('controls', '')
  await expect(founderVideo).toHaveAttribute('preload', 'metadata')
  await expect(founderVideo.locator('source')).toHaveAttribute('src', /founder-vision\.mp4$/)
  expect(await founderVideo.getAttribute('autoplay')).toBeNull()
  const alphaVideo = page.locator('.woxp-alpha-video')
  await expect(alphaVideo).toBeVisible()
  await expect(alphaVideo).toHaveAttribute('controls', '')
  await expect(alphaVideo).toHaveAttribute('preload', 'metadata')
  await expect(alphaVideo.locator('source')).toHaveAttribute('src', /alpha-5-demo\.mp4$/)
  expect(await alphaVideo.getAttribute('autoplay')).toBeNull()
  await expect(page.getByText('ALPHA DE DEMOSTRACIÓN · ALPHA 5', { exact: true })).toBeVisible()
  await expect(page.getByText('NO REPRESENTA LA CALIDAD FINAL · NO ES TRAILER · NO ES UNA VERSIÓN PÚBLICA', { exact: true })).toBeVisible()
  await expect(page.locator('iframe, canvas')).toHaveCount(0)
  await expect(page.locator('.woxp-concept-gallery figure')).toHaveCount(3)
  await expect(page.locator('.woxp-development-card')).toHaveCount(3)
  await expect(page.locator('.woxp-development-card').nth(0)).toContainText('La identidad visual combina fantasía')
  await expect(page.locator('.woxp-development-card').nth(1)).toContainText('Action RPG con exploración, progresión y descubrimiento')
  await expect(page.locator('.woxp-development-card').nth(2)).toContainText('Threads e Instagram')
  await expect(page.locator('#convergencia .woxp-veyr-character img')).toHaveAttribute('src', /veyr-good\.webp$/)
  await expect(page.locator('#convergencia .woxp-veyr-character')).toBeVisible()
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
  await expect(page.getByText('02 / FOUNDER VISION', { exact: true })).toBeVisible()
  await expect(page.locator('.woxp-founder-video:not(.woxp-alpha-video)')).toBeVisible()
  await expect(page.locator('.woxp-alpha-video')).toBeVisible()
  await expect(page.getByText('DEMONSTRATION ALPHA · ALPHA 5', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Switch to Spanish', exact: true }).click()
  await expect(page).toHaveURL(/\/world-of-xethkioz$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Atravesá el umbral.')
})
test('Veyr flotante usa el PNJ canónico y nunca pisa el chat', async ({ page }) => {
  for (const width of [390,1440]) {
    await page.setViewportSize({ width, height: width < 600 ? 844 : 1000 })
    await page.goto('/world-of-xethkioz'); await essentials(page)
    const veyr = page.locator('.xk-wisp.is-world-veyr')
    const chat = page.getByRole('button', { name: 'Abrir XETHKIOZ Nexus Chat' })
    await expect(veyr).toBeVisible()
    await expect(veyr).toHaveAttribute('aria-label', /Veyr/)
    await expect(veyr.locator('.xk-wisp-specter-veyr')).toHaveAttribute('src', /veyr-good\.webp$/)
    await expect(chat).toBeVisible()
    const overlap = await page.evaluate(() => {
      const a = document.querySelector('.xk-wisp.is-world-veyr')!.getBoundingClientRect()
      const b = document.querySelector('button[aria-label="Abrir XETHKIOZ Nexus Chat"]')!.getBoundingClientRect()
      return !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom)
    })
    expect(overlap).toBeFalsy()
    await veyr.click()
    await expect(page.getByRole('button', { name: 'Cerrar XETHKIOZ Nexus Chat' })).toBeVisible()
    await expect(veyr).toBeHidden()
  }
})
test('Green Node flotante no pisa el chat en Inicio', async ({ page }) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 844 })
    await page.goto('/'); await essentials(page)
    const overlap = await page.evaluate(() => {
      const wisp = document.querySelector('.xk-wisp.is-home-entry')!.getBoundingClientRect()
      const chat = document.querySelector('button[aria-controls="nexus-chat-panel"]')!.getBoundingClientRect()
      return !(wisp.right <= chat.left || wisp.left >= chat.right || wisp.bottom <= chat.top || wisp.top >= chat.bottom)
    })
    expect(overlap).toBe(false)
  }
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

import { expect, test, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

async function essentials(page: Page) {
  const banner = page.locator('.xk-privacy-consent-banner')
  if (await banner.isVisible()) await banner.getByRole('button', { name: /solo esenciales|essential only/i }).click()
}

test('Portal Home: tres umbrales grandes en fila y la fractura debajo, sin bloques duplicados', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/'); await essentials(page)
  await expect(page.getByRole('heading', {level:1})).toHaveAccessibleName('World of Xethkioz')
  await expect(page.locator('.portal-gate')).toHaveCount(3)
  await expect(page.locator('.portal-node-rift')).toHaveCount(1)
  await expect(page.locator('.portal-navigation')).toHaveCount(1)
  await expect(page.locator('.portal-footer')).toHaveCount(1)
  await expect(page.locator('video,iframe,canvas,.xk-veyr-story,.xk-studio-story,.xk-global-footer')).toHaveCount(0)
  await expect(page.locator('.portal-gate[data-tone="fire"]')).toHaveAttribute('href','/world-of-xethkioz/elemental-realms')
  await expect(page.locator('.portal-gate[data-tone="nature"]')).toHaveAttribute('href','/mascotas/')
  await expect(page.locator('.portal-gate[data-tone="ice"]')).toHaveAttribute('href','/digital')
  const geometry=await page.evaluate(()=>{
    const gates=[...document.querySelectorAll('.portal-gate')].map(e=>e.getBoundingClientRect()), rift=document.querySelector('.portal-node-rift')!.getBoundingClientRect()
    return {aligned:Math.max(...gates.map(r=>r.top))-Math.min(...gates.map(r=>r.top))<2, widths:gates.map(r=>r.width), below:rift.top>=Math.max(...gates.map(r=>r.bottom))-2,riftWidth:rift.width,overflow:document.documentElement.scrollWidth>innerWidth+1}
  })
  expect(geometry.aligned).toBe(true);expect(geometry.below).toBe(true);expect(geometry.overflow).toBe(false)
  expect(Math.min(...geometry.widths)).toBeGreaterThan(390);expect(geometry.riftWidth).toBeGreaterThan(1200)
  await expect(page.locator('.portal-footer a.portal-paypal')).toHaveAttribute('href','https://www.paypal.com/ncp/payment/VT4476UQ76F4S')
  await expect(page.locator('.portal-footer a.portal-mercadopago')).toHaveAttribute('href','https://link.mercadopago.com.ar/xethkioz')
  const socials=await page.locator('.portal-socials a').evaluateAll(a=>a.map(e=>e.getAttribute('href')))
  expect(socials).toContain('https://www.threads.com/@xethkioz');expect(socials).toContain('https://www.instagram.com/xethkioz')
  expect(socials.join(' ')).not.toMatch(/twitch|kick\.com/)
})

for(const prefix of ['', '/en']) test(`El juego abre directamente y conserva el enlace antiguo: ${prefix||'es'}`, async ({page})=>{
  await page.goto(`${prefix}/world-of-xethkioz#alpha-2`);await essentials(page)
  await expect(page).toHaveURL(new RegExp(`${prefix}/world-of-xethkioz/elemental-realms#alpha-2$`))
  await expect(page.locator('.portal-game')).toHaveAttribute('data-portal-theme','fire')
  await expect(page.locator('.portal-game video')).toHaveCount(1)
  const video=page.locator('#alpha-2 video')
  await expect(video).toHaveAttribute('controls','');await expect(video).toHaveAttribute('preload','metadata')
  expect(await video.getAttribute('autoplay')).toBeNull()
  await expect(video.locator('source')).toHaveAttribute('src','/assets/world-of-xethkioz/media/elemental-realms-alpha-2.mp4')
  await expect(page.locator('.portal-character')).toHaveCount(2)
  await expect(page.locator('.is-veyr')).toContainText('Veyr');await expect(page.locator('.is-rabbit')).toContainText('B-Rabbit')
  await expect(page.locator('img[src*="veyr-good"]')).toHaveCount(0)
  await page.locator('.portal-game__history summary').click()
  await expect(page.locator('.portal-game video')).toHaveCount(3)
  await expect(page.locator('.portal-game__archive video[preload="none"]')).toHaveCount(2)
  await page.locator('.portal-game__history summary').click()
  await expect(page.locator('.portal-game video')).toHaveCount(1)
  await expect(page.locator('.portal-game__faq details')).toHaveCount(3)
})

test('La antigua ancla de la visión del fundador abre su archivo bajo demanda',async({page})=>{
  await page.goto('/world-of-xethkioz/elemental-realms#mundo');await essentials(page)
  await expect(page.locator('.portal-game__history')).toHaveAttribute('open','')
  await expect(page.locator('#mundo video')).toBeAttached()
})

test('Efectos: pausa persistente, partículas limitadas y respeto a movimiento reducido',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');await essentials(page)
  await expect(page.locator('.portal-effects-toggle')).toHaveAttribute('aria-pressed','false')
  await expect(page.locator('.portal-fx').first()).toBeHidden()
  await page.emulateMedia({reducedMotion:'no-preference'})
  await page.locator('.portal-effects-toggle').click()
  await expect(page.locator('html')).toHaveAttribute('data-portal-effects','on')
  expect(await page.locator('.portal-fx i').count()).toBeLessThanOrEqual(36)
  await page.locator('.portal-effects-toggle').click();await page.reload()
  await expect(page.locator('.portal-effects-toggle')).toHaveAttribute('aria-pressed','false')
})

for(const route of ['/', '/world-of-xethkioz/elemental-realms','/digital'])test(`Portal accesible sin violaciones WCAG: ${route}`,async({page})=>{
  await page.goto(route);await essentials(page)
  const result=await new AxeBuilder({page}).include('#main-content').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()
  expect(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([])
})

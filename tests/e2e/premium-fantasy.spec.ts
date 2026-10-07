import { expect, test } from '@playwright/test'

async function essentials(page: import('@playwright/test').Page) {
  const banner = page.locator('.xk-privacy-consent-banner')
  if (await banner.isVisible()) await banner.getByRole('button', { name: /solo esenciales|essential only/i }).click()
}

test('Portal Home: XETHKIOZ presenta InnerCircle y Green Node sin recuperar World of Xethkioz', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/'); await essentials(page)
  await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName('XETHKIOZ')
  await expect(page.locator('.portal-gate')).toHaveCount(3)
  await expect(page.locator('.portal-node-rift')).toHaveCount(1)
  await expect(page.locator('.portal-navigation')).toHaveCount(1)
  await expect(page.locator('video,iframe,canvas,.xk-veyr-story,.xk-studio-story,.xk-global-footer')).toHaveCount(0)
  await expect(page.locator('.portal-gate[data-tone="innercircle"]')).toHaveAttribute('href','/aion2/innercircle')
  await expect(page.locator('.portal-gate[data-tone="nature"]')).toHaveAttribute('href','/mascotas/')
  await expect(page.locator('.portal-gate[data-tone="ice"]')).toHaveAttribute('href','/digital')
  const geometry=await page.evaluate(()=>{
    const gates=[...document.querySelectorAll('.portal-gate')].map(e=>e.getBoundingClientRect()), rift=document.querySelector('.portal-node-rift')!.getBoundingClientRect()
    return {aligned:Math.max(...gates.map(r=>r.top))-Math.min(...gates.map(r=>r.top))<2, widths:gates.map(r=>r.width), below:rift.top>=Math.max(...gates.map(r=>r.bottom))-2,riftWidth:rift.width,overflow:document.documentElement.scrollWidth>innerWidth+1}
  })
  expect(geometry.aligned).toBe(true);expect(geometry.below).toBe(true);expect(geometry.overflow).toBe(false)
  expect(Math.min(...geometry.widths)).toBeGreaterThan(390);expect(geometry.riftWidth).toBeGreaterThan(1200)
})

for(const prefix of ['', '/en']) test(`InnerCircle opens directly: ${prefix||'es'}`, async ({page})=>{
  await page.goto(`${prefix}/aion2/innercircle`);await essentials(page)
  await expect(page.locator('.innercircle-page')).toHaveAttribute('data-portal-theme','innercircle')
  await expect(page.getByRole('heading', { name: 'InnerCircle.' })).toBeVisible()
  await expect(page.getByText(/Elyos Legion|Legión Elyos/)).toBeVisible()
  await expect(page.locator('.innercircle-grid article')).toHaveCount(5)
  await expect(page.locator('#reclutamiento')).toBeVisible()
  await expect(page.locator('video,iframe,canvas')).toHaveCount(0)
})

test('Efectos: pausa persistente, partículas limitadas y respeto a movimiento reducido',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');await essentials(page)
  await expect(page.locator('.portal-effects-toggle')).toHaveAttribute('aria-pressed','false')
  await expect(page.locator('.portal-fx').first()).toBeHidden()
  await page.emulateMedia({reducedMotion:'no-preference'})
  await expect(page.locator('html')).toHaveAttribute('data-portal-effects','on')
  expect(await page.locator('.portal-fx i').count()).toBeLessThanOrEqual(36)
  await page.locator('.portal-effects-toggle').click();await page.reload()
  await expect(page.locator('.portal-effects-toggle')).toHaveAttribute('aria-pressed','false')
})

for(const route of ['/', '/aion2/innercircle','/digital'])test(`Portal accesible sin violaciones WCAG: ${route}`,async({page})=>{
  await page.goto(route);await essentials(page)
  const result=await new (await import('@axe-core/playwright')).default({page}).include('#main-content').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()
  expect(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([])
})

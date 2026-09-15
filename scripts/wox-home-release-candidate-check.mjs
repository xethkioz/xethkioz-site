import { chromium } from '@playwright/test'

const base = process.env.WOX_BASE_URL || 'http://127.0.0.1:4192'
const cases = [
  ['desktop-xl', 1440, 1000],
  ['desktop', 1024, 900],
  ['tablet', 768, 900],
  ['mobile', 390, 844],
]
const routes = [['es', '/'], ['en', '/en/']]
const browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' })

for (const [lang, route] of routes) {
  for (const [name, width, height] of cases) {
    const page = await browser.newPage({ viewport: { width, height } })
    const errors = []
    page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()) })
    page.on('pageerror', (error) => errors.push(error.message))
    await page.goto(`${base}${route}`, { waitUntil: 'networkidle' })
    await page.evaluate(() => localStorage.setItem('xethkioz.privacy-consent.v1', JSON.stringify({ version: 1, analytics: false, marketing: false, updatedAt: new Date().toISOString() })))
    await page.reload({ waitUntil: 'networkidle' })
    for (const selector of ['.wox-region-grid article button', '.wox-atlas-grid article button', '.wox-forms-grid article button', '.wox-cast-grid article button']) {
      const buttons = page.locator(selector)
      const count = await buttons.count()
      for (let index = 0; index < count; index += 1) {
        await buttons.nth(index).scrollIntoViewIfNeeded()
        await buttons.nth(index).click()
      }
    }

    const metrics = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      regions: document.querySelectorAll('.wox-region-grid article').length,
      atlas: document.querySelectorAll('.wox-atlas-grid article').length,
      forms: document.querySelectorAll('.wox-forms-grid article').length,
      cast: document.querySelectorAll('.wox-cast-grid article').length,
      heroSpecs: document.querySelectorAll('.wox-hero-specs a').length,
      footerWorldLinks: document.querySelectorAll('.wox-footer-world-nav a').length,
      wisp: Boolean(document.querySelector('.xk-wisp.is-home-entry')),
      randomImages: document.querySelectorAll('#worlds img, #atlas img, #characters img').length,
    }))

    const ok = !metrics.overflow && metrics.regions === 4 && metrics.atlas === 4 && metrics.forms === 8 && metrics.cast === 14 && metrics.heroSpecs === 4 && metrics.footerWorldLinks === 6 && metrics.wisp && metrics.randomImages === 0 && errors.length === 0
    if (!ok) throw new Error(`RC failed ${lang}/${name}: ${JSON.stringify({ metrics, errors })}`)
    console.log(`PASS ${lang}/${name} ${width}x${height}`)
    await page.close()
  }
}
const routeCheck = await browser.newPage({ viewport: { width: 1280, height: 800 } })
for (const [from, expected] of [['/', '/en'], ['/en/', '/']]) {
  await routeCheck.goto(`${base}${from}`, { waitUntil: 'networkidle' })
  const button = routeCheck.locator('.wox-tools button')
  await button.click()
  await routeCheck.waitForLoadState('networkidle')
  const actual = new URL(routeCheck.url()).pathname
  if (actual !== expected) throw new Error(`Language switch failed: ${from} -> ${actual}, expected ${expected}`)
}
await routeCheck.close()
await browser.close()
console.log('WORLD OF XETHKIOZ AAA RELEASE CANDIDATE PASS')

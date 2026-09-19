import { chromium } from '@playwright/test'

const previewUrl = new URL(process.env.WOX_PREVIEW_URL || 'http://127.0.0.1:4201/')
const baseOrigin = previewUrl.origin
const protectedEntry = previewUrl.search ? previewUrl.href : ''
const browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' })
const viewports = [[390, 844], [430, 932], [768, 900], [1024, 900], [1440, 1000]]

for (const [width, height] of viewports) {
  const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' })
  await context.addInitScript(() => localStorage.setItem('xethkioz.privacy-consent.v1', JSON.stringify({ version: 1, analytics: false, marketing: false, updatedAt: new Date().toISOString() })))
  const page = await context.newPage()
  const errors = []
  page.on('console', msg => msg.type() === 'error' && errors.push(msg.text()))
  page.on('pageerror', err => errors.push(err.message))

  if (protectedEntry) await page.goto(protectedEntry, { waitUntil: 'domcontentloaded' })
  await page.goto(new URL('/', `${baseOrigin}/`).href, { waitUntil: 'networkidle' })
  const wispLocator = page.locator('.xk-wisp.is-home-entry')
  await wispLocator.waitFor({ state: 'visible', timeout: 5000 })

  const scrollTargets = await page.evaluate(() => {
    const support = document.querySelector('.wox-support-card')
    return [0, support ? Math.max(0, support.getBoundingClientRect().top + scrollY - 120) : 0, Math.max(0, document.documentElement.scrollHeight - innerHeight)]
  })

  const states = []
  for (const y of scrollTargets) {
    await page.evaluate((targetY) => window.scrollTo({ top: targetY, behavior: 'instant' }), y)
    await page.waitForTimeout(120)
    const state = await page.evaluate(() => {
      const wisp = document.querySelector('.xk-wisp.is-home-entry')
      if (!wisp) return null
      const rect = wisp.getBoundingClientRect()
      const marker = wisp.querySelector('.xk-wisp-home-marker')
      return {
        x: Math.round(rect.x),
        y: Math.round(rect.y),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        right: Math.round(innerWidth - rect.right),
        bottom: Math.round(innerHeight - rect.bottom),
        markerDisplay: marker ? getComputedStyle(marker).display : null,
      }
    })
    if (!state) throw new Error(`Missing Home Wisp at ${width}px`)
    if (state.x < -1 || state.y < -1 || state.right < -1 || state.bottom < -1) throw new Error(`Wisp left viewport at ${width}px: ${JSON.stringify(state)}`)
    if (state.width > 120 || state.height > 120) throw new Error(`Wisp too large for short Home at ${width}px: ${JSON.stringify(state)}`)
    if (width >= 1280 && state.markerDisplay !== 'none') throw new Error(`Desktop Home Wisp marker returned at ${width}px`)
    states.push(state)
  }

  const asset = await page.locator('.xk-wisp-specter-veyr').getAttribute('src')
  if (asset !== '/assets/world-of-xethkioz/web-art/veyr-green-sigil.svg') throw new Error(`Wrong Veyr asset at ${width}px: ${asset}`)
  if (errors.length) throw new Error(`Browser errors at ${width}px: ${JSON.stringify(errors)}`)

  console.log(JSON.stringify({ width, states, asset, errors }))
  await context.close()
}

await browser.close()

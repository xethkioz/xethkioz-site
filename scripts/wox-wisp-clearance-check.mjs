import { chromium } from '@playwright/test'

const base = (process.env.WOX_PREVIEW_URL || 'http://127.0.0.1:4201/').replace(/\/$/, '')
const browser = await chromium.launch({ headless: true, executablePath: 'C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe' })
const viewports = [[390, 844], [430, 932], [768, 900], [1024, 900]]
const targets = ['#origin', '#worlds', '#atlas', '#characters', '#media-3d', '#development']
for (const [width, height] of viewports) {
  const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' })
  await context.addInitScript(() => localStorage.setItem('xethkioz.privacy-consent.v1', JSON.stringify({ version: 1, analytics: false, marketing: false, updatedAt: new Date().toISOString() })))
  const page = await context.newPage()
  const errors = []
  page.on('console', msg => msg.type() === 'error' && errors.push(msg.text()))
  page.on('pageerror', err => errors.push(err.message))
  await page.goto(base, { waitUntil: 'networkidle' })

  const heroBox = await page.locator('.xk-wisp.is-home-entry').boundingBox()
  const minHero = width <= 430 ? 68 : 90
  if (!heroBox || heroBox.width < minHero) throw new Error(`Hero Wisp shrank at ${width}px: ${JSON.stringify(heroBox)}`)
  const results = []
  for (const target of targets) {
    await page.locator(`.wox-section-dock a[href="${target}"]`).evaluate((el) => el.click())
    await page.waitForTimeout(220)
    const state = await page.evaluate(() => {
      const wisp = document.querySelector('.xk-wisp.is-home-entry')
      const dock = document.querySelector('.wox-section-dock.is-visible')
      if (!wisp || !dock) return null
      const wr = wisp.getBoundingClientRect()
      const dr = dock.getBoundingClientRect()
      const nodes = [...document.querySelectorAll('h1,h2,h3,strong,p,small,li,button,a')]
        .filter(el => !wisp.contains(el) && el.offsetParent !== null)
      const hits = nodes.map(el => {
        const r = el.getBoundingClientRect()
        const x = Math.max(0, Math.min(wr.right, r.right) - Math.max(wr.left, r.left))
        const y = Math.max(0, Math.min(wr.bottom, r.bottom) - Math.max(wr.top, r.top))
        return { text: (el.textContent || '').trim(), area: Math.round(x * y) }
      }).filter(hit => hit.area > 16)
      return { wisp: { x: wr.x, y: wr.y, w: wr.width, h: wr.height }, dockBottom: dr.bottom, hits }
    })
    if (!state) throw new Error(`Missing Wisp/dock at ${width}px ${target}`)
    if (state.wisp.w > 62 || state.wisp.h > 62) throw new Error(`Chapter Wisp too large at ${width}px ${target}: ${JSON.stringify(state.wisp)}`)
    if (state.wisp.y < state.dockBottom - 2) throw new Error(`Chapter Wisp overlaps dock at ${width}px ${target}: ${JSON.stringify(state)}`)
    if (state.hits.length) throw new Error(`Chapter Wisp overlaps readable content at ${width}px ${target}: ${JSON.stringify(state.hits)}`)
    results.push({ target, wisp: state.wisp, clearance: Math.round(state.wisp.y - state.dockBottom), hits: 0 })
  }
  if (errors.length) throw new Error(`Browser errors at ${width}px: ${JSON.stringify(errors)}`)
  console.log(JSON.stringify({ width, heroWisp: Math.round(heroBox.width), results, errors }))
  await context.close()
}

await browser.close()

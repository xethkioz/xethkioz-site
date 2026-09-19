import { chromium } from '@playwright/test'

const previewUrl = new URL(process.env.WOX_PREVIEW_URL || 'http://127.0.0.1:4173/')
const baseOrigin = previewUrl.origin
const protectedEntry = previewUrl.search ? previewUrl.href : ''
const browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' })
const viewports = [{ width: 1440, height: 1000 }, { width: 768, height: 900 }, { width: 390, height: 844 }]
const anchors = ['#historia', '#mundo', '#convergencia', '#arte-visual']

for (const viewport of viewports) {
  const context = await browser.newContext({ viewport })
  await context.addInitScript(() => localStorage.setItem('xethkioz.privacy-consent.v1', JSON.stringify({ version: 1, analytics: false, marketing: false, updatedAt: new Date().toISOString() })))
  const page = await context.newPage()
  const errors = []
  page.on('console', m => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', e => errors.push(e.message))

  if (protectedEntry) await page.goto(protectedEntry, { waitUntil: 'domcontentloaded' })
  await page.goto(new URL('/world-of-xethkioz', `${baseOrigin}/`).href, { waitUntil: 'networkidle' })

  const links = await page.locator('.wox-portal-anchor-nav a').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')).filter(Boolean))
  if (JSON.stringify(links) !== JSON.stringify(anchors)) throw new Error(`${viewport.width}px portal anchor contract mismatch: ${JSON.stringify(links)}`)

  const landings = []
  for (const href of anchors) {
    await page.locator(`.wox-portal-anchor-nav a[href="${href}"]`).click()
    await page.waitForTimeout(180)
    const state = await page.evaluate((selector) => {
      const target = document.querySelector(selector)
      if (!target) return null
      const rect = target.getBoundingClientRect()
      return { top: Math.round(rect.top), bottom: Math.round(rect.bottom), hash: location.hash }
    }, href)
    if (!state) throw new Error(`${viewport.width}px missing portal target ${href}`)
    if (state.hash !== href) throw new Error(`${viewport.width}px hash mismatch for ${href}: ${state.hash}`)
    if (state.top < 70 || state.top > 140) throw new Error(`${viewport.width}px portal anchor ${href} landed at ${state.top}px`)
    landings.push({ href, top: state.top })
  }

  if (errors.length) throw new Error(`${viewport.width}px browser errors ${JSON.stringify(errors)}`)
  console.log(JSON.stringify({ viewport: viewport.width, landings, errors }))
  await context.close()
}
await browser.close()

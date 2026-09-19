import { chromium } from '@playwright/test'
import { mkdir } from 'node:fs/promises'

const previewUrl = new URL(process.env.WOX_PREVIEW_URL || 'http://127.0.0.1:4188/')
const baseOrigin = previewUrl.origin
const protectedEntry = previewUrl.search ? previewUrl.href : ''
const out = 'artifacts/wox-first-visit'
await mkdir(out, { recursive: true })

const browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' })

for (const [name, viewport] of [['desktop', { width: 1440, height: 1000 }], ['phone430', { width: 430, height: 932 }], ['mobile', { width: 390, height: 844 }]]) {
  const context = await browser.newContext({ viewport })
  const page = await context.newPage()
  const errors = []
  page.on('console', m => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', e => errors.push(e.message))

  if (protectedEntry) await page.goto(protectedEntry, { waitUntil: 'domcontentloaded' })
  await page.goto(new URL('/', `${baseOrigin}/`).href, { waitUntil: 'networkidle' })

  const banner = page.locator('.xk-privacy-consent-banner')
  await banner.waitFor({ state: 'visible' })
  const metric = await page.evaluate(() => {
    const b = document.querySelector('.xk-privacy-consent-banner')
    const buttons = [...document.querySelectorAll('.xk-privacy-consent-actions button')].map(el => el.getBoundingClientRect())
    return {
      width: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth,
      bannerWidth: b?.getBoundingClientRect().width || 0,
      buttons: buttons.map(r => ({ x: r.x, y: r.y, w: r.width, h: r.height })),
      hero: document.querySelectorAll('.wox-hero').length,
      oldSections: ['origin','worlds','atlas','characters','ecosystem','familiars','media-3d','development','roadmap'].filter(id => document.getElementById(id)).length,
    }
  })

  await page.screenshot({ path: `${out}/${name}.png`, fullPage: false })
  const overflow = metric.width > metric.client
  const mobileStack = viewport.width > 760 || (metric.buttons[2]?.y > metric.buttons[0]?.y && metric.buttons[2]?.w > metric.buttons[0]?.w * 1.8)

  if (overflow || errors.length || metric.buttons.length !== 3 || !mobileStack || metric.hero !== 1 || metric.oldSections !== 0) {
    throw new Error(JSON.stringify({ name, metric, overflow, errors }))
  }

  console.log(JSON.stringify({ name, ...metric, overflow, errors }))
  await context.close()
}

await browser.close()

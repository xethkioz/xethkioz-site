import { chromium } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
const base = process.env.WOX_PREVIEW_URL || 'http://127.0.0.1:4188/'
const out = 'artifacts/wox-first-visit'
await mkdir(out, { recursive: true })
const browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' })
for (const [name, viewport] of [['desktop',{width:1440,height:1000}],['mobile',{width:390,height:844}]]) {
  const context = await browser.newContext({ viewport })
  const page = await context.newPage()
  const errors = []
  page.on('console', m => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', e => errors.push(e.message))
  await page.goto(base, { waitUntil: 'networkidle' })
  const banner = page.locator('.xk-privacy-consent-banner')
  await banner.waitFor({ state: 'visible' })
  const metric = await page.evaluate(() => {
    const b = document.querySelector('.xk-privacy-consent-banner')
    const buttons = [...document.querySelectorAll('.xk-privacy-consent-actions button')].map(el => el.getBoundingClientRect())
    return { width: document.documentElement.scrollWidth, client: document.documentElement.clientWidth,
      bannerWidth: b?.getBoundingClientRect().width || 0, buttons: buttons.map(r => ({x:r.x,y:r.y,w:r.width,h:r.height})) }
  })
  await page.screenshot({ path: `${out}/${name}.png`, fullPage: false })
  const overflow = metric.width > metric.client
  const mobileStack = name !== 'mobile' || (metric.buttons[2]?.y > metric.buttons[0]?.y && metric.buttons[2]?.w > metric.buttons[0]?.w * 1.8)
  if (overflow || errors.length || metric.buttons.length !== 3 || !mobileStack) throw new Error(JSON.stringify({name,metric,overflow,errors}))
  console.log(JSON.stringify({name,...metric,overflow,errors}))
  await context.close()
}
await browser.close()

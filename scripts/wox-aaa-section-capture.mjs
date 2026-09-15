import { chromium } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
const base = process.env.WOX_PREVIEW_URL || 'http://127.0.0.1:4177/'
const out = 'artifacts/wox-aaa-v2'
await mkdir(out, { recursive: true })
const browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' })
const views = [['desktop',1440,1000],['mobile',390,844]]
const selectors = [['origin','#origin'],['duo','.wox-duo'],['worlds','#worlds'],['atlas','#atlas'],['forms','.wox-forms-showcase'],['characters','#characters'],['media3d','#media-3d'],['development','#development'],['roadmap','.wox-roadmap-showcase'],['support','.wox-support-card']]
for (const [name,width,height] of views) {
  const page = await browser.newPage({ viewport: { width, height } })
  await page.addInitScript(() => localStorage.setItem('xethkioz.privacy-consent.v1', JSON.stringify({version:1,analytics:false,marketing:false,updatedAt:new Date().toISOString()})))
  await page.goto(base,{waitUntil:'networkidle'})
  await page.addStyleTag({content:'.wox-topbar,.wox-section-dock,.wox-utility-rail,.xk-wisp,.xk-skip-link{display:none!important}'})
  for (const [label,selector] of selectors) {
    const el = page.locator(selector).first()
    await el.scrollIntoViewIfNeeded()
    await page.waitForTimeout(80)
    await el.screenshot({path:`${out}/${name}-${label}.png`})
  }
  await page.close()
}
await browser.close()
console.log('AAA section captures ready')

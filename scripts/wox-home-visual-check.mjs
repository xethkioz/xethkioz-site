import { chromium } from '@playwright/test'
import { mkdir } from 'node:fs/promises'

const out = 'artifacts/wox-home-visual'
await mkdir(out, { recursive: true })
const browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' })
const cases = [
  ['desktop', { width: 1440, height: 1000 }],
  ['mobile', { width: 390, height: 844 }],
]
for (const [name, viewport] of cases) {
  const page = await browser.newPage({ viewport })
  const errors = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push(e.message))
  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' })
  const metrics = await page.evaluate(() => ({
    title: document.title,
    width: document.documentElement.scrollWidth,
    client: document.documentElement.clientWidth,
    h1: document.querySelector('h1')?.textContent?.trim() || '',
    castCards: document.querySelectorAll('.wox-cast-grid article').length,
  }))
  await page.screenshot({ path: `${out}/${name}.png`, fullPage: true })
  console.log(JSON.stringify({ name, ...metrics, overflow: metrics.width > metrics.client, errors }))
  await page.close()
}
await browser.close()

import { chromium } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const base = (process.env.WOX_PREVIEW_URL || 'http://127.0.0.1:4173/').replace(/\/$/, '')
const authUrl = process.env.WOX_AUTH_URL || ''
const browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' })
const openPreview = async (page, path = '') => {
  if (authUrl) await page.goto(authUrl, { waitUntil: 'networkidle' })
  await page.goto(`${base}${path}`, { waitUntil: 'networkidle' })
}
const edgeViewports = [{ width: 320, height: 780 }, { width: 360, height: 800 }, { width: 1366, height: 768 }, { width: 1920, height: 1080 }]
const textSelectors = ['.wox-region-grid h3', '.wox-atlas-grid h3', '.wox-forms-grid strong', '.wox-cast-grid strong', '.wox-3d-copy strong', '.wox-dev-grid strong', '.wox-roadmap-grid strong']

for (const viewport of edgeViewports) {
  const context = await browser.newContext({ viewport, reducedMotion: 'reduce' })
  const page = await context.newPage()
  const errors = []
  page.on('console', msg => msg.type() === 'error' && errors.push(msg.text()))
  page.on('pageerror', err => errors.push(err.message))
  await openPreview(page)
  const metrics = await page.evaluate((selectors) => ({
    width: document.documentElement.scrollWidth,
    client: document.documentElement.clientWidth,
    cast: document.querySelectorAll('.wox-cast-grid article').length,
    forms: document.querySelectorAll('.wox-forms-grid article').length,
    overflowText: selectors.flatMap(selector => [...document.querySelectorAll(selector)]).filter(el => el.scrollWidth > el.clientWidth + 2).map(el => el.textContent?.trim() || ''),
  }), textSelectors)
  const overflow = metrics.width > metrics.client
  console.log(JSON.stringify({ type: 'edge', viewport, ...metrics, overflow, errors }))
  if (metrics.cast !== 14 || metrics.forms !== 8 || metrics.overflowText.length || overflow || errors.length) throw new Error(`WOX edge QA failed at ${viewport.width}px`)
  await context.close()
}

{
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
  const page = await context.newPage()
  await openPreview(page)
  const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
  const serious = axe.violations.filter(v => ['serious', 'critical'].includes(v.impact || ''))
  console.log(JSON.stringify({ type: 'axe', violations: axe.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.length })) }))
  if (serious.length) throw new Error(`WOX accessibility violations: ${serious.map(v => v.id).join(', ')}`)
  await context.close()
}
{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
  const page = await context.newPage()
  await openPreview(page)
  await page.keyboard.press('Tab')
  await page.waitForTimeout(220)
  const first = await page.evaluate(() => ({ cls: document.activeElement?.className || '', top: document.activeElement?.getBoundingClientRect().top ?? -999 }))
  await page.keyboard.press('Enter')
  await page.waitForTimeout(80)
  const skipped = await page.evaluate(() => document.activeElement?.id || '')
  console.log(JSON.stringify({ type: 'keyboard-initial', first, skipped }))
  if (!String(first.cls).includes('xk-skip-link') || first.top < 0 || skipped !== 'main-content') throw new Error('WOX initial keyboard focus failed')
  await context.close()
}

{
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
  const page = await context.newPage()
  await openPreview(page)
  await page.locator('.wox-ecosystem-nav a[href="/gaming"]').click()
  await page.waitForURL('**/gaming')
  await page.waitForFunction(() => document.activeElement?.id === 'main-content', undefined, { timeout: 2000 })
  const focused = await page.evaluate(() => document.activeElement?.id || '')
  console.log(JSON.stringify({ type: 'keyboard-route', focused }))
  if (focused !== 'main-content') throw new Error('WOX route keyboard focus failed')
  await context.close()
}

await browser.close()

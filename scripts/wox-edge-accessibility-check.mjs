import { chromium } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const previewUrl = new URL(process.env.WOX_PREVIEW_URL || 'http://127.0.0.1:4173/')
const baseOrigin = previewUrl.origin
const protectedEntry = previewUrl.search ? previewUrl.href : ''
const browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' })

const openPreview = async (page, path = '/') => {
  if (protectedEntry) await page.goto(protectedEntry, { waitUntil: 'domcontentloaded' })
  await page.goto(new URL(path, `${baseOrigin}/`).href, { waitUntil: 'networkidle' })
}

const edgeViewports = [
  { width: 320, height: 780 },
  { width: 360, height: 800 },
  { width: 1366, height: 768 },
  { width: 1920, height: 1080 },
]

const homeTextSelectors = ['.wox-status', '.wox-hero h2', '.wox-lead', '.wox-actions a', '.wox-hero-specs strong', '.wox-hero-specs b', '.wox-support-card h2', '.wox-final p']
const portalTextSelectors = ['.wox-portal-hero-copy h1', '.wox-portal-hero-copy > span', '.wox-portal-regions strong', '.wox-portal-regions span', '.wox-portal-chapter h2', '.wox-portal-art h2']

for (const viewport of edgeViewports) {
  const context = await browser.newContext({ viewport, reducedMotion: 'reduce' })
  await context.addInitScript(() => localStorage.setItem('xethkioz.privacy-consent.v1', JSON.stringify({ version: 1, analytics: false, marketing: false, updatedAt: new Date().toISOString() })))
  const page = await context.newPage()
  const errors = []
  page.on('console', msg => msg.type() === 'error' && errors.push(msg.text()))
  page.on('pageerror', err => errors.push(err.message))

  await openPreview(page, '/')
  const home = await page.evaluate((selectors) => ({
    width: document.documentElement.scrollWidth,
    client: document.documentElement.clientWidth,
    hero: document.querySelectorAll('.wox-hero').length,
    actions: document.querySelectorAll('.wox-actions a').length,
    specs: document.querySelectorAll('.wox-hero-specs > span').length,
    oldSections: ['origin','worlds','atlas','characters','ecosystem','familiars','media-3d','development','roadmap'].filter(id => document.getElementById(id)).length,
    overflowText: selectors.flatMap(selector => [...document.querySelectorAll(selector)]).filter(el => el.scrollWidth > el.clientWidth + 3).map(el => el.textContent?.trim() || ''),
  }), homeTextSelectors)
  const homeOverflow = home.width > home.client
  if (home.hero !== 1 || home.actions !== 3 || home.specs !== 4 || home.oldSections !== 0 || home.overflowText.length || homeOverflow) {
    throw new Error(`WOX short Home edge QA failed at ${viewport.width}px: ${JSON.stringify({ home, homeOverflow })}`)
  }

  await openPreview(page, '/world-of-xethkioz')
  const portal = await page.evaluate((selectors) => ({
    width: document.documentElement.scrollWidth,
    client: document.documentElement.clientWidth,
    regions: document.querySelectorAll('.wox-portal-regions article').length,
    cast: document.querySelectorAll('.wox-portal-cast-line article').length,
    anchors: document.querySelectorAll('.wox-portal-anchor-nav a').length,
    overflowText: selectors.flatMap(selector => [...document.querySelectorAll(selector)]).filter(el => el.scrollWidth > el.clientWidth + 3).map(el => el.textContent?.trim() || ''),
  }), portalTextSelectors)
  const portalOverflow = portal.width > portal.client
  if (portal.regions !== 5 || portal.cast !== 6 || portal.anchors !== 4 || portal.overflowText.length || portalOverflow) {
    throw new Error(`WOX game portal edge QA failed at ${viewport.width}px: ${JSON.stringify({ portal, portalOverflow })}`)
  }

  if (errors.length) throw new Error(`Browser errors at ${viewport.width}px: ${JSON.stringify(errors)}`)
  console.log(JSON.stringify({ type: 'edge', viewport, home, portal, errors }))
  await context.close()
}

for (const path of ['/', '/world-of-xethkioz']) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
  await context.addInitScript(() => localStorage.setItem('xethkioz.privacy-consent.v1', JSON.stringify({ version: 1, analytics: false, marketing: false, updatedAt: new Date().toISOString() })))
  const page = await context.newPage()
  await openPreview(page, path)
  const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
  const serious = axe.violations.filter(v => ['serious', 'critical'].includes(v.impact || ''))
  console.log(JSON.stringify({ type: 'axe', path, violations: axe.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.length })) }))
  if (serious.length) throw new Error(`WOX accessibility violations on ${path}: ${serious.map(v => v.id).join(', ')}`)
  await context.close()
}

{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
  const page = await context.newPage()
  await openPreview(page, '/')
  await page.keyboard.press('Tab')
  await page.waitForTimeout(220)
  const first = await page.evaluate(() => ({ cls: document.activeElement?.className || '', top: document.activeElement?.getBoundingClientRect().top ?? -999 }))
  await page.keyboard.press('Enter')
  await page.waitForTimeout(80)
  const skipped = await page.evaluate(() => document.activeElement?.id || '')
  if (!String(first.cls).includes('xk-skip-link') || first.top < 0 || skipped !== 'main-content') throw new Error('WOX initial keyboard focus failed')
  console.log(JSON.stringify({ type: 'keyboard-initial', first, skipped }))
  await context.close()
}

{
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
  const page = await context.newPage()
  await openPreview(page, '/')
  await page.locator('.wox-ecosystem-nav a[href="/world-of-xethkioz"]').click()
  await page.waitForURL('**/world-of-xethkioz')
  await page.waitForFunction(() => document.activeElement?.id === 'main-content', undefined, { timeout: 2000 })
  const focused = await page.evaluate(() => document.activeElement?.id || '')
  if (focused !== 'main-content') throw new Error('WOX route keyboard focus failed')
  console.log(JSON.stringify({ type: 'keyboard-route', focused }))
  await context.close()
}

await browser.close()

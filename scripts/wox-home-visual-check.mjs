import { chromium } from '@playwright/test'
import { mkdir } from 'node:fs/promises'

const out = 'artifacts/wox-home-visual'
const previewUrl = new URL(process.env.WOX_PREVIEW_URL || 'http://127.0.0.1:4173/')
const baseOrigin = previewUrl.origin
const protectedEntry = previewUrl.search ? previewUrl.href : ''
await mkdir(out, { recursive: true })

const browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' })
const cases = [
  ['desktop', { width: 1440, height: 1000 }],
  ['laptop', { width: 1024, height: 900 }],
  ['tablet', { width: 768, height: 900 }],
  ['phone430', { width: 430, height: 932 }],
  ['mobile', { width: 390, height: 844 }],
]

for (const [name, viewport] of cases) {
  const context = await browser.newContext({ viewport })
  await context.addInitScript(() => localStorage.setItem('xethkioz.privacy-consent.v1', JSON.stringify({ version: 1, analytics: false, marketing: false, updatedAt: new Date().toISOString() })))
  const page = await context.newPage()
  const errors = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push(e.message))

  if (protectedEntry) await page.goto(protectedEntry, { waitUntil: 'domcontentloaded' })
  await page.goto(new URL('/', `${baseOrigin}/`).href, { waitUntil: 'networkidle' })
  await page.locator('.wox-hero').waitFor({ state: 'visible' })
  await page.waitForTimeout(250)

  const compactNav = viewport.width <= 760
  let mobileMenuLinks = null
  let mobileGameHref = null
  if (compactNav) {
    await page.locator('.wox-mobile-ecosystem summary').click()
    mobileMenuLinks = await page.locator('.wox-mobile-ecosystem nav a').count()
    mobileGameHref = await page.locator('.wox-mobile-ecosystem nav a').first().getAttribute('href')
    await page.locator('.wox-mobile-ecosystem summary').click()
  }

  const metrics = await page.evaluate(() => {
    const rect = (selector) => {
      const el = document.querySelector(selector)
      if (!el) return null
      const box = el.getBoundingClientRect()
      return { width: Math.round(box.width), height: Math.round(box.height), display: getComputedStyle(el).display }
    }
    const oldIds = ['origin','worlds','atlas','characters','ecosystem','familiars','media-3d','development','roadmap']
    const oldSelectors = ['.wox-region-grid','.wox-atlas-grid','.wox-forms-grid','.wox-cast-grid','.wox-3d-grid','.wox-featured-cast','.wox-ecosystem-grid']
    const rawAssetPattern = /\.(?:fbx|glb|gltf|obj|blend|zip)(?:$|[?#])/i
    const allSources = [...document.querySelectorAll('[src],[href]')].map((el) => el.getAttribute('src') || el.getAttribute('href') || '')
    return {
      title: document.title,
      width: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth,
      hero: document.querySelectorAll('.wox-hero').length,
      actions: document.querySelectorAll('.wox-actions a').length,
      heroSpecs: document.querySelectorAll('.wox-hero-specs > span').length,
      supportCards: document.querySelectorAll('.wox-support-card').length,
      finalStatements: document.querySelectorAll('.wox-final').length,
      footers: document.querySelectorAll('.wox-footer').length,
      desktopNavLinks: document.querySelectorAll('.wox-ecosystem-nav > a').length,
      desktopGameHref: document.querySelector('.wox-ecosystem-nav > a')?.getAttribute('href') || '',
      greenNodeNavVisible: (() => {
        const el = document.querySelector('.wox-ecosystem-nav a[href="/green-node"]')
        if (!el) return false
        const box = el.getBoundingClientRect()
        return box.width > 0 && getComputedStyle(el).display !== 'none'
      })(),
      videoSrc: document.querySelector('.wox-bg-video')?.getAttribute('src') || '',
      videoPoster: document.querySelector('.wox-bg-video')?.getAttribute('poster') || '',
      oldSections: oldIds.filter((id) => document.getElementById(id)).length,
      oldWidgets: oldSelectors.reduce((total, selector) => total + document.querySelectorAll(selector).length, 0),
      forbiddenHeroOverlay: Boolean(document.querySelector('[src*="hero-family-resonance"]')),
      wispPresent: Boolean(document.querySelector('.xk-wisp.is-home-entry')),
      wispAsset: document.querySelector('.xk-wisp-specter-veyr')?.getAttribute('src') || '',
      wispRect: rect('.xk-wisp.is-home-entry'),
      rawPublicAssets: allSources.filter((value) => rawAssetPattern.test(value)),
      internalTextOverflow: ['.wox-status','.wox-hero h2','.wox-lead','.wox-actions a','.wox-hero-specs strong','.wox-hero-specs b','.wox-support-card h2','.wox-final p','.wox-footer']
        .flatMap((selector) => [...document.querySelectorAll(selector)])
        .filter((el) => el.scrollWidth > el.clientWidth + 3)
        .map((el) => el.textContent?.trim() || selector),
    }
  })

  await page.screenshot({ path: `${out}/${name}.png`, fullPage: true })
  const overflow = metrics.width > metrics.client
  const expectedVideo = '/assets/bg-dragon-animated.mp4'
  const expectedPoster = '/assets/bg-dragon-poster.webp'
  const expectedWisp = '/assets/world-of-xethkioz/web-art/veyr-green-sigil.svg'

  if (
    metrics.hero !== 1 ||
    metrics.actions !== 3 ||
    metrics.heroSpecs !== 4 ||
    metrics.supportCards !== 1 ||
    metrics.finalStatements !== 1 ||
    metrics.footers !== 1 ||
    metrics.videoSrc !== expectedVideo ||
    metrics.videoPoster !== expectedPoster ||
    metrics.oldSections !== 0 ||
    metrics.oldWidgets !== 0 ||
    metrics.forbiddenHeroOverlay ||
    !metrics.wispPresent ||
    metrics.wispAsset !== expectedWisp ||
    metrics.rawPublicAssets.length ||
    metrics.internalTextOverflow.length ||
    (!compactNav && (metrics.desktopNavLinks !== 7 || metrics.desktopGameHref !== '/world-of-xethkioz' || !metrics.greenNodeNavVisible)) ||
    (compactNav && (mobileMenuLinks !== 7 || mobileGameHref !== '/world-of-xethkioz')) ||
    (viewport.width >= 1280 && metrics.wispRect && metrics.wispRect.width > 120) ||
    overflow ||
    errors.length
  ) {
    throw new Error(`WOX short-home visual QA failed for ${name}: ${JSON.stringify({ ...metrics, mobileMenuLinks, mobileGameHref, overflow, errors })}`)
  }

  console.log(JSON.stringify({ name, ...metrics, mobileMenuLinks, mobileGameHref, overflow, errors }))
  await context.close()
}

await browser.close()

import { chromium } from '@playwright/test'
import { mkdir } from 'node:fs/promises'

const out = 'artifacts/wox-home-visual'
const previewUrl = process.env.WOX_PREVIEW_URL || 'http://127.0.0.1:4173/'
await mkdir(out, { recursive: true })
const browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' })
const cases = [
  ['desktop', { width: 1440, height: 1000 }],
  ['laptop', { width: 1024, height: 900 }],
  ['tablet', { width: 768, height: 900 }],
  ['phone430', { width: 430, height: 932 }],
  ['mobile', { width: 390, height: 844 }],
]
const canonicalFormNames = ['XETHKIOZ', 'KILLARUNA', 'MOZARUK', 'HELLER', 'KAHEZER', 'ITZUKE', 'DVALIN', 'OKUNINUST']
for (const [name, viewport] of cases) {
  const page = await browser.newPage({ viewport })
  const errors = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push(e.message))
  await page.goto(previewUrl, { waitUntil: 'networkidle' })
  await page.screenshot({ path: `${out}/${name}-fold.png`, fullPage: false })
  let mobileMenuLinks = null
  const compactNav = viewport.width <= 760
  if (compactNav) {
    await page.locator('.wox-mobile-ecosystem summary').click()
    mobileMenuLinks = await page.locator('.wox-mobile-ecosystem nav a').count()
    await page.locator('.wox-mobile-ecosystem summary').click()
  }
  await page.locator('.wox-forms-grid article').nth(3).locator('button').click()
  await page.locator('.wox-cast-grid article').nth(5).locator('button').click()
  await page.waitForTimeout(180)
  const metrics = await page.evaluate(() => ({
    title: document.title,
    width: document.documentElement.scrollWidth,
    client: document.documentElement.clientWidth,
    h1: document.querySelector('h1')?.textContent?.trim() || '',
    castCards: document.querySelectorAll('.wox-cast-grid article').length,
    featuredCastCards: document.querySelectorAll('.wox-featured-cast article').length,
    ecosystemCards: document.querySelectorAll('.wox-ecosystem-grid > a').length,
    greenNodeNavVisible: (() => { const el = document.querySelector('.wox-ecosystem-nav a[href="/green-node"]'); return Boolean(el && el.getBoundingClientRect().width > 0 && getComputedStyle(el).display !== 'none') })(),
    greenNodeCardVisible: (() => { const el = document.querySelector('.wox-ecosystem-grid > a[href="/green-node"]'); return Boolean(el && el.getBoundingClientRect().width > 0 && getComputedStyle(el).display !== 'none') })(),
    activeForm: document.querySelector('.wox-form-console h3')?.textContent?.trim() || '',
    formNames: [...document.querySelectorAll('.wox-forms-grid strong')].map((el) => el.textContent?.trim() || ''),
    activeCast: document.querySelector('.wox-cast-console h3')?.textContent?.trim() || '',
    ecosystemLinks: [...document.querySelectorAll('.wox-ecosystem-nav a, .wox-tools .wox-news-link')].map((a) => ({ text: a.textContent?.trim(), href: a.getAttribute('href') })),
    gameNavLinks: document.querySelectorAll('.wox-game-nav a').length,
    heroSpecs: document.querySelectorAll('.wox-hero-specs a').length,
    heroKeyArt: document.querySelector('.wox-hero-keyart')?.getAttribute('src') || '',
    chapterPanels: document.querySelectorAll('.wox-section[data-chapter]').length,
    sectionDockLinks: document.querySelectorAll('.wox-section-dock div a').length,
    sectionDockVisible: document.querySelector('.wox-section-dock')?.classList.contains('is-visible') || false,
    sectionDockActive: document.querySelector('.wox-section-dock a[aria-current="location"]')?.textContent?.trim() || '',
    wispPresent: Boolean(document.querySelector('.xk-wisp.is-home-entry')),
    wispAsset: document.querySelector('.xk-wisp-specter-veyr')?.getAttribute('src') || '',
    media3dSlots: document.querySelectorAll('#media-3d .wox-3d-grid article').length,
    media3dImages: document.querySelectorAll('#media-3d img').length,
    media3dVeyr: document.querySelector('#media-3d .wox-3d-viewport.is-veyr img')?.getAttribute('src') || '',
    legacyHeroLabelPresent: document.querySelector('.wox-status')?.textContent?.includes('2.5D') || false,
    reservedMediaFrames: document.querySelectorAll('.wox-media-placeholder').length,
    protectedSigils: document.querySelectorAll('.wox-atlas-console .wox-protected-sigil, .wox-form-console .wox-protected-sigil, .wox-cast-console .wox-protected-sigil').length,
    duoXethkiozImage: document.querySelector('.wox-duo-grid article:nth-child(2) .wox-media-placeholder img')?.getAttribute('src') || '',
    regionKeyArt: [...document.querySelectorAll('#worlds .wox-region-keyart')].map((el) => el.getAttribute('src') || ''),
    duoTravelerImage: document.querySelector('.wox-duo-grid article:first-child .wox-media-placeholder img')?.getAttribute('src') || '',
    randomSectionImages: [...document.querySelectorAll('#worlds img, #atlas img, #characters img')].filter((el) => !(el.getAttribute('src') || '').includes('/web-art/biome-')).length,
    formMediaSubject: document.querySelector('.wox-form-console .wox-media-placeholder strong')?.textContent?.trim() || '',
    castMediaSubject: document.querySelector('.wox-cast-console .wox-media-placeholder strong')?.textContent?.trim() || '',
    internalTextOverflow: ['.wox-region-grid h3', '.wox-atlas-grid h3', '.wox-forms-grid strong', '.wox-cast-grid strong', '.wox-3d-copy strong', '.wox-dev-grid strong', '.wox-roadmap-grid strong'].flatMap((selector) => [...document.querySelectorAll(selector)]).filter((el) => el.scrollWidth > el.clientWidth + 2).map((el) => el.textContent?.trim() || ''),
  }))
  await page.screenshot({ path: `${out}/${name}.png`, fullPage: true })
  const overflow = metrics.width > metrics.client
  if (metrics.media3dSlots !== 3 || metrics.media3dImages !== 1 || metrics.media3dVeyr !== '/assets/world-of-xethkioz/web-art/veyr-green-sigil.svg' || metrics.legacyHeroLabelPresent || metrics.wispAsset !== '/assets/world-of-xethkioz/web-art/veyr-green-sigil.svg' || metrics.gameNavLinks !== 6 || metrics.heroSpecs !== 4 || metrics.heroKeyArt !== '/assets/world-of-xethkioz/web-art/hero-family-resonance.svg' || metrics.chapterPanels !== 11 || metrics.sectionDockLinks !== 6 || !metrics.sectionDockVisible || metrics.reservedMediaFrames !== 6 || metrics.protectedSigils !== 3 || metrics.featuredCastCards !== 9 || metrics.ecosystemCards !== 4 || (!compactNav && !metrics.greenNodeNavVisible) || !metrics.greenNodeCardVisible || metrics.duoTravelerImage !== '/assets/world-of-xethkioz/web-art/player-etereo-sigil.svg' || metrics.duoXethkiozImage !== '/assets/world-of-xethkioz/web-art/xethkioz-resonance-sigil.svg' || JSON.stringify(metrics.regionKeyArt) !== JSON.stringify(['/assets/world-of-xethkioz/web-art/biome-izrdralar.svg','/assets/world-of-xethkioz/web-art/biome-desfralar.svg','/assets/world-of-xethkioz/web-art/biome-xiomalar.svg','/assets/world-of-xethkioz/web-art/biome-zodnight.svg','/assets/world-of-xethkioz/web-art/biome-isla-temporal.svg']) || metrics.randomSectionImages !== 0 || JSON.stringify(metrics.formNames) !== JSON.stringify(canonicalFormNames) || metrics.formMediaSubject !== 'HELLER' || metrics.castMediaSubject !== 'Nikoras' || metrics.internalTextOverflow.length || (compactNav && mobileMenuLinks !== 7) || overflow || errors.length) {
    throw new Error(`WOX visual QA failed for ${name}: ${JSON.stringify({ ...metrics, mobileMenuLinks, overflow, errors })}`)
  }
  console.log(JSON.stringify({ name, ...metrics, mobileMenuLinks, overflow, errors }))
  await page.close()
}
await browser.close()

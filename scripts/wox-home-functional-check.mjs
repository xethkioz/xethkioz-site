import { chromium } from '@playwright/test'

const previewUrl = new URL(process.env.WOX_PREVIEW_URL || 'http://127.0.0.1:4189/')
const baseOrigin = previewUrl.origin
const protectedEntry = previewUrl.search ? previewUrl.href : ''
const browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' })
const cases = [
  { name: 'es', path: '/', game: '/world-of-xethkioz', green: '/green-node', support: '/support', langButton: 'EN', toggle: '/en' },
  { name: 'en', path: '/en', game: '/en/world-of-xethkioz', green: '/en/green-node', support: '/en/support', langButton: 'ES', toggle: '/' },
]

for (const test of cases) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
  await context.addInitScript(() => localStorage.setItem('xethkioz.privacy-consent.v1', JSON.stringify({ version: 1, analytics: false, marketing: false, updatedAt: new Date().toISOString() })))
  const page = await context.newPage()
  const errors = []
  page.on('console', msg => msg.type() === 'error' && errors.push(msg.text()))
  page.on('pageerror', err => errors.push(err.message))

  if (protectedEntry) await page.goto(protectedEntry, { waitUntil: 'domcontentloaded' })
  await page.goto(new URL(test.path, `${baseOrigin}/`).href, { waitUntil: 'networkidle' })

  if ((await page.locator('.wox-tools button').innerText()).trim() !== test.langButton) throw new Error(`${test.name}: wrong language target`)
  if (await page.locator('.wox-hero').count() !== 1) throw new Error(`${test.name}: hero missing`)
  if (await page.locator('.wox-actions a').count() !== 3) throw new Error(`${test.name}: hero CTA count mismatch`)
  if (await page.locator('.wox-hero-specs > span').count() !== 4) throw new Error(`${test.name}: hero metrics mismatch`)
  if (await page.locator('.wox-support-card').count() !== 1) throw new Error(`${test.name}: support block missing`)
  if (await page.locator('.wox-final').count() !== 1) throw new Error(`${test.name}: final statement missing`)
  if (await page.locator('.wox-footer').count() !== 1) throw new Error(`${test.name}: footer missing`)

  const oldSections = ['origin', 'worlds', 'atlas', 'characters', 'ecosystem', 'familiars', 'media-3d', 'development', 'roadmap']
  for (const id of oldSections) if (await page.locator(`#${id}`).count() !== 0) throw new Error(`${test.name}: retired Home section #${id} returned`)

  const gameHref = await page.locator('.wox-ecosystem-nav > a').first().getAttribute('href')
  if (gameHref !== test.game) throw new Error(`${test.name}: game portal href mismatch: ${gameHref}`)

  const video = page.locator('.wox-bg-video')
  if (await video.count() !== 1) throw new Error(`${test.name}: ambient background video missing`)
  if (await video.getAttribute('src') !== '/assets/bg-dragon-animated.mp4') throw new Error(`${test.name}: wrong ambient background`)
  if (await video.getAttribute('poster') !== '/assets/bg-dragon-poster.webp') throw new Error(`${test.name}: wrong ambient poster`)

  await page.locator('.wox-utility-rail button').click()
  await page.locator('#nexus-chat-panel').waitFor({ state: 'visible' })
  await page.locator('button[aria-controls="nexus-chat-panel"]').click()
  await page.locator('#nexus-chat-panel').waitFor({ state: 'detached' })

  const expectedLinks = test.name === 'es'
    ? ['/world-of-xethkioz', '/gaming', '/creacion-web', '/news', '/login', '/support', '/privacy', '/contact', '/green-node']
    : ['/en/world-of-xethkioz', '/en/gaming', '/en/creacion-web', '/news', '/login', '/en/support', '/en/privacy', '/en/contact', '/en/green-node']
  const hrefs = await page.locator('a').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')).filter(Boolean))
  for (const href of expectedLinks) if (!hrefs.includes(href)) throw new Error(`${test.name}: missing link ${href}`)

  const wisp = page.locator('.xk-wisp.is-home-entry')
  if (await wisp.count() !== 1) throw new Error(`${test.name}: localized home Wisp missing`)

  await page.goto(new URL(test.game, `${baseOrigin}/`).href, { waitUntil: 'networkidle' })
  if (await page.locator('.wox-portal').count() !== 1) throw new Error(`${test.name}: dedicated game portal missing`)
  if (await page.locator('.wox-portal-regions article').count() !== 5) throw new Error(`${test.name}: game portal region count mismatch`)
  if (await page.locator('.wox-portal-cast-line article').count() !== 6) throw new Error(`${test.name}: protected game portal cast mismatch`)
  if (await page.locator('#historia').count() !== 1 || await page.locator('#mundo').count() !== 1 || await page.locator('#convergencia').count() !== 1 || await page.locator('#arte-visual').count() !== 1) {
    throw new Error(`${test.name}: game portal chapters missing`)
  }

  const rawAssetRefs = await page.locator('[src],[href]').evaluateAll(nodes => nodes.map(node => node.getAttribute('src') || node.getAttribute('href') || '').filter(value => /\.(?:fbx|glb|gltf|obj|blend|zip)(?:$|[?#])/i.test(value)))
  if (rawAssetRefs.length) throw new Error(`${test.name}: raw production asset exposed: ${JSON.stringify(rawAssetRefs)}`)

  await page.goto(new URL(test.path, `${baseOrigin}/`).href, { waitUntil: 'networkidle' })
  await page.locator('.wox-tools button').click()
  await page.waitForURL(url => url.pathname === test.toggle, { timeout: 5000 })

  if (errors.length) throw new Error(`${test.name}: browser errors ${JSON.stringify(errors)}`)
  console.log(JSON.stringify({
    locale: test.name,
    home: 'SHORT_PASS',
    gamePortal: test.game,
    regions: 5,
    publicCast: 6,
    chat: 'PASS',
    wisp: 'PASS',
    languageToggle: test.toggle,
    rawAssets: 0,
    errors,
  }))
  await context.close()
}

await browser.close()

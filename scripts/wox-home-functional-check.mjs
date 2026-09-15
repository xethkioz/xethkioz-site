import { chromium } from '@playwright/test'

const previewUrl = new URL(process.env.WOX_PREVIEW_URL || 'http://127.0.0.1:4189/')
const baseOrigin = previewUrl.origin
const protectedEntry = previewUrl.search ? previewUrl.href : ''
const browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' })
const cases = [
  { name: 'es', path: '/', green: '/green-node', langButton: 'EN' },
  { name: 'en', path: '/en', green: '/en/green-node', langButton: 'ES' },
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

  const sectionIds = ['origin', 'worlds', 'atlas', 'characters', 'media-3d', 'development']
  for (const id of sectionIds) if (await page.locator(`#${id}`).count() !== 1) throw new Error(`${test.name}: missing #${id}`)
  if ((await page.locator('.wox-tools button').innerText()).trim() !== test.langButton) throw new Error(`${test.name}: wrong language target`)

  for (let i = 0; i < 4; i++) {
    await page.locator('.wox-region-grid article').nth(i).locator('button').click()
    if (await page.locator(`.wox-region-console[data-region="${i + 1}"]`).count() !== 1) throw new Error(`${test.name}: region ${i + 1} did not activate`)
  }
  for (let i = 0; i < 4; i++) {
    await page.locator('.wox-atlas-grid article').nth(i).locator('button').click()
    if (await page.locator(`.wox-atlas-console[data-atlas="${i + 1}"]`).count() !== 1) throw new Error(`${test.name}: atlas ${i + 1} did not activate`)
  }
  for (let i = 0; i < 8; i++) {
    await page.locator('.wox-forms-grid article').nth(i).locator('button').click()
    if (await page.locator(`.wox-form-console[data-form="${i + 1}"]`).count() !== 1) throw new Error(`${test.name}: form ${i + 1} did not activate`)
  }
  for (let i = 0; i < 14; i++) {
    await page.locator('.wox-cast-grid article').nth(i).locator('button').click()
    if (await page.locator(`.wox-cast-console[data-cast="${i + 1}"]`).count() !== 1) throw new Error(`${test.name}: cast ${i + 1} did not activate`)
  }

  await page.locator('.wox-actions button').click()
  await page.locator('#nexus-chat-panel').waitFor({ state: 'visible' })
  await page.locator('button[aria-controls="nexus-chat-panel"]').click()
  await page.locator('#nexus-chat-panel').waitFor({ state: 'detached' })

  const expectedLinks = test.name === 'es'
    ? ['/gaming', '/nexus-city', '/creacion-web', '/news', '/login', '/support', '/privacy', '/contact', '/green-node']
    : ['/en/gaming', '/en/nexus-city', '/en/creacion-web', '/news', '/login', '/en/support', '/en/privacy', '/en/contact', '/en/green-node']
  const hrefs = await page.locator('a').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')).filter(Boolean))
  for (const href of expectedLinks) if (!hrefs.includes(href)) throw new Error(`${test.name}: missing link ${href}`)

  const wisp = page.locator('.xk-wisp.is-home-entry')
  if (await wisp.count() !== 1) throw new Error(`${test.name}: localized home Wisp missing`)
  await wisp.click({ force: true })
  await page.waitForURL(url => url.pathname === test.green, { timeout: 5000 })
  await page.locator('.xk-wisp.is-inside-node').waitFor({ state: 'visible', timeout: 5000 })

  await page.goto(new URL(test.path, `${baseOrigin}/`).href, { waitUntil: 'networkidle' })
  await page.locator('.wox-tools button').click()
  const expectedTogglePath = test.name === 'es' ? '/en' : '/'
  await page.waitForURL(url => url.pathname === expectedTogglePath, { timeout: 5000 })
  if (errors.length) throw new Error(`${test.name}: browser errors ${JSON.stringify(errors)}`)
  console.log(JSON.stringify({ locale: test.name, sections: sectionIds.length, regions: 4, atlas: 4, forms: 8, cast: 14, chat: 'PASS', wisp: test.green, languageToggle: expectedTogglePath, errors }))
  await context.close()
}

await browser.close()

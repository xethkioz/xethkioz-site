import assert from 'node:assert/strict'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// Only this PR's stable workers.dev URL is accepted. Never probe production
// or send credentials, form submissions, admin mutations or recovery emails.
export async function verifyCloudflarePreview(input, fetchRequest = fetch) {
  const base = new URL(input)
  assert.ok(base.protocol === 'https:' && !base.username && !base.password
    && !base.port && base.pathname === '/' && !base.search && !base.hash
    && /^xethkioz-site-pr236\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.workers\.dev$/.test(base.hostname),
  'Use the HTTPS workers.dev root URL for xethkioz-site-pr236.')

  let checks = 0
  async function get(path, expected = 200, method = 'GET') {
    const response = await fetchRequest(new URL(path, base).href, {
      method, redirect: 'manual', signal: AbortSignal.timeout(15_000),
      headers: { 'User-Agent': 'Xethkioz-Preview-Check/1.0' },
    })
    const text = await response.text()
    assert.equal(response.status, expected, `${method} ${path}: HTTP ${response.status}`)
    assert.match(response.headers.get('x-robots-tag') || '', /\bnoindex\b/i, `${path}: missing noindex`)
    assert.equal(response.headers.get('x-content-type-options'), 'nosniff', `${path}: missing nosniff`)
    assert.equal(response.headers.get('x-frame-options'), 'DENY', `${path}: missing frame protection`)
    checks += 1
    return { response, text }
  }

  const home = await get('/')
  assert.match(home.response.headers.get('content-type') || '', /text\/html/i)
  assert.match(home.text, /XETHKIOZ/i)
  for (const path of ['/gaming', '/science', '/comicon', '/mascotas', '/news', '/en', '/account', '/cms']) {
    const result = await get(path)
    assert.match(result.response.headers.get('content-type') || '', /text\/html/i, path)
    assert.match(result.text, /XETHKIOZ/i, path)
  }

  // Fetch assets actually referenced by this deployment, without following
  // third-party URLs or assuming that a 200 HTML fallback is a working bundle.
  for (const [extension, type] of [['js', /javascript/i], ['css', /text\/css/i]]) {
    const asset = home.text.match(new RegExp(`(?:src|href)=["'](/assets/[^"']+\\.${extension})["']`))?.[1]
    assert.ok(asset, `Home is missing a local ${extension} asset`)
    const result = await get(asset)
    assert.match(result.response.headers.get('content-type') || '', type, asset)
    assert.match(result.response.headers.get('cache-control') || '', /immutable/i, asset)
    assert.ok(result.text.length > 0, `${asset}: empty asset`)
  }

  for (const [path, target] of [['/register', '/account'], ['/gaming/', '/gaming']]) {
    const result = await get(`${path}?ref=pr236`, 308)
    const destination = new URL(result.response.headers.get('location'), base)
    assert.equal(destination.origin, base.origin, `${path}: redirected away from preview`)
    assert.equal(destination.pathname, target)
    assert.equal(destination.search, '?ref=pr236')
  }
  await get('/__pr236_missing_route__', 404)
  await get('/api/__pr236_missing_route__', 404)

  const health = await get('/api/auth-health')
  assert.match(health.response.headers.get('cache-control') || '', /no-store/i)
  assert.match(health.response.headers.get('content-type') || '', /application\/json/i)
  const diagnostic = JSON.parse(health.text)
  assert.equal(diagnostic.ok, true)
  assert.equal(diagnostic.supabasePublicConfigReady, true)
  assert.ok(['cloudflare', 'supabase-edge'].includes(diagnostic.visitLoggingBackend),
    'Auth diagnostics do not describe the Cloudflare deployment')
  assert.equal((await get('/api/auth-health', 200, 'HEAD')).text, '')
  for (const path of ['/sitemap.xml', '/news-sitemap.xml', '/feed.xml']) {
    const result = await get(path)
    assert.match(result.response.headers.get('content-type') || '', /xml/i, path)
    assert.match(result.text, /<(?:urlset|rss)\b/, path)
  }

  return {
    url: base.origin, checks,
    visitLoggingBackend: diagnostic.visitLoggingBackend,
    serverRecoveryAvailable: diagnostic.serverRecoveryAvailable === true,
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    assert.equal(process.argv.length, 3, 'Usage: npm run smoke:cloudflare -- <preview-workers.dev-url>')
    const result = await verifyCloudflarePreview(process.argv[2])
    console.log(`Cloudflare preview: ${result.checks} HTTP checks passed at ${result.url}`)
    console.log(`Visit backend: ${result.visitLoggingBackend}; recovery configured: ${result.serverRecoveryAvailable}`)
    console.log('Login, CMS, forms and actual Free-plan CPU/quotas still require live validation. No writes were sent.')
  } catch (error) {
    console.error(error.message)
    process.exitCode = 1
  }
}

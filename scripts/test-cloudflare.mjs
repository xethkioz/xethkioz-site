import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { Miniflare, Response, convertV4MiniflareOptions } from 'miniflare'

const config = JSON.parse(readFileSync('wrangler.json', 'utf8'))
const routes = JSON.parse(readFileSync('vercel.json', 'utf8'))
const origin = 'https://www.xethkioz.com.ar'
const publishedAt = new Date(Date.now() - 60 * 60 * 1000).toISOString()
const article = {
  slug: 'prueba-cloudflare', title: 'Prueba <segura> & local', summary: 'Resumen de prueba',
  category: 'gaming', published_at: publishedAt, updated_at: publishedAt,
  created_at: publishedAt, cover_image_url: null, cover_image_alt: null, tags: ['gaming'],
}
let publicReads = 0
let unexpectedRequests = 0
let checks = 0

// All outbound traffic is replaced here. Tests cannot write to Supabase,
// send messages, access credentials or call a live service.
const mf = new Miniflare(convertV4MiniflareOptions({
  modules: true, scriptPath: '.cloudflare-build/worker.js',
  compatibilityDate: config.compatibility_date, compatibilityFlags: config.compatibility_flags,
  host: '127.0.0.1', port: 0, cf: false, telemetry: { enabled: false },
  bindings: { ...config.vars, SUPABASE_SERVICE_ROLE_KEY: 'test-only-service-role' },
  assets: {
    directory: config.assets.directory, binding: config.assets.binding,
    routerConfig: { has_user_worker: true },
    run_worker_first: config.assets.run_worker_first,
    assetConfig: { html_handling: config.assets.html_handling, not_found_handling: config.assets.not_found_handling },
  },
  outboundService: (request) => {
    const url = new URL(request.url)
    if (request.method === 'GET' && url.origin === config.vars.SUPABASE_URL
      && url.pathname === '/rest/v1/news_articles') {
      assert.equal(url.searchParams.get('status'), 'eq.published')
      assert.match(url.searchParams.get('published_at'), /^lte\./)
      assert.equal(request.headers.get('authorization'), null)
      publicReads += 1
      const slug = url.searchParams.get('slug')
      return Response.json(!slug || slug === `eq.${article.slug}` ? [article] : [])
    }
    unexpectedRequests += 1
    return new Response('Outbound access disabled in tests', { status: 503 })
  },
}))

async function request(path, options) {
  const response = await mf.dispatchFetch(new URL(path, origin), { redirect: 'manual', ...options })
  const text = await response.text()
  if (typeof response.waitUntil === 'function') await response.waitUntil()
  return { response, text }
}
function status(result, expected) {
  assert.equal(result.response.status, expected, `${result.response.url}: ${result.text.slice(0, 600)}`)
  checks += 1
}
function secure(result) {
  assert.equal(result.response.headers.get('x-content-type-options'), 'nosniff')
  assert.equal(result.response.headers.get('x-frame-options'), 'DENY')
}

try {
  // Exercise Cloudflare's real asset router, including rewrites and private shells.
  for (const route of routes.rewrites.filter((r) => !r.destination.startsWith('/api/'))) {
    if (route.source.length > 1 && route.source.endsWith('/')) continue
    const path = route.source.replace('(.*)', 'content').replace(/:\w+/g, 'example')
    const result = await request(path)
    status(result, 200)
    assert.equal(result.text, readFileSync(`dist-cloudflare${route.destination}`, 'utf8'), path)
    secure(result)
  }
  for (const path of ['/cms', '/cms/content', '/account', '/profile', '/nexus-city/u/example']) {
    assert.match((await request(path)).response.headers.get('x-robots-tag'), /noindex/)
    checks += 1
  }
  const asset = readdirSync('dist-cloudflare/assets').find((name) => /-[\w-]+\.js$/.test(name))
  const assetResult = await request(`/assets/${asset}`)
  status(assetResult, 200)
  assert.match(assetResult.response.headers.get('cache-control'), /immutable/)
  assert.equal(publicReads, 0, 'Static routes must not access Supabase')

  for (const [path, target] of [['/register', '/account'], ['/gaming/', '/gaming'], ['/mascotas/', '/mascotas'], ['/news/prueba-cloudflare/', '/news/prueba-cloudflare']]) {
    const result = await request(`${path}?ref=test`)
    status(result, 308)
    assert.equal(new URL(result.response.headers.get('location'), origin).pathname, target)
    assert.equal(new URL(result.response.headers.get('location'), origin).search, '?ref=test')
  }
  const missing = await request('/no-existe-esta-ruta')
  status(missing, 404)
  assert.match(missing.response.headers.get('x-robots-tag'), /noindex/)
  secure(missing)
  status(await request('/api/no-existe'), 404)
  status(await request('/news/%E0%A4%A'), 400)

  const health = await request('/api/auth-health')
  status(health, 200)
  assert.equal(JSON.parse(health.text).visitLoggingBackend, 'cloudflare')
  assert.equal(JSON.parse(health.text).supabasePublicConfigReady, true)
  assert.doesNotMatch(health.text, /test-only-service-role/)
  assert.match(health.response.headers.get('cache-control'), /no-store/)
  const head = await request('/api/auth-health', { method: 'HEAD' })
  status(head, 200)
  assert.equal(head.text, '')
  for (const path of ['/api/admin-auth-link', '/api/generate-news']) {
    status(await request(path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' }), 401)
  }
  status(await request('/api/visit-log'), 405)
  status(await request('/api/visit-log', { method: 'POST', headers: { origin: 'https://example.invalid', 'content-type': 'application/json' }, body: '{}' }), 403)
  status(await request('/api/web-quote', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{broken' }), 400)
  const oversized = new ReadableStream({ start(controller) { controller.enqueue(new TextEncoder().encode('x'.repeat(32_001))); controller.close() } })
  status(await request('/api/web-quote', { method: 'POST', headers: { 'content-type': 'application/json' }, body: oversized, duplex: 'half' }), 413)
  assert.equal(publicReads, 0, 'Rejected requests must not reach Supabase')

  const news = await request(`/news/${article.slug}`)
  status(news, 200)
  assert.match(news.text, /Prueba &lt;segura&gt; &amp; local/)
  assert.match(news.text, /https:\/\/www\.xethkioz\.com\.ar\/news\/prueba-cloudflare/)
  assert.match(news.text, /NewsArticle/)
  assert.equal(publicReads, 1, 'Article shell must load from ASSETS, not over the network')
  const cache = (await mf.getCaches()).default
  assert.ok(await cache.match(`${origin}/news/${article.slug}`), 'Published article must enter the public cache')
  status(await request(`/news/${article.slug}`), 200)
  assert.equal(publicReads, 1, 'Repeat article reads should reuse the cache')
  status(await request(`/news/${article.slug}`, { headers: { cookie: 'session=test-only' } }), 200)
  assert.equal(publicReads, 2, 'Requests with cookies must bypass the shared cache')
  status(await request('/news/no-existe'), 404)
  assert.equal(await cache.match(`${origin}/news/no-existe`), undefined)
  assert.equal(await cache.match(`${origin}/api/auth-health`), undefined)

  for (const path of ['/sitemap.xml', '/news-sitemap.xml', '/feed.xml']) {
    const result = await request(path)
    status(result, 200)
    assert.match(result.text, /prueba-cloudflare/)
    assert.match(result.response.headers.get('content-type'), /xml/)
  }
  for (const path of ['/', `/news/${article.slug}`]) {
    const preview = await request(`https://xethkioz-site.example.workers.dev${path}`)
    status(preview, 200)
    assert.match(preview.response.headers.get('x-robots-tag'), /noindex/)
  }
  assert.equal(unexpectedRequests, 0, 'No unmocked outbound requests are allowed')
  console.log(`Cloudflare runtime: ${checks} checks passed; all external requests were simulated.`)
} finally {
  await mf.dispose()
}

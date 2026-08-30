import fs from 'node:fs'

const issues = []
const read = (path) => fs.readFileSync(path, 'utf8')
const assert = (condition, message) => { if (!condition) issues.push(message) }

const vercel = JSON.parse(read('vercel.json'))
const sitemap = read('api/sitemap.ts')
const newsPage = read('api/news-page.ts')
const seoShells = read('scripts/generate-seo-shells.mjs')
const notFound = read('api/not-found.ts')
const streamsMigration = read('supabase/migrations/20260723153000_streams_public_radar.sql')
const streamsIndexMigration = read('supabase/migrations/20260723154500_streams_created_by_index.sql')
const visitLog = read('api/visit-log.ts')
const visitLogMigration = read('supabase/migrations/20260724153500_privacy_preserving_visit_telemetry.sql')

const redirectMap = new Map((vercel.redirects ?? []).map((item) => [item.source, item]))
const funRedirect = redirectMap.get('/fun')
assert(funRedirect?.destination === '/nexus-city' && funRedirect?.permanent === true, 'The legacy Fun route must permanently redirect to Nexus City.')
assert(redirectMap.get('/en/fun')?.destination === '/en/nexus-city', 'The English legacy Fun route must redirect to English Nexus City.')
assert(redirectMap.get('/web-creation')?.destination === '/creacion-web', 'Legacy web creation path must redirect at the HTTP layer.')
assert(redirectMap.get('/register')?.destination === '/account', 'Legacy register path must redirect at the HTTP layer.')
assert(redirectMap.get('/admin')?.destination === '/cms', 'Legacy admin path must redirect at the HTTP layer.')

const rewrites = vercel.rewrites ?? []
const rewriteMap = new Map(rewrites.map((item) => [item.source, item.destination]))
assert(rewriteMap.get('/nexus-city') === '/seo-shells/fun.html', 'Nexus City must have a first-class indexable SEO shell.')
assert(rewriteMap.get('/en/nexus-city') === '/seo-shells/en-fun.html', 'English Nexus City must have a localized SEO shell.')
assert(sitemap.includes("es: '/nexus-city', en: '/en/nexus-city'"), 'Nexus City and its English counterpart must remain in the sitemap.')
assert(seoShells.includes("path: '/nexus-city'") && seoShells.includes("path: '/en/nexus-city'"), 'Nexus City must generate standalone localized SEO shells.')
assert(rewriteMap.get('/green-node') === '/seo-shells/green-node.html', 'Green Node Protect must use its dedicated public SEO shell.')
assert(rewriteMap.get('/green-node/vault') === '/private.html', 'Green Node Vault 13 must resolve through the private noindex shell.')
assert(sitemap.includes("path: '/green-node'"), 'Green Node Protect must remain discoverable in the sitemap.')
assert(seoShells.includes("file: 'green-node.html'") && seoShells.includes("path: '/green-node'"), 'Green Node Protect must generate a dedicated SEO shell.')
assert(rewriteMap.get('/news/:slug') === '/api/news-page?slug=:slug', 'Article routes must preserve the slug query for the dynamic SEO shell.')
assert(newsPage.includes("new URL(rawUrl, 'http://localhost').searchParams.get(key)"), 'The article SEO shell must parse its slug with the WHATWG URL API.')
assert(!newsPage.includes('request.query'), 'The article SEO shell must not access Vercel request.query because legacy runtimes invoke url.parse().')
assert(newsPage.includes('trustedShellOrigin') && newsPage.includes("origin.endsWith('.vercel.app')"), 'The article shell fetch must reject untrusted Host values and preserve protected previews.')
assert(newsPage.includes('process.env.VERCEL_URL') && newsPage.includes('AbortSignal.timeout(4500)'), 'The article shell must use the immutable deployment URL and a bounded self-fetch.')
assert(rewriteMap.get('/nexus-city/u/:handle') === '/index.html', 'Public Nexus passport deep links must remain valid.')
assert(rewriteMap.get('/nexus-city/room/:handle') === '/index.html', 'Nexus room deep links must remain valid.')
assert(rewriteMap.get('/nexus-city/vip') === '/private.html', 'VIP Nexus access must use the private noindex shell.')
assert(rewriteMap.get('/((?!api/).*)') === '/api/not-found', 'Unknown direct requests must resolve through the real 404 function.')
assert(notFound.includes('response.status(404).send(html)'), 'The not-found endpoint must return HTTP 404.')
assert(notFound.includes("'X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet, noimageindex'"), 'The not-found response must prevent indexing.')

const headerMap = new Map((vercel.headers ?? []).map((item) => [item.source, item.headers ?? []]))
const globalHeaders = headerMap.get('/(.*)') ?? []
const passportHeaders = headerMap.get('/nexus-city/u/(.*)') ?? []
const greenProtectHeaders = headerMap.get('/green-node') ?? []
const greenVaultHeaders = headerMap.get('/green-node/vault') ?? []
const enforcedCsp = globalHeaders.find((item) => item.key === 'Content-Security-Policy')?.value ?? ''
const observedCsp = globalHeaders.find((item) => item.key === 'Content-Security-Policy-Report-Only')?.value ?? ''
assert(Boolean(enforcedCsp), 'An enforced Content-Security-Policy header is required in production.')
assert(Boolean(observedCsp), 'A stricter report-only CSP must remain available for the next hardening stage.')
assert(enforcedCsp.includes("default-src 'self'"), 'Enforced CSP must default to same-origin resources.')
assert(enforcedCsp.includes("object-src 'none'"), 'Enforced CSP must block plugin/object content.')
assert(enforcedCsp.includes("frame-ancestors 'none'"), 'Enforced CSP must prevent framing.')
assert(enforcedCsp.includes("script-src-attr 'none'"), 'Enforced CSP must reject inline event-handler attributes.')
assert(enforcedCsp.includes("form-action 'self'"), 'Enforced CSP must restrict form submissions to the application origin.')
assert(enforcedCsp.includes('https://*.googletagmanager.com'), 'Enforced CSP must support the documented GA4 script endpoint.')
assert(enforcedCsp.includes('https://*.google-analytics.com') && enforcedCsp.includes('https://*.analytics.google.com'), 'Enforced CSP must support documented GA4 collection endpoints.')
assert(enforcedCsp.includes('https://*.clarity.ms') && enforcedCsp.includes('https://c.bing.com'), 'Enforced CSP must support documented Microsoft Clarity endpoints.')
assert(!enforcedCsp.includes('script-src https:'), 'Enforced CSP must not allow scripts from every HTTPS origin.')
assert(!observedCsp.match(/script-src[^;]*'unsafe-inline'/), 'Report-only CSP must observe the future removal of inline scripts.')
assert(observedCsp.includes("form-action 'self'"), 'Report-only CSP must observe same-origin-only form submissions.')
assert(!greenProtectHeaders.some((item) => item.key === 'X-Robots-Tag' && item.value.includes('noindex')), 'Green Node Protect must remain indexable.')
assert(greenVaultHeaders.some((item) => item.key === 'X-Robots-Tag' && item.value.includes('noindex')), 'Green Node Vault 13 must remain server-side noindex.')
assert(passportHeaders.some((item) => item.key === 'X-Robots-Tag' && item.value.includes('noindex') && item.value.includes('noimageindex')), 'Nexus passports must remain server-side noindex until dynamic per-profile SEO exists.')

assert(streamsMigration.includes('create table if not exists public.streams'), 'The Gaming stream radar requires a real streams table migration.')
assert(streamsMigration.includes('alter table public.streams enable row level security'), 'The streams table must enable RLS.')
assert(streamsMigration.includes('streams_public_read'), 'The streams table requires an explicit public read policy.')
assert(streamsMigration.includes("private.xethkioz_has_role(array['ADMIN'])"), 'Stream mutations must require the secure private ADMIN helper.')
assert(streamsIndexMigration.includes('streams_created_by_idx') && streamsIndexMigration.includes('on public.streams (created_by)'), 'The streams editorial ownership foreign key requires a covering index.')

assert(visitLog.includes('isAutomatedClient'), 'Visit telemetry must identify automated clients.')
assert(visitLog.includes("ignored: 'automated-client'"), 'Automated clients must be excluded from stored visit analytics.')
assert(visitLog.includes("if (route !== '/'"), 'Retention cleanup must not execute on every route visit.')
assert(visitLogMigration.includes("cleanup_key constant text := 'visit_log_retention_cleanup'"), 'Visit-log retention must persist its cleanup marker across cold starts.')
assert(visitLogMigration.includes("previous_cleanup_at >= now() - interval '6 hours'"), 'Visit-log cleanup must be limited across all runtime instances.')
assert(visitLogMigration.includes('on conflict (key) do update'), 'Visit-log retention must atomically refresh its persisted marker.')

if (issues.length) {
  issues.forEach((issue) => console.error(`FAIL ${issue}`))
  console.error(`Runtime/SEO contract audit failed: ${issues.length} issue(s).`)
  process.exit(1)
}

console.log('PASS runtime/SEO contracts: indexable Green Node Protect, private Vault 13, real 404, article WHATWG query parsing, deep links, redirects, passport privacy, enforced CSP, streams RLS/indexes and telemetry hygiene.')

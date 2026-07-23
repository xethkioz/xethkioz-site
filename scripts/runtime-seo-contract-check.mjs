import fs from 'node:fs'

const issues = []
const read = (path) => fs.readFileSync(path, 'utf8')
const assert = (condition, message) => { if (!condition) issues.push(message) }

const vercel = JSON.parse(read('vercel.json'))
const sitemap = read('api/sitemap.ts')
const seoShells = read('scripts/generate-seo-shells.mjs')
const notFound = read('api/not-found.ts')
const streamsMigration = read('supabase/migrations/20260723153000_streams_public_radar.sql')
const streamsIndexMigration = read('supabase/migrations/20260723154500_streams_created_by_index.sql')
const visitLog = read('supabase/functions/visit-log/index.ts')

const redirectMap = new Map((vercel.redirects ?? []).map((item) => [item.source, item]))
const nexusRedirect = redirectMap.get('/nexus-city')
assert(nexusRedirect?.destination === '/fun#nexus-city' && nexusRedirect?.permanent === true, 'Nexus City must use a permanent HTTP redirect to the embedded Fun district.')
assert(redirectMap.get('/web-creation')?.destination === '/creacion-web', 'Legacy web creation path must redirect at the HTTP layer.')
assert(redirectMap.get('/register')?.destination === '/account', 'Legacy register path must redirect at the HTTP layer.')
assert(redirectMap.get('/admin')?.destination === '/cms', 'Legacy admin path must redirect at the HTTP layer.')

const rewrites = vercel.rewrites ?? []
const rewriteMap = new Map(rewrites.map((item) => [item.source, item.destination]))
assert(!rewrites.some((item) => item.source === '/nexus-city'), 'Redirected Nexus City must not have an indexable SEO-shell rewrite.')
assert(!sitemap.includes("'/nexus-city'"), 'Redirected Nexus City must not remain in the sitemap.')
assert(!seoShells.includes("path: '/nexus-city'"), 'Redirected Nexus City must not generate a standalone SEO shell.')
assert(rewriteMap.get('/green-node') === '/index.html', 'Green Node deep links must remain valid without exposing it in navigation.')
assert(rewriteMap.get('/nexus-city/u/:handle') === '/index.html', 'Public Nexus passport deep links must remain valid.')
assert(rewriteMap.get('/nexus-city/room/:handle') === '/index.html', 'Nexus room deep links must remain valid.')
assert(rewriteMap.get('/nexus-city/vip') === '/private.html', 'VIP Nexus access must use the private noindex shell.')
assert(rewriteMap.get('/((?!api/).*)') === '/api/not-found', 'Unknown direct requests must resolve through the real 404 function.')
assert(notFound.includes('response.status(404).send(html)'), 'The not-found endpoint must return HTTP 404.')
assert(notFound.includes("'X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet, noimageindex'"), 'The not-found response must prevent indexing.')

const headerMap = new Map((vercel.headers ?? []).map((item) => [item.source, item.headers ?? []]))
const globalHeaders = headerMap.get('/(.*)') ?? []
const passportHeaders = headerMap.get('/nexus-city/u/(.*)') ?? []
const enforcedCsp = globalHeaders.find((item) => item.key === 'Content-Security-Policy')?.value ?? ''
const observedCsp = globalHeaders.find((item) => item.key === 'Content-Security-Policy-Report-Only')?.value ?? ''
assert(Boolean(enforcedCsp), 'An enforced Content-Security-Policy header is required in production.')
assert(Boolean(observedCsp), 'A stricter report-only CSP must remain available for the next hardening stage.')
assert(enforcedCsp.includes("default-src 'self'"), 'Enforced CSP must default to same-origin resources.')
assert(enforcedCsp.includes("object-src 'none'"), 'Enforced CSP must block plugin/object content.')
assert(enforcedCsp.includes("frame-ancestors 'none'"), 'Enforced CSP must prevent framing.')
assert(enforcedCsp.includes("script-src-attr 'none'"), 'Enforced CSP must reject inline event-handler attributes.')
assert(enforcedCsp.includes('https://*.googletagmanager.com'), 'Enforced CSP must support the documented GA4 script endpoint.')
assert(enforcedCsp.includes('https://*.google-analytics.com') && enforcedCsp.includes('https://*.analytics.google.com'), 'Enforced CSP must support documented GA4 collection endpoints.')
assert(enforcedCsp.includes('https://*.clarity.ms') && enforcedCsp.includes('https://c.bing.com'), 'Enforced CSP must support documented Microsoft Clarity endpoints.')
assert(!enforcedCsp.includes('script-src https:'), 'Enforced CSP must not allow scripts from every HTTPS origin.')
assert(!observedCsp.match(/script-src[^;]*'unsafe-inline'/), 'Report-only CSP must observe the future removal of inline scripts.')
assert(observedCsp.includes("form-action 'self'"), 'Report-only CSP must observe same-origin-only form submissions.')
assert(passportHeaders.some((item) => item.key === 'X-Robots-Tag' && item.value.includes('noindex') && item.value.includes('noimageindex')), 'Nexus passports must remain server-side noindex until dynamic per-profile SEO exists.')

assert(streamsMigration.includes('create table if not exists public.streams'), 'The Gaming stream radar requires a real streams table migration.')
assert(streamsMigration.includes('alter table public.streams enable row level security'), 'The streams table must enable RLS.')
assert(streamsMigration.includes('streams_public_read'), 'The streams table requires an explicit public read policy.')
assert(streamsMigration.includes("private.xethkioz_has_role(array['ADMIN'])"), 'Stream mutations must require the secure private ADMIN helper.')
assert(streamsIndexMigration.includes('streams_created_by_idx') && streamsIndexMigration.includes('on public.streams (created_by)'), 'The streams editorial ownership foreign key requires a covering index.')

assert(visitLog.includes('isAutomatedClient'), 'Visit telemetry must identify automated clients.')
assert(visitLog.includes("ignored: 'automated-client'"), 'Automated clients must be excluded from stored visit analytics.')
assert(visitLog.includes("CLEANUP_SETTING_KEY = 'visit_log_retention_cleanup'"), 'Visit-log retention must persist its cleanup marker across cold starts.')
assert(visitLog.includes("if (route === '/') await cleanupExpiredVisits(admin)"), 'Retention cleanup must not execute on every route visit.')

if (issues.length) {
  issues.forEach((issue) => console.error(`FAIL ${issue}`))
  console.error(`Runtime/SEO contract audit failed: ${issues.length} issue(s).`)
  process.exit(1)
}

console.log('PASS runtime/SEO contracts: real 404, deep links, redirects, passport privacy, enforced CSP, streams RLS/indexes and telemetry hygiene.')

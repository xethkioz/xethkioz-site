import fs from 'node:fs'

const issues = []
const read = (path) => fs.readFileSync(path, 'utf8')
const assert = (condition, message) => { if (!condition) issues.push(message) }

const vercel = JSON.parse(read('vercel.json'))
const sitemap = read('api/sitemap.ts')
const seoShells = read('scripts/generate-seo-shells.mjs')
const streamsMigration = read('supabase/migrations/20260723153000_streams_public_radar.sql')
const visitLog = read('supabase/functions/visit-log/index.ts')

const redirectMap = new Map((vercel.redirects ?? []).map((item) => [item.source, item]))
const nexusRedirect = redirectMap.get('/nexus-city')
assert(nexusRedirect?.destination === '/fun#nexus-city' && nexusRedirect?.permanent === true, 'Nexus City must use a permanent HTTP redirect to the embedded Fun district.')
assert(redirectMap.get('/web-creation')?.destination === '/creacion-web', 'Legacy web creation path must redirect at the HTTP layer.')
assert(redirectMap.get('/register')?.destination === '/account', 'Legacy register path must redirect at the HTTP layer.')
assert(redirectMap.get('/admin')?.destination === '/cms', 'Legacy admin path must redirect at the HTTP layer.')

const rewrites = vercel.rewrites ?? []
assert(!rewrites.some((item) => item.source === '/nexus-city'), 'Redirected Nexus City must not have an indexable SEO-shell rewrite.')
assert(!sitemap.includes("'/nexus-city'"), 'Redirected Nexus City must not remain in the sitemap.')
assert(!seoShells.includes("path: '/nexus-city'"), 'Redirected Nexus City must not generate a standalone SEO shell.')

const globalHeaders = (vercel.headers ?? []).find((item) => item.source === '/(.*)')?.headers ?? []
assert(globalHeaders.some((item) => item.key === 'Content-Security-Policy-Report-Only'), 'A CSP report-only baseline must be present before enforcement.')

assert(streamsMigration.includes('create table if not exists public.streams'), 'The Gaming stream radar requires a real streams table migration.')
assert(streamsMigration.includes('alter table public.streams enable row level security'), 'The streams table must enable RLS.')
assert(streamsMigration.includes('streams_public_read'), 'The streams table requires an explicit public read policy.')
assert(streamsMigration.includes("private.xethkioz_has_role(array['ADMIN'])"), 'Stream mutations must require the secure private ADMIN helper.')

assert(visitLog.includes('isAutomatedClient'), 'Visit telemetry must identify automated clients.')
assert(visitLog.includes("ignored: 'automated-client'"), 'Automated clients must be excluded from stored visit analytics.')
assert(visitLog.includes("CLEANUP_SETTING_KEY = 'visit_log_retention_cleanup'"), 'Visit-log retention must persist its cleanup marker across cold starts.')
assert(visitLog.includes("if (route === '/') await cleanupExpiredVisits(admin)"), 'Retention cleanup must not execute on every route visit.')

if (issues.length) {
  issues.forEach((issue) => console.error(`FAIL ${issue}`))
  console.error(`Runtime/SEO contract audit failed: ${issues.length} issue(s).`)
  process.exit(1)
}

console.log('PASS runtime/SEO contracts: redirects, canonical sitemap, CSP report-only, streams RLS and telemetry hygiene.')

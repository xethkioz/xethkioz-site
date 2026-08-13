import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8')
const exists = (relative) => fs.existsSync(path.join(root, relative))
const checks = []
const check = (name, ok) => checks.push([name, Boolean(ok)])

const app = read('src/App.tsx')
const home = read('src/pages/Home.tsx')
const homeCss = read('src/pages/HomeReborn.css')
const page = read('src/pages/WebCreation.tsx')
const service = read('src/services/webServices.ts')
const api = read('api/web-quote.ts')
const edgeFunction = read('supabase/functions/submit-web-quote/index.ts')
const supabaseConfig = read('supabase/config.toml')
const adminSession = read('src/cms/hooks/useAdminSession.ts')
const migration = read('supabase/migrations/20260712124949_web_services_foundation.sql')
const securityFollowup = read('supabase/migrations/20260712125209_web_services_security_followup.sql')
const sitemapIsStatic = exists('public/sitemap.xml')
const sitemap = read(sitemapIsStatic ? 'public/sitemap.xml' : 'api/sitemap.ts')
const webCreationHtml = read('creacion-web.html')
const viteConfig = read('vite.config.ts')
const vercelSource = read('vercel.json')
const vercelConfig = JSON.parse(vercelSource)
const vercelRewrites = new Map((vercelConfig.rewrites ?? []).map((item) => [item.source, item.destination]))

check('public web creation route exists', app.includes('path="/creacion-web"') && app.includes("import('./pages/WebCreation')"))
check('home exposes the web creation feature', home.includes('<WebCreationFeature') && home.includes('to="/creacion-web"'))
check('home featured proposal follows the published CMS catalog', home.includes('useFeaturedWebService') && home.includes('offer={featuredWebOffer}') && home.includes('offer.image_url') && service.includes('loadFeaturedWebService') && service.includes(".eq('status', 'published')") && service.includes(".order('featured', { ascending: false })"))
check('Wisp remains hidden on mobile and opens Green Node explicitly', home.includes('className="xk-rb-wisp"') && home.includes('triggerGreenPortal()') && homeCss.includes('@media (min-width:1280px){.xk-rb-wisp{display:block}}') && homeCss.includes('.xk-rb-wisp{') && homeCss.includes('display:none'))
check('home exposes four primary magical portals', home.includes("frame: '/assets/portal-games-clean-v1.webp'") && home.includes("frame: '/assets/portal-science-clean-v1.webp'") && home.includes("world: '/assets/xethkioz-light-shadow-comic-anime.webp'") && exists('public/assets/xethkioz-light-shadow-comic-anime.webp') && home.includes("frame: '/assets/portal-fun-chaos-v2.webp'") && home.includes('className="xk-rb-portals"') && homeCss.includes('grid-template-columns:.78fr 1.02fr 1.02fr .78fr'))
check('home separates secondary destinations from the portal theatre', home.includes('className="xk-rb-destinations"') && home.includes("id: 'nexus'") && home.includes("id: 'web'") && home.includes("id: 'green'") && homeCss.includes('.xk-rb-destination'))
check('home portal interiors preserve focal positioning and mobile snap', home.includes('style={{ objectPosition: portal.position }}') && homeCss.includes('scroll-snap-type:x mandatory') && homeCss.includes('object-fit:cover'))
check('Green Node Protect stays public while Vault 13 remains gated', app.includes("const GreenNodeHub = lazy(() => import('./pages/GreenNodeHub'))") && app.includes('path="/green-node" element={<GreenNodeHub />}') && app.includes('path="/green-node/vault" element={<GreenNodeGate />}') && app.includes('function GreenNodeGate'))
check('catalog is data-driven with fallback', page.includes('loadPublishedWebServices') && page.includes('offers.map'))
check('quote form posts to server API', page.includes("fetch('/api/web-quote'") && page.includes('companyWebsite'))
check('quote API proxies with public configuration only', api.includes('/functions/v1/submit-web-quote') && api.includes('getSupabasePublicKey') && !api.includes('SUPABASE_SERVICE_ROLE_KEY'))
check('quote Edge Function keeps secret keys server-side', edgeFunction.includes("Deno.env.get('SUPABASE_SECRET_KEYS')") && edgeFunction.includes("Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')") && !page.includes('SUPABASE_SERVICE_ROLE_KEY'))
check('quote API validates consent and rate limits', api.includes('consent') && api.includes('checkRateLimit') && api.includes('RATE_LIMITED'))
check('public Edge Function implements custom abuse controls', supabaseConfig.includes('verify_jwt = false') && edgeFunction.includes('isAllowedOrigin') && edgeFunction.includes('recentRequestCount'))
check('quote table has RLS and no anon grants', migration.includes('alter table public.web_quote_requests enable row level security') && migration.includes('revoke all on public.web_quote_requests from anon, authenticated'))
check('catalog publishes only approved offers', migration.includes('web_service_offers_public_read') && migration.includes("using (status = 'published')"))
check('storage upload is admin-only and blocks SVG', migration.includes('web_service_media_admin_insert') && !migration.includes("'image/svg+xml'"))
check('admin function ends outside exposed schemas', securityFollowup.includes('private.xethkioz_web_is_admin') && securityFollowup.includes('drop function if exists public.xethkioz_web_is_admin'))
check('catalog policies avoid duplicate authenticated reads', securityFollowup.includes('web_service_offers_authenticated_read') && securityFollowup.includes('web_service_offers_admin_insert'))
check('web-service foreign keys are indexed', securityFollowup.includes('web_quote_requests_service_id_idx') && securityFollowup.includes('web_service_offers_created_by_idx'))
check('admin authorization ignores user_metadata', adminSession.includes('app_metadata?.role') && !adminSession.includes('user_metadata?.role'))
check('catalog assets exist', ['landing-premium.svg', 'tienda-digital.svg', 'sitio-profesional.svg'].every((file) => exists(`public/web-services/${file}`)))
check('public route is included in sitemap', sitemap.includes('/creacion-web') && (sitemapIsStatic || vercelRewrites.get('/sitemap.xml') === '/api/sitemap'))
check('web creation has crawlable static metadata', webCreationHtml.includes('<title>Creación Web') && webCreationHtml.includes('rel="canonical" href="https://www.xethkioz.com.ar/creacion-web"') && webCreationHtml.includes('"@type": "Service"'))
check('web creation uses a raster social preview', exists('public/web-services/creacion-web-og.png') && fs.statSync(path.join(root, 'public/web-services/creacion-web-og.png')).size > 10000 && webCreationHtml.includes('/web-services/creacion-web-og.png') && webCreationHtml.includes('content="1200"') && webCreationHtml.includes('content="630"'))
check('quote flow is mobile-friendly and actionable', page.includes('type QuoteStep = 1 | 2') && page.includes('continueQuote') && page.includes('required={form.contactPreference') && page.includes('messages[code]'))
check('commercial objections are covered accessibly', page.includes('t.faqs.map') && page.includes('<details') && page.includes('<summary'))
check('web creation is emitted as a dedicated HTML entry', viteConfig.includes("webCreation: resolve(process.cwd(), 'creacion-web.html')"))
check('production routes web creation to its dedicated HTML', vercelRewrites.get('/creacion-web') === '/creacion-web.html')

let failed = 0
for (const [name, ok] of checks) {
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`)
  if (!ok) failed += 1
}

if (failed) {
  console.error(`Web services audit failed: ${failed} checks failed.`)
  process.exit(1)
}

console.log('XETHKIOZ web services audit PASS')

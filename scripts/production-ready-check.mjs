import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const root = process.cwd()
const checks = []
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8')
const exists = (relative) => fs.existsSync(path.join(root, relative))
function check(name, ok, detail = '') { checks.push({ name, ok: Boolean(ok), detail }) }
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'

function runNodeAudit(name, scriptPath) {
  const result = spawnSync(process.execPath, [scriptPath], {
    cwd: root,
    encoding: 'utf8',
    stdio: 'pipe',
    shell: false,
    windowsHide: true,
  })
  const ok = result.status === 0
  const stdout = result.stdout ?? ''
  const stderr = result.stderr ?? ''
  const errorMessage = result.error ? `\n${result.error.message}` : ''
  check(name, ok, ok ? 'PASS' : `${stdout}\n${stderr}${errorMessage}`.slice(0, 1600))
  if (!ok) process.stderr.write(`${name} failed\n${stdout}\n${stderr}${errorMessage}\n`)
}

const pkg = JSON.parse(read('package.json'))
const sql = read('database/migrations/20260628_alpha36_auth_nexus_profiles_rls.sql')
const supabaseSql = read('supabase/migrations/20260628_alpha36_auth_nexus_profiles_rls.sql')
const authService = read('src/services/auth/authNexusService.ts')
const cmsSupabaseClient = read('src/services/cms/supabaseClient.ts')
const authUi = read('src/components/auth/XethkiozNexusAuth.tsx')
const runtimeBridge = read('src/engines/world/sandbox/RuntimeBridge.ts')
const perf = read('src/engines/world/sandbox/PerformanceMonitor.ts')
const shaderManager = read('src/engines/world/sandbox/ShaderManager.ts')
const appShell = read('src/App.tsx')
const header = read('src/components/Header.tsx')
const footer = read('src/components/Footer.tsx')
const mainEntry = read('src/main.tsx')
const home = read('src/pages/Home.tsx')
const homeCss = read('src/pages/HomeReborn.css')
const indexHtml = read('index.html')
const webManifest = read('public/manifest.webmanifest')
const publicNews = read('src/pages/News.tsx')
const greenNode = read('src/pages/GreenNode.tsx')
const greenDossiers = read('src/data/greenNodeDossiers.ts')
const gamingGuides = read('src/pages/GamingGuides.tsx')
const scienceLab = read('src/pages/ScienceLab.tsx')
const profileHub = read('src/pages/ProfileHub.tsx')
const gamingHub = read('src/pages/GamingHub.tsx')
const funPortal = read('src/pages/FunPortal.tsx')
const mascotasPortal = read('src/pages/MascotasPortal.tsx')
const funCss = read('src/pages/FunNexusFusion.css')
const newsletter = read('src/components/Newsletter.tsx')
const fusionShell = read('src/components/fusion/FusionShell.tsx')
const globalWisp = read('src/components/fusion/FusionGlobalWisp.tsx')
const globalWispCss = read('src/components/fusion/FusionGlobalWisp.css')
const realtimeCommunity = read('src/lib/realtimeCommunity.ts')
const newsPolicyHardening = read('supabase/migrations/20260715101500_news_policy_hardening.sql')
const newsAuditPolicyHardening = read('supabase/migrations/20260715103000_news_audit_policy_hardening.sql')
const newsMediaUploads = read('supabase/migrations/20260715120000_news_media_uploads.sql')
const newsletterPrivacy = read('supabase/migrations/20260716110000_newsletter_privacy_hardening.sql')
const cmsNewsEditor = read('src/cms/routes/CmsNewsEditor.tsx')
const redesignCss = read('src/xethkioz-redesign.css')
const universeTransit = read('src/components/universe/UniverseTransitRail.tsx')
const nexusDistrict = read('src/components/NexusDistrict.tsx')
const nexusCity = read('src/pages/NexusCity.tsx')
const webCreation = read('src/pages/WebCreation.tsx')

check('11.0 release version stamped', pkg.version === '11.0.0')
check('shared public footer exposes the centralized release version', footer.includes("import { SITE_VERSION, SOCIAL_LINKS }") && footer.includes('XETHKIOZ Web {SITE_VERSION}'))
check(
  'installable web manifest is linked and versioned',
  indexHtml.includes('rel="manifest" href="/manifest.webmanifest"')
    && webManifest.includes('XETHKIOZ Web 11.0')
    && webManifest.includes('"display": "standalone"'),
)
check('production audit script registered', pkg.scripts['audit:production-ready'] === 'node scripts/production-ready-check.mjs')
check('database and supabase auth migrations match', sql === supabaseSql)
check('profiles RLS enabled', sql.includes('alter table public.profiles enable row level security'))
check('public profile projection exists', sql.includes('create or replace view public.public_profiles'))
check('privilege update guard exists', sql.includes('xethkioz_guard_profile_privilege_update'))
check('no unrestricted public profiles read policy', !/create\s+policy\s+"profiles_public_read"/i.test(sql))
check('self insert restricted to BASIC/GUEST', sql.includes('profiles_self_insert_basic_only') && sql.includes("subscription_tier = 'BASIC'") && sql.includes("role = 'GUEST'"))
check('safe auth event source guard', read('src/services/auth/authSchema.ts').includes("source: 'supabase-auth-nexus'") && read('src/services/auth/authSchema.ts').includes('isAuthorizedSessionPayload'))
check('auth service fetches profiles before event emit', authService.includes("from('profiles')") && authService.includes('USER_SESSION_AUTHORIZED'))
check('auth service has no unknown cast', !authService.includes('as unknown as'))
check(
  'auth session has one canonical client and reference-counted listeners',
  cmsSupabaseClient.includes("from '../supabaseClient'")
    && !cmsSupabaseClient.includes('createClient')
    && authService.includes('authListenerConsumers')
    && authService.includes('hydrationPromise'),
)
check('auth UI has loading and safe error mapping', /isLoading|loading/i.test(authUi) && authUi.includes('mapAuthErrorForUser'))
check('runtime bridge validates auth payload', runtimeBridge.includes('isAuthorizedSessionPayload') && runtimeBridge.includes('Ignored malformed USER_SESSION_AUTHORIZED'))
check('runtime bridge validates portal payload', runtimeBridge.includes('Ignored malformed PORTAL_STATE_CHANGED'))
check('shader manager supports networkLatency uniform', read('src/engines/world/sandbox/shaderContracts.ts').includes('networkLatency') && shaderManager.includes('setRuntimeUniformProfile'))
check('performance monitor has latency timeout', perf.includes('withTimeout') && perf.includes('Latency probe timeout'))
check('performance monitor throttles critical reports', perf.includes('lastCriticalDropReportAt'))
check(
  'Nexus chat mounts once through the lazy App shell',
  appShell.includes("const NexusChatWidget = lazy(() => import('./components/nexus/NexusChatWidget'))")
    && !mainEntry.includes("import NexusChatWidget from './components/nexus/NexusChatWidget'")
    && !mainEntry.includes('mountNexusChat'),
)
check(
  'Home ambient video honors motion and data preferences',
  home.includes("matchMedia('(prefers-reduced-motion: reduce)')")
    && home.includes('connection?.saveData')
    && home.includes('videoEnabled &&'),
)
check(
  'Home uses the isolated infected Wisp without mobile duplication',
  home.includes('className="xk-rb-wisp"')
    && home.includes('wisp-digital-specter-v1.webp')
    && home.includes('triggerGreenPortal()')
    && homeCss.includes('.xk-rb-wisp{')
    && homeCss.includes('display:none')
    && homeCss.includes('@media (min-width:1280px){.xk-rb-wisp{display:block}}')
    && !home.includes('/assets/green-wisp.png'),
)
check(
  'Home ambient video has a static poster fallback',
  exists('public/assets/bg-dragon-poster.webp')
    && home.includes('/assets/bg-dragon-poster.webp'),
)
check(
  'Home exposes accessible navigation and reduced-motion scrolling',
  home.includes('<main className="xk-rb-home">')
    && home.includes('aria-label={lang ===')
    && home.includes('to="/news"')
    && home.includes("behavior: reduceMotion ? 'auto' : 'smooth'")
    && home.includes('aria-labelledby="home-title"'),
)
check(
  'Home exposes four primary magical portals with real interior depth',
  home.includes("frame: '/assets/portal-games-clean-v1.webp'")
    && home.includes("frame: '/assets/portal-science-clean-v1.webp'")
    && home.includes("world: '/assets/portal-comicon-duality-v11.webp'")
    && exists('public/assets/portal-comicon-duality-v11.webp')
    && home.includes("world: '/assets/portal-mascotas-nature-v11.webp'")
    && exists('public/assets/portal-mascotas-nature-v11.webp')
    && home.includes("frame: '/assets/portal-fun-chaos-v2.webp'")
    && home.includes('className="xk-rb-window"')
    && home.includes('className="xk-rb-frame"')
    && homeCss.includes('.xk-rb-portals{')
    && homeCss.includes('grid-template-columns:.78fr 1.02fr 1.02fr .78fr')
    && homeCss.includes('scroll-snap-type:x mandatory'),
)
check(
  'Home keeps Nexus, Web Creation and Green Node secondary to the main portal scene',
  home.includes('className="xk-rb-destinations"')
    && home.includes("id: 'nexus'")
    && home.includes("id: 'web'")
    && home.includes("id: 'green'")
    && home.includes('<NexusDistrict tone="home" compact />')
    && home.includes('offer={featuredWebOffer}'),
)
check(
  'News supports searchable, shareable and progressive discovery',
  publicNews.includes('useSearchParams')
    && publicNews.includes('filteredArticles')
    && publicNews.includes('activeTopics')
    && publicNews.includes('setVisibleCount')
    && publicNews.includes("next.set('category', category)")
    && publicNews.includes("next.set('q', cleanValue)")
    && publicNews.includes('snap-mandatory'),
)
check(
  'Navigation is keyboard and mobile accessible',
  appShell.includes('xk-skip-link')
    && appShell.includes('RouteAccessibility')
    && appShell.includes('tabIndex={-1}')
    && header.includes('xk-mobile-dock')
    && header.includes('<NavLink')
    && redesignCss.includes('.xk-mobile-dock a:focus-visible'),
)
check(
  'Public pages use one compact non-overlapping header',
  header.includes('pointer-events-none sticky top-0')
    && header.includes('grid-cols-[minmax(0,1fr)_auto]')
    && !fusionShell.includes('<header')
    && !fusionShell.includes("from 'react-router-dom'"),
)
check(
  'News RLS is role-scoped and avoids repeated auth evaluation',
  newsPolicyHardening.includes('to anon')
    && newsPolicyHardening.includes('to authenticated')
    && newsPolicyHardening.includes('(select auth.uid())')
    && newsPolicyHardening.includes('revoke execute')
    && newsAuditPolicyHardening.includes('(select public.xethkioz_is_moderator_or_admin())'),
)
check(
  'News CMS supports validated direct cover uploads',
  newsMediaUploads.includes("'news-media'")
    && newsMediaUploads.includes('file_size_limit')
    && newsMediaUploads.includes('(storage.foldername(name))[1]')
    && cmsNewsEditor.includes('supabase.storage.from(NEWS_MEDIA_BUCKET).upload')
    && cmsNewsEditor.includes('MAX_COVER_BYTES')
    && cmsNewsEditor.includes('acceptedCoverTypes'),
)
check(
  'News CMS exposes live editorial and SEO quality previews',
  cmsNewsEditor.includes('QUALITY_GATE')
    && cmsNewsEditor.includes('editorialChecks')
    && cmsNewsEditor.includes('Canonical preview')
    && cmsNewsEditor.includes('1.91/1')
    && cmsNewsEditor.includes('news-title-guidance')
    && cmsNewsEditor.includes('news-summary-guidance'),
)
check(
  'Green Node opens real learning paths and published technical news',
  greenNode.includes('active.steps.map')
    && greenNode.includes('fetchPublishedNews')
    && greenNode.includes('xk-occult-copy')
    && greenNode.includes('green-node-occult-malware-v1.webp')
    && greenNode.includes('PROTOCOLO DE VERDAD')
    && greenNode.includes('/news?category='),
)
check(
  'Green Node terminal and Deep Mode stay simulated, explicit and evidence-safe',
  greenNode.includes('runTerminalCommand')
    && greenNode.includes('SIMULACIÓN SEGURA')
    && greenNode.includes('protocolo_verdad')
    && greenNode.includes('aria-pressed={deepMode}')
    && !greenNode.includes('eval(')
    && !greenNode.includes('<audio'),
)
check(
  'Green Node provides sourced tiered dossiers without presenting theories as facts',
  greenNode.includes('xk-dossier-vault')
    && greenNode.includes('interceptar_anon')
    && greenNode.includes('desclasificar')
    && greenDossiers.includes("evidence: 'documented'")
    && greenDossiers.includes("evidence: 'disputed'")
    && greenDossiers.includes('FBI / U.S. Department of Justice')
    && greenDossiers.includes('U.S. Senate Select Committee on Intelligence')
    && greenDossiers.includes('U.S. National Archives'),
)
check(
  'Gaming guides support discovery, shareable deep links and persistent checklists',
  gamingGuides.includes('xk-guide-search')
    && gamingGuides.includes("next.set('module', moduleId)")
    && gamingGuides.includes('xethkioz.guide-progress.v1')
    && gamingGuides.includes('navigator.clipboard.writeText')
    && gamingGuides.includes('aria-pressed={completedSteps.includes(index)}'),
)
check(
  'Profile provides persistent progression and daily activity',
  profileHub.includes('MISIÓN DIARIA')
    && profileHub.includes('ACTIVIDAD RECIENTE')
    && profileHub.includes('claimDailyMission')
    && realtimeCommunity.includes('WISP_EVENTS_KEY'),
)
check(
  'Gaming and Huellas expose real content without decorative duplication',
  gamingHub.includes("fetchPublishedNews('gaming')")
    && gamingHub.includes('gaming-anime-nexus-v1.webp')
    && gamingHub.includes('xk-gaming-start')
    && gamingHub.includes("activeSection === 'news'")
    && gamingHub.includes('xk-feature-rank')
    && gamingHub.includes('<SafeImage')
    && !gamingHub.includes('xk-gaming-ticker')
    && mascotasPortal.includes('PostGrid')
    && mascotasPortal.includes('fauna.map')
    && mascotasPortal.includes('/mascotas/publicar')
    && mascotasPortal.includes('Publicaciones recientes'),
)
check(
  'Gaming live and Huellas contact flows stay honest about their state',
  gamingHub.includes("from('streams')")
    && gamingHub.includes('SEÑAL MARCADA EN VIVO EN EL CMS')
    && gamingHub.includes('Prepará tu perfil para encontrar grupo')
    && gamingHub.includes('PARTY_BOARD')
    && !gamingHub.includes('Especificaciones en verificación')
    && !gamingHub.includes('fallbackStreams')
    && mascotasPortal.includes("window.localStorage.setItem('huellas-puan.posts'")
    && mascotasPortal.includes('En la siguiente etapa se conectará con la base comunitaria.')
    && mascotasPortal.includes('wa.me/54'),
)
check(
  'Science exposes the real stack, a local assistant and a private newsletter',
  scienceLab.includes('React + TypeScript')
    && scienceLab.includes('MODO LOCAL')
    && scienceLab.includes('no se envían datos a una API externa')
    && scienceLab.includes('<Newsletter')
    && newsletter.includes('normalizedEmail')
    && newsletter.includes('xk-newsletter-consent')
    && newsletterPrivacy.includes('newsletter_admin_only_select')
    && newsletterPrivacy.includes('profiles.id = (select auth.uid())')
    && newsletterPrivacy.includes("lower(profiles.role::text) = 'admin'")
    && !newsletterPrivacy.includes('USING (true)'),
)
check(
  'Mobile portals preserve active state without covering navigation',
  appShell.includes('xk-has-mobile-dock')
    && appShell.includes('clearMobileDock={hasPublicNavigation}')
    && gamingHub.includes('xk-gaming-section-nav')
    && gamingHub.includes('aria-live="polite"')
    && mascotasPortal.includes('overflow-x-auto')
    && mascotasPortal.includes('whitespace-nowrap')
    && redesignCss.includes('scrollbar-width:none'),
)
check(
  'Public worlds use focused responsive navigation without forcing duplicate transit',
  nexusDistrict.includes('localizePath(item.to)')
    && !nexusDistrict.includes('UniverseTransitRail')
    && gamingHub.includes('xk-gaming-section-nav')
    && !gamingHub.includes('<NexusDistrict tone="gaming"')
    && funPortal.includes('return <MascotasRedirect />')
    && funPortal.includes('if (isNexusAccess)')
    && scienceLab.includes('<NexusDistrict tone="science"')
    && scienceLab.includes('data-science-primary-content')
    && greenNode.includes('<NexusDistrict tone="green"')
    && nexusCity.includes('<UniverseTransitRail />')
    && webCreation.includes('<UniverseTransitRail />')
    && universeTransit.includes('aria-current'),
)
check(
  'Wisp exposes a responsive Hack Zone identity and mobile Green Node entry',
  appShell.includes('FusionGlobalWisp')
    && appShell.includes('!isCmsRoute')
    && globalWisp.includes('xk-wisp-rune-ring')
    && globalWisp.includes('ZONA HACK')
    && globalWisp.includes("registerEvent('green-unlock', 'wisp-hack-zone-open'")
    && globalWisp.includes("navigate('/green-node')")
    && globalWisp.includes("location.pathname === '/' ? ' is-home-entry'")
    && globalWispCss.includes('@keyframes xk-wisp-glitch')
    && globalWispCss.includes('@media (max-width: 767px)')
    && globalWispCss.includes('@media (min-width: 1280px)')
    && globalWispCss.includes('@media (prefers-reduced-motion: reduce)'),
)

const strictPackageAudit = process.env.XETHKIOZ_STRICT_PACKAGE_AUDIT === '1'
if (strictPackageAudit) {
  check('no env files packaged', !exists('.env') && !exists('.env.local') && !exists('.env.production'))
} else {
  check('env files protected by .gitignore', read('.gitignore').includes('.env'))
}
if (strictPackageAudit) {
  check('node_modules absent before packaging', !exists('node_modules'))
  check('dist absent before packaging', !exists('dist'))
} else {
  check('node_modules package exclusion is covered by .gitignore', read('.gitignore').includes('node_modules/'))
  check('dist package exclusion is covered by .gitignore', read('.gitignore').includes('dist/'))
}

runNodeAudit('security hardening audit', 'scripts/security-hardening-check.mjs')
runNodeAudit('auth nexus audit', 'scripts/auth-nexus-check.mjs')
runNodeAudit('latency glitch audit', 'scripts/latency-glitch-bridge-check.mjs')
runNodeAudit('supabase hydration audit', 'scripts/supabase-hydration-check.mjs')
runNodeAudit('eventbus telemetry audit', 'scripts/eventbus-telemetry-check.mjs')
runNodeAudit('shader pipeline audit', 'scripts/shader-pipeline-sandbox-check.mjs')
runNodeAudit('visual runtime audit', 'scripts/visual-runtime-sandbox-check.mjs')
runNodeAudit('world runtime integration audit', 'scripts/runtime-integration-check.mjs')
runNodeAudit('Nexus City social safety audit', 'scripts/nexus-city-check.mjs')
runNodeAudit('buttons, links, images and translations audit', 'scripts/ui-contract-check.mjs')
runNodeAudit('news factory audit', 'scripts/news-factory-check.mjs')
runNodeAudit('web services audit', 'scripts/web-services-check.mjs')
runNodeAudit('Green, Games and Guides depth audit', 'scripts/green-games-guides-check.mjs')
runNodeAudit('content design audit', 'scripts/content-design-check.mjs')

let failed = 0
for (const item of checks) {
  console.log(`${item.ok ? 'PASS' : 'FAIL'} ${item.name}`)
  if (!item.ok) {
    failed += 1
    if (item.detail) console.log(item.detail)
  }
}

if (failed) {
  console.error(`Production-ready audit failed: ${failed} checks failed.`)
  process.exit(1)
}

console.log('XETHKIOZ 11.0 production-ready audit PASS')

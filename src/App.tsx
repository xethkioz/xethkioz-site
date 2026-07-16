import { lazy, Suspense, useEffect, useState } from 'react'
import { Navigate, Routes, Route, useLocation } from 'react-router-dom'
import { Analytics as VercelAnalytics } from '@vercel/analytics/react'
import { LangProvider } from './lib/LangContext'
import { HudProvider } from './lib/HudContext'
import { GREEN_NODE_UNLOCK_KEY, WispProvider } from './providers/WispProvider'
import { ProfileProgressProvider } from './lib/ProfileProgressContext'
import ScrollToTop from './components/ScrollToTop'
import Analytics from './components/Analytics'
import AppErrorBoundary from './components/AppErrorBoundary'
import { WorldRuntimeProvider } from './engines/world/runtime'
import { WorldStateProvider } from './engines/world/state'
import { WorldOrchestratorProvider } from './engines/world/orchestrator'
import { WorldThemeProvider } from './engines/world/theme'
import { LightingEngineProvider } from './engines/world/lighting'
import { AdminGuard } from './cms/guards'
import { addWispXp } from './lib/realtimeCommunity'

const Header = lazy(() => import('./components/Header'))
const Footer = lazy(() => import('./components/Footer'))
const FusionGlobalWisp = lazy(() => import('./components/fusion/FusionGlobalWisp'))
const NexusChatWidget = lazy(() => import('./components/nexus/NexusChatWidget'))

const Home = lazy(() => import('./pages/Home'))
const GamingHub = lazy(() => import('./pages/GamingHub'))
const ScienceLab = lazy(() => import('./pages/ScienceLab'))
const FunPortal = lazy(() => import('./pages/FunPortal'))
const WebCreation = lazy(() => import('./pages/WebCreation'))
const GreenNode = lazy(() => import('./pages/GreenNode'))
const ProfileHub = lazy(() => import('./pages/ProfileHub'))
const News = lazy(() => import('./pages/News'))
const NewsArticle = lazy(() => import('./pages/NewsArticle'))
const Community = lazy(() => import('./pages/Community'))
const CmsStudio = lazy(() => import('./pages/CmsStudio'))
const CmsLayout = lazy(() => import('./cms/layout/CmsLayout'))
const CmsDashboard = lazy(() => import('./cms/routes/CmsDashboard'))
const CmsGenerate = lazy(() => import('./cms/routes/CmsGenerate'))
const CmsNewsEditor = lazy(() => import('./cms/routes/CmsNewsEditor'))
const CmsNewsList = lazy(() => import('./cms/routes/CmsNewsList'))
const CmsReviewQueue = lazy(() => import('./cms/routes/CmsReviewQueue'))
const CmsUsersPanel = lazy(() => import('./cms/routes/CmsUsersPanel'))
const CmsAdsManager = lazy(() => import('./cms/routes/CmsAdsManager'))
const CmsWebServicesManager = lazy(() => import('./cms/routes/CmsWebServicesManager'))
const CmsWebQuotes = lazy(() => import('./cms/routes/CmsWebQuotes'))
const AccountAccess = lazy(() => import('./pages/AccountAccessStable'))
const ConfirmEmail = lazy(() => import('./pages/ConfirmEmail'))
const NotFound = lazy(() => import('./pages/NotFound'))

function GreenNodeGate() {
  const unlocked = typeof window !== 'undefined' && Boolean(window.sessionStorage.getItem(GREEN_NODE_UNLOCK_KEY))
  return unlocked ? <GreenNode /> : <Navigate to="/" replace />
}

function RouteFallback() {
  return (
    <section className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-6 text-center">
      <div className="rounded-3xl border border-purple-500/40 bg-[#0A0A0F] px-8 py-6 shadow-[0_0_20px_rgba(139,92,246,.22)]">
        <p className="font-mono text-xs uppercase tracking-widest text-[#FF6B1A]">XETHKIOZ</p>
        <h1 className="mt-3 text-2xl font-black text-white md:text-3xl">Cargando sección</h1>
      </div>
    </section>
  )
}

const routeNames: Record<string, string> = {
  '/': 'Inicio',
  '/gaming': 'Juegos',
  '/science': 'Ciencia y tecnología',
  '/fun': 'Memes',
  '/creacion-web': 'Creación web',
  '/green-node': 'Green Node',
  '/news': 'Noticias',
  '/community': 'Comunidad',
  '/profile': 'Perfil',
  '/account': 'Cuenta',
  '/login': 'Iniciar sesión',
  '/cms': 'Panel editorial',
}

const activityTrackedPortals = new Set(['/gaming', '/science', '/fun', '/creacion-web', '/green-node'])

function RouteAccessibility({ pathname }: { pathname: string }) {
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    const routeName = pathname.startsWith('/news/')
      ? 'Artículo de noticias'
      : pathname.startsWith('/cms/')
        ? 'Panel editorial'
        : routeNames[pathname] ?? 'Sección XETHKIOZ'

    setAnnouncement(`Página cargada: ${routeName}`)
    const frame = window.requestAnimationFrame(() => {
      document.getElementById('main-content')?.focus({ preventScroll: true })
    })
    return () => window.cancelAnimationFrame(frame)
  }, [pathname])

  return <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</p>
}

function AppShell() {
  const location = useLocation()
  const isCmsRoute = location.pathname === '/cms' || location.pathname.startsWith('/cms/')
  const isHomeRoute = location.pathname === '/'
  const hasPublicNavigation = !isCmsRoute && !isHomeRoute

  useEffect(() => {
    if (!activityTrackedPortals.has(location.pathname)) return
    const day = new Date().toISOString().slice(0, 10)
    const storageKey = `xethkioz.portal-visit.${day}.${location.pathname}`
    try {
      if (window.localStorage.getItem(storageKey)) return
      window.localStorage.setItem(storageKey, 'recorded')
      addWispXp(5, 'portal', location.pathname)
    } catch {
      // Activity tracking is optional when browser storage is unavailable.
    }
  }, [location.pathname])

  return (
    <div className={hasPublicNavigation ? 'xk-app-shell xk-has-mobile-dock' : 'xk-app-shell'}>
      <a href="#main-content" className="xk-skip-link">Saltar al contenido principal</a>
      <Analytics />
      <VercelAnalytics />
      <ScrollToTop />
      <RouteAccessibility pathname={location.pathname} />
      {hasPublicNavigation && (
        <AppErrorBoundary label="Global Controls" compact>
          <Suspense fallback={null}>
            <Header />
            <FusionGlobalWisp />
          </Suspense>
        </AppErrorBoundary>
      )}

      <div id="main-content" tabIndex={-1} className="min-h-screen bg-[#0A0A0F] outline-none">
        <AppErrorBoundary label="Routes">
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/gaming" element={<GamingHub />} />
              <Route path="/science" element={<ScienceLab />} />
              <Route path="/fun" element={<FunPortal />} />
              <Route path="/creacion-web" element={<WebCreation />} />
              <Route path="/web-creation" element={<Navigate to="/creacion-web" replace />} />
              <Route path="/green-node" element={<GreenNodeGate />} />
              <Route path="/news" element={<News />} />
              <Route path="/news/:slug" element={<NewsArticle />} />
              <Route path="/community" element={<Community />} />
              <Route path="/profile" element={<ProfileHub />} />
              <Route path="/login" element={<AccountAccess />} />
              <Route path="/account" element={<AccountAccess />} />
              <Route path="/confirm-email" element={<ConfirmEmail />} />
              <Route path="/register" element={<Navigate to="/account" replace />} />
              <Route
                path="/cms"
                element={
                  <AdminGuard>
                    <CmsLayout />
                  </AdminGuard>
                }
              >
                <Route index element={<CmsDashboard />} />
                <Route path="generate" element={<CmsGenerate />} />
                <Route path="news" element={<CmsNewsList />} />
                <Route path="news/new" element={<CmsNewsEditor />} />
                <Route path="news/:id" element={<CmsNewsEditor />} />
                <Route path="review" element={<CmsReviewQueue />} />
                <Route path="users" element={<CmsUsersPanel />} />
                <Route path="ads" element={<CmsAdsManager />} />
                <Route path="web-services" element={<CmsWebServicesManager />} />
                <Route path="web-quotes" element={<CmsWebQuotes />} />
              </Route>
              <Route path="/cms-legacy" element={<CmsStudio />} />
              <Route path="/admin" element={<Navigate to="/cms" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AppErrorBoundary>
      </div>

      {hasPublicNavigation && (
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      )}
      {!isCmsRoute && (
        <Suspense fallback={null}>
          <NexusChatWidget clearMobileDock={hasPublicNavigation} />
        </Suspense>
      )}
    </div>
  )
}

export default function App() {
  return (
    <WorldRuntimeProvider>
      <WorldStateProvider>
        <WorldOrchestratorProvider>
          <WorldThemeProvider>
            <LightingEngineProvider>
              <LangProvider>
                <HudProvider>
                  <WispProvider>
                    <ProfileProgressProvider>
                      <AppShell />
                    </ProfileProgressProvider>
                  </WispProvider>
                </HudProvider>
              </LangProvider>
            </LightingEngineProvider>
          </WorldThemeProvider>
        </WorldOrchestratorProvider>
      </WorldStateProvider>
    </WorldRuntimeProvider>
  )
}

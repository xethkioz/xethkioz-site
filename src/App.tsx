import { lazy, Suspense } from 'react'
import { Navigate, Routes, Route, useLocation } from 'react-router-dom'
import { Analytics as VercelAnalytics } from '@vercel/analytics/react'
import { LangProvider } from './lib/LangContext'
import { HudProvider } from './lib/HudContext'
import { GREEN_NODE_UNLOCK_KEY, WispProvider } from './providers/WispProvider'
import { ProfileProgressProvider } from './lib/ProfileProgressContext'
import Header from './components/Header'
import Footer from './components/Footer'
import FusionGlobalWisp from './components/fusion/FusionGlobalWisp'
import NexusChatWidget from './components/nexus/NexusChatWidget'
import ScrollToTop from './components/ScrollToTop'
import Analytics from './components/Analytics'
import AppErrorBoundary from './components/AppErrorBoundary'
import { WorldRuntimeProvider } from './engines/world/runtime'
import { WorldStateProvider } from './engines/world/state'
import { WorldOrchestratorProvider } from './engines/world/orchestrator'
import { WorldThemeProvider } from './engines/world/theme'
import { LightingEngineProvider } from './engines/world/lighting'
import { AdminGuard } from './cms/guards'

const Home = lazy(() => import('./pages/Home'))
const GamingHub = lazy(() => import('./pages/GamingHub'))
const ScienceLab = lazy(() => import('./pages/ScienceLab'))
const FunPortal = lazy(() => import('./pages/FunPortal'))
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
const CmsAdsManager = lazy(() => import('./cms/routes/CmsAdsManager'))
const AccountAccess = lazy(() => import('./pages/AccountAccess'))
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

function AppShell() {
  const location = useLocation()
  const isCmsRoute = location.pathname === '/cms' || location.pathname.startsWith('/cms/')
  const isHomeRoute = location.pathname === '/'

  return (
    <>
      <Analytics />
      <VercelAnalytics />
      <ScrollToTop />
      {!isCmsRoute && !isHomeRoute && (
        <AppErrorBoundary label="Global Controls" compact>
          <Header />
          <FusionGlobalWisp />
        </AppErrorBoundary>
      )}

      <main id="main-content" className="min-h-screen bg-[#0A0A0F]">
        <AppErrorBoundary label="Routes">
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/gaming" element={<GamingHub />} />
              <Route path="/science" element={<ScienceLab />} />
              <Route path="/fun" element={<FunPortal />} />
              <Route path="/green-node" element={<GreenNodeGate />} />
              <Route path="/news" element={<News />} />
              <Route path="/news/:slug" element={<NewsArticle />} />
              <Route path="/community" element={<Community />} />
              <Route path="/profile" element={<ProfileHub />} />
              <Route path="/login" element={<AccountAccess />} />
              <Route path="/account" element={<AccountAccess />} />
              <Route path="/register" element={<Navigate to="/login" replace />} />
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
                <Route path="ads" element={<CmsAdsManager />} />
              </Route>
              <Route path="/cms-legacy" element={<CmsStudio />} />
              <Route path="/admin" element={<Navigate to="/cms" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AppErrorBoundary>
      </main>

      {!isCmsRoute && !isHomeRoute && <Footer />}
      {!isCmsRoute && <NexusChatWidget />}
    </>
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

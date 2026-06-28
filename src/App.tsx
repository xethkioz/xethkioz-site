import { lazy, Suspense } from 'react'
import { Navigate, Routes, Route } from 'react-router-dom'
import { LangProvider } from './lib/LangContext'
import { HudProvider } from './lib/HudContext'
import { WispProvider } from './providers/WispProvider'
import { ProfileProgressProvider } from './lib/ProfileProgressContext'
import Header from './components/Header'
import FusionGlobalStatus from './components/fusion/FusionGlobalStatus'
import FusionGlobalWisp from './components/fusion/FusionGlobalWisp'
import ScrollToTop from './components/ScrollToTop'
import Analytics from './components/Analytics'
import AppErrorBoundary from './components/AppErrorBoundary'
import { WorldRuntimeIntegration, WorldRuntimeProvider } from './engines/world/runtime'
import { WorldStateProvider } from './engines/world/state'
import { WorldOrchestratorProvider } from './engines/world/orchestrator'
import { WorldThemeProvider } from './engines/world/theme'
import { LightingEngineProvider } from './engines/world/lighting'

const Home = lazy(() => import('./pages/Home'))
const GamingHub = lazy(() => import('./pages/GamingHub'))
const ScienceLab = lazy(() => import('./pages/ScienceLab'))
const FunPortal = lazy(() => import('./pages/FunPortal'))
const GreenNode = lazy(() => import('./pages/GreenNode'))
const ProfileHub = lazy(() => import('./pages/ProfileHub'))
const News = lazy(() => import('./pages/News'))
const Community = lazy(() => import('./pages/Community'))
const CmsStudio = lazy(() => import('./pages/CmsStudio'))
const NotFound = lazy(() => import('./pages/NotFound'))

function RouteFallback() {
  return (
    <section className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-6 text-center">
      <div className="rounded-3xl border border-purple-500 bg-slate-950 px-8 py-6">
        <p className="text-xs uppercase tracking-widest text-orange-300">XETHKIOZ</p>
        <h1 className="mt-3 text-2xl font-black text-white md:text-3xl">Cargando portal</h1>
        <p className="mt-2 text-sm text-purple-100">Preparando la experiencia...</p>
      </div>
    </section>
  )
}

function AppShell() {
  return (
    <>
      <Analytics />
      <ScrollToTop />
      <AppErrorBoundary label="Global Controls" compact>
        <Header />
        <FusionGlobalStatus />
        <FusionGlobalWisp />
      </AppErrorBoundary>

      <main id="main-content" className="min-h-screen">
        <AppErrorBoundary label="Routes">
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/gaming" element={<GamingHub />} />
              <Route path="/science" element={<ScienceLab />} />
              <Route path="/fun" element={<FunPortal />} />
              <Route path="/green-node" element={<GreenNode />} />
              <Route path="/news" element={<News />} />
              <Route path="/community" element={<Community />} />
              <Route path="/profile" element={<ProfileHub />} />
              <Route path="/cms" element={<CmsStudio />} />
              <Route path="/admin" element={<Navigate to="/cms" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AppErrorBoundary>
      </main>
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
                      <WorldRuntimeIntegration />
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

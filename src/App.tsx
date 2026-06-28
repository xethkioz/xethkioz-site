import { Navigate, Routes, Route } from 'react-router-dom'
import { Analytics as VercelAnalytics } from '@vercel/analytics/react'
import { LangProvider } from './lib/LangContext'
import { HudProvider } from './lib/HudContext'
import { WispProvider } from './providers/WispProvider'
import { ProfileProgressProvider } from './lib/ProfileProgressContext'
import Header from './components/Header'
import FusionGlobalStatus from './components/fusion/FusionGlobalStatus'
import FusionGlobalWisp from './components/fusion/FusionGlobalWisp'
import ScrollToTop from './components/ScrollToTop'
import Analytics from './components/Analytics'
import Home from './pages/Home'
import GamingHub from './pages/GamingHub'
import ScienceLab from './pages/ScienceLab'
import FunPortal from './pages/FunPortal'
import GreenNode from './pages/GreenNode'
import ProfileHub from './pages/ProfileHub'
import News from './pages/News'
import Community from './pages/Community'
import CmsStudio from './pages/CmsStudio'
import AccountAccess from './pages/AccountAccess'
import NotFound from './pages/NotFound'
import AppErrorBoundary from './components/AppErrorBoundary'
import { WorldRuntimeIntegration, WorldRuntimeProvider } from './engines/world/runtime'
import { WorldStateProvider } from './engines/world/state'
import { WorldOrchestratorProvider } from './engines/world/orchestrator'
import { WorldThemeProvider } from './engines/world/theme'
import { LightingEngineProvider } from './engines/world/lighting'

function AppShell() {
  return (
    <>
      <Analytics />
      <VercelAnalytics />
      <ScrollToTop />
      <AppErrorBoundary label="Global Controls" compact>
        <Header />
        <FusionGlobalStatus />
        <FusionGlobalWisp />
      </AppErrorBoundary>

      <main id="main-content" className="min-h-screen">
        <AppErrorBoundary label="Routes">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gaming" element={<GamingHub />} />
            <Route path="/science" element={<ScienceLab />} />
            <Route path="/fun" element={<FunPortal />} />
            <Route path="/green-node" element={<GreenNode />} />

            <Route path="/news" element={<News />} />
            <Route path="/community" element={<Community />} />
            <Route path="/profile" element={<ProfileHub />} />
            <Route path="/login" element={<AccountAccess />} />
            <Route path="/account" element={<AccountAccess />} />
            <Route path="/register" element={<Navigate to="/login" replace />} />
            <Route path="/cms" element={<CmsStudio />} />
            <Route path="/admin" element={<Navigate to="/cms" replace />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
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

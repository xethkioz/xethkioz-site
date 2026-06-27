import { Navigate, Routes, Route } from 'react-router-dom'
import { LangProvider } from './lib/LangContext'
import { HudProvider } from './lib/HudContext'
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
import NotFound from './pages/NotFound'
import AppErrorBoundary from './components/AppErrorBoundary'

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
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gaming" element={<GamingHub />} />
            <Route path="/science" element={<ScienceLab />} />
            <Route path="/fun" element={<FunPortal />} />
            <Route path="/green-node" element={<GreenNode />} />

            {/* Legacy public routes are intentionally collapsed during the V7 clean restart. */}
            <Route path="/news" element={<Navigate to="/gaming" replace />} />
            <Route path="/community" element={<Navigate to="/fun" replace />} />
            <Route path="/admin" element={<Navigate to="/" replace />} />
            <Route path="/cms" element={<Navigate to="/" replace />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppErrorBoundary>
      </main>
    </>
  )
}

export default function App() {
  return (
    <LangProvider>
      <HudProvider>
        <AppShell />
      </HudProvider>
    </LangProvider>
  )
}

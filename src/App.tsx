import { Suspense, lazy } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { LangProvider } from './lib/LangContext'
import Header from './components/Header'
import Footer from './components/Footer'
import AnimatedBackground from './components/AnimatedBackground'
import ScrollToTop from './components/ScrollToTop'
import Analytics from './components/Analytics'
import FloatingCommunityChat from './components/FloatingCommunityChat'
import WispPortal from './components/WispPortal'
import AppErrorBoundary from './components/AppErrorBoundary'

import Home from './pages/Home'
import GamingHub from './pages/GamingHub'
import TechLab from './pages/TechLab'
import ScienceLab from './pages/ScienceLab'
import News from './pages/News'
import ArticlePage from './pages/ArticlePage'
import Streaming from './pages/Streaming'
import Media from './pages/Media'
import Community from './pages/Community'
import GreenNode from './pages/GreenNode'
import Network from './pages/Network'
import AILab from './pages/AILab'

const ChatOverlayPage = lazy(() => import('./pages/ChatOverlayPage'))
const CommunityFeature = lazy(() => import('./pages/CommunityFeature'))
const CreatorAccount = lazy(() => import('./pages/CreatorAccount'))
const CreatorDashboard = lazy(() => import('./pages/CreatorDashboard'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Support = lazy(() => import('./pages/Support'))
const Authors = lazy(() => import('./pages/Authors'))
const AuthorProfile = lazy(() => import('./pages/AuthorProfile'))
const Admin = lazy(() => import('./pages/Admin'))
const CmsStudio = lazy(() => import('./pages/CmsStudio'))
const LiveChecklist = lazy(() => import('./pages/LiveChecklist'))
const NewsEngine = lazy(() => import('./pages/NewsEngine'))
const RolesDashboard = lazy(() => import('./pages/RolesDashboard'))
const ContentSystem = lazy(() => import('./pages/ContentSystem'))
const FinalQA = lazy(() => import('./pages/FinalQA'))
const CreatorStudio = lazy(() => import('./pages/CreatorStudio'))
const Milestones = lazy(() => import('./pages/Milestones'))
const NotFound = lazy(() => import('./pages/NotFound'))
const ComingSoon = lazy(() => import('./pages/ComingSoon'))

function RouteLoader() {
  return (
    <div className="mx-auto flex min-h-[45vh] max-w-7xl items-center justify-center px-4">
      <div className="rounded-3xl border border-orange/20 bg-ink-300/80 p-6 text-center shadow-[0_0_35px_rgba(255,106,0,0.12)]">
        <p className="section-eyebrow">XETHKIOZ NETWORK</p>
        <p className="font-display text-xl font-black text-white">Cargando módulo...</p>
        <p className="mt-2 text-sm text-gray-400">Separación de bundles activa para reducir peso inicial.</p>
      </div>
    </div>
  )
}

function AppShell() {
  const location = useLocation()
  const isGreenNode = location.pathname === '/green-node'
  const isGreenNodeRoute = isGreenNode

  return (
    <>
      <AnimatedBackground />
      <Analytics />
      <ScrollToTop />
      <AppErrorBoundary label="Header" compact>
        <Header />
      </AppErrorBoundary>

      <main id="main-content" className={`min-h-screen pt-16 md:pt-20 ${isGreenNodeRoute ? 'green-node-shell' : ''}`}>
        <AppErrorBoundary label="Routes">
          <Suspense fallback={<RouteLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/gaming" element={<GamingHub />} />
              <Route path="/tech" element={<TechLab />} />
              <Route path="/science" element={<ScienceLab />} />
              <Route path="/news" element={<News />} />
              <Route path="/article/:slug" element={<ArticlePage />} />
              <Route path="/streaming" element={<Streaming />} />
              <Route path="/streaming/chat-overlay" element={<ChatOverlayPage />} />
              <Route path="/chat-overlay" element={<ChatOverlayPage />} />
              <Route path="/media" element={<Media />} />
              <Route path="/community" element={<Community />} />
              <Route path="/community/:featureSlug" element={<CommunityFeature />} />
              <Route path="/creator" element={<CreatorAccount />} />
              <Route path="/creator/panel" element={<CreatorDashboard />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/support" element={<Support />} />
              <Route path="/authors" element={<Authors />} />
              <Route path="/author/:slug" element={<AuthorProfile />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/cms" element={<CmsStudio />} />
              <Route path="/news-engine" element={<NewsEngine />} />
              <Route path="/roles" element={<RolesDashboard />} />
              <Route path="/green-node" element={<GreenNode />} />
              <Route path="/network" element={<Network />} />
              <Route path="/content-system" element={<ContentSystem />} />
              <Route path="/ai-lab" element={<AILab />} />
              <Route path="/creator-studio" element={<CreatorStudio />} />
              <Route path="/milestones" element={<Milestones />} />
              <Route path="/qa" element={<FinalQA />} />
              <Route path="/live-checklist" element={<LiveChecklist />} />
              <Route path="/coming-soon" element={<ComingSoon />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AppErrorBoundary>
      </main>

      <AppErrorBoundary label="Footer" compact>
        <Footer />
      </AppErrorBoundary>
      <AppErrorBoundary label="FloatingCommunityChat" compact>
        <FloatingCommunityChat />
      </AppErrorBoundary>
      <AppErrorBoundary label="WispPortal" compact>
        <WispPortal />
      </AppErrorBoundary>
    </>
  )
}

export default function App() {
  return (
    <LangProvider>
      <AppShell />
    </LangProvider>
  )
}

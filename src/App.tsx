import { Routes, Route, useLocation } from 'react-router-dom'
import { LangProvider } from './lib/LangContext'
import Header from './components/Header'
import Footer from './components/Footer'
import AnimatedBackground from './components/AnimatedBackground'
import ScrollToTop from './components/ScrollToTop'
import Analytics from './components/Analytics'
import Home from './pages/Home'
import GamingHub from './pages/GamingHub'
import TechLab from './pages/TechLab'
import ScienceLab from './pages/ScienceLab'
import News from './pages/News'
import ArticlePage from './pages/ArticlePage'
import Streaming from './pages/Streaming'
import ChatOverlayPage from './pages/ChatOverlayPage'
import Media from './pages/Media'
import Community from './pages/Community'
import CommunityFeature from './pages/CommunityFeature'
import CreatorAccount from './pages/CreatorAccount'
import CreatorDashboard from './pages/CreatorDashboard'
import About from './pages/About'
import Contact from './pages/Contact'
import Support from './pages/Support'
import Authors from './pages/Authors'
import AuthorProfile from './pages/AuthorProfile'
import Admin from './pages/Admin'
import CmsStudio from './pages/CmsStudio'
import LiveChecklist from './pages/LiveChecklist'
import NewsEngine from './pages/NewsEngine'
import RolesDashboard from './pages/RolesDashboard'
import GreenNode from './pages/GreenNode'
import Network from './pages/Network'
import ContentSystem from './pages/ContentSystem'
import FinalQA from './pages/FinalQA'
import AILab from './pages/AILab'
import CreatorStudio from './pages/CreatorStudio'
import Milestones from './pages/Milestones'
import NotFound from './pages/NotFound'
import ComingSoon from './pages/ComingSoon'
import FloatingCommunityChat from './components/FloatingCommunityChat'
import WispPortal from './components/WispPortal'

function AppShell() {
  const location = useLocation()
  const isGreenNode = location.pathname === '/green-node'
  const isScienceLab = location.pathname === '/science'
  const isIsolatedPortal = isGreenNode || isScienceLab
  const hideMainChrome = isIsolatedPortal

  return (
    <>
      {!isGreenNode && <AnimatedBackground />}
      <Analytics />
      <ScrollToTop />
      {!hideMainChrome && <Header />}

      <main id="main-content" className={`min-h-screen ${hideMainChrome ? '' : 'pt-16 md:pt-20'}`}>
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
      </main>

      {!hideMainChrome && <Footer />}
      <FloatingCommunityChat />
      {!isIsolatedPortal && <WispPortal />}
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

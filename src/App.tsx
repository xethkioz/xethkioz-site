import { Routes, Route } from 'react-router-dom'
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
import NotFound from './pages/NotFound'
import ComingSoon from './pages/ComingSoon'
export default function App() {
  return (
    <LangProvider>
      <AnimatedBackground /><Analytics /><ScrollToTop /><Header />
      <main id="main-content" className="min-h-screen pt-16 md:pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gaming" element={<GamingHub />} />
          <Route path="/tech" element={<TechLab />} />
          <Route path="/science" element={<ScienceLab />} />
          <Route path="/news" element={<News />} />
          <Route path="/article/:slug" element={<ArticlePage />} />
          <Route path="/streaming" element={<Streaming />} />
          <Route path="/streaming/chat-overlay" element={<ChatOverlayPage />} />
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
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </LangProvider>
  )
}

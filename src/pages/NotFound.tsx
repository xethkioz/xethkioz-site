import { Link } from 'react-router-dom'
import { useLang } from '../lib/LangContext'
import Logo from '../components/Logo'
import SEO from '../components/SEO'
export default function NotFound() { const { t } = useLang(); return <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4"><SEO title={t.errors.notFoundTitle} /><div className="text-center"><Logo size="lg" className="mx-auto mb-8 opacity-50" /><h1 className="font-display text-6xl md:text-8xl font-bold gradient-text mb-4">404</h1><h2 className="font-display text-xl text-white mb-2">{t.errors.notFoundTitle}</h2><p className="text-gray-400 mb-8">{t.errors.notFoundDesc}</p><Link to="/" className="btn-primary inline-block">{t.errors.backHome}</Link></div></div> }

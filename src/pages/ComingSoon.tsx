import { useLang } from '../lib/LangContext'
import Logo from '../components/Logo'
import SEO from '../components/SEO'
export default function ComingSoon() { const { t } = useLang(); return <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4"><SEO title={t.errors.comingSoonTitle} /><div className="text-center"><Logo size="lg" className="mx-auto mb-8" /><div className="text-5xl mb-6 animate-float">🚀</div><h1 className="font-display text-2xl md:text-3xl font-bold gradient-text mb-3">{t.errors.comingSoonTitle}</h1><p className="text-gray-400 max-w-md mx-auto">{t.errors.comingSoonDesc}</p></div></div> }

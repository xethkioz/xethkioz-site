import { useLang } from '../lib/LangContext'
import Logo from '../components/Logo'
import SEO from '../components/SEO'
export default function Maintenance() { const { t } = useLang(); return <div className="min-h-screen flex items-center justify-center px-4"><SEO title={t.errors.maintenanceTitle} /><div className="text-center"><Logo size="lg" className="mx-auto mb-8 animate-glow-pulse" /><div className="text-5xl mb-6">🔧</div><h1 className="font-display text-2xl md:text-3xl font-bold gradient-text mb-3">{t.errors.maintenanceTitle}</h1><p className="text-gray-400 max-w-md mx-auto">{t.errors.maintenanceDesc}</p></div></div> }

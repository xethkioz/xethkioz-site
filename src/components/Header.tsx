import { Link } from 'react-router-dom'
import { useLang } from '../lib/LangContext'

export default function Header() {
  const { lang, setLang, localizePath } = useLang()
  return <header className="sticky top-0 z-[65] border-b border-slate-200 bg-white/95 text-slate-800 shadow-sm backdrop-blur-lg">
    <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-4 px-5 py-4">
      <Link className="text-xl font-black tracking-tight text-slate-900 md:text-2xl" to="/"><span className="text-violet-600">✦</span> XETHKIOZ</Link>
      <nav className="flex flex-wrap items-center gap-x-5 gap-y-3 text-xs font-bold text-slate-600 md:text-sm" aria-label="Secciones de XETHKIOZ">
        <Link to="/explorar">Explorar</Link><Link to={localizePath('/green-node')}>Green Node</Link><Link to={localizePath('/science')}>{lang === 'es' ? 'Ciencia' : 'Science'}</Link><a href="/mascotas/">{lang === 'es' ? 'Mascotas' : 'Pets'}</a>
      </nav>
      <div className="flex items-center gap-3 text-xs font-bold"><button type="button" onClick={() => setLang(lang === 'es' ? 'en' : 'es')} aria-label="Cambiar idioma" className="rounded-lg border border-slate-200 px-2 py-2">{lang === 'es' ? 'EN' : 'ES'}</button><Link to="/mis-proyectos" className="text-violet-700">Mi espacio</Link><Link to="/publicar" className="rounded-xl bg-violet-600 px-4 py-2.5 text-white">+ Publicar</Link></div>
    </div>
  </header>
}

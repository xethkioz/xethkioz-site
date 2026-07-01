import { Link } from 'react-router-dom'
import { useAdminSession } from '../hooks'

export default function CmsHeader() {
  const { user, role, tier, logout } = useAdminSession()

  return (
    <header className="border-b border-purple-500/20 bg-slate-950/80 px-5 py-4 text-white backdrop-blur-xl">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-300">Panel protegido</p>
          <h1 className="mt-1 text-xl font-black md:text-2xl">CMS Profesional XETHKIOZ</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="rounded-full border border-purple-400/30 bg-purple-500/10 px-3 py-2 text-purple-100">
            {user?.email ?? 'usuario'}
          </span>
          <span className="rounded-full border border-orange-400/30 bg-orange-500/10 px-3 py-2 font-black uppercase tracking-[0.14em] text-orange-100">
            {role} · {tier}
          </span>
          <Link className="rounded-full border border-purple-400/30 px-4 py-2 font-bold text-purple-100 transition hover:bg-purple-500/10" to="/">
            Ver web
          </Link>
          <button className="rounded-full border border-orange-400/50 bg-orange-500/10 px-4 py-2 font-bold text-orange-100 transition hover:bg-orange-500/20" type="button" onClick={() => void logout()}>
            Salir
          </button>
        </div>
      </div>
    </header>
  )
}

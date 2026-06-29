import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAdminSession } from '../hooks'

function CmsLoadingState() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-center text-white">
      <section className="max-w-md rounded-3xl border border-purple-500/40 bg-black/50 p-8 shadow-2xl shadow-purple-950/40">
        <p className="text-xs font-black uppercase tracking-[0.32em] text-orange-300">XETHKIOZ CMS</p>
        <h1 className="mt-4 text-2xl font-black">Validando acceso</h1>
        <p className="mt-3 text-sm text-purple-100">Comprobando sesión administrativa...</p>
      </section>
    </main>
  )
}

function CmsNotConfiguredState() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-center text-white">
      <section className="max-w-lg rounded-3xl border border-orange-400/40 bg-black/50 p-8 shadow-2xl shadow-orange-950/30">
        <p className="text-xs font-black uppercase tracking-[0.32em] text-orange-300">XETHKIOZ CMS</p>
        <h1 className="mt-4 text-2xl font-black">Supabase no configurado</h1>
        <p className="mt-3 text-sm text-purple-100">El CMS necesita variables públicas de Supabase para validar usuarios.</p>
      </section>
    </main>
  )
}

type AdminGuardProps = {
  children: ReactNode
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const location = useLocation()
  const { user, isAdmin, loading, ready } = useAdminSession()

  if (!ready) return <CmsNotConfiguredState />
  if (loading) return <CmsLoadingState />
  if (!user) return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />
  if (!isAdmin) return <Navigate to="/" replace />

  return <>{children}</>
}

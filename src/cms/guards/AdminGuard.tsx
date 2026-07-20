import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useLang } from '../../lib/LangContext'
import { useAdminSession } from '../hooks'

type GuardTone = 'loading' | 'warning' | 'forbidden'

type GuardStateProps = {
  tone: GuardTone
  title: string
  description: string
}

const toneClasses: Record<GuardTone, { border: string; eyebrow: string; shadow: string }> = {
  loading: {
    border: 'border-purple-500/40',
    eyebrow: 'text-orange-300',
    shadow: 'shadow-purple-950/40',
  },
  warning: {
    border: 'border-orange-400/40',
    eyebrow: 'text-orange-300',
    shadow: 'shadow-orange-950/30',
  },
  forbidden: {
    border: 'border-red-400/40',
    eyebrow: 'text-red-300',
    shadow: 'shadow-red-950/30',
  },
}

function CmsGuardState({ tone, title, description }: GuardStateProps) {
  const classes = toneClasses[tone]

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-center text-white">
      <section
        className={`max-w-lg rounded-3xl border bg-black/50 p-8 shadow-2xl ${classes.border} ${classes.shadow}`}
        role={tone === 'loading' ? 'status' : 'alert'}
        aria-live={tone === 'loading' ? 'polite' : 'assertive'}
        aria-busy={tone === 'loading'}
      >
        <p className={`text-xs font-black uppercase tracking-[0.32em] ${classes.eyebrow}`}>XETHKIOZ CMS</p>
        <h1 className="mt-4 text-2xl font-black">{title}</h1>
        <p className="mt-3 text-sm text-purple-100">{description}</p>
      </section>
    </main>
  )
}

type AdminGuardProps = {
  children: ReactNode
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const location = useLocation()
  const { lang } = useLang()
  const { user, canAccessCms, loading, ready } = useAdminSession()

  const copy = lang === 'es'
    ? {
        loadingTitle: 'Validando acceso',
        loadingDescription: 'Comprobando tu sesión editorial…',
        configTitle: 'Supabase no está configurado',
        configDescription: 'El CMS necesita las variables públicas de Supabase para validar usuarios y permisos.',
        forbiddenTitle: 'Acceso editorial no habilitado',
        forbiddenDescription: 'Tu cuenta existe, pero todavía no tiene un rol CONTRIBUTOR, EDITOR, MODERATOR o ADMIN.',
      }
    : {
        loadingTitle: 'Validating access',
        loadingDescription: 'Checking your editorial session…',
        configTitle: 'Supabase is not configured',
        configDescription: 'The CMS requires the public Supabase variables to validate users and permissions.',
        forbiddenTitle: 'Editorial access is not enabled',
        forbiddenDescription: 'Your account exists, but it does not have a CONTRIBUTOR, EDITOR, MODERATOR or ADMIN role yet.',
      }

  if (!ready) {
    return <CmsGuardState tone="warning" title={copy.configTitle} description={copy.configDescription} />
  }

  if (loading) {
    return <CmsGuardState tone="loading" title={copy.loadingTitle} description={copy.loadingDescription} />
  }

  if (!user) {
    const redirect = `${location.pathname}${location.search}`
    return <Navigate to={`/account?mode=signin&redirect=${encodeURIComponent(redirect)}`} replace />
  }

  if (!canAccessCms) {
    return <CmsGuardState tone="forbidden" title={copy.forbiddenTitle} description={copy.forbiddenDescription} />
  }

  return <>{children}</>
}

import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase, supabaseEnvironment } from '../../services/supabaseClient'

type DashboardStats = {
  total: number
  draft: number
  review: number
  published: number
  chatRooms: number
  chatMessages: number
  profiles: number
  adSlots: number
  adCampaigns: number
}

type DbCheck = {
  label: string
  table: string
  status: 'ok' | 'missing' | 'error'
  count: number | null
  message: string
}

const emptyStats: DashboardStats = {
  total: 0,
  draft: 0,
  review: 0,
  published: 0,
  chatRooms: 0,
  chatMessages: 0,
  profiles: 0,
  adSlots: 0,
  adCampaigns: 0,
}

async function countByStatus(status?: string) {
  let query = supabase.from('news_articles').select('id', { count: 'exact', head: true })
  if (status) query = query.eq('status', status)
  const { count, error } = await query
  if (error) throw error
  return count ?? 0
}

async function countTable(table: 'chat_rooms' | 'chat_messages') {
  const { count, error } = await supabase.from(table).select('id', { count: 'exact', head: true })
  if (error) throw error
  return count ?? 0
}

async function checkTable(label: string, table: string): Promise<DbCheck> {
  const { count, error } = await (supabase as any).from(table).select('id', { count: 'exact', head: true })

  if (error) {
    const message = error.message ?? 'No disponible'
    return {
      label,
      table,
      status: message.toLowerCase().includes('does not exist') || message.toLowerCase().includes('schema cache') ? 'missing' : 'error',
      count: null,
      message,
    }
  }

  return {
    label,
    table,
    status: 'ok',
    count: count ?? 0,
    message: 'OK',
  }
}

export default function CmsDashboard() {
  const [stats, setStats] = useState<DashboardStats>(emptyStats)
  const [dbChecks, setDbChecks] = useState<DbCheck[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [localCleared, setLocalCleared] = useState(false)

  useEffect(() => {
    let active = true

    async function loadStats() {
      setLoading(true)
      setError(null)

      if (!supabaseEnvironment.ready) {
        if (active) {
          setStats(emptyStats)
          setDbChecks([])
          setError('Supabase todavía no está activo en este build. Revisar variables de entorno en Vercel y redeploy.')
          setLoading(false)
        }
        return
      }

      try {
        const checks = await Promise.all([
          checkTable('Perfiles / roles', 'profiles'),
          checkTable('Noticias CMS', 'news_articles'),
          checkTable('Salas chat', 'chat_rooms'),
          checkTable('Mensajes chat', 'chat_messages'),
          checkTable('Slots de ads', 'ads_slots'),
          checkTable('Campañas ads', 'ads_campaigns'),
        ])

        const [total, draft, review, published, chatRooms, chatMessages] = await Promise.all([
          countByStatus(),
          countByStatus('draft'),
          countByStatus('review'),
          countByStatus('published'),
          countTable('chat_rooms'),
          countTable('chat_messages'),
        ])

        const profiles = checks.find((check) => check.table === 'profiles')?.count ?? 0
        const adSlots = checks.find((check) => check.table === 'ads_slots')?.count ?? 0
        const adCampaigns = checks.find((check) => check.table === 'ads_campaigns')?.count ?? 0

        if (active) {
          setDbChecks(checks)
          setStats({ total, draft, review, published, chatRooms, chatMessages, profiles, adSlots, adCampaigns })
        }
      } catch (caughtError) {
        if (active) setError(caughtError instanceof Error ? caughtError.message : 'No se pudieron cargar métricas del CMS.')
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadStats()

    return () => {
      active = false
    }
  }, [])

  function clearLocalChat() {
    if (typeof window === 'undefined') return
    window.localStorage.removeItem('xethkioz.nexus.local.messages.v3')
    setLocalCleared(true)
  }

  const cards = [
    { label: 'Noticias totales', value: stats.total, hint: 'news_articles' },
    { label: 'Borradores', value: stats.draft, hint: 'status draft' },
    { label: 'En revisión', value: stats.review, hint: 'status review' },
    { label: 'Publicadas', value: stats.published, hint: 'status published' },
  ]

  const opsCards = [
    { label: 'Supabase', value: supabaseEnvironment.ready ? 'OK' : 'PENDIENTE', hint: 'frontend environment' },
    { label: 'Perfiles', value: stats.profiles, hint: 'profiles' },
    { label: 'Salas chat', value: stats.chatRooms, hint: 'chat_rooms' },
    { label: 'Mensajes chat', value: stats.chatMessages, hint: 'chat_messages' },
    { label: 'Slots ads', value: stats.adSlots, hint: 'ads_slots' },
    { label: 'Campañas ads', value: stats.adCampaigns, hint: 'ads_campaigns' },
    { label: 'Deploy', value: 'VERCEL', hint: 'main production' },
  ]

  const health = useMemo(() => {
    const missing = dbChecks.filter((check) => check.status === 'missing')
    const errors = dbChecks.filter((check) => check.status === 'error')
    if (!supabaseEnvironment.ready) return { label: 'PENDIENTE', description: 'Variables de Supabase no disponibles en este build.', tone: 'yellow' }
    if (missing.length > 0) return { label: 'DB INCOMPLETA', description: `Faltan tablas/migraciones: ${missing.map((check) => check.table).join(', ')}`, tone: 'yellow' }
    if (errors.length > 0) return { label: 'DB CON AVISOS', description: `Hay errores de lectura o RLS en: ${errors.map((check) => check.table).join(', ')}`, tone: 'red' }
    return { label: 'OK', description: 'Tablas principales listas y accesibles desde el CMS.', tone: 'green' }
  }, [dbChecks])

  return (
    <section className="space-y-8">
      <div className="rounded-3xl border border-purple-500/25 bg-black/40 p-6 shadow-2xl shadow-purple-950/30">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-300">Dashboard editorial</p>
        <h2 className="mt-3 text-3xl font-black md:text-4xl">Centro de mando del News Engine</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-purple-100">Estado real del CMS conectado a Supabase. Los borradores generados quedan en revisión antes de publicarse.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link to="/cms/generate" className="rounded-full bg-orange px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-black transition hover:shadow-glow-action">Nueva noticia</Link>
          <Link to="/cms/news" className="rounded-full border border-purple-400/40 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-purple-100 transition hover:bg-purple-500/10">Ver listado</Link>
          <Link to="/cms/review" className="rounded-full border border-yellow-400/40 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-yellow-100 transition hover:bg-yellow-500/10">Cola revisión</Link>
          <Link to="/cms/users" className="rounded-full border border-emerald-400/40 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-emerald-100 transition hover:bg-emerald-500/10">Usuarios</Link>
          <Link to="/cms/ads" className="rounded-full border border-orange-400/40 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-orange-100 transition hover:bg-orange-500/10">Ads</Link>
          <Link to="/news" className="rounded-full border border-purple-400/40 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-purple-100 transition hover:bg-purple-500/10">Feed público</Link>
          <button type="button" onClick={clearLocalChat} className="rounded-full border border-emerald-400/40 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-emerald-100 transition hover:bg-emerald-500/10">Limpiar chat local</button>
        </div>
        {localCleared ? <p className="mt-4 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-emerald-100">Cache local del chat limpiada en este navegador.</p> : null}
      </div>

      {error ? <p className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">{error}</p> : null}

      <div className={`rounded-3xl border p-6 shadow-2xl ${health.tone === 'green' ? 'border-emerald-400/30 bg-emerald-400/10 shadow-emerald-950/20' : health.tone === 'red' ? 'border-red-400/30 bg-red-400/10 shadow-red-950/20' : 'border-yellow-400/30 bg-yellow-400/10 shadow-yellow-950/20'}`}>
        <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-300">System Health</p>
        <h3 className="mt-3 text-2xl font-black text-white">{loading ? 'Chequeando...' : health.label}</h3>
        <p className="mt-2 text-sm leading-6 text-purple-100">{loading ? 'Validando tablas principales de Supabase.' : health.description}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((stat) => (
          <article key={stat.label} className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-200">{stat.label}</p>
            <strong className="mt-3 block text-4xl font-black text-white">{loading ? '...' : stat.value}</strong>
            <p className="mt-2 text-xs text-purple-200/80">{stat.hint}</p>
          </article>
        ))}
      </div>

      <div className="rounded-3xl border border-purple-500/25 bg-black/40 p-6 shadow-2xl shadow-purple-950/30">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-300">Auditoría operativa</p>
        <h3 className="mt-3 text-2xl font-black">Estado de producción</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {opsCards.map((stat) => (
            <article key={stat.label} className="rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.05] p-5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-100/80">{stat.label}</p>
              <strong className="mt-3 block text-2xl font-black text-white">{loading ? '...' : stat.value}</strong>
              <p className="mt-2 text-xs text-emerald-100/70">{stat.hint}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-purple-500/25 bg-black/40 p-6 shadow-2xl shadow-purple-950/30">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-300">Database Readiness</p>
        <h3 className="mt-3 text-2xl font-black">Tablas principales</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {dbChecks.map((check) => (
            <article key={check.table} className={`rounded-3xl border p-5 ${check.status === 'ok' ? 'border-emerald-400/20 bg-emerald-400/[0.05]' : check.status === 'missing' ? 'border-yellow-400/30 bg-yellow-400/10' : 'border-red-400/30 bg-red-400/10'}`}>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-purple-100">{check.label}</p>
              <h4 className="mt-2 text-xl font-black text-white">{check.status.toUpperCase()}</h4>
              <p className="mt-2 font-mono text-xs text-purple-100">{check.table}</p>
              <p className="mt-2 text-xs text-purple-200">{check.count === null ? check.message : `${check.count} registros`}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

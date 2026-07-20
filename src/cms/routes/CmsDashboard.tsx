import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../../lib/LangContext'
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
  webOffers: number
  webQuotes: number
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
  webOffers: 0,
  webQuotes: 0,
}

const copy = {
  es: {
    unavailable: 'No disponible',
    supabaseInactive: 'Supabase todavía no está activo en este build. Revisá las variables de entorno en Vercel y volvé a desplegar.',
    metricsError: 'No se pudieron cargar las métricas del CMS.',
    tables: {
      profiles: 'Perfiles / roles', news_articles: 'Noticias CMS', chat_rooms: 'Salas de chat', chat_messages: 'Mensajes de chat', ads_slots: 'Slots de ads', ads_campaigns: 'Campañas de ads', web_service_offers: 'Propuestas web', web_quote_requests: 'Presupuestos web',
    } as Record<string, string>,
    cards: {
      total: 'Noticias totales', draft: 'Borradores', review: 'En revisión', published: 'Publicadas',
      profiles: 'Perfiles', chatRooms: 'Salas de chat', chatMessages: 'Mensajes de chat', adSlots: 'Slots de ads', adCampaigns: 'Campañas de ads', webOffers: 'Propuestas web', webQuotes: 'Presupuestos web',
    },
    pending: 'PENDIENTE',
    dbIncomplete: 'DB INCOMPLETA',
    dbWarnings: 'DB CON AVISOS',
    supabaseMissing: 'Variables de Supabase no disponibles en este build.',
    missingTables: 'Faltan tablas o migraciones',
    readErrors: 'Hay errores de lectura o RLS en',
    healthy: 'Tablas principales listas y accesibles desde el CMS.',
    eyebrow: 'Dashboard editorial',
    title: 'Centro de mando del News Engine',
    description: 'Estado real del CMS conectado a Supabase. Los borradores generados quedan en revisión antes de publicarse.',
    actions: { new: 'Nueva noticia', list: 'Ver listado', review: 'Cola de revisión', users: 'Usuarios', ads: 'Ads', web: 'Creación web', quotes: 'Presupuestos', publicFeed: 'Feed público', clearChat: 'Limpiar chat local' },
    chatCleared: 'La caché local del chat se limpió en este navegador.',
    healthEyebrow: 'Salud del sistema',
    checking: 'Comprobando…',
    validating: 'Validando las tablas principales de Supabase.',
    operationalEyebrow: 'Auditoría operativa',
    operationalTitle: 'Estado de producción',
    databaseEyebrow: 'Preparación de base de datos',
    databaseTitle: 'Tablas principales',
    records: 'registros',
    statusLabels: { ok: 'OK', missing: 'FALTANTE', error: 'ERROR' } as Record<DbCheck['status'], string>,
    deploy: 'Deploy',
    environment: 'entorno frontend',
    production: 'producción main',
  },
  en: {
    unavailable: 'Unavailable',
    supabaseInactive: 'Supabase is not active in this build yet. Check the Vercel environment variables and redeploy.',
    metricsError: 'CMS metrics could not be loaded.',
    tables: {
      profiles: 'Profiles / roles', news_articles: 'CMS articles', chat_rooms: 'Chat rooms', chat_messages: 'Chat messages', ads_slots: 'Ad slots', ads_campaigns: 'Ad campaigns', web_service_offers: 'Web solutions', web_quote_requests: 'Web quotes',
    } as Record<string, string>,
    cards: {
      total: 'Total articles', draft: 'Drafts', review: 'In review', published: 'Published',
      profiles: 'Profiles', chatRooms: 'Chat rooms', chatMessages: 'Chat messages', adSlots: 'Ad slots', adCampaigns: 'Ad campaigns', webOffers: 'Web solutions', webQuotes: 'Web quotes',
    },
    pending: 'PENDING',
    dbIncomplete: 'INCOMPLETE DB',
    dbWarnings: 'DB WARNINGS',
    supabaseMissing: 'Supabase variables are unavailable in this build.',
    missingTables: 'Missing tables or migrations',
    readErrors: 'Read or RLS errors detected in',
    healthy: 'Main tables are ready and accessible from the CMS.',
    eyebrow: 'Editorial dashboard',
    title: 'News Engine command center',
    description: 'Live CMS status connected to Supabase. Generated drafts remain in review before publication.',
    actions: { new: 'New article', list: 'View list', review: 'Review queue', users: 'Users', ads: 'Ads', web: 'Web Creation', quotes: 'Quotes', publicFeed: 'Public feed', clearChat: 'Clear local chat' },
    chatCleared: 'The local chat cache was cleared in this browser.',
    healthEyebrow: 'System health',
    checking: 'Checking…',
    validating: 'Validating the main Supabase tables.',
    operationalEyebrow: 'Operational audit',
    operationalTitle: 'Production status',
    databaseEyebrow: 'Database readiness',
    databaseTitle: 'Main tables',
    records: 'records',
    statusLabels: { ok: 'OK', missing: 'MISSING', error: 'ERROR' } as Record<DbCheck['status'], string>,
    deploy: 'Deploy',
    environment: 'frontend environment',
    production: 'main production',
  },
} as const

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

async function checkTable(label: string, table: string, unavailable: string): Promise<DbCheck> {
  const { count, error } = await (supabase as any).from(table).select('id', { count: 'exact', head: true })

  if (error) {
    const message = error.message ?? unavailable
    return {
      label,
      table,
      status: message.toLowerCase().includes('does not exist') || message.toLowerCase().includes('schema cache') ? 'missing' : 'error',
      count: null,
      message,
    }
  }

  return { label, table, status: 'ok', count: count ?? 0, message: 'OK' }
}

export default function CmsDashboard() {
  const { lang } = useLang()
  const t = copy[lang]
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
          setError(t.supabaseInactive)
          setLoading(false)
        }
        return
      }

      try {
        const tableNames = ['profiles', 'news_articles', 'chat_rooms', 'chat_messages', 'ads_slots', 'ads_campaigns', 'web_service_offers', 'web_quote_requests'] as const
        const checks = await Promise.all(tableNames.map((table) => checkTable(t.tables[table], table, t.unavailable)))
        const [total, draft, review, published, chatRooms, chatMessages] = await Promise.all([
          countByStatus(), countByStatus('draft'), countByStatus('review'), countByStatus('published'), countTable('chat_rooms'), countTable('chat_messages'),
        ])

        const countFor = (table: string) => checks.find((check) => check.table === table)?.count ?? 0
        if (active) {
          setDbChecks(checks)
          setStats({
            total, draft, review, published, chatRooms, chatMessages,
            profiles: countFor('profiles'), adSlots: countFor('ads_slots'), adCampaigns: countFor('ads_campaigns'), webOffers: countFor('web_service_offers'), webQuotes: countFor('web_quote_requests'),
          })
        }
      } catch (caughtError) {
        if (active) setError(caughtError instanceof Error ? caughtError.message : t.metricsError)
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadStats()
    return () => { active = false }
  }, [lang, t])

  function clearLocalChat() {
    if (typeof window === 'undefined') return
    window.localStorage.removeItem('xethkioz.nexus.local.messages.v3')
    setLocalCleared(true)
  }

  const cards = [
    { label: t.cards.total, value: stats.total, hint: 'news_articles' },
    { label: t.cards.draft, value: stats.draft, hint: 'status draft' },
    { label: t.cards.review, value: stats.review, hint: 'status review' },
    { label: t.cards.published, value: stats.published, hint: 'status published' },
  ]

  const opsCards = [
    { label: 'Supabase', value: supabaseEnvironment.ready ? 'OK' : t.pending, hint: t.environment },
    { label: t.cards.profiles, value: stats.profiles, hint: 'profiles' },
    { label: t.cards.chatRooms, value: stats.chatRooms, hint: 'chat_rooms' },
    { label: t.cards.chatMessages, value: stats.chatMessages, hint: 'chat_messages' },
    { label: t.cards.adSlots, value: stats.adSlots, hint: 'ads_slots' },
    { label: t.cards.adCampaigns, value: stats.adCampaigns, hint: 'ads_campaigns' },
    { label: t.cards.webOffers, value: stats.webOffers, hint: 'web_service_offers' },
    { label: t.cards.webQuotes, value: stats.webQuotes, hint: 'web_quote_requests' },
    { label: t.deploy, value: 'VERCEL', hint: t.production },
  ]

  const health = useMemo(() => {
    const missing = dbChecks.filter((check) => check.status === 'missing')
    const errors = dbChecks.filter((check) => check.status === 'error')
    if (!supabaseEnvironment.ready) return { label: t.pending, description: t.supabaseMissing, tone: 'yellow' }
    if (missing.length > 0) return { label: t.dbIncomplete, description: `${t.missingTables}: ${missing.map((check) => check.table).join(', ')}`, tone: 'yellow' }
    if (errors.length > 0) return { label: t.dbWarnings, description: `${t.readErrors}: ${errors.map((check) => check.table).join(', ')}`, tone: 'red' }
    return { label: 'OK', description: t.healthy, tone: 'green' }
  }, [dbChecks, t])

  return (
    <section className="space-y-8" aria-labelledby="cms-dashboard-title" aria-busy={loading}>
      <div className="rounded-3xl border border-purple-500/25 bg-black/40 p-6 shadow-2xl shadow-purple-950/30">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-300">{t.eyebrow}</p>
        <h2 id="cms-dashboard-title" className="mt-3 text-3xl font-black md:text-4xl">{t.title}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-purple-100">{t.description}</p>
        <nav className="mt-5 flex flex-wrap gap-3" aria-label={t.eyebrow}>
          <Link to="/cms/generate" className="rounded-full bg-orange px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-black transition hover:shadow-glow-action">{t.actions.new}</Link>
          <Link to="/cms/news" className="rounded-full border border-purple-400/40 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-purple-100 transition hover:bg-purple-500/10">{t.actions.list}</Link>
          <Link to="/cms/review" className="rounded-full border border-yellow-400/40 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-yellow-100 transition hover:bg-yellow-500/10">{t.actions.review}</Link>
          <Link to="/cms/users" className="rounded-full border border-emerald-400/40 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-emerald-100 transition hover:bg-emerald-500/10">{t.actions.users}</Link>
          <Link to="/cms/ads" className="rounded-full border border-orange-400/40 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-orange-100 transition hover:bg-orange-500/10">{t.actions.ads}</Link>
          <Link to="/cms/web-services" className="rounded-full border border-orange-400/40 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-orange-100 transition hover:bg-orange-500/10">{t.actions.web}</Link>
          <Link to="/cms/web-quotes" className="rounded-full border border-purple-400/40 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-purple-100 transition hover:bg-purple-500/10">{t.actions.quotes}</Link>
          <Link to="/news" className="rounded-full border border-purple-400/40 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-purple-100 transition hover:bg-purple-500/10">{t.actions.publicFeed}</Link>
          <button type="button" onClick={clearLocalChat} className="rounded-full border border-emerald-400/40 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-emerald-100 transition hover:bg-emerald-500/10">{t.actions.clearChat}</button>
        </nav>
        {localCleared ? <p className="mt-4 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-emerald-100" role="status" aria-live="polite">{t.chatCleared}</p> : null}
      </div>

      {error ? <p className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200" role="alert">{error}</p> : null}

      <div className={`rounded-3xl border p-6 shadow-2xl ${health.tone === 'green' ? 'border-emerald-400/30 bg-emerald-400/10 shadow-emerald-950/20' : health.tone === 'red' ? 'border-red-400/30 bg-red-400/10 shadow-red-950/20' : 'border-yellow-400/30 bg-yellow-400/10 shadow-yellow-950/20'}`} role="status" aria-live="polite">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-300">{t.healthEyebrow}</p>
        <h3 className="mt-3 text-2xl font-black text-white">{loading ? t.checking : health.label}</h3>
        <p className="mt-2 text-sm leading-6 text-purple-100">{loading ? t.validating : health.description}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((stat) => <article key={stat.label} className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-5"><p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-200">{stat.label}</p><strong className="mt-3 block text-4xl font-black text-white">{loading ? '…' : stat.value}</strong><p className="mt-2 text-xs text-purple-200/80">{stat.hint}</p></article>)}
      </div>

      <div className="rounded-3xl border border-purple-500/25 bg-black/40 p-6 shadow-2xl shadow-purple-950/30">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-300">{t.operationalEyebrow}</p>
        <h3 className="mt-3 text-2xl font-black">{t.operationalTitle}</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {opsCards.map((stat) => <article key={stat.label} className="rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.05] p-5"><p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-100/80">{stat.label}</p><strong className="mt-3 block text-2xl font-black text-white">{loading ? '…' : stat.value}</strong><p className="mt-2 text-xs text-emerald-100/70">{stat.hint}</p></article>)}
        </div>
      </div>

      <div className="rounded-3xl border border-purple-500/25 bg-black/40 p-6 shadow-2xl shadow-purple-950/30">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-300">{t.databaseEyebrow}</p>
        <h3 className="mt-3 text-2xl font-black">{t.databaseTitle}</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {dbChecks.map((check) => <article key={check.table} className={`rounded-3xl border p-5 ${check.status === 'ok' ? 'border-emerald-400/20 bg-emerald-400/[0.05]' : check.status === 'missing' ? 'border-yellow-400/30 bg-yellow-400/10' : 'border-red-400/30 bg-red-400/10'}`}><p className="text-xs font-black uppercase tracking-[0.2em] text-purple-100">{check.label}</p><h4 className="mt-2 text-xl font-black text-white">{t.statusLabels[check.status]}</h4><p className="mt-2 font-mono text-xs text-purple-100">{check.table}</p><p className="mt-2 text-xs text-purple-200">{check.count === null ? check.message : `${check.count} ${t.records}`}</p></article>)}
        </div>
      </div>
    </section>
  )
}

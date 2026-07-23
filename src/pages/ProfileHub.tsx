import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import SEO from '../components/SEO'
import FusionContentPanel from '../components/fusion/FusionContentPanel'
import FusionHero from '../components/fusion/FusionHero'
import FusionShell from '../components/fusion/FusionShell'
import { useHud } from '../lib/HudContext'
import { useLang } from '../lib/LangContext'
import { addWispXp, getRecentWispEvents, getWispProgress, getWispProgressForXp, usePresence, type WispEvent } from '../lib/realtimeCommunity'
import { isSupabaseConfigured, supabase } from '../services/supabaseClient'

const DAILY_MISSION_KEY = 'xethkioz.profile.daily-mission'

type ActivityRow = {
  id: string
  event_type: WispEvent['type']
  route: string
  points: number
  created_at: string
}

type Lang = 'es' | 'en'

const copy = {
  es: {
    accountEyebrow: 'ESTADO DE CUENTA',
    verifying: 'Verificando sesión',
    disconnected: 'Sesión no iniciada',
    verifyingText: 'Estamos verificando la sesión guardada en Supabase. No cierres la página todavía.',
    networkText: 'Tu sesión sigue preservada en este navegador. Hay una demora temporal para verificarla con Supabase, pero no te desconectamos por un fallo de red.',
    connectedText: 'La cuenta está conectada al ecosistema XETHKIOZ. Desde acá se centralizan perfil, XP, comunidad y futuras funciones.',
    disconnectedText: 'No hay sesión activa en este navegador. Ingresá nuevamente o reenviá la confirmación si la cuenta quedó pendiente.',
    status: 'Estado',
    email: 'Email',
    source: 'Origen',
    networkStatus: 'conectado · verificando red',
    notDetected: 'No detectado',
    noSession: 'sin sesión',
    statuses: { connected: 'conectado', disconnected: 'desconectado', loading: 'verificando' } as Record<string, string>,
    refresh: 'Revisar sesión',
    signOut: 'Cerrar sesión',
    signIn: 'Ingresar',
    resend: 'Reenviar confirmación',
    shortcutsEyebrow: 'ACCESOS EN VIVO',
    shortcutsTitle: 'Volvé al multiverso',
    shortcuts: [
      { to: '/nexus-city/room/xethkioz', label: 'Continuar aventura', detail: 'Plaza, Casa Wisp y Gran Sala', glyph: '▶' },
      { to: '/nexus-city/vip', label: 'Salas privadas', detail: 'Invitaciones y conversaciones VIP', glyph: '◆' },
      { to: '/community', label: 'Canal comunitario', detail: 'Chat, contactos y señales', glyph: '⌁' },
    ],
    progressionEyebrow: 'PROGRESIÓN WISP',
    level: 'Nivel',
    progressionText: 'Tus visitas, comentarios y misiones alimentan la energía del Wisp.',
    progressLabel: 'Progreso del Wisp',
    online: 'En línea',
    energy: 'Energía',
    activeDays: 'Días activos',
    dailyEyebrow: 'MISIÓN DIARIA',
    dailyTitle: 'Encender el núcleo',
    dailyText: 'Entrá al panel una vez por día y reclamá energía. Recompensa: 25 XP.',
    dailyDone: 'Misión completada',
    dailyClaim: 'Reclamar 25 XP',
    comment: 'Comentar',
    exploreNews: 'Explorar noticias',
    weeklyEyebrow: 'RUTA SEMANAL',
    weeklyTitle: 'Dale actividad a tu identidad',
    syncing: 'Sincronizando recorrido…',
    missions: 'misiones',
    completed: 'COMPLETADA',
    inProgress: 'EN CURSO',
    weeklyMissions: [
      { id: 'portals', label: 'Explorador de portales', detail: 'Visitá 3 portales distintos', target: 3, to: '/' },
      { id: 'chat', label: 'Voz del Nexus', detail: 'Participá una vez en el chat', target: 1, to: '/community' },
      { id: 'daily', label: 'Núcleo constante', detail: 'Reclamá la misión diaria', target: 1, to: '/profile' },
    ],
    recentEyebrow: 'ACTIVIDAD RECIENTE',
    recentTitle: 'Tu recorrido',
    latest: 'últimos',
    empty: 'Todavía no hay actividad. Explorá un portal, comentá o completá la misión diaria.',
    event: {
      chat: 'Comentaste en la comunidad',
      portal: 'Exploraste un portal',
      daily: 'Completaste la misión diaria',
      mission: 'Completaste una actividad',
      visit: 'Visitaste',
    },
  },
  en: {
    accountEyebrow: 'ACCOUNT STATUS',
    verifying: 'Verifying session',
    disconnected: 'No active session',
    verifyingText: 'We are checking the session stored in Supabase. Keep this page open for a moment.',
    networkText: 'Your session remains preserved in this browser. Supabase verification is temporarily delayed, but a network issue will not sign you out.',
    connectedText: 'Your account is connected to the XETHKIOZ ecosystem. Profile, XP, community and future features are centralized here.',
    disconnectedText: 'There is no active session in this browser. Sign in again or resend confirmation if the account is still pending.',
    status: 'Status',
    email: 'Email',
    source: 'Source',
    networkStatus: 'connected · checking network',
    notDetected: 'Not detected',
    noSession: 'no session',
    statuses: { connected: 'connected', disconnected: 'disconnected', loading: 'verifying' } as Record<string, string>,
    refresh: 'Check session',
    signOut: 'Sign out',
    signIn: 'Sign in',
    resend: 'Resend confirmation',
    shortcutsEyebrow: 'LIVE SHORTCUTS',
    shortcutsTitle: 'Return to the multiverse',
    shortcuts: [
      { to: '/nexus-city/room/xethkioz', label: 'Continue adventure', detail: 'Plaza, Wisp House and Grand Hall', glyph: '▶' },
      { to: '/nexus-city/vip', label: 'Private rooms', detail: 'Invitations and VIP conversations', glyph: '◆' },
      { to: '/community', label: 'Community channel', detail: 'Chat, contacts and signals', glyph: '⌁' },
    ],
    progressionEyebrow: 'WISP PROGRESSION',
    level: 'Level',
    progressionText: 'Your visits, comments and missions feed the Wisp’s energy.',
    progressLabel: 'Wisp progress',
    online: 'Online',
    energy: 'Energy',
    activeDays: 'Active days',
    dailyEyebrow: 'DAILY MISSION',
    dailyTitle: 'Power the core',
    dailyText: 'Open this panel once per day and claim energy. Reward: 25 XP.',
    dailyDone: 'Mission completed',
    dailyClaim: 'Claim 25 XP',
    comment: 'Comment',
    exploreNews: 'Explore news',
    weeklyEyebrow: 'WEEKLY ROUTE',
    weeklyTitle: 'Give your identity some activity',
    syncing: 'Syncing journey…',
    missions: 'missions',
    completed: 'COMPLETED',
    inProgress: 'IN PROGRESS',
    weeklyMissions: [
      { id: 'portals', label: 'Portal explorer', detail: 'Visit 3 different portals', target: 3, to: '/' },
      { id: 'chat', label: 'Voice of the Nexus', detail: 'Participate once in chat', target: 1, to: '/community' },
      { id: 'daily', label: 'Steady core', detail: 'Claim the daily mission', target: 1, to: '/profile' },
    ],
    recentEyebrow: 'RECENT ACTIVITY',
    recentTitle: 'Your journey',
    latest: 'latest',
    empty: 'There is no activity yet. Explore a portal, comment or complete the daily mission.',
    event: {
      chat: 'Commented in the community',
      portal: 'Explored a portal',
      daily: 'Completed the daily mission',
      mission: 'Completed an activity',
      visit: 'Visited',
    },
  },
} as const

function eventLabel(event: WispEvent, lang: Lang) {
  const t = copy[lang].event
  if (event.type === 'chat') return t.chat
  if (event.type === 'portal') return t.portal
  if (event.type === 'daily') return t.daily
  if (event.type === 'mission') return t.mission
  return `${t.visit} ${event.route}`
}

export default function ProfileHub() {
  const { t, lang } = useLang()
  const c = copy[lang]
  const { account, toggleAccount, refreshAccount } = useHud()
  const location = useLocation()
  const presence = usePresence(location.pathname, 'profile')
  const [progress, setProgress] = useState(getWispProgress)
  const [activity, setActivity] = useState<WispEvent[]>(getRecentWispEvents)
  const [syncedActivity, setSyncedActivity] = useState<WispEvent[]>([])
  const [activitySyncing, setActivitySyncing] = useState(false)
  const today = new Date().toISOString().slice(0, 10)
  const [dailyDone, setDailyDone] = useState(() => window.localStorage.getItem(DAILY_MISSION_KEY) === today)
  const isConnected = account.status === 'connected'
  const isLoading = account.status === 'loading'
  const combinedActivity = useMemo(() => {
    const unique = new Map<string, WispEvent>()
    for (const event of [...syncedActivity, ...activity]) unique.set(event.id, event)
    return [...unique.values()].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 40)
  }, [activity, syncedActivity])
  const syncedXp = syncedActivity.reduce((total, event) => total + event.points, 0)
  const effectiveProgress = getWispProgressForXp(Math.max(progress.xp, syncedXp))
  const uniquePortalVisits = new Set(combinedActivity.filter((event) => event.type === 'portal').map((event) => event.route.split('#')[0])).size
  const chatCount = combinedActivity.filter((event) => event.type === 'chat').length
  const dailyCount = combinedActivity.filter((event) => event.type === 'daily').length
  const activeDays = new Set(combinedActivity.map((event) => event.created_at.slice(0, 10))).size
  const weeklyMissions = c.weeklyMissions.map((mission) => ({
    ...mission,
    progress: mission.id === 'portals' ? uniquePortalVisits : mission.id === 'chat' ? chatCount : dailyCount,
  }))
  const completedWeekly = weeklyMissions.filter((mission) => mission.progress >= mission.target).length
  const locale = lang === 'es' ? 'es-AR' : 'en-US'

  useEffect(() => {
    const update = () => {
      setProgress(getWispProgress())
      setActivity(getRecentWispEvents())
    }
    window.addEventListener('xethkioz:wisp-xp', update)
    return () => window.removeEventListener('xethkioz:wisp-xp', update)
  }, [])

  useEffect(() => {
    if (!isConnected || !account.userId || !isSupabaseConfigured) {
      setSyncedActivity([])
      setActivitySyncing(false)
      return undefined
    }

    let active = true
    setActivitySyncing(true)
    supabase
      .from('user_activity_events')
      .select('id, event_type, route, points, created_at')
      .eq('user_id', account.userId)
      .order('created_at', { ascending: false })
      .limit(200)
      .then(({ data, error }) => {
        if (!active) return
        if (!error && data) {
          setSyncedActivity((data as ActivityRow[]).map((row) => ({
            id: row.id,
            type: row.event_type,
            route: row.route,
            points: row.points,
            created_at: row.created_at,
          })))
        }
        setActivitySyncing(false)
      })

    return () => { active = false }
  }, [account.userId, isConnected])

  function claimDailyMission() {
    if (dailyDone) return
    window.localStorage.setItem(DAILY_MISSION_KEY, today)
    addWispXp(25, 'daily', '/profile')
    setDailyDone(true)
  }

  const accountHeading = isLoading ? c.verifying : isConnected ? account.name : c.disconnected
  const accountDescription = isLoading ? c.verifyingText : isConnected ? (account.issue === 'network' ? c.networkText : c.connectedText) : c.disconnectedText
  const accountStatus = account.issue === 'network' ? c.networkStatus : c.statuses[account.status] ?? account.status

  return (
    <FusionShell tone="gaming">
      <SEO title={t.v7.functionality.profileEngine} description={t.v7.functionality.profilePreview} url="/profile" />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <FusionHero tone="gaming" eyebrow={t.v7.functionality.communityEngine} heading={t.v7.functionality.profileEngine} description={t.v7.functionality.profileDescription} />

        <section className="mt-8 rounded-[2rem] border border-orange-400/25 bg-black/55 p-6 text-white shadow-[0_0_35px_rgba(249,115,22,.12)] md:p-8" aria-labelledby="account-status-title" aria-busy={isLoading}>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-orange-300">{c.accountEyebrow}</p>
          <h2 id="account-status-title" className="mt-3 text-3xl font-black uppercase tracking-[0.08em] md:text-4xl">{accountHeading}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300" role="status" aria-live="polite">{accountDescription}</p>

          <div className="mt-5 grid gap-3 text-sm md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"><span className="font-mono text-[10px] uppercase tracking-[0.2em] text-violet-200">{c.status}</span><strong className="mt-2 block uppercase">{accountStatus}</strong></div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"><span className="font-mono text-[10px] uppercase tracking-[0.2em] text-violet-200">{c.email}</span><strong className="mt-2 block break-all">{account.email ?? c.notDetected}</strong></div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"><span className="font-mono text-[10px] uppercase tracking-[0.2em] text-violet-200">{c.source}</span><strong className="mt-2 block uppercase">{account.source ?? c.noSession}</strong></div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 font-mono text-xs font-black uppercase tracking-[0.16em]">
            <button type="button" onClick={() => void refreshAccount()} disabled={isLoading} className="rounded-full border border-neon/40 px-4 py-3 text-neon transition hover:bg-neon/10 disabled:cursor-wait disabled:opacity-60">{c.refresh}</button>
            {isConnected ? <button type="button" onClick={toggleAccount} className="rounded-full border border-red-400/40 px-4 py-3 text-red-200 transition hover:bg-red-500/10">{c.signOut}</button> : <Link to="/account?mode=signin" className="rounded-full bg-orange px-4 py-3 text-black transition hover:shadow-glow-action">{c.signIn}</Link>}
            {!isConnected ? <Link to="/confirm-email" className="rounded-full border border-violet-400/40 px-4 py-3 text-violet-100 transition hover:bg-violet-500/10">{c.resend}</Link> : null}
          </div>
        </section>

        {isConnected ? <section className="mt-6 rounded-[2rem] border border-orange-300/20 bg-[radial-gradient(circle_at_90%_0%,rgba(249,115,22,.14),transparent_35%),rgba(0,0,0,.48)] p-6 text-white md:p-8" aria-labelledby="profile-shortcuts-title">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-orange-300">{c.shortcutsEyebrow}</p>
          <h2 id="profile-shortcuts-title" className="mt-2 text-2xl font-black uppercase">{c.shortcutsTitle}</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {c.shortcuts.map((shortcut) => <Link key={shortcut.to} to={shortcut.to} className="group grid grid-cols-[auto_1fr] items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:-translate-y-0.5 hover:border-orange-300/40 hover:bg-orange-400/[0.07]">
              <span className="grid h-11 w-11 place-items-center rounded-xl border border-orange-300/25 bg-orange-400/10 text-xl text-orange-200" aria-hidden="true">{shortcut.glyph}</span>
              <span><strong className="block text-sm">{shortcut.label}</strong><small className="mt-1 block text-xs leading-5 text-slate-400">{shortcut.detail}</small></span>
            </Link>)}
          </div>
        </section> : null}

        {isConnected ? <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
          <section className="overflow-hidden rounded-[2rem] border border-violet-400/25 bg-[radial-gradient(circle_at_85%_0%,rgba(139,92,246,.24),transparent_34%),rgba(0,0,0,.58)] p-6 text-white md:p-8" aria-labelledby="wisp-progression-title">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-violet-200">{c.progressionEyebrow}</p><h2 id="wisp-progression-title" className="mt-3 text-3xl font-black uppercase">{c.level} {effectiveProgress.level} · {effectiveProgress.name}</h2><p className="mt-2 text-sm text-slate-300">{c.progressionText}</p></div><strong className="font-mono text-2xl text-orange-300">{effectiveProgress.xp} XP</strong></div>
            <div className="mt-6 h-3 overflow-hidden rounded-full border border-white/10 bg-black/60" role="progressbar" aria-label={c.progressLabel} aria-valuenow={effectiveProgress.energy} aria-valuemin={0} aria-valuemax={100}><div className="h-full rounded-full bg-[linear-gradient(90deg,#8B5CF6,#FF6B1A,#32FF8A)] shadow-[0_0_18px_rgba(50,255,138,.65)] transition-[width] duration-700" style={{ width: `${effectiveProgress.energy}%` }} /></div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3"><div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"><span className="font-mono text-[9px] uppercase tracking-[0.18em] text-slate-400">{c.online}</span><strong className="mt-2 block text-2xl text-green-300">{presence.onlineTotal}</strong></div><div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"><span className="font-mono text-[9px] uppercase tracking-[0.18em] text-slate-400">{c.energy}</span><strong className="mt-2 block text-2xl text-orange-300">{effectiveProgress.energy}%</strong></div><div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"><span className="font-mono text-[9px] uppercase tracking-[0.18em] text-slate-400">{c.activeDays}</span><strong className="mt-2 block text-2xl text-violet-200">{activeDays}</strong></div></div>
          </section>

          <section className="rounded-[2rem] border border-green-400/25 bg-green-400/[0.06] p-6 text-white md:p-8" aria-labelledby="daily-mission-title"><p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-green-300">{c.dailyEyebrow}</p><h2 id="daily-mission-title" className="mt-3 text-2xl font-black uppercase">{c.dailyTitle}</h2><p className="mt-3 text-sm leading-6 text-slate-300">{c.dailyText}</p><button type="button" onClick={claimDailyMission} disabled={dailyDone} className="mt-6 w-full rounded-full bg-green-300 px-5 py-3 font-mono text-xs font-black uppercase tracking-[0.16em] text-black transition hover:shadow-[0_0_22px_rgba(50,255,138,.4)] disabled:bg-white/10 disabled:text-slate-400">{dailyDone ? c.dailyDone : c.dailyClaim}</button><div className="mt-5 grid grid-cols-2 gap-3 text-center text-xs"><Link to="/community" className="rounded-2xl border border-white/10 px-3 py-3 text-violet-100 hover:border-violet-300">{c.comment}</Link><Link to="/news" className="rounded-2xl border border-white/10 px-3 py-3 text-orange-100 hover:border-orange-300">{c.exploreNews}</Link></div></section>
        </div> : null}

        {isConnected ? <section className="mt-6 rounded-[2rem] border border-cyan-300/20 bg-[radial-gradient(circle_at_10%_0%,rgba(34,211,238,.13),transparent_35%),rgba(0,0,0,.52)] p-6 text-white md:p-8" aria-labelledby="weekly-route-title"><div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[0.24em] text-cyan-200">{c.weeklyEyebrow}</p><h2 id="weekly-route-title" className="mt-2 text-2xl font-black uppercase">{c.weeklyTitle}</h2></div><span className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-400" role="status" aria-live="polite">{activitySyncing ? c.syncing : `${completedWeekly}/3 ${c.missions}`}</span></div><div className="mt-5 grid gap-3 md:grid-cols-3">{weeklyMissions.map((mission) => { const completed = mission.progress >= mission.target; return <Link key={mission.id} to={mission.to} className={`rounded-2xl border p-4 transition hover:-translate-y-0.5 ${completed ? 'border-green-300/35 bg-green-400/[0.08]' : 'border-white/10 bg-white/[0.035] hover:border-cyan-300/35'}`}><div className="flex items-center justify-between gap-3"><span className="font-mono text-[9px] uppercase tracking-[0.16em] text-slate-400">{completed ? c.completed : c.inProgress}</span><strong className={completed ? 'text-green-300' : 'text-cyan-200'}>{Math.min(mission.progress, mission.target)}/{mission.target}</strong></div><h3 className="mt-3 font-black">{mission.label}</h3><p className="mt-2 text-xs leading-5 text-slate-400">{mission.detail}</p></Link> })}</div></section> : null}

        {isConnected ? <section className="mt-6 rounded-[2rem] border border-white/10 bg-black/45 p-6 text-white md:p-8" aria-labelledby="recent-activity-title"><div className="flex items-center justify-between gap-4"><div><p className="font-mono text-[10px] uppercase tracking-[0.24em] text-orange-300">{c.recentEyebrow}</p><h2 id="recent-activity-title" className="mt-2 text-2xl font-black uppercase">{c.recentTitle}</h2></div><span className="rounded-full border border-white/10 px-3 py-2 font-mono text-[10px] text-slate-400">{c.latest} {combinedActivity.length}</span></div>{combinedActivity.length ? <ol className="mt-5 grid gap-3 md:grid-cols-2">{combinedActivity.slice(0, 12).map((event) => <li key={event.id} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-4"><div><strong className="block text-sm">{eventLabel(event, lang)}</strong><time className="mt-1 block font-mono text-[9px] uppercase tracking-[0.15em] text-slate-500" dateTime={event.created_at}>{new Date(event.created_at).toLocaleString(locale)}</time></div><span className="shrink-0 font-mono text-sm font-black text-green-300">+{event.points}</span></li>)}</ol> : <p className="mt-5 rounded-2xl border border-dashed border-white/10 p-5 text-sm text-slate-400" role="status">{c.empty}</p>}</section> : null}
      </main>
      <FusionContentPanel tone="gaming" mode="profile" />
    </FusionShell>
  )
}

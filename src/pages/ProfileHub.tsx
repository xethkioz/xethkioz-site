import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import SEO from '../components/SEO'
import FusionContentPanel from '../components/fusion/FusionContentPanel'
import FusionHero from '../components/fusion/FusionHero'
import FusionShell from '../components/fusion/FusionShell'
import { useHud } from '../lib/HudContext'
import { useLang } from '../lib/LangContext'
import { addWispXp, getRecentWispEvents, getWispProgress, usePresence, type WispEvent } from '../lib/realtimeCommunity'

const DAILY_MISSION_KEY = 'xethkioz.profile.daily-mission'

function eventLabel(event: WispEvent) {
  if (event.type === 'chat') return 'Comentaste en la comunidad'
  if (event.type === 'portal') return 'Exploraste un portal'
  if (event.type === 'daily') return 'Completaste la misión diaria'
  if (event.type === 'mission') return 'Completaste una actividad'
  return `Visitaste ${event.route}`
}

export default function ProfileHub() {
  const { t } = useLang()
  const { account, toggleAccount, refreshAccount } = useHud()
  const location = useLocation()
  const presence = usePresence(location.pathname, 'profile')
  const [progress, setProgress] = useState(getWispProgress)
  const [activity, setActivity] = useState<WispEvent[]>(getRecentWispEvents)
  const today = new Date().toISOString().slice(0, 10)
  const [dailyDone, setDailyDone] = useState(() => window.localStorage.getItem(DAILY_MISSION_KEY) === today)
  const isConnected = account.status === 'connected'
  const isLoading = account.status === 'loading'

  useEffect(() => {
    const update = () => {
      setProgress(getWispProgress())
      setActivity(getRecentWispEvents())
    }
    window.addEventListener('xethkioz:wisp-xp', update)
    return () => window.removeEventListener('xethkioz:wisp-xp', update)
  }, [])

  function claimDailyMission() {
    if (dailyDone) return
    window.localStorage.setItem(DAILY_MISSION_KEY, today)
    addWispXp(25, 'daily', '/profile')
    setDailyDone(true)
  }

  return (
    <FusionShell tone="gaming">
      <SEO title={t.v7.functionality.profileEngine} description={t.v7.functionality.profilePreview} url="/profile" />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <FusionHero tone="gaming" eyebrow={t.v7.functionality.communityEngine} heading={t.v7.functionality.profileEngine} description={t.v7.functionality.profileDescription} />

        <section className="mt-8 rounded-[2rem] border border-orange-400/25 bg-black/55 p-6 text-white shadow-[0_0_35px_rgba(249,115,22,.12)] md:p-8">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-orange-300">ACCOUNT_STATUS</p>
          <h2 className="mt-3 text-3xl font-black uppercase tracking-[0.08em] md:text-4xl">
            {isLoading ? 'Verificando sesión' : isConnected ? account.name : 'Sesión no iniciada'}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            {isLoading
              ? 'Estamos verificando la sesión guardada en Supabase. No cierres la página todavía.'
              : isConnected
                ? 'La cuenta está conectada al ecosistema XETHKIOZ. Desde acá se centraliza perfil, XP, comunidad y futuras funciones.'
                : 'No hay sesión activa en este navegador. Ingresá nuevamente o reenviá la confirmación si la cuenta quedó pendiente.'}
          </p>

          <div className="mt-5 grid gap-3 text-sm md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-violet-200">Estado</span>
              <strong className="mt-2 block uppercase">{account.status}</strong>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-violet-200">Email</span>
              <strong className="mt-2 block break-all">{account.email ?? 'No detectado'}</strong>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-violet-200">Origen</span>
              <strong className="mt-2 block uppercase">{account.source ?? 'sin sesión'}</strong>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 font-mono text-xs font-black uppercase tracking-[0.16em]">
            <button type="button" onClick={() => void refreshAccount()} className="rounded-full border border-neon/40 px-4 py-3 text-neon transition hover:bg-neon/10">Revisar sesión</button>
            {isConnected ? (
              <button type="button" onClick={toggleAccount} className="rounded-full border border-red-400/40 px-4 py-3 text-red-200 transition hover:bg-red-500/10">Cerrar sesión</button>
            ) : (
              <Link to="/account?mode=signin" className="rounded-full bg-orange px-4 py-3 text-black transition hover:shadow-glow-action">Ingresar</Link>
            )}
            {!isConnected ? <Link to="/confirm-email" className="rounded-full border border-violet-400/40 px-4 py-3 text-violet-100 transition hover:bg-violet-500/10">Reenviar confirmación</Link> : null}
          </div>
        </section>

        {isConnected ? (
          <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
            <section className="overflow-hidden rounded-[2rem] border border-violet-400/25 bg-[radial-gradient(circle_at_85%_0%,rgba(139,92,246,.24),transparent_34%),rgba(0,0,0,.58)] p-6 text-white md:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-violet-200">WISP_PROGRESSION</p>
                  <h2 className="mt-3 text-3xl font-black uppercase">Nivel {progress.level} · {progress.name}</h2>
                  <p className="mt-2 text-sm text-slate-300">Tus visitas, comentarios y misiones alimentan la energía del Wisp.</p>
                </div>
                <strong className="font-mono text-2xl text-orange-300">{progress.xp} XP</strong>
              </div>
              <div className="mt-6 h-3 overflow-hidden rounded-full border border-white/10 bg-black/60" role="progressbar" aria-label="Progreso del Wisp" aria-valuenow={progress.energy} aria-valuemin={0} aria-valuemax={100}>
                <div className="h-full rounded-full bg-[linear-gradient(90deg,#8B5CF6,#FF6B1A,#32FF8A)] shadow-[0_0_18px_rgba(50,255,138,.65)] transition-[width] duration-700" style={{ width: `${progress.energy}%` }} />
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"><span className="font-mono text-[9px] uppercase tracking-[0.18em] text-slate-400">Online</span><strong className="mt-2 block text-2xl text-green-300">{presence.onlineTotal}</strong></div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"><span className="font-mono text-[9px] uppercase tracking-[0.18em] text-slate-400">Energía</span><strong className="mt-2 block text-2xl text-orange-300">{progress.energy}%</strong></div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"><span className="font-mono text-[9px] uppercase tracking-[0.18em] text-slate-400">Actividad</span><strong className="mt-2 block text-2xl text-violet-200">{activity.length}</strong></div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-green-400/25 bg-green-400/[0.06] p-6 text-white md:p-8">
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-green-300">MISIÓN DIARIA</p>
              <h2 className="mt-3 text-2xl font-black uppercase">Encender el núcleo</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">Entrá al panel una vez por día y reclamá energía. Recompensa: 25 XP.</p>
              <button type="button" onClick={claimDailyMission} disabled={dailyDone} className="mt-6 w-full rounded-full bg-green-300 px-5 py-3 font-mono text-xs font-black uppercase tracking-[0.16em] text-black transition hover:shadow-[0_0_22px_rgba(50,255,138,.4)] disabled:bg-white/10 disabled:text-slate-400">{dailyDone ? 'Misión completada' : 'Reclamar 25 XP'}</button>
              <div className="mt-5 grid grid-cols-2 gap-3 text-center text-xs">
                <Link to="/community" className="rounded-2xl border border-white/10 px-3 py-3 text-violet-100 hover:border-violet-300">Comentar</Link>
                <Link to="/news" className="rounded-2xl border border-white/10 px-3 py-3 text-orange-100 hover:border-orange-300">Explorar noticias</Link>
              </div>
            </section>
          </div>
        ) : null}

        {isConnected ? (
          <section className="mt-6 rounded-[2rem] border border-white/10 bg-black/45 p-6 text-white md:p-8">
            <div className="flex items-center justify-between gap-4"><div><p className="font-mono text-[10px] uppercase tracking-[0.24em] text-orange-300">ACTIVIDAD RECIENTE</p><h2 className="mt-2 text-2xl font-black uppercase">Tu recorrido</h2></div><span className="rounded-full border border-white/10 px-3 py-2 font-mono text-[10px] text-slate-400">últimos {activity.length}</span></div>
            {activity.length ? <ol className="mt-5 grid gap-3 md:grid-cols-2">{activity.map((event) => <li key={event.id} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-4"><div><strong className="block text-sm">{eventLabel(event)}</strong><span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.15em] text-slate-500">{new Date(event.created_at).toLocaleString('es-AR')}</span></div><span className="shrink-0 font-mono text-sm font-black text-green-300">+{event.points}</span></li>)}</ol> : <p className="mt-5 rounded-2xl border border-dashed border-white/10 p-5 text-sm text-slate-400">Todavía no hay actividad. Explorá un portal, comentá o completá la misión diaria.</p>}
          </section>
        ) : null}
      </main>
      <FusionContentPanel tone="gaming" mode="profile" />
    </FusionShell>
  )
}

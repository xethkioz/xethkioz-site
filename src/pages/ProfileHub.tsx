import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import FusionContentPanel from '../components/fusion/FusionContentPanel'
import FusionHero from '../components/fusion/FusionHero'
import FusionShell from '../components/fusion/FusionShell'
import { useHud } from '../lib/HudContext'
import { useLang } from '../lib/LangContext'

export default function ProfileHub() {
  const { t } = useLang()
  const { account, toggleAccount, refreshAccount } = useHud()
  const isConnected = account.status === 'connected'
  const isLoading = account.status === 'loading'

  return (
    <FusionShell tone="gaming" backLabel={t.v7.backCore} label={t.v7.functionality.profileEngine}>
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
      </main>
      <FusionContentPanel tone="gaming" mode="profile" />
    </FusionShell>
  )
}

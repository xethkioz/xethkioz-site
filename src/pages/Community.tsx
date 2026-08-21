import SEO from '../components/SEO'
import FusionHero from '../components/fusion/FusionHero'
import FusionShell from '../components/fusion/FusionShell'
import { Link } from 'react-router-dom'
import { useLang } from '../lib/LangContext'

const copy = {
  es: {
    eyebrow: 'COMUNIDAD EN VIVO',
    title: 'Elegí cómo participar',
    chatTitle: 'Nexus Chat',
    chatText: 'Conversaciones públicas y privadas con historial móvil de 24 horas.',
    chatAction: 'Abrir chat',
    profileTitle: 'Perfil y progreso',
    profileText: 'Consultá tu XP, misiones, actividad reciente y accesos personales.',
    profileAction: 'Ver mi perfil',
    nexusTitle: 'Nexus City',
    nexusText: 'Explorá la plaza, las cápsulas de usuario y las salas de la comunidad.',
    nexusAction: 'Entrar a Nexus City',
    safety: 'La identidad XETHKIOZ está reservada a la cuenta propietaria. El chat conserva sólo las últimas 24 horas y Nexus permite bloquear contactos no deseados.',
  },
  en: {
    eyebrow: 'LIVE COMMUNITY',
    title: 'Choose how to participate',
    chatTitle: 'Nexus Chat',
    chatText: 'Public and private conversations with a rolling 24-hour history.',
    chatAction: 'Open chat',
    profileTitle: 'Profile and progress',
    profileText: 'Check your XP, missions, recent activity and personal shortcuts.',
    profileAction: 'View my profile',
    nexusTitle: 'Nexus City',
    nexusText: 'Explore the plaza, user capsules and community rooms.',
    nexusAction: 'Enter Nexus City',
    safety: 'The XETHKIOZ identity is reserved for the owner account. Chat keeps only the latest 24 hours and Nexus lets you block unwanted contacts.',
  },
} as const

export default function Community() {
  const { t, lang, localizePath } = useLang()
  const c = copy[lang]

  const openChat = () => {
    window.dispatchEvent(new CustomEvent('xethkioz:nexus-chat-open', { detail: { room: 'general' } }))
  }

  return (
    <FusionShell tone="fun">
      <SEO title={t.v7.functionality.communityEngine} description={t.v7.functionality.communityDescription} url="/community" />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <FusionHero tone="fun" eyebrow={t.v7.functionality.progressSystem} heading={t.v7.functionality.communityEngine} description={t.v7.functionality.communityDescription} />
        <section className="mt-8 rounded-[2rem] border border-violet-400/25 bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,.2),transparent_45%),rgba(0,0,0,.5)] p-6 text-white md:p-8" aria-labelledby="community-actions-title">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-violet-200">{c.eyebrow}</p>
          <h2 id="community-actions-title" className="mt-3 text-2xl font-black uppercase tracking-[0.06em] md:text-3xl">{c.title}</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <article className="flex flex-col rounded-2xl border border-violet-300/25 bg-violet-400/[0.07] p-5">
              <span className="text-2xl" aria-hidden="true">⌁</span>
              <h3 className="mt-4 text-xl font-black">{c.chatTitle}</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-slate-300">{c.chatText}</p>
              <button type="button" onClick={openChat} className="mt-5 rounded-full bg-violet-300 px-4 py-3 font-mono text-xs font-black uppercase tracking-[0.14em] text-black transition hover:shadow-[0_0_24px_rgba(196,181,253,.38)]">{c.chatAction}</button>
            </article>
            <article className="flex flex-col rounded-2xl border border-orange-300/25 bg-orange-400/[0.07] p-5">
              <span className="text-2xl" aria-hidden="true">◆</span>
              <h3 className="mt-4 text-xl font-black">{c.profileTitle}</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-slate-300">{c.profileText}</p>
              <Link to={localizePath('/profile')} className="mt-5 rounded-full border border-orange-300/45 px-4 py-3 text-center font-mono text-xs font-black uppercase tracking-[0.14em] text-orange-100 transition hover:bg-orange-400/10">{c.profileAction}</Link>
            </article>
            <article className="flex flex-col rounded-2xl border border-cyan-300/25 bg-cyan-400/[0.07] p-5">
              <span className="text-2xl" aria-hidden="true">◈</span>
              <h3 className="mt-4 text-xl font-black">{c.nexusTitle}</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-slate-300">{c.nexusText}</p>
              <Link to={localizePath('/nexus-city')} className="mt-5 rounded-full border border-cyan-300/45 px-4 py-3 text-center font-mono text-xs font-black uppercase tracking-[0.14em] text-cyan-100 transition hover:bg-cyan-400/10">{c.nexusAction}</Link>
            </article>
          </div>
          <p className="mt-5 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-xs leading-5 text-slate-400">{c.safety}</p>
        </section>
      </main>
    </FusionShell>
  )
}

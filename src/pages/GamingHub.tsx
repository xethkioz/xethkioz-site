import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { useLang } from '../lib/LangContext'

export default function GamingHub() {
  const { t } = useLang()
  const portal = t.v7.portals.games
  return (
    <div className="min-h-screen bg-[#06030a] text-purple-50">
      <SEO title={portal.title} description={portal.seoDescription} url="/gaming" />
      <header className="sticky top-0 z-40 border-b border-neon/20 bg-black/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="font-display text-sm font-black uppercase tracking-[0.22em] text-neon hover:text-white">{t.v7.backCore}</Link>
          <span className="rounded-full border border-neon/30 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-neon">{portal.label}</span>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <section className="rounded-[2rem] border border-neon/25 bg-black/55 p-7 shadow-[0_0_70px_rgba(138,46,255,.16)]">
          <p className="section-eyebrow text-neon">{portal.eyebrow}</p>
          <h1 className="mt-4 font-display text-4xl font-black md:text-6xl">{portal.heading}</h1>
          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-purple-100/75 md:text-base">{portal.description}</p>
        </section>
        <section className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
          {portal.sections.map(([title, text]) => (
            <article key={title} className="rounded-3xl border border-neon/20 bg-black/45 p-6">
              <h2 className="font-display text-2xl font-black text-neon">{title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-purple-100/70">{text}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  )
}

import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { useLang } from '../lib/LangContext'

export default function GreenNode() {
  const { t } = useLang()
  const portal = t.v7.portals.green
  return (
    <div className="green-node-shell min-h-screen bg-black text-green-100">
      <SEO title={portal.title} description={portal.seoDescription} url="/green-node" />
      <header className="sticky top-0 z-40 border-b border-green-400/20 bg-black/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="font-mono text-sm font-black uppercase tracking-[0.24em] text-green-300 hover:text-green-100">{t.v7.backCore}</Link>
          <span className="rounded-full border border-green-400/30 bg-green-400/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-green-300">{portal.label}</span>
        </div>
      </header>
      <main className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_10%,rgba(50,255,138,.18),transparent_30%)]" />
        <section className="rounded-[2rem] border border-green-400/25 bg-black/70 p-7 shadow-[0_0_80px_rgba(50,255,138,.14)]">
          <p className="font-mono text-xs uppercase tracking-[0.45em] text-green-300">{portal.eyebrow}</p>
          <h1 className="mt-4 font-display text-4xl font-black text-green-100 md:text-6xl drop-shadow-[0_0_18px_rgba(50,255,138,.55)]">{portal.heading}</h1>
          <p className="mt-5 max-w-3xl font-mono text-sm leading-relaxed text-green-100/75 md:text-base">{portal.description}</p>
        </section>
        <section className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          {portal.levels.map(([level, title, text]) => (
            <article key={level} className="rounded-3xl border border-green-400/20 bg-black/65 p-6 shadow-[0_0_35px_rgba(50,255,138,.08)]">
              <p className="font-mono text-xs font-black uppercase tracking-[0.26em] text-green-400">{level}</p>
              <h2 className="mt-3 font-display text-2xl font-black text-green-100">{title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-green-100/70">{text}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  )
}

import { useState } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { useLang } from '../lib/LangContext'
import { getCuratedExternalNews } from '../services/news/curatedExternalNews'
import { formatPublicNewsDate } from '../services/news/publicNewsService'

type SectionBlock = { id: string; title: string; text: string }

const content: Record<'es' | 'en', { title: string; description: string; back: string; news: string; community: string; open: string; articleTitle: string; read: string; blocks: SectionBlock[] }> = {
  es: {
    title: 'Juegos',
    description: 'Radar gamer real con lanzamientos, industria, precios, plataformas y lecturas ampliadas.',
    back: 'Volver',
    news: 'Noticias',
    community: 'Comunidad',
    open: 'Abrir sección',
    articleTitle: 'Radar gamer // noticias reales',
    read: 'Leer completa',
    blocks: [
      { id: 'radar', title: 'Radar gamer', text: 'Noticias rápidas, lanzamientos, MMORPG, esports y juegos para stream.' },
      { id: 'guides', title: 'Guías y builds', text: 'Espacio preparado para guías, tops, comparativas y builds por comunidad.' },
      { id: 'asia', title: 'Asia Gaming', text: 'Señales de Corea, Japón, China y SEA para LATAM antes de que exploten.' },
    ],
  },
  en: {
    title: 'Games',
    description: 'Real gaming radar with releases, industry moves, prices, platforms and expanded reading.',
    back: 'Back',
    news: 'News',
    community: 'Community',
    open: 'Open section',
    articleTitle: 'Gaming radar // real news',
    read: 'Read full article',
    blocks: [
      { id: 'radar', title: 'Gaming radar', text: 'Quick news, releases, MMORPGs, esports and stream-ready games.' },
      { id: 'guides', title: 'Guides and builds', text: 'Prepared space for guides, tops, comparisons and community builds.' },
      { id: 'asia', title: 'Asia Gaming', text: 'Signals from Korea, Japan, China and SEA for LATAM before they explode.' },
    ],
  },
}

export default function GamingHub() {
  const { lang, setLang } = useLang()
  const t = content[lang]
  const [activeId, setActiveId] = useState(t.blocks[0].id)
  const active = t.blocks.find((block) => block.id === activeId) ?? t.blocks[0]
  const articles = getCuratedExternalNews('gaming')

  return (
    <>
      <SEO title={`${t.title} · XETHKIOZ`} description={t.description} url="/gaming" />
      <section className="xk-page xk-pixel px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-[2rem] border-4 border-red-500/70 bg-black/65 p-6 shadow-[0_0_28px_rgba(239,68,68,.22)] md:p-10">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#32FF8A]">PLAYER_ONE_READY</p>
              <button onClick={() => setLang(lang === 'es' ? 'en' : 'es')} className="rounded-full border border-[#32FF8A]/40 px-4 py-2 font-mono text-xs font-black uppercase tracking-[0.18em] text-[#32FF8A]">{lang.toUpperCase()}</button>
            </div>
            <h1 className="mt-4 text-4xl font-black uppercase tracking-[0.12em] text-white md:text-6xl">{t.title}</h1>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-gray-300 md:text-base">{t.description}</p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {t.blocks.map((block) => (
              <button key={block.id} type="button" onClick={() => setActiveId(block.id)} className={`xk-card rounded-none border-4 p-5 text-left shadow-[8px_8px_0_rgba(50,255,138,.28)] transition ${active.id === block.id ? 'border-[#32FF8A]/80 bg-[#08130c]' : 'border-[#8B5CF6]/50 bg-black/55 hover:border-red-400/80'}`}>
                <h2 className="text-xl font-black uppercase text-white">{block.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-gray-300">{block.text}</p>
                <span className="mt-4 inline-flex font-mono text-[10px] uppercase tracking-[0.18em] text-[#32FF8A]">{t.open}</span>
              </button>
            ))}
          </div>

          <section className="mt-8 rounded-[2rem] border border-[#32FF8A]/30 bg-black/65 p-5 md:p-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#32FF8A]/70">{t.articleTitle}</p>
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {articles.map((article) => (
                <article key={article.slug} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:-translate-y-1 hover:border-orange-300/40">
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-red-300">{formatPublicNewsDate(article.published_at ?? article.created_at, lang)}</span>
                  <h3 className="mt-3 text-lg font-black uppercase text-white">{article.title}</h3>
                  <p className="mt-3 text-xs leading-relaxed text-gray-300">{article.summary}</p>
                  <Link to={`/news/${article.slug}`} className="mt-5 inline-flex rounded-full border border-orange-400/40 px-4 py-2 font-mono text-[10px] font-black uppercase tracking-[0.16em] text-orange-100 hover:bg-orange-500/10">{t.read}</Link>
                </article>
              ))}
            </div>
          </section>

          <div className="mt-8 flex flex-wrap gap-3 font-mono text-xs uppercase tracking-[0.18em]">
            <Link to="/" className="rounded-full border border-white/10 px-4 py-3 text-gray-300 hover:border-[#32FF8A] hover:text-[#32FF8A]">{t.back}</Link>
            <Link to="/news" className="rounded-full border border-red-500/40 px-4 py-3 text-red-200 hover:bg-red-500/10">{t.news}</Link>
            <Link to="/community" className="rounded-full border border-[#8B5CF6]/40 px-4 py-3 text-violet-200 hover:bg-[#8B5CF6]/10">{t.community}</Link>
          </div>
        </div>
      </section>
    </>
  )
}

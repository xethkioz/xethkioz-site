import { useState } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { useLang } from '../lib/LangContext'
import { getCuratedExternalNews } from '../services/news/curatedExternalNews'
import { formatPublicNewsDate } from '../services/news/publicNewsService'

type SectionBlock = { id: string; title: string; text: string }

const content: Record<'es' | 'en', { title: string; description: string; back: string; badge: string; open: string; articleTitle: string; read: string; blocks: SectionBlock[] }> = {
  es: {
    title: 'Memes',
    description: 'Humor, clips, rarezas y cultura de internet con fuente visible.',
    back: 'Volver antes de que se ponga serio',
    badge: 'meme_radar.exe activo',
    open: 'Abrir sección',
    articleTitle: 'Memes // radar cultural',
    read: 'Leer completa',
    blocks: [
      { id: 'memes', title: 'Memes rápidos', text: 'Formatos de humor, reacciones y chistes de lectura rápida.' },
      { id: 'clips', title: 'Clips y videos', text: 'Momentos cortos para TikTok, Reels, Shorts y Threads.' },
      { id: 'legends', title: 'Leyendas y rarezas', text: 'Curiosidades, referencias y cultura digital liviana.' },
    ],
  },
  en: {
    title: 'Memes',
    description: 'Humor, clips, oddities and internet culture with visible sources.',
    back: 'Back before it gets serious',
    badge: 'meme_radar.exe active',
    open: 'Open section',
    articleTitle: 'Memes // culture radar',
    read: 'Read full article',
    blocks: [
      { id: 'memes', title: 'Quick memes', text: 'Humor formats, reactions and fast-reading jokes.' },
      { id: 'clips', title: 'Clips and videos', text: 'Short moments for TikTok, Reels, Shorts and Threads.' },
      { id: 'legends', title: 'Legends and oddities', text: 'Curiosities, references and light digital culture.' },
    ],
  },
}

export default function FunPortal() {
  const { lang, setLang } = useLang()
  const t = content[lang]
  const [activeId, setActiveId] = useState(t.blocks[0].id)
  const active = t.blocks.find((item) => item.id === activeId) ?? t.blocks[0]
  const articles = getCuratedExternalNews('community')

  return (
    <>
      <SEO title={`${t.title} · XETHKIOZ`} description={t.description} url="/fun" />
      <section className="xk-page px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="xk-section-panel overflow-hidden rounded-[2rem] border border-yellow-300/45 bg-[linear-gradient(135deg,rgba(234,179,8,.16),rgba(139,92,246,.12),rgba(50,255,138,.08))] p-6 shadow-[0_0_28px_rgba(234,179,8,.16)] md:p-10">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-[#32FF8A]">MEME_CORE // HUMOR CONTROLADO</p>
              <button onClick={() => setLang(lang === 'es' ? 'en' : 'es')} className="rounded-full border border-yellow-300/40 px-4 py-2 font-mono text-xs font-black uppercase tracking-[0.18em] text-yellow-200">{lang.toUpperCase()}</button>
            </div>
            <h1 className="mt-4 text-4xl font-black uppercase tracking-[0.16em] text-white md:text-6xl">{t.title}</h1>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-gray-300 md:text-base">{t.description}</p>
            <div className="mt-6 inline-flex rounded-full border border-yellow-300/40 bg-black/35 px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-yellow-200">{t.badge}</div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {t.blocks.map((item) => (
              <button key={item.id} type="button" onClick={() => setActiveId(item.id)} className={`xk-card rounded-3xl border p-5 text-left transition hover:-translate-y-1 ${active.id === item.id ? 'border-[#32FF8A]/70 bg-[#031006]/80' : 'border-yellow-300/30 bg-black/55 hover:shadow-[0_0_18px_rgba(234,179,8,.18)]'}`}>
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#FF6B1A]">{item.title}</p>
                <p className="mt-4 text-sm leading-relaxed text-gray-200">{item.text}</p>
                <span className="mt-4 inline-flex font-mono text-[10px] uppercase tracking-[0.18em] text-[#32FF8A]">{t.open}</span>
              </button>
            ))}
          </div>

          <section className="mt-8 rounded-3xl border border-yellow-300/25 bg-black/55 p-5 md:p-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-yellow-200">{t.articleTitle}</p>
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {articles.map((article) => (
                <article key={article.slug} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:-translate-y-1 hover:border-yellow-300/40">
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#FF6B1A]">{formatPublicNewsDate(article.published_at ?? article.created_at, lang)}</span>
                  <h3 className="mt-3 text-lg font-black uppercase text-white">{article.title}</h3>
                  <p className="mt-3 text-xs leading-relaxed text-gray-300">{article.summary}</p>
                  <Link to={`/news/${article.slug}`} className="mt-5 inline-flex rounded-full border border-orange-400/40 px-4 py-2 font-mono text-[10px] font-black uppercase tracking-[0.16em] text-orange-100 hover:bg-orange-500/10">{t.read}</Link>
                </article>
              ))}
            </div>
          </section>

          <Link to="/" className="mt-8 inline-flex rounded-full border border-yellow-300/40 px-4 py-3 font-mono text-xs uppercase tracking-[0.18em] text-yellow-100 transition hover:border-[#32FF8A] hover:text-[#32FF8A]">{t.back}</Link>
        </div>
      </section>
    </>
  )
}

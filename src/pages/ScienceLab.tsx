import { useState } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { useLang } from '../lib/LangContext'
import { getCuratedExternalNews } from '../services/news/curatedExternalNews'
import { formatPublicNewsDate } from '../services/news/publicNewsService'

type SectionBlock = { id: string; title: string; text: string }

const content: Record<'es' | 'en', { title: string; description: string; back: string; open: string; status: string; articleTitle: string; read: string; blocks: SectionBlock[] }> = {
  es: {
    title: 'Tecnología / Ciencia',
    description: 'Laboratorio técnico para IA, ciencia, hardware, software e infraestructura verificable.',
    back: 'Volver al núcleo',
    open: 'Abrir laboratorio',
    status: 'Estado: sección conectada al radar real de IA, tecnología y ciencia. Cada tarjeta abre lectura ampliada con fuente original.',
    articleTitle: 'Laboratorio // IA + Tech + Ciencia',
    read: 'Leer completa',
    blocks: [
      { id: 'ai', title: 'IA / Modelos', text: 'Análisis, prompts, automatización, gobernanza y modelos locales.' },
      { id: 'science', title: 'Ciencia', text: 'Fuentes, evidencia, pensamiento crítico y contexto.' },
      { id: 'tech', title: 'Tecnología', text: 'Hardware, software, infraestructura, streaming y rendimiento.' },
    ],
  },
  en: {
    title: 'Technology / Science',
    description: 'Technical lab for AI, science, hardware, software and verifiable infrastructure.',
    back: 'Back to core',
    open: 'Open lab',
    status: 'Status: section connected to the real AI, technology and science radar. Each card opens expanded reading with original source.',
    articleTitle: 'Lab // AI + Tech + Science',
    read: 'Read full article',
    blocks: [
      { id: 'ai', title: 'AI / Models', text: 'Analysis, prompts, automation, governance and local models.' },
      { id: 'science', title: 'Science', text: 'Sources, evidence, critical thinking and context.' },
      { id: 'tech', title: 'Technology', text: 'Hardware, software, infrastructure, streaming and performance.' },
    ],
  },
}

export default function ScienceLab() {
  const { lang, setLang } = useLang()
  const t = content[lang]
  const [activeId, setActiveId] = useState(t.blocks[0].id)
  const active = t.blocks.find((item) => item.id === activeId) ?? t.blocks[0]
  const articles = [...getCuratedExternalNews('ai'), ...getCuratedExternalNews('tech'), ...getCuratedExternalNews('science')]

  return (
    <>
      <SEO title={`${t.title} · XETHKIOZ`} description={t.description} url="/science" />
      <section className="xk-page xk-blueprint px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="xk-section-panel rounded-[2rem] border border-blue-400/45 bg-[#06111f]/80 p-6 shadow-[0_0_28px_rgba(59,130,246,.18)] md:p-10">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-[#32FF8A]">DATA_TERMINAL // BLUEPRINT</p>
              <button onClick={() => setLang(lang === 'es' ? 'en' : 'es')} className="rounded-full border border-blue-300/40 px-4 py-2 font-mono text-xs font-black uppercase tracking-[0.18em] text-blue-100">{lang.toUpperCase()}</button>
            </div>
            <h1 className="mt-4 text-4xl font-black uppercase tracking-[0.16em] text-white md:text-6xl">{t.title}</h1>
            <p className="mt-4 max-w-3xl font-mono text-sm leading-relaxed text-blue-100/80">{t.description}</p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {t.blocks.map((item) => (
              <button key={item.id} type="button" onClick={() => setActiveId(item.id)} className={`xk-card rounded-3xl border p-5 text-left shadow-[0_0_16px_rgba(139,92,246,.12)] transition ${active.id === item.id ? 'border-[#32FF8A]/70 bg-[#031006]/80' : 'border-blue-300/30 bg-black/50 hover:border-blue-200/70'}`}>
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#8B5CF6]">{item.title}</p>
                <p className="mt-4 font-mono text-sm leading-relaxed text-gray-300">{item.text}</p>
                <span className="mt-4 inline-flex font-mono text-[10px] uppercase tracking-[0.18em] text-[#32FF8A]">{t.open}</span>
              </button>
            ))}
          </div>

          <section className="mt-8 rounded-3xl border border-blue-300/25 bg-black/55 p-5 md:p-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-blue-200">{t.articleTitle}</p>
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {articles.map((article) => (
                <article key={article.slug} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:-translate-y-1 hover:border-blue-300/40">
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#32FF8A]">{article.category} · {formatPublicNewsDate(article.published_at ?? article.created_at, lang)}</span>
                  <h3 className="mt-3 text-lg font-black uppercase text-white">{article.title}</h3>
                  <p className="mt-3 text-xs leading-relaxed text-gray-300">{article.summary}</p>
                  <Link to={`/news/${article.slug}`} className="mt-5 inline-flex rounded-full border border-orange-400/40 px-4 py-2 font-mono text-[10px] font-black uppercase tracking-[0.16em] text-orange-100 hover:bg-orange-500/10">{t.read}</Link>
                </article>
              ))}
            </div>
          </section>

          <div className="mt-8 rounded-3xl border border-[#32FF8A]/25 bg-black/45 p-5 font-mono text-xs leading-relaxed text-gray-300">{t.status}</div>
          <Link to="/" className="mt-8 inline-flex rounded-full border border-blue-300/40 px-4 py-3 font-mono text-xs uppercase tracking-[0.18em] text-blue-100 transition hover:border-[#32FF8A] hover:text-[#32FF8A]">{t.back}</Link>
        </div>
      </section>
    </>
  )
}

import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../../lib/LangContext'

interface GlobalNewsFeed {
  id: number
  source: string
  title: string
  category: 'IA' | 'CIENCIA' | 'TECNOLOGÍA'
  timeAgo: string
}

const feed: Record<'es' | 'en', GlobalNewsFeed[]> = {
  es: [
    { id: 1, source: 'Science Lab', title: 'IA aplicada: cómo separar hype, evidencia y utilidad real', category: 'IA', timeAgo: 'Base' },
    { id: 2, source: 'XETHKIOZ', title: 'Ciencia para gamers: hardware, espacio, salud digital y futuro', category: 'CIENCIA', timeAgo: 'Base' },
    { id: 3, source: 'Tech Watch', title: 'GPUs, modelos locales y consumo energético en contenido con IA', category: 'TECNOLOGÍA', timeAgo: 'Base' },
    { id: 4, source: 'Research Desk', title: 'Método de lectura: fuente, evidencia, contexto y conclusión', category: 'CIENCIA', timeAgo: 'Base' },
  ],
  en: [
    { id: 1, source: 'Science Lab', title: 'Applied AI: separating hype, evidence and real utility', category: 'IA', timeAgo: 'Base' },
    { id: 2, source: 'XETHKIOZ', title: 'Science for gamers: hardware, space, digital health and the future', category: 'CIENCIA', timeAgo: 'Base' },
    { id: 3, source: 'Tech Watch', title: 'GPUs, local models and energy use in AI-assisted content', category: 'TECNOLOGÍA', timeAgo: 'Base' },
    { id: 4, source: 'Research Desk', title: 'Reading method: source, evidence, context and conclusion', category: 'CIENCIA', timeAgo: 'Base' },
  ],
}

const copy = {
  es: {
    back: '⏴ Volver al Núcleo',
    label: 'XETHKIOZ // SCIENCE_LAB',
    title: 'Ciencia, IA y tecnología sin ruido',
    subtitle: 'Un sector separado del gaming para explicar avances reales con contexto, evidencia y lectura simple para la comunidad.',
    feedTitle: '// Radar editorial de Ciencia & IA',
    research: '// Línea de investigación inicial',
    contribute: '// Participar del laboratorio',
    evidence: 'Estado: Base editorial',
    project: 'Cómo usar IA, hardware y fuentes confiables para crear noticias responsables en XETHKIOZ.',
    ctaNews: 'Ver noticias',
    ctaAccount: 'Crear cuenta',
    source: 'Fuente',
  },
  en: {
    back: '⏴ Back to Core',
    label: 'XETHKIOZ // SCIENCE_LAB',
    title: 'Science, AI and technology without noise',
    subtitle: 'A sector separated from gaming to explain real advances with context, evidence and clear community reading.',
    feedTitle: '// Science & AI editorial radar',
    research: '// Initial research line',
    contribute: '// Join the lab',
    evidence: 'Status: Editorial base',
    project: 'How to use AI, hardware and reliable sources to create responsible news for XETHKIOZ.',
    ctaNews: 'Read news',
    ctaAccount: 'Create account',
    source: 'Source',
  },
} as const

export function SciencePortal() {
  const { lang } = useLang()
  const ui = copy[lang]
  const globalNews = useMemo(() => feed[lang], [lang])

  return (
    <div className="relative min-h-screen bg-fusionBg pb-12 text-gray-300 selection:bg-fusionAccent-science/30">
      <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-4 pt-24 sm:px-6">
        <Link to="/" className="font-mono text-xs uppercase tracking-[0.22em] text-fusionAccent-science hover:underline">{ui.back}</Link>
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-gray-600">{ui.label}</div>
      </header>
      <main className="relative z-10 mx-auto flex max-w-7xl flex-col gap-8 px-4 pt-12 sm:px-6">
        <section className="panel-cyber flex flex-col gap-2 border-l-2 border-l-fusionAccent-science p-8">
          <h1 className="text-4xl font-black uppercase tracking-wide text-white">{ui.title}</h1>
          <p className="max-w-2xl text-sm text-gray-400">{ui.subtitle}</p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-mono text-xs uppercase tracking-[0.22em] text-gray-500">{ui.feedTitle}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {globalNews.map((news) => (
              <article key={news.id} className="panel-cyber flex min-h-[140px] flex-col justify-between p-4 transition duration-300 hover:border-fusionAccent-science/50">
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className="font-bold text-fusionAccent-science">{news.category}</span>
                  <span className="text-gray-600">{news.timeAgo}</span>
                </div>
                <h3 className="my-2 line-clamp-3 text-sm font-semibold tracking-wide text-white">{news.title}</h3>
                <div className="border-t border-fusionSurface-muted pt-2 font-mono text-[10px] text-gray-500">{ui.source}: {news.source}</div>
              </article>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <section className="flex flex-col gap-4 lg:col-span-2">
            <h2 className="font-mono text-xs uppercase tracking-[0.22em] text-gray-500">{ui.research}</h2>
            <article className="panel-cyber flex flex-col gap-3 p-6">
              <span className="self-start rounded border border-fusionAccent-science/30 bg-fusionAccent-science/10 px-2 py-0.5 font-mono text-[10px] text-fusionAccent-science">{ui.evidence}</span>
              <h3 className="text-lg font-bold uppercase tracking-wide text-white">{ui.project}</h3>
            </article>
          </section>
          <section className="flex flex-col gap-4">
            <h2 className="font-mono text-xs uppercase tracking-[0.22em] text-gray-500">{ui.contribute}</h2>
            <div className="panel-cyber flex flex-col gap-3 p-6">
              <Link to="/news" className="btn-secondary rounded-xl px-4 py-3 text-center text-xs uppercase tracking-[0.18em]">{ui.ctaNews}</Link>
              <Link to="/login" className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-center font-mono text-xs uppercase tracking-[0.18em] text-gray-200 transition hover:border-fusionAccent-science hover:text-fusionAccent-science">{ui.ctaAccount}</Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default SciencePortal

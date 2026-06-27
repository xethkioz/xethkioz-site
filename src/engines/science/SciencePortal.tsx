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
    { id: 1, source: 'MIT Tech Review', title: 'Nuevos avances en computación cuántica topológica', category: 'TECNOLOGÍA', timeAgo: '2h' },
    { id: 2, source: 'CERN News', title: 'Simulación de alta precisión revela comportamientos inusuales en partículas', category: 'CIENCIA', timeAgo: '5h' },
    { id: 3, source: 'OpenAI Blog', title: 'Optimizando el uso de GPUs locales en modelos masivos de inferencia', category: 'IA', timeAgo: '1d' },
    { id: 4, source: 'NASA Space', title: 'El telescopio espacial capta firmas atmosféricas en exoplanetas cercanos', category: 'CIENCIA', timeAgo: '2d' },
  ],
  en: [
    { id: 1, source: 'MIT Tech Review', title: 'New advances in topological quantum computing', category: 'TECNOLOGÍA', timeAgo: '2h' },
    { id: 2, source: 'CERN News', title: 'High-precision simulation reveals unusual particle behavior', category: 'CIENCIA', timeAgo: '5h' },
    { id: 3, source: 'OpenAI Blog', title: 'Optimizing local GPU usage for massive inference models', category: 'IA', timeAgo: '1d' },
    { id: 4, source: 'NASA Space', title: 'Space telescope captures atmospheric signatures on nearby exoplanets', category: 'CIENCIA', timeAgo: '2d' },
  ],
}

const copy = {
  es: {
    back: '⏴ Volver al Núcleo',
    label: 'FUSION_ALPHA_2.0 // PORTAL_SCIENCE',
    title: 'Conocimiento sin ruido',
    subtitle: 'Área clara con administrador especializado, separada del contenido gamer y del ocio.',
    feedTitle: '// Global Tech & Science Feed // Panel Rotativo',
    research: '// Investigaciones Validadas',
    contribute: '// Aportar Proyecto',
    evidence: 'Evidencia: Documented',
    project: 'Implementación de Redes Neuronales Convolucionales en Hardware Local',
    placeholder: 'Título del Proyecto',
    submit: 'Enviar a Revisión',
    source: 'Fuente',
  },
  en: {
    back: '⏴ Back to Core',
    label: 'FUSION_ALPHA_2.0 // PORTAL_SCIENCE',
    title: 'Knowledge without noise',
    subtitle: 'A clear area with specialized administration, separated from gaming and entertainment content.',
    feedTitle: '// Global Tech & Science Feed // Rotating Panel',
    research: '// Validated Research',
    contribute: '// Submit Project',
    evidence: 'Evidence: Documented',
    project: 'Convolutional Neural Networks on Local Hardware',
    placeholder: 'Project Title',
    submit: 'Send to Review',
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
            <div className="panel-cyber flex flex-col gap-4 p-6 opacity-50">
              <input type="text" placeholder={ui.placeholder} disabled className="w-full rounded border border-fusionSurface-muted bg-fusionBg p-2 font-mono text-xs" />
              <button type="button" disabled className="w-full border border-fusionSurface-muted bg-fusionSurface-base py-2 font-mono text-xs uppercase tracking-[0.22em] text-gray-400">{ui.submit}</button>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default SciencePortal

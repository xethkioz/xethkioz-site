import { portalKnowledgeCatalog, type KnowledgeLang, type KnowledgeSector } from '../data/portalKnowledgeCatalog'
import './PortalKnowledgeBriefing.css'

type Props = {
  sector: KnowledgeSector
  lang?: KnowledgeLang
  light?: boolean
  className?: string
}

const sectionCopy = {
  es: {
    eyebrow: 'GUÍAS VERIFICADAS // REVISIÓN 13.08.2026',
    title: 'Información que se puede usar',
    description: 'Contexto, pasos concretos, límites y una fuente oficial para ampliar. Las guías se abren sólo cuando las necesitás para mantener cada portal liviano y ordenado.',
    open: 'Abrir guía completa',
    steps: 'Pasos recomendados',
    limit: 'Alcance y límite',
    source: 'Fuente oficial',
  },
  en: {
    eyebrow: 'VERIFIED GUIDES // REVIEWED 2026.08.13',
    title: 'Information you can use',
    description: 'Context, practical steps, clear limits and an official source for further reading. Guides open only when needed to keep every portal light and organized.',
    open: 'Open full guide',
    steps: 'Recommended steps',
    limit: 'Scope and limits',
    source: 'Official source',
  },
} as const

export default function PortalKnowledgeBriefing({ sector, lang = 'es', light = false, className = '' }: Props) {
  const guides = portalKnowledgeCatalog[sector]
  const t = sectionCopy[lang]
  const titleId = `knowledge-${sector}-title`

  return (
    <section className={`xk-knowledge xk-knowledge-${sector}${light ? ' is-light' : ''} ${className}`.trim()} aria-labelledby={titleId} data-knowledge-sector={sector}>
      <header className="xk-knowledge-head">
        <p>{t.eyebrow}</p>
        <h2 id={titleId}>{t.title}</h2>
        <span>{t.description}</span>
      </header>
      <div className="xk-knowledge-grid">
        {guides.map((guide, index) => (
          <details key={guide.id} className="xk-knowledge-card">
            <summary>
              <span className="xk-knowledge-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <span className="xk-knowledge-summary-copy">
                <small>{guide.eyebrow[lang]}</small>
                <strong>{guide.title[lang]}</strong>
                <em>{guide.intro[lang]}</em>
              </span>
              <span className="xk-knowledge-toggle"><b>{t.open}</b><i aria-hidden="true">+</i></span>
            </summary>
            <div className="xk-knowledge-body">
              <h3>{t.steps}</h3>
              <ol>{guide.steps[lang].map((step) => <li key={step}>{step}</li>)}</ol>
              <aside><b>{t.limit}</b><p>{guide.limit[lang]}</p></aside>
              <a href={guide.sourceUrl} target="_blank" rel="noopener noreferrer">{t.source}: {guide.sourceLabel} <span aria-hidden="true">↗</span></a>
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}


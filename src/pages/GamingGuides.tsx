import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import SEO from '../components/SEO'
import SafeImage from '../components/SafeImage'
import { getGuideGame, guideGames, radarGames, type GuideGame } from '../data/gamingGuideCatalog'
import { useLang } from '../lib/LangContext'
import './GamingGuidesV2.css'

const copy = {
  es: {
    seoTitle: 'Guías de WoW, Diablo IV, Final Fantasy XIV y Path of Exile',
    seoDescription: 'Biblioteca bilingüe de guías originales para World of Warcraft, Diablo IV, Final Fantasy XIV y Path of Exile, más radar de GTA VI, AION 2, Minecraft, Roblox y Fortnite.',
    breadcrumb: 'Biblioteca de guías',
    kicker: 'GUIDE_CORE // CUATRO UNIVERSOS',
    title: 'Guías que explican el camino.',
    highlight: 'No solo la build final.',
    description: 'Cada módulo resume qué hacer, por qué hacerlo, qué revisar antes de copiar una configuración y qué puede cambiar con un parche. El contenido está redactado por XETHKIOZ a partir de fuentes técnicas enlazadas.',
    principles: ['✓ PASOS CLAROS', '✓ ESPAÑOL / ENGLISH', '✓ VERSIÓN Y ADVERTENCIAS', '✓ FUENTES TÉCNICAS'],
    gamesLabel: 'Bibliotecas disponibles',
    moduleLabel: 'Módulos de la guía',
    guideCode: 'GUÍA XETHKIOZ',
    warning: 'Antes de aplicar',
    source: 'Consultar fuente técnica',
    radarEyebrow: 'RADAR EDITORIAL // CINCO SEÑALES',
    radarTitle: 'Actualidad separada de las guías estables',
    radarText: 'GTA VI, AION 2, Minecraft, Roblox y Fortnite tienen seguimiento principal de noticias, actualizaciones, mods, temporadas y cambios oficiales.',
    openRadar: 'Abrir radar',
    back: 'Volver a Gaming',
    searchLabel: 'Buscar en todas las guías', searchPlaceholder: 'Ej: leveleo, build, raid, economía…', noResults: 'No encontramos ese objetivo. Probá otra palabra.', openGuide: 'Abrir módulo', progress: 'Tu progreso', reset: 'Reiniciar', completed: 'completado', copyLink: 'Copiar enlace', copied: 'Enlace copiado', searchEyebrow: 'RUTA RÁPIDA // ENCONTRÁ TU OBJETIVO', searchText: 'Buscá por juego, sistema o meta. El resultado abre la guía exacta y la URL se puede compartir.',
  },
  en: {
    seoTitle: 'WoW, Diablo IV, Final Fantasy XIV and Path of Exile Guides',
    seoDescription: 'Bilingual original guide library for World of Warcraft, Diablo IV, Final Fantasy XIV and Path of Exile, plus a GTA VI, AION 2, Minecraft, Roblox and Fortnite radar.',
    breadcrumb: 'Guide library',
    kicker: 'GUIDE_CORE // FOUR UNIVERSES',
    title: 'Guides that explain the path.',
    highlight: 'Not only the final build.',
    description: 'Each module summarizes what to do, why it matters, what to check before copying a setup and what may change with a patch. Content is written by XETHKIOZ from the linked technical sources.',
    principles: ['✓ CLEAR STEPS', '✓ ESPAÑOL / ENGLISH', '✓ VERSION AND WARNINGS', '✓ TECHNICAL SOURCES'],
    gamesLabel: 'Available libraries',
    moduleLabel: 'Guide modules',
    guideCode: 'XETHKIOZ GUIDE',
    warning: 'Before applying',
    source: 'Open technical source',
    radarEyebrow: 'EDITORIAL RADAR // FIVE SIGNALS',
    radarTitle: 'Current news separated from stable guides',
    radarText: 'GTA VI, AION 2, Minecraft, Roblox and Fortnite receive primary coverage for news, updates, mods, seasons and official changes.',
    openRadar: 'Open radar',
    back: 'Back to Gaming',
    searchLabel: 'Search all guides', searchPlaceholder: 'E.g. leveling, build, raid, economy…', noResults: 'We could not find that goal. Try another word.', openGuide: 'Open module', progress: 'Your progress', reset: 'Reset', completed: 'complete', copyLink: 'Copy link', copied: 'Link copied', searchEyebrow: 'QUICK ROUTE // FIND YOUR GOAL', searchText: 'Search by game, system or goal. Results open the exact guide and its URL can be shared.',
  },
} as const

export default function GamingGuides() {
  const { lang } = useLang()
  const t = copy[lang]
  const [searchParams, setSearchParams] = useSearchParams()
  const activeGame = getGuideGame(searchParams.get('game'))
  const requestedModule = searchParams.get('module')
  const [activeModuleId, setActiveModuleId] = useState(activeGame.modules.some((module) => module.id === requestedModule) ? requestedModule! : activeGame.modules[0].id)
  const activeModule = activeGame.modules.find((module) => module.id === activeModuleId) ?? activeGame.modules[0]
  const [query, setQuery] = useState('')
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const moduleFromUrl = searchParams.get('module')
    setActiveModuleId(activeGame.modules.some((module) => module.id === moduleFromUrl) ? moduleFromUrl! : activeGame.modules[0].id)
  }, [activeGame.id, searchParams])

  useEffect(() => {
    const key = `xethkioz.guide-progress.v1.${activeGame.id}.${activeModule.id}`
    try {
      const parsed = JSON.parse(window.localStorage.getItem(key) ?? '[]')
      setCompletedSteps(Array.isArray(parsed) ? parsed.filter((value): value is number => Number.isInteger(value) && value >= 0 && value < activeModule.steps[lang].length) : [])
    } catch {
      setCompletedSteps([])
    }
  }, [activeGame.id, activeModule.id, activeModule.steps, lang])

  const selectGame = (game: GuideGame) => {
    const next = new URLSearchParams(searchParams)
    next.set('game', game.id)
    next.delete('module')
    setSearchParams(next, { replace: true })
  }

  const selectModule = (moduleId: string) => {
    const next = new URLSearchParams(searchParams)
    next.set('game', activeGame.id)
    next.set('module', moduleId)
    setSearchParams(next, { replace: true })
    setActiveModuleId(moduleId)
  }

  const openSearchResult = (game: GuideGame, moduleId: string) => {
    setSearchParams({ game: game.id, module: moduleId })
    setQuery('')
    window.requestAnimationFrame(() => document.getElementById('guide-library')?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  const searchResults = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase(lang === 'es' ? 'es' : 'en')
    if (!normalized) return []
    return guideGames.flatMap((game) => game.modules.map((module) => ({ game, module }))).filter(({ game, module }) => [game.title, game.code, game.subtitle[lang], module.title[lang], module.summary[lang], ...module.steps[lang]].join(' ').toLocaleLowerCase(lang === 'es' ? 'es' : 'en').includes(normalized)).slice(0, 8)
  }, [lang, query])

  const toggleStep = (index: number) => {
    const next = completedSteps.includes(index) ? completedSteps.filter((value) => value !== index) : [...completedSteps, index]
    setCompletedSteps(next)
    try { window.localStorage.setItem(`xethkioz.guide-progress.v1.${activeGame.id}.${activeModule.id}`, JSON.stringify(next)) } catch { /* Progress remains available for this session. */ }
  }

  const resetProgress = () => {
    setCompletedSteps([])
    try { window.localStorage.removeItem(`xethkioz.guide-progress.v1.${activeGame.id}.${activeModule.id}`) } catch { /* Optional local persistence. */ }
  }

  const copyModuleLink = async () => {
    const next = new URL(window.location.href)
    next.searchParams.set('game', activeGame.id)
    next.searchParams.set('module', activeModule.id)
    try {
      await navigator.clipboard.writeText(next.toString())
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      window.history.replaceState(null, '', `${next.pathname}${next.search}`)
    }
  }

  const gameStyle = { '--guide-color': activeGame.color } as CSSProperties

  return (
    <main className="xk-guides-v2">
      <SEO title={t.seoTitle} description={t.seoDescription} url="/gaming/guides" />
      <div className="xk-guides-v2-shell">
        <nav className="xk-guides-v2-breadcrumb" aria-label={lang === 'es' ? 'Ruta de navegación' : 'Breadcrumb'}>
          <Link to="/gaming">Gaming</Link><span>/</span><b>{t.breadcrumb}</b>
        </nav>

        <header className="xk-guides-v2-hero">
          <div>
            <small>{t.kicker}</small>
            <h1>{t.title}<br /><span>{t.highlight}</span></h1>
            <p>{t.description}</p>
          </div>
        </header>

        <section className="xk-guides-v2-principles" aria-label={lang === 'es' ? 'Criterios editoriales' : 'Editorial criteria'}>
          {t.principles.map((principle) => <span key={principle}>{principle}</span>)}
        </section>

        <section className="xk-guide-search" aria-labelledby="guide-search-title">
          <header><div><small>{t.searchEyebrow}</small><h2 id="guide-search-title">{t.searchLabel}</h2><p>{t.searchText}</p></div><label><span className="sr-only">{t.searchLabel}</span><b aria-hidden="true">⌕</b><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.searchPlaceholder} /></label></header>
          {query.trim() ? <div className="xk-guide-search-results" role="list" aria-live="polite">{searchResults.length ? searchResults.map(({ game, module }) => <button key={`${game.id}-${module.id}`} type="button" role="listitem" onClick={() => openSearchResult(game, module.id)} style={{ '--guide-color': game.color } as CSSProperties}><i /><span><small>{game.title} // {game.code}</small><b>{module.title[lang]}</b><em>{module.summary[lang]}</em></span><strong>{t.openGuide} →</strong></button>) : <p>{t.noResults}</p>}</div> : null}
        </section>

        <section id="guide-library" className="xk-guide-library-layout scroll-mt-28" aria-label={t.gamesLabel}>
          <aside className="xk-guide-library-nav">
            <p>{t.gamesLabel}</p>
            {guideGames.map((game) => (
              <button
                key={game.id}
                type="button"
                className={activeGame.id === game.id ? 'is-active' : ''}
                aria-pressed={activeGame.id === game.id}
                onClick={() => selectGame(game)}
                style={{ '--guide-color': game.color } as CSSProperties}
              >
                <i aria-hidden="true" /><b>{game.title}</b><small>{game.code}</small>
              </button>
            ))}
          </aside>

          <article className="xk-guide-library-content" style={gameStyle}>
            <header className="xk-guide-library-game-head" style={gameStyle}>
              <SafeImage src={activeGame.image} fallback="/images/articles/gaming.svg" alt={`${lang === 'es' ? 'Universo de' : 'World of'} ${activeGame.title}`} />
              <div className="xk-guide-library-game-copy">
                <small>{t.guideCode} // {activeGame.code}</small>
                <h2>{activeGame.title}</h2>
                <p>{activeGame.subtitle[lang]}</p>
                <span>{activeGame.status[lang]}</span>
              </div>
            </header>

            <nav className="xk-guide-module-tabs" aria-label={t.moduleLabel} style={gameStyle}>
              {activeGame.modules.map((module) => (
                <button key={module.id} type="button" className={activeModule.id === module.id ? 'is-active' : ''} aria-pressed={activeModule.id === module.id} onClick={() => selectModule(module.id)}>
                  {module.title[lang]}
                </button>
              ))}
            </nav>

            <section className="xk-guide-module" style={gameStyle} aria-labelledby={`guide-module-${activeGame.id}-${activeModule.id}`}>
              <div className="xk-guide-module-toolbar"><small>{activeGame.code} // {activeModule.id.toUpperCase()}</small><button type="button" onClick={() => void copyModuleLink()}>{copied ? t.copied : t.copyLink} ↗</button></div>
              <h3 id={`guide-module-${activeGame.id}-${activeModule.id}`}>{activeModule.title[lang]}</h3>
              <p>{activeModule.summary[lang]}</p>
              <div className="xk-guide-progress"><div><span>{t.progress}</span><b>{Math.round((completedSteps.length / activeModule.steps[lang].length) * 100)}% {t.completed}</b></div><i><span style={{ width: `${(completedSteps.length / activeModule.steps[lang].length) * 100}%` }} /></i>{completedSteps.length ? <button type="button" onClick={resetProgress}>{t.reset}</button> : null}</div>
              <ol>{activeModule.steps[lang].map((step, index) => <li key={step} className={completedSteps.includes(index) ? 'is-complete' : ''}><button type="button" aria-pressed={completedSteps.includes(index)} onClick={() => toggleStep(index)}><span>{step}</span><b aria-hidden="true">{completedSteps.includes(index) ? '✓' : '+'}</b></button></li>)}</ol>
              <p className="xk-guide-warning"><strong>{t.warning}:</strong> {activeModule.warning[lang]}</p>
              <a className="xk-guide-source" href={activeModule.sourceHref} target="_blank" rel="noreferrer noopener">{t.source}: {activeModule.sourceLabel} ↗</a>
            </section>
          </article>
        </section>

        <section className="xk-guide-radar" aria-labelledby="guide-radar-title">
          <header><p>{t.radarEyebrow}</p><h2 id="guide-radar-title">{t.radarTitle}</h2><span>{t.radarText}</span></header>
          <div className="xk-guide-radar-grid">
            {radarGames.map((game) => (
              <Link key={game.id} className="xk-guide-radar-card" to={`/news?category=gaming&game=${encodeURIComponent(game.query)}`} style={{ '--radar': game.color } as CSSProperties}>
                <small>{game.code} // {game.focus[lang]}</small><h3>{game.title}</h3><p>{game.description[lang]}</p><span>{t.openRadar} →</span>
              </Link>
            ))}
          </div>
        </section>

        <Link to="/gaming" className="xk-guide-source">← {t.back}</Link>
      </div>
    </main>
  )
}

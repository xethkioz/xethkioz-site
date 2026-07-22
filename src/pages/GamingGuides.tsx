import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import SEO from '../components/SEO'
import SafeImage from '../components/SafeImage'
import ClassGuideDirectory from '../components/gaming/ClassGuideDirectory'
import { getGuideGame, guideGames, radarGames, type GuideGame } from '../data/gamingGuideCatalog'
import { useLang } from '../lib/LangContext'
import './GamingGuidesV2.css'

const copy = {
  es: {
    seoTitle: 'Builds y guías completas de WoW, Diablo IV, FFXIV y Path of Exile 2',
    seoDescription: 'Guías por clase con builds, habilidades, estadísticas, equipo, rotación y progresión para WoW Midnight, Diablo IV Season 14, FFXIV 7.5 y Path of Exile 2 0.5.4b.',
    breadcrumb: 'Biblioteca de guías',
    kicker: 'GUIDE_CORE // CUATRO UNIVERSOS',
    title: 'Elegí tu clase.',
    highlight: 'Después construí el personaje.',
    description: 'La biblioteca abre directamente en builds por clase. Cada configuración incluye habilidades, estadísticas, equipo, rotación, progresión, parche y fuente; las rutas generales quedan en una sección aparte.',
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
    searchLabel: 'Buscar en todas las guías', searchPlaceholder: 'Ej: leveleo, build, raid, economía…', noResults: 'No encontramos ese objetivo. Probá otra palabra.', openGuide: 'Abrir módulo', progress: 'Tu progreso', reset: 'Reiniciar', completed: 'completado', copyLink: 'Copiar enlace', copied: 'Enlace copiado', searchEyebrow: 'RUTA RÁPIDA // ENCONTRÁ TU OBJETIVO', searchText: 'Buscá por juego, sistema o meta. El resultado abre la guía exacta y la URL se puede compartir.', commandEyebrow: 'GUIDE_SAVE // CONTINUIDAD LOCAL', commandTitle: 'Tu campaña de aprendizaje', totalProgress: 'Progreso total', steps: 'pasos', continue: 'CONTINUAR RUTA', allComplete: 'Biblioteca completada', currentRoute: 'Ruta recomendada', privacy: 'Se guarda sólo en este dispositivo. No requiere cuenta.', modeLabel: 'Elegir tipo de guía', routesMode: 'RUTAS GENERALES', routesDetail: 'Leveleo, economía y sistemas de endgame', classesMode: 'BUILDS POR CLASE', classesDetail: 'Habilidades, estadísticas, equipo y rotación',
  },
  en: {
    seoTitle: 'Complete WoW, Diablo IV, FFXIV and Path of Exile 2 builds and guides',
    seoDescription: 'Class builds with skills, stats, gear, rotation and progression for WoW Midnight, Diablo IV Season 14, FFXIV 7.5 and Path of Exile 2 0.5.4b.',
    breadcrumb: 'Guide library',
    kicker: 'GUIDE_CORE // FOUR UNIVERSES',
    title: 'Choose your class.',
    highlight: 'Then build the character.',
    description: 'The library opens directly into class builds. Every setup includes skills, stats, gear, rotation, progression, patch and source; general routes remain in a separate section.',
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
    searchLabel: 'Search all guides', searchPlaceholder: 'E.g. leveling, build, raid, economy…', noResults: 'We could not find that goal. Try another word.', openGuide: 'Open module', progress: 'Your progress', reset: 'Reset', completed: 'complete', copyLink: 'Copy link', copied: 'Link copied', searchEyebrow: 'QUICK ROUTE // FIND YOUR GOAL', searchText: 'Search by game, system or goal. Results open the exact guide and its URL can be shared.', commandEyebrow: 'GUIDE_SAVE // LOCAL CONTINUITY', commandTitle: 'Your learning campaign', totalProgress: 'Total progress', steps: 'steps', continue: 'CONTINUE ROUTE', allComplete: 'Library complete', currentRoute: 'Recommended route', privacy: 'Stored only on this device. No account required.', modeLabel: 'Choose guide type', routesMode: 'GENERAL ROUTES', routesDetail: 'Leveling, economy and endgame systems', classesMode: 'BUILDS BY CLASS', classesDetail: 'Skills, stats, gear and rotation',
  },
} as const

function guideProgressKey(gameId: string, moduleId: string) {
  return `xethkioz.guide-progress.v1.${gameId}.${moduleId}`
}

function readGuideProgress(gameId: string, moduleId: string, max: number) {
  try {
    const value = JSON.parse(window.localStorage.getItem(guideProgressKey(gameId, moduleId)) ?? '[]')
    return Array.isArray(value) ? value.filter((item): item is number => Number.isInteger(item) && item >= 0 && item < max) : []
  } catch {
    return []
  }
}

export default function GamingGuides() {
  const { lang } = useLang()
  const t = copy[lang]
  const [searchParams, setSearchParams] = useSearchParams()
  const activeView = searchParams.get('view') === 'routes' || searchParams.has('module') ? 'routes' : 'classes'
  const activeGame = getGuideGame(searchParams.get('game'))
  const requestedModule = searchParams.get('module')
  const [activeModuleId, setActiveModuleId] = useState(activeGame.modules.some((module) => module.id === requestedModule) ? requestedModule! : activeGame.modules[0].id)
  const activeModule = activeGame.modules.find((module) => module.id === activeModuleId) ?? activeGame.modules[0]
  const [query, setQuery] = useState('')
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [copied, setCopied] = useState(false)
  const [progressRevision, setProgressRevision] = useState(0)

  useEffect(() => {
    const moduleFromUrl = searchParams.get('module')
    setActiveModuleId(activeGame.modules.some((module) => module.id === moduleFromUrl) ? moduleFromUrl! : activeGame.modules[0].id)
  }, [activeGame.id, searchParams])

  useEffect(() => {
    setCompletedSteps(readGuideProgress(activeGame.id, activeModule.id, activeModule.steps[lang].length))
  }, [activeGame.id, activeModule.id, activeModule.steps, lang])

  const libraryProgress = useMemo(() => {
    const routes = guideGames.flatMap((game) => game.modules.map((module) => {
      const total = module.steps[lang].length
      const done = readGuideProgress(game.id, module.id, total).length
      return { game, module, total, done }
    }))
    const total = routes.reduce((sum, route) => sum + route.total, 0)
    const done = routes.reduce((sum, route) => sum + route.done, 0)
    const started = routes.find((route) => route.done > 0 && route.done < route.total)
    const next = started ?? routes.find((route) => route.done < route.total) ?? null
    return { total, done, percent: total ? Math.round((done / total) * 100) : 0, next }
  }, [lang, progressRevision])

  const selectGame = (game: GuideGame) => {
    const next = new URLSearchParams(searchParams)
    next.set('view', 'routes')
    next.set('game', game.id)
    next.delete('module')
    setSearchParams(next, { replace: true })
  }

  const selectModule = (moduleId: string) => {
    const next = new URLSearchParams(searchParams)
    next.set('view', 'routes')
    next.set('game', activeGame.id)
    next.set('module', moduleId)
    setSearchParams(next, { replace: true })
    setActiveModuleId(moduleId)
  }

  const openSearchResult = (game: GuideGame, moduleId: string) => {
    setSearchParams({ view: 'routes', game: game.id, module: moduleId })
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
    try { window.localStorage.setItem(guideProgressKey(activeGame.id, activeModule.id), JSON.stringify(next)) } catch { /* Progress remains available for this session. */ }
    setProgressRevision((current) => current + 1)
  }

  const resetProgress = () => {
    setCompletedSteps([])
    try { window.localStorage.removeItem(guideProgressKey(activeGame.id, activeModule.id)) } catch { /* Optional local persistence. */ }
    setProgressRevision((current) => current + 1)
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

  const selectView = (view: 'routes' | 'classes') => {
    const next = new URLSearchParams(searchParams)
    next.set('view', view)
    if (view === 'routes') next.delete('class')
    if (view === 'classes') next.delete('module')
    setSearchParams(next)
  }

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

        <nav className="xk-guide-view-switcher" aria-label={t.modeLabel}>
          <button type="button" aria-pressed={activeView === 'routes'} onClick={() => selectView('routes')}><b>{t.routesMode}</b><span>{t.routesDetail}</span></button>
          <button type="button" aria-pressed={activeView === 'classes'} onClick={() => selectView('classes')}><b>{t.classesMode}</b><span>{t.classesDetail}</span></button>
        </nav>

        {activeView === 'classes' ? <ClassGuideDirectory lang={lang} /> : <>

        <section className="xk-guide-command" aria-labelledby="guide-command-title">
          <header><small>{t.commandEyebrow}</small><h2 id="guide-command-title">{t.commandTitle}</h2><p>{t.privacy}</p></header>
          <div className="xk-guide-command-progress" aria-live="polite"><span>{t.totalProgress}</span><b>{libraryProgress.percent}%</b><i><em style={{ width: `${libraryProgress.percent}%` }} /></i><small>{libraryProgress.done} / {libraryProgress.total} {t.steps}</small></div>
          <div className="xk-guide-command-next"><span>{t.currentRoute}</span>{libraryProgress.next ? <><b>{libraryProgress.next.game.title}</b><small>{libraryProgress.next.module.title[lang]} · {libraryProgress.next.done}/{libraryProgress.next.total}</small><button type="button" onClick={() => openSearchResult(libraryProgress.next!.game, libraryProgress.next!.module.id)}>{t.continue} →</button></> : <b>{t.allComplete} ✓</b>}</div>
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
        </>}

        <Link to="/gaming" className="xk-guide-source">← {t.back}</Link>
      </div>
    </main>
  )
}

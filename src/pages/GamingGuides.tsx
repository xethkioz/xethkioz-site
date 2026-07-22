import { useEffect, useState, type CSSProperties } from 'react'
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
    switchLanguage: 'Cambiar a inglés',
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
  },
  en: {
    seoTitle: 'WoW, Diablo IV, Final Fantasy XIV and Path of Exile Guides',
    seoDescription: 'Bilingual original guide library for World of Warcraft, Diablo IV, Final Fantasy XIV and Path of Exile, plus a GTA VI, AION 2, Minecraft, Roblox and Fortnite radar.',
    breadcrumb: 'Guide library',
    kicker: 'GUIDE_CORE // FOUR UNIVERSES',
    title: 'Guides that explain the path.',
    highlight: 'Not only the final build.',
    description: 'Each module summarizes what to do, why it matters, what to check before copying a setup and what may change with a patch. Content is written by XETHKIOZ from the linked technical sources.',
    switchLanguage: 'Switch to Spanish',
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
  },
} as const

export default function GamingGuides() {
  const { lang, setLang } = useLang()
  const t = copy[lang]
  const [searchParams, setSearchParams] = useSearchParams()
  const activeGame = getGuideGame(searchParams.get('game'))
  const [activeModuleId, setActiveModuleId] = useState(activeGame.modules[0].id)
  const activeModule = activeGame.modules.find((module) => module.id === activeModuleId) ?? activeGame.modules[0]

  useEffect(() => {
    setActiveModuleId(activeGame.modules[0].id)
  }, [activeGame.id])

  const selectGame = (game: GuideGame) => {
    const next = new URLSearchParams(searchParams)
    next.set('game', game.id)
    setSearchParams(next, { replace: true })
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
          <button type="button" onClick={() => setLang(lang === 'es' ? 'en' : 'es')} aria-label={t.switchLanguage}>{lang === 'es' ? 'EN' : 'ES'}</button>
        </header>

        <section className="xk-guides-v2-principles" aria-label={lang === 'es' ? 'Criterios editoriales' : 'Editorial criteria'}>
          {t.principles.map((principle) => <span key={principle}>{principle}</span>)}
        </section>

        <section className="xk-guide-library-layout" aria-label={t.gamesLabel}>
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
                <button key={module.id} type="button" className={activeModule.id === module.id ? 'is-active' : ''} aria-pressed={activeModule.id === module.id} onClick={() => setActiveModuleId(module.id)}>
                  {module.title[lang]}
                </button>
              ))}
            </nav>

            <section className="xk-guide-module" style={gameStyle} aria-labelledby={`guide-module-${activeGame.id}-${activeModule.id}`}>
              <small>{activeGame.code} // {activeModule.id.toUpperCase()}</small>
              <h3 id={`guide-module-${activeGame.id}-${activeModule.id}`}>{activeModule.title[lang]}</h3>
              <p>{activeModule.summary[lang]}</p>
              <ol>{activeModule.steps[lang].map((step) => <li key={step}>{step}</li>)}</ol>
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

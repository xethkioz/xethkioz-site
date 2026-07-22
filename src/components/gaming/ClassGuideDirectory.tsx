import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { useSearchParams } from 'react-router-dom'
import { classGuideGames, getClassGuideGame, type ClassGuideEntry, type ClassGuideLang } from '../../data/gameClassCatalog'
import { getPopularBuilds, type PopularBuild } from '../../data/popularBuildCatalog'
import './ClassGuideDirectory.css'

const copy = {
  es: {
    eyebrow: 'BUILD_CORE // CLASE → BUILD → EQUIPO',
    title: 'Guías completas por clase y build',
    description: 'Elegí juego, clase y configuración. Cada ruta muestra parche, actividad, habilidades, estadísticas, equipo, rotación y progresión; los datos de popularidad siempre llevan fecha y fuente.',
    gameLabel: 'Juego',
    searchLabel: 'Buscar clase o rol',
    searchPlaceholder: 'Ej: tanque, Warlock, healer…',
    entries: 'clases / jobs',
    difficulty: 'Dificultad inicial',
    strengths: 'Lo que hace bien',
    priorities: 'Ruta de aprendizaje',
    caution: 'No te olvides',
    source: 'Fuente oficial y habilidades vigentes',
    noResults: 'No encontramos una clase con ese nombre o rol.',
    buildTitle: 'Builds populares y rutas recomendadas',
    buildCount: 'builds cargadas',
    snapshot: 'Snapshot',
    skills: 'Habilidades núcleo',
    stats: 'Prioridad de estadísticas',
    gear: 'Equipo y requisitos',
    rotation: 'Rotación / loop',
    progression: 'Cómo progresarla',
    sourceBuild: 'Abrir build y datos actuales',
    noBuilds: 'Esta clase todavía no tiene una build profunda publicada.',
    liveWarning: 'Los códigos de talentos, BiS y porcentajes cambian con hotfixes. Usá esta ruta para entender la build y confirmá el detalle exacto en la fuente enlazada antes de gastar recursos.',
    popularity: { 'most-used': 'MÁS USADA', meta: 'META', starter: 'STARTER', standard: 'ESTÁNDAR' },
  },
  en: {
    eyebrow: 'BUILD_CORE // CLASS → BUILD → GEAR',
    title: 'Complete guides by class and build',
    description: 'Choose game, class and setup. Every route shows patch, activity, skills, stats, gear, rotation and progression; popularity data always includes a date and source.',
    gameLabel: 'Game',
    searchLabel: 'Search class or role',
    searchPlaceholder: 'E.g. tank, Warlock, healer…',
    entries: 'classes / jobs',
    difficulty: 'Starter difficulty',
    strengths: 'What it does well',
    priorities: 'Learning route',
    caution: 'Keep in mind',
    source: 'Official source and current actions',
    noResults: 'No class matches that name or role.',
    buildTitle: 'Popular builds and recommended routes',
    buildCount: 'loaded builds',
    snapshot: 'Snapshot',
    skills: 'Core skills',
    stats: 'Stat priority',
    gear: 'Gear and requirements',
    rotation: 'Rotation / loop',
    progression: 'How to progress it',
    sourceBuild: 'Open current build and data',
    noBuilds: 'This class does not have a deep build published yet.',
    liveWarning: 'Talent codes, BiS and percentages change with hotfixes. Use this route to understand the build and confirm exact details in the linked source before spending resources.',
    popularity: { 'most-used': 'MOST USED', meta: 'META', starter: 'STARTER', standard: 'STANDARD' },
  },
} as const

const gameColors: Record<string, string> = {
  wow: '#f59e0b',
  diablo: '#ef4444',
  ffxiv: '#60a5fa',
  poe: '#f97316',
}

function normalize(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

export default function ClassGuideDirectory({ lang }: { lang: ClassGuideLang }) {
  const t = copy[lang]
  const [searchParams, setSearchParams] = useSearchParams()
  const activeGame = getClassGuideGame(searchParams.get('game'))
  const requestedClass = searchParams.get('class')
  const requestedBuild = searchParams.get('build')
  const [query, setQuery] = useState('')
  const [activeClassId, setActiveClassId] = useState(() => requestedClass ?? activeGame.entries[0].id)

  useEffect(() => {
    const next = activeGame.entries.some((item) => item.id === requestedClass) ? requestedClass! : activeGame.entries[0].id
    setActiveClassId(next)
  }, [activeGame, requestedClass])

  const filtered = useMemo(() => {
    const term = normalize(query.trim())
    if (!term) return activeGame.entries
    return activeGame.entries.filter((item) => {
      const builds = getPopularBuilds(activeGame.id, item.id).map((build) => build.name).join(' ')
      return normalize(`${item.name} ${item.role[lang]} ${item.playstyle[lang]} ${builds}`).includes(term)
    })
  }, [activeGame.entries, lang, query])

  const activeClass = activeGame.entries.find((item) => item.id === activeClassId) ?? filtered[0] ?? activeGame.entries[0]
  const classBuilds = useMemo(() => getPopularBuilds(activeGame.id, activeClass.id), [activeClass.id, activeGame.id])
  const activeBuild = classBuilds.find((build) => build.id === requestedBuild) ?? classBuilds[0]
  const style = { '--class-guide-color': gameColors[activeGame.id] } as CSSProperties

  function selectGame(gameId: string) {
    const game = getClassGuideGame(gameId)
    const next = new URLSearchParams(searchParams)
    next.set('view', 'classes')
    next.set('game', game.id)
    next.set('class', game.entries[0].id)
    const firstBuild = getPopularBuilds(game.id, game.entries[0].id)[0]
    if (firstBuild) next.set('build', firstBuild.id)
    else next.delete('build')
    setSearchParams(next)
    setQuery('')
  }

  function selectClass(item: ClassGuideEntry) {
    setActiveClassId(item.id)
    const next = new URLSearchParams(searchParams)
    next.set('view', 'classes')
    next.set('game', activeGame.id)
    next.set('class', item.id)
    const firstBuild = getPopularBuilds(activeGame.id, item.id)[0]
    if (firstBuild) next.set('build', firstBuild.id)
    else next.delete('build')
    setSearchParams(next)
  }

  function selectBuild(item: PopularBuild) {
    const next = new URLSearchParams(searchParams)
    next.set('view', 'classes')
    next.set('game', activeGame.id)
    next.set('class', activeClass.id)
    next.set('build', item.id)
    setSearchParams(next)
  }

  return (
    <section className="xk-class-guide" style={style} aria-labelledby="class-guide-title">
      <header className="xk-class-guide-head">
        <div><small>{t.eyebrow}</small><h2 id="class-guide-title">{t.title}</h2><p>{t.description}</p></div>
        <a href={activeGame.sourceHref} target="_blank" rel="noreferrer noopener">{activeGame.sourceLabel} ↗</a>
      </header>

      <nav className="xk-class-game-tabs" aria-label={t.gameLabel}>
        {classGuideGames.map((game) => <button key={game.id} type="button" aria-pressed={game.id === activeGame.id} onClick={() => selectGame(game.id)} style={{ '--class-guide-color': gameColors[game.id] } as CSSProperties}><b>{game.title}</b><small>{game.entries.length} {t.entries}</small></button>)}
      </nav>

      <div className="xk-class-version"><span>{activeGame.version[lang]}</span><b>{activeGame.entries.length} {t.entries}</b></div>

      <div className="xk-class-guide-layout">
        <aside className="xk-class-list">
          <label><span>{t.searchLabel}</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.searchPlaceholder} /></label>
          <div>
            {filtered.map((item) => <button key={item.id} type="button" className={item.id === activeClass.id ? 'is-active' : ''} onClick={() => selectClass(item)}><b>{item.name}</b><small>{item.role[lang]}</small></button>)}
            {!filtered.length ? <p role="status">{t.noResults}</p> : null}
          </div>
        </aside>

        <article className="xk-class-detail" aria-live="polite">
          <header><small>{activeGame.title} // {activeClass.role[lang]}</small><h3>{activeClass.name}</h3><p>{activeClass.playstyle[lang]}</p><div><span>{t.difficulty}</span><b aria-label={`${activeClass.difficulty} / 3`}>{[1, 2, 3].map((level) => <i key={level} className={level <= activeClass.difficulty ? 'is-on' : ''} />)}</b></div></header>
          <div className="xk-class-detail-grid">
            <section><small>{t.strengths}</small><ul>{activeClass.strengths[lang].map((strength) => <li key={strength}>{strength}</li>)}</ul></section>
            <section><small>{t.priorities}</small><ol>{activeClass.priorities[lang].map((priority) => <li key={priority}>{priority}</li>)}</ol></section>
          </div>
          <aside><b>{t.caution}</b><p>{activeClass.caution[lang]}</p></aside>
          <a href={activeClass.sourceHref} target="_blank" rel="noreferrer noopener">{t.source} ↗</a>

          <section className="xk-build-depth" aria-labelledby="build-depth-title">
            <header><div><small>BUILD_LIBRARY // {activeClass.name}</small><h4 id="build-depth-title">{t.buildTitle}</h4></div><b>{classBuilds.length} {t.buildCount}</b></header>
            {classBuilds.length ? <>
              <nav aria-label={t.buildTitle}>{classBuilds.map((build) => <button key={build.id} type="button" className={activeBuild?.id === build.id ? 'is-active' : ''} aria-pressed={activeBuild?.id === build.id} onClick={() => selectBuild(build)}><span>{t.popularity[build.popularity]}</span><b>{build.name}</b><small>{build.activity[lang]}</small></button>)}</nav>
              {activeBuild ? <article className="xk-build-sheet" aria-live="polite">
                <header><div><span>{t.popularity[activeBuild.popularity]}</span><small>{activeBuild.activity[lang]}</small><h5>{activeBuild.name}</h5><p>{activeBuild.summary[lang]}</p></div><aside><small>{t.snapshot}</small><b>{activeBuild.snapshot[lang]}</b></aside></header>
                <div className="xk-build-sheet-grid">
                  <section><small>{t.skills}</small><ul>{activeBuild.skills[lang].map((item) => <li key={item}>{item}</li>)}</ul></section>
                  <section><small>{t.stats}</small><ol>{activeBuild.stats[lang].map((item) => <li key={item}>{item}</li>)}</ol></section>
                  <section><small>{t.gear}</small><ul>{activeBuild.gear[lang].map((item) => <li key={item}>{item}</li>)}</ul></section>
                  <section><small>{t.rotation}</small><ol>{activeBuild.rotation[lang].map((item) => <li key={item}>{item}</li>)}</ol></section>
                  <section><small>{t.progression}</small><ol>{activeBuild.progression[lang].map((item) => <li key={item}>{item}</li>)}</ol></section>
                </div>
                <p className="xk-build-live-warning">{t.liveWarning}</p>
                <a href={activeBuild.sourceHref} target="_blank" rel="noreferrer noopener">{t.sourceBuild}: {activeBuild.sourceLabel} ↗</a>
              </article> : null}
            </> : <p className="xk-build-empty">{t.noBuilds}</p>}
          </section>
        </article>
      </div>
    </section>
  )
}

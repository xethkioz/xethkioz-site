import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { useLang } from '../lib/LangContext'
import { useExperience } from '../lib/ExperienceContext'
import { supportsAmbientVideo } from '../lib/experienceMode'
import { SITE_VERSION } from '../lib/siteConfig'
import './WorldOfXethkiozLanding.css'

type DataSavingConnection = {
  saveData?: boolean
  addEventListener?: (type: 'change', listener: () => void) => void
  removeEventListener?: (type: 'change', listener: () => void) => void
}

type IdleCapableWindow = Window & {
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number
  cancelIdleCallback?: (handle: number) => void
}

function scheduleIdleTask(task: () => void, timeout = 1200) {
  const idleWindow = window as IdleCapableWindow
  if (idleWindow.requestIdleCallback) {
    const handle = idleWindow.requestIdleCallback(task, { timeout })
    return () => idleWindow.cancelIdleCallback?.(handle)
  }
  const handle = window.setTimeout(task, timeout)
  return () => window.clearTimeout(handle)
}

function useAmbientVideoEnabled(graphicsMode: 'full' | 'lite') {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const connection = (navigator as Navigator & { connection?: DataSavingConnection }).connection
    let cancelIdle: (() => void) | undefined

    const sync = () => {
      cancelIdle?.()
      if (!supportsAmbientVideo(graphicsMode) || motionPreference.matches || connection?.saveData) {
        setEnabled(false)
        return
      }
      cancelIdle = scheduleIdleTask(() => setEnabled(true), 900)
    }

    sync()
    motionPreference.addEventListener('change', sync)
    connection?.addEventListener?.('change', sync)
    return () => {
      cancelIdle?.()
      motionPreference.removeEventListener('change', sync)
      connection?.removeEventListener?.('change', sync)
    }
  }, [graphicsMode])

  return enabled
}

function openNexusChat() {
  window.dispatchEvent(new CustomEvent('xethkioz:nexus-chat-open', { detail: { room: 'general' } }))
}

const copy = {
  es: {
    seo: 'World of Xethkioz · Action RPG en desarrollo',
    description: 'Portal oficial de World of Xethkioz y del ecosistema XETHKIOZ.',
    status: 'SAGA I · RESONANCIA PRISMÁTICA · EN DESARROLLO',
    soul: 'UN MUNDO FRACTURADO. UNA FAMILIA UNIDA.',
    lead: 'El tiempo, la memoria, la naturaleza y la tecnología dejaron de obedecer una sola versión de la realidad.',
    supportEyebrow: 'APOYAR // PRODUCCIÓN INDEPENDIENTE',
    supportTitle: 'Ayudar al proyecto también empuja el mundo hacia adelante.',
    supportText: 'Las colaboraciones se destinan a herramientas, arte, infraestructura, pruebas y producción. El apoyo es voluntario y no compra ventajas dentro del juego.',
    final: 'UN MUNDO FRACTURADO NO SE REPARA VOLVIENDO A COMO ERA. SE APRENDE A VIVIR CON LOS CAMINOS QUE AHORA EXISTEN.',
  },
  en: {
    seo: 'World of Xethkioz · Action RPG in development',
    description: 'Official portal for World of Xethkioz and the XETHKIOZ ecosystem.',
    status: 'SAGA I · PRISMATIC RESONANCE · IN DEVELOPMENT',
    soul: 'A FRACTURED WORLD. A UNITED FAMILY.',
    lead: 'Time, memory, nature and technology no longer obey a single version of reality.',
    supportEyebrow: 'SUPPORT // INDEPENDENT PRODUCTION',
    supportTitle: 'Supporting the project helps move the world forward.',
    supportText: 'Contributions go toward tools, art, infrastructure, testing and production. Support is voluntary and never buys gameplay advantages.',
    final: 'A FRACTURED WORLD IS NOT REPAIRED BY GOING BACK TO WHAT IT WAS. YOU LEARN TO LIVE WITH THE PATHS THAT EXIST NOW.',
  },
} as const

export default function Home() {
  const { lang, setLang, localizePath } = useLang()
  const { graphicsMode } = useExperience()
  const videoEnabled = useAmbientVideoEnabled(graphicsMode)
  const t = copy[lang]

  return (
    <>
      <SEO title={t.seo} description={t.description} url="/" image="/assets/world-of-xethkioz/world-of-xethkioz-logo.webp" />
      <main className="wox-home">
        <div className="wox-bg" aria-hidden="true" />
        {videoEnabled && (
          <video
            className="wox-bg-video"
            src="/assets/bg-dragon-animated.mp4"
            poster="/assets/bg-dragon-poster.webp"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
          />
        )}

        <aside className="wox-utility-rail" aria-label={lang === 'es' ? 'Accesos rápidos' : 'Quick access'}>
          <button type="button" onClick={openNexusChat}><span>◉</span><b>CHAT</b></button>
          <Link to={localizePath('/green-node')}><span>◇</span><b>GREEN NODE</b></Link>
          <Link to={localizePath('/support')}><span>＋</span><b>{lang === 'es' ? 'APOYAR' : 'SUPPORT'}</b></Link>
        </aside>

        <header className="wox-topbar">
          <nav className="wox-ecosystem-nav" aria-label={lang === 'es' ? 'Ecosistema XETHKIOZ' : 'XETHKIOZ ecosystem'}>
            <a href="#wox-title">{lang === 'es' ? 'JUEGO' : 'GAME'}</a>
            <a href="https://argenciencia.com/" target="_blank" rel="noopener noreferrer">ARGENCIENCIA <span>↗</span></a>
            <Link to={localizePath('/gaming')}>{lang === 'es' ? 'BIBLIOTECA DE JUEGOS' : 'GAME LIBRARY'}</Link>
            <a href="/mascotas/">{lang === 'es' ? 'MASCOTAS' : 'PETS'}</a>
            <Link to={localizePath('/green-node')}>GREEN NODE</Link>
            <Link to={localizePath('/creacion-web')}>{lang === 'es' ? 'CREADOR WEB' : 'WEB CREATOR'}</Link>
            <Link to={localizePath('/support')}>{lang === 'es' ? 'DONACIONES' : 'DONATIONS'}</Link>
          </nav>
          <details className="wox-mobile-ecosystem">
            <summary>XETHKIOZ <span aria-hidden="true">＋</span></summary>
            <nav aria-label={lang === 'es' ? 'Ecosistema XETHKIOZ móvil' : 'Mobile XETHKIOZ ecosystem'}>
              <a href="#wox-title">{lang === 'es' ? 'JUEGO' : 'GAME'}</a>
              <a href="https://argenciencia.com/" target="_blank" rel="noopener noreferrer">ARGENCIENCIA <span>↗</span></a>
              <Link to={localizePath('/gaming')}>{lang === 'es' ? 'BIBLIOTECA DE JUEGOS' : 'GAME LIBRARY'}</Link>
              <a href="/mascotas/">{lang === 'es' ? 'MASCOTAS' : 'PETS'}</a>
              <Link to={localizePath('/green-node')}>GREEN NODE</Link>
              <Link to={localizePath('/creacion-web')}>{lang === 'es' ? 'CREADOR WEB' : 'WEB CREATOR'}</Link>
              <Link to={localizePath('/support')}>{lang === 'es' ? 'DONACIONES' : 'DONATIONS'}</Link>
            </nav>
          </details>
          <div className="wox-tools">
            <Link to="/news" className="wox-news-link">{lang === 'es' ? 'NOTICIAS' : 'NEWS'}</Link>
            <button type="button" onClick={() => setLang(lang === 'es' ? 'en' : 'es')} aria-label={lang === 'es' ? 'Cambiar a inglés' : 'Switch to Spanish'}>{lang === 'es' ? 'EN' : 'ES'}</button>
            <Link to="/login">{lang === 'es' ? 'INICIAR SESIÓN' : 'SIGN IN'}</Link>
          </div>
        </header>

        <section className="wox-hero" aria-labelledby="wox-title">
          <h1 id="wox-title" className="sr-only">World of Xethkioz</h1>
          <div className="wox-hero-frame" aria-hidden="true"><span /><span /><span /><span /></div>
          <div className="wox-hero-core">
            <div className="wox-hero-overline" aria-hidden="true"><span>XK // PRISMATIC RESONANCE</span><span>SAGA I // PRISMATIC FRACTURE</span></div>
            <picture className="wox-logo-wrap">
              <source srcSet="/assets/world-of-xethkioz/world-of-xethkioz-logo.webp" type="image/webp" />
              <img src="/assets/world-of-xethkioz/world-of-xethkioz-logo.svg" alt="World of Xethkioz" className="wox-world-logo" />
            </picture>
            <p className="wox-status">{t.status}</p>
            <h2>{t.soul}</h2>
            <p className="wox-lead">{t.lead}</p>
            <div className="wox-actions">
              <a href="#wox-title" onClick={(event) => { event.preventDefault(); openNexusChat() }}>{lang === 'es' ? 'ABRIR CHAT' : 'OPEN CHAT'} <span>◉</span></a>
              <Link to={localizePath('/green-node')}>GREEN NODE <span>↗</span></Link>
              <Link to={localizePath('/support')}>{lang === 'es' ? 'APOYAR PROYECTO' : 'SUPPORT PROJECT'} <span>↗</span></Link>
            </div>
            <div className="wox-hero-specs" aria-label={lang === 'es' ? 'Datos principales de Saga I' : 'Saga I key facts'}>
              <span><strong>04+1</strong><b>{lang === 'es' ? 'REGIONES' : 'REGIONS'}</b></span>
              <span><strong>32</strong><b>{lang === 'es' ? 'MAPAS' : 'MAPS'}</b></span>
              <span><strong>08</strong><b>{lang === 'es' ? 'FORMAS' : 'FORMS'}</b></span>
              <span><strong>G4</strong><b>GODOT 4 · ARPG 2D</b></span>
            </div>
          </div>
        </section>

        <div className="wox-content">
          <section id="support" className="wox-support-card" aria-labelledby="support-title">
            <div>
              <p>{t.supportEyebrow}</p>
              <h2 id="support-title">{t.supportTitle}</h2>
              <span>{t.supportText}</span>
            </div>
            <Link to={localizePath('/support')}>{lang === 'es' ? 'VER FORMAS DE APOYAR' : 'SEE SUPPORT OPTIONS'}<span>↗</span></Link>
          </section>

          <section className="wox-final" aria-label={lang === 'es' ? 'Mensaje final' : 'Final statement'}>
            <span aria-hidden="true">◇</span>
            <p>{t.final}</p>
            <span aria-hidden="true">◇</span>
          </section>

          <footer className="wox-footer">
            <div className="wox-tech-seals" aria-label={lang === 'es' ? 'Tecnologías y red' : 'Technology and network'}>
              <span>GODOT 4</span><span>TRIPO 3D</span><span>GREEN NODE</span><span>VEYR/WISP</span>
            </div>
            <div>
              <small className="wox-footer-status">{lang === 'es' ? 'SAGA I // EN DESARROLLO' : 'SAGA I // IN DEVELOPMENT'}</small>
              <strong>WORLD OF XETHKIOZ</strong>
              <span>© 2026 XETHKIOZ · {SITE_VERSION}</span>
              <small>{lang === 'es' ? 'Arte conceptual promocional. Los assets, modelos y materiales internos del juego no se publican en esta superficie.' : 'Promotional concept art. Internal game assets, models and production materials are not published on this surface.'}</small>
              <small className="wox-footer-owner">{lang === 'es' ? 'XETHKIOZ es propiedad de Alexis Díaz Santajulia. Todos los derechos reservados.' : 'XETHKIOZ is the property of Alexis Díaz Santajulia. All rights reserved.'}</small>
            </div>
            <nav aria-label={lang === 'es' ? 'Enlaces del sitio' : 'Site links'}>
              <Link to={localizePath('/support')}>{lang === 'es' ? 'Apoyar proyecto' : 'Support project'}</Link>
              <Link to={localizePath('/privacy')}>{lang === 'es' ? 'Privacidad' : 'Privacy'}</Link>
              <Link to={localizePath('/contact')}>{lang === 'es' ? 'Contacto' : 'Contact'}</Link>
            </nav>
          </footer>
        </div>
      </main>
    </>
  )
}

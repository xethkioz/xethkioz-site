import { useState } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { useLang } from '../lib/LangContext'
import PortalNavigation from '../components/portals/PortalNavigation'
import PortalEffects from '../components/portals/PortalEffects'
import PortalSupport from '../components/portals/PortalSupport'
import { useWisp } from '../providers/WispProvider'
import './HomePortals.css'

type Universe = 'aion2' | 'wow'

export default function Home() {
  const { lang, localizePath } = useLang()
  const { triggerGreenPortal } = useWisp()
  const [universe, setUniverse] = useState<Universe>('aion2')
  const es = lang === 'es'
  const aion = universe === 'aion2'
  const c = aion ? {
    accent: 'aion', code: 'PORTAL CELESTIAL // 001', image: '/assets/portals/fire-portal.webp',
    subtitle: es ? 'El cielo y la oscuridad vuelven a enfrentarse.' : 'Heaven and darkness face each other once more.',
    description: es ? 'Atravesá el umbral de Atreia. Prepará tu clase, descubrí estrategias y encontrá tu lugar entre Elyos y Asmodians.' : 'Cross the threshold to Atreia. Prepare your class, discover strategies and find your place among Elyos and Asmodians.',
    quick: es ? 'ACCESOS RÁPIDOS · GUÍAS DE CLASE' : 'QUICK ACCESS · CLASS GUIDES',
  } : {
    accent: 'wow', code: 'PORTAL LEGENDARIO // 002', image: '/assets/portal-games-world-v3.webp',
    subtitle: es ? 'Azeroth te está esperando.' : 'Azeroth is waiting for you.',
    description: es ? 'Volvé a vivir la aventura. Explorá builds, prepará tu personaje y descubrí nuevas rutas para tu próxima expedición.' : 'Return to the adventure. Explore builds, prepare your character and discover new routes for your next expedition.',
    quick: es ? 'ACCESOS RÁPIDOS · BIBLIOTECA GAMER' : 'QUICK ACCESS · GAMING LIBRARY',
  }
  const guides = aion ? [
    { icon: '♫', title: es ? 'Guía de Bardo' : 'Bard Guide', detail: es ? 'Soporte · Ritmo · Sinergia' : 'Support · Rhythm · Synergy' },
    { icon: 'ᛉ', title: es ? 'Guía de Brujo' : 'Warlock Guide', detail: es ? 'Magia oscura · Control · Daño' : 'Dark magic · Control · Damage' },
  ] : [
    { icon: '⚔', title: es ? 'Guías de clase' : 'Class guides', detail: es ? 'Talentos · Rotación · Equipo' : 'Talents · Rotation · Gear' },
    { icon: '◇', title: es ? 'Builds y progresión' : 'Builds & progression', detail: es ? 'Preparación para endgame' : 'Endgame preparation' },
  ]

  return <>
    <SEO title="World of Xethkioz" description={es ? 'Entrá a los universos de Aion 2 y WoWForever. Guías gamer, Mascotas, Xethkioz Digital y Green Node.' : 'Enter the worlds of Aion 2 and WoWForever. Gaming guides, Pets, Xethkioz Digital and Green Node.'} url="/" image="/assets/world-of-xethkioz/world-of-xethkioz-logo.webp" />
    <main className="wox-home portal-home xk-launcher-home" data-public-presentation="fantasy" data-portal-theme={universe}>
      <PortalNavigation home />
      <header className="portal-home__brand xk-launcher-brand">
        <h1><img src="/assets/world-of-xethkioz/world-of-xethkioz-logo.webp" width="1584" height="483" alt="World of Xethkioz" fetchPriority="high" decoding="async" /></h1>
        <p>{es ? 'Elegí tu mundo. Escribí tu leyenda.' : 'Choose your world. Write your legend.'}</p>
      </header>
      <section className="xk-launcher-main" aria-label={es ? 'Selector de universos' : 'Universe selector'}>
        <div className="xk-launcher-intro"><span className="xk-launcher-overline"><i aria-hidden="true" />{es ? 'UN UNIVERSO. INFINITAS RUTAS.' : 'ONE UNIVERSE. INFINITE PATHS.'}</span><p>{es ? 'Tu próxima aventura empieza acá.' : 'Your next adventure starts here.'}</p></div>
        <div className="xk-universe-tabs" role="tablist" aria-label={es ? 'Elegir universo' : 'Choose a universe'}>
          <button type="button" role="tab" id="tab-aion2" aria-selected={aion} aria-controls="universe-panel" onClick={() => setUniverse('aion2')} className={aion ? 'is-active is-aion' : 'is-aion'}><span aria-hidden="true">✧</span><span>AION 2</span><small>{es ? 'PORTAL CELESTIAL' : 'CELESTIAL PORTAL'}</small></button>
          <button type="button" role="tab" id="tab-wowforever" aria-selected={!aion} aria-controls="universe-panel" onClick={() => setUniverse('wow')} className={!aion ? 'is-active is-wow' : 'is-wow'}><span aria-hidden="true">ᛟ</span><span>WOWFOREVER</span><small>{es ? 'PORTAL LEGENDARIO' : 'LEGENDARY PORTAL'}</small></button>
        </div>
        <section id="universe-panel" role="tabpanel" aria-labelledby={aion ? 'tab-aion2' : 'tab-wowforever'} key={universe} className={'xk-launcher-hero is-' + c.accent}>
          <div className="xk-launcher-hero__art" aria-hidden="true"><img src={c.image} alt="" fetchPriority="high" /><span className="xk-launcher-hero__art-vignette" /><span className="xk-launcher-hero__rune xk-launcher-hero__rune--one">ᚷ</span><span className="xk-launcher-hero__rune xk-launcher-hero__rune--two">✧</span><PortalEffects tone={aion ? 'fire' : 'ice'} count={7} /></div>
          <div className="xk-launcher-hero__content">
            <span className="xk-launcher-hero__code">{c.code}</span><h2>{aion ? <>AION <em>2</em></> : <>WOW<em>FOREVER</em></>}</h2>
            <p className="xk-launcher-hero__subtitle">{c.subtitle}</p><p className="xk-launcher-hero__description">{c.description}</p>
            <div className="xk-launcher-hero__actions"><Link to={localizePath(aion ? '/gaming' : '/gaming/guides')} className="xk-launcher-primary"><span aria-hidden="true">⟡</span>{es ? 'EXPLORAR PORTAL' : 'EXPLORE PORTAL'}<b aria-hidden="true">↗</b></Link><Link to={localizePath('/gaming/guides')} className="xk-launcher-secondary"><span aria-hidden="true">⌘</span>{es ? 'BIBLIOTECA DE GUÍAS' : 'GUIDE LIBRARY'}</Link></div>
            <div className="xk-launcher-divider" /><div className="xk-launcher-guides"><p>{c.quick}</p><div className="xk-launcher-guide-grid">
              {guides.map(g => <Link key={g.title} to={localizePath('/gaming/guides')} className="xk-launcher-guide"><span className="xk-launcher-guide__sigil" aria-hidden="true">{g.icon}</span><span><b>{g.title}</b><small>{g.detail}</small></span><i aria-hidden="true">↗</i></Link>)}
            </div></div>
            <div className="xk-launcher-hero__foot"><span>WX / {aion ? '001' : '002'}</span><span><i />{es ? 'PORTAL DISPONIBLE' : 'PORTAL AVAILABLE'}</span></div>
          </div>
        </section>
        <section className="xk-launcher-secondary" aria-label={es ? 'Otros portales' : 'Other portals'}>
          <Link to="/mascotas/" className="xk-launcher-mini xk-launcher-mini--pets"><span className="xk-launcher-mini__icon" aria-hidden="true">✣</span><span className="xk-launcher-mini__copy"><small>COMPANION COLLECTION</small><b>{es ? 'Mascotas' : 'Pets'}</b><i>{es ? 'Compañeros para cada aventura.' : 'Companions for every adventure.'}</i></span><span className="xk-launcher-mini__arrow" aria-hidden="true">↗</span></Link>
          <Link to={localizePath('/digital')} className="xk-launcher-mini xk-launcher-mini--digital"><span className="xk-launcher-mini__icon" aria-hidden="true">⌘</span><span className="xk-launcher-mini__copy"><small>CREATIVE TECHNOLOGY</small><b>Xethkioz Digital</b><i>{es ? 'IA, desarrollo e innovación digital.' : 'AI, development and digital innovation.'}</i></span><span className="xk-launcher-mini__arrow" aria-hidden="true">↗</span></Link>
        </section>
        <Link className="xk-launcher-green" to={localizePath('/green-node')} onClick={triggerGreenPortal}><img src="/assets/portals/node-rift.webp" alt="" width="1500" height="190" loading="lazy" decoding="async" /><span className="xk-launcher-green__grid" aria-hidden="true" /><span className="xk-launcher-green__mark" aria-hidden="true">⌖</span><span className="xk-launcher-green__copy"><small>NETWORK // SYSTEMS // INTELLIGENCE</small><b>GREEN NODE</b><i>{es ? 'Tecnología, sistemas y conexiones inteligentes.' : 'Technology, systems and intelligent connections.'}</i></span><span className="xk-launcher-green__action">{es ? 'EXPLORAR SISTEMA' : 'EXPLORE SYSTEM'} <b aria-hidden="true">↗</b></span></Link>
      </section>
      <p className="portal-home__disclaimer">{es ? 'ARTE PROMOCIONAL · EXPERIENCIA DE PORTAL' : 'PROMOTIONAL ART · PORTAL EXPERIENCE'}</p><PortalSupport />
    </main>
  </>
}

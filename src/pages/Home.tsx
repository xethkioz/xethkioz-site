import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { useLang } from '../lib/LangContext'
import PortalNavigation from '../components/portals/PortalNavigation'
import PortalEffects from '../components/portals/PortalEffects'
import PortalSupport from '../components/portals/PortalSupport'
import { useWisp } from '../providers/WispProvider'
import './HomePortals.css'

export default function Home() {
  const { lang, localizePath } = useLang()
  const { triggerGreenPortal } = useWisp()
  const es = lang === 'es'
  const innerCirclePath = localizePath('/aion2/innercircle')
  const portals = [
    { tone: 'innercircle', title: 'Aion 2 · Clan · InnerCircle', image: '/assets/portals/fire-portal.webp', sub: es ? 'Legión Elyos · Black Metal' : 'Elyos Legion · Black Metal', action: es ? 'Entrar a InnerCircle' : 'Enter InnerCircle', href: innerCirclePath, image: undefined },
    { tone: 'nature', title: es ? 'Mascotas' : 'Pets', sub: 'Huellas Argentina', action: es ? 'Entrar a Mascotas' : 'Enter Pets', href: '/mascotas/', image: undefined },
    { tone: 'ice', title: 'Xethkioz Digital', sub: es ? 'Creación web · VEYR · ArgenCiencia' : 'Web creation · VEYR · ArgenCiencia', action: es ? 'Explorar tecnología' : 'Explore technology', href: localizePath('/digital'), image: undefined },
  ] as const
  return <>
    <SEO title="XETHKIOZ" description={es ? 'Cuatro portales. Una misma identidad. AION 2 · InnerCircle, Mascotas, Xethkioz Digital y Green Node.' : 'Four portals. One universe. AION 2 InnerCircle, Pets, Xethkioz Digital and Green Node.'} url="/" image="/assets/portal-games-clean-v1.webp"/>
    <main className="xk-home portal-home" data-public-presentation="fantasy" data-portal-theme="convergence">
      <PortalNavigation home/>
      <header className="portal-home__brand">
        <h1>XETHKIOZ</h1>
        <p>{es ? 'Gaming · Tecnología · Comunidad' : 'Gaming · Technology · Community'}</p>
      </header>
      <nav className="portal-home__destinations" aria-label={es ? 'Elegí tu portal' : 'Choose your portal'}>
        <div className="portal-triad">
          {portals.map(portal => {
            const content = <>
              <div className="portal-gate__visual">
                <picture><source media="(max-width: 600px)" srcSet={portal.image ?? `/assets/portals/${portal.tone}-portal-mobile.webp`}/><img src={portal.image ?? `/assets/portals/${portal.tone}-portal.webp`} alt="" width="600" height="420" decoding="async" loading="eager"/></picture>
                <span className="portal-gate__aura" aria-hidden="true"/><PortalEffects tone={portal.tone}/>
              </div>
              <div className="portal-gate__copy"><h2>{portal.title}</h2><p>{portal.sub}</p><span className="portal-gate__enter">{portal.action}<b aria-hidden="true">›</b></span></div>
            </>
            return portal.tone === 'nature'
              ? <a key={portal.tone} href={portal.href} className="portal-gate" data-tone={portal.tone}>{content}</a>
              : <Link key={portal.tone} to={portal.href} className="portal-gate" data-tone={portal.tone}>{content}</Link>
          })}
        </div>
        <Link className="portal-node-rift" data-tone="node" to={localizePath('/green-node')} onClick={triggerGreenPortal}>
          <img src="/assets/portals/node-rift.webp" alt="" width="1500" height="190" decoding="async"/>
          <PortalEffects tone="node" count={7}/>
          <span className="portal-node-rift__aside" aria-hidden="true">{es ? 'DONDE LA REALIDAD SE DISTORSIONA' : 'WHERE REALITY DISTORTS'}</span>
          <div className="portal-node-rift__copy"><span className="portal-node-rift__sigil" aria-hidden="true">⌖</span><h2>GREEN NODE</h2><span className="portal-gate__enter">{es ? 'Entrar a Green Node' : 'Enter Green Node'}<b aria-hidden="true">›</b></span></div>
          <span className="portal-node-rift__aside" aria-hidden="true">LINUX · CÓDIGO · SEGURIDAD</span>
        </Link>
      </nav>
      <p className="portal-home__disclaimer">{es ? 'XETHKIOZ · RED DE PORTALES' : 'XETHKIOZ · PORTAL NETWORK'}</p>
      <PortalSupport/>
    </main>
  </>
}

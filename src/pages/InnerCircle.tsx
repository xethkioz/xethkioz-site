import SEO from '../components/SEO'
import { useLang } from '../lib/LangContext'
import PortalNavigation from '../components/portals/PortalNavigation'
import PortalEffects from '../components/portals/PortalEffects'
import './InnerCircle.css'

export default function InnerCircle() {
  const { lang } = useLang()
  const es = lang === 'es'
  return (
    <main className="portal-page innercircle-page" data-public-presentation="gaming" data-portal-theme="innercircle">
      <SEO
        title="AION 2 - Clan - InnerCircle | Legión Elyos"
        description={es ? 'AION 2 - Clan - InnerCircle. Legión Elyos · Reclutamiento abierto, PvPvE, asedios y espíritu Black Metal.' : 'InnerCircle · AION 2 Elyos Legion. Open recruitment, PvPvE, sieges and a Black Metal spirit.'}
        url="/aion2/innercircle"
        image="/assets/portals/fire-portal.webp"
      />
      <PortalNavigation/>
      <section className="innercircle-hero portal-content" aria-labelledby="innercircle-title">
        <div className="innercircle-hero__copy">
          <p className="portal-eyebrow">♰ AION 2 · INNERCIRCLE ♰</p>
          <h1 id="innercircle-title">Inner<span>Circle.</span></h1>
          <p className="innercircle-kicker">{es ? 'Legión Elyos · Reclutamiento abierto' : 'Elyos Legion · Open recruitment'}</p>
          <blockquote>“{es ? 'La luz de Sanctum consuela; la nuestra calcina.' : 'The light of Sanctum comforts; ours burns.'}”</blockquote>
          <p className="innercircle-lead">
            {es
              ? 'Una orden de Daevas inspirada en la mística del Black Metal y el celo absoluto de Atreia. Alas sagradas, rostros de ceniza y una sola dirección: entrar al Abismo y dominarlo.'
              : 'An order of Daevas inspired by Black Metal mysticism and the absolute zeal of Atreia. Sacred wings, ashen faces and one direction: enter the Abyss and master it.'}
          </p>
          <div className="innercircle-tags"><span>ELYOS</span><span>PVPVE</span><span>ASEDIOS</span><span>DISCORD</span></div>
          <a className="innercircle-cta" href="#reclutamiento">{es ? 'Ver reclutamiento' : 'View recruitment'} <b aria-hidden="true">↓</b></a>
          <PortalEffects tone="innercircle" count={9}/>
        </div>
        <figure className="innercircle-hero__art">
          <div className="innercircle-hero__halo" aria-hidden="true"/>
          <img src="/assets/portals/fire-portal.webp" alt={es ? 'Arte atmosférico de AION 2 para InnerCircle' : 'Atmospheric AION 2 artwork for InnerCircle'} width="900" height="506" fetchPriority="high" decoding="async"/>
          <figcaption>{es ? 'AION 2 · ATREIA · LEGIÓN ELYOS' : 'AION 2 · ATREIA · ELYOS LEGION'}</figcaption>
        </figure>
      </section>

      <div className="portal-content innercircle-body">
        <section className="portal-section innercircle-manifesto" aria-labelledby="manifesto-title">
          <div><p className="portal-eyebrow">{es ? 'LA ORDEN' : 'THE ORDER'}</p><h2 id="manifesto-title">{es ? 'No buscamos cantidad. Buscamos núcleo.' : 'We do not seek numbers. We seek a core.'}</h2></div>
          <p>{es ? 'Buscamos jugadores activos, comprometidos y con mentalidad de equipo para consolidar un núcleo sólido en PvPvE y asedios. Ambiente maduro, sin dramas y enfocado en la hermandad.' : 'We seek active, committed team players to build a strong core for PvPvE and sieges. A mature, drama-free environment focused on brotherhood.'}</p>
        </section>

        <section className="portal-section innercircle-grid-section" aria-labelledby="offers-title">
          <header><p className="portal-eyebrow">⚔</p><h2 id="offers-title">{es ? 'Lo que ofrecemos' : 'What we offer'}</h2></header>
          <div className="innercircle-grid">
            {(es
              ? ['Núcleo activo y organizado para progreso constante.','Grupos diarios para Fisuras, farmeo de Éter y mazmorras.','Escuadrones tácticos para PvP de campo y Asedios de Fortaleza.','Discord con guías, builds y canales de voz.','Ambiente maduro, sin dramas y enfocado en la hermandad.']
              : ['An active, organized core built for steady progression.','Daily groups for rifts, Aether farming and dungeons.','Tactical squads for open-field PvP and Fortress Sieges.','Discord with guides, builds and voice channels.','A mature, drama-free environment focused on brotherhood.']
            ).map((item,index)=><article key={item}><span>0{index+1}</span><p>{item}</p></article>)}
          </div>
        </section>

        <section id="reclutamiento" className="portal-section innercircle-recruit" aria-labelledby="requirements-title">
          <div>
            <p className="portal-eyebrow">📜 {es ? 'REQUISITOS' : 'REQUIREMENTS'}</p>
            <h2 id="requirements-title">{es ? '¿Tenés alas? Entrá.' : 'Got wings? Enter.'}</h2>
            <ul>
              <li>{es ? 'Facción: Elyos.' : 'Faction: Elyos.'}</li>
              <li>{es ? 'Actividad constante, especialmente en eventos y asedios.' : 'Consistent activity, especially during events and sieges.'}</li>
              <li>{es ? 'Discord obligatorio; micrófono requerido para PvP.' : 'Discord required; microphone required for PvP calls.'}</li>
              <li>{es ? 'Compromiso, respeto mutuo y ganas de mejorar.' : 'Commitment, mutual respect and a drive to improve.'}</li>
            </ul>
          </div>
          <aside>
            <p className="portal-eyebrow">🕯 {es ? 'CÓMO UNIRTE' : 'HOW TO JOIN'}</p>
            <p>{es ? 'Mandame un privado a @Xethkioz con:' : 'Send a private message to @Xethkioz with:'}</p>
            <ol><li>{es ? 'Nombre de personaje y clase.' : 'Character name and class.'}</li><li>{es ? 'Nivel actual y disponibilidad horaria.' : 'Current level and availability.'}</li><li>{es ? 'Experiencia previa en Aion u otros MMORPGs (opcional).' : 'Previous Aion or MMORPG experience (optional).'}</li></ol>
            <div className="innercircle-discord">{es ? 'DISCORD · ENLACE DE INVITACIÓN PRÓXIMAMENTE' : 'DISCORD · INVITE LINK COMING SOON'}</div>
          </aside>
        </section>

        <section className="portal-section innercircle-final" aria-label={es ? 'Cierre InnerCircle' : 'InnerCircle closing'}>
          <p>♰</p><strong>{es ? 'Aion juzgará las cenizas.' : 'Aion will judge the ashes.'}</strong><span>AION 2 · INNERCIRCLE</span>
        </section>
      </div>
    </main>
  )
}

import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { useLang } from '../lib/LangContext'
import './WorldOfXethkiozPortal.css'

const regions = [
  { id: 'izrdralar', es: 'Izrdralar', en: 'Izrdralar', metaEs: 'Juego base · M01–M08', metaEn: 'Base game · M01–M08', art: '/assets/world-of-xethkioz/web-art/biome-izrdralar.svg' },
  { id: 'desfralar', es: 'Desfralar', en: 'Desfralar', metaEs: 'Expansión I · M09–M17', metaEn: 'Expansion I · M09–M17', art: '/assets/world-of-xethkioz/web-art/biome-desfralar.svg' },
  { id: 'xiomalar', es: 'Xiomalar', en: 'Xiomalar', metaEs: 'Expansión II · M18–M25', metaEn: 'Expansion II · M18–M25', art: '/assets/world-of-xethkioz/web-art/biome-xiomalar.svg' },
  { id: 'zodnight', es: 'Zodnight', en: 'Zodnight', metaEs: 'Cierre Saga I · M26–M32', metaEn: 'Saga I finale · M26–M32', art: '/assets/world-of-xethkioz/web-art/biome-zodnight.svg' },
  { id: 'isla-temporal', es: 'Isla Temporal', en: 'Temporal Island', metaEs: 'Post-final · bucle temporal', metaEn: 'Post-finale · temporal loop', art: '/assets/world-of-xethkioz/web-art/biome-isla-temporal.svg' },
] as const

const cast = [
  { name: 'Xethkioz', code: 'XK', kindEs: 'Resonancia viva', kindEn: 'Living resonance', art: '/assets/world-of-xethkioz/web-art/xethkioz-resonance-sigil.svg' },
  { name: 'Player', code: 'Ø', kindEs: 'Viajero etéreo', kindEn: 'Ethereal traveler', art: '/assets/world-of-xethkioz/web-art/player-etereo-sigil.svg' },
  { name: 'Ashley', code: 'A', kindEs: 'Hermana · Mentora', kindEn: 'Sibling · Mentor', art: null },
  { name: 'Fermín', code: 'F', kindEs: 'Hermano · Mentor', kindEn: 'Sibling · Mentor', art: null },
  { name: 'Isabella', code: 'I', kindEs: 'Hermana · Mentora', kindEn: 'Sibling · Mentor', art: null },
  { name: 'Gael', code: 'G', kindEs: 'Hermano · Mentor', kindEn: 'Sibling · Mentor', art: null },
] as const

const copy = {
  es: {
    seo: 'World of Xethkioz · Portal oficial del juego',
    description: 'Portal interno de World of Xethkioz: Saga I, regiones, protagonistas y arte conceptual protegido.',
    eyebrow: 'WORLD OF XETHKIOZ // PORTAL DEL JUEGO',
    title: 'UN MUNDO FRACTURADO. UNA FAMILIA UNIDA.',
    lead: 'La Saga I se explora fuera del Home para mantener la portada limpia. Esta superficie presenta el universo mediante arte web protegido, sin publicar modelos, capturas ni assets internos.',
    navStory: 'HISTORIA',
    navWorld: 'MUNDO',
    navCast: 'CONVERGENCIA',
    navArt: 'ARTE VISUAL',
    storyEyebrow: 'SAGA I // RESONANCIA PRISMÁTICA',
    storyTitle: 'La Fisura cambió las reglas del mundo.',
    storyBody: 'Tiempo, memoria, naturaleza y tecnología dejaron de obedecer una sola versión de la realidad. El Player atraviesa ese mundo junto a Xethkioz, mientras los cuatro hermanos funcionan como puntos humanos de guía, aprendizaje y conexión.',
    worldEyebrow: '05 TERRITORIOS // 32 MAPAS',
    worldTitle: 'Cinco territorios. Una sola fractura.',
    castEyebrow: 'NÚCLEO VISUAL // 06 IDENTIDADES',
    castTitle: 'La familia, el viajero y Xethkioz.',
    castBody: 'La representación pública de esta etapa se limita deliberadamente a estas seis identidades. Los diseños internos, modelos 3D y materiales de producción permanecen reservados.',
    artEyebrow: 'ARTE VISUAL // PROTECCIÓN DE IP',
    artTitle: 'Mostramos atmósfera, no archivos de producción.',
    artBody: 'Bocetos promocionales, sigilos, composiciones conceptuales y biomas estilizados pueden publicarse. Modelos crudos, rigs, texturas maestras, capturas internas y documentación sensible no se exponen en la web.',
    back: 'VOLVER AL HOME',
    support: 'APOYAR EL PROYECTO',
  },
  en: {
    seo: 'World of Xethkioz · Official game portal',
    description: 'World of Xethkioz internal portal: Saga I, regions, protagonists and protected concept art.',
    eyebrow: 'WORLD OF XETHKIOZ // GAME PORTAL',
    title: 'A FRACTURED WORLD. A UNITED FAMILY.',
    lead: 'Saga I lives outside the Home to keep the main landing clean. This surface presents the universe through protected web art without publishing internal models, screenshots or production assets.',
    navStory: 'STORY',
    navWorld: 'WORLD',
    navCast: 'CONVERGENCE',
    navArt: 'VISUAL ART',
    storyEyebrow: 'SAGA I // PRISMATIC RESONANCE',
    storyTitle: 'The Fracture changed the rules of the world.',
    storyBody: 'Time, memory, nature and technology no longer obey a single version of reality. The Player crosses that world with Xethkioz while the four siblings remain human points of guidance, learning and connection.',
    worldEyebrow: '05 TERRITORIES // 32 MAPS',
    worldTitle: 'Five territories. One fracture.',
    castEyebrow: 'VISUAL CORE // 06 IDENTITIES',
    castTitle: 'The family, the traveler and Xethkioz.',
    castBody: 'The public representation of this stage is deliberately limited to these six identities. Internal designs, 3D models and production materials remain private.',
    artEyebrow: 'VISUAL ART // IP PROTECTION',
    artTitle: 'We show atmosphere, not production files.',
    artBody: 'Promotional sketches, sigils, concept compositions and stylized biomes may be published. Raw models, rigs, master textures, internal captures and sensitive documentation are not exposed on the website.',
    back: 'BACK TO HOME',
    support: 'SUPPORT THE PROJECT',
  },
} as const

export default function WorldOfXethkioz() {
  const { lang, localizePath } = useLang()
  const t = copy[lang]

  return (
    <>
      <SEO title={t.seo} description={t.description} url={localizePath('/world-of-xethkioz')} image="/assets/world-of-xethkioz/world-of-xethkioz-logo.webp" />
      <main className="wox-portal">
        <div className="wox-portal-ambient" aria-hidden="true" />

        <section className="wox-portal-hero" aria-labelledby="wox-portal-title">
          <div className="wox-portal-hero-copy">
            <p>{t.eyebrow}</p>
            <img src="/assets/world-of-xethkioz/world-of-xethkioz-logo.webp" alt="World of Xethkioz" />
            <h1 id="wox-portal-title">{t.title}</h1>
            <span>{t.lead}</span>
          </div>

          <div className="wox-portal-orbit" aria-label={lang === 'es' ? 'Núcleo público de personajes' : 'Public character core'}>
            {cast.map((member, index) => (
              <article key={member.name} style={{ '--orbit-index': index } as CSSProperties}>
                {member.art ? <img src={member.art} alt="" aria-hidden="true" /> : <i aria-hidden="true">{member.code}</i>}
                <strong>{member.name}</strong>
                <small>{lang === 'es' ? member.kindEs : member.kindEn}</small>
              </article>
            ))}
          </div>

          <nav className="wox-portal-anchor-nav" aria-label={lang === 'es' ? 'Capítulos del juego' : 'Game chapters'}>
            <a href="#historia">{t.navStory}</a>
            <a href="#mundo">{t.navWorld}</a>
            <a href="#convergencia">{t.navCast}</a>
            <a href="#arte-visual">{t.navArt}</a>
          </nav>
        </section>

        <section id="historia" className="wox-portal-chapter wox-portal-story">
          <div>
            <p>{t.storyEyebrow}</p>
            <h2>{t.storyTitle}</h2>
            <span>{t.storyBody}</span>
          </div>
          <div className="wox-portal-fracture" aria-hidden="true"><i /><i /><i /></div>
        </section>

        <section id="mundo" className="wox-portal-world">
          <header>
            <p>{t.worldEyebrow}</p>
            <h2>{t.worldTitle}</h2>
          </header>
          <div className="wox-portal-regions">
            {regions.map((region, index) => (
              <article key={region.id} style={{ '--region-art': 'url(' + region.art + ')' } as CSSProperties}>
                <small>0{index + 1}</small>
                <strong>{lang === 'es' ? region.es : region.en}</strong>
                <span>{lang === 'es' ? region.metaEs : region.metaEn}</span>
              </article>
            ))}
          </div>
        </section>

        <section id="convergencia" className="wox-portal-chapter wox-portal-cast">
          <header>
            <p>{t.castEyebrow}</p>
            <h2>{t.castTitle}</h2>
            <span>{t.castBody}</span>
          </header>
          <div className="wox-portal-cast-line">
            {cast.map((member) => (
              <article key={member.name}>
                <div>{member.art ? <img src={member.art} alt="" aria-hidden="true" /> : <i aria-hidden="true">{member.code}</i>}</div>
                <strong>{member.name}</strong>
              </article>
            ))}
          </div>
        </section>

        <section id="arte-visual" className="wox-portal-art">
          <div>
            <p>{t.artEyebrow}</p>
            <h2>{t.artTitle}</h2>
            <span>{t.artBody}</span>
          </div>
          <div className="wox-portal-art-surface" aria-hidden="true">
            <i /><i /><i /><b>IP</b>
          </div>
        </section>

        <footer className="wox-portal-footer">
          <Link to={localizePath('/')}>{t.back}</Link>
          <Link to={localizePath('/support')}>{t.support}</Link>
        </footer>
      </main>
    </>
  )
}

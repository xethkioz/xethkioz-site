import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { useLang } from '../lib/LangContext'
import { useExperience } from '../lib/ExperienceContext'
import { supportsAmbientVideo } from '../lib/experienceMode'
import { SITE_VERSION } from '../lib/siteConfig'
import './WorldOfXethkiozHome.css'

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
    const desktopViewport = window.matchMedia('(min-width: 900px)')
    const connection = (navigator as Navigator & { connection?: DataSavingConnection }).connection
    let cancelIdle: (() => void) | undefined

    const sync = () => {
      cancelIdle?.()
      if (!supportsAmbientVideo(graphicsMode) || motionPreference.matches || connection?.saveData) {
        setEnabled(false)
        return
      }
      cancelIdle = scheduleIdleTask(() => setEnabled(true), desktopViewport.matches ? 900 : 1500)
    }

    sync()
    motionPreference.addEventListener('change', sync)
    desktopViewport.addEventListener('change', sync)
    connection?.addEventListener?.('change', sync)
    return () => {
      cancelIdle?.()
      motionPreference.removeEventListener('change', sync)
      desktopViewport.removeEventListener('change', sync)
      connection?.removeEventListener?.('change', sync)
    }
  }, [graphicsMode])
  return enabled
}
const copy = {
  es: {
    seo: 'World of Xethkioz · Action RPG en desarrollo',
    description: 'Sitio oficial de World of Xethkioz: historia, mundos, criaturas, desarrollo y comunidad del Action-RPG de XETHKIOZ.',
    portals: { gaming: 'Gaming', science: 'Ciencia y tecnología', pets: 'Mascotas' },
    status: 'ACTION RPG 3D · UNITY + BLENDER · SAGA I EN DESARROLLO',
    soul: 'UN MUNDO FRACTURADO. UNA FAMILIA UNIDA.',
    lead: 'El tiempo, la memoria, la naturaleza y la tecnología dejaron de obedecer una sola versión de la realidad.',
    explore: 'DESCUBRIR EL MUNDO',
    chat: 'ABRIR CHAT',
    atlas: 'ABRIR PRISMA-ATLAS',
    scroll: 'Descender al mundo',
    storyEyebrow: 'ARCHIVO // ORIGEN',
    storyTitle: 'La Fisura Prismática cambió las reglas de la realidad.',
    storyText: 'World of Xethkioz no trata de restaurar un mundo perfecto. Trata de aprender a vivir entre estados incompatibles sin borrar aquello que nació después de la fractura.',
    travelerEyebrow: 'DOS PROTAGONISTAS // UNA RESONANCIA ABIERTA',
    travelerTitle: 'El Viajero y Xethkioz',
    travelerText: 'El Viajero nace sin una identidad cerrada y convierte cada experiencia en Memoria Propia. Xethkioz, la Forma Abierta, puede sostener múltiples afinidades sin dejar de ser quien es.',
    worldsEyebrow: 'SAGA I // 32 MAPAS',
    worldsTitle: 'Cuatro territorios. Una misma fractura.',
    bestiaryEyebrow: 'PRISMA-ATLAS // VIDA Y AMENAZAS',
    bestiaryTitle: 'El mundo no existe sólo para combatirlo.',
    formsEyebrow: 'OCHO FORMAS DE CONVERGENCIA',
    formsTitle: 'Una familia prismática. Ocho vínculos.',
    castEyebrow: 'PERSONAJES // IDENTIDADES CANÓNICAS',
    castTitle: 'Nombres del mundo. Vínculos de la historia.',
    devEyebrow: 'DESARROLLO // ESTADO DEL PROYECTO',
    devTitle: 'Producción 3D activa en Unity + Blender.',
    devText: 'La web va a funcionar como el centro público del proyecto: lore, Atlas, avances, comunidad y estado del juego, sin mezclar el contenido interno de producción con la experiencia del visitante.',
    roadmapEyebrow: 'ROADMAP // SIGUIENTE OBJETIVO',
    roadmapTitle: 'Del canon al primer vertical slice jugable.',
    roadmapText: 'La prioridad pública es convertir la base técnica en una experiencia corta, pulida y representativa de World of Xethkioz antes de ampliar alcance.',
    supportEyebrow: 'APOYAR // PRODUCCIÓN INDEPENDIENTE',
    supportTitle: 'Ayudar al proyecto también empuja el mundo hacia adelante.',
    supportText: 'Las colaboraciones se destinan a herramientas, arte, infraestructura, pruebas y producción. El apoyo es voluntario y no compra ventajas dentro del juego.',
    final: 'UN MUNDO FRACTURADO NO SE REPARA VOLVIENDO A COMO ERA. SE APRENDE A VIVIR CON LOS CAMINOS QUE AHORA EXISTEN.',
  },  en: {
    seo: 'World of Xethkioz · Action RPG in development',
    description: 'Official World of Xethkioz site: story, worlds, creatures, development and community for the XETHKIOZ action RPG.',
    portals: { gaming: 'Gaming', science: 'Science & technology', pets: 'Pets' },
    status: '3D ACTION RPG · UNITY + BLENDER · SAGA I IN DEVELOPMENT',
    soul: 'A FRACTURED WORLD. A UNITED FAMILY.',
    lead: 'Time, memory, nature and technology no longer obey a single version of reality.',
    explore: 'DISCOVER THE WORLD',
    chat: 'OPEN CHAT',
    atlas: 'OPEN PRISM ATLAS',
    scroll: 'Descend into the world',
    storyEyebrow: 'ARCHIVE // ORIGIN',
    storyTitle: 'The Prismatic Fracture changed the rules of reality.',
    storyText: 'World of Xethkioz is not about restoring a perfect world. It is about learning to live among incompatible states without erasing what was born after the fracture.',
    travelerEyebrow: 'TWO PROTAGONISTS // ONE OPEN RESONANCE',
    travelerTitle: 'The Traveler and Xethkioz',
    travelerText: 'The Traveler is born without a fixed identity and turns each experience into a Personal Memory. Xethkioz, the Open Form, can sustain multiple affinities without losing its identity.',
    worldsEyebrow: 'SAGA I // 32 MAPS',
    worldsTitle: 'Four territories. One fracture.',
    bestiaryEyebrow: 'PRISM ATLAS // LIFE AND THREATS',
    bestiaryTitle: 'The world does not exist only to be fought.',
    formsEyebrow: 'EIGHT CONVERGENCE FORMS',
    formsTitle: 'One prismatic family. Eight bonds.',
    castEyebrow: 'CHARACTERS // CANONICAL IDENTITIES',
    castTitle: 'Names of the world. Bonds of the story.',
    devEyebrow: 'DEVELOPMENT // PROJECT STATUS',
    devTitle: 'Active 3D production in Unity + Blender.',
    devText: 'The site becomes the public center of the project: lore, Atlas, progress, community and game status, without mixing internal production material into the visitor experience.',
    roadmapEyebrow: 'ROADMAP // NEXT TARGET',
    roadmapTitle: 'From locked canon to the first playable vertical slice.',
    roadmapText: 'The public priority is turning the technical foundation into a short, polished experience that represents World of Xethkioz before expanding scope.',
    supportEyebrow: 'SUPPORT // INDEPENDENT PRODUCTION',
    supportTitle: 'Supporting the project helps move the world forward.',
    supportText: 'Contributions go toward tools, art, infrastructure, testing and production. Support is voluntary and never buys gameplay advantages.',
    final: 'A FRACTURED WORLD IS NOT REPAIRED BY GOING BACK TO WHAT IT WAS. YOU LEARN TO LIVE WITH THE PATHS THAT EXIST NOW.',
  },
} as const
const timeline = {
  es: [
    ['2009', 'Elida muere. Su recuerdo quedará unido al origen emocional de la Fisura.'],
    ['11·09·2026', 'Día Cero. El Cambio Prismático deja una firma imposible durante un día aparentemente normal.'],
    ['2150', 'Una red experimental sincroniza aquella firma con el Eje Prismático y cierra una Vuelta causal.'],
    ['FISURA', 'Tiempo, materia, memoria, vida y tecnología empiezan a ocupar estados incompatibles del mismo mundo.'],
  ],
  en: [
    ['2009', 'Elida dies. Her memory will become tied to the emotional origin of the Fracture.'],
    ['11·09·2026', 'Day Zero. The Prismatic Change leaves an impossible signature during an apparently ordinary day.'],
    ['2150', 'An experimental network synchronizes that signature with the Prismatic Axis and closes a causal loop.'],
    ['FRACTURE', 'Time, matter, memory, life and technology begin to occupy incompatible states of the same world.'],
  ],
} as const

const regions = {
  es: [
    ['IZRDRALAR', 'M01–M08', 'Nivel 1–60', 'Juego base · Cuenca del Despertar, Aldea del Alba, Lago Encantado, tecnoflora, secretos y Primer Cisma.'],
    ['DESFRALAR', 'M09–M17', 'Nivel 60–85', 'Expansión I · raíces hundidas, Caverna Viva, Ciénaga Espiritual, Mamporath y memoria.'],
    ['XIOMALAR', 'M18–M25', 'Nivel 85–105', 'Expansión II · corrientes, jardines suspendidos, Observatorio Cuántico y Tiempo Primigenio.'],
    ['ZODNIGHT', 'M26–M32', 'Nivel 105–120', 'Cierre Saga I · estados quietos, El Unísono, convergencias y la decisión de divergir.'],
  ],
  en: [
    ['IZRDRALAR', 'M01–M08', 'Level 1–60', 'Base game · Awakening Basin, Dawn Village, Enchanted Lake, technoflora, secrets and the First Schism.'],
    ['DESFRALAR', 'M09–M17', 'Level 60–85', 'Expansion I · sunken roots, Living Cavern, Spirit Swamp, Mamporath and memory.'],
    ['XIOMALAR', 'M18–M25', 'Level 85–105', 'Expansion II · currents, suspended gardens, Quantum Observatory and Primordial Time.'],
    ['ZODNIGHT', 'M26–M32', 'Level 105–120', 'Saga I finale · still states, the Unison, convergences and the choice to diverge.'],
  ],
} as const
const atlasEntries = {
  es: [
    ['GOBLINS', 'Bandas recolectoras, acechadores, custodios y el Oráculo Goblin como boss aleatorio épico.'],
    ['MECAS + TECNOFLORA', 'Máquinas de 2150 cubiertas por vegetación y protocolos incompletos: destruir no siempre es la mejor solución.'],
    ['FAUNA', 'Ciervo Frondoso, Nutria Prismática y Zorrito de Ceibo viven, huyen, defienden territorio o simplemente observan.'],
    ['RAROS + BOSSES', 'Colmillo Ancestral, Centinela Tecnoverde, Mago Negro y encuentros que cambian el estado persistente del mundo.'],
  ],
  en: [
    ['GOBLINS', 'Scavenger bands, stalkers, custodians and the Goblin Oracle as an epic random boss.'],
    ['MECHS + TECHNOFLORA', 'Machines from 2150 covered by vegetation and incomplete protocols: destruction is not always the best answer.'],
    ['WILDLIFE', 'Leafy Deer, Prismatic Otter and Ceibo Fox live, flee, defend territory or simply watch.'],
    ['RARES + BOSSES', 'Ancestral Fang, Technogreen Sentinel, Black Mage and encounters that change the persistent state of the world.'],
  ],
} as const

const regionDetails = {
  es: [
    { name: 'IZRDRALAR', code: 'BASE', maps: ['M01 Cuenca del Despertar', 'M02 Aldea del Alba', 'M03 Lago Encantado + Ruinas Vivas', 'M04 Expedición Matrias + tecnoflora', 'M05 Jaula Prismática', 'M06 Refugio Vivo', 'M07 Secretos de Izrdralar', 'M08 Primer Cisma'], focus: 'El Viajero aprende a existir, conoce a Xethkioz y descubre que explorar, cuidar y comprender puede ser tan importante como combatir.' },
    { name: 'DESFRALAR', code: 'EXP I', maps: ['M09 Umbral de Raíces Hundidas', 'M10 Galerías de la Caverna Viva', 'M11 Corazón de la Caverna Viva', 'M12 Borde de la Ciénaga Espiritual', 'M13 Campamento de las Anclas', 'M14 Fangal de los Ecos', 'M15 Santuario de la Ciénaga', 'M16 Zona Abisal', 'M17 Trono de la Ciénaga'], focus: 'El terreno empieza a comportarse como una memoria viva. Mamporath y la Ciénaga amplían la relación entre Resonancia, ecos y movimiento por el mundo.' },
    { name: 'XIOMALAR', code: 'EXP II', maps: ['M18 Ascenso de las Corrientes', 'M19 Jardines Suspendidos', 'M20 Observatorio Cuántico', 'M21 Templos de Resonancia', 'M22 Mar de Nubes Fracturadas', 'M23 Archivo del Tiempo Primigenio', 'M24 Bastión del Custodio', 'M25 Umbral del Tiempo Primigenio'], focus: 'La exploración deja de ser sólo geográfica. El jugador empieza a recorrer corrientes temporales, estados incompatibles y el conocimiento que Ivander logró reconstruir.' },
    { name: 'ZODNIGHT', code: 'CIERRE', maps: ['M26 Frontera de la Noche Fija', 'M27 Ciudad de los Estados Quietos', 'M28 Santuario del Unísono', 'M29 Atrio de la Memoria de Elida', 'M30 Eclipse de Dvalin', 'M31 Campos de Convergencia', 'M32 Núcleo del Unísono'], focus: 'Saga I enfrenta la idea central del juego: aceptar la multiplicidad o imponer una única realidad estable. El final no restaura el mundo anterior.' },
  ],
  en: [
    { name: 'IZRDRALAR', code: 'BASE', maps: ['M01 Awakening Basin', 'M02 Dawn Village', 'M03 Enchanted Lake + Living Ruins', 'M04 Matrias Expedition + technoflora', 'M05 Prismatic Cage', 'M06 Living Refuge', 'M07 Secrets of Izrdralar', 'M08 First Schism'], focus: 'The Traveler learns to exist, meets Xethkioz and discovers that exploration, care and understanding can matter as much as combat.' },
    { name: 'DESFRALAR', code: 'EXP I', maps: ['M09 Sunken Roots Threshold', 'M10 Living Cavern Galleries', 'M11 Heart of the Living Cavern', 'M12 Edge of the Spirit Swamp', 'M13 Anchor Camp', 'M14 Mire of Echoes', 'M15 Swamp Sanctuary', 'M16 Abyssal Zone', 'M17 Swamp Throne'], focus: 'Terrain starts behaving like living memory. Mamporath and the swamp expand the link between Resonance, echoes and movement through the world.' },
    { name: 'XIOMALAR', code: 'EXP II', maps: ['M18 Rise of the Currents', 'M19 Suspended Gardens', 'M20 Quantum Observatory', 'M21 Resonance Temples', 'M22 Fractured Cloud Sea', 'M23 Primordial Time Archive', 'M24 Custodian Bastion', 'M25 Primordial Time Threshold'], focus: 'Exploration stops being only geographic. The player begins traversing temporal currents, incompatible states and the knowledge Ivander managed to reconstruct.' },
    { name: 'ZODNIGHT', code: 'FINALE', maps: ['M26 Fixed Night Frontier', 'M27 City of Still States', 'M28 Unison Sanctuary', 'M29 Atrium of Elida Memory', 'M30 Dvalin Eclipse', 'M31 Convergence Fields', 'M32 Unison Core'], focus: 'Saga I confronts the central idea of the game: accept multiplicity or impose one stable reality. The ending does not restore the old world.' },
  ],
} as const

const atlasDetails = {
  es: [
    { title: 'GOBLINS', signal: 'CULTURA + SUPERVIVENCIA', items: ['Joven', 'Acechador', 'Embaucador', 'Custodio', 'Espinero · raro', 'Oráculo Goblin · épico random'], note: 'No son humanos mutados. Forman bandas con roles, rutas, alarmas, saqueo y conductas propias.' },
    { title: 'MECAS + TECNOFLORA', signal: 'PROTOCOLOS INCOMPLETOS', items: ['Recolector Oxidado', 'Sabueso Meca', 'Avispa Meca Centinela', 'Nexo de Cuidado'], note: 'Algunas máquinas pueden repararse, liberarse de un protocolo o convertirse en parte persistente del mundo.' },
    { title: 'FAUNA', signal: 'ECOLOGÍA VIVA', items: ['Ciervo Frondoso', 'Nutria Prismática', 'Zorrito de Ceibo', 'Carpinchito de Cristal · Familiar común'], note: 'Observar, evitar o proteger también son interacciones válidas. No toda criatura existe para entregar XP o iniciar una quest.' },
    { title: 'RAROS + BOSSES', signal: 'ENCUENTROS DE HITO', items: ['Mago Negro · legendario random', 'Carcelero Prismático', 'Centinela Tecnoverde', 'Behemoth de la Caverna', 'Cazador Umbrío', 'El Unísono'], note: 'Los jefes importantes dejan consecuencias. Algunos cambian rutas, ecosistemas, servicios o el estado narrativo del mapa.' },
  ],
  en: [
    { title: 'GOBLINS', signal: 'CULTURE + SURVIVAL', items: ['Young Goblin', 'Stalker', 'Trickster', 'Custodian', 'Spine Goblin · rare', 'Goblin Oracle · epic random'], note: 'They are not mutated humans. Their bands have roles, routes, alarms, scavenging behavior and their own culture.' },
    { title: 'MECHS + TECHNOFLORA', signal: 'INCOMPLETE PROTOCOLS', items: ['Rust Collector', 'Meca Hound', 'Meca Sentinel Wasp', 'Care Nexus'], note: 'Some machines can be repaired, freed from a protocol or turned into persistent parts of the world.' },
    { title: 'WILDLIFE', signal: 'LIVING ECOLOGY', items: ['Leafy Deer', 'Prismatic Otter', 'Ceibo Fox', 'Crystal Capybara · common Familiar'], note: 'Watching, avoiding or protecting are valid interactions too. Not every creature exists to grant XP or start a quest.' },
    { title: 'RARES + BOSSES', signal: 'MILESTONE ENCOUNTERS', items: ['Black Mage · legendary random', 'Prismatic Jailer', 'Technogreen Sentinel', 'Cavern Behemoth', 'Shadow Hunter', 'The Unison'], note: 'Major bosses leave consequences. Some change routes, ecosystems, services or the narrative state of a map.' },
  ],
} as const

const forms = {
  es: [
    ['XETHKIOZ', 'Viajero', 'Resonancia Abierta'],
    ['KILLARUNA', 'Ashley · Voz del Silencio', 'Resonancia · Maná · Silencio'],
    ['MOZARUK', 'Fermín · Bastión de la Tierra', 'Tierra · Resistencia · Defensa'],
    ['HELLER', 'Isabella · Llama Indómita', 'Fuego · Caos con límites'],
    ['KAHEZER', 'Gael · Heredero del Viento', 'Viento · Adaptación'],
    ['ITZUKE', 'Ivander · El Científico Cuántico', 'Electricidad · Velocidad · Observación'],
    ['DVALIN', 'Alxion · Taumaturgo Primigenio', 'Hielo · Sombra · Anticipación'],
    ['OKUNINUST', 'Elida · Guardiana de la Memoria', 'Agua · Memoria · Escudo'],
  ],
  en: [
    ['XETHKIOZ', 'Traveler', 'Open Resonance'],
    ['KILLARUNA', 'Ashley · Voice of Silence', 'Resonance · Mana · Silence'],
    ['MOZARUK', 'Fermín · Bastion of Earth', 'Earth · Resistance · Defense'],
    ['HELLER', 'Isabella · Untamed Flame', 'Fire · Controlled Chaos'],
    ['KAHEZER', 'Gael · Heir of the Wind', 'Wind · Adaptation'],
    ['ITZUKE', 'Ivander · The Quantum Scientist', 'Electricity · Speed · Observation'],
    ['DVALIN', 'Alxion · Primordial Thaumaturge', 'Ice · Shadow · Anticipation'],
    ['OKUNINUST', 'Elida · Guardian of Memory', 'Water · Memory · Shield'],
  ],
} as const

const cast = {
  es: [
    ['Alxion', 'Taumaturgo Primigenio'], ['Ivander', 'El Científico Cuántico'], ['Andrealis', 'Anclaje de Resonancia'],
    ['Valdros', 'Vinculadora de Bestias y Mascotas'], ['Matrias', 'Arconte Táctico'], ['Nikoras', 'Vanguardia de la Luz'],
    ['Braxian', ''], ['Milaviel', ''], ['Mamporath', 'Titán de Choque'], ['Ashley', 'Voz del Silencio'],
    ['Fermín', 'Bastión de la Tierra'], ['Isabella', 'Llama Indómita'], ['Gael', 'Heredero del Viento'], ['Elida', 'Guardiana de la Memoria'],
  ],
  en: [
    ['Alxion', 'Primordial Thaumaturge'], ['Ivander', 'The Quantum Scientist'], ['Andrealis', 'Resonance Anchor'],
    ['Valdros', 'Beast & Familiar Binder'], ['Matrias', 'Tactical Archon'], ['Nikoras', 'Vanguard of Light'],
    ['Braxian', ''], ['Milaviel', ''], ['Mamporath', 'Titan of Impact'], ['Ashley', 'Voice of Silence'],
    ['Fermín', 'Bastion of Earth'], ['Isabella', 'Untamed Flame'], ['Gael', 'Heir of the Wind'], ['Elida', 'Guardian of Memory'],
  ],
} as const

function openNexusChat() {
  window.dispatchEvent(new CustomEvent('xethkioz:nexus-chat-open', { detail: { room: 'general' } }))
}

export default function Home() {
  const { lang, setLang, localizePath } = useLang()
  const { graphicsMode } = useExperience()
  const videoEnabled = useAmbientVideoEnabled(graphicsMode)
  const t = copy[lang]
  const [activeRegion, setActiveRegion] = useState(0)
  const [activeAtlas, setActiveAtlas] = useState(0)
  const [activeForm, setActiveForm] = useState(0)
  const [activeCast, setActiveCast] = useState(0)
  const selectedRegion = regionDetails[lang][activeRegion]
  const selectedAtlas = atlasDetails[lang][activeAtlas]
  const selectedForm = forms[lang][activeForm]
  const selectedCast = cast[lang][activeCast]
  return (
    <>
      <SEO title={t.seo} description={t.description} url="/" image="/assets/world-of-xethkioz/world-of-xethkioz-logo.webp" />
      <main className="wox-home">
        <div className="wox-bg" aria-hidden="true" />
        {videoEnabled && (
          <video
            className="wox-bg-video"
            src="/assets/bg-dragon-animated.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="none"
            poster="/assets/bg-dragon-poster.webp"
            aria-hidden="true"
          />
        )}
        <div className="wox-bg-shade" aria-hidden="true" />
        <div className="wox-noise" aria-hidden="true" />

        <aside className="wox-utility-rail" aria-label={lang === 'es' ? 'Accesos rápidos' : 'Quick access'}>
          <button type="button" onClick={openNexusChat}><span>◉</span><b>CHAT</b></button>
          <a href="#atlas"><span>◇</span><b>ATLAS</b></a>
          <Link to={localizePath('/support')}><span>＋</span><b>{lang === 'es' ? 'APOYAR' : 'SUPPORT'}</b></Link>
        </aside>

        <header className="wox-topbar">
          <nav className="wox-ecosystem-nav" aria-label={lang === 'es' ? 'Ecosistema XETHKIOZ' : 'XETHKIOZ ecosystem'}>
            <Link to={localizePath('/gaming')}>{lang === 'es' ? 'JUEGOS' : 'GAMING'}</Link>
            <a href="https://argenciencia.com/" target="_blank" rel="noopener noreferrer">ARGENCIENCIA <span>↗</span></a>
            <a href="/mascotas/">{lang === 'es' ? 'MASCOTAS' : 'PETS'}</a>
            <Link to={localizePath('/nexus-city')}>NEXUS CITY</Link>
            <Link to={localizePath('/creacion-web')}>{lang === 'es' ? 'CREACIÓN WEB' : 'WEB CREATION'}</Link>
          </nav>
          <details className="wox-mobile-ecosystem">
            <summary>{lang === 'es' ? 'XETHKIOZ' : 'XETHKIOZ'} <span aria-hidden="true">＋</span></summary>
            <nav aria-label={lang === 'es' ? 'Ecosistema XETHKIOZ móvil' : 'Mobile XETHKIOZ ecosystem'}>
              <Link to={localizePath('/gaming')}>{lang === 'es' ? 'JUEGOS' : 'GAMING'}</Link>
              <a href="https://argenciencia.com/" target="_blank" rel="noopener noreferrer">ARGENCIENCIA <span>↗</span></a>
              <a href="/mascotas/">{lang === 'es' ? 'MASCOTAS' : 'PETS'}</a>
              <Link to={localizePath('/nexus-city')}>NEXUS CITY</Link>
              <Link to={localizePath('/creacion-web')}>{lang === 'es' ? 'CREACIÓN WEB' : 'WEB CREATION'}</Link>
              <Link to="/news">{lang === 'es' ? 'NOTICIAS' : 'NEWS'}</Link>
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
          <div className="wox-hero-core">
            <picture className="wox-logo-wrap">
              <source srcSet="/assets/world-of-xethkioz/world-of-xethkioz-logo.webp" type="image/webp" />
              <img src="/assets/world-of-xethkioz/world-of-xethkioz-logo.svg" alt="World of Xethkioz" className="wox-world-logo" />
            </picture>
            <p className="wox-status">{t.status}</p>
            <h2>{t.soul}</h2>
            <p className="wox-lead">{t.lead}</p>
            <div className="wox-actions">
              <a href="#worlds">{t.explore}<span>↓</span></a>
              <button type="button" onClick={openNexusChat}>{t.chat}<span>◉</span></button>
              <a href="#atlas" className="is-quiet">{t.atlas}<span>↘</span></a>
            </div>
            <nav className="wox-game-nav" aria-label={lang === 'es' ? 'Secciones de World of Xethkioz' : 'World of Xethkioz sections'}>
              <a href="#origin">{lang === 'es' ? 'HISTORIA' : 'STORY'}</a>
              <a href="#worlds">{lang === 'es' ? 'MUNDO' : 'WORLD'}</a>
              <a href="#atlas">PRISMA-ATLAS</a>
              <a href="#characters">{lang === 'es' ? 'PERSONAJES' : 'CHARACTERS'}</a>
              <a href="#media-3d">3D</a>
              <a href="#development">{lang === 'es' ? 'DESARROLLO' : 'DEVELOPMENT'}</a>
            </nav>
          </div>
          <a className="wox-scroll" href="#origin" aria-label={t.scroll}><span />{t.scroll}</a>
        </section>
        <div className="wox-content">
          <section id="origin" className="wox-section wox-origin wox-editorial-open" aria-labelledby="origin-title">
            <div className="wox-section-head">
              <p>{t.storyEyebrow}</p>
              <h2 id="origin-title">{t.storyTitle}</h2>
              <span>{t.storyText}</span>
            </div>
            <div className="wox-timeline">
              {timeline[lang].map(([year, text]) => (
                <article key={year}>
                  <strong>{year}</strong>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="wox-section wox-duo wox-editorial-open" aria-labelledby="duo-title">
            <div className="wox-section-head">
              <p>{t.travelerEyebrow}</p>
              <h2 id="duo-title">{t.travelerTitle}</h2>
              <span>{t.travelerText}</span>
            </div>
            <div className="wox-duo-grid">
              <article><small>01 // VIAJERO</small><strong>{lang === 'es' ? 'Nació de ecos que no eran suyos.' : 'Born from echoes that were not its own.'}</strong><p>{lang === 'es' ? 'Sin género, rostro ni pasado canónico. El nombre elegido por el jugador es su primer anclaje de identidad.' : 'No canonical gender, face or past. The player-chosen name becomes its first anchor of identity.'}</p></article>
              <article><small>02 // XETHKIOZ</small><strong>{lang === 'es' ? 'No obedece. Acompaña.' : 'It does not obey. It accompanies.'}</strong><p>{lang === 'es' ? 'La Forma Abierta aprende afinidades sin perder identidad. Su progresión canónica de colas es 3 → 5 → 7 → 9.' : 'The Open Form learns affinities without losing identity. Its canonical tail progression is 3 → 5 → 7 → 9.'}</p></article>
            </div>
          </section>
          <section id="worlds" className="wox-section wox-world-showcase" aria-labelledby="worlds-title">
            <div className="wox-section-head">
              <p>{t.worldsEyebrow}</p>
              <h2 id="worlds-title">{t.worldsTitle}</h2>
            </div>
            <div className="wox-region-grid">
              {regions[lang].map(([name, maps, level, description], index) => (
                <article key={name} data-region={index + 1} className={activeRegion === index ? 'is-active' : ''}>
                  <button type="button" onClick={() => setActiveRegion(index)} aria-pressed={activeRegion === index}>
                    <div><small>{maps}</small><span>{level}</span></div>
                    <h3>{name}</h3>
                    <p>{description}</p>
                    <b>{lang === 'es' ? 'EXPLORAR REGIÓN' : 'EXPLORE REGION'} <span>↘</span></b>
                    <i aria-hidden="true">0{index + 1}</i>
                  </button>
                </article>
              ))}
            </div>
            <div className="wox-region-console" aria-live="polite">
              <div className="wox-region-console-head">
                <span>{selectedRegion.code} // {selectedRegion.name}</span>
                <strong>{lang === 'es' ? 'RUTA CANÓNICA DE SAGA I' : 'CANONICAL SAGA I ROUTE'}</strong>
              </div>
              <p>{selectedRegion.focus}</p>
              <div className="wox-map-chips">
                {selectedRegion.maps.map((map) => <span key={map}>{map}</span>)}
              </div>
            </div>
          </section>

          <section id="atlas" className="wox-section wox-atlas wox-atlas-showcase" aria-labelledby="atlas-title">
            <div className="wox-section-head">
              <p>{t.bestiaryEyebrow}</p>
              <h2 id="atlas-title">{t.bestiaryTitle}</h2>
              <span>{lang === 'es' ? 'El Prisma-Atlas se completa por descubrimiento: avistamiento, conducta, interacción y análisis. Ver una criatura no implica una misión ni un combate.' : 'The Prism Atlas fills through discovery: sighting, behavior, interaction and analysis. Seeing a creature does not automatically mean a quest or a fight.'}</span>
            </div>
            <div className="wox-atlas-grid">
              {atlasEntries[lang].map(([title, text], index) => (
                <article key={title} className={activeAtlas === index ? 'is-active' : ''}>
                  <button type="button" onClick={() => setActiveAtlas(index)} aria-pressed={activeAtlas === index}>
                    <span>◆</span><h3>{title}</h3><p>{text}</p>
                  </button>
                </article>
              ))}
            </div>
            <div className="wox-atlas-console" aria-live="polite">
              <div>
                <small>{selectedAtlas.signal}</small>
                <h3>{selectedAtlas.title}</h3>
                <p>{selectedAtlas.note}</p>
              </div>
              <div className="wox-atlas-tags">
                {selectedAtlas.items.map((item) => <span key={item}>{item}</span>)}
              </div>
            </div>
          </section>
          <section className="wox-section wox-forms-showcase" aria-labelledby="forms-title">
            <div className="wox-section-head">
              <p>{t.formsEyebrow}</p>
              <h2 id="forms-title">{t.formsTitle}</h2>
            </div>
            <div className="wox-forms-grid">
              {forms[lang].map(([name, bond, affinity], index) => (
                <article key={name} className={activeForm === index ? 'is-active' : ''} data-form={index + 1}>
                  <button type="button" onClick={() => setActiveForm(index)} aria-pressed={activeForm === index}>
                    <small>{String(index + 1).padStart(2, '0')}</small>
                    <div><strong>{name}</strong><span>{bond}</span></div>
                    <p>{affinity}</p>
                  </button>
                </article>
              ))}
            </div>
            <div className="wox-form-console" aria-live="polite" data-form={activeForm + 1}>
              <div className="wox-form-sigil" aria-hidden="true"><span>◇</span></div>
              <div>
                <small>{lang === 'es' ? 'FORMA DE CONVERGENCIA SELECCIONADA' : 'SELECTED CONVERGENCE FORM'}</small>
                <h3>{selectedForm[0]}</h3>
                <p><b>{lang === 'es' ? 'Vínculo' : 'Bond'}:</b> {selectedForm[1]}</p>
                <p><b>{lang === 'es' ? 'Afinidad' : 'Affinity'}:</b> {selectedForm[2]}</p>
              </div>
              <span className="wox-canon-lock">CANON LOCK</span>
            </div>
          </section>

          <section id="characters" className="wox-section wox-cast wox-cast-showcase" aria-labelledby="cast-title">
            <div className="wox-section-head">
              <p>{t.castEyebrow}</p>
              <h2 id="cast-title">{t.castTitle}</h2>
            </div>
            <div className="wox-cast-grid">
              {cast[lang].map(([name, title], index) => (
                <article key={name} className={activeCast === index ? 'is-active' : ''}>
                  <button type="button" onClick={() => setActiveCast(index)} aria-pressed={activeCast === index}>
                    <small>{String(index + 1).padStart(2, '0')}</small>
                    <strong>{name}</strong>
                    {title ? <span>{title}</span> : null}
                  </button>
                </article>
              ))}
            </div>
            <div className="wox-cast-console" aria-live="polite">
              <div className="wox-cast-avatar" aria-hidden="true"><span>{selectedCast[0].slice(0, 1)}</span></div>
              <div>
                <small>{lang === 'es' ? 'IDENTIDAD CANÓNICA ACTIVA' : 'ACTIVE CANONICAL IDENTITY'}</small>
                <h3>{selectedCast[0]}</h3>
                {selectedCast[1] ? <p>{selectedCast[1]}</p> : null}
              </div>
              <span className="wox-canon-lock">WORLD OF XETHKIOZ</span>
            </div>
          </section>

          <section id="media-3d" className="wox-section wox-3d-stage" aria-labelledby="media-3d-title">
            <div className="wox-section-head">
              <p>{lang === 'es' ? 'WORLD OF XETHKIOZ // PRODUCCIÓN VISUAL 3D' : 'WORLD OF XETHKIOZ // 3D VISUAL PRODUCTION'}</p>
              <h2 id="media-3d-title">{lang === 'es' ? 'El mundo se está construyendo en 3D.' : 'The world is being built in 3D.'}</h2>
              <span>{lang === 'es' ? 'La Home queda preparada para publicar únicamente renders, capturas y gameplay que representen la versión vigente de Unity + Blender.' : 'The Home is prepared to publish only renders, captures and gameplay that represent the current Unity + Blender version.'}</span>
            </div>
            <div className="wox-3d-grid" aria-label={lang === 'es' ? 'Material 3D oficial de World of Xethkioz' : 'Official World of Xethkioz 3D media'}>
              <article className="wox-3d-veyr-card">
                <div className="wox-3d-viewport is-veyr">
                  <img src="/assets/world-of-xethkioz/veyr/veyr-wisp-poster.webp" alt={lang === 'es' ? 'Veyr — Wisp del Green Node' : 'Veyr — Green Node Wisp'} loading="lazy" decoding="async" />
                  <span className="wox-3d-live-badge">{lang === 'es' ? '3D ACTIVO' : '3D ACTIVE'}</span>
                </div>
                <div className="wox-3d-copy">
                  <small>{lang === 'es' ? 'PRIMER ACTIVO 3D INTEGRADO' : 'FIRST INTEGRATED 3D ASSET'}</small>
                  <strong>VEYR · WISP DEL GREEN NODE</strong>
                  <p>{lang === 'es' ? 'Modelo de Tripo corregido y optimizado en Blender, preparado para Unity y adaptado a la web como manifestación flotante del Green Node.' : 'Tripo model corrected and optimized in Blender, prepared for Unity and adapted to the site as the floating manifestation of Green Node.'}</p>
                  <Link className="wox-3d-link" to={localizePath('/green-node')}>{lang === 'es' ? 'ENTRAR AL GREEN NODE' : 'ENTER GREEN NODE'} <span>↗</span></Link>
                </div>
              </article>
              {[
                ['02', lang === 'es' ? 'ESCENARIOS 3D' : '3D ENVIRONMENTS', lang === 'es' ? 'Mapas, biomas, iluminación y atmósfera capturados desde Unity.' : 'Maps, biomes, lighting and atmosphere captured from Unity.'],
                ['03', lang === 'es' ? 'GAMEPLAY REAL' : 'REAL GAMEPLAY', lang === 'es' ? 'Movimiento, combate, exploración e interacción grabados directamente desde el juego.' : 'Movement, combat, exploration and interaction recorded directly from the game.'],
              ].map(([index, title, text]) => (
                <article key={index}>
                  <div className="wox-3d-viewport" aria-hidden="true"><span>{index}</span><i /><b /></div>
                  <div className="wox-3d-copy"><small>{lang === 'es' ? 'MATERIAL EN PREPARACIÓN' : 'MEDIA IN PREPARATION'}</small><strong>{title}</strong><p>{text}</p></div>
                </article>
              ))}
            </div>
            <div className="wox-3d-note"><span>UNITY</span><span>BLENDER</span><span>3D</span><p>{lang === 'es' ? 'Veyr ya representa el pipeline 3D vigente. Los próximos espacios se reemplazan únicamente por renders, capturas o gameplay aprobados de Unity + Blender.' : 'Veyr already represents the current 3D pipeline. The remaining slots will be replaced only with approved Unity + Blender renders, captures or gameplay.'}</p></div>
          </section>

          <section id="development" className="wox-section wox-dev wox-dev-showcase" aria-labelledby="dev-title">
            <div className="wox-section-head">
              <p>{t.devEyebrow}</p>
              <h2 id="dev-title">{t.devTitle}</h2>
              <span>{t.devText}</span>
            </div>
            <div className="wox-dev-grid">
              <article><strong>32</strong><span>{lang === 'es' ? 'mapas físicos en Saga I' : 'physical maps in Saga I'}</span></article>
              <article><strong>120</strong><span>{lang === 'es' ? 'nivel máximo de Saga I' : 'Saga I level cap'}</span></article>
              <article><strong>8</strong><span>{lang === 'es' ? 'Formas de Convergencia' : 'Convergence Forms'}</span></article>
              <article><strong>UNITY</strong><span>{lang === 'es' ? 'motor de producción activo' : 'active production engine'}</span></article>
            </div>
            <div className="wox-dev-pulse" aria-label={lang === 'es' ? 'Hitos públicos del desarrollo' : 'Public development milestones'}>
              <span><i />CANON v2.0 LOCK</span>
              <span><i />32 MAPAS SAGA I</span>
              <span><i />BESTIARIO 3D PIPELINE</span>
              <span><i />VERTICAL SLICE EN PRODUCCIÓN</span>
            </div>
          </section>

          <section className="wox-section wox-roadmap wox-roadmap-showcase" aria-labelledby="roadmap-title">
            <div className="wox-section-head">
              <p>{t.roadmapEyebrow}</p>
              <h2 id="roadmap-title">{t.roadmapTitle}</h2>
              <span>{t.roadmapText}</span>
            </div>
            <div className="wox-roadmap-grid">
              <article className="is-done"><small>01</small><em>{lang === 'es' ? 'CERRADO' : 'LOCKED'}</em><strong>{lang === 'es' ? 'Canon y estructura' : 'Canon & structure'}</strong><span>{lang === 'es' ? 'Historia, 32 mapas e identidades principales consolidados.' : 'Story, 32 maps and main identities consolidated.'}</span></article>
              <article className="is-active" aria-current="step"><small>02</small><em>{lang === 'es' ? 'AHORA' : 'NOW'}</em><strong>Vertical slice</strong><span>{lang === 'es' ? 'M01–M03, combate, exploración, fauna, Goblins, Atlas y feedback visual.' : 'M01–M03, combat, exploration, wildlife, Goblins, Atlas and visual feedback.'}</span></article>
              <article><small>03</small><em>{lang === 'es' ? 'SIGUIENTE' : 'NEXT'}</em><strong>{lang === 'es' ? 'Juego base' : 'Base game'}</strong><span>{lang === 'es' ? 'Izrdralar M01–M08 completo, progresión, quests, bosses y build Windows.' : 'Complete Izrdralar M01–M08, progression, quests, bosses and Windows build.'}</span></article>
              <article><small>04</small><em>{lang === 'es' ? 'DESPUÉS' : 'LATER'}</em><strong>{lang === 'es' ? 'Expansión de Saga I' : 'Saga I expansion'}</strong><span>{lang === 'es' ? 'Desfralar, Xiomalar y Zodnight hasta nivel 120.' : 'Desfralar, Xiomalar and Zodnight through level 120.'}</span></article>
            </div>
          </section>

          <section className="wox-support-card" aria-labelledby="support-title">
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
            <div>
              <strong>WORLD OF XETHKIOZ</strong>
              <span>© 2026 XETHKIOZ · {SITE_VERSION}</span>
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

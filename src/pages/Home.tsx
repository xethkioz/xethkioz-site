import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { useLang } from '../lib/LangContext'
import { useExperience } from '../lib/ExperienceContext'
import { supportsAmbientVideo } from '../lib/experienceMode'
import { SITE_VERSION } from '../lib/siteConfig'
import './WorldOfXethkiozHome.css'
import './WorldOfXethkiozAAA.css'

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
const gameSections = {
  es: [['origin', 'HISTORIA'], ['worlds', 'MUNDO'], ['atlas', 'PRISMA-ATLAS'], ['characters', 'PERSONAJES'], ['media-3d', 'ARTE VISUAL'], ['development', 'DESARROLLO']],
  en: [['origin', 'STORY'], ['worlds', 'WORLD'], ['atlas', 'PRISM-ATLAS'], ['characters', 'CHARACTERS'], ['media-3d', 'VISUAL ART'], ['development', 'DEVELOPMENT']],
} as const

type MediaPlaceholderProps = {
  label: string
  subject: string
  code?: string
  orientation?: 'landscape' | 'portrait' | 'square'
  src?: string
  alt?: string
  glyph?: string
}

function MediaPlaceholder({ label, subject, code = '3D', orientation = 'landscape', src, alt, glyph }: MediaPlaceholderProps) {
  return (
    <div className={`wox-media-placeholder is-${orientation}`} aria-label={`${label}: ${subject}`}>
      {src ? <img src={src} alt={alt ?? subject} loading="lazy" decoding="async" /> : <>
        <div className="wox-media-placeholder-grid" aria-hidden="true" />
        <div className="wox-protected-sigil" aria-hidden="true"><i /><i /><i /><b>{glyph ?? code.slice(0, 2)}</b></div>
      </>}
      <span>{code}</span>
      <strong>{subject}</strong>
      <small>{label}</small>
    </div>
  )
}

const copy = {
  es: {
    seo: 'World of Xethkioz · Action RPG en desarrollo',
    description: 'Sitio oficial de World of Xethkioz: historia, mundos, criaturas, desarrollo y comunidad del Action-RPG de XETHKIOZ.',
    portals: { gaming: 'Gaming', science: 'Ciencia y tecnología', pets: 'Mascotas' },
    status: 'SAGA I · RESONANCIA PRISMÁTICA · MUNDO EN EXPANSIÓN',
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
    worldsTitle: 'Cuatro territorios. Una isla fuera del tiempo.',
    demo: 'DEMO EN PREPARACIÓN',
    lore: 'EXPLORAR LORE DE SAGA I',
    bestiaryEyebrow: 'PRISMA-ATLAS // VIDA Y AMENAZAS',
    bestiaryTitle: 'El mundo no existe sólo para combatirlo.',
    formsEyebrow: 'OCHO FORMAS DE CONVERGENCIA',
    formsTitle: 'Una familia prismática. Ocho vínculos.',
    castEyebrow: 'PERSONAJES // IDENTIDADES CANÓNICAS',
    castTitle: 'Nombres del mundo. Vínculos de la historia.',
    devEyebrow: 'DESARROLLO // ESTADO DEL PROYECTO',
    devTitle: 'Producción 2D activa en Godot 4.',
    devText: 'La web funciona como centro público del proyecto: lore, Atlas, arte conceptual, avances y comunidad, mientras los assets originales y el material interno permanecen reservados.',
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
    status: 'SAGA I · PRISMATIC RESONANCE · AN EXPANDING WORLD',
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
    worldsTitle: 'Four territories. One island outside time.',
    demo: 'DEMO IN PREPARATION',
    lore: 'EXPLORE SAGA I LORE',
    bestiaryEyebrow: 'PRISM ATLAS // LIFE AND THREATS',
    bestiaryTitle: 'The world does not exist only to be fought.',
    formsEyebrow: 'EIGHT CONVERGENCE FORMS',
    formsTitle: 'One prismatic family. Eight bonds.',
    castEyebrow: 'CHARACTERS // CANONICAL IDENTITIES',
    castTitle: 'Names of the world. Bonds of the story.',
    devEyebrow: 'DEVELOPMENT // PROJECT STATUS',
    devTitle: 'Active 2D production in Godot 4.',
    devText: 'The site is the public center of the project: lore, Atlas, concept art, progress and community, while original assets and internal production material remain private.',
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
    ['ISLA TEMPORAL', 'POST-FINAL', 'Bucle de 5 estados', 'Zona post-final · memoria, rescate de Andrealis y una realidad que se niega a permanecer igual.'],
  ],
  en: [
    ['IZRDRALAR', 'M01–M08', 'Level 1–60', 'Base game · Awakening Basin, Dawn Village, Enchanted Lake, technoflora, secrets and the First Schism.'],
    ['DESFRALAR', 'M09–M17', 'Level 60–85', 'Expansion I · sunken roots, Living Cavern, Spirit Swamp, Mamporath and memory.'],
    ['XIOMALAR', 'M18–M25', 'Level 85–105', 'Expansion II · currents, suspended gardens, Quantum Observatory and Primordial Time.'],
    ['ZODNIGHT', 'M26–M32', 'Level 105–120', 'Saga I finale · still states, the Unison, convergences and the choice to diverge.'],
    ['TEMPORAL ISLAND', 'POST-FINALE', '5-state loop', 'Post-finale zone · memory, Andrealis rescue and a reality that refuses to stay fixed.'],
  ],
} as const
const regionArt = [
  '/assets/world-of-xethkioz/web-art/biome-izrdralar.svg',
  '/assets/world-of-xethkioz/web-art/biome-desfralar.svg',
  '/assets/world-of-xethkioz/web-art/biome-xiomalar.svg',
  '/assets/world-of-xethkioz/web-art/biome-zodnight.svg',
  '/assets/world-of-xethkioz/web-art/biome-isla-temporal.svg',
] as const

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
    { name: 'ISLA TEMPORAL', code: 'POST', maps: ['Estado I · Eco', 'Estado II · Desvío', 'Estado III · Ruptura', 'Estado IV · Recuerdo', 'Estado V · Rescate'], focus: 'Después del cierre de Saga I, la Isla Temporal convierte la memoria en espacio jugable. El rescate de Andrealis exige comprender cinco estados del mismo lugar sin tratar ninguno como una simple copia.' },
  ],
  en: [
    { name: 'IZRDRALAR', code: 'BASE', maps: ['M01 Awakening Basin', 'M02 Dawn Village', 'M03 Enchanted Lake + Living Ruins', 'M04 Matrias Expedition + technoflora', 'M05 Prismatic Cage', 'M06 Living Refuge', 'M07 Secrets of Izrdralar', 'M08 First Schism'], focus: 'The Traveler learns to exist, meets Xethkioz and discovers that exploration, care and understanding can matter as much as combat.' },
    { name: 'DESFRALAR', code: 'EXP I', maps: ['M09 Sunken Roots Threshold', 'M10 Living Cavern Galleries', 'M11 Heart of the Living Cavern', 'M12 Edge of the Spirit Swamp', 'M13 Anchor Camp', 'M14 Mire of Echoes', 'M15 Swamp Sanctuary', 'M16 Abyssal Zone', 'M17 Swamp Throne'], focus: 'Terrain starts behaving like living memory. Mamporath and the swamp expand the link between Resonance, echoes and movement through the world.' },
    { name: 'XIOMALAR', code: 'EXP II', maps: ['M18 Rise of the Currents', 'M19 Suspended Gardens', 'M20 Quantum Observatory', 'M21 Resonance Temples', 'M22 Fractured Cloud Sea', 'M23 Primordial Time Archive', 'M24 Custodian Bastion', 'M25 Primordial Time Threshold'], focus: 'Exploration stops being only geographic. The player begins traversing temporal currents, incompatible states and the knowledge Ivander managed to reconstruct.' },
    { name: 'ZODNIGHT', code: 'FINALE', maps: ['M26 Fixed Night Frontier', 'M27 City of Still States', 'M28 Unison Sanctuary', 'M29 Atrium of Elida Memory', 'M30 Dvalin Eclipse', 'M31 Convergence Fields', 'M32 Unison Core'], focus: 'Saga I confronts the central idea of the game: accept multiplicity or impose one stable reality. The ending does not restore the old world.' },
    { name: 'TEMPORAL ISLAND', code: 'POST', maps: ['State I · Echo', 'State II · Detour', 'State III · Rupture', 'State IV · Memory', 'State V · Rescue'], focus: 'After Saga I closes, Temporal Island turns memory into playable space. Rescuing Andrealis means understanding five states of the same place without treating any of them as a simple copy.' },
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


const ecosystemCards = {
  es: [
    ['GREEN NODE + WISP', 'Infraestructura viva, Veyr y la conexión transmedia entre el mundo del juego y esta Superficie de Luz.', '/green-node', 'NODE'],
    ['ARGENCIENCIA', 'Divulgación científica, física, tecnología y puente educativo conectado con la curiosidad detrás de XETHKIOZ.', 'https://argenciencia.com/', 'SCI'],
    ['CREADOR WEB', 'Diseño y desarrollo de experiencias web profesionales para proyectos independientes, marcas y empresas.', '/creacion-web', 'WEB'],
    ['DONACIONES', 'Soporte transparente para producción, infraestructura y causas reales vinculadas al ecosistema.', '/support', 'SUP'],
  ],
  en: [
    ['GREEN NODE + WISP', 'Living infrastructure, Veyr and the transmedia connection between the game world and this Surface of Light.', '/en/green-node', 'NODE'],
    ['ARGENCIENCIA', 'Science communication, physics, technology and an educational bridge tied to XETHKIOZ curiosity.', 'https://argenciencia.com/', 'SCI'],
    ['WEB CREATOR', 'Professional web design and development for independent projects, brands and companies.', '/en/creacion-web', 'WEB'],
    ['DONATIONS', 'Transparent support for production, infrastructure and real-world causes connected to the ecosystem.', '/en/support', 'SUP'],
  ],
} as const

const familiarCards = {
  es: [
    ['XETHKIOZ', 'FORMA ABIERTA', 'Gato Andino Místico · vínculo central de Resonancia y compañero del Viajero.', 'XE'],
    ['JOLITO', 'FAMILIAR COMÚN', 'Gallo criollo de Dany · presencia territorial, memoria cotidiana y carácter propio.', 'JO'],
    ['CARPINCHITO DE CRISTAL', 'FAMILIAR COMÚN', 'Fauna prismática vinculada al refugio y a la exploración no hostil del mundo.', 'CC'],
  ],
  en: [
    ['XETHKIOZ', 'OPEN FORM', 'Mystic Andean Cat · central Resonance bond and companion of the Traveler.', 'XE'],
    ['JOLITO', 'COMMON FAMILIAR', 'Dany’s creole rooster · territorial presence, everyday memory and a character of his own.', 'JO'],
    ['CRYSTAL CAPYBARA', 'COMMON FAMILIAR', 'Prismatic wildlife tied to the refuge and non-hostile exploration of the world.', 'CC'],
  ],
} as const

const featuredCast = {
  es: [
    ['Alxion', 'Taumaturgo Primigenio', 'AL'], ['Ivander', 'Científico Cuántico', 'IV'], ['Elida', 'Guardiana de la Memoria', 'EL'],
    ['Ashley', 'Voz del Silencio', 'AS'], ['Fermín', 'Bastión de la Tierra', 'FE'], ['Isabella', 'Llama Indómita', 'IS'],
    ['Gael', 'Heredero del Viento', 'GA'], ['Chippo', 'Duelista Convergente', 'CH'], ['Dany + Jolito', 'Vínculo cotidiano', 'DJ'],
  ],
  en: [
    ['Alxion', 'Primordial Thaumaturge', 'AL'], ['Ivander', 'Quantum Scientist', 'IV'], ['Elida', 'Guardian of Memory', 'EL'],
    ['Ashley', 'Voice of Silence', 'AS'], ['Fermín', 'Bastion of Earth', 'FE'], ['Isabella', 'Untamed Flame', 'IS'],
    ['Gael', 'Heir of the Wind', 'GA'], ['Chippo', 'Convergence Duelist', 'CH'], ['Dany + Jolito', 'Everyday Bond', 'DJ'],
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
  const [activeSection, setActiveSection] = useState('origin')
  const [sectionDockVisible, setSectionDockVisible] = useState(false)
  const selectedRegion = regionDetails[lang][activeRegion]
  const selectedAtlas = atlasDetails[lang][activeAtlas]
  const selectedForm = forms[lang][activeForm]
  const selectedCast = cast[lang][activeCast]

  useEffect(() => {
    const ids = gameSections.es.map(([id]) => id)
    const syncDock = () => setSectionDockVisible(window.scrollY > Math.max(420, window.innerHeight * .72))
    syncDock()
    window.addEventListener('scroll', syncDock, { passive: true })
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible?.target.id) setActiveSection(visible.target.id)
    }, { rootMargin: '-20% 0px -62% 0px', threshold: [0, .15, .35, .6] })
    ids.map((id) => document.getElementById(id)).filter(Boolean).forEach((section) => observer.observe(section as Element))
    return () => { window.removeEventListener('scroll', syncDock); observer.disconnect() }
  }, [])

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
            <a href="#origin">{lang === 'es' ? 'JUEGO' : 'GAME'}</a>
            <a href="https://argenciencia.com/" target="_blank" rel="noopener noreferrer">ARGENCIENCIA <span>↗</span></a>
            <Link to={localizePath('/gaming')}>{lang === 'es' ? 'BIBLIOTECA DE JUEGOS' : 'GAME LIBRARY'}</Link>
            <a href="/mascotas/">{lang === 'es' ? 'MASCOTAS' : 'PETS'}</a>
            <Link to={localizePath('/green-node')}>GREEN NODE</Link>
            <Link to={localizePath('/creacion-web')}>{lang === 'es' ? 'CREADOR WEB' : 'WEB CREATOR'}</Link>
            <Link to={localizePath('/support')}>{lang === 'es' ? 'DONACIONES' : 'DONATIONS'}</Link>
          </nav>
          <details className="wox-mobile-ecosystem">
            <summary>{lang === 'es' ? 'XETHKIOZ' : 'XETHKIOZ'} <span aria-hidden="true">＋</span></summary>
            <nav aria-label={lang === 'es' ? 'Ecosistema XETHKIOZ móvil' : 'Mobile XETHKIOZ ecosystem'}>
              <a href="#origin">{lang === 'es' ? 'JUEGO' : 'GAME'}</a>
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

        <nav className={`wox-section-dock${sectionDockVisible ? ' is-visible' : ''}`} aria-label={lang === 'es' ? 'Navegacion rapida de World of Xethkioz' : 'World of Xethkioz quick navigation'}>
          <span className="wox-section-dock-brand" aria-hidden="true">WOX</span>
          <div>
            {gameSections[lang].map(([id, label]) => <a key={id} href={`#${id}`} aria-current={activeSection === id ? 'location' : undefined}>{label}</a>)}
          </div>
          <a className="wox-section-dock-top" href="#wox-title" aria-label={lang === 'es' ? 'Volver al inicio' : 'Back to top'}>^</a>
        </nav>

        <section className="wox-hero" aria-labelledby="wox-title">
          <h1 id="wox-title" className="sr-only">World of Xethkioz</h1>
          <img className="wox-hero-keyart" src="/assets/world-of-xethkioz/web-art/hero-family-resonance.svg" alt="" aria-hidden="true" decoding="async" fetchPriority="high" />
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
            <div className="wox-actions wox-actions-pass16">
              <a href="#development" className="is-demo" aria-label={lang === 'es' ? 'Demo todavía en preparación' : 'Demo currently in preparation'}>{t.demo}<span>◇</span></a>
              <a href="#origin" className="is-lore">{t.lore}<span>↓</span></a>
            </div>
            <div className="wox-hero-specs" aria-label={lang === 'es' ? 'Datos principales de Saga I' : 'Saga I key facts'}>
              <a href="#worlds"><strong>04+1</strong><span>{lang === 'es' ? 'REGIONES' : 'REGIONS'}</span></a>
              <a href="#worlds"><strong>32</strong><span>{lang === 'es' ? 'MAPAS' : 'MAPS'}</span></a>
              <a href="#characters"><strong>08</strong><span>{lang === 'es' ? 'FORMAS' : 'FORMS'}</span></a>
              <a href="#development"><strong>G4</strong><span>GODOT 4 · ARPG 2D</span></a>
            </div>
            <nav className="wox-game-nav" aria-label={lang === 'es' ? 'Secciones de World of Xethkioz' : 'World of Xethkioz sections'}>
              {gameSections[lang].map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
            </nav>
          </div>
          <a className="wox-scroll" href="#origin" aria-label={t.scroll}><span />{t.scroll}</a>
        </section>
        <div className="wox-content">
          <section id="origin" data-chapter="01" className="wox-section wox-origin wox-editorial-open" aria-labelledby="origin-title">
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

          <section data-chapter="02" className="wox-section wox-duo wox-editorial-open" aria-labelledby="duo-title">
            <div className="wox-section-head">
              <p>{t.travelerEyebrow}</p>
              <h2 id="duo-title">{t.travelerTitle}</h2>
              <span>{t.travelerText}</span>
            </div>
            <div className="wox-duo-grid">
              <article><MediaPlaceholder orientation="portrait" code="PLAYER" subject={lang === 'es' ? 'EL VIAJERO' : 'THE TRAVELER'} label={lang === 'es' ? 'IDENTIDAD DEL VIAJERO' : 'TRAVELER IDENTITY'} src="/assets/world-of-xethkioz/web-art/player-etereo-sigil.svg" alt={lang === 'es' ? 'Representación abstracta protegida del Viajero' : 'Protected abstract representation of the Traveler'} /><small>01 // VIAJERO</small><strong>{lang === 'es' ? 'Nació de ecos que no eran suyos.' : 'Born from echoes that were not its own.'}</strong><p>{lang === 'es' ? 'Sin género, rostro ni pasado canónico. El nombre elegido por el jugador es su primer anclaje de identidad.' : 'No canonical gender, face or past. The player-chosen name becomes its first anchor of identity.'}</p></article>
              <article><MediaPlaceholder orientation="portrait" code="FORMA" subject="XETHKIOZ" label={lang === 'es' ? 'RESONANCIA DE XETHKIOZ' : 'XETHKIOZ RESONANCE'} src="/assets/world-of-xethkioz/web-art/xethkioz-resonance-sigil.svg" alt={lang === 'es' ? 'Emblema prismático protegido de Xethkioz' : 'Protected prismatic emblem of Xethkioz'} /><small>02 // XETHKIOZ</small><strong>{lang === 'es' ? 'No obedece. Acompaña.' : 'It does not obey. It accompanies.'}</strong><p>{lang === 'es' ? 'La Forma Abierta aprende afinidades sin perder identidad. Su vínculo evoluciona con la Resonancia y con las decisiones del Viajero.' : 'The Open Form learns affinities without losing identity. Its bond evolves through Resonance and the Traveler’s choices.'}</p></article>
            </div>
          </section>
          <section id="worlds" data-chapter="03" className="wox-section wox-world-showcase" aria-labelledby="worlds-title">
            <div className="wox-section-head">
              <p>{t.worldsEyebrow}</p>
              <h2 id="worlds-title">{t.worldsTitle}</h2>
            </div>
            <div className="wox-region-grid">
              {regions[lang].map(([name, maps, level, description], index) => (
                <article key={name} data-region={index + 1} className={activeRegion === index ? 'is-active' : ''}>
                  <button type="button" onClick={() => setActiveRegion(index)} aria-pressed={activeRegion === index}>
                    <img className="wox-region-keyart" src={regionArt[index]} alt="" loading="lazy" decoding="async" aria-hidden="true" />
                    <div><small>{maps}</small><span>{level}</span></div>
                    <h3>{name}</h3>
                    <p>{description}</p>
                    <b>{lang === 'es' ? 'EXPLORAR REGIÓN' : 'EXPLORE REGION'} <span>↘</span></b>
                    <i aria-hidden="true">0{index + 1}</i>
                  </button>
                </article>
              ))}
            </div>
            <div key={`region-console-${activeRegion}`} className="wox-region-console" data-region={activeRegion + 1} aria-live="polite"><MediaPlaceholder code="BIOMA" subject={selectedRegion.name} label={lang === 'es' ? 'VISIÓN DEL TERRITORIO' : 'TERRITORY VISION'} src={regionArt[activeRegion]} alt={lang === 'es' ? `Arte atmosférico protegido de ${selectedRegion.name}` : `Protected atmospheric art of ${selectedRegion.name}`} />
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

          <section id="atlas" data-chapter="04" className="wox-section wox-atlas wox-atlas-showcase" aria-labelledby="atlas-title">
            <div className="wox-section-head">
              <p>{t.bestiaryEyebrow}</p>
              <h2 id="atlas-title">{t.bestiaryTitle}</h2>
              <span>{lang === 'es' ? 'El Prisma-Atlas se completa por descubrimiento: avistamiento, conducta, interacción y análisis. Ver una criatura no implica una misión ni un combate.' : 'The Prism Atlas fills through discovery: sighting, behavior, interaction and analysis. Seeing a creature does not automatically mean a quest or a fight.'}</span>
            </div>
            <div className="wox-atlas-grid">
              {atlasEntries[lang].map(([title, text], index) => (
                <article key={title} data-atlas={index + 1} className={activeAtlas === index ? 'is-active' : ''}>
                  <button type="button" onClick={() => setActiveAtlas(index)} aria-pressed={activeAtlas === index}>
                    <span>◆</span><h3>{title}</h3><p>{text}</p>
                  </button>
                </article>
              ))}
            </div>
            <div key={`atlas-console-${activeAtlas}`} className="wox-atlas-console" data-atlas={activeAtlas + 1} aria-live="polite"><MediaPlaceholder orientation="square" code="ATLAS" subject={selectedAtlas.title} glyph={['GOB', 'MEC', 'FAU', 'BOS'][activeAtlas]} label={lang === 'es' ? 'REGISTRO DEL PRISMA-ATLAS' : 'PRISM-ATLAS RECORD'} />
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
          <section data-chapter="05" className="wox-section wox-forms-showcase" aria-labelledby="forms-title">
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
            <div key={`form-console-${activeForm}`} className="wox-form-console" aria-live="polite" data-form={activeForm + 1}>
              <MediaPlaceholder orientation="square" code="FORMA" subject={selectedForm[0]} glyph={selectedForm[0].slice(0, 2)} label={lang === 'es' ? 'SIGILO DE RESONANCIA' : 'RESONANCE SIGIL'} />
              <div>
                <small>{lang === 'es' ? 'FORMA DE CONVERGENCIA SELECCIONADA' : 'SELECTED CONVERGENCE FORM'}</small>
                <h3>{selectedForm[0]}</h3>
                <p><b>{lang === 'es' ? 'Vínculo' : 'Bond'}:</b> {selectedForm[1]}</p>
                <p><b>{lang === 'es' ? 'Afinidad' : 'Affinity'}:</b> {selectedForm[2]}</p>
              </div>
              <span className="wox-canon-lock">{lang === 'es' ? 'RESONANCIA ACTIVA' : 'ACTIVE RESONANCE'}</span>
            </div>
          </section>

          <section id="characters" data-chapter="06" className="wox-section wox-cast wox-cast-showcase" aria-labelledby="cast-title">
            <div className="wox-section-head">
              <p>{t.castEyebrow}</p>
              <h2 id="cast-title">{t.castTitle}</h2>
            </div>
            <div className="wox-featured-cast" aria-label={lang === 'es' ? 'Elenco principal de la Convergencia' : 'Main Convergence cast'}>
              {featuredCast[lang].map(([name, title, glyph], index) => (
                <article key={name} data-featured={index + 1}>
                  <div className="wox-featured-cast-art" aria-hidden="true"><i /><i /><b>{glyph}</b></div>
                  <small>{String(index + 1).padStart(2, '0')}</small>
                  <strong>{name}</strong>
                  <span>{title}</span>
                </article>
              ))}
            </div>
            <div className="wox-cast-archive-label"><span>{lang === 'es' ? 'ARCHIVO AMPLIADO' : 'EXPANDED ARCHIVE'}</span><b>{lang === 'es' ? '14 identidades canónicas registradas' : '14 canonical identities registered'}</b></div>
            <div className="wox-cast-grid">
              {cast[lang].map(([name, title], index) => (
                <article key={name} data-cast={index + 1} className={activeCast === index ? 'is-active' : ''}>
                  <button type="button" onClick={() => setActiveCast(index)} aria-pressed={activeCast === index}>
                    <small>{String(index + 1).padStart(2, '0')}</small>
                    <strong>{name}</strong>
                    {title ? <span>{title}</span> : null}
                  </button>
                </article>
              ))}
            </div>
            <div key={`cast-console-${activeCast}`} className="wox-cast-console" data-cast={activeCast + 1} aria-live="polite">
              <MediaPlaceholder orientation="portrait" code="CHAR" subject={selectedCast[0]} glyph={selectedCast[0].slice(0, 2).toUpperCase()} label={lang === 'es' ? 'ECO DE IDENTIDAD' : 'IDENTITY ECHO'} />
              <div>
                <small>{lang === 'es' ? 'IDENTIDAD CANÓNICA ACTIVA' : 'ACTIVE CANONICAL IDENTITY'}</small>
                <h3>{selectedCast[0]}</h3>
                {selectedCast[1] ? <p>{selectedCast[1]}</p> : null}
              </div>
              <span className="wox-canon-lock">WORLD OF XETHKIOZ</span>
            </div>
          </section>

          <section id="ecosystem" data-chapter="07" className="wox-section wox-ecosystem-stage" aria-labelledby="ecosystem-title">
            <div className="wox-section-head">
              <p>{lang === 'es' ? 'XETHKIOZ // ECOSISTEMA CONECTADO' : 'XETHKIOZ // CONNECTED ECOSYSTEM'}</p>
              <h2 id="ecosystem-title">{lang === 'es' ? 'El juego es un mundo. XETHKIOZ es una red.' : 'The game is a world. XETHKIOZ is a network.'}</h2>
              <span>{lang === 'es' ? 'Green Node, ciencia, desarrollo web y apoyo conviven como extensiones reales de la misma identidad, sin romper la inmersión de World of Xethkioz.' : 'Green Node, science, web development and support coexist as real extensions of the same identity without breaking World of Xethkioz immersion.'}</span>
            </div>
            <div className="wox-ecosystem-grid">
              {ecosystemCards[lang].map(([title, text, href, code]) => {
                const body = <><small>{code}</small><strong>{title}</strong><p>{text}</p><span>{lang === 'es' ? 'ABRIR PORTAL' : 'OPEN PORTAL'} ↗</span></>
                return href.startsWith('http')
                  ? <a key={title} href={href} target="_blank" rel="noopener noreferrer">{body}</a>
                  : <Link key={title} to={href}>{body}</Link>
              })}
            </div>
          </section>

          <section id="familiars" data-chapter="08" className="wox-section wox-familiars-stage" aria-labelledby="familiars-title">
            <div className="wox-section-head">
              <p>{lang === 'es' ? 'MASCOTAS // REFUGIO DE FAUNA' : 'PETS // WILDLIFE REFUGE'}</p>
              <h2 id="familiars-title">{lang === 'es' ? 'Compañeros, familiares y vida que no existe sólo para combatir.' : 'Companions, familiars and life that exists beyond combat.'}</h2>
              <span>{lang === 'es' ? 'El refugio de Valdros, Rola y Mela conecta cuidado, exploración y vínculo. Las piezas públicas son ilustraciones derivadas; los modelos originales permanecen reservados.' : 'Valdros, Rola and Mela’s refuge connects care, exploration and bonding. Public pieces are derived illustrations; original models remain private.'}</span>
            </div>
            <div className="wox-familiar-strip">
              {familiarCards[lang].map(([name, type, text, glyph], index) => (
                <article key={name} data-familiar={index + 1}>
                  <div className="wox-familiar-art" aria-hidden="true"><i /><i /><b>{glyph}</b></div>
                  <small>{type}</small><strong>{name}</strong><p>{text}</p>
                </article>
              ))}
            </div>
            <a className="wox-familiar-link" href="/mascotas/">{lang === 'es' ? 'ENTRAR AL HUB DE MASCOTAS Y REFUGIO' : 'ENTER PETS & REFUGE HUB'} <span>↗</span></a>
          </section>

          <section id="media-3d" data-chapter="09" className="wox-section wox-3d-stage" aria-labelledby="media-3d-title">
            <div className="wox-section-head">
              <p>{lang === 'es' ? 'WORLD OF XETHKIOZ // ARTE VISUAL' : 'WORLD OF XETHKIOZ // VISUAL ART'}</p>
              <h2 id="media-3d-title">{lang === 'es' ? 'El mundo toma forma antes de convertirse en juego.' : 'The world takes shape before it becomes a game.'}</h2>
              <span>{lang === 'es' ? 'Conceptos, atmósferas y piezas derivadas presentan el universo sin revelar los modelos finales. Más adelante, esta sección reunirá bocetos, procesos y arte del desarrollo.' : 'Concepts, atmospheres and derived pieces present the universe without revealing final models. Later, this section will gather sketches, process work and development art.'}</span>
            </div>
            <div className="wox-3d-grid" aria-label={lang === 'es' ? 'Presentación visual protegida de World of Xethkioz' : 'Protected World of Xethkioz visual presentation'}>
              <article className="wox-3d-veyr-card">
                <div className="wox-3d-viewport is-veyr">
                  <img src="/assets/world-of-xethkioz/web-art/veyr-green-sigil.svg" alt={lang === 'es' ? 'Manifestación web protegida de Veyr' : 'Protected web manifestation of Veyr'} loading="lazy" decoding="async" />
                  <span className="wox-3d-live-badge">{lang === 'es' ? 'MANIFESTACIÓN' : 'MANIFESTATION'}</span>
                </div>
                <div className="wox-3d-copy">
                  <small>{lang === 'es' ? 'PRESENCIA EN EL UNIVERSO' : 'PRESENCE IN THE UNIVERSE'}</small>
                  <strong>VEYR · WISP DEL GREEN NODE</strong>
                  <p>{lang === 'es' ? 'Veyr atraviesa el Green Node como una presencia de luz, datos y resonancia. Esta manifestación visual representa su vínculo con el ecosistema XETHKIOZ.' : 'Veyr moves through the Green Node as a presence of light, data and resonance. This visual manifestation represents its bond with the XETHKIOZ ecosystem.'}</p>
                  <Link className="wox-3d-link" to={localizePath('/green-node')}>{lang === 'es' ? 'ENTRAR AL GREEN NODE' : 'ENTER GREEN NODE'} <span>↗</span></Link>
                </div>
              </article>
              {[
                ['02', lang === 'es' ? 'ATMÓSFERAS DEL MUNDO' : 'WORLD ATMOSPHERES', lang === 'es' ? 'Biomas, arquitectura, luz y composición reinterpretados como arte promocional seguro.' : 'Biomes, architecture, light and composition reinterpreted as safe promotional art.'],
                ['03', lang === 'es' ? 'BOCETOS + PROCESO' : 'SKETCHES + PROCESS', lang === 'es' ? 'Estudios de símbolos, criaturas y escenarios sin publicar modelos, sprites ni capturas crudas.' : 'Studies of symbols, creatures and environments without publishing raw models, sprites or captures.'],
              ].map(([index, title, text]) => (
                <article key={index}>
                  <div className="wox-3d-viewport" aria-hidden="true"><span>{index}</span><i /><b /></div>
                  <div className="wox-3d-copy"><small>{lang === 'es' ? 'ARCHIVO EN APERTURA' : 'ARCHIVE OPENING'}</small><strong>{title}</strong><p>{text}</p></div>
                </article>
              ))}
            </div>
            <div className="wox-3d-note"><span>CONCEPT ART</span><span>WORLD DESIGN</span><span>RESONANCE</span><p>{lang === 'es' ? 'El archivo visual crecerá con conceptos, bocetos, pruebas de atmósfera y piezas promocionales del universo.' : 'The visual archive will grow with concepts, sketches, atmosphere studies and promotional pieces from the universe.'}</p></div>
          </section>

          <section id="development" data-chapter="10" className="wox-section wox-dev wox-dev-showcase" aria-labelledby="dev-title">
            <div className="wox-section-head">
              <p>{t.devEyebrow}</p>
              <h2 id="dev-title">{t.devTitle}</h2>
              <span>{t.devText}</span>
            </div>
            <div className="wox-dev-grid">
              <article><strong>32</strong><span>{lang === 'es' ? 'mapas físicos en Saga I' : 'physical maps in Saga I'}</span></article>
              <article><strong>120</strong><span>{lang === 'es' ? 'nivel máximo de Saga I' : 'Saga I level cap'}</span></article>
              <article><strong>8</strong><span>{lang === 'es' ? 'Formas de Convergencia' : 'Convergence Forms'}</span></article>
              <article><strong>GODOT 4</strong><span>{lang === 'es' ? 'motor de producción activo' : 'active production engine'}</span></article>
            </div>
            <div className="wox-dev-pulse" aria-label={lang === 'es' ? 'Hitos públicos del desarrollo' : 'Public development milestones'}>
              <span><i />CANON v2.0 LOCK</span>
              <span><i />32 MAPAS SAGA I</span>
              <span><i />ARTE CONCEPTUAL + GODOT 4</span>
              <span><i />VERTICAL SLICE EN PRODUCCIÓN</span>
            </div>
          </section>

          <section data-chapter="11" className="wox-section wox-roadmap wox-roadmap-showcase" aria-labelledby="roadmap-title">
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
            <div className="wox-tech-seals" aria-label={lang === 'es' ? 'Tecnologías y red' : 'Technology and network'}><span>GODOT 4</span><span>TRIPO 3D</span><span>GREEN NODE</span><span>VEYR/WISP</span></div>
            <div>
              <small className="wox-footer-status">{lang === 'es' ? 'SAGA I // EN DESARROLLO' : 'SAGA I // IN DEVELOPMENT'}</small>
              <strong>WORLD OF XETHKIOZ</strong>
              <span>© 2026 XETHKIOZ · {SITE_VERSION}</span>
              <small>{lang === 'es' ? 'Arte conceptual promocional. Los assets, modelos y materiales internos del juego no se publican en esta superficie.' : 'Promotional concept art. Internal game assets, models and production materials are not published on this surface.'}</small>
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

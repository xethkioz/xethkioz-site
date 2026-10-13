import { useLang } from '../../lib/LangContext'
import './UniverseSpotlight.css'

type GameKey = 'aion2' | 'wow'
type LocalCopy = { es: string; en: string }
type InfoCard = { kicker: LocalCopy; title: LocalCopy; description: LocalCopy }

const sources = {
  aion2: [
    { name: 'AION 2 — NC / sitio oficial', url: 'https://aion2.plaync.com/en-us/about/index' },
    { name: 'AION 2 — Steam', url: 'https://store.steampowered.com/app/3393110/AION_2/' },
    { name: 'NC America — novedades del lanzamiento', url: 'https://about.ncsoft.com/en/news/article/aion2_update_20260421' },
  ],
  wow: [
    { name: 'World of Warcraft: Forever — Blizzard', url: 'https://worldofwarcraft.blizzard.com/es-es/news/24302093' },
    { name: 'Razas y clases — Blizzard', url: 'https://news.blizzard.com/es-es/article/24304075/crea-un-heroe-a-tu-imagen-y-semejanza-en-world-of-warcraft-forever' },
    { name: 'Beta y requisitos de acceso — Blizzard', url: 'https://us.support.blizzard.com/es/help/article/189194' },
  ],
} satisfies Record<GameKey, { name: string; url: string }[]>

const data: Record<GameKey, {
  chapter: LocalCopy
  title: LocalCopy
  lead: LocalCopy
  status: LocalCopy
  stats: { value: LocalCopy; label: LocalCopy }[]
  cards: InfoCard[]
  steps: LocalCopy[]
  classes: string[]
  note: LocalCopy
}> = {
  aion2: {
    chapter: { es: 'ATREIA · PORTAL DE LOS DAEVAS', en: 'ATREIA · DAEVA PORTAL' },
    title: { es: 'AION 2: volá, explorá y elegí tu camino.', en: 'AION 2: fly, explore and choose your path.' },
    lead: {
      es: 'MMORPG de mundo abierto de NC, disponible para PC desde el 5 de octubre de 2026. Dos facciones enfrentadas, libertad de vuelo, combates aéreos y contenido cooperativo y competitivo.',
      en: 'NC’s open-world PC MMORPG, available since October 5, 2026. Two rival factions, free flight, aerial battles and both cooperative and competitive challenges.',
    },
    status: { es: 'DISPONIBLE · PC / STEAM / PURPLE', en: 'AVAILABLE · PC / STEAM / PURPLE' },
    stats: [
      { value: { es: '05 OCT', en: 'OCT 05' }, label: { es: 'Lanzamiento global 2026', en: '2026 global release' } },
      { value: { es: '8', en: '8' }, label: { es: 'Clases de inicio global', en: 'Global starting classes' } },
      { value: { es: '36×', en: '36×' }, label: { es: 'Mundo frente al AION original', en: 'World vs original AION' } },
      { value: { es: 'UE5', en: 'UE5' }, label: { es: 'Motor gráfico', en: 'Game engine' } },
    ],
    cards: [
      { kicker: { es: '01 / FACCIONES', en: '01 / FACTIONS' }, title: { es: 'Elyos y Asmodians', en: 'Elyos and Asmodians' }, description: { es: 'Elegí tu facción antes de crear tu Daeva. La historia transcurre 200 años después del conflicto original, con los Balaur como amenaza central.', en: 'Choose your faction before making your Daeva. The story takes place 200 years after the original conflict, with the Balaur as a major threat.' } },
      { kicker: { es: '02 / COMBATE', en: '02 / COMBAT' }, title: { es: 'El cielo también es batalla', en: 'The sky is a battlefield' }, description: { es: 'Vuelo libre, combate aéreo y exploración vertical. Precisión, posicionamiento y sincronización cuentan tanto en PvE como en PvP.', en: 'Free flight, aerial combat and vertical exploration. Precision, positioning and timing matter across PvE and PvP.' } },
      { kicker: { es: '03 / GRUPO', en: '03 / GROUP' }, title: { es: 'Mazmorras, raids y Abismo', en: 'Dungeons, raids and Abyss' }, description: { es: 'Instancias en solitario, grupos, raids y combates de facciones. Para empezar, aprendé tu rol y sus mecánicas antes de buscar equipo.', en: 'Solo instances, group content, raids and faction battles. Start by learning your role and its mechanics before chasing gear.' } },
    ],
    steps: [
      { es: 'Elegí Elyos o Asmodians según tu facción y la comunidad con la que quieras jugar.', en: 'Choose Elyos or Asmodians depending on the faction and community you want to join.' },
      { es: 'Probá el ritmo de tu clase, configurá controles y practicá las habilidades en zonas seguras.', en: 'Get comfortable with your class, set up controls and practice your abilities in safe zones.' },
      { es: 'Aprendé a volar y aprovechá la altura para explorar y combatir.', en: 'Learn to fly and use verticality in exploration and combat.' },
      { es: 'Avanzá por la historia y sumate a mazmorras o PvP cuando entiendas el sistema de progresión.', en: 'Progress through the story, then try dungeons or PvP once you know the progression systems.' },
    ],
    classes: ['Templario', 'Gladiador', 'Asesino', 'Explorador', 'Hechicero', 'Espiritualista', 'Clérigo', 'Cantor'],
    note: {
      es: 'La lista de ocho clases corresponde al lanzamiento global. Algunas versiones regionales reciben contenido y balances en momentos diferentes. XETHKIOZ no es un sitio oficial de NC.',
      en: 'The eight-class list refers to the global launch. Regional versions can receive classes and balance changes at different times. XETHKIOZ is not affiliated with NC.',
    },
  },
  wow: {
    chapter: { es: 'AZEROTH · UN NUEVO CLÁSICO PERMANENTE', en: 'AZEROTH · A NEW PERMANENT CLASSIC JOURNEY' },
    title: { es: 'WoW: Forever. El mundo vuelve a ser protagonista.', en: 'WoW: Forever. The world takes center stage again.' },
    lead: {
      es: 'Una nueva experiencia permanente de Blizzard, separada de WoW moderno y Classic. Regresá a Azeroth, explorá nuevas historias y progresá del nivel 1 al 60 con foco en la aventura y la comunidad.',
      en: 'A new permanent Blizzard experience alongside modern and Classic WoW. Return to Azeroth, discover new stories and journey from level 1 to 60 with adventure and community at the heart.',
    },
    status: { es: 'BETA EN CURSO · ESTRENO 04/05 NOV 2026', en: 'BETA LIVE · NOV 04/05, 2026 LAUNCH' },
    stats: [
      { value: { es: '17 SEP', en: 'SEP 17' }, label: { es: 'Inicio de la beta 2026', en: '2026 beta start' } },
      { value: { es: '04 NOV', en: 'NOV 04' }, label: { es: 'Lanzamiento en horario de EE. UU.', en: 'US launch date' } },
      { value: { es: '1–60', en: '1–60' }, label: { es: 'Progresión de niveles', en: 'Leveling journey' } },
      { value: { es: '9', en: '9' }, label: { es: 'Clases clásicas', en: 'Classic classes' } },
    ],
    cards: [
      { kicker: { es: '01 / MUNDO', en: '01 / WORLD' }, title: { es: 'Una Azeroth renovada', en: 'A reimagined Azeroth' }, description: { es: 'Continentes originales con nuevas historias. El viaje, los encuentros casuales y la exploración tienen tanta importancia como el destino.', en: 'The original continents with new stories. The journey, spontaneous encounters and exploration matter as much as the destination.' } },
      { kicker: { es: '02 / PERSONAJES', en: '02 / CHARACTERS' }, title: { es: 'Horda, Alianza y cielonatos', en: 'Horde, Alliance and Skyborne' }, description: { es: 'La nueva raza cielonato amplía la creación de héroes. Las combinaciones de raza y clase tienen reglas específicas: consultá la guía oficial antes de elegir.', en: 'The new Skyborne race expands character creation. Race and class pairings have specific rules: check the official guide before choosing.' } },
      { kicker: { es: '03 / COMUNIDAD', en: '03 / COMMUNITY' }, title: { es: 'Tu historia con otros jugadores', en: 'Your story with other players' }, description: { es: 'Misiones, profesiones, mazmorras y encuentros sociales. Su filosofía premia la cooperación, el mundo compartido y el progreso de cada aventurero.', en: 'Quests, professions, dungeons and social moments. Its pillars reward cooperation, the shared world and each adventurer’s progress.' } },
    ],
    steps: [
      { es: 'Elegí Horda o Alianza y revisá las combinaciones de razas y clases confirmadas por Blizzard.', en: 'Choose Horde or Alliance and review Blizzard’s confirmed race/class combinations.' },
      { es: 'Definí una clase que disfrutes subir: la aventura de nivel 1 a 60 es parte central de Forever.', en: 'Pick a class you enjoy leveling: the 1–60 journey is central to Forever.' },
      { es: 'Explorá zonas, misiones y profesiones; armá grupo para mazmorras y encuentros del mundo.', en: 'Explore zones, quests and professions; form groups for dungeons and encounters.' },
      { es: 'Revisá acceso a la beta y novedades en Battle.net. Se necesita suscripción o tiempo de juego para el lanzamiento.', en: 'Check beta eligibility and updates on Battle.net. Launch requires an active subscription or game time.' },
    ],
    classes: ['Guerrero', 'Paladín', 'Cazador', 'Pícaro', 'Sacerdote', 'Chamán', 'Mago', 'Brujo', 'Druida'],
    note: {
      es: 'Beta desde el 17 de septiembre (acceso sujeto a selección o edición habilitante); lanzamiento global el 4 de noviembre en América y 5 de noviembre en Europa según zona horaria. XETHKIOZ es un portal independiente de fans.',
      en: 'Beta began September 17 (access subject to selection or eligible upgrade); global launch falls on November 4 in the Americas and November 5 in Europe depending on time zone. XETHKIOZ is an independent fan portal.',
    },
  },
}

export default function UniverseSpotlight({ game }: { game: GameKey }) {
  const { lang } = useLang()
  const t = (copy: LocalCopy) => copy[lang]
  const info = data[game]
  const aion = game === 'aion2'
  return (
    <section className={'xk-game-dossier ' + (aion ? 'is-aion' : 'is-wow')} id="xk-universe-spotlight" aria-labelledby="xk-dossier-title">
      <div className="xk-game-dossier__heading">
        <span className="xk-game-dossier__eyebrow">{t(info.chapter)}</span>
        <span className="xk-game-dossier__status"><i aria-hidden="true" />{t(info.status)}</span>
        <h3 id="xk-dossier-title">{t(info.title)}</h3>
        <p>{t(info.lead)}</p>
      </div>
      <div className="xk-game-dossier__stats">
        {info.stats.map(stat => <div className="xk-game-dossier__stat" key={stat.label.en}><strong>{t(stat.value)}</strong><span>{t(stat.label)}</span></div>)}
      </div>
      <div className="xk-game-dossier__cards">
        {info.cards.map(card => <article className="xk-game-dossier__card" key={card.title.en}>
          <small>{t(card.kicker)}</small><h4>{t(card.title)}</h4><p>{t(card.description)}</p>
        </article>)}
      </div>
      <div className="xk-game-dossier__lower">
        <section className="xk-game-dossier__route" aria-label={lang === 'es' ? 'Guía de primeros pasos' : 'Getting started'}>
          <h4>{lang === 'es' ? 'TU RUTA PARA EMPEZAR' : 'YOUR STARTING ROUTE'}</h4>
          <ol>{info.steps.map((step, i) => <li key={i}><b>{String(i + 1).padStart(2,'0')}</b><span>{t(step)}</span></li>)}</ol>
        </section>
        <section className="xk-game-dossier__roles" aria-label={lang === 'es' ? 'Clases' : 'Classes'}>
          <h4>{lang === 'es' ? 'CLASES Y ESPECIALIZACIONES' : 'CLASSES & PLAY STYLES'}</h4>
          <p>{aion ? (lang === 'es' ? 'Ocho clases del lanzamiento global.' : 'Eight global launch classes.') : (lang === 'es' ? 'Nueve clases de la Azeroth de Forever.' : 'Nine classes in Forever’s Azeroth.')}</p>
          <div className="xk-game-dossier__tags">{info.classes.map(role => <span key={role}>{role}</span>)}</div>
          {aion && <p className="xk-game-dossier__community">{lang === 'es' ? 'InnerCircle · Elyos. Conocé también a jugadores de AION 2 Global SA' : 'InnerCircle · Elyos. Meet other AION 2 Global SA players'} · <a href="https://chat.whatsapp.com/Cxa2IPrbk4r22VadmTMj9T" target="_blank" rel="noopener noreferrer">{lang === 'es' ? 'Unirse al grupo ↗' : 'Join the group ↗'}</a></p>}
        </section>
      </div>
      <footer className="xk-game-dossier__sources">
        <div>
          <strong>{lang === 'es' ? 'FUENTES OFICIALES Y VERIFICACIÓN' : 'OFFICIAL SOURCES & VERIFICATION'}</strong>
          <p>{t(info.note)}</p>
        </div>
        <div className="xk-game-dossier__source-links">
          {sources[game].map(source => <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer">{source.name} <span aria-hidden="true">↗</span></a>)}
        </div>
      </footer>
    </section>
  )
}

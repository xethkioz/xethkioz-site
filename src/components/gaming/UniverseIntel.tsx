import { useState } from 'react'
import { useLang } from '../../lib/LangContext'
import './UniverseIntel.css'

type Universe = 'aion2' | 'wow'
type IntelTab = 'history' | 'races' | 'classes' | 'requirements'
type LocalText = { es: string; en: string }

type ClassEntry = {
  name: LocalText
  role: LocalText
  description: LocalText
  weapon: LocalText
}

type RaceEntry = {
  name: string
  classes: string
}

type FactionEntry = {
  name: LocalText
  eyebrow: LocalText
  description: LocalText
  races?: RaceEntry[]
}

type RequirementEntry = {
  label: LocalText
  badge: LocalText
  status: 'official' | 'estimate'
  lines: LocalText[]
}

const aionClasses: ClassEntry[] = [
  { name: { es: 'Templario', en: 'Templar' }, role: { es: 'Tanque · primera línea', en: 'Tank · frontline' }, description: { es: 'Protege al grupo, sostiene la atención de los enemigos y aguanta el daño en los encuentros.', en: 'Protects the group, holds enemy attention and withstands damage during encounters.' }, weapon: { es: 'Espada larga y escudo', en: 'Longsword and shield' } },
  { name: { es: 'Gladiador', en: 'Gladiator' }, role: { es: 'Daño cuerpo a cuerpo', en: 'Melee damage' }, description: { es: 'Combate frontal con golpes amplios y presión sostenida sobre varios enemigos.', en: 'Frontline fighting with sweeping attacks and sustained pressure on multiple enemies.' }, weapon: { es: 'Espadón', en: 'Greatsword' } },
  { name: { es: 'Asesino', en: 'Assassin' }, role: { es: 'Daño explosivo · movilidad', en: 'Burst damage · mobility' }, description: { es: 'Busca ventanas cortas para entrar, ejecutar combinaciones y reposicionarse.', en: 'Looks for short windows to engage, execute combos and reposition.' }, weapon: { es: 'Dagas', en: 'Daggers' } },
  { name: { es: 'Explorador', en: 'Ranger' }, role: { es: 'Daño físico a distancia', en: 'Ranged physical damage' }, description: { es: 'Mantiene la distancia y castiga objetivos con precisión, alcance y control del espacio.', en: 'Keeps distance and pressures targets with precision, range and space control.' }, weapon: { es: 'Arco', en: 'Bow' } },
  { name: { es: 'Hechicero', en: 'Sorcerer' }, role: { es: 'Magia · daño a distancia', en: 'Magic · ranged damage' }, description: { es: 'Canaliza magia ofensiva para causar grandes picos de daño y controlar zonas.', en: 'Channels offensive magic for high damage bursts and area control.' }, weapon: { es: 'Libro de hechizos', en: 'Spellbook' } },
  { name: { es: 'Espiritualista', en: 'Spiritmaster' }, role: { es: 'Invocación · control', en: 'Summoning · control' }, description: { es: 'Utiliza espíritus y efectos de control para desgastar y limitar las acciones rivales.', en: 'Uses spirits and control effects to wear down and limit enemy actions.' }, weapon: { es: 'Orbe', en: 'Orb' } },
  { name: { es: 'Clérigo', en: 'Cleric' }, role: { es: 'Sanación · apoyo', en: 'Healing · support' }, description: { es: 'Mantiene con vida al equipo y aporta herramientas defensivas para superar encuentros.', en: 'Keeps the team alive and provides defensive tools to overcome encounters.' }, weapon: { es: 'Maza', en: 'Mace' } },
  { name: { es: 'Cantor', en: 'Chanter' }, role: { es: 'Apoyo · mejoras de grupo', en: 'Support · group buffs' }, description: { es: 'Refuerza al grupo con mejoras y combina utilidad con combate cercano.', en: 'Strengthens the group with buffs and combines utility with close-range combat.' }, weapon: { es: 'Bastón', en: 'Staff' } },
]

const wowClasses: ClassEntry[] = [
  { name: { es: 'Druida', en: 'Druid' }, role: { es: 'Híbrido · naturaleza', en: 'Hybrid · nature' }, description: { es: 'Cambia de forma y puede adaptarse al daño, la sanación o la resistencia según la especialización.', en: 'Shapeshifts and can adapt to damage, healing or durability depending on specialization.' }, weapon: { es: 'Bastones y armas compatibles', en: 'Staves and compatible weapons' } },
  { name: { es: 'Cazador', en: 'Hunter' }, role: { es: 'Daño a distancia · mascota', en: 'Ranged damage · pet' }, description: { es: 'Ataca desde lejos y utiliza compañeros animales para aportar daño y utilidad.', en: 'Attacks from range and uses animal companions for damage and utility.' }, weapon: { es: 'Arcos, armas de fuego y otras armas de cazador', en: 'Bows, guns and other hunter weapons' } },
  { name: { es: 'Mago', en: 'Mage' }, role: { es: 'Magia · control', en: 'Magic · control' }, description: { es: 'Domina escuelas arcanas, fuego y hielo para infligir daño y controlar el campo de batalla.', en: 'Masters arcane magic, fire and frost to deal damage and control the battlefield.' }, weapon: { es: 'Bastones, varitas y armas de mago', en: 'Staves, wands and mage weapons' } },
  { name: { es: 'Paladín', en: 'Paladin' }, role: { es: 'Defensa · apoyo sagrado', en: 'Defense · holy support' }, description: { es: 'Combina armadura pesada con herramientas para proteger, curar y castigar a sus enemigos.', en: 'Combines heavy armor with tools to protect, heal and punish enemies.' }, weapon: { es: 'Armas de paladín y escudo según la función', en: 'Paladin weapons and shield depending on role' } },
  { name: { es: 'Sacerdote', en: 'Priest' }, role: { es: 'Sanación · magia de sombras', en: 'Healing · shadow magic' }, description: { es: 'Puede sostener a sus aliados o ejercer presión ofensiva con poderes de la Luz y las sombras.', en: 'Can sustain allies or apply offensive pressure through Light and shadow powers.' }, weapon: { es: 'Bastones, mazas y armas compatibles', en: 'Staves, maces and compatible weapons' } },
  { name: { es: 'Pícaro', en: 'Rogue' }, role: { es: 'Sigilo · daño explosivo', en: 'Stealth · burst damage' }, description: { es: 'Se apoya en el sigilo, el posicionamiento, los venenos y las aperturas precisas.', en: 'Relies on stealth, positioning, poisons and precise openings.' }, weapon: { es: 'Armas de una mano y dagas', en: 'One-handed weapons and daggers' } },
  { name: { es: 'Chamán', en: 'Shaman' }, role: { es: 'Elementos · apoyo', en: 'Elements · support' }, description: { es: 'Combina fuerzas elementales, tótems y herramientas de apoyo para responder a distintas situaciones.', en: 'Combines elemental forces, totems and support tools to answer different situations.' }, weapon: { es: 'Armas chamánicas y escudo según la especialización', en: 'Shaman weapons and shield depending on specialization' } },
  { name: { es: 'Brujo', en: 'Warlock' }, role: { es: 'Magia vil · demonios', en: 'Fel magic · demons' }, description: { es: 'Utiliza magia oscura, efectos de daño prolongado y demonios invocados para dominar el combate.', en: 'Uses dark magic, damage-over-time effects and summoned demons to control combat.' }, weapon: { es: 'Bastones, varitas y armas de brujo', en: 'Staves, wands and warlock weapons' } },
  { name: { es: 'Guerrero', en: 'Warrior' }, role: { es: 'Combate físico · primera línea', en: 'Physical combat · frontline' }, description: { es: 'Se especializa en armas, presión directa y resistencia, con opciones ofensivas o defensivas.', en: 'Specializes in weapons, direct pressure and durability, with offensive or defensive options.' }, weapon: { es: 'Armas marciales y escudos según la función', en: 'Martial weapons and shields depending on role' } },
]

const wowHorde: RaceEntry[] = [
  { name: 'Orco', classes: 'Cazador · Mago · Pícaro · Chamán · Brujo · Guerrero' },
  { name: 'Tauren', classes: 'Druida · Cazador · Chamán · Guerrero' },
  { name: 'Trol', classes: 'Cazador · Mago · Sacerdote · Pícaro · Chamán · Brujo · Guerrero' },
  { name: 'No-muerto', classes: 'Mago · Paladín · Sacerdote · Pícaro · Brujo · Guerrero' },
  { name: 'Célico Formaviento', classes: 'Druida · Cazador · Pícaro · Chamán · Guerrero' },
]

const wowAlliance: RaceEntry[] = [
  { name: 'Enano', classes: 'Cazador · Paladín · Sacerdote · Pícaro · Chamán · Guerrero' },
  { name: 'Gnomo', classes: 'Mago · Sacerdote · Pícaro · Brujo · Guerrero' },
  { name: 'Humano', classes: 'Cazador · Mago · Paladín · Sacerdote · Pícaro · Brujo · Guerrero' },
  { name: 'Elfo de la noche', classes: 'Druida · Cazador · Sacerdote · Pícaro · Guerrero' },
  { name: 'Célico de la Orden Eminente', classes: 'Druida · Cazador · Mago · Pícaro · Guerrero' },
]

const sources = {
  aion2: [
    { es: 'AION 2 · ficha y requisitos publicados', en: 'AION 2 · published game details and requirements', href: 'https://store.steampowered.com/app/3393110/AION_2/?l=latam' },
    { es: 'Soporte oficial de AION 2 Global', en: 'Official AION 2 Global support', href: 'https://help.plaync.com/faq/aion2global?faqNo=7083' },
    { es: 'Roster Global y funciones de clase · referencia comunitaria', en: 'Global roster and class roles · community reference', href: 'https://www.aion2game.wiki/classes/class-list/' },
  ],
  wow: [
    { es: 'Blizzard · razas y combinaciones de clase de WoW: Forever', en: 'Blizzard · WoW: Forever races and class combinations', href: 'https://worldofwarcraft.blizzard.com/en-us/news/24304075/erschafft-den-helden-der-ihr-sein-wollt-in-world-of-warcraft-forever' },
    { es: 'Blizzard · nueva raza célica', en: 'Blizzard · new Skyborne/Celestial race', href: 'https://worldofwarcraft.blizzard.com/en-us/news/24304075/erschafft-den-helden-der-ihr-sein-wollt-in-world-of-warcraft-forever' },
    { es: 'Blizzard · requisitos de sistema de World of Warcraft', en: 'Blizzard · World of Warcraft system requirements', href: 'https://eu.shop.battle.net/en-us/product/world-of-warcraft-subscription' },
    { es: 'Blizzard · cambios de GPU de WoW: Forever', en: 'Blizzard · WoW: Forever GPU requirements', href: 'https://worldofwarcraft.blizzard.com/es-es/news/24301512/requisitos-de-gpu-para-world-of-warcraft-forever' },
  ],
}

const copy = {
  es: {
    eyebrow: 'ARCHIVO DEL UNIVERSO // XETHKIOZ INTEL',
    titleAion: 'Conocé Atreia.',
    titleWow: 'Explorá Azeroth.',
    subtitleAion: 'Historia, facciones, clases y requisitos de AION 2 en un solo lugar.',
    subtitleWow: 'Razas, clases, historia y requisitos para preparar tu aventura en WoW: Forever.',
    tabs: [
      { id: 'history' as const, label: 'Historia' },
      { id: 'races' as const, label: 'Razas' },
      { id: 'classes' as const, label: 'Clases' },
      { id: 'requirements' as const, label: 'Requisitos PC' },
    ],
    sourceLabel: 'Fuentes y verificación',
    sourceNote: 'Los perfiles publicados se separan del objetivo alto sugerido por XETHKIOZ. WoW: Forever tiene condiciones específicas de compatibilidad de GPU; revisá la nota de Blizzard antes de comprar hardware. Las combinaciones de raza y clase pueden cambiar con las actualizaciones.',
    factionLabel: 'Facción',
    availableClasses: 'Clases disponibles',
    weapon: 'Arma principal',
    specsHeading: 'Tres perfiles para comparar tu PC',
    official: 'Publicado oficialmente',
    estimate: 'Referencia recomendada · no oficial',
    low: 'MÍNIMO',
    medium: 'MEDIO',
    high: 'ALTO',
    highNote: 'Perfil de referencia para buscar más estabilidad y calidad visual; no es una cifra garantizada de FPS.',
    aion: {
      historyTitle: 'Atreia, una tierra dividida',
      history: 'La saga AION transcurre en Atreia, un mundo marcado por la caída de la Torre de la Eternidad y por la división entre Elyos y Asmodians. Sus Daevas alados luchan por el destino de su pueblo mientras el Abismo y la amenaza de los Balaur convierten el conflicto en una guerra por el equilibrio del mundo. AION 2 amplía esta fantasía con exploración, combate, vuelo y contenidos PvE y PvP.',
      facts: [
        'Elyos y Asmodians son las dos facciones jugables principales.',
        'La elección de facción define tu contexto narrativo y comunidad; el roster global consultado comparte las ocho clases entre ambas.',
        'El Abismo representa uno de los escenarios centrales del enfrentamiento entre facciones.',
      ],
      racesTitle: 'Elegí tu facción',
      racesDescription: 'No son razas separadas por especie en el creador global: son las dos facciones de Daevas disponibles para elegir.',
      classesNote: 'Roster de la versión Global consultada: ocho clases. La disponibilidad puede diferir de las versiones coreana y taiwanesa.',
      req: [
        { label: 'Mínimo para entrar', badge: 'Ajustes muy bajos', status: 'official' as const, lines: [
          { es: 'Windows 10/11 de 64 bits · DirectX 12', en: '' },
          { es: 'CPU: AMD Ryzen 5 2600 / Intel Core i5-10500', en: '' },
          { es: 'RAM: 8 GB · GPU: GTX 1050 Ti 4 GB / Radeon RX 470 4 GB', en: '' },
          { es: '100 GB libres. SSD recomendado; en 1080p se indica usar calidad Muy baja.', en: '' },
        ]},
        { label: 'Medio · recomendado oficial', badge: 'FHD · calidad baja', status: 'official' as const, lines: [
          { es: 'Windows 10/11 de 64 bits · DirectX 12', en: '' },
          { es: 'CPU: AMD Ryzen 7 3700X / Intel Core i7-11700', en: '' },
          { es: 'RAM: 16 GB · GPU: RTX 2070 8 GB / Radeon RX 5700 XT 8 GB', en: '' },
          { es: '100 GB libres. SSD recomendado; la ficha oficial indica calidad Baja en FHD.', en: '' },
        ]},
        { label: 'Alto · objetivo XETHKIOZ', badge: '1440p · alto como objetivo', status: 'estimate' as const, lines: [
          { es: 'Windows 11 de 64 bits y DirectX 12', en: '' },
          { es: 'CPU orientativa: Ryzen 7 7800X3D / Intel Core i7 moderno equivalente', en: '' },
          { es: 'RAM: 32 GB · GPU objetivo: RTX 4070 12 GB / Radeon RX 7800 XT 16 GB', en: '' },
          { es: 'SSD NVMe con 100 GB libres o más. Meta orientativa, no requisito oficial.', en: '' },
        ]},
      ],
    },
    wow: {
      historyTitle: 'Azeroth: facciones, héroes y amenazas',
      history: 'World of Warcraft cuenta historias de los pueblos de Azeroth, sus alianzas y rivalidades entre la Horda y la Alianza, además de amenazas que obligan a cooperar a razas enfrentadas. WoW: Forever presenta una nueva etapa con combinaciones de clase y raza ampliadas, reglas de juego elegibles y una raza célica cuya historia inicial comienza en la Isla de Zephras.',
      facts: [
        'La Horda y la Alianza son los dos grandes bloques de facciones jugables.',
        'WoW: Forever ofrece conjuntos de reglas como Normal, JcJ y Rol; el modo Hardcore se anunció para una etapa posterior al lanzamiento.',
        'La historia inicial de los célicos se desarrolla en la Isla de Zephras, en los niveles 1 a 12.',
      ],
      racesTitle: 'Razas y afinidades',
      racesDescription: 'Estas son las razas y combinaciones documentadas en la guía oficial de WoW: Forever consultada.',
      classesNote: 'Las nueve clases disponibles en la referencia oficial son Druida, Cazador, Mago, Paladín, Sacerdote, Pícaro, Chamán, Brujo y Guerrero.',
      req: [
        { label: 'Mínimo para entrar', badge: '720p · calidad baja', status: 'official' as const, lines: [
          { es: 'Windows 10 de 64 bits (actualización de mayo de 2019 o posterior)', en: '' },
          { es: 'CPU: 4 núcleos, 3,0 GHz; Intel Core Haswell (4.ª gen.) / AMD Ryzen Zen', en: '' },
          { es: 'RAM: 8 GB · GPU DirectX 12 compatible. Verificá el modelo en la nota oficial de GPU de WoW: Forever', en: '' },
          { es: 'SSD con 128 GB libres y conexión de banda ancha.', en: '' },
        ]},
        { label: 'Medio · recomendado oficial', badge: 'Recomendado por Blizzard', status: 'official' as const, lines: [
          { es: 'Windows 10 de 64 bits', en: '' },
          { es: 'CPU: 6 núcleos, 3,5 GHz; Intel Core Coffee Lake (8.ª gen.) / AMD Ryzen Zen 2', en: '' },
          { es: 'RAM: 16 GB · GPU DX12 de 8 GB: NVIDIA GeForce RTX / AMD RDNA 2 / Intel Arc 7', en: '' },
          { es: 'SSD con 128 GB libres y conexión de banda ancha.', en: '' },
        ]},
        { label: 'Alto · objetivo XETHKIOZ', badge: '1440p · alto/ultra como objetivo', status: 'estimate' as const, lines: [
          { es: 'Windows 11 de 64 bits y SSD NVMe con 128 GB libres o más', en: '' },
          { es: 'CPU objetivo: Ryzen 7 7800X3D / Intel Core i7 de generación reciente', en: '' },
          { es: 'RAM: 32 GB · GPU objetivo: RTX 4070 12 GB / Radeon RX 7800 XT 16 GB o superior', en: '' },
          { es: 'Perfil orientativo para más margen en raids y pantallas concurridas; no es requisito oficial.', en: '' },
        ]},
      ],
    },
  },
  en: {
    eyebrow: 'UNIVERSE ARCHIVE // XETHKIOZ INTEL',
    titleAion: 'Discover Atreia.',
    titleWow: 'Explore Azeroth.',
    subtitleAion: 'AION 2 history, factions, classes and PC requirements in one place.',
    subtitleWow: 'Races, classes, story and PC requirements for your WoW: Forever journey.',
    tabs: [
      { id: 'history' as const, label: 'Story' },
      { id: 'races' as const, label: 'Races' },
      { id: 'classes' as const, label: 'Classes' },
      { id: 'requirements' as const, label: 'PC requirements' },
    ],
    sourceLabel: 'Sources and verification',
    sourceNote: 'Published profiles are separated from XETHKIOZ’s suggested high-end target. WoW: Forever has specific GPU compatibility conditions; review Blizzard’s note before buying hardware. Race and class combinations may change with updates.',
    factionLabel: 'Faction',
    availableClasses: 'Available classes',
    weapon: 'Main weapon',
    specsHeading: 'Three profiles to compare your PC',
    official: 'Officially published',
    estimate: 'Suggested reference · unofficial',
    low: 'MINIMUM',
    medium: 'MEDIUM',
    high: 'HIGH',
    highNote: 'A target profile for better visual quality and headroom, not a guaranteed FPS figure.',
    aion: {
      historyTitle: 'Atreia, a divided world',
      history: 'The AION saga takes place in Atreia, a world shaped by the fall of the Tower of Eternity and the division between Elyos and Asmodians. Their winged Daevas fight for the fate of their people while the Abyss and the Balaur threat turn the conflict into a struggle for the world’s balance. AION 2 expands this fantasy with exploration, combat, flight, and PvE and PvP activities.',
      facts: [
        'Elyos and Asmodians are the two main playable factions.',
        'Faction choice shapes the story context and community; the global roster consulted shares all eight classes across both.',
        'The Abyss is one of the central settings of the faction conflict.',
      ],
      racesTitle: 'Choose your faction',
      racesDescription: 'In the global character creation context, these are the two Daeva factions rather than species-separated race lists.',
      classesNote: 'Roster for the consulted Global version: eight classes. Availability can differ from Korean and Taiwanese builds.',
      req: [
        { label: 'Minimum to enter', badge: 'Very low settings', status: 'official' as const, lines: [
          { es: 'Windows 10/11 64-bit · DirectX 12', en: 'Windows 10/11 64-bit · DirectX 12' },
          { es: 'CPU: AMD Ryzen 5 2600 / Intel Core i5-10500', en: 'CPU: AMD Ryzen 5 2600 / Intel Core i5-10500' },
          { es: 'RAM: 8 GB · GPU: GTX 1050 Ti 4 GB / Radeon RX 470 4 GB', en: 'RAM: 8 GB · GPU: GTX 1050 Ti 4 GB / Radeon RX 470 4 GB' },
          { es: '100 GB free. SSD recommended; at 1080p, Very Low quality is suggested.', en: '100 GB free. SSD recommended; at 1080p, Very Low quality is suggested.' },
        ]},
        { label: 'Medium · official recommended', badge: 'FHD · low quality', status: 'official' as const, lines: [
          { es: 'Windows 10/11 64-bit · DirectX 12', en: 'Windows 10/11 64-bit · DirectX 12' },
          { es: 'CPU: AMD Ryzen 7 3700X / Intel Core i7-11700', en: 'CPU: AMD Ryzen 7 3700X / Intel Core i7-11700' },
          { es: 'RAM: 16 GB · GPU: RTX 2070 8 GB / Radeon RX 5700 XT 8 GB', en: 'RAM: 16 GB · GPU: RTX 2070 8 GB / Radeon RX 5700 XT 8 GB' },
          { es: '100 GB free. SSD recommended; official FHD guidance says Low quality.', en: '100 GB free. SSD recommended; official FHD guidance says Low quality.' },
        ]},
        { label: 'High · XETHKIOZ target', badge: '1440p · high target', status: 'estimate' as const, lines: [
          { es: 'Windows 11 64-bit and DirectX 12', en: 'Windows 11 64-bit and DirectX 12' },
          { es: 'Suggested CPU: Ryzen 7 7800X3D / modern equivalent Intel Core i7', en: 'Suggested CPU: Ryzen 7 7800X3D / modern equivalent Intel Core i7' },
          { es: 'RAM: 32 GB · target GPU: RTX 4070 12 GB / Radeon RX 7800 XT 16 GB', en: 'RAM: 32 GB · target GPU: RTX 4070 12 GB / Radeon RX 7800 XT 16 GB' },
          { es: 'NVMe SSD with 100 GB free or more. This is a target, not an official requirement.', en: 'NVMe SSD with 100 GB free or more. This is a target, not an official requirement.' },
        ]},
      ],
    },
    wow: {
      historyTitle: 'Azeroth: factions, heroes and threats',
      history: 'World of Warcraft tells the stories of Azeroth’s peoples, their alliances and rivalries between the Horde and Alliance, and threats that can force opposing races to cooperate. WoW: Forever introduces a new chapter with expanded race/class combinations, selectable rulesets and a Skyborne/Celestial race whose starting story begins on Zephras Island.',
      facts: [
        'The Horde and Alliance are the two major playable faction blocs.',
        'WoW: Forever offers rulesets such as Normal, PvP and Roleplay; Hardcore was announced for a later post-launch phase.',
        'The Celestial/Skyborne starting story takes place on Zephras Island at levels 1–12.',
      ],
      racesTitle: 'Races and affinities',
      racesDescription: 'These races and combinations come from the official WoW: Forever guide consulted.',
      classesNote: 'The nine available classes in the official reference are Druid, Hunter, Mage, Paladin, Priest, Rogue, Shaman, Warlock and Warrior.',
      req: [
        { label: 'Minimum to enter', badge: '720p · low settings', status: 'official' as const, lines: [
          { es: 'Windows 10 64-bit (May 2019 update or newer)', en: 'Windows 10 64-bit (May 2019 update or newer)' },
          { es: 'CPU: 4 cores, 3.0 GHz; Intel Core Haswell (4th gen.) / AMD Ryzen Zen', en: 'CPU: 4 cores, 3.0 GHz; Intel Core Haswell (4th gen.) / AMD Ryzen Zen' },
          { es: 'RAM: 8 GB · DirectX 12-compatible GPU. Check Blizzard’s WoW: Forever GPU note for the exact model; compatibility alone does not guarantee good performance.', en: 'RAM: 8 GB · DirectX 12-compatible GPU. Check Blizzard’s WoW: Forever GPU note for the exact model; compatibility alone does not guarantee good performance.' },
          { es: 'SSD with 128 GB free and broadband internet.', en: 'SSD with 128 GB free and broadband internet.' },
        ]},
        { label: 'Medium · official recommended', badge: 'Blizzard recommended', status: 'official' as const, lines: [
          { es: 'Windows 10 64-bit', en: 'Windows 10 64-bit' },
          { es: 'CPU: 6 cores, 3.5 GHz; Intel Core Coffee Lake (8th gen.) / AMD Ryzen Zen 2', en: 'CPU: 6 cores, 3.5 GHz; Intel Core Coffee Lake (8th gen.) / AMD Ryzen Zen 2' },
          { es: 'RAM: 16 GB · 8 GB DX12 GPU: NVIDIA GeForce RTX / AMD RDNA 2 / Intel Arc 7', en: 'RAM: 16 GB · 8 GB DX12 GPU: NVIDIA GeForce RTX / AMD RDNA 2 / Intel Arc 7' },
          { es: 'SSD with 128 GB free and broadband internet.', en: 'SSD with 128 GB free and broadband internet.' },
        ]},
        { label: 'High · XETHKIOZ target', badge: '1440p · high/ultra target', status: 'estimate' as const, lines: [
          { es: 'Windows 11 64-bit and NVMe SSD with at least 128 GB free', en: 'Windows 11 64-bit and NVMe SSD with at least 128 GB free' },
          { es: 'Target CPU: Ryzen 7 7800X3D / recent-generation Intel Core i7', en: 'Target CPU: Ryzen 7 7800X3D / recent-generation Intel Core i7' },
          { es: 'RAM: 32 GB · target GPU: RTX 4070 12 GB / Radeon RX 7800 XT 16 GB or better', en: 'RAM: 32 GB · target GPU: RTX 4070 12 GB / Radeon RX 7800 XT 16 GB or better' },
          { es: 'A suggested headroom target for raids and busy scenes, not an official requirement.', en: 'A suggested headroom target for raids and busy scenes, not an official requirement.' },
        ]},
      ],
    },
  },
}

export default function UniverseIntel({ game }: { game: Universe }) {
  const { lang } = useLang()
  const [activeTab, setActiveTab] = useState<IntelTab>('history')
  const t = copy[lang]
  const world = game === 'aion2' ? t.aion : t.wow
  const classes = game === 'aion2' ? aionClasses : wowClasses
  const isAion = game === 'aion2'
  const factions: FactionEntry[] = isAion
    ? [
        { name: { es: 'Elyos', en: 'Elyos' }, eyebrow: { es: 'FACCIÓN CELESTIAL', en: 'CELESTIAL FACTION' }, description: { es: 'Una civilización asociada a la luz y a Elysea. Su identidad, historia y estética contrastan con las de sus rivales de Asmodae.', en: 'A civilization associated with light and Elysea. Its identity, story and aesthetics contrast with its rivals in Asmodae.' } },
        { name: { es: 'Asmodians', en: 'Asmodians' }, eyebrow: { es: 'FACCIÓN UMBRÍA', en: 'SHADOW FACTION' }, description: { es: 'Un pueblo endurecido por la oscuridad de Asmodae. Su historia pone el foco en supervivencia, resistencia e identidad frente a los Elyos.', en: 'A people hardened by the darkness of Asmodae. Their story emphasizes survival, resilience and identity against the Elyos.' } },
      ]
    : [
        { name: { es: 'La Horda', en: 'The Horde' }, eyebrow: { es: 'FACTION // 01', en: 'FACTION // 01' }, description: { es: 'Una alianza de pueblos que valora la libertad, la fuerza y el honor. Sus decisiones y rivalidades moldean Azeroth.', en: 'An alliance of peoples that values freedom, strength and honor. Its choices and rivalries shape Azeroth.' }, races: wowHorde },
        { name: { es: 'La Alianza', en: 'The Alliance' }, eyebrow: { es: 'FACTION // 02', en: 'FACTION // 02' }, description: { es: 'Pueblos unidos por sus tradiciones, su sentido del deber y la defensa de sus reinos ante amenazas comunes.', en: 'Peoples united by tradition, duty and the defense of their kingdoms against common threats.' }, races: wowAlliance },
      ]
  const requirements: RequirementEntry[] = world.req.map((entry) => ({
    label: { es: entry.label, en: entry.label },
    badge: { es: entry.badge, en: entry.badge },
    status: entry.status,
    lines: entry.lines.map((line) => ({ es: line.es, en: line.en || line.es })),
  }))

  return (
    <section className="xk-universe-intel" data-game={game} aria-labelledby="xk-universe-intel-title">
      <header className="xk-universe-intel__header">
        <span className="xk-universe-intel__eyebrow">{t.eyebrow}</span>
        <h2 id="xk-universe-intel-title">{isAion ? t.titleAion : t.titleWow}</h2>
        <p>{isAion ? t.subtitleAion : t.subtitleWow}</p>
      </header>
      <nav className="xk-universe-intel__tabs" role="tablist" aria-label={isAion ? (lang === 'es' ? 'Archivo de AION 2' : 'AION 2 archive') : (lang === 'es' ? 'Archivo de WoW Forever' : 'WoW Forever archive')}>
        {t.tabs.map((tab) => (
          <button key={tab.id} type="button" role="tab" id={'xk-intel-tab-' + tab.id} aria-selected={activeTab === tab.id} aria-controls="xk-universe-intel-panel" onClick={() => setActiveTab(tab.id)}>{tab.label}</button>
        ))}
      </nav>
      <div id="xk-universe-intel-panel" className="xk-universe-intel__panel" role="tabpanel" aria-labelledby={'xk-intel-tab-' + activeTab}>
        {activeTab === 'history' && (
          <div className="xk-universe-intel__history">
            <article className="xk-intel-story">
              <span>{isAion ? 'LORE // ATREIA' : 'LORE // AZEROTH'}</span>
              <h3>{world.historyTitle}</h3>
              <p>{world.history}</p>
            </article>
            <div className="xk-intel-facts">
              {world.facts.map((fact) => <div key={fact}><i aria-hidden="true">✧</i><p>{fact}</p></div>)}
            </div>
          </div>
        )}
        {activeTab === 'races' && (
          <div className="xk-universe-intel__races">
            <header><h3>{world.racesTitle}</h3><p>{world.racesDescription}</p></header>
            <div className="xk-intel-faction-grid">
              {factions.map((faction) => (
                <article className="xk-intel-faction" key={faction.name.es}>
                  <span>{faction.eyebrow[lang]}</span><h4>{faction.name[lang]}</h4><p>{faction.description[lang]}</p>
                  {faction.races && <div className="xk-intel-race-list">{faction.races.map((race) => <div key={race.name}><b>{race.name}</b><small>{race.classes}</small></div>)}</div>}
                </article>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'classes' && (
          <div className="xk-universe-intel__classes">
            <header><h3>{lang === 'es' ? 'Todas las clases jugables' : 'Every playable class'}</h3><p>{world.classesNote}</p></header>
            <div className="xk-intel-class-grid">
              {classes.map((entry, index) => (
                <article className="xk-intel-class" key={entry.name.en}>
                  <span className="xk-intel-class__index">{String(index + 1).padStart(2, '0')}</span>
                  <div><h4>{entry.name[lang]}</h4><strong>{entry.role[lang]}</strong><p>{entry.description[lang]}</p><small>{t.weapon}: {entry.weapon[lang]}</small></div>
                </article>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'requirements' && (
          <div className="xk-universe-intel__requirements">
            <header><h3>{t.specsHeading}</h3><p>{lang === 'es' ? 'Compará CPU, placa de video, memoria y almacenamiento antes de instalar.' : 'Compare CPU, graphics card, memory and storage before installing.'}</p></header>
            <div className="xk-intel-spec-grid">
              {requirements.map((entry, index) => (
                <article className={'xk-intel-spec xk-intel-spec--' + (index === 0 ? 'low' : index === 1 ? 'medium' : 'high')} key={entry.label[lang]}>
                  <div className="xk-intel-spec__top"><span>{index === 0 ? t.low : index === 1 ? t.medium : t.high}</span><i>{entry.badge[lang]}</i></div>
                  <h4>{entry.label[lang]}</h4>
                  <span className={'xk-intel-source-tag ' + (entry.status === 'official' ? 'is-official' : 'is-estimate')}>{entry.status === 'official' ? t.official : t.estimate}</span>
                  <ul>{entry.lines.map((line) => <li key={line[lang]}>{line[lang]}</li>)}</ul>
                </article>
              ))}
            </div>
            {game === 'wow' && <p className="xk-intel-note">{lang === 'es' ? 'Importante: Blizzard exige una GPU compatible con las funciones requeridas, no sólo una cantidad de memoria. Revisá la ficha oficial antes de comprar hardware.' : 'Important: Blizzard requires a GPU compatible with the required features, not only a certain amount of memory. Check the official specification before buying hardware.'}</p>}
            <p className="xk-intel-note">{t.highNote}</p>
          </div>
        )}
      </div>
      <footer className="xk-universe-intel__sources">
        <span>{t.sourceLabel}</span>
        <div>{sources[game].map((source) => <a key={source.href} href={source.href} target="_blank" rel="noopener noreferrer">{source[lang]} ↗</a>)}</div>
        <p>{t.sourceNote}</p>
      </footer>
    </section>
  )
}

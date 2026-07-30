export type ComiconCatalogChannel = 'marvel' | 'dc' | 'anime' | 'screen' | 'comics'
export type ComiconCatalogKind = 'guide' | 'analysis' | 'comic' | 'timeline' | 'fan'

export type LocalizedText = {
  es: string
  en: string
}

export type ComiconCatalogItem = {
  id: string
  channel: ComiconCatalogChannel
  kind: ComiconCatalogKind
  title: LocalizedText
  summary: LocalizedText
  glyph: string
}

export const originalComic = {
  slug: 'dos-almas-un-guerrero',
  title: { es: 'Dos almas, un guerrero', en: 'Two souls, one warrior' },
  saga: { es: 'Saga I · El Umbral', en: 'Saga I · The Threshold' },
  synopsis: {
    es: 'Una misma conciencia fue dividida entre la luz que protege y la oscuridad que destruye amenazas. Cuando los portales comienzan a colapsar, ambas fuerzas deben habitar el mismo cuerpo para impedir que el universo sea consumido.',
    en: 'A single consciousness was split between the light that protects and the darkness that destroys threats. When the portals begin to collapse, both forces must inhabit the same body to keep the universe from being consumed.',
  },
  chapters: [
    {
      id: 'prologo',
      number: '00',
      status: 'available',
      title: { es: 'Prólogo · La fractura', en: 'Prologue · The fracture' },
      panels: [
        {
          tone: 'origin',
          caption: {
            es: 'Antes del primer portal existía una sola voluntad.',
            en: 'Before the first portal, there was only one will.',
          },
        },
        {
          tone: 'light',
          caption: {
            es: 'La luz juró proteger incluso a quienes no podían verla.',
            en: 'The light swore to protect even those who could not see it.',
          },
        },
        {
          tone: 'shadow',
          caption: {
            es: 'La oscuridad eligió destruir todo aquello que pudiera alcanzarlos.',
            en: 'The darkness chose to destroy anything that could reach them.',
          },
        },
        {
          tone: 'fracture',
          caption: {
            es: 'Separadas, ambas fuerzas comenzaron a perder la guerra.',
            en: 'Separated, both forces began to lose the war.',
          },
        },
        {
          tone: 'union',
          caption: {
            es: 'El colapso las obligó a compartir un cuerpo, una memoria y un destino.',
            en: 'The collapse forced them to share one body, one memory and one fate.',
          },
        },
        {
          tone: 'xethkioz',
          caption: {
            es: 'El nombre que cruzó el umbral fue XETHKIOZ.',
            en: 'The name that crossed the threshold was XETHKIOZ.',
          },
        },
      ],
    },
    { id: 'capitulo-1', number: '01', status: 'planned', title: { es: 'El guardián sin reino', en: 'The guardian without a realm' } },
    { id: 'capitulo-2', number: '02', status: 'planned', title: { es: 'La ciudad detrás del código', en: 'The city behind the code' } },
    { id: 'capitulo-3', number: '03', status: 'planned', title: { es: 'El precio de la luz', en: 'The price of light' } },
    { id: 'capitulo-4', number: '04', status: 'planned', title: { es: 'La libertad de la sombra', en: 'The freedom of shadow' } },
    { id: 'capitulo-5', number: '05', status: 'planned', title: { es: 'Más allá del juego', en: 'Beyond the game' } },
  ],
} as const

export const comiconCatalog = [
  {
    id: 'catalog-marvel-01', channel: 'marvel', kind: 'guide', glyph: 'M',
    title: { es: 'Puerta de entrada al Universo Marvel', en: 'Gateway to the Marvel Universe' },
    summary: { es: 'Una ruta simple para comenzar sin tener que conocer décadas de continuidad.', en: 'A simple route for starting without knowing decades of continuity.' },
  },
  {
    id: 'catalog-marvel-02', channel: 'marvel', kind: 'analysis', glyph: 'SP',
    title: { es: 'Spider-Man y las muchas formas de ser héroe', en: 'Spider-Man and the many ways to be a hero' },
    summary: { es: 'Identidad, responsabilidad y legado a través de distintas versiones del personaje.', en: 'Identity, responsibility and legacy across different versions of the character.' },
  },
  {
    id: 'catalog-marvel-03', channel: 'marvel', kind: 'analysis', glyph: 'X',
    title: { es: 'X-Men: poder, diferencia y pertenencia', en: 'X-Men: power, difference and belonging' },
    summary: { es: 'Por qué los mutantes siguen funcionando como una historia sobre comunidad.', en: 'Why mutants still work as a story about community.' },
  },
  {
    id: 'catalog-marvel-04', channel: 'marvel', kind: 'analysis', glyph: 'V',
    title: { es: 'Villanos que creen estar salvando el mundo', en: 'Villains who believe they are saving the world' },
    summary: { es: 'Una lectura de antagonistas cuyas ideas resultan más peligrosas que sus poderes.', en: 'A look at antagonists whose ideas are more dangerous than their powers.' },
  },
  {
    id: 'catalog-marvel-05', channel: 'marvel', kind: 'guide', glyph: 'EV',
    title: { es: 'Cómo leer un gran evento sin perderse', en: 'How to read a major event without getting lost' },
    summary: { es: 'Serie principal, cruces opcionales y orden de lectura explicado con claridad.', en: 'Main series, optional crossovers and reading order explained clearly.' },
  },
  {
    id: 'catalog-marvel-06', channel: 'marvel', kind: 'timeline', glyph: '∞',
    title: { es: 'Multiversos: reglas, riesgos y paradojas', en: 'Multiverses: rules, risks and paradoxes' },
    summary: { es: 'Conceptos básicos para entender realidades alternativas sin confundirlas.', en: 'Core concepts for understanding alternate realities without mixing them up.' },
  },
  {
    id: 'catalog-marvel-07', channel: 'marvel', kind: 'guide', glyph: 'A',
    title: { es: 'Avengers, X-Men y Fantastic Four', en: 'Avengers, X-Men and Fantastic Four' },
    summary: { es: 'Qué representa cada equipo y por dónde empezar a conocerlo.', en: 'What each team represents and where to begin.' },
  },
  {
    id: 'catalog-marvel-08', channel: 'marvel', kind: 'analysis', glyph: 'FX',
    title: { es: 'Del cómic a la pantalla', en: 'From comics to the screen' },
    summary: { es: 'Qué se conserva, qué se adapta y por qué una versión nunca reemplaza a la otra.', en: 'What is preserved, what is adapted and why one version never replaces the other.' },
  },

  {
    id: 'catalog-dc-01', channel: 'dc', kind: 'analysis', glyph: 'B',
    title: { es: 'Batman más allá del mito', en: 'Batman beyond the myth' },
    summary: { es: 'Miedo, disciplina y obsesión en las distintas etapas del vigilante de Gotham.', en: 'Fear, discipline and obsession across the vigilante’s different eras.' },
  },
  {
    id: 'catalog-dc-02', channel: 'dc', kind: 'analysis', glyph: 'S',
    title: { es: 'Superman y la fuerza de la esperanza', en: 'Superman and the strength of hope' },
    summary: { es: 'El héroe más poderoso analizado desde sus decisiones y no sólo desde sus habilidades.', en: 'The most powerful hero viewed through his choices, not only his abilities.' },
  },
  {
    id: 'catalog-dc-03', channel: 'dc', kind: 'guide', glyph: 'EL',
    title: { es: 'Guía rápida de Elseworlds', en: 'A quick guide to Elseworlds' },
    summary: { es: 'Historias alternativas que pueden leerse sin dominar la continuidad central.', en: 'Alternate stories that can be read without mastering the main continuity.' },
  },
  {
    id: 'catalog-dc-04', channel: 'dc', kind: 'guide', glyph: 'GL',
    title: { es: 'Los cuerpos de Linternas y sus emociones', en: 'The Lantern Corps and their emotions' },
    summary: { es: 'Colores, fuerzas emocionales y conflictos dentro del espectro.', en: 'Colors, emotional forces and conflicts within the spectrum.' },
  },
  {
    id: 'catalog-dc-05', channel: 'dc', kind: 'analysis', glyph: 'AV',
    title: { es: 'Antihéroes del universo DC', en: 'Antiheroes of the DC Universe' },
    summary: { es: 'Personajes que operan entre el ideal heroico y la violencia sin límites.', en: 'Characters operating between heroic ideals and unchecked violence.' },
  },
  {
    id: 'catalog-dc-06', channel: 'dc', kind: 'guide', glyph: 'JL',
    title: { es: 'Justice League: funciones dentro del equipo', en: 'Justice League: roles within the team' },
    summary: { es: 'Liderazgo, estrategia, poder y humanidad dentro de la formación más conocida.', en: 'Leadership, strategy, power and humanity within the best-known lineup.' },
  },
  {
    id: 'catalog-dc-07', channel: 'dc', kind: 'analysis', glyph: 'GM',
    title: { es: 'Gotham y Metrópolis como personajes', en: 'Gotham and Metropolis as characters' },
    summary: { es: 'Cómo dos ciudades construyen el tono, la moral y los conflictos de sus héroes.', en: 'How two cities shape the tone, morality and conflicts of their heroes.' },
  },

  {
    id: 'catalog-anime-01', channel: 'anime', kind: 'guide', glyph: '少年',
    title: { es: 'Shonen, seinen, shojo y josei', en: 'Shonen, seinen, shojo and josei' },
    summary: { es: 'Demografías editoriales explicadas sin confundirlas con géneros rígidos.', en: 'Editorial demographics explained without treating them as rigid genres.' },
  },
  {
    id: 'catalog-anime-02', channel: 'anime', kind: 'timeline', glyph: 'OVA',
    title: { es: 'Temporadas, OVAs y películas', en: 'Seasons, OVAs and movies' },
    summary: { es: 'Cómo revisar el orden de una franquicia antes de empezar a verla.', en: 'How to check a franchise’s order before starting it.' },
  },
  {
    id: 'catalog-anime-03', channel: 'anime', kind: 'guide', glyph: '漫',
    title: { es: 'Cómo empezar a leer manga', en: 'How to start reading manga' },
    summary: { es: 'Formato, sentido de lectura, tomos, capítulos y ediciones.', en: 'Format, reading direction, volumes, chapters and editions.' },
  },
  {
    id: 'catalog-anime-04', channel: 'anime', kind: 'analysis', glyph: '力',
    title: { es: 'Sistemas de poder que sí tienen reglas', en: 'Power systems that actually have rules' },
    summary: { es: 'Límites, costos y estrategia como base de combates memorables.', en: 'Limits, costs and strategy as the basis of memorable battles.' },
  },
  {
    id: 'catalog-anime-05', channel: 'anime', kind: 'analysis', glyph: '異',
    title: { es: 'Isekai: viaje, escape y segunda oportunidad', en: 'Isekai: travel, escape and second chances' },
    summary: { es: 'Qué busca el género cuando traslada a su protagonista a otro mundo.', en: 'What the genre seeks when moving its protagonist to another world.' },
  },
  {
    id: 'catalog-anime-06', channel: 'anime', kind: 'analysis', glyph: ' rival ',
    title: { es: 'El rival como motor del protagonista', en: 'The rival as the protagonist’s engine' },
    summary: { es: 'Competencia, espejo moral y evolución compartida.', en: 'Competition, moral reflection and shared evolution.' },
  },
  {
    id: 'catalog-anime-07', channel: 'anime', kind: 'guide', glyph: '作',
    title: { es: 'Cómo se produce una serie de anime', en: 'How an anime series is produced' },
    summary: { es: 'Estudio, comité de producción, dirección, animación y calendario.', en: 'Studio, production committee, direction, animation and schedule.' },
  },

  {
    id: 'catalog-screen-01', channel: 'screen', kind: 'analysis', glyph: 'AD',
    title: { es: 'Adaptar no es copiar', en: 'Adapting is not copying' },
    summary: { es: 'Fidelidad, lenguaje audiovisual y decisiones necesarias para cambiar de medio.', en: 'Fidelity, audiovisual language and choices required when changing media.' },
  },
  {
    id: 'catalog-screen-02', channel: 'screen', kind: 'guide', glyph: 'PC',
    title: { es: 'Escenas poscréditos sin falsas expectativas', en: 'Post-credit scenes without false expectations' },
    summary: { es: 'Cómo separar una pista narrativa, un chiste y una promesa real.', en: 'How to distinguish a narrative clue, a joke and a real promise.' },
  },
  {
    id: 'catalog-screen-03', channel: 'screen', kind: 'timeline', glyph: 'CAL',
    title: { es: 'Cómo seguir un calendario de estrenos', en: 'How to follow a release calendar' },
    summary: { es: 'Fechas anunciadas, ventanas aproximadas y cambios de producción.', en: 'Announced dates, approximate windows and production changes.' },
  },
  {
    id: 'catalog-screen-04', channel: 'screen', kind: 'analysis', glyph: '2D',
    title: { es: 'Animación o acción real', en: 'Animation or live action' },
    summary: { es: 'Fortalezas y límites de cada lenguaje para adaptar mundos imposibles.', en: 'Strengths and limits of each language when adapting impossible worlds.' },
  },
  {
    id: 'catalog-screen-05', channel: 'screen', kind: 'analysis', glyph: 'TR',
    title: { es: 'Cómo leer un tráiler', en: 'How to read a trailer' },
    summary: { es: 'Montaje, música, pistas y escenas que pueden no representar la película final.', en: 'Editing, music, clues and scenes that may not represent the final film.' },
  },
  {
    id: 'catalog-screen-06', channel: 'screen', kind: 'guide', glyph: 'NS',
    title: { es: 'Reseñas sin spoilers que dicen algo', en: 'Spoiler-free reviews that still say something' },
    summary: { es: 'Criterios para evaluar tono, ritmo, actuación y propuesta sin revelar giros.', en: 'Criteria for evaluating tone, pacing, performances and intent without revealing twists.' },
  },
  {
    id: 'catalog-screen-07', channel: 'screen', kind: 'analysis', glyph: 'CU',
    title: { es: 'Universos compartidos y fatiga narrativa', en: 'Shared universes and narrative fatigue' },
    summary: { es: 'Cuándo la conexión suma y cuándo una historia necesita respirar sola.', en: 'When connections add value and when a story needs room to stand alone.' },
  },

  {
    id: 'catalog-comics-01', channel: 'comics', kind: 'guide', glyph: '#1',
    title: { es: 'Empezar una colección sin gastar de más', en: 'Starting a collection without overspending' },
    summary: { es: 'Objetivo, presupuesto, ediciones y compras conscientes.', en: 'Goals, budget, editions and conscious purchasing.' },
  },
  {
    id: 'catalog-comics-02', channel: 'comics', kind: 'guide', glyph: 'UV',
    title: { es: 'Cómo conservar cómics y mangas', en: 'How to preserve comics and manga' },
    summary: { es: 'Luz, humedad, fundas, estantes y manipulación básica.', en: 'Light, humidity, sleeves, shelving and basic handling.' },
  },
  {
    id: 'catalog-comics-03', channel: 'comics', kind: 'fan', glyph: 'COS',
    title: { es: 'Cosplay: del concepto al primer traje', en: 'Cosplay: from concept to first costume' },
    summary: { es: 'Planificación, materiales, comodidad y seguridad para comenzar.', en: 'Planning, materials, comfort and safety for getting started.' },
  },
  {
    id: 'catalog-comics-04', channel: 'comics', kind: 'fan', glyph: 'CON',
    title: { es: 'Cómo aprovechar una convención', en: 'How to make the most of a convention' },
    summary: { es: 'Agenda, presupuesto, descanso, artistas y compras con criterio.', en: 'Schedule, budget, rest, artists and thoughtful purchases.' },
  },
  {
    id: 'catalog-comics-05', channel: 'comics', kind: 'guide', glyph: 'TCG',
    title: { es: 'Primeros pasos en juegos de cartas', en: 'First steps in trading card games' },
    summary: { es: 'Formatos, mazos iniciales, comunidad y control del gasto.', en: 'Formats, starter decks, community and spending control.' },
  },
  {
    id: 'catalog-comics-06', channel: 'comics', kind: 'fan', glyph: '©',
    title: { es: 'Fan art con crédito y contexto', en: 'Fan art with credit and context' },
    summary: { es: 'Cómo compartir obras respetando al artista y evitando presentarlas como oficiales.', en: 'How to share works while respecting artists and avoiding presenting them as official.' },
  },
  {
    id: 'catalog-comics-07', channel: 'comics', kind: 'comic', glyph: 'IND',
    title: { es: 'Descubrir cómics independientes', en: 'Discovering independent comics' },
    summary: { es: 'Autores, editoriales pequeñas, campañas y obras fuera de las grandes franquicias.', en: 'Creators, small publishers, campaigns and works outside major franchises.' },
  },
] satisfies readonly ComiconCatalogItem[]

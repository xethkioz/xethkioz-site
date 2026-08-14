export type ComicLang = 'es' | 'en'

export type ComicPanelTone = 'origin' | 'light' | 'shadow' | 'fracture' | 'union' | 'xethkioz'

export type ComicPanel = {
  tone: ComicPanelTone
  caption: Record<ComicLang, string>
  art?: 'identity'
}

export type ComicChapter = {
  id: string
  number: string
  status: 'available' | 'planned'
  title: Record<ComicLang, string>
  releaseDate?: string
  scheduledFor?: string
  panels?: readonly ComicPanel[]
}

export type OriginalComicSaga = {
  slug: string
  title: Record<ComicLang, string>
  saga: Record<ComicLang, string>
  synopsis: Record<ComicLang, string>
  cadence: Record<ComicLang, string>
  chapters: readonly ComicChapter[]
}

export const originalComicSaga: OriginalComicSaga = {
  slug: 'dos-almas-un-guerrero',
  title: { es: 'Dos almas, un guerrero', en: 'Two souls, one warrior' },
  saga: { es: 'Saga I · El Umbral', en: 'Saga I · The Threshold' },
  synopsis: {
    es: 'Una misma conciencia fue dividida entre la luz que protege y la oscuridad que destruye amenazas. Cuando los portales comienzan a colapsar, ambas fuerzas deben habitar el mismo cuerpo para impedir que el universo sea consumido.',
    en: 'A single consciousness was split between the light that protects and the darkness that destroys threats. When the portals begin to collapse, both forces must inhabit the same body to keep the universe from being consumed.',
  },
  cadence: { es: 'Nueva entrega cada viernes', en: 'New episode every Friday' },
  chapters: [
    {
      id: 'prologo',
      number: '00',
      status: 'available',
      title: { es: 'Prólogo · La fractura', en: 'Prologue · The fracture' },
      releaseDate: '2026-07-31',
      panels: [
        { tone: 'origin', caption: { es: 'Antes del primer portal existía una sola voluntad.', en: 'Before the first portal, there was only one will.' } },
        { tone: 'light', caption: { es: 'La luz juró proteger incluso a quienes no podían verla.', en: 'The light swore to protect even those who could not see it.' } },
        { tone: 'shadow', caption: { es: 'La oscuridad eligió destruir todo aquello que pudiera alcanzarlos.', en: 'The darkness chose to destroy anything that could reach them.' } },
        { tone: 'fracture', caption: { es: 'Separadas, ambas fuerzas comenzaron a perder la guerra.', en: 'Separated, both forces began to lose the war.' } },
        { tone: 'union', art: 'identity', caption: { es: 'El colapso las obligó a compartir un cuerpo, una memoria y un destino.', en: 'The collapse forced them to share one body, one memory and one fate.' } },
        { tone: 'xethkioz', caption: { es: 'El nombre que cruzó el umbral fue XETHKIOZ.', en: 'The name that crossed the threshold was XETHKIOZ.' } },
      ],
    },
    {
      id: 'capitulo-1',
      number: '01',
      status: 'available',
      title: { es: 'El guardián sin reino', en: 'The guardian without a realm' },
      releaseDate: '2026-08-07',
      panels: [
        { tone: 'origin', caption: { es: 'La ciudad no tenía cielo. Sólo una bóveda de código roto y relámpagos violetas.', en: 'The city had no sky. Only a vault of broken code and violet lightning.' } },
        { tone: 'light', caption: { es: 'La luz escuchó primero a quienes seguían vivos bajo las ruinas.', en: 'The light heard the survivors beneath the ruins first.' } },
        { tone: 'shadow', caption: { es: 'La sombra escuchó a los cazadores que se acercaban para terminar el trabajo.', en: 'The shadow heard the hunters approaching to finish the job.' } },
        { tone: 'fracture', caption: { es: 'Una voz exigió rescatar. La otra quiso borrar la amenaza antes de que respirara otra vez.', en: 'One voice demanded rescue. The other wanted the threat erased before it could breathe again.' } },
        { tone: 'union', art: 'identity', caption: { es: 'El cuerpo avanzó mientras las dos almas discutían cada paso, cada golpe y cada vida.', en: 'The body moved while both souls argued over every step, every strike and every life.' } },
        { tone: 'origin', caption: { es: 'Entonces apareció el Wisp: pequeño, imposible y rodeado por runas que nadie había escrito.', en: 'Then the Wisp appeared: small, impossible and surrounded by runes no one had written.' } },
        { tone: 'xethkioz', caption: { es: 'Las runas marcaron un portal oculto dentro del corazón de la ciudad.', en: 'The runes marked a portal hidden inside the heart of the city.' } },
        { tone: 'fracture', caption: { es: 'Para salvar a los sobrevivientes, XETHKIOZ tendría que entrar solo al reino que lo había expulsado.', en: 'To save the survivors, XETHKIOZ would have to enter alone the realm that had cast him out.' } },
      ],
    },
    {
      id: 'capitulo-2',
      number: '02',
      status: 'available',
      title: { es: 'La ciudad detrás del código', en: 'The city behind the code' },
      releaseDate: '2026-08-13',
      panels: [
        { tone: 'origin', caption: { es: 'El portal no llevó a XETHKIOZ a otro mundo. Lo dejó detrás del mundo que todos creían conocer.', en: 'The portal did not take XETHKIOZ to another world. It left him behind the world everyone thought they knew.' } },
        { tone: 'light', caption: { es: 'La luz descubrió miles de recuerdos suspendidos como ventanas: hogares, partidas y voces que aún esperaban regresar.', en: 'The light found thousands of memories hanging like windows: homes, games and voices still waiting to return.' } },
        { tone: 'shadow', caption: { es: 'La sombra vio algo distinto: cada recuerdo tenía una cerradura y detrás de cada cerradura respiraba un cazador.', en: 'The shadow saw something else: every memory had a lock, and behind every lock a hunter was breathing.' } },
        { tone: 'fracture', caption: { es: 'El Wisp trazó una ruta imposible. Para abrirla, una de las dos almas debía ceder el control por completo.', en: 'The Wisp drew an impossible route. To open it, one of the two souls had to surrender control completely.' } },
        { tone: 'union', art: 'identity', caption: { es: '—Confiá en mí— pidió la luz. —Eso fue lo que nos partió— respondió la sombra.', en: '“Trust me,” the light asked. “That is what broke us,” the shadow replied.' } },
        { tone: 'origin', caption: { es: 'La ciudad cambió de forma y reveló su verdad: no estaba construida con código, sino con decisiones abandonadas.', en: 'The city changed shape and revealed its truth: it was built not from code, but from abandoned decisions.' } },
        { tone: 'xethkioz', caption: { es: 'XETHKIOZ abrió la primera cerradura. Del otro lado, alguien pronunció el nombre que tenía antes de la fractura.', en: 'XETHKIOZ opened the first lock. On the other side, someone spoke the name he had before the fracture.' } },
        { tone: 'shadow', caption: { es: 'La sombra reconoció esa voz. Y por primera vez, fue ella quien tuvo miedo.', en: 'The shadow recognized that voice. And for the first time, it was the one afraid.' } },
      ],
    },
    { id: 'capitulo-3', number: '03', status: 'planned', title: { es: 'El precio de la luz', en: 'The price of light' }, scheduledFor: '2026-08-21' },
    { id: 'capitulo-4', number: '04', status: 'planned', title: { es: 'La libertad de la sombra', en: 'The freedom of shadow' } },
    { id: 'capitulo-5', number: '05', status: 'planned', title: { es: 'Más allá del juego', en: 'Beyond the game' } },
  ],
}

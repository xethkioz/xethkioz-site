export type GuideLang = 'es' | 'en'

export type LocalText = Record<GuideLang, string>

export type GuideModule = {
  id: string
  title: LocalText
  summary: LocalText
  steps: Record<GuideLang, readonly string[]>
  warning: LocalText
  sourceLabel: string
  sourceHref: string
}

export type GuideGame = {
  id: 'wow' | 'diablo' | 'ffxiv' | 'poe'
  code: string
  title: string
  subtitle: LocalText
  status: LocalText
  image: string
  color: string
  modules: readonly GuideModule[]
}

export type RadarGame = {
  id: 'gta6' | 'aion2' | 'minecraft' | 'roblox' | 'fortnite'
  title: string
  code: string
  focus: LocalText
  description: LocalText
  image: string
  color: string
  query: string
}

export const guideGames: readonly GuideGame[] = [
  {
    id: 'wow',
    code: 'AZEROTH',
    title: 'World of Warcraft',
    subtitle: {
      es: 'Retail · Midnight · clases, equipo, profesiones y endgame',
      en: 'Retail · Midnight · classes, gearing, professions and endgame',
    },
    status: { es: 'Guía base actualizable por parche', en: 'Patch-aware core guide' },
    image: '/images/articles/wow-midnight.svg',
    color: '#f59e0b',
    modules: [
      {
        id: 'start',
        title: { es: 'Empezar o volver sin perderse', en: 'Start or return without getting lost' },
        summary: {
          es: 'Ruta corta para elegir personaje, ordenar la interfaz y llegar al contenido actual sin intentar aprender todo Azeroth de golpe.',
          en: 'A short route to choose a character, clean up the UI and reach current content without trying to learn all of Azeroth at once.',
        },
        steps: {
          es: ['Elegí una clase por rol y sensación de juego, no por una tier list aislada.', 'Completá la campaña principal y desbloqueos de cuenta antes de perseguir equipo perfecto.', 'Configurá barras, talentos, interfaz y keybinds mientras subís de nivel.', 'Usá contenido normal y heroico para recuperar ritmo antes de entrar a Míticas+ o raid.'],
          en: ['Choose a class by role and play feel, not from a single tier list.', 'Complete the main campaign and account unlocks before chasing perfect gear.', 'Configure action bars, talents, UI and keybinds while leveling.', 'Use normal and heroic content to regain rhythm before Mythic+ or raiding.'],
        },
        warning: { es: 'Las recomendaciones de clase cambian con cada parche; la comodidad sostenida suele rendir más que copiar el meta.', en: 'Class rankings change every patch; sustained comfort often beats blindly copying the meta.' },
        sourceLabel: 'Icy Veins · WoW Class Guides',
        sourceHref: 'https://www.icy-veins.com/wow/class-guides',
      },
      {
        id: 'classes',
        title: { es: 'Clases, especializaciones y rol', en: 'Classes, specializations and role' },
        summary: {
          es: 'Cómo comparar tanque, sanador, melee y ranged, y qué revisar dentro de una guía de especialización.',
          en: 'How to compare tank, healer, melee and ranged roles, and what to inspect in a specialization guide.',
        },
        steps: {
          es: ['Definí primero el rol que querés cumplir en grupo.', 'Probá la rotación en objetivos de entrenamiento antes de invertir oro o tiempo.', 'Revisá talentos para mundo abierto, mazmorras y raid por separado.', 'Usá simulación y registros como diagnóstico, no como sustituto de práctica.'],
          en: ['Choose the group role you want to perform first.', 'Test the rotation on training targets before investing gold or time.', 'Review separate talent setups for open world, dungeons and raids.', 'Use simulations and logs as diagnostics, not as a replacement for practice.'],
        },
        warning: { es: 'Una build de raid puede funcionar mal en mundo abierto o Míticas+; guardá configuraciones distintas.', en: 'A raid build may perform poorly in open world or Mythic+; save separate loadouts.' },
        sourceLabel: 'Icy Veins · Midnight Class Guides',
        sourceHref: 'https://www.icy-veins.com/wow/class-guides',
      },
      {
        id: 'gear',
        title: { es: 'Equipo, Gran Cámara y endgame', en: 'Gear, Great Vault and endgame' },
        summary: {
          es: 'Prioridades para subir nivel de objeto sin desperdiciar mejoras ni depender de una sola fuente semanal.',
          en: 'Priorities for raising item level without wasting upgrades or depending on a single weekly source.',
        },
        steps: {
          es: ['Completá actividades que abran varias opciones semanales.', 'Mejorá piezas con buena vida útil antes que reemplazos temporales.', 'Priorizá arma, abalorios y bonus de conjunto cuando tengan impacto real.', 'Compará estadísticas con una simulación actualizada antes de descartar una pieza.'],
          en: ['Complete activities that unlock several weekly choices.', 'Upgrade long-lived pieces before temporary replacements.', 'Prioritize weapon, trinkets and set bonuses when their impact is meaningful.', 'Compare stats with an updated simulation before discarding an item.'],
        },
        warning: { es: 'Mayor nivel de objeto no siempre significa mejora si perdés un bonus importante o una combinación clave.', en: 'Higher item level is not always an upgrade if you lose an important bonus or key combination.' },
        sourceLabel: 'Icy Veins · Midnight Guides',
        sourceHref: 'https://www.icy-veins.com/wow/class-guides',
      },
      {
        id: 'professions',
        title: { es: 'Profesiones y economía', en: 'Professions and economy' },
        summary: {
          es: 'Cómo elegir profesiones por utilidad personal, fabricación o generación de oro sin repartir puntos sin plan.',
          en: 'How to choose professions for personal utility, crafting or gold generation without scattering points without a plan.',
        },
        steps: {
          es: ['Elegí una especialización concreta antes de gastar conocimiento.', 'Separá fabricación para uso propio de producción para vender.', 'Calculá materiales, comisión y tiempo antes de aceptar órdenes.', 'Guardá capital para herramientas y recetas que realmente abran mercado.'],
          en: ['Choose a specific specialization before spending knowledge.', 'Separate self-use crafting from production intended for sale.', 'Calculate materials, commission and time before accepting orders.', 'Keep capital for tools and recipes that genuinely unlock a market.'],
        },
        warning: { es: 'La economía de cada reino cambia; verificá precios locales antes de copiar una estrategia.', en: 'Every realm economy differs; check local prices before copying a strategy.' },
        sourceLabel: 'Icy Veins · Profession Overview',
        sourceHref: 'https://www.icy-veins.com/wow/professions/',
      },
      {
        id: 'group',
        title: { es: 'Mazmorras, raid y mejora personal', en: 'Dungeons, raids and personal improvement' },
        summary: {
          es: 'Preparación práctica para contenido grupal: mecánicas, consumibles, comunicación y revisión de errores.',
          en: 'Practical preparation for group content: mechanics, consumables, communication and error review.',
        },
        steps: {
          es: ['Aprendé primero las mecánicas que pueden matar al grupo.', 'Llevá consumibles y utilidades defensivas en accesos cómodos.', 'Revisá una muerte o fallo importante por intento, no veinte métricas juntas.', 'Subí dificultad cuando el nivel actual sea consistente, no solo cuando una llave salga bien.'],
          en: ['Learn group-killing mechanics first.', 'Keep consumables and defensive utility on comfortable binds.', 'Review one important death or mistake per attempt, not twenty metrics at once.', 'Raise difficulty when the current level is consistent, not after one lucky run.'],
        },
        warning: { es: 'El daño importa, pero sobrevivir y ejecutar mecánicas produce más progreso estable.', en: 'Damage matters, but survival and mechanics create more reliable progress.' },
        sourceLabel: 'Icy Veins · WoW Guides',
        sourceHref: 'https://www.icy-veins.com/wow/class-guides',
      },
    ],
  },
  {
    id: 'diablo',
    code: 'SANCTUARY',
    title: 'Diablo IV',
    subtitle: { es: 'Leveleo · builds · temporada · objetos · endgame', en: 'Leveling · builds · season · items · endgame' },
    status: { es: 'Separado por leveleo y endgame', en: 'Separated into leveling and endgame' },
    image: '/images/articles/gaming-hub.svg',
    color: '#ef4444',
    modules: [
      {
        id: 'leveling',
        title: { es: 'Leveleo eficiente y cómodo', en: 'Efficient and comfortable leveling' },
        summary: { es: 'Una build de leveleo debe funcionar con pocos requisitos y permitir cambiar de habilidad sin reconstruir todo el personaje.', en: 'A leveling build should work with few requirements and let you change skills without rebuilding the whole character.' },
        steps: {
          es: ['Elegí una habilidad principal que funcione sin objeto único obligatorio.', 'Mantené defensa, recurso y movilidad antes de sumar daño situacional.', 'Mejorá el arma con frecuencia durante la campaña.', 'Guardá materiales caros para el equipo que usarás en dificultades superiores.'],
          en: ['Choose a main skill that works without a mandatory unique item.', 'Secure defense, resource and mobility before adding situational damage.', 'Upgrade your weapon frequently during the campaign.', 'Save expensive materials for gear used at higher difficulties.'],
        },
        warning: { es: 'No copies una build de endgame durante el leveleo si depende de objetos, aspectos o recursos que todavía no tenés.', en: 'Do not copy an endgame build while leveling if it depends on items, aspects or resources you do not have yet.' },
        sourceLabel: 'Icy Veins · Diablo IV Guides',
        sourceHref: 'https://www.icy-veins.com/d4/guides/',
      },
      {
        id: 'builds',
        title: { es: 'Cómo leer y adaptar una build', en: 'How to read and adapt a build' },
        summary: { es: 'La lista de habilidades es solo una parte: una build funcional necesita condiciones, estadísticas, equipo y prioridades claras.', en: 'The skill list is only one part: a working build needs conditions, stats, gear and clear priorities.' },
        steps: {
          es: ['Confirmá si la build es de leveleo, speedfarm, bosses o push.', 'Revisá requisitos mínimos antes de cambiar talentos.', 'Aplicá prioridades de estadísticas en vez de buscar copias idénticas.', 'Probá el recurso y la supervivencia antes de invertir en daño máximo.'],
          en: ['Confirm whether the build is for leveling, speed farming, bosses or pushing.', 'Check minimum requirements before changing talents.', 'Apply stat priorities instead of searching for identical copies.', 'Test resource flow and survival before investing in maximum damage.'],
        },
        warning: { es: 'Una build de tier S puede sentirse peor que una build inferior si todavía no cumple sus requisitos.', en: 'An S-tier build can feel worse than a lower-ranked build when its requirements are not met.' },
        sourceLabel: 'Icy Veins · Endgame Tier List',
        sourceHref: 'https://www.icy-veins.com/d4/guides/endgame-tier-list/',
      },
      {
        id: 'season',
        title: { es: 'Temporada, reputación y progresión', en: 'Season, reputation and progression' },
        summary: { es: 'Orden recomendado para desbloquear sistemas de temporada sin abandonar la progresión permanente del personaje.', en: 'Recommended order for unlocking seasonal systems without neglecting permanent character progression.' },
        steps: {
          es: ['Completá primero los desbloqueos que afectan a toda la cuenta.', 'Avanzá la misión de temporada hasta abrir su sistema central.', 'Combiná actividades estacionales con objetivos de equipo y materiales.', 'Guardá recursos limitados para piezas con buenas estadísticas base.'],
          en: ['Complete account-wide unlocks first.', 'Advance the seasonal quest until its core system opens.', 'Combine seasonal activities with gear and material goals.', 'Save limited resources for items with strong base stats.'],
        },
        warning: { es: 'Los sistemas de temporada cambian; verificá la versión y fecha de cada guía antes de invertir.', en: 'Seasonal systems change; verify the version and date of every guide before investing.' },
        sourceLabel: 'Icy Veins · Diablo IV Guide Hub',
        sourceHref: 'https://www.icy-veins.com/d4/guides/',
      },
      {
        id: 'items',
        title: { es: 'Objetos, aspectos y fabricación', en: 'Items, aspects and crafting' },
        summary: { es: 'Cómo decidir qué guardar, qué mejorar y qué reciclar sin llenar el cofre de piezas mediocres.', en: 'How to decide what to keep, upgrade and salvage without filling the stash with mediocre items.' },
        steps: {
          es: ['Evaluá primero el tipo de objeto y sus estadísticas principales.', 'Conservá aspectos o poderes difíciles de reemplazar.', 'No perfecciones una pieza que cambiarás en pocos niveles.', 'Definí reglas simples de descarte para limpiar inventario rápido.'],
          en: ['Evaluate item type and primary stats first.', 'Keep aspects or powers that are hard to replace.', 'Do not perfect an item that will be replaced in a few levels.', 'Define simple discard rules to clean inventory quickly.'],
        },
        warning: { es: 'El valor de una pieza depende de la build; una estadística excelente para otra clase puede ser inútil para la tuya.', en: 'An item value depends on the build; a great stat for another class may be useless for yours.' },
        sourceLabel: 'Icy Veins · Diablo IV Systems',
        sourceHref: 'https://www.icy-veins.com/d4/guides/',
      },
      {
        id: 'endgame',
        title: { es: 'Endgame, jefes y contenido de alta dificultad', en: 'Endgame, bosses and high difficulty' },
        summary: { es: 'Progresión por capas: farmear rápido, completar mejoras y recién después empujar contenido extremo.', en: 'Layered progression: farm quickly, complete upgrades and only then push extreme content.' },
        steps: {
          es: ['Usá una dificultad que puedas completar con ritmo constante.', 'Separá una configuración de farmeo de otra para jefes o push.', 'Mejorá glifos, equipo y defensas antes de subir varios niveles de golpe.', 'Medí progreso por consistencia y recursos obtenidos, no solo por el máximo alcanzado.'],
          en: ['Use a difficulty you can clear at a steady pace.', 'Separate a farming setup from bossing or pushing.', 'Improve glyphs, gear and defenses before jumping several levels.', 'Measure progress through consistency and resources, not only the highest clear.'],
        },
        warning: { es: 'Subir dificultad demasiado pronto reduce experiencia, materiales y diversión por hora.', en: 'Raising difficulty too early reduces experience, materials and fun per hour.' },
        sourceLabel: 'Icy Veins · Diablo IV Endgame',
        sourceHref: 'https://www.icy-veins.com/d4/guides/endgame-tier-list/',
      },
    ],
  },
  {
    id: 'ffxiv',
    code: 'EORZEA',
    title: 'Final Fantasy XIV',
    subtitle: { es: 'Jobs · MSQ · equipo · crafting · raids', en: 'Jobs · MSQ · gear · crafting · raids' },
    status: { es: 'Base Dawntrail 7.5', en: 'Dawntrail 7.5 baseline' },
    image: '/images/articles/mmorpg-asia.svg',
    color: '#60a5fa',
    modules: [
      {
        id: 'start',
        title: { es: 'Primer personaje y Main Scenario Quest', en: 'First character and Main Scenario Quest' },
        summary: { es: 'La MSQ desbloquea la mayor parte del juego; avanzar la historia evita perder tiempo buscando contenido todavía cerrado.', en: 'The MSQ unlocks most of the game; advancing the story prevents wasting time searching for content that is still locked.' },
        steps: {
          es: ['Elegí un job inicial por estética y rol; luego podrás cambiar sin crear otro personaje.', 'Priorizá misiones de historia y las misiones azules con símbolo de desbloqueo.', 'Completá la cadena de tu clase y conseguí la piedra de job.', 'Usá el Duty Finder para avanzar dungeons y trials obligatorios.'],
          en: ['Choose a starting job by theme and role; you can change later without a new character.', 'Prioritize story quests and blue unlock quests.', 'Complete your class chain and obtain the job stone.', 'Use Duty Finder for required dungeons and trials.'],
        },
        warning: { es: 'No es necesario completar todas las secundarias de cada zona para seguir progresando.', en: 'You do not need to complete every side quest in each zone to keep progressing.' },
        sourceLabel: 'Icy Veins · FFXIV Guides',
        sourceHref: 'https://www.icy-veins.com/ffxiv/',
      },
      {
        id: 'jobs',
        title: { es: 'Elegir job y aprender la rotación', en: 'Choose a job and learn its rotation' },
        summary: { es: 'Cada job tiene identidad fija; el objetivo es entender su recurso, ventana de burst y utilidades antes de memorizar una secuencia completa.', en: 'Every job has a fixed identity; understand its resource, burst window and utility before memorizing a full sequence.' },
        steps: {
          es: ['Leé primero el estilo, fortalezas y debilidades del job.', 'Ordená habilidades por frecuencia y función.', 'Practicá el combo básico y el uso de recursos sin buffs.', 'Sumá la ventana de burst cuando la base sea estable.'],
          en: ['Read the job playstyle, strengths and weaknesses first.', 'Arrange abilities by frequency and purpose.', 'Practice the basic combo and resource usage without buffs.', 'Add the burst window once the foundation is stable.'],
        },
        warning: { es: 'Una rotación de nivel máximo no sirve si todavía te faltan acciones importantes.', en: 'A max-level rotation is not useful when important actions are still missing.' },
        sourceLabel: 'Icy Veins · FFXIV Job Guides',
        sourceHref: 'https://www.icy-veins.com/ffxiv/bard-guide',
      },
      {
        id: 'gear',
        title: { es: 'Equipo, tomestones y semana de endgame', en: 'Gear, tomestones and endgame week' },
        summary: { es: 'Una rutina simple para subir nivel de objeto combinando moneda semanal, raids normales, crafting y contenido diario.', en: 'A simple routine for raising item level through weekly currency, normal raids, crafting and daily content.' },
        steps: {
          es: ['Alcanzá el nivel requerido y completá la MSQ vigente.', 'Usá roulettes para moneda, experiencia y práctica.', 'Comprá primero las piezas que más mejoren tu conjunto.', 'Planificá límites semanales antes de repetir contenido sin recompensa.'],
          en: ['Reach the required level and complete the current MSQ.', 'Use roulettes for currency, experience and practice.', 'Buy the pieces that improve your set the most first.', 'Plan weekly limits before repeating content with no reward.'],
        },
        warning: { es: 'Los límites y monedas cambian con parches; revisá siempre la fecha del contenido.', en: 'Caps and currencies change with patches; always check the content date.' },
        sourceLabel: 'Icy Veins · Dawntrail 7.5',
        sourceHref: 'https://www.icy-veins.com/ffxiv/dawntrail-patch-7-5',
      },
      {
        id: 'crafting',
        title: { es: 'Crafting, gathering y gil', en: 'Crafting, gathering and gil' },
        summary: { es: 'Los ocho crafters comparten mecánicas; subirlos en conjunto simplifica equipo, materiales y recetas cruzadas.', en: 'The eight crafting jobs share mechanics; leveling them together simplifies gear, materials and cross-class recipes.' },
        steps: {
          es: ['Desbloqueá los oficios y mantenelos en rangos similares.', 'Aprendé progreso, calidad, durabilidad y CP antes de usar macros.', 'Combiná leves, entregas, collectables y contenido semanal.', 'Calculá costo real y velocidad de venta antes de fabricar para mercado.'],
          en: ['Unlock the crafting jobs and keep them in similar level ranges.', 'Learn progress, quality, durability and CP before relying on macros.', 'Combine leves, deliveries, collectables and weekly content.', 'Calculate real cost and sale speed before crafting for the market.'],
        },
        warning: { es: 'Una macro depende de estadísticas mínimas; no la copies sin comprobar tu equipo.', en: 'A macro depends on minimum stats; do not copy it without checking your gear.' },
        sourceLabel: 'Icy Veins · FFXIV Crafting',
        sourceHref: 'https://www.icy-veins.com/ffxiv/crafting-guides-for-ffxiv',
      },
      {
        id: 'raids',
        title: { es: 'Trials, raids y preparación grupal', en: 'Trials, raids and group preparation' },
        summary: { es: 'Cómo pasar de contenido normal a extremo y savage con progresión ordenada y expectativas realistas.', en: 'How to move from normal content into extreme and savage with orderly progression and realistic expectations.' },
        steps: {
          es: ['Completá primero la versión normal y reconocé nombres de mecánicas.', 'Entrá con equipo reparado, comida y una interfaz legible.', 'Practicá una fase hasta volverla repetible antes de medir daño.', 'Usá Party Finder con una descripción clara del objetivo del grupo.'],
          en: ['Complete the normal version first and recognize mechanic names.', 'Enter with repaired gear, food and a readable UI.', 'Practice one phase until it becomes repeatable before measuring damage.', 'Use Party Finder with a clear description of the group goal.'],
        },
        warning: { es: 'Los grupos de práctica y de reclear tienen expectativas distintas; elegí el correcto.', en: 'Practice and reclear groups have different expectations; choose the correct one.' },
        sourceLabel: 'Icy Veins · FFXIV Endgame',
        sourceHref: 'https://www.icy-veins.com/ffxiv/dawntrail-patch-7-5',
      },
    ],
  },
  {
    id: 'poe',
    code: 'WRAECLAST',
    title: 'Path of Exile',
    subtitle: { es: 'PoE 1 · PoE 2 · builds · Atlas · economía', en: 'PoE 1 · PoE 2 · builds · Atlas · economy' },
    status: { es: 'PoE 1 Mirage 3.28 · PoE 2 patch 0.5', en: 'PoE 1 Mirage 3.28 · PoE 2 patch 0.5' },
    image: '/images/articles/pc-gaming.svg',
    color: '#f97316',
    modules: [
      {
        id: 'start',
        title: { es: 'Primer personaje y build de liga', en: 'First character and league starter' },
        summary: { es: 'La mejor primera build funciona con objetos raros básicos, explica cada transición y no promete daño que depende de equipo imposible.', en: 'The best first build works with basic rare items, explains every transition and does not promise damage that depends on impossible gear.' },
        steps: {
          es: ['Elegí una guía marcada como starter o leveling.', 'Confirmá versión, ascendencia y enlaces de gemas.', 'Seguí el árbol por etapas en lugar de copiar el nivel final.', 'Priorizá vida, resistencias y funcionamiento del recurso antes del daño.'],
          en: ['Choose a guide marked as starter or leveling.', 'Confirm version, ascendancy and gem links.', 'Follow the tree in stages instead of copying the final level.', 'Prioritize life, resistances and resource function before damage.'],
        },
        warning: { es: 'Una build showcase no necesariamente es una buena build inicial.', en: 'A showcase build is not necessarily a good starter build.' },
        sourceLabel: 'PoE Vault · Beginner Guides',
        sourceHref: 'https://www.poe-vault.com/guides/path-of-exile-beginner-guide-learning-the-passive-tree',
      },
      {
        id: 'builds',
        title: { es: 'Leer Path of Building y requisitos', en: 'Read Path of Building and requirements' },
        summary: { es: 'Cómo comprobar que el daño mostrado corresponde al equipo, buffs y condiciones que realmente tendrás activos.', en: 'How to verify that displayed damage matches the gear, buffs and conditions you will actually have active.' },
        steps: {
          es: ['Importá la versión correcta del árbol y revisá etapas de leveleo.', 'Mirá configuración, gemas, frascos y condiciones marcadas.', 'Compará tu equipo con los mínimos, no con la versión perfecta.', 'Desactivá buffs irreales para medir el funcionamiento cotidiano.'],
          en: ['Import the correct tree version and inspect leveling stages.', 'Review configuration, gems, flasks and enabled conditions.', 'Compare your gear with minimum requirements, not the perfect version.', 'Disable unrealistic buffs to measure everyday performance.'],
        },
        warning: { es: 'El número final de DPS puede incluir condiciones que no están activas todo el tiempo.', en: 'The final DPS number may include conditions that are not active all the time.' },
        sourceLabel: 'PoE Vault · Path of Building 2',
        sourceHref: 'https://www.poe-vault.com/poe2/guides/how-to-path-of-building-2',
      },
      {
        id: 'defense',
        title: { es: 'Resistencias, defensas y supervivencia', en: 'Resistances, defenses and survival' },
        summary: { es: 'Las defensas se construyen por capas: vida o energía, resistencias, mitigación, recuperación y control del enemigo.', en: 'Defense is layered: life or energy shield, resistances, mitigation, recovery and enemy control.' },
        steps: {
          es: ['Completá resistencias elementales al entrar en mapas.', 'Elegí una defensa principal coherente con tu ascendencia.', 'Sumá recuperación suficiente para encuentros largos.', 'Revisá inmunidades, ailments y daño físico antes de comprar más daño.'],
          en: ['Cap elemental resistances when entering maps.', 'Choose a primary defense coherent with the ascendancy.', 'Add enough recovery for long encounters.', 'Review immunities, ailments and physical damage before buying more damage.'],
        },
        warning: { es: 'Más vida no corrige por sí sola resistencias, mitigación o recuperación deficientes.', en: 'More life alone does not fix poor resistances, mitigation or recovery.' },
        sourceLabel: 'PoE Vault · Beginner Series',
        sourceHref: 'https://www.poe-vault.com/guides/path-of-exile-beginner-guide-learning-the-passive-tree',
      },
      {
        id: 'atlas',
        title: { es: 'Atlas, mapas y progresión de endgame', en: 'Atlas, maps and endgame progression' },
        summary: { es: 'Primero asegurá progreso y sostenimiento de mapas; después especializá el árbol en la mecánica que realmente quieras jugar.', en: 'Secure map progression and sustain first; then specialize the tree into the mechanic you actually want to play.' },
        steps: {
          es: ['Completá bonus y objetivos de progreso antes de farmear una sola estrategia.', 'Invertí temprano en sostenimiento y acceso a mapas superiores.', 'Elegí dos o tres mecánicas compatibles para especializar.', 'Cambiá a una estrategia de ganancia cuando tu personaje la complete rápido.'],
          en: ['Complete bonuses and progression goals before farming a single strategy.', 'Invest early in sustain and access to higher maps.', 'Choose two or three compatible mechanics to specialize in.', 'Switch to a profit strategy when your character clears it quickly.'],
        },
        warning: { es: 'Un árbol rentable para un jugador rápido puede perder moneda en un personaje lento o frágil.', en: 'A profitable tree for a fast player can lose currency on a slow or fragile character.' },
        sourceLabel: 'PoE Vault · Atlas Progression',
        sourceHref: 'https://www.poe-vault.com/guides/atlas-progression-strategy-guide',
      },
      {
        id: 'economy',
        title: { es: 'Crafting, comercio y economía', en: 'Crafting, trade and economy' },
        summary: { es: 'El objetivo no es memorizar todas las monedas: es saber cuándo comprar, vender, mejorar una base o detener una fabricación.', en: 'The goal is not memorizing every currency: it is knowing when to buy, sell, improve a base or stop a craft.' },
        steps: {
          es: ['Definí el resultado mínimo antes de gastar materiales.', 'Calculá el costo promedio y comparalo con comprar el objeto terminado.', 'Vendé en paquetes cuando el tiempo de intercambio sea el cuello de botella.', 'Registrá ganancias por hora y estabilidad, no por una venta excepcional.'],
          en: ['Define the minimum acceptable result before spending materials.', 'Estimate average cost and compare it with buying the finished item.', 'Sell in bulk when trading time becomes the bottleneck.', 'Track profit per hour and consistency, not one exceptional sale.'],
        },
        warning: { es: 'El precio de mercado cambia rápido al inicio de liga; evitá usar datos viejos como valor fijo.', en: 'Market prices move quickly at league start; avoid treating old data as fixed value.' },
        sourceLabel: 'PoE Vault · Guide Hub',
        sourceHref: 'https://www.poe-vault.com/guides',
      },
    ],
  },
] as const

export const radarGames: readonly RadarGame[] = [
  {
    id: 'gta6',
    title: 'GTA VI',
    code: 'VICE',
    focus: { es: 'Noticias verificadas · mundo · online', en: 'Verified news · world · online' },
    description: { es: 'Lanzamiento, trailers, sistemas confirmados y evolución de GTA Online sin llenar el radar de rumores reciclados.', en: 'Release, trailers, confirmed systems and GTA Online evolution without filling the radar with recycled rumors.' },
    image: '/images/articles/open-world.svg',
    color: '#ec4899',
    query: 'GTA VI',
  },
  {
    id: 'aion2',
    title: 'AION 2',
    code: 'ATREIA',
    focus: { es: 'Asia Gaming · clases · lanzamiento global', en: 'Asia Gaming · classes · global launch' },
    description: { es: 'Seguimiento del MMORPG, diferencias regionales, monetización, combate y preparación para su llegada internacional.', en: 'Tracking the MMORPG, regional differences, monetization, combat and preparation for its international release.' },
    image: '/images/articles/mmorpg-asia.svg',
    color: '#38bdf8',
    query: 'AION 2',
  },
  {
    id: 'minecraft',
    title: 'Minecraft',
    code: 'BLOCKS',
    focus: { es: 'Actualizaciones · mods · servidores', en: 'Updates · mods · servers' },
    description: { es: 'Cambios oficiales, modpacks útiles, rendimiento, shaders y proyectos comunitarios.', en: 'Official changes, useful modpacks, performance, shaders and community projects.' },
    image: '/images/articles/pc-gaming.svg',
    color: '#22c55e',
    query: 'Minecraft',
  },
  {
    id: 'roblox',
    title: 'Roblox',
    code: 'CREATOR',
    focus: { es: 'Juegos · creación · seguridad', en: 'Games · creation · safety' },
    description: { es: 'Experiencias destacadas, Roblox Studio, tendencias, monetización responsable y seguridad para jugadores.', en: 'Featured experiences, Roblox Studio, trends, responsible monetization and player safety.' },
    image: '/images/articles/gaming.svg',
    color: '#f8fafc',
    query: 'Roblox',
  },
  {
    id: 'fortnite',
    title: 'Fortnite',
    code: 'ISLAND',
    focus: { es: 'Temporadas · competitivo · creativo', en: 'Seasons · competitive · creative' },
    description: { es: 'Cambios de temporada, armas, eventos, competitivo y mapas creados por la comunidad.', en: 'Season changes, weapons, events, competitive play and community-created maps.' },
    image: '/images/articles/gaming-hub.svg',
    color: '#a855f7',
    query: 'Fortnite',
  },
] as const

export function getGuideGame(id: string | null | undefined) {
  return guideGames.find((game) => game.id === id) ?? guideGames[0]
}

export type PixelLang = 'es' | 'en'
export type Direction = 'up' | 'down' | 'left' | 'right'
export type AreaId = 'plaza' | 'guild' | 'lab' | 'arcade'
export type PortalTarget = 'gaming' | 'science' | 'fun' | 'home'
export type TileKind = 'grass' | 'path' | 'plaza' | 'water' | 'tree' | 'roof' | 'wall' | 'floor' | 'indoor' | 'carpet' | 'metal' | 'void'
export type BeaconId = 'violet' | 'cyan' | 'orange'
export type NpcId = 'wisp-guide' | 'kael' | 'nova' | 'mika'

export type Point = { x: number; y: number }
export type Localized = { es: string; en: string }

export type AreaDefinition = {
  id: AreaId
  width: number
  height: number
  spawn: Point
  label: Localized
  subtitle: Localized
  className: string
}

export type WorldObject = {
  id: string
  area: AreaId
  x: number
  y: number
  glyph: string
  className: string
  label: Localized
  detail: Localized
  blocking?: boolean
  target?: PortalTarget
  targetArea?: AreaId
  targetSpawn?: Point
  beaconId?: BeaconId
}

export type NpcDefinition = {
  id: NpcId
  area: AreaId
  x: number
  y: number
  glyph: string
  className: string
  name: Localized
  role: Localized
  dialogue: Localized
}

export type QuestState = {
  started: boolean
  activated: BeaconId[]
  completed: boolean
  rewarded: boolean
}

export const TILE_SIZE = 40
export const QUEST_STORAGE_KEY = 'xethkioz.nexus-pixel.quest.signal-v1'
export const AVATAR_STORAGE_KEY = 'xethkioz.nexus-city.avatar.v1'
export const WORLD_CHANNEL = 'xethkioz:nexus-pixel-plaza:v2'

export const areas: Record<AreaId, AreaDefinition> = {
  plaza: {
    id: 'plaza', width: 28, height: 20, spawn: { x: 13, y: 12 }, className: 'is-plaza-area',
    label: { es: 'Plaza Nexus', en: 'Nexus Plaza' },
    subtitle: { es: 'Centro social de la Red de Portales', en: 'Social hub of the Portal Network' },
  },
  guild: {
    id: 'guild', width: 16, height: 12, spawn: { x: 7, y: 9 }, className: 'is-guild-area',
    label: { es: 'Gremio Gaming', en: 'Gaming Guild' },
    subtitle: { es: 'Parties, builds y desafíos', en: 'Parties, builds and challenges' },
  },
  lab: {
    id: 'lab', width: 16, height: 12, spawn: { x: 7, y: 9 }, className: 'is-lab-area',
    label: { es: 'Laboratorio Futuro', en: 'Future Laboratory' },
    subtitle: { es: 'IA, ciencia y tecnología', en: 'AI, science and technology' },
  },
  arcade: {
    id: 'arcade', width: 16, height: 12, spawn: { x: 7, y: 9 }, className: 'is-arcade-area',
    label: { es: 'Arcade del Caos', en: 'Chaos Arcade' },
    subtitle: { es: 'Memes, clips y partidas imposibles', en: 'Memes, clips and impossible games' },
  },
}

export const worldObjects: WorldObject[] = [
  {
    id: 'portal-core', area: 'plaza', x: 13, y: 8, glyph: '◉', target: 'home', blocking: true, className: 'is-core',
    label: { es: 'Portal central', en: 'Central portal' },
    detail: { es: 'Volver a la Red de Portales', en: 'Return to the Portal Network' },
  },
  {
    id: 'guild-door', area: 'plaza', x: 22, y: 6, glyph: '⚔', targetArea: 'guild', targetSpawn: { x: 7, y: 9 }, className: 'is-door is-gaming',
    label: { es: 'Gremio Gaming', en: 'Gaming Guild' },
    detail: { es: 'Entrar al edificio del gremio', en: 'Enter the guild building' },
  },
  {
    id: 'lab-door', area: 'plaza', x: 6, y: 13, glyph: '⚛', targetArea: 'lab', targetSpawn: { x: 7, y: 9 }, className: 'is-door is-science',
    label: { es: 'Laboratorio Futuro', en: 'Future Laboratory' },
    detail: { es: 'Entrar al laboratorio', en: 'Enter the laboratory' },
  },
  {
    id: 'arcade-door', area: 'plaza', x: 21, y: 13, glyph: '爆', targetArea: 'arcade', targetSpawn: { x: 7, y: 9 }, className: 'is-door is-fun',
    label: { es: 'Arcade del Caos', en: 'Chaos Arcade' },
    detail: { es: 'Entrar al arcade', en: 'Enter the arcade' },
  },
  {
    id: 'plaza-sign', area: 'plaza', x: 11, y: 11, glyph: '!', blocking: true, className: 'is-sign',
    label: { es: 'Cartel de la Plaza', en: 'Plaza sign' },
    detail: { es: 'WASD, flechas o controles táctiles', en: 'WASD, arrows or touch controls' },
  },
  {
    id: 'fountain', area: 'plaza', x: 15, y: 12, glyph: '✦', blocking: true, className: 'is-fountain',
    label: { es: 'Fuente Wisp', en: 'Wisp Fountain' },
    detail: { es: 'La energía del Nexus fluye por acá', en: 'Nexus energy flows through here' },
  },
  {
    id: 'beacon-violet', area: 'plaza', x: 10, y: 8, glyph: '◆', blocking: true, beaconId: 'violet', className: 'is-beacon is-violet',
    label: { es: 'Baliza violeta', en: 'Violet beacon' },
    detail: { es: 'Señal del distrito Gaming', en: 'Gaming district signal' },
  },
  {
    id: 'beacon-cyan', area: 'plaza', x: 16, y: 8, glyph: '◆', blocking: true, beaconId: 'cyan', className: 'is-beacon is-cyan',
    label: { es: 'Baliza cian', en: 'Cyan beacon' },
    detail: { es: 'Señal del Laboratorio Futuro', en: 'Future Laboratory signal' },
  },
  {
    id: 'beacon-orange', area: 'plaza', x: 13, y: 15, glyph: '◆', blocking: true, beaconId: 'orange', className: 'is-beacon is-orange',
    label: { es: 'Baliza naranja', en: 'Orange beacon' },
    detail: { es: 'Señal del Arcade del Caos', en: 'Chaos Arcade signal' },
  },
  {
    id: 'guild-exit', area: 'guild', x: 7, y: 10, glyph: '▼', targetArea: 'plaza', targetSpawn: { x: 22, y: 7 }, className: 'is-door is-exit',
    label: { es: 'Salir a la Plaza', en: 'Exit to the Plaza' },
    detail: { es: 'Volver al exterior', en: 'Return outside' },
  },
  {
    id: 'gaming-portal', area: 'guild', x: 7, y: 2, glyph: '⚔', target: 'gaming', blocking: true, className: 'is-core is-gaming',
    label: { es: 'Portal Gaming', en: 'Gaming portal' },
    detail: { es: 'Abrir el mundo Gaming', en: 'Open the Gaming world' },
  },
  {
    id: 'guild-board', area: 'guild', x: 11, y: 5, glyph: '▣', blocking: true, className: 'is-console',
    label: { es: 'Tablón del gremio', en: 'Guild board' },
    detail: { es: 'Próximamente: parties y desafíos comunitarios', en: 'Coming soon: community parties and challenges' },
  },
  {
    id: 'lab-exit', area: 'lab', x: 7, y: 10, glyph: '▼', targetArea: 'plaza', targetSpawn: { x: 6, y: 12 }, className: 'is-door is-exit',
    label: { es: 'Salir a la Plaza', en: 'Exit to the Plaza' },
    detail: { es: 'Volver al exterior', en: 'Return outside' },
  },
  {
    id: 'science-portal', area: 'lab', x: 7, y: 2, glyph: '⚛', target: 'science', blocking: true, className: 'is-core is-science',
    label: { es: 'Portal de Ciencia', en: 'Science portal' },
    detail: { es: 'Abrir Ciencia y Tecnología', en: 'Open Science and Technology' },
  },
  {
    id: 'lab-console', area: 'lab', x: 11, y: 5, glyph: '⌁', blocking: true, className: 'is-console is-science',
    label: { es: 'Consola de señales', en: 'Signal console' },
    detail: { es: 'Analiza la energía de la plaza', en: 'Analyzes the plaza energy' },
  },
  {
    id: 'arcade-exit', area: 'arcade', x: 7, y: 10, glyph: '▼', targetArea: 'plaza', targetSpawn: { x: 21, y: 12 }, className: 'is-door is-exit',
    label: { es: 'Salir a la Plaza', en: 'Exit to the Plaza' },
    detail: { es: 'Volver al exterior', en: 'Return outside' },
  },
  {
    id: 'fun-portal', area: 'arcade', x: 7, y: 2, glyph: '爆', target: 'fun', blocking: true, className: 'is-core is-fun',
    label: { es: 'Portal de Memes', en: 'Meme portal' },
    detail: { es: 'Abrir el mundo de Memes', en: 'Open the Meme world' },
  },
  {
    id: 'arcade-machine-a', area: 'arcade', x: 4, y: 5, glyph: '▤', blocking: true, className: 'is-console is-fun',
    label: { es: 'Máquina Glitch', en: 'Glitch machine' },
    detail: { es: 'Récord actual: WISP_404', en: 'Current record: WISP_404' },
  },
  {
    id: 'arcade-machine-b', area: 'arcade', x: 11, y: 5, glyph: '▥', blocking: true, className: 'is-console is-fun',
    label: { es: 'Máquina Caos', en: 'Chaos machine' },
    detail: { es: 'Próximamente: minijuegos', en: 'Coming soon: minigames' },
  },
]

export const npcs: NpcDefinition[] = [
  {
    id: 'wisp-guide', area: 'plaza', x: 13, y: 10, glyph: '✧', className: 'is-guide',
    name: { es: 'Guía Wisp', en: 'Wisp Guide' },
    role: { es: 'Custodio de la Plaza', en: 'Plaza Keeper' },
    dialogue: { es: 'Las tres señales de la Plaza perdieron sincronía. Necesito un explorador.', en: 'The three Plaza signals lost synchronization. I need an explorer.' },
  },
  {
    id: 'kael', area: 'guild', x: 5, y: 5, glyph: 'K', className: 'is-gaming-npc',
    name: { es: 'Kael', en: 'Kael' },
    role: { es: 'Maestro del Gremio', en: 'Guild Master' },
    dialogue: { es: 'Este lugar conectará parties, builds y desafíos. Todavía estamos reclutando.', en: 'This place will connect parties, builds and challenges. We are still recruiting.' },
  },
  {
    id: 'nova', area: 'lab', x: 5, y: 5, glyph: 'N', className: 'is-science-npc',
    name: { es: 'Nova', en: 'Nova' },
    role: { es: 'Ingeniera de Señales', en: 'Signal Engineer' },
    dialogue: { es: 'Cada baliza representa un portal. Cuando vibran juntas, la Plaza cobra vida.', en: 'Each beacon represents a portal. When they pulse together, the Plaza comes alive.' },
  },
  {
    id: 'mika', area: 'arcade', x: 8, y: 5, glyph: 'M', className: 'is-fun-npc',
    name: { es: 'Mika', en: 'Mika' },
    role: { es: 'Operadora del Caos', en: 'Chaos Operator' },
    dialogue: { es: 'No golpees las máquinas. Bueno… al menos no cuando estoy mirando.', en: 'Do not hit the machines. Well… at least not while I am watching.' },
  },
]

export const emptyQuestState: QuestState = { started: false, activated: [], completed: false, rewarded: false }

export function readQuestState(): QuestState {
  if (typeof window === 'undefined') return emptyQuestState
  try {
    const value = JSON.parse(window.localStorage.getItem(QUEST_STORAGE_KEY) || '{}') as Partial<QuestState>
    const activated = Array.isArray(value.activated)
      ? value.activated.filter((item): item is BeaconId => item === 'violet' || item === 'cyan' || item === 'orange')
      : []
    return {
      started: Boolean(value.started),
      activated: [...new Set(activated)],
      completed: Boolean(value.completed),
      rewarded: Boolean(value.rewarded),
    }
  } catch {
    return emptyQuestState
  }
}

export function tileKindAt(area: AreaId, x: number, y: number): TileKind {
  const definition = areas[area]
  if (x < 0 || y < 0 || x >= definition.width || y >= definition.height) return 'void'

  if (area === 'plaza') {
    if (x === 0 || y === 0 || x === definition.width - 1 || y === definition.height - 1) return 'tree'
    if (x >= 2 && x <= 6 && y >= 2 && y <= 6) return 'water'
    if (x >= 18 && x <= 25 && y >= 2 && y <= 6) return y === 6 && x === 22 ? 'floor' : (y === 2 ? 'roof' : 'wall')
    if (x >= 3 && x <= 9 && y >= 13 && y <= 18) return y === 13 && x === 6 ? 'floor' : (y === 18 ? 'roof' : 'wall')
    if (x >= 18 && x <= 24 && y >= 13 && y <= 18) return y === 13 && x === 21 ? 'floor' : (y === 18 ? 'roof' : 'wall')
    if (x >= 10 && x <= 17 && y >= 6 && y <= 14) return 'plaza'
    if (x >= 12 && x <= 14) return 'path'
    if (y >= 8 && y <= 10) return 'path'
    if (x >= 6 && x <= 12 && y >= 11 && y <= 13) return 'path'
    if (x >= 14 && x <= 22 && y >= 11 && y <= 15) return 'path'
    return 'grass'
  }

  if (x === 0 || y === 0 || x === definition.width - 1 || y === definition.height - 1) {
    if (y === definition.height - 1 && x === 7) return 'floor'
    return 'wall'
  }

  if (area === 'guild') {
    if (x >= 6 && x <= 8) return 'carpet'
    return 'indoor'
  }

  if (area === 'lab') {
    if ((x + y) % 4 === 0) return 'metal'
    return 'indoor'
  }

  if (area === 'arcade') {
    if (x >= 6 && x <= 9) return 'carpet'
    return 'indoor'
  }

  return 'void'
}

export function objectsForArea(area: AreaId) {
  return worldObjects.filter((item) => item.area === area)
}

export function npcsForArea(area: AreaId) {
  return npcs.filter((item) => item.area === area)
}

export function isBlocked(area: AreaId, x: number, y: number) {
  const tile = tileKindAt(area, x, y)
  if (['water', 'tree', 'roof', 'wall', 'void'].includes(tile)) return true
  if (objectsForArea(area).some((item) => item.x === x && item.y === y && item.blocking)) return true
  return npcsForArea(area).some((npc) => npc.x === x && npc.y === y)
}

import type { AreaId, Localized, Point } from './nexusPixelRpg'

export type InventoryItemId =
  | 'wisp-shard'
  | 'nexus-berry'
  | 'guild-token'
  | 'lab-crystal'
  | 'chaos-chip'
  | 'plaza-key'

export type InventoryRarity = 'common' | 'uncommon' | 'rare' | 'epic'

export type InventoryItemDefinition = {
  id: InventoryItemId
  glyph: string
  name: Localized
  description: Localized
  rarity: InventoryRarity
}

export type InventoryReward = {
  itemId: InventoryItemId
  amount: number
}

export type PixelPickup = Point & {
  id: string
  area: AreaId
  itemId: InventoryItemId
  amount: number
  xp: number
  className: string
}

export type PixelChest = Point & {
  id: string
  area: AreaId
  rewards: InventoryReward[]
  xp: number
  requiresQuest?: boolean
}

export type RoamingNpc = {
  id: string
  area: AreaId
  glyph: string
  className: string
  name: Localized
  role: Localized
  lines: Localized[]
  path: Point[]
}

export type PixelInventoryState = {
  items: Partial<Record<InventoryItemId, number>>
  collected: string[]
  openedChests: string[]
}

export const INVENTORY_STORAGE_KEY = 'xethkioz.nexus-pixel.inventory.v1'

export const inventoryItems: Record<InventoryItemId, InventoryItemDefinition> = {
  'wisp-shard': {
    id: 'wisp-shard', glyph: '✦', rarity: 'uncommon',
    name: { es: 'Fragmento Wisp', en: 'Wisp Shard' },
    description: { es: 'Energía cristalizada de la Plaza Nexus.', en: 'Crystallized energy from Nexus Plaza.' },
  },
  'nexus-berry': {
    id: 'nexus-berry', glyph: '●', rarity: 'common',
    name: { es: 'Baya Nexus', en: 'Nexus Berry' },
    description: { es: 'Una fruta luminosa que crece cerca de los portales.', en: 'A luminous fruit that grows near portals.' },
  },
  'guild-token': {
    id: 'guild-token', glyph: '⚔', rarity: 'rare',
    name: { es: 'Ficha del Gremio', en: 'Guild Token' },
    description: { es: 'Marca de ingreso a futuros desafíos comunitarios.', en: 'A mark of entry for future community challenges.' },
  },
  'lab-crystal': {
    id: 'lab-crystal', glyph: '◇', rarity: 'rare',
    name: { es: 'Cristal de Señal', en: 'Signal Crystal' },
    description: { es: 'Registra frecuencias del Laboratorio Futuro.', en: 'Records frequencies from the Future Laboratory.' },
  },
  'chaos-chip': {
    id: 'chaos-chip', glyph: '▧', rarity: 'rare',
    name: { es: 'Chip del Caos', en: 'Chaos Chip' },
    description: { es: 'Memoria recuperada de una máquina arcade inestable.', en: 'Memory recovered from an unstable arcade machine.' },
  },
  'plaza-key': {
    id: 'plaza-key', glyph: '◆', rarity: 'epic',
    name: { es: 'Llave de la Plaza', en: 'Plaza Key' },
    description: { es: 'Recompensa por estabilizar las tres señales.', en: 'Reward for stabilizing all three signals.' },
  },
}

export const pixelPickups: PixelPickup[] = [
  { id: 'plaza-berry-a', area: 'plaza', x: 12, y: 12, itemId: 'nexus-berry', amount: 1, xp: 2, className: 'is-berry' },
  { id: 'plaza-shard-a', area: 'plaza', x: 14, y: 13, itemId: 'wisp-shard', amount: 1, xp: 3, className: 'is-shard' },
  { id: 'plaza-berry-b', area: 'plaza', x: 18, y: 12, itemId: 'nexus-berry', amount: 2, xp: 2, className: 'is-berry' },
  { id: 'guild-token-a', area: 'guild', x: 6, y: 8, itemId: 'guild-token', amount: 1, xp: 5, className: 'is-guild-loot' },
  { id: 'guild-shard-a', area: 'guild', x: 9, y: 7, itemId: 'wisp-shard', amount: 1, xp: 3, className: 'is-shard' },
  { id: 'lab-crystal-a', area: 'lab', x: 6, y: 8, itemId: 'lab-crystal', amount: 1, xp: 5, className: 'is-lab-loot' },
  { id: 'lab-shard-a', area: 'lab', x: 9, y: 7, itemId: 'wisp-shard', amount: 1, xp: 3, className: 'is-shard' },
  { id: 'arcade-chip-a', area: 'arcade', x: 6, y: 8, itemId: 'chaos-chip', amount: 1, xp: 5, className: 'is-chaos-loot' },
  { id: 'arcade-berry-a', area: 'arcade', x: 10, y: 8, itemId: 'nexus-berry', amount: 1, xp: 2, className: 'is-berry' },
]

export const pixelChests: PixelChest[] = [
  {
    id: 'guild-cache', area: 'guild', x: 10, y: 8, xp: 12,
    rewards: [{ itemId: 'guild-token', amount: 2 }, { itemId: 'wisp-shard', amount: 1 }],
  },
  {
    id: 'lab-cache', area: 'lab', x: 10, y: 8, xp: 12,
    rewards: [{ itemId: 'lab-crystal', amount: 2 }, { itemId: 'wisp-shard', amount: 1 }],
  },
  {
    id: 'arcade-cache', area: 'arcade', x: 12, y: 8, xp: 12,
    rewards: [{ itemId: 'chaos-chip', amount: 2 }, { itemId: 'nexus-berry', amount: 2 }],
  },
  {
    id: 'plaza-vault', area: 'plaza', x: 17, y: 14, xp: 25, requiresQuest: true,
    rewards: [{ itemId: 'plaza-key', amount: 1 }, { itemId: 'wisp-shard', amount: 3 }],
  },
]

export const roamingNpcs: RoamingNpc[] = [
  {
    id: 'wisp-courier', area: 'plaza', glyph: '✧', className: 'is-wisp-courier',
    name: { es: 'Mensajero Wisp', en: 'Wisp Courier' },
    role: { es: 'Reparte señales entre portales', en: 'Carries signals between portals' },
    lines: [
      { es: 'Las rutas cambian cuando una baliza despierta.', en: 'Routes change when a beacon awakens.' },
      { es: 'Guardá los fragmentos: pronto tendrán más usos.', en: 'Keep the shards. They will have more uses soon.' },
    ],
    path: [{ x: 9, y: 12 }, { x: 10, y: 12 }, { x: 10, y: 13 }, { x: 9, y: 13 }],
  },
  {
    id: 'guild-runner', area: 'guild', glyph: 'R', className: 'is-guild-runner',
    name: { es: 'Rin', en: 'Rin' },
    role: { es: 'Exploradora del gremio', en: 'Guild explorer' },
    lines: [
      { es: 'Estoy marcando rutas seguras para las próximas parties.', en: 'I am marking safe routes for the next parties.' },
      { es: 'Los cofres del gremio solo se abren una vez.', en: 'Guild chests only open once.' },
    ],
    path: [{ x: 6, y: 6 }, { x: 7, y: 6 }, { x: 8, y: 6 }, { x: 7, y: 7 }],
  },
  {
    id: 'lab-drone', area: 'lab', glyph: '⌁', className: 'is-lab-drone',
    name: { es: 'DR-07', en: 'DR-07' },
    role: { es: 'Dron de diagnóstico', en: 'Diagnostic drone' },
    lines: [
      { es: 'Frecuencia estable. Cristales detectados.', en: 'Frequency stable. Crystals detected.' },
      { es: 'Inventario local sincronizado.', en: 'Local inventory synchronized.' },
    ],
    path: [{ x: 6, y: 6 }, { x: 7, y: 6 }, { x: 8, y: 6 }, { x: 8, y: 7 }],
  },
  {
    id: 'arcade-sprite', area: 'arcade', glyph: '!', className: 'is-arcade-sprite',
    name: { es: 'Glitch', en: 'Glitch' },
    role: { es: 'Espíritu de la máquina', en: 'Machine spirit' },
    lines: [
      { es: 'No fue un bug. Fue una ruta secreta.', en: 'It was not a bug. It was a secret route.' },
      { es: 'Los chips guardan récords que nadie recuerda.', en: 'The chips store records nobody remembers.' },
    ],
    path: [{ x: 7, y: 7 }, { x: 8, y: 7 }, { x: 9, y: 7 }, { x: 8, y: 8 }],
  },
]

export const emptyInventoryState: PixelInventoryState = { items: {}, collected: [], openedChests: [] }

export function readInventoryState(): PixelInventoryState {
  if (typeof window === 'undefined') return emptyInventoryState
  try {
    const parsed = JSON.parse(window.localStorage.getItem(INVENTORY_STORAGE_KEY) || '{}') as Partial<PixelInventoryState>
    const items = parsed.items && typeof parsed.items === 'object' ? parsed.items : {}
    const collected = Array.isArray(parsed.collected) ? parsed.collected.filter((value): value is string => typeof value === 'string') : []
    const openedChests = Array.isArray(parsed.openedChests) ? parsed.openedChests.filter((value): value is string => typeof value === 'string') : []
    return { items, collected, openedChests }
  } catch {
    return emptyInventoryState
  }
}

export function persistInventoryState(state: PixelInventoryState) {
  try {
    window.localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Inventory remains available in memory when browser storage is blocked.
  }
}

export function grantRewards(state: PixelInventoryState, rewards: InventoryReward[]): PixelInventoryState {
  const items = { ...state.items }
  rewards.forEach(({ itemId, amount }) => {
    items[itemId] = Math.max(0, Math.min(999, Number(items[itemId] || 0) + amount))
  })
  return { ...state, items }
}

export function collectPickup(state: PixelInventoryState, pickup: PixelPickup): PixelInventoryState {
  if (state.collected.includes(pickup.id)) return state
  const next = grantRewards(state, [{ itemId: pickup.itemId, amount: pickup.amount }])
  return { ...next, collected: [...next.collected, pickup.id] }
}

export function openPixelChest(state: PixelInventoryState, chest: PixelChest): PixelInventoryState {
  if (state.openedChests.includes(chest.id)) return state
  const next = grantRewards(state, chest.rewards)
  return { ...next, openedChests: [...next.openedChests, chest.id] }
}

export function inventoryTotal(state: PixelInventoryState) {
  return Object.values(state.items).reduce((total, value) => total + Number(value || 0), 0)
}

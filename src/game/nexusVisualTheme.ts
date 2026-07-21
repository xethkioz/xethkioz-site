import { tileKindAt, type AreaId, type TileKind } from './nexusPixelRpg'

export type NexusVisualTheme = 'classic' | 'emeraldcraft-v2'

export type AutotileDescriptor = {
  mask: number
  variant: number
  classes: string
}

const themeStorageKey = 'xethkioz.nexus-pixel.visual-theme.v1'

function sameVisualSurface(current: TileKind, neighbor: TileKind) {
  if (current === neighbor) return true
  if ((current === 'path' || current === 'plaza') && (neighbor === 'path' || neighbor === 'plaza')) return true
  return false
}

function deterministicVariant(area: AreaId, x: number, y: number) {
  const areaSeed = [...area].reduce((total, character) => total + character.charCodeAt(0), 0)
  const hash = Math.abs(((x + 11) * 73856093) ^ ((y + 17) * 19349663) ^ (areaSeed * 83492791))
  return hash % 4
}

export function describeAutotile(area: AreaId, x: number, y: number, kind: TileKind): AutotileDescriptor {
  const north = sameVisualSurface(kind, tileKindAt(area, x, y - 1))
  const east = sameVisualSurface(kind, tileKindAt(area, x + 1, y))
  const south = sameVisualSurface(kind, tileKindAt(area, x, y + 1))
  const west = sameVisualSurface(kind, tileKindAt(area, x - 1, y))

  const mask = (north ? 1 : 0) | (east ? 2 : 0) | (south ? 4 : 0) | (west ? 8 : 0)
  const classes = [
    north ? 'has-n' : 'edge-n',
    east ? 'has-e' : 'edge-e',
    south ? 'has-s' : 'edge-s',
    west ? 'has-w' : 'edge-w',
    `mask-${mask}`,
    `variant-${deterministicVariant(area, x, y)}`,
  ].join(' ')

  return { mask, variant: deterministicVariant(area, x, y), classes }
}

export function readNexusVisualTheme(): NexusVisualTheme {
  if (typeof window === 'undefined') return 'emeraldcraft-v2'

  const requested = new URLSearchParams(window.location.search).get('visual')
  if (requested === 'classic' || requested === 'emeraldcraft-v2') return requested

  try {
    return window.localStorage.getItem(themeStorageKey) === 'classic' ? 'classic' : 'emeraldcraft-v2'
  } catch {
    return 'emeraldcraft-v2'
  }
}

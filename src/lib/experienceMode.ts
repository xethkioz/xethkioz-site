export type GraphicsMode = 'full' | 'lite'

export const GRAPHICS_STORAGE_KEY = 'xethkioz.experience.graphics.v2'
const LEGACY_GRAPHICS_STORAGE_KEY = 'xethkioz.experience.graphics.v1'

type DeviceConnection = {
  saveData?: boolean
  effectiveType?: string
}

function readConnection() {
  return (navigator as Navigator & { connection?: DeviceConnection }).connection
}

export function recommendsLiteMode() {
  if (typeof window === 'undefined') return false
  const connection = readConnection()
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
  const cores = navigator.hardwareConcurrency
  const constrainedNetwork = connection?.effectiveType === 'slow-2g'
    || connection?.effectiveType === '2g'
    || connection?.effectiveType === '3g'

  return Boolean(
    connection?.saveData
    || constrainedNetwork
    || (memory !== undefined && memory <= 4)
    || (cores !== undefined && cores > 0 && cores <= 4)
    || window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
}

export function getInitialGraphicsMode(): GraphicsMode {
  if (typeof window === 'undefined') return 'full'
  try {
    const stored = window.localStorage.getItem(GRAPHICS_STORAGE_KEY)
    if (stored === 'full' || stored === 'lite') return stored

    // Preserve the old lightweight choice. Legacy FULL was also written
    // automatically, so it is re-evaluated against the current device.
    if (window.localStorage.getItem(LEGACY_GRAPHICS_STORAGE_KEY) === 'lite') return 'lite'
  } catch {
    // Device signals still provide a safe default when storage is unavailable.
  }
  return recommendsLiteMode() ? 'lite' : 'full'
}

export function supportsAmbientVideo(graphicsMode: GraphicsMode) {
  if (typeof window === 'undefined' || graphicsMode === 'lite') return false
  return window.innerWidth >= 1024
    && document.visibilityState === 'visible'
    && !recommendsLiteMode()
}

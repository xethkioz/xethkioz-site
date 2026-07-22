import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import type { ProceduralMetalPlayer, SoundtrackId } from './proceduralMetal'

export type GraphicsMode = 'full' | 'lite'

type ExperienceContextValue = {
  graphicsMode: GraphicsMode
  musicOn: boolean
  soundtrack: string
  liteRecommended: boolean
  audioError: string
  setGraphicsMode: (mode: GraphicsMode) => void
  toggleMusic: () => Promise<void>
}

const STORAGE_KEY = 'xethkioz.experience.graphics.v1'
const ExperienceContext = createContext<ExperienceContextValue | undefined>(undefined)

function soundtrackMetaForPath(pathname: string): { id: SoundtrackId; label: string } {
  if (pathname.startsWith('/gaming')) return { id: 'nu', label: 'NU METAL' }
  if (pathname.startsWith('/fun')) return { id: 'glam', label: 'GLAM METAL' }
  if (pathname.startsWith('/science')) return { id: 'progressive', label: 'PROG CYBER METAL' }
  if (pathname.startsWith('/green-node')) return { id: 'death', label: 'BLACK / DEATH METAL' }
  if (pathname.startsWith('/nexus-city')) return { id: 'industrial', label: 'INDUSTRIAL METAL' }
  return { id: 'arcane', label: 'FANTASÍA ARCANA' }
}

function getInitialGraphicsMode(): GraphicsMode {
  if (typeof window === 'undefined') return 'full'
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'lite' ? 'lite' : 'full'
  } catch {
    return 'full'
  }
}

function recommendsLiteMode() {
  if (typeof window === 'undefined') return false
  const navigatorWithSignals = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } }
  return Boolean(
    navigatorWithSignals.connection?.saveData
    || (navigatorWithSignals.deviceMemory !== undefined && navigatorWithSignals.deviceMemory <= 4)
    || navigator.hardwareConcurrency <= 4
    || window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
}

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const [graphicsMode, setGraphicsModeState] = useState<GraphicsMode>(getInitialGraphicsMode)
  const [musicOn, setMusicOn] = useState(false)
  const [audioError, setAudioError] = useState('')
  const playerRef = useRef<ProceduralMetalPlayer | null>(null)
  const soundtrack = useMemo(() => soundtrackMetaForPath(pathname), [pathname])
  const liteRecommended = useMemo(recommendsLiteMode, [])

  useEffect(() => {
    document.documentElement.dataset.xkGraphics = graphicsMode
    try {
      window.localStorage.setItem(STORAGE_KEY, graphicsMode)
    } catch {
      // The mode remains active for the session when storage is unavailable.
    }
  }, [graphicsMode])

  useEffect(() => {
    if (!playerRef.current) return
    void import('./proceduralMetal').then(({ soundtrackForPath }) => playerRef.current?.setProfile(soundtrackForPath(pathname)))
  }, [pathname])

  useEffect(() => () => playerRef.current?.stop(), [])

  const setGraphicsMode = (mode: GraphicsMode) => {
    setGraphicsModeState(mode)
    if (mode === 'lite') {
      playerRef.current?.stop()
      playerRef.current = null
      setMusicOn(false)
    }
  }

  const toggleMusic = async () => {
    setAudioError('')
    if (musicOn) {
      playerRef.current?.stop()
      playerRef.current = null
      setMusicOn(false)
      return
    }
    if (graphicsMode === 'lite') return
    let pendingPlayer: ProceduralMetalPlayer | null = null
    try {
      const { createProceduralMetalPlayer, soundtrackForPath } = await import('./proceduralMetal')
      pendingPlayer = createProceduralMetalPlayer(soundtrackForPath(pathname))
      await pendingPlayer.start()
      playerRef.current = pendingPlayer
      setMusicOn(true)
    } catch (error) {
      pendingPlayer?.stop()
      playerRef.current?.stop()
      playerRef.current = null
      setAudioError(error instanceof Error ? error.message : 'No se pudo iniciar el audio.')
      setMusicOn(false)
    }
  }

  return (
    <ExperienceContext.Provider value={{ graphicsMode, musicOn, soundtrack: soundtrack.label, liteRecommended, audioError, setGraphicsMode, toggleMusic }}>
      {children}
    </ExperienceContext.Provider>
  )
}

export function useExperience() {
  const context = useContext(ExperienceContext)
  if (!context) throw new Error('useExperience must be used within ExperienceProvider')
  return context
}

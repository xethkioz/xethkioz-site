import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type WispMood = 'idle' | 'watching' | 'connected' | 'guiding' | 'alert' | 'sleeping' | 'GREEN_MODE'
export type WispEventType = 'route-watch' | 'portal-hover' | 'green-unlock' | 'green-mode' | 'system-ready' | 'future-ai'

export interface WispEvent {
  id: string
  type: WispEventType
  label: string
  route: string
  createdAt: string
}

interface WispEngineContextType {
  mood: WispMood
  energy: number
  focusRoute: string
  events: WispEvent[]
  setMood: (mood: WispMood) => void
  setFocusRoute: (route: string) => void
  activateGreenMode: () => void
  registerEvent: (type: WispEventType, label: string, route?: string) => void
  resetWisp: () => void
}

const WispEngineContext = createContext<WispEngineContextType | undefined>(undefined)

const STORAGE_MOOD = 'xethkioz.wisp.mood'
const STORAGE_ENERGY = 'xethkioz.wisp.energy'
const STORAGE_EVENTS = 'xethkioz.wisp.events'
const STORAGE_ROUTE = 'xethkioz.wisp.focusRoute'

const validMoods: WispMood[] = ['idle', 'watching', 'connected', 'guiding', 'alert', 'sleeping', 'GREEN_MODE']

const safeMood = (value: string | null): WispMood => (value && validMoods.includes(value as WispMood) ? value as WispMood : 'idle')

const readEnergy = () => {
  if (typeof window === 'undefined') return 37
  const stored = Number(window.localStorage.getItem(STORAGE_ENERGY))
  if (!Number.isFinite(stored)) return 37
  return Math.min(100, Math.max(0, stored))
}

const readEvents = (): WispEvent[] => {
  if (typeof window === 'undefined') return []
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_EVENTS) || '[]')
    return Array.isArray(parsed) ? parsed.slice(0, 6) : []
  } catch {
    return []
  }
}

export function WispEngineProvider({ children }: { children: ReactNode }) {
  const [mood, setMoodState] = useState<WispMood>(() => (typeof window === 'undefined' ? 'idle' : safeMood(window.localStorage.getItem(STORAGE_MOOD))))
  const [energy, setEnergy] = useState<number>(readEnergy)
  const [events, setEvents] = useState<WispEvent[]>(readEvents)
  const [focusRoute, setFocusRouteState] = useState<string>(() => (typeof window === 'undefined' ? '/' : window.localStorage.getItem(STORAGE_ROUTE) || '/'))

  useEffect(() => {
    window.localStorage.setItem(STORAGE_MOOD, mood)
    document.documentElement.dataset.xethWisp = mood
  }, [mood])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_ENERGY, String(energy))
    document.documentElement.style.setProperty('--xeth-wisp-energy', String(energy))
  }, [energy])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_EVENTS, JSON.stringify(events.slice(0, 6)))
  }, [events])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_ROUTE, focusRoute)
  }, [focusRoute])

  const value = useMemo<WispEngineContextType>(() => ({
    mood,
    energy,
    focusRoute,
    events,
    setMood: (next) => setMoodState(next),
    setFocusRoute: (route) => setFocusRouteState(route),
    activateGreenMode: () => {
      setMoodState('GREEN_MODE')
      setEnergy((current) => Math.min(100, current + 17))
      const event: WispEvent = {
        id: `wisp-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        type: 'green-mode',
        label: 'green-mode:portal-override',
        route: '/green-node',
        createdAt: new Date().toISOString(),
      }
      setEvents((current) => [event, ...current].slice(0, 6))
    },
    registerEvent: (type, label, route = focusRoute) => {
      const event: WispEvent = {
        id: `wisp-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        type,
        label,
        route,
        createdAt: new Date().toISOString(),
      }
      setEvents((current) => [event, ...current].slice(0, 6))
      setEnergy((current) => Math.min(100, current + (type === 'green-unlock' ? 13 : 4)))
      if (type === 'green-unlock') setMoodState('connected')
      else if (type === 'green-mode') setMoodState('GREEN_MODE')
      else if (type === 'portal-hover') setMoodState('guiding')
      else if (type === 'system-ready') setMoodState('watching')
    },
    resetWisp: () => {
      setMoodState('idle')
      setEnergy(37)
      setEvents([])
      setFocusRouteState('/')
    },
  }), [mood, energy, focusRoute, events])

  return <WispEngineContext.Provider value={value}>{children}</WispEngineContext.Provider>
}

export function useWispEngine() {
  const ctx = useContext(WispEngineContext)
  if (!ctx) throw new Error('useWispEngine must be used within WispEngineProvider')
  return ctx
}

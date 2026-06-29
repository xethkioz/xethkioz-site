import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { WispEngineProvider, useWispEngine, type WispEventType, type WispMood } from '../lib/WispEngineContext'

export type WispState = 'IDLE' | 'WATCHING' | 'CONNECTED' | 'GREEN_MODE'

export const GREEN_NODE_UNLOCK_KEY = 'xethkioz.greenNodeUnlocked'

type WispContextType = {
  state: WispState
  mood: WispMood
  energy: number
  focusRoute: string
  events: ReturnType<typeof useWispEngine>['events']
  setWispState: (state: WispState) => void
  triggerGreenPortal: () => void
  setState: (state: WispState) => void
  setMood: (mood: WispMood) => void
  setFocusRoute: (route: string) => void
  activateGreenMode: () => void
  registerEvent: (type: WispEventType, label: string, route?: string) => void
  resetWisp: () => void
}

const WispContext = createContext<WispContextType | undefined>(undefined)

const stateToMood: Record<WispState, WispMood> = {
  IDLE: 'idle',
  WATCHING: 'watching',
  CONNECTED: 'connected',
  GREEN_MODE: 'GREEN_MODE',
}

function moodToState(mood: WispMood): WispState {
  if (mood === 'GREEN_MODE') return 'GREEN_MODE'
  if (mood === 'connected') return 'CONNECTED'
  if (mood === 'watching' || mood === 'guiding') return 'WATCHING'
  return 'IDLE'
}

function unlockGreenNode() {
  if (typeof window === 'undefined') return
  window.sessionStorage.setItem(GREEN_NODE_UNLOCK_KEY, String(Date.now()))
}

function WispBridge({ children }: { children: ReactNode }) {
  const engine = useWispEngine()

  const value = useMemo<WispContextType>(() => {
    const setWispState = (nextState: WispState) => {
      engine.setMood(stateToMood[nextState])
    }

    const triggerGreenPortal = () => {
      unlockGreenNode()
      engine.registerEvent('green-unlock', 'wisp-provider:green-zone-unlock', '/green-node')
      engine.registerEvent('green-mode', 'wisp-provider:green-zone-trigger', '/green-node')
      engine.activateGreenMode()
    }

    return {
      state: moodToState(engine.mood),
      mood: engine.mood,
      energy: engine.energy,
      focusRoute: engine.focusRoute,
      events: engine.events,
      setWispState,
      triggerGreenPortal,
      setState: setWispState,
      setMood: engine.setMood,
      setFocusRoute: engine.setFocusRoute,
      activateGreenMode: triggerGreenPortal,
      registerEvent: engine.registerEvent,
      resetWisp: engine.resetWisp,
    }
  }, [engine])

  return <WispContext.Provider value={value}>{children}</WispContext.Provider>
}

export function WispProvider({ children }: { children: ReactNode }) {
  return (
    <WispEngineProvider>
      <WispBridge>{children}</WispBridge>
    </WispEngineProvider>
  )
}

export function useWisp() {
  const context = useContext(WispContext)
  if (!context) throw new Error('useWisp debe ser utilizado dentro de WispProvider')
  return context
}

import { useMemo, type ReactNode } from 'react'
import { WispEngineProvider, useWispEngine, type WispMood } from '../lib/WispEngineContext'

export type WispState = WispMood

export function WispProvider({ children }: { children: ReactNode }) {
  return <WispEngineProvider>{children}</WispEngineProvider>
}

export function useWisp() {
  const engine = useWispEngine()

  return useMemo(() => ({
    state: engine.mood,
    mood: engine.mood,
    energy: engine.energy,
    events: engine.events,
    focusRoute: engine.focusRoute,
    setState: engine.setMood,
    setMood: engine.setMood,
    activateGreenMode: engine.activateGreenMode,
    registerEvent: engine.registerEvent,
    resetWisp: engine.resetWisp,
  }), [engine])
}

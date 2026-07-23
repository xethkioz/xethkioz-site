import React, {
  createContext,
  memo,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react'
import {
  createSmoothNumberValue,
  useSmoothNumberValue,
} from '../motion/SmoothNumberValue'
import { DEFAULT_WORLD_STATE, type WorldState } from '../state'
import {
  DEFAULT_LIGHTING_PROFILE,
  getLightingProfile,
  type LightingProfile,
} from './lightingMatrix'
import {
  createLightingCssVariables,
  type LightingCssVariables,
  type LightingMotionValues,
} from './lightingVariables'

export type LightingEngineContextValue = {
  state: WorldState
  profile: LightingProfile
  cssVariables: LightingCssVariables
  motion: LightingMotionValues
}

type LightingEngineProviderProps = {
  children: ReactNode
  state?: WorldState
}

const LightingEngineContext = createContext<LightingEngineContextValue | null>(null)

const intensitySpring = { stiffness: 90, damping: 24, mass: 0.85 }
const bloomSpring = { stiffness: 70, damping: 26, mass: 0.9 }
const fogSpring = { stiffness: 80, damping: 24, mass: 0.85 }
const wispSpring = { stiffness: 110, damping: 22, mass: 0.75 }

function LightingEngineProviderComponent({
  children,
  state = DEFAULT_WORLD_STATE,
}: LightingEngineProviderProps) {
  const profile = useMemo(() => getLightingProfile(state), [state])

  const intensity = useSmoothNumberValue(DEFAULT_LIGHTING_PROFILE.intensity, intensitySpring)
  const bloomBlur = useSmoothNumberValue(DEFAULT_LIGHTING_PROFILE.bloomBlur, bloomSpring)
  const fogDensity = useSmoothNumberValue(DEFAULT_LIGHTING_PROFILE.fogDensity, fogSpring)
  const wispSpeed = useSmoothNumberValue(DEFAULT_LIGHTING_PROFILE.wispSpeed, wispSpring)

  useEffect(() => {
    intensity.set(profile.intensity)
    bloomBlur.set(profile.bloomBlur)
    fogDensity.set(profile.fogDensity)
    wispSpeed.set(profile.wispSpeed)
  }, [profile, intensity, bloomBlur, fogDensity, wispSpeed])

  const cssVariables = useMemo(() => createLightingCssVariables(profile), [profile])

  const value = useMemo<LightingEngineContextValue>(
    () => ({
      state,
      profile,
      cssVariables,
      motion: { intensity, bloomBlur, fogDensity, wispSpeed },
    }),
    [state, profile, cssVariables, intensity, bloomBlur, fogDensity, wispSpeed],
  )

  return (
    <LightingEngineContext.Provider value={value}>
      {children}
    </LightingEngineContext.Provider>
  )
}

export const LightingEngineProvider = memo(LightingEngineProviderComponent)
LightingEngineProvider.displayName = 'LightingEngineProvider'

export function useLighting(): LightingEngineContextValue {
  const context = useContext(LightingEngineContext)
  if (context) return context

  const staticConfig = { stiffness: 1, damping: 1, mass: 1, immediate: true }
  return {
    state: DEFAULT_WORLD_STATE,
    profile: DEFAULT_LIGHTING_PROFILE,
    cssVariables: createLightingCssVariables(DEFAULT_LIGHTING_PROFILE),
    motion: {
      intensity: createSmoothNumberValue(DEFAULT_LIGHTING_PROFILE.intensity, staticConfig),
      bloomBlur: createSmoothNumberValue(DEFAULT_LIGHTING_PROFILE.bloomBlur, staticConfig),
      fogDensity: createSmoothNumberValue(DEFAULT_LIGHTING_PROFILE.fogDensity, staticConfig),
      wispSpeed: createSmoothNumberValue(DEFAULT_LIGHTING_PROFILE.wispSpeed, staticConfig),
    },
  }
}

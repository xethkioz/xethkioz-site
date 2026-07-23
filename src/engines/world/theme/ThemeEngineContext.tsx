import React, {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  createSmoothNumberValue,
  useSmoothNumberValue,
  type NumericMotionValue,
} from '../motion/SmoothNumberValue'
import {
  DEFAULT_WORLD_THEME,
  isWorldPortalTheme,
  type WorldPortalTheme,
} from './themeTypes'
import {
  getWorldThemeConfig,
  type WorldThemeConfig,
} from './themeMatrix'
import {
  createWorldThemeCssVariables,
  type WorldThemeCssVariables,
} from './themeVariables'

export type WorldThemeMotionValues = {
  particleSpeed: NumericMotionValue
  particleDrift: NumericMotionValue
  particleOpacity: NumericMotionValue
  fogDensity: NumericMotionValue
}

export type WorldThemeEngineContextValue = {
  theme: WorldPortalTheme
  config: WorldThemeConfig
  cssVariables: WorldThemeCssVariables
  motion: WorldThemeMotionValues
  setTheme: (theme: WorldPortalTheme) => void
  cycleTheme: () => void
}

type WorldThemeProviderProps = {
  children: ReactNode
  initialTheme?: WorldPortalTheme
}

const orderedThemes: WorldPortalTheme[] = [
  'gaming',
  'scienceLab',
  'greenNode',
  'asiaGaming',
  'studio',
]

const WorldThemeEngineContext = createContext<WorldThemeEngineContextValue | null>(null)

const particleSpeedSpring = { stiffness: 85, damping: 24, mass: 0.9 }
const particleDriftSpring = { stiffness: 85, damping: 24, mass: 0.9 }
const particleOpacitySpring = { stiffness: 90, damping: 24, mass: 0.85 }
const fogDensitySpring = { stiffness: 80, damping: 26, mass: 0.95 }

function WorldThemeProviderComponent({
  children,
  initialTheme = DEFAULT_WORLD_THEME,
}: WorldThemeProviderProps) {
  const safeInitialTheme = isWorldPortalTheme(initialTheme)
    ? initialTheme
    : DEFAULT_WORLD_THEME

  const [theme, setThemeState] = useState<WorldPortalTheme>(safeInitialTheme)
  const config = useMemo(() => getWorldThemeConfig(theme), [theme])
  const cssVariables = useMemo(() => createWorldThemeCssVariables(config), [config])

  const particleSpeed = useSmoothNumberValue(config.particles.speed, particleSpeedSpring)
  const particleDrift = useSmoothNumberValue(config.particles.drift, particleDriftSpring)
  const particleOpacity = useSmoothNumberValue(config.particles.opacity, particleOpacitySpring)
  const fogDensity = useSmoothNumberValue(config.backdrop.fogDensity, fogDensitySpring)

  useEffect(() => {
    particleSpeed.set(config.particles.speed)
    particleDrift.set(config.particles.drift)
    particleOpacity.set(config.particles.opacity)
    fogDensity.set(config.backdrop.fogDensity)
  }, [config, particleSpeed, particleDrift, particleOpacity, fogDensity])

  const setTheme = useCallback((nextTheme: WorldPortalTheme) => {
    if (isWorldPortalTheme(nextTheme)) setThemeState(nextTheme)
  }, [])

  const cycleTheme = useCallback(() => {
    setThemeState((currentTheme) => {
      const currentIndex = orderedThemes.indexOf(currentTheme)
      return orderedThemes[(currentIndex + 1) % orderedThemes.length]
    })
  }, [])

  const value = useMemo<WorldThemeEngineContextValue>(
    () => ({
      theme,
      config,
      cssVariables,
      motion: { particleSpeed, particleDrift, particleOpacity, fogDensity },
      setTheme,
      cycleTheme,
    }),
    [theme, config, cssVariables, particleSpeed, particleDrift, particleOpacity, fogDensity, setTheme, cycleTheme],
  )

  return (
    <WorldThemeEngineContext.Provider value={value}>
      {children}
    </WorldThemeEngineContext.Provider>
  )
}

export const WorldThemeProvider = memo(WorldThemeProviderComponent)
WorldThemeProvider.displayName = 'WorldThemeProvider'

export function useWorldTheme(): WorldThemeEngineContextValue {
  const context = useContext(WorldThemeEngineContext)
  if (context) return context

  const fallbackConfig = getWorldThemeConfig(DEFAULT_WORLD_THEME)
  const staticConfig = { stiffness: 1, damping: 1, mass: 1, immediate: true }
  return {
    theme: DEFAULT_WORLD_THEME,
    config: fallbackConfig,
    cssVariables: createWorldThemeCssVariables(fallbackConfig),
    motion: {
      particleSpeed: createSmoothNumberValue(fallbackConfig.particles.speed, staticConfig),
      particleDrift: createSmoothNumberValue(fallbackConfig.particles.drift, staticConfig),
      particleOpacity: createSmoothNumberValue(fallbackConfig.particles.opacity, staticConfig),
      fogDensity: createSmoothNumberValue(fallbackConfig.backdrop.fogDensity, staticConfig),
    },
    setTheme: () => undefined,
    cycleTheme: () => undefined,
  }
}

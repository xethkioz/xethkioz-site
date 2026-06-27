import React, {
  createContext,
  memo,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { motionValue, useSpring, type MotionValue } from "framer-motion";
import {
  DEFAULT_WORLD_THEME,
  isWorldPortalTheme,
  type WorldPortalTheme,
} from "./themeTypes";
import {
  getWorldThemeConfig,
  type WorldThemeConfig,
} from "./themeMatrix";
import {
  createWorldThemeCssVariables,
  type WorldThemeCssVariables,
} from "./themeVariables";

export type WorldThemeMotionValues = {
  particleSpeed: MotionValue<number>;
  particleDrift: MotionValue<number>;
  particleOpacity: MotionValue<number>;
  fogDensity: MotionValue<number>;
};

export type WorldThemeEngineContextValue = {
  theme: WorldPortalTheme;
  config: WorldThemeConfig;
  cssVariables: WorldThemeCssVariables;
  motion: WorldThemeMotionValues;
  setTheme: (theme: WorldPortalTheme) => void;
  cycleTheme: () => void;
};

type WorldThemeProviderProps = {
  children: ReactNode;
  initialTheme?: WorldPortalTheme;
};

const orderedThemes: WorldPortalTheme[] = [
  "gaming",
  "scienceLab",
  "greenNode",
  "asiaGaming",
  "studio",
];

const WorldThemeEngineContext = createContext<WorldThemeEngineContextValue | null>(null);

function WorldThemeProviderComponent({
  children,
  initialTheme = DEFAULT_WORLD_THEME,
}: WorldThemeProviderProps) {
  const safeInitialTheme = isWorldPortalTheme(initialTheme)
    ? initialTheme
    : DEFAULT_WORLD_THEME;

  const [theme, setThemeState] = useState<WorldPortalTheme>(safeInitialTheme);
  const config = useMemo(() => getWorldThemeConfig(theme), [theme]);
  const cssVariables = useMemo(() => createWorldThemeCssVariables(config), [config]);

  const rawParticleSpeed = useMemo(() => motionValue(config.particles.speed), []);
  const rawParticleDrift = useMemo(() => motionValue(config.particles.drift), []);
  const rawParticleOpacity = useMemo(() => motionValue(config.particles.opacity), []);
  const rawFogDensity = useMemo(() => motionValue(config.backdrop.fogDensity), []);

  rawParticleSpeed.set(config.particles.speed);
  rawParticleDrift.set(config.particles.drift);
  rawParticleOpacity.set(config.particles.opacity);
  rawFogDensity.set(config.backdrop.fogDensity);

  const particleSpeed = useSpring(rawParticleSpeed, { stiffness: 85, damping: 24, mass: 0.9 });
  const particleDrift = useSpring(rawParticleDrift, { stiffness: 85, damping: 24, mass: 0.9 });
  const particleOpacity = useSpring(rawParticleOpacity, { stiffness: 90, damping: 24, mass: 0.85 });
  const fogDensity = useSpring(rawFogDensity, { stiffness: 80, damping: 26, mass: 0.95 });

  const setTheme = useCallback((nextTheme: WorldPortalTheme) => {
    if (!isWorldPortalTheme(nextTheme)) {
      return;
    }

    setThemeState(nextTheme);
  }, []);

  const cycleTheme = useCallback(() => {
    setThemeState((currentTheme) => {
      const currentIndex = orderedThemes.indexOf(currentTheme);
      const nextIndex = (currentIndex + 1) % orderedThemes.length;
      return orderedThemes[nextIndex];
    });
  }, []);

  const value = useMemo<WorldThemeEngineContextValue>(
    () => ({
      theme,
      config,
      cssVariables,
      motion: {
        particleSpeed,
        particleDrift,
        particleOpacity,
        fogDensity,
      },
      setTheme,
      cycleTheme,
    }),
    [
      theme,
      config,
      cssVariables,
      particleSpeed,
      particleDrift,
      particleOpacity,
      fogDensity,
      setTheme,
      cycleTheme,
    ]
  );

  return (
    <WorldThemeEngineContext.Provider value={value}>
      {children}
    </WorldThemeEngineContext.Provider>
  );
}

export const WorldThemeProvider = memo(WorldThemeProviderComponent);
WorldThemeProvider.displayName = "WorldThemeProvider";

export function useWorldTheme(): WorldThemeEngineContextValue {
  const context = useContext(WorldThemeEngineContext);

  if (!context) {
    const fallbackConfig = getWorldThemeConfig(DEFAULT_WORLD_THEME);

    return {
      theme: DEFAULT_WORLD_THEME,
      config: fallbackConfig,
      cssVariables: createWorldThemeCssVariables(fallbackConfig),
      motion: {
        particleSpeed: motionValue(fallbackConfig.particles.speed),
        particleDrift: motionValue(fallbackConfig.particles.drift),
        particleOpacity: motionValue(fallbackConfig.particles.opacity),
        fogDensity: motionValue(fallbackConfig.backdrop.fogDensity),
      },
      setTheme: () => undefined,
      cycleTheme: () => undefined,
    };
  }

  return context;
}

import React, {
  createContext,
  memo,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { motionValue, useSpring } from "framer-motion";
import { DEFAULT_WORLD_STATE, type WorldState } from "../state";
import {
  DEFAULT_LIGHTING_PROFILE,
  getLightingProfile,
  type LightingProfile,
} from "./lightingMatrix";
import {
  createLightingCssVariables,
  type LightingCssVariables,
  type LightingMotionValues,
} from "./lightingVariables";

export type LightingEngineContextValue = {
  state: WorldState;
  profile: LightingProfile;
  cssVariables: LightingCssVariables;
  motion: LightingMotionValues;
};

type LightingEngineProviderProps = {
  children: ReactNode;
  state?: WorldState;
};

const LightingEngineContext = createContext<LightingEngineContextValue | null>(null);

function LightingEngineProviderComponent({
  children,
  state = DEFAULT_WORLD_STATE,
}: LightingEngineProviderProps) {
  const profile = useMemo(() => getLightingProfile(state), [state]);

  const rawIntensity = useMemo(() => motionValue(DEFAULT_LIGHTING_PROFILE.intensity), []);
  const rawBloomBlur = useMemo(() => motionValue(DEFAULT_LIGHTING_PROFILE.bloomBlur), []);
  const rawFogDensity = useMemo(() => motionValue(DEFAULT_LIGHTING_PROFILE.fogDensity), []);
  const rawWispSpeed = useMemo(() => motionValue(DEFAULT_LIGHTING_PROFILE.wispSpeed), []);

  const intensity = useSpring(rawIntensity, { stiffness: 90, damping: 24, mass: 0.85 });
  const bloomBlur = useSpring(rawBloomBlur, { stiffness: 70, damping: 26, mass: 0.9 });
  const fogDensity = useSpring(rawFogDensity, { stiffness: 80, damping: 24, mass: 0.85 });
  const wispSpeed = useSpring(rawWispSpeed, { stiffness: 110, damping: 22, mass: 0.75 });

  useEffect(() => {
    rawIntensity.set(profile.intensity);
    rawBloomBlur.set(profile.bloomBlur);
    rawFogDensity.set(profile.fogDensity);
    rawWispSpeed.set(profile.wispSpeed);
  }, [profile, rawIntensity, rawBloomBlur, rawFogDensity, rawWispSpeed]);

  const cssVariables = useMemo(() => createLightingCssVariables(profile), [profile]);

  const value = useMemo<LightingEngineContextValue>(
    () => ({
      state,
      profile,
      cssVariables,
      motion: {
        intensity,
        bloomBlur,
        fogDensity,
        wispSpeed,
      },
    }),
    [state, profile, cssVariables, intensity, bloomBlur, fogDensity, wispSpeed]
  );

  return (
    <LightingEngineContext.Provider value={value}>
      {children}
    </LightingEngineContext.Provider>
  );
}

export const LightingEngineProvider = memo(LightingEngineProviderComponent);
LightingEngineProvider.displayName = "LightingEngineProvider";

export function useLighting(): LightingEngineContextValue {
  const context = useContext(LightingEngineContext);

  if (!context) {
    return {
      state: DEFAULT_WORLD_STATE,
      profile: DEFAULT_LIGHTING_PROFILE,
      cssVariables: createLightingCssVariables(DEFAULT_LIGHTING_PROFILE),
      motion: {
        intensity: motionValue(DEFAULT_LIGHTING_PROFILE.intensity),
        bloomBlur: motionValue(DEFAULT_LIGHTING_PROFILE.bloomBlur),
        fogDensity: motionValue(DEFAULT_LIGHTING_PROFILE.fogDensity),
        wispSpeed: motionValue(DEFAULT_LIGHTING_PROFILE.wispSpeed),
      },
    };
  }

  return context;
}

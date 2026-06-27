import type { MotionValue } from "framer-motion";
import type { LightingProfile } from "./lightingMatrix";

export type LightingCssVariables = React.CSSProperties & {
  "--world-primary-glow"?: string;
  "--world-secondary-glow"?: string;
  "--world-action-glow"?: string;
  "--world-vignette-glow"?: string;
  "--world-light-intensity"?: number;
  "--world-bloom-blur"?: string;
  "--world-fog-density"?: number;
  "--world-wisp-speed"?: number;
  "--world-relic-glow"?: string;
};

export type LightingMotionValues = {
  intensity: MotionValue<number>;
  bloomBlur: MotionValue<number>;
  fogDensity: MotionValue<number>;
  wispSpeed: MotionValue<number>;
};

export function createLightingCssVariables(profile: LightingProfile): LightingCssVariables {
  return {
    "--world-primary-glow": profile.primaryGlow,
    "--world-secondary-glow": profile.secondaryGlow,
    "--world-action-glow": profile.actionGlow,
    "--world-vignette-glow": profile.vignetteGlow,
    "--world-light-intensity": profile.intensity,
    "--world-bloom-blur": `${profile.bloomBlur}px`,
    "--world-fog-density": profile.fogDensity,
    "--world-wisp-speed": profile.wispSpeed,
    "--world-relic-glow": profile.relicGlow,
  };
}

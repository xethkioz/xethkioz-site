import type { WorldState } from "../state";

export type LightingAccent = "violet" | "orange" | "cyan" | "green" | "red" | "neutral";

export type LightingProfile = {
  state: WorldState;
  accent: LightingAccent;
  primaryGlow: string;
  secondaryGlow: string;
  actionGlow: string;
  vignetteGlow: string;
  intensity: number;
  bloomBlur: number;
  fogDensity: number;
  wispSpeed: number;
  relicGlow: string;
};

export const LIGHTING_MATRIX: Record<WorldState, LightingProfile> = {
  idle: {
    state: "idle",
    accent: "violet",
    primaryGlow: "rgba(139, 92, 246, 0.28)",
    secondaryGlow: "rgba(168, 85, 247, 0.18)",
    actionGlow: "rgba(249, 115, 22, 0.08)",
    vignetteGlow: "rgba(11, 10, 15, 0.82)",
    intensity: 0.62,
    bloomBlur: 46,
    fogDensity: 0.16,
    wispSpeed: 1,
    relicGlow: "drop-shadow(0 0 18px rgba(139,92,246,.34))",
  },
  searching: {
    state: "searching",
    accent: "cyan",
    primaryGlow: "rgba(34, 211, 238, 0.25)",
    secondaryGlow: "rgba(139, 92, 246, 0.16)",
    actionGlow: "rgba(34, 211, 238, 0.28)",
    vignetteGlow: "rgba(6, 18, 24, 0.78)",
    intensity: 0.74,
    bloomBlur: 54,
    fogDensity: 0.2,
    wispSpeed: 1.12,
    relicGlow: "drop-shadow(0 0 22px rgba(34,211,238,.42))",
  },
  talking: {
    state: "talking",
    accent: "cyan",
    primaryGlow: "rgba(34, 211, 238, 0.22)",
    secondaryGlow: "rgba(139, 92, 246, 0.22)",
    actionGlow: "rgba(249, 115, 22, 0.1)",
    vignetteGlow: "rgba(11, 10, 15, 0.78)",
    intensity: 0.7,
    bloomBlur: 50,
    fogDensity: 0.18,
    wispSpeed: 1.05,
    relicGlow: "drop-shadow(0 0 20px rgba(34,211,238,.34))",
  },
  meditation: {
    state: "meditation",
    accent: "violet",
    primaryGlow: "rgba(109, 40, 217, 0.26)",
    secondaryGlow: "rgba(139, 92, 246, 0.2)",
    actionGlow: "rgba(249, 115, 22, 0.04)",
    vignetteGlow: "rgba(11, 10, 15, 0.9)",
    intensity: 0.48,
    bloomBlur: 62,
    fogDensity: 0.14,
    wispSpeed: 0.82,
    relicGlow: "drop-shadow(0 0 24px rgba(109,40,217,.36))",
  },
  combat: {
    state: "combat",
    accent: "orange",
    primaryGlow: "rgba(249, 115, 22, 0.34)",
    secondaryGlow: "rgba(139, 92, 246, 0.14)",
    actionGlow: "rgba(249, 115, 22, 0.46)",
    vignetteGlow: "rgba(24, 10, 5, 0.86)",
    intensity: 0.95,
    bloomBlur: 58,
    fogDensity: 0.28,
    wispSpeed: 1.36,
    relicGlow: "drop-shadow(0 0 30px rgba(249,115,22,.58))",
  },
  alert: {
    state: "alert",
    accent: "red",
    primaryGlow: "rgba(239, 68, 68, 0.32)",
    secondaryGlow: "rgba(249, 115, 22, 0.22)",
    actionGlow: "rgba(249, 115, 22, 0.5)",
    vignetteGlow: "rgba(30, 5, 5, 0.88)",
    intensity: 1,
    bloomBlur: 60,
    fogDensity: 0.3,
    wispSpeed: 1.42,
    relicGlow: "drop-shadow(0 0 32px rgba(249,115,22,.68))",
  },
  loading: {
    state: "loading",
    accent: "cyan",
    primaryGlow: "rgba(34, 211, 238, 0.3)",
    secondaryGlow: "rgba(249, 115, 22, 0.22)",
    actionGlow: "rgba(139, 92, 246, 0.28)",
    vignetteGlow: "rgba(8, 14, 22, 0.78)",
    intensity: 0.82,
    bloomBlur: 72,
    fogDensity: 0.26,
    wispSpeed: 1.18,
    relicGlow: "drop-shadow(0 0 28px rgba(34,211,238,.46))",
  },
  portal: {
    state: "portal",
    accent: "orange",
    primaryGlow: "rgba(249, 115, 22, 0.36)",
    secondaryGlow: "rgba(139, 92, 246, 0.32)",
    actionGlow: "rgba(249, 115, 22, 0.56)",
    vignetteGlow: "rgba(18, 9, 22, 0.82)",
    intensity: 1,
    bloomBlur: 84,
    fogDensity: 0.34,
    wispSpeed: 1.5,
    relicGlow: "drop-shadow(0 0 38px rgba(249,115,22,.74))",
  },
  sleeping: {
    state: "sleeping",
    accent: "neutral",
    primaryGlow: "rgba(139, 92, 246, 0.05)",
    secondaryGlow: "rgba(22, 20, 31, 0.08)",
    actionGlow: "rgba(249, 115, 22, 0.02)",
    vignetteGlow: "rgba(11, 10, 15, 0.96)",
    intensity: 0.12,
    bloomBlur: 30,
    fogDensity: 0.05,
    wispSpeed: 0.42,
    relicGlow: "drop-shadow(0 0 8px rgba(139,92,246,.12))",
  },
};

export const DEFAULT_LIGHTING_PROFILE = LIGHTING_MATRIX.idle;

export function getLightingProfile(state: WorldState): LightingProfile {
  return LIGHTING_MATRIX[state];
}

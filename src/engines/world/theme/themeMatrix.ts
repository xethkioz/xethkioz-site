import type { WorldPortalTheme } from "./themeTypes";

export type WorldThemePalette = {
  base: string;
  surface: string;
  primary: string;
  secondary: string;
  action: string;
  text: string;
  mutedText: string;
};

export type WorldThemeVfx = {
  primaryGlow: string;
  secondaryGlow: string;
  actionGlow: string;
  gridGlow: string;
  fogGlow: string;
  vignette: string;
};

export type WorldThemeParticles = {
  density: number;
  speed: number;
  drift: number;
  opacity: number;
};

export type WorldThemeBackdrop = {
  gradientStyle: "radial" | "diagonal" | "grid" | "aurora" | "studio";
  showGrid: boolean;
  showNoise: boolean;
  fogDensity: number;
};

export type WorldThemeHud = {
  border: string;
  softBorder: string;
  cardGlow: string;
  activeGlow: string;
};

export type WorldThemeConfig = {
  id: WorldPortalTheme;
  label: string;
  palette: WorldThemePalette;
  vfx: WorldThemeVfx;
  particles: WorldThemeParticles;
  backdrop: WorldThemeBackdrop;
  hud: WorldThemeHud;
};

const BASE = "#0B0A0F";
const SURFACE = "#16141F";

export const WORLD_THEME_MATRIX: Record<WorldPortalTheme, WorldThemeConfig> = {
  gaming: {
    id: "gaming",
    label: "Gaming",
    palette: {
      base: BASE,
      surface: SURFACE,
      primary: "#8B5CF6",
      secondary: "#A855F7",
      action: "#F97316",
      text: "#F8FAFC",
      mutedText: "#CBD5E1",
    },
    vfx: {
      primaryGlow: "rgba(139,92,246,0.30)",
      secondaryGlow: "rgba(168,85,247,0.18)",
      actionGlow: "rgba(249,115,22,0.24)",
      gridGlow: "rgba(139,92,246,0.16)",
      fogGlow: "rgba(139,92,246,0.14)",
      vignette: "rgba(11,10,15,0.86)",
    },
    particles: {
      density: 32,
      speed: 1,
      drift: 1,
      opacity: 0.55,
    },
    backdrop: {
      gradientStyle: "radial",
      showGrid: true,
      showNoise: true,
      fogDensity: 0.16,
    },
    hud: {
      border: "rgba(139,92,246,0.22)",
      softBorder: "rgba(139,92,246,0.10)",
      cardGlow: "drop-shadow(0 0 18px rgba(139,92,246,.28))",
      activeGlow: "drop-shadow(0 0 30px rgba(249,115,22,.54))",
    },
  },

  scienceLab: {
    id: "scienceLab",
    label: "Science Lab",
    palette: {
      base: BASE,
      surface: SURFACE,
      primary: "#22D3EE",
      secondary: "#8B5CF6",
      action: "#F97316",
      text: "#F8FAFC",
      mutedText: "#CFFAFE",
    },
    vfx: {
      primaryGlow: "rgba(34,211,238,0.25)",
      secondaryGlow: "rgba(139,92,246,0.16)",
      actionGlow: "rgba(249,115,22,0.16)",
      gridGlow: "rgba(34,211,238,0.14)",
      fogGlow: "rgba(34,211,238,0.12)",
      vignette: "rgba(6,18,24,0.82)",
    },
    particles: {
      density: 26,
      speed: 0.86,
      drift: 0.72,
      opacity: 0.48,
    },
    backdrop: {
      gradientStyle: "grid",
      showGrid: true,
      showNoise: true,
      fogDensity: 0.12,
    },
    hud: {
      border: "rgba(34,211,238,0.22)",
      softBorder: "rgba(34,211,238,0.10)",
      cardGlow: "drop-shadow(0 0 18px rgba(34,211,238,.26))",
      activeGlow: "drop-shadow(0 0 26px rgba(34,211,238,.48))",
    },
  },

  greenNode: {
    id: "greenNode",
    label: "Green Node",
    palette: {
      base: BASE,
      surface: SURFACE,
      primary: "#22C55E",
      secondary: "#8B5CF6",
      action: "#F97316",
      text: "#F0FDF4",
      mutedText: "#BBF7D0",
    },
    vfx: {
      primaryGlow: "rgba(34,197,94,0.25)",
      secondaryGlow: "rgba(139,92,246,0.12)",
      actionGlow: "rgba(249,115,22,0.14)",
      gridGlow: "rgba(34,197,94,0.14)",
      fogGlow: "rgba(34,197,94,0.12)",
      vignette: "rgba(4,18,10,0.86)",
    },
    particles: {
      density: 34,
      speed: 1.12,
      drift: 1.18,
      opacity: 0.5,
    },
    backdrop: {
      gradientStyle: "diagonal",
      showGrid: true,
      showNoise: true,
      fogDensity: 0.16,
    },
    hud: {
      border: "rgba(34,197,94,0.22)",
      softBorder: "rgba(34,197,94,0.10)",
      cardGlow: "drop-shadow(0 0 18px rgba(34,197,94,.28))",
      activeGlow: "drop-shadow(0 0 28px rgba(34,197,94,.52))",
    },
  },

  asiaGaming: {
    id: "asiaGaming",
    label: "Asia Gaming",
    palette: {
      base: BASE,
      surface: SURFACE,
      primary: "#D946EF",
      secondary: "#8B5CF6",
      action: "#F97316",
      text: "#FAF5FF",
      mutedText: "#E9D5FF",
    },
    vfx: {
      primaryGlow: "rgba(217,70,239,0.28)",
      secondaryGlow: "rgba(139,92,246,0.22)",
      actionGlow: "rgba(249,115,22,0.22)",
      gridGlow: "rgba(217,70,239,0.15)",
      fogGlow: "rgba(217,70,239,0.14)",
      vignette: "rgba(18,8,24,0.84)",
    },
    particles: {
      density: 38,
      speed: 1.18,
      drift: 1.32,
      opacity: 0.58,
    },
    backdrop: {
      gradientStyle: "aurora",
      showGrid: true,
      showNoise: true,
      fogDensity: 0.18,
    },
    hud: {
      border: "rgba(217,70,239,0.22)",
      softBorder: "rgba(217,70,239,0.10)",
      cardGlow: "drop-shadow(0 0 20px rgba(217,70,239,.30))",
      activeGlow: "drop-shadow(0 0 32px rgba(249,115,22,.52))",
    },
  },

  studio: {
    id: "studio",
    label: "Studio",
    palette: {
      base: BASE,
      surface: SURFACE,
      primary: "#F8FAFC",
      secondary: "#8B5CF6",
      action: "#F97316",
      text: "#F8FAFC",
      mutedText: "#CBD5E1",
    },
    vfx: {
      primaryGlow: "rgba(248,250,252,0.12)",
      secondaryGlow: "rgba(139,92,246,0.16)",
      actionGlow: "rgba(249,115,22,0.20)",
      gridGlow: "rgba(248,250,252,0.08)",
      fogGlow: "rgba(139,92,246,0.10)",
      vignette: "rgba(11,10,15,0.88)",
    },
    particles: {
      density: 22,
      speed: 0.76,
      drift: 0.66,
      opacity: 0.42,
    },
    backdrop: {
      gradientStyle: "studio",
      showGrid: false,
      showNoise: true,
      fogDensity: 0.1,
    },
    hud: {
      border: "rgba(248,250,252,0.16)",
      softBorder: "rgba(139,92,246,0.10)",
      cardGlow: "drop-shadow(0 0 14px rgba(248,250,252,.12))",
      activeGlow: "drop-shadow(0 0 28px rgba(249,115,22,.44))",
    },
  },
};

export function getWorldThemeConfig(theme: WorldPortalTheme): WorldThemeConfig {
  return WORLD_THEME_MATRIX[theme];
}

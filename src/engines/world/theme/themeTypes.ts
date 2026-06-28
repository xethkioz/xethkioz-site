export const WORLD_PORTAL_THEMES = [
  "gaming",
  "scienceLab",
  "greenNode",
  "asiaGaming",
  "studio",
] as const;

export type WorldPortalTheme = (typeof WORLD_PORTAL_THEMES)[number];

export type WorldThemeEnvironment = {
  label: string;
  description: string;
};

export const DEFAULT_WORLD_THEME: WorldPortalTheme = "gaming";

export const WORLD_THEME_ENVIRONMENTS: Record<WorldPortalTheme, WorldThemeEnvironment> = {
  gaming: {
    label: "Gaming",
    description: "Base XETHKIOZ gaming ecosystem: violet neon, orange action and dark premium contrast.",
  },
  scienceLab: {
    label: "Science Lab",
    description: "Scientific disclosure environment: cyan focus, precise contrast and clean ambient depth.",
  },
  greenNode: {
    label: "Green Node",
    description: "Programming, Linux and cybersecurity environment: hacker green with deep cyberpunk atmosphere.",
  },
  asiaGaming: {
    label: "Asia Gaming",
    description: "Asian gaming portal: magenta, violet and energetic neon city atmosphere.",
  },
  studio: {
    label: "Studio",
    description: "Creator and production environment: refined neutral surfaces with orange/violet editorial accents.",
  },
};

export function isWorldPortalTheme(value: unknown): value is WorldPortalTheme {
  return typeof value === "string" && WORLD_PORTAL_THEMES.includes(value as WorldPortalTheme);
}

import type { WorldThemeConfig } from "./themeMatrix";

export type WorldThemeCssVariables = React.CSSProperties & {
  "--world-theme-base"?: string;
  "--world-theme-surface"?: string;
  "--world-theme-primary"?: string;
  "--world-theme-secondary"?: string;
  "--world-theme-action"?: string;
  "--world-theme-text"?: string;
  "--world-theme-muted-text"?: string;
  "--world-theme-primary-glow"?: string;
  "--world-theme-secondary-glow"?: string;
  "--world-theme-action-glow"?: string;
  "--world-theme-grid-glow"?: string;
  "--world-theme-fog-glow"?: string;
  "--world-theme-vignette"?: string;
  "--world-theme-hud-border"?: string;
  "--world-theme-hud-soft-border"?: string;
  "--world-theme-card-glow"?: string;
  "--world-theme-active-glow"?: string;
  "--world-theme-particle-density"?: number;
  "--world-theme-particle-speed"?: number;
  "--world-theme-particle-drift"?: number;
  "--world-theme-particle-opacity"?: number;
  "--world-theme-fog-density"?: number;
};

export function createWorldThemeCssVariables(config: WorldThemeConfig): WorldThemeCssVariables {
  return {
    "--world-theme-base": config.palette.base,
    "--world-theme-surface": config.palette.surface,
    "--world-theme-primary": config.palette.primary,
    "--world-theme-secondary": config.palette.secondary,
    "--world-theme-action": config.palette.action,
    "--world-theme-text": config.palette.text,
    "--world-theme-muted-text": config.palette.mutedText,
    "--world-theme-primary-glow": config.vfx.primaryGlow,
    "--world-theme-secondary-glow": config.vfx.secondaryGlow,
    "--world-theme-action-glow": config.vfx.actionGlow,
    "--world-theme-grid-glow": config.vfx.gridGlow,
    "--world-theme-fog-glow": config.vfx.fogGlow,
    "--world-theme-vignette": config.vfx.vignette,
    "--world-theme-hud-border": config.hud.border,
    "--world-theme-hud-soft-border": config.hud.softBorder,
    "--world-theme-card-glow": config.hud.cardGlow,
    "--world-theme-active-glow": config.hud.activeGlow,
    "--world-theme-particle-density": config.particles.density,
    "--world-theme-particle-speed": config.particles.speed,
    "--world-theme-particle-drift": config.particles.drift,
    "--world-theme-particle-opacity": config.particles.opacity,
    "--world-theme-fog-density": config.backdrop.fogDensity,
  };
}

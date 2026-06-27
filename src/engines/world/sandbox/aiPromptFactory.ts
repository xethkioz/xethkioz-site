import type { WorldState } from "../state";
import type { WorldPortalTheme } from "../theme";
import { getWorldThemeConfig } from "../theme";
import { getLightingProfile } from "../lighting";

export type AiVisualPromptKind =
  | "relicTexture"
  | "portalBackdrop"
  | "wispAura"
  | "hudFrame"
  | "shaderReference";

export type AiVisualPromptInput = {
  worldState: WorldState;
  theme: WorldPortalTheme;
  kind: AiVisualPromptKind;
  subject?: string;
};

export type AiVisualPromptResult = {
  title: string;
  prompt: string;
  negativePrompt: string;
  outputRules: readonly string[];
};

const KIND_LABELS: Record<AiVisualPromptKind, string> = {
  relicTexture: "Relic Texture",
  portalBackdrop: "Portal Backdrop",
  wispAura: "Wisp Aura",
  hudFrame: "HUD Frame",
  shaderReference: "Shader Reference",
};

const BASE_OUTPUT_RULES = [
  "No text rendered inside the image.",
  "No logos, no watermarks and no third-party brand marks.",
  "Use False Black #0B0A0F as dominant background anchor.",
  "Use #16141F for structural surfaces.",
  "Use theme primary glow as identity accent.",
  "Use #F97316 only for restrained action highlights.",
  "Final approved raster output must be optimized to .webp before production use.",
  "Final approved vector output must be simplified to .svg before production use.",
] as const;

export function createAiVisualPrompt(input: AiVisualPromptInput): AiVisualPromptResult {
  const themeConfig = getWorldThemeConfig(input.theme);
  const lighting = getLightingProfile(input.worldState);
  const subject = input.subject?.trim() || KIND_LABELS[input.kind];

  const prompt = [
    `Create a ${subject} for the XETHKIOZ Fusion Platform.`,
    `Visual category: ${KIND_LABELS[input.kind]}.`,
    `World state: ${input.worldState}. Lighting intent accent: ${lighting.accent}.`,
    `Portal theme: ${themeConfig.label}.`,
    `Dominant background must remain False Black #0B0A0F.`,
    `Structural surfaces must use #16141F with premium cyberpunk contrast.`,
    `Theme primary color: ${themeConfig.palette.primary}.`,
    `Secondary color: ${themeConfig.palette.secondary}.`,
    `Action accent: ${themeConfig.palette.action}, used minimally and only for active energy/focus.`,
    `Primary glow channel: ${themeConfig.vfx.primaryGlow}.`,
    `Action glow channel: ${lighting.actionGlow}.`,
    `Fog density should feel like ${lighting.fogDensity} and bloom blur like ${lighting.bloomBlur}px.`,
    "Composition must be clean, dark, cinematic, layered and game-interface ready.",
    "Avoid clutter. Avoid text. Avoid fake UI words. Avoid unreadable glyphs.",
    "The output must feel like a premium AAA cyberpunk interface asset, not a generic sci-fi wallpaper.",
  ].join(" ");

  const negativePrompt = [
    "text",
    "letters",
    "watermark",
    "logo",
    "third-party brand",
    "copyrighted game asset",
    "human face",
    "busy composition",
    "pure black flat background",
    "overexposed glow",
    "low contrast",
    "cartoon clutter",
    "fake readable UI labels",
  ].join(", ");

  return {
    title: `XETHKIOZ / ${themeConfig.label} / ${input.worldState} / ${KIND_LABELS[input.kind]}`,
    prompt,
    negativePrompt,
    outputRules: BASE_OUTPUT_RULES,
  };
}

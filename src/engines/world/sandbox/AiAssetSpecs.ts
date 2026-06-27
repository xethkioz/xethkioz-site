export type AiAssetChannel = "nanoBanana2" | "nanoBanana3" | "gemini31Pro" | "omni";

export type AiAssetFormat = "webp" | "svg";

export type AiAssetCategory =
  | "relicTexture"
  | "portalBackdrop"
  | "hudConcept"
  | "wispAura"
  | "shaderReference";

export type AiBrandColorToken = {
  name: string;
  hex: string;
  usage: string;
};

export type AiAssetSpec = {
  id: string;
  category: AiAssetCategory;
  channel: AiAssetChannel;
  preferredFormat: AiAssetFormat;
  outputPrefix: string;
  prompt: string;
  negativePrompt: string;
  brandTokens: readonly AiBrandColorToken[];
  exportRules: readonly string[];
};

export const XETHKIOZ_AI_BRAND_TOKENS = [
  {
    name: "False Black",
    hex: "#0B0A0F",
    usage: "Dominant 60% background anchor. Never replace it with pure black.",
  },
  {
    name: "Structural Surface",
    hex: "#16141F",
    usage: "30% panels, cards, deep interface surfaces and relic frames.",
  },
  {
    name: "Neon Violet",
    hex: "#8B5CF6",
    usage: "10% identity glow, secondary interactions, Wisp aura and premium cyberpunk accents.",
  },
  {
    name: "Electric Orange",
    hex: "#F97316",
    usage: "10% action focus, active state, portal charge and critical CTAs.",
  },
] as const satisfies readonly AiBrandColorToken[];

export const AI_ASSET_EXPORT_RULES = [
  "Generated images must be manually reviewed before production use.",
  "Final raster assets must be optimized to .webp before being placed in public/assets/.",
  "Vector interface elements must be simplified and exported as .svg.",
  "Production filenames must use explicit prefixes, e.g. ai_relic_bg.webp or ai_portal_grid.svg.",
  "Do not place raw AI outputs directly into src/ or public/assets/ without compression and review.",
  "Never include third-party logos, copyrighted UI marks or unrelated brands.",
] as const;

export const AI_ASSET_SPECS = {
  relicTextureVioletCore: {
    id: "relicTextureVioletCore",
    category: "relicTexture",
    channel: "nanoBanana3",
    preferredFormat: "webp",
    outputPrefix: "ai_relic_violet_core",
    prompt:
      "Create a premium cyberpunk relic background texture for XETHKIOZ. Use false black #0B0A0F as the dominant base, structural dark surface #16141F, subtle neon violet #8B5CF6 glow lines, and minimal electric orange #F97316 action sparks. High contrast, no text, no logos, no characters, clean layered depth, game UI artifact style.",
    negativePrompt:
      "No text, no watermark, no logos, no faces, no photoreal people, no copyrighted symbols, no clutter, no bright white background, no pure black flattening.",
    brandTokens: XETHKIOZ_AI_BRAND_TOKENS,
    exportRules: AI_ASSET_EXPORT_RULES,
  },

  portalBackdropGaming: {
    id: "portalBackdropGaming",
    category: "portalBackdrop",
    channel: "nanoBanana3",
    preferredFormat: "webp",
    outputPrefix: "ai_portal_gaming_backdrop",
    prompt:
      "Generate an atmospheric gaming portal backdrop texture for a dark premium React/Vite interface. Anchor the scene in #0B0A0F false black, add deep surface planes #16141F, violet neon mist #8B5CF6, and restrained electric orange portal energy #F97316. Cinematic depth, soft fog, no text, no logos, loop-friendly composition.",
    negativePrompt:
      "No UI text, no human figures, no brand logos, no weapons focus, no copyrighted game assets, no overexposed glow, no cartoon style.",
    brandTokens: XETHKIOZ_AI_BRAND_TOKENS,
    exportRules: AI_ASSET_EXPORT_RULES,
  },

  hudConceptStudio: {
    id: "hudConceptStudio",
    category: "hudConcept",
    channel: "gemini31Pro",
    preferredFormat: "svg",
    outputPrefix: "ai_hud_studio_frame",
    prompt:
      "Design a lightweight SVG concept for a XETHKIOZ creator studio HUD frame. Keep it minimal, premium, dark, with #16141F surfaces, #8B5CF6 thin borders, and #F97316 active micro indicators. No text. Must be suitable for conversion into reusable React/Tailwind components.",
    negativePrompt:
      "No raster noise, no heavy gradients, no text labels, no external logos, no overly complex paths.",
    brandTokens: XETHKIOZ_AI_BRAND_TOKENS,
    exportRules: AI_ASSET_EXPORT_RULES,
  },

  wispAuraReference: {
    id: "wispAuraReference",
    category: "wispAura",
    channel: "omni",
    preferredFormat: "webp",
    outputPrefix: "ai_wisp_aura_reference",
    prompt:
      "Create a soft transparent-looking aura reference for a floating AI Wisp entity. Use violet neon #8B5CF6 as identity glow with barely visible electric orange #F97316 core sparks. Premium cyberpunk, soft bloom, radial energy, no hard edges, no character body, no text.",
    negativePrompt:
      "No mascot face, no text, no hard icon outline, no logo, no full creature, no busy background.",
    brandTokens: XETHKIOZ_AI_BRAND_TOKENS,
    exportRules: AI_ASSET_EXPORT_RULES,
  },

  shaderReferenceAurora: {
    id: "shaderReferenceAurora",
    category: "shaderReference",
    channel: "gemini31Pro",
    preferredFormat: "webp",
    outputPrefix: "ai_shader_aurora_reference",
    prompt:
      "Create a reference image for a future WebGL aurora shader used in a premium dark interface. False black #0B0A0F base, violet #8B5CF6 light ribbons, slight orange #F97316 energy tips, smooth gradients, cinematic, no text, no identifiable objects.",
    negativePrompt:
      "No text, no logos, no real-world skyline, no characters, no excessive saturation, no noisy artifacts.",
    brandTokens: XETHKIOZ_AI_BRAND_TOKENS,
    exportRules: AI_ASSET_EXPORT_RULES,
  },
} as const satisfies Record<string, AiAssetSpec>;

export type AiAssetSpecId = keyof typeof AI_ASSET_SPECS;

export function getAiAssetSpec(id: AiAssetSpecId): AiAssetSpec {
  return AI_ASSET_SPECS[id];
}

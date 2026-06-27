export const AI_OPERATIONAL_MODEL_IDS = [
  "GEMINI_3_1_PRO",
  "GEMINI_OMNI",
  "NANO_BANANA_3",
] as const;

export type AiOperationalModelId = (typeof AI_OPERATIONAL_MODEL_IDS)[number];

export type AiOperationalCapability =
  | "architecture_audit"
  | "react_context_review"
  | "gpu_thread_optimization"
  | "physics_simulation"
  | "cinematic_interpolation"
  | "asset_generation"
  | "texture_export"
  | "brand_guardrails";

export type AiOperationalConfig = {
  id: AiOperationalModelId;
  label: string;
  purpose: string;
  sandboxOnly: true;
  capabilities: readonly AiOperationalCapability[];
  inputPolicy: readonly string[];
  outputPolicy: readonly string[];
};

export type AiOperationalRunRequest = {
  modelId: AiOperationalModelId;
  task: string;
  context?: string;
};

export type AiOperationalRunResult = {
  modelId: AiOperationalModelId;
  accepted: boolean;
  message: string;
};

export const AI_OPERATIONAL_CONFIGS = {
  GEMINI_3_1_PRO: {
    id: "GEMINI_3_1_PRO",
    label: "Gemini 3.1 Pro",
    purpose:
      "Architecture analysis, React context audits, state-orchestration review and 60 FPS GPU optimization guidance.",
    sandboxOnly: true,
    capabilities: [
      "architecture_audit",
      "react_context_review",
      "gpu_thread_optimization",
      "brand_guardrails",
    ],
    inputPolicy: [
      "Use only development context, architecture notes and local source excerpts.",
      "Never send secrets, Supabase keys, personal data or production credentials.",
      "Prefer summarized architecture context over raw repository dumps.",
    ],
    outputPolicy: [
      "Return implementation plans, review notes or patch suggestions.",
      "Do not generate production imports from sandbox modules.",
      "Flag unsafe coupling, hidden state mutations and GPU-hostile patterns.",
    ],
  },

  GEMINI_OMNI: {
    id: "GEMINI_OMNI",
    label: "Gemini Omni",
    purpose:
      "Physics simulation, cinematic matrix calculations, camera interpolation and motion-system experiments.",
    sandboxOnly: true,
    capabilities: [
      "physics_simulation",
      "cinematic_interpolation",
      "gpu_thread_optimization",
      "brand_guardrails",
    ],
    inputPolicy: [
      "Use sanitized motion parameters and non-sensitive visual-state metadata.",
      "Never pass user credentials or database payloads.",
      "Keep experiments reproducible with explicit seed values.",
    ],
    outputPolicy: [
      "Return math notes, matrix suggestions or isolated sandbox prototypes.",
      "Do not mutate stable Camera, Lighting or Theme engines directly.",
      "Promote only after build validation and profiling.",
    ],
  },

  NANO_BANANA_3: {
    id: "NANO_BANANA_3",
    label: "Nano Banana 3",
    purpose:
      "Controlled aesthetic asset generation: relic textures, digital-noise overlays, portal backdrops and Wisp aura references.",
    sandboxOnly: true,
    capabilities: [
      "asset_generation",
      "texture_export",
      "brand_guardrails",
    ],
    inputPolicy: [
      "Use XETHKIOZ color tokens and prompt factory outputs.",
      "Never request copyrighted logos, third-party UI marks or external game assets.",
      "Avoid text rendering inside image outputs unless explicitly approved.",
    ],
    outputPolicy: [
      "Raw outputs must be manually reviewed.",
      "Final raster assets must be compressed to .webp.",
      "Final vector assets must be simplified to .svg.",
      "Approved files must be manually placed in public/assets/ with ai_ prefix.",
    ],
  },
} as const satisfies Record<AiOperationalModelId, AiOperationalConfig>;

export function getAiOperationalConfig(modelId: AiOperationalModelId): AiOperationalConfig {
  return AI_OPERATIONAL_CONFIGS[modelId];
}

/**
 * Sandbox-only execution stub.
 *
 * This does not call external AI APIs. It exists to define a safe, typed
 * operational contract for future local tooling.
 */
export function runAiOperationalStub(
  request: AiOperationalRunRequest
): AiOperationalRunResult {
  const config = getAiOperationalConfig(request.modelId);
  const normalizedTask = request.task.trim();

  if (!normalizedTask) {
    return {
      modelId: request.modelId,
      accepted: false,
      message: `${config.label}: rejected empty sandbox task.`,
    };
  }

  return {
    modelId: request.modelId,
    accepted: true,
    message: `${config.label}: sandbox task accepted. No external model call was executed.`,
  };
}

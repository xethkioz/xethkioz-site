export type FusionTone = 'gaming' | 'science' | 'fun' | 'green'

export const fusionToneClass: Record<FusionTone, string> = {
  gaming: 'fusion-tone-gaming',
  science: 'fusion-tone-science',
  fun: 'fusion-tone-fun',
  green: 'fusion-tone-green',
}

export const fusionToneLabel: Record<FusionTone, string> = {
  gaming: 'Gaming Portal',
  science: 'Science Lab',
  fun: 'Fun Portal',
  green: 'Green Node',
}

export const designGuardrails = [
  'Design components must remain functional HTML/React, never a flattened image UI.',
  'Portal visuals must be reusable and driven by data, not page-specific duplicated markup.',
  'Green is reserved for Wisp/Green Node; core brand remains black, violet neon and electric orange.',
  'Every public portal must keep global controls available through App/Header.',
  'Visual upgrades must preserve build stability and mobile readability.',
] as const

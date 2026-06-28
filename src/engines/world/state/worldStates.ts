export const WORLD_STATES = [
  "idle",
  "searching",
  "talking",
  "meditation",
  "combat",
  "alert",
  "loading",
  "portal",
  "sleeping",
] as const;

export type WorldState = (typeof WORLD_STATES)[number];

export type WorldStateVisualIntent =
  | "neutral"
  | "focus"
  | "dialogue"
  | "calm"
  | "action"
  | "warning"
  | "transition"
  | "rest";

export type WorldStateDefinition = {
  state: WorldState;
  label: string;
  visualIntent: WorldStateVisualIntent;
  accent: "violet" | "orange" | "cyan" | "green" | "red" | "neutral";
  description: string;
};

export const WORLD_STATE_DEFINITIONS: Record<WorldState, WorldStateDefinition> = {
  idle: {
    state: "idle",
    label: "Idle",
    visualIntent: "neutral",
    accent: "violet",
    description: "Default living world state with subtle ambient motion.",
  },
  searching: {
    state: "searching",
    label: "Searching",
    visualIntent: "focus",
    accent: "cyan",
    description: "Focused analysis state for scan, search or discovery flows.",
  },
  talking: {
    state: "talking",
    label: "Talking",
    visualIntent: "dialogue",
    accent: "violet",
    description: "Dialogue-oriented state for Wisp or avatar communication.",
  },
  meditation: {
    state: "meditation",
    label: "Meditation",
    visualIntent: "calm",
    accent: "violet",
    description: "Deep calm state with reduced movement and premium neon depth.",
  },
  combat: {
    state: "combat",
    label: "Combat",
    visualIntent: "action",
    accent: "orange",
    description: "High-action state for dynamic, intense or competitive UI moments.",
  },
  alert: {
    state: "alert",
    label: "Alert",
    visualIntent: "warning",
    accent: "red",
    description: "Warning state for urgent visual feedback.",
  },
  loading: {
    state: "loading",
    label: "Loading",
    visualIntent: "transition",
    accent: "cyan",
    description: "Loading or async transition state.",
  },
  portal: {
    state: "portal",
    label: "Portal",
    visualIntent: "transition",
    accent: "orange",
    description: "Portal transition state between worlds or specialized engines.",
  },
  sleeping: {
    state: "sleeping",
    label: "Sleeping",
    visualIntent: "rest",
    accent: "neutral",
    description: "Low-energy rest state with minimal particles and dimmed light.",
  },
};

export const DEFAULT_WORLD_STATE: WorldState = "idle";

export function isWorldState(value: unknown): value is WorldState {
  return typeof value === "string" && WORLD_STATES.includes(value as WorldState);
}

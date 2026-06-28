import type { WorldState } from "./worldStates";

export const WORLD_EVENTS = [
  "RETURN_TO_IDLE",
  "START_SEARCH",
  "START_TALKING",
  "ENTER_MEDITATION",
  "ENGAGE_COMBAT",
  "RAISE_ALERT",
  "START_LOADING",
  "TRIGGER_PORTAL",
  "ENTER_SLEEP",
  "WAKE_UP",
] as const;

export type WorldEventType = (typeof WORLD_EVENTS)[number];

export type WorldEvent =
  | { type: "RETURN_TO_IDLE"; reason?: string }
  | { type: "START_SEARCH"; query?: string }
  | { type: "START_TALKING"; speaker?: "wisp" | "avatar" | "system" }
  | { type: "ENTER_MEDITATION"; depth?: "light" | "deep" }
  | { type: "ENGAGE_COMBAT"; intensity?: "low" | "medium" | "high" }
  | { type: "RAISE_ALERT"; level?: "info" | "warning" | "critical" }
  | { type: "START_LOADING"; source?: string }
  | { type: "TRIGGER_PORTAL"; target?: string }
  | { type: "ENTER_SLEEP"; reason?: string }
  | { type: "WAKE_UP"; reason?: string };

export const WORLD_TRANSITIONS: Record<WorldState, readonly WorldEventType[]> = {
  idle: [
    "START_SEARCH",
    "START_TALKING",
    "ENTER_MEDITATION",
    "ENGAGE_COMBAT",
    "RAISE_ALERT",
    "START_LOADING",
    "TRIGGER_PORTAL",
    "ENTER_SLEEP",
  ],
  searching: ["RETURN_TO_IDLE", "START_TALKING", "RAISE_ALERT", "START_LOADING", "TRIGGER_PORTAL"],
  talking: ["RETURN_TO_IDLE", "START_SEARCH", "ENTER_MEDITATION", "RAISE_ALERT", "TRIGGER_PORTAL"],
  meditation: ["RETURN_TO_IDLE", "START_TALKING", "RAISE_ALERT", "ENTER_SLEEP"],
  combat: ["RETURN_TO_IDLE", "RAISE_ALERT", "START_LOADING", "TRIGGER_PORTAL"],
  alert: ["RETURN_TO_IDLE", "ENGAGE_COMBAT", "START_LOADING", "TRIGGER_PORTAL"],
  loading: ["RETURN_TO_IDLE", "START_SEARCH", "START_TALKING", "TRIGGER_PORTAL", "RAISE_ALERT"],
  portal: ["RETURN_TO_IDLE", "START_LOADING", "START_SEARCH", "START_TALKING"],
  sleeping: ["WAKE_UP", "RAISE_ALERT"],
};

export const WORLD_EVENT_TARGET_STATE: Record<WorldEventType, WorldState> = {
  RETURN_TO_IDLE: "idle",
  START_SEARCH: "searching",
  START_TALKING: "talking",
  ENTER_MEDITATION: "meditation",
  ENGAGE_COMBAT: "combat",
  RAISE_ALERT: "alert",
  START_LOADING: "loading",
  TRIGGER_PORTAL: "portal",
  ENTER_SLEEP: "sleeping",
  WAKE_UP: "idle",
};

export function canTransition(currentState: WorldState, eventType: WorldEventType): boolean {
  return WORLD_TRANSITIONS[currentState].includes(eventType);
}

import type { WorldState } from "../state";
import type { LightingProfile } from "../lighting";
import type { WorldPortalTheme, WorldThemeConfig } from "../theme";
import type { WorldOrchestratorPriority, WorldOrchestratorSource } from "./worldOrchestratorTypes";

export type WorldOrchestratorEvent =
  | {
      type: "ON_WORLD_STATE_CHANGE";
      source: WorldOrchestratorSource;
      state: WorldState;
      priority?: WorldOrchestratorPriority;
    }
  | {
      type: "ON_PORTAL_CHANGE";
      source: WorldOrchestratorSource;
      theme: WorldPortalTheme;
      portalTarget?: string;
      priority?: WorldOrchestratorPriority;
    }
  | {
      type: "ON_LIGHTING_CHANGE";
      source: WorldOrchestratorSource;
      profile: LightingProfile;
      priority?: WorldOrchestratorPriority;
    }
  | {
      type: "ON_THEME_CONFIG_CHANGE";
      source: WorldOrchestratorSource;
      config: WorldThemeConfig;
      priority?: WorldOrchestratorPriority;
    }
  | {
      type: "ON_INTERACTION_ENGAGED";
      source: WorldOrchestratorSource;
      engaged: boolean;
      priority?: WorldOrchestratorPriority;
    }
  | {
      type: "ON_CRITICAL_ALERT";
      source: WorldOrchestratorSource;
      level: "info" | "warning" | "critical";
      priority?: WorldOrchestratorPriority;
    }
  | {
      type: "ON_WISP_SURGE";
      source: WorldOrchestratorSource;
      active: boolean;
      priority?: WorldOrchestratorPriority;
    }
  | {
      type: "RESET_WORLD_ORCHESTRATOR";
      source: WorldOrchestratorSource;
      priority?: WorldOrchestratorPriority;
    };

export const WORLD_ORCHESTRATOR_EVENTS = [
  "ON_WORLD_STATE_CHANGE",
  "ON_PORTAL_CHANGE",
  "ON_LIGHTING_CHANGE",
  "ON_THEME_CONFIG_CHANGE",
  "ON_INTERACTION_ENGAGED",
  "ON_CRITICAL_ALERT",
  "ON_WISP_SURGE",
  "RESET_WORLD_ORCHESTRATOR",
] as const;

export type WorldOrchestratorEventType = (typeof WORLD_ORCHESTRATOR_EVENTS)[number];

export function getEventPriority(
  event: WorldOrchestratorEvent
): WorldOrchestratorPriority {
  return event.priority ?? "normal";
}

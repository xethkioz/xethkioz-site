import type { WorldState } from "../state";
import type { LightingProfile } from "../lighting";
import type { WorldPortalTheme, WorldThemeConfig } from "../theme";

export type WorldOrchestratorSource =
  | "worldState"
  | "lighting"
  | "theme"
  | "camera"
  | "wisp"
  | "media"
  | "sandbox"
  | "system";

export type WorldOrchestratorPriority = "low" | "normal" | "high" | "critical";

export type WorldOrchestratorSnapshot = {
  worldState: WorldState;
  theme: WorldPortalTheme;
  lightingProfile: LightingProfile | null;
  themeConfig: WorldThemeConfig | null;
  interactionEngaged: boolean;
  portalTarget: string | null;
  alertLevel: "none" | "info" | "warning" | "critical";
  wispSurge: boolean;
  lastSource: WorldOrchestratorSource | null;
  lastEvent: string | null;
  priority: WorldOrchestratorPriority;
  revision: number;
  updatedAt: number;
};

export type WorldOrchestratorCommand =
  | {
      target: "lighting";
      action: "SET_ALERT_LIGHT" | "SET_PORTAL_LIGHT" | "SET_IDLE_LIGHT";
      priority: WorldOrchestratorPriority;
    }
  | {
      target: "theme";
      action: "APPLY_THEME";
      theme: WorldPortalTheme;
      priority: WorldOrchestratorPriority;
    }
  | {
      target: "worldState";
      action: "REQUEST_STATE";
      state: WorldState;
      priority: WorldOrchestratorPriority;
    }
  | {
      target: "camera";
      action: "FOCUS" | "SHAKE" | "RESET";
      intensity: number;
      priority: WorldOrchestratorPriority;
    }
  | {
      target: "wisp";
      action: "ACK_SURGE" | "CALM";
      priority: WorldOrchestratorPriority;
    };

export type WorldOrchestratorResult = {
  snapshot: WorldOrchestratorSnapshot;
  commands: readonly WorldOrchestratorCommand[];
  accepted: boolean;
  reason?: "INVALID_EVENT" | "NOOP";
};

import type { WorldState } from "../state";
import type { LightingProfile } from "../lighting";
import type { WorldPortalTheme, WorldThemeConfig } from "../theme";
import type {
  WorldOrchestratorCommand,
  WorldOrchestratorSource,
} from "../orchestrator";

export const WORLD_RUNTIME_EVENT_TYPES = [
  "RUNTIME_READY",
  "RUNTIME_DISPOSED",
  "STATE_CHANGED",
  "THEME_CHANGED",
  "THEME_CONFIG_CHANGED",
  "LIGHTING_SHIFTED",
  "CAMERA_POINTER_MOVED",
  "CAMERA_POINTER_RESET",
  "ORCHESTRATOR_COMMANDS",
  "WISP_SURGE",
  "CRITICAL_ALERT",
] as const;

export type WorldRuntimeEventType = (typeof WORLD_RUNTIME_EVENT_TYPES)[number];

export type WorldRuntimeEventMap = {
  RUNTIME_READY: {
    mountedAt: number;
    subsystems: readonly WorldRuntimeSubsystem[];
  };

  RUNTIME_DISPOSED: {
    disposedAt: number;
  };

  STATE_CHANGED: {
    state: WorldState;
    source: WorldOrchestratorSource;
  };

  THEME_CHANGED: {
    theme: WorldPortalTheme;
    source: WorldOrchestratorSource;
  };

  THEME_CONFIG_CHANGED: {
    config: WorldThemeConfig;
    source: WorldOrchestratorSource;
  };

  LIGHTING_SHIFTED: {
    profile: LightingProfile;
    source: WorldOrchestratorSource;
  };

  CAMERA_POINTER_MOVED: {
    x: number;
    y: number;
    source: WorldOrchestratorSource;
  };

  CAMERA_POINTER_RESET: {
    source: WorldOrchestratorSource;
  };

  ORCHESTRATOR_COMMANDS: {
    commands: readonly WorldOrchestratorCommand[];
    source: WorldOrchestratorSource;
  };

  WISP_SURGE: {
    active: boolean;
    source: WorldOrchestratorSource;
  };

  CRITICAL_ALERT: {
    level: "info" | "warning" | "critical";
    source: WorldOrchestratorSource;
  };
};

export type WorldRuntimeEvent<TType extends WorldRuntimeEventType = WorldRuntimeEventType> = {
  type: TType;
  payload: WorldRuntimeEventMap[TType];
  timestamp: number;
  id: string;
};

export type WorldRuntimeEventHandler<TType extends WorldRuntimeEventType> = (
  event: WorldRuntimeEvent<TType>
) => void;

export const WORLD_RUNTIME_SUBSYSTEMS = [
  "state",
  "theme",
  "lighting",
  "camera",
  "orchestrator",
] as const;

export type WorldRuntimeSubsystem = (typeof WORLD_RUNTIME_SUBSYSTEMS)[number];

export type WorldRuntimeStatus = "booting" | "ready" | "disposed";

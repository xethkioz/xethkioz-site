import type { WorldState } from "../state";
import type { WorldPortalTheme } from "../theme";
import type {
  WorldOrchestratorPriority,
  WorldOrchestratorSnapshot,
} from "./worldOrchestratorTypes";

export type WorldOrchestratorVisualSlice = {
  worldState: WorldState;
  theme: WorldPortalTheme;
  alertLevel: WorldOrchestratorSnapshot["alertLevel"];
  wispSurge: boolean;
  interactionEngaged: boolean;
};

export type WorldOrchestratorEnvironmentSlice = {
  theme: WorldPortalTheme;
  portalTarget: string | null;
  priority: WorldOrchestratorPriority;
};

export type WorldOrchestratorStatusSlice = {
  revision: number;
  lastSource: WorldOrchestratorSnapshot["lastSource"];
  lastEvent: string | null;
  updatedAt: number;
};

export function selectVisualSlice(
  snapshot: WorldOrchestratorSnapshot
): WorldOrchestratorVisualSlice {
  return {
    worldState: snapshot.worldState,
    theme: snapshot.theme,
    alertLevel: snapshot.alertLevel,
    wispSurge: snapshot.wispSurge,
    interactionEngaged: snapshot.interactionEngaged,
  };
}

export function selectEnvironmentSlice(
  snapshot: WorldOrchestratorSnapshot
): WorldOrchestratorEnvironmentSlice {
  return {
    theme: snapshot.theme,
    portalTarget: snapshot.portalTarget,
    priority: snapshot.priority,
  };
}

export function selectStatusSlice(
  snapshot: WorldOrchestratorSnapshot
): WorldOrchestratorStatusSlice {
  return {
    revision: snapshot.revision,
    lastSource: snapshot.lastSource,
    lastEvent: snapshot.lastEvent,
    updatedAt: snapshot.updatedAt,
  };
}

export function isCriticalVisualState(snapshot: WorldOrchestratorSnapshot): boolean {
  return snapshot.alertLevel === "critical" || snapshot.wispSurge || snapshot.worldState === "combat";
}

export function shouldDimWorld(snapshot: WorldOrchestratorSnapshot): boolean {
  return snapshot.worldState === "sleeping" && snapshot.alertLevel === "none";
}

import { DEFAULT_WORLD_STATE } from "../state";
import { DEFAULT_WORLD_THEME } from "../theme";
import { getEventPriority, type WorldOrchestratorEvent } from "./worldOrchestratorEvents";
import type {
  WorldOrchestratorCommand,
  WorldOrchestratorResult,
  WorldOrchestratorSnapshot,
} from "./worldOrchestratorTypes";

export function createInitialWorldOrchestratorSnapshot(): WorldOrchestratorSnapshot {
  return {
    worldState: DEFAULT_WORLD_STATE,
    theme: DEFAULT_WORLD_THEME,
    lightingProfile: null,
    themeConfig: null,
    interactionEngaged: false,
    portalTarget: null,
    alertLevel: "none",
    wispSurge: false,
    lastSource: null,
    lastEvent: null,
    priority: "normal",
    revision: 0,
    updatedAt: Date.now(),
  };
}

function withMeta(
  snapshot: WorldOrchestratorSnapshot,
  event: WorldOrchestratorEvent
): WorldOrchestratorSnapshot {
  return {
    ...snapshot,
    lastSource: event.source,
    lastEvent: event.type,
    priority: getEventPriority(event),
    revision: snapshot.revision + 1,
    updatedAt: Date.now(),
  };
}

function deriveCommands(
  snapshot: WorldOrchestratorSnapshot,
  event: WorldOrchestratorEvent
): WorldOrchestratorCommand[] {
  if (event.type === "ON_WISP_SURGE" && event.active) {
    return [
      {
        target: "lighting",
        action: "SET_ALERT_LIGHT",
        priority: "critical",
      },
      {
        target: "camera",
        action: "SHAKE",
        intensity: 0.28,
        priority: "high",
      },
      {
        target: "worldState",
        action: "REQUEST_STATE",
        state: "alert",
        priority: "critical",
      },
    ];
  }

  if (event.type === "ON_CRITICAL_ALERT") {
    return [
      {
        target: "lighting",
        action: event.level === "critical" ? "SET_ALERT_LIGHT" : "SET_IDLE_LIGHT",
        priority: event.level === "critical" ? "critical" : "high",
      },
      {
        target: "camera",
        action: event.level === "critical" ? "SHAKE" : "FOCUS",
        intensity: event.level === "critical" ? 0.34 : 0.12,
        priority: event.level === "critical" ? "critical" : "normal",
      },
    ];
  }

  if (event.type === "ON_PORTAL_CHANGE") {
    return [
      {
        target: "theme",
        action: "APPLY_THEME",
        theme: event.theme,
        priority: getEventPriority(event),
      },
      {
        target: "lighting",
        action: "SET_PORTAL_LIGHT",
        priority: "high",
      },
      {
        target: "worldState",
        action: "REQUEST_STATE",
        state: "portal",
        priority: "high",
      },
    ];
  }

  if (event.type === "ON_WORLD_STATE_CHANGE" && event.state === "idle" && snapshot.alertLevel === "none") {
    return [
      {
        target: "lighting",
        action: "SET_IDLE_LIGHT",
        priority: "normal",
      },
      {
        target: "camera",
        action: "RESET",
        intensity: 0,
        priority: "normal",
      },
    ];
  }

  return [];
}

/**
 * Pure immutable mediator reducer.
 *
 * It receives signals from engines and emits orchestration commands.
 * It does not import UI, CSS, providers, Supabase or ProfileEngine.
 */
export function reduceWorldOrchestrator(
  snapshot: WorldOrchestratorSnapshot,
  event: WorldOrchestratorEvent
): WorldOrchestratorResult {
  if (event.type === "RESET_WORLD_ORCHESTRATOR") {
    const nextSnapshot = withMeta(createInitialWorldOrchestratorSnapshot(), event);

    return {
      snapshot: nextSnapshot,
      commands: [],
      accepted: true,
    };
  }

  let nextSnapshot: WorldOrchestratorSnapshot = snapshot;

  switch (event.type) {
    case "ON_WORLD_STATE_CHANGE":
      nextSnapshot = {
        ...snapshot,
        worldState: event.state,
      };
      break;

    case "ON_PORTAL_CHANGE":
      nextSnapshot = {
        ...snapshot,
        theme: event.theme,
        portalTarget: event.portalTarget ?? null,
      };
      break;

    case "ON_LIGHTING_CHANGE":
      nextSnapshot = {
        ...snapshot,
        lightingProfile: event.profile,
      };
      break;

    case "ON_THEME_CONFIG_CHANGE":
      nextSnapshot = {
        ...snapshot,
        themeConfig: event.config,
        theme: event.config.id,
      };
      break;

    case "ON_INTERACTION_ENGAGED":
      nextSnapshot = {
        ...snapshot,
        interactionEngaged: event.engaged,
      };
      break;

    case "ON_CRITICAL_ALERT":
      nextSnapshot = {
        ...snapshot,
        alertLevel: event.level,
        worldState: event.level === "critical" ? "alert" : snapshot.worldState,
      };
      break;

    case "ON_WISP_SURGE":
      nextSnapshot = {
        ...snapshot,
        wispSurge: event.active,
        alertLevel: event.active ? "critical" : snapshot.alertLevel,
        worldState: event.active ? "alert" : snapshot.worldState,
      };
      break;

    default:
      return {
        snapshot,
        commands: [],
        accepted: false,
        reason: "INVALID_EVENT",
      };
  }

  const finalizedSnapshot = withMeta(nextSnapshot, event);
  const commands = deriveCommands(finalizedSnapshot, event);

  return {
    snapshot: finalizedSnapshot,
    commands,
    accepted: true,
  };
}

export class WorldOrchestrator {
  private snapshot: WorldOrchestratorSnapshot;

  constructor(initialSnapshot: WorldOrchestratorSnapshot = createInitialWorldOrchestratorSnapshot()) {
    this.snapshot = initialSnapshot;
  }

  getSnapshot(): WorldOrchestratorSnapshot {
    return this.snapshot;
  }

  send(event: WorldOrchestratorEvent): WorldOrchestratorResult {
    const result = reduceWorldOrchestrator(this.snapshot, event);

    if (result.accepted) {
      this.snapshot = result.snapshot;
    }

    return result;
  }

  reset(): WorldOrchestratorSnapshot {
    this.snapshot = createInitialWorldOrchestratorSnapshot();
    return this.snapshot;
  }
}

import {
  DEFAULT_WORLD_STATE,
  WORLD_STATE_DEFINITIONS,
  type WorldState,
  type WorldStateDefinition,
} from "./worldStates";
import {
  canTransition,
  WORLD_EVENT_TARGET_STATE,
  type WorldEvent,
  type WorldEventType,
} from "./worldEvents";

export type WorldStateSnapshot = {
  current: WorldState;
  previous: WorldState | null;
  event: WorldEventType | null;
  transitionCount: number;
  updatedAt: number;
};

export type WorldStateReducerResult = {
  snapshot: WorldStateSnapshot;
  accepted: boolean;
  reason?: "INVALID_TRANSITION";
};

export const createInitialWorldStateSnapshot = (
  initialState: WorldState = DEFAULT_WORLD_STATE
): WorldStateSnapshot => ({
  current: initialState,
  previous: null,
  event: null,
  transitionCount: 0,
  updatedAt: Date.now(),
});

export function getWorldStateDefinition(state: WorldState): WorldStateDefinition {
  return WORLD_STATE_DEFINITIONS[state];
}

/**
 * Pure deterministic FSM reducer.
 *
 * It does not read from storage, Supabase, ProfileEngine or external services.
 */
export function reduceWorldState(
  snapshot: WorldStateSnapshot,
  event: WorldEvent
): WorldStateReducerResult {
  if (!canTransition(snapshot.current, event.type)) {
    return {
      snapshot,
      accepted: false,
      reason: "INVALID_TRANSITION",
    };
  }

  const nextState = WORLD_EVENT_TARGET_STATE[event.type];

  return {
    snapshot: {
      current: nextState,
      previous: snapshot.current,
      event: event.type,
      transitionCount: snapshot.transitionCount + 1,
      updatedAt: Date.now(),
    },
    accepted: true,
  };
}

export class WorldStateEngine {
  private snapshot: WorldStateSnapshot;

  constructor(initialState: WorldState = DEFAULT_WORLD_STATE) {
    this.snapshot = createInitialWorldStateSnapshot(initialState);
  }

  getSnapshot(): WorldStateSnapshot {
    return this.snapshot;
  }

  getDefinition(): WorldStateDefinition {
    return getWorldStateDefinition(this.snapshot.current);
  }

  send(event: WorldEvent): WorldStateReducerResult {
    const result = reduceWorldState(this.snapshot, event);

    if (result.accepted) {
      this.snapshot = result.snapshot;
    }

    return result;
  }

  can(eventType: WorldEventType): boolean {
    return canTransition(this.snapshot.current, eventType);
  }

  reset(): WorldStateSnapshot {
    this.snapshot = createInitialWorldStateSnapshot();
    return this.snapshot;
  }
}

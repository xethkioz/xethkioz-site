import React, {
  createContext,
  memo,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import {
  createInitialWorldStateSnapshot,
  getWorldStateDefinition,
  reduceWorldState,
  type WorldStateSnapshot,
} from "./WorldStateEngine";
import { DEFAULT_WORLD_STATE, type WorldState, type WorldStateDefinition } from "./worldStates";
import { canTransition, type WorldEvent, type WorldEventType } from "./worldEvents";

export type WorldStateContextValue = {
  snapshot: WorldStateSnapshot;
  current: WorldState;
  definition: WorldStateDefinition;
  send: (event: WorldEvent) => boolean;
  can: (eventType: WorldEventType) => boolean;
  reset: () => void;
};

type WorldStateProviderProps = {
  children: ReactNode;
  initialState?: WorldState;
};

type InternalAction =
  | { type: "SEND"; event: WorldEvent }
  | { type: "RESET"; initialState?: WorldState };

function worldStateReactReducer(
  snapshot: WorldStateSnapshot,
  action: InternalAction
): WorldStateSnapshot {
  if (action.type === "RESET") {
    return createInitialWorldStateSnapshot(action.initialState ?? DEFAULT_WORLD_STATE);
  }

  const result = reduceWorldState(snapshot, action.event);
  return result.accepted ? result.snapshot : snapshot;
}

const WorldStateContext = createContext<WorldStateContextValue | null>(null);

function WorldStateProviderComponent({
  children,
  initialState = DEFAULT_WORLD_STATE,
}: WorldStateProviderProps) {
  const [snapshot, dispatch] = useReducer(
    worldStateReactReducer,
    initialState,
    createInitialWorldStateSnapshot
  );

  const send = useCallback(
    (event: WorldEvent) => {
      const accepted = canTransition(snapshot.current, event.type);

      if (accepted) {
        dispatch({ type: "SEND", event });
      }

      return accepted;
    },
    [snapshot.current]
  );

  const reset = useCallback(() => {
    dispatch({ type: "RESET", initialState });
  }, [initialState]);

  const can = useCallback(
    (eventType: WorldEventType) => canTransition(snapshot.current, eventType),
    [snapshot.current]
  );

  const definition = useMemo(
    () => getWorldStateDefinition(snapshot.current),
    [snapshot.current]
  );

  const value = useMemo<WorldStateContextValue>(
    () => ({
      snapshot,
      current: snapshot.current,
      definition,
      send,
      can,
      reset,
    }),
    [snapshot, definition, send, can, reset]
  );

  return <WorldStateContext.Provider value={value}>{children}</WorldStateContext.Provider>;
}

export const WorldStateProvider = memo(WorldStateProviderComponent);
WorldStateProvider.displayName = "WorldStateProvider";

export function useWorldState(): WorldStateContextValue {
  const context = useContext(WorldStateContext);

  if (!context) {
    throw new Error("useWorldState must be used within a WorldStateProvider.");
  }

  return context;
}

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
  createInitialWorldOrchestratorSnapshot,
  reduceWorldOrchestrator,
} from "./WorldOrchestrator";
import type { WorldOrchestratorEvent } from "./worldOrchestratorEvents";
import {
  selectEnvironmentSlice,
  selectStatusSlice,
  selectVisualSlice,
  type WorldOrchestratorEnvironmentSlice,
  type WorldOrchestratorStatusSlice,
  type WorldOrchestratorVisualSlice,
} from "./worldOrchestratorSelectors";
import type {
  WorldOrchestratorCommand,
  WorldOrchestratorSnapshot,
} from "./worldOrchestratorTypes";

type WorldOrchestratorProviderProps = {
  children: ReactNode;
};

type WorldOrchestratorReducerState = {
  snapshot: WorldOrchestratorSnapshot;
  commands: readonly WorldOrchestratorCommand[];
};

type WorldOrchestratorReducerAction =
  | { type: "SEND"; event: WorldOrchestratorEvent }
  | { type: "RESET" };

export type WorldOrchestratorContextValue = {
  snapshot: WorldOrchestratorSnapshot;
  commands: readonly WorldOrchestratorCommand[];
  visual: WorldOrchestratorVisualSlice;
  environment: WorldOrchestratorEnvironmentSlice;
  status: WorldOrchestratorStatusSlice;
  send: (event: WorldOrchestratorEvent) => readonly WorldOrchestratorCommand[];
  reset: () => void;
};

function createInitialReducerState(): WorldOrchestratorReducerState {
  return {
    snapshot: createInitialWorldOrchestratorSnapshot(),
    commands: [],
  };
}

function reducer(
  state: WorldOrchestratorReducerState,
  action: WorldOrchestratorReducerAction
): WorldOrchestratorReducerState {
  if (action.type === "RESET") {
    return createInitialReducerState();
  }

  const result = reduceWorldOrchestrator(state.snapshot, action.event);

  if (!result.accepted) {
    return state;
  }

  return {
    snapshot: result.snapshot,
    commands: result.commands,
  };
}

const WorldOrchestratorContext = createContext<WorldOrchestratorContextValue | null>(null);

function WorldOrchestratorProviderComponent({ children }: WorldOrchestratorProviderProps) {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialReducerState);

  const send = useCallback((event: WorldOrchestratorEvent) => {
    const result = reduceWorldOrchestrator(state.snapshot, event);

    if (result.accepted) {
      dispatch({ type: "SEND", event });
      return result.commands;
    }

    return [];
  }, [state.snapshot]);

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  const visual = useMemo(() => selectVisualSlice(state.snapshot), [state.snapshot]);
  const environment = useMemo(() => selectEnvironmentSlice(state.snapshot), [state.snapshot]);
  const status = useMemo(() => selectStatusSlice(state.snapshot), [state.snapshot]);

  const value = useMemo<WorldOrchestratorContextValue>(
    () => ({
      snapshot: state.snapshot,
      commands: state.commands,
      visual,
      environment,
      status,
      send,
      reset,
    }),
    [state.snapshot, state.commands, visual, environment, status, send, reset]
  );

  return (
    <WorldOrchestratorContext.Provider value={value}>
      {children}
    </WorldOrchestratorContext.Provider>
  );
}

export const WorldOrchestratorProvider = memo(WorldOrchestratorProviderComponent);
WorldOrchestratorProvider.displayName = "WorldOrchestratorProvider";

export function useWorldOrchestrator(): WorldOrchestratorContextValue {
  const context = useContext(WorldOrchestratorContext);

  if (!context) {
    throw new Error("useWorldOrchestrator must be used within a WorldOrchestratorProvider.");
  }

  return context;
}

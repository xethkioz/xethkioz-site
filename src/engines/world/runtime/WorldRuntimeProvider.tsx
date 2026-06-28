import React, {
  createContext,
  memo,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { createWorldEventBus, type WorldEventBus } from "./worldEventBus";
import {
  WORLD_RUNTIME_SUBSYSTEMS,
  type WorldRuntimeStatus,
} from "./worldRuntimeEvents";
import type {
  WorldRuntimeController,
  WorldRuntimeSnapshot,
} from "./worldRuntimeTypes";

type WorldRuntimeProviderProps = {
  children: ReactNode;
};

type RuntimeMutableState = {
  status: WorldRuntimeStatus;
  mountedAt: number | null;
  disposedAt: number | null;
};

const WorldRuntimeContext = createContext<WorldRuntimeController | null>(null);

function createSnapshot(
  state: RuntimeMutableState,
  bus: WorldEventBus
): WorldRuntimeSnapshot {
  return {
    status: state.status,
    mountedAt: state.mountedAt,
    disposedAt: state.disposedAt,
    subsystems: WORLD_RUNTIME_SUBSYSTEMS,
    bus: bus.getSnapshot(),
  };
}

/**
 * WorldRuntimeProvider
 *
 * Master runtime boundary for Alpha 3.2.
 * It owns the Event Bus and initializes the runtime after React mounts.
 * It does not mutate individual engine internals.
 */
function WorldRuntimeProviderComponent({ children }: WorldRuntimeProviderProps) {
  const busRef = useRef<WorldEventBus | null>(null);
  const stateRef = useRef<RuntimeMutableState>({
    status: "booting",
    mountedAt: null,
    disposedAt: null,
  });

  if (!busRef.current) {
    busRef.current = createWorldEventBus();
  }

  const controller = useMemo<WorldRuntimeController>(() => {
    const bus = busRef.current as WorldEventBus;

    return {
      bus,
      getSnapshot: () => createSnapshot(stateRef.current, bus),
      dispose: () => {
        const disposedAt = Date.now();

        stateRef.current = {
          ...stateRef.current,
          status: "disposed",
          disposedAt,
        };

        bus.emit("RUNTIME_DISPOSED", { disposedAt });
        bus.clear();
      },
    };
  }, []);

  useEffect(() => {
    const mountedAt = Date.now();

    stateRef.current = {
      status: "ready",
      mountedAt,
      disposedAt: null,
    };

    controller.bus.emit("RUNTIME_READY", {
      mountedAt,
      subsystems: WORLD_RUNTIME_SUBSYSTEMS,
    });

    return () => {
      controller.dispose();
    };
  }, [controller]);

  return (
    <WorldRuntimeContext.Provider value={controller}>
      {children}
    </WorldRuntimeContext.Provider>
  );
}

export const WorldRuntimeProvider = memo(WorldRuntimeProviderComponent);
WorldRuntimeProvider.displayName = "WorldRuntimeProvider";

export function useWorldRuntime(): WorldRuntimeController {
  const context = useContext(WorldRuntimeContext);

  if (!context) {
    throw new Error("useWorldRuntime must be used within a WorldRuntimeProvider.");
  }

  return context;
}

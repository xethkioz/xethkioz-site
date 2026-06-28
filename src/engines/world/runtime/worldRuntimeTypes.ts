import type { WorldEventBus, WorldEventBusSnapshot } from "./worldEventBus";
import type {
  WorldRuntimeStatus,
  WorldRuntimeSubsystem,
} from "./worldRuntimeEvents";

export type WorldRuntimeSnapshot = {
  status: WorldRuntimeStatus;
  mountedAt: number | null;
  disposedAt: number | null;
  subsystems: readonly WorldRuntimeSubsystem[];
  bus: WorldEventBusSnapshot;
};

export type WorldRuntimeController = {
  bus: WorldEventBus;
  getSnapshot: () => WorldRuntimeSnapshot;
  dispose: () => void;
};

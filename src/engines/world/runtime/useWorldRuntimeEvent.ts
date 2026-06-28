import { useEffect } from "react";
import type {
  WorldRuntimeEventHandler,
  WorldRuntimeEventType,
} from "./worldRuntimeEvents";
import { useWorldRuntime } from "./WorldRuntimeProvider";

export function useWorldRuntimeEvent<TType extends WorldRuntimeEventType>(
  type: TType,
  handler: WorldRuntimeEventHandler<TType>
): void {
  const { bus } = useWorldRuntime();

  useEffect(() => {
    return bus.on(type, handler);
  }, [bus, type, handler]);
}

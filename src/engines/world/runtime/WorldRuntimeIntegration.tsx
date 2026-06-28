import { memo, useEffect } from "react";
import { useWorldRuntime } from "./WorldRuntimeProvider";
import { useWorldScheduler } from "./useWorldScheduler";
import type { WorldSchedulerFrameContext, WorldSchedulerPhase } from "./worldScheduler";

const RUNTIME_PHASES: readonly WorldSchedulerPhase[] = [
  "frame",
  "state",
  "orchestrator",
  "theme",
  "lighting",
  "camera",
  "ui",
] as const;

function createRuntimeTaskId(phase: WorldSchedulerPhase) {
  return `runtime:${phase}:metric`;
}

/**
 * Alpha 3.2 — Sprint D Runtime Integration.
 *
 * Registers the engine phases in the deterministic scheduler and publishes
 * per-phase metrics through the World Event Bus without touching React state
 * on every frame. This keeps the order stable:
 * frame → state → orchestrator → theme → lighting → camera → ui.
 */
function WorldRuntimeIntegrationComponent() {
  const { bus } = useWorldRuntime();
  const { scheduler } = useWorldScheduler({ autoStart: true });

  useEffect(() => {
    const cleanups = RUNTIME_PHASES.map((phase) => {
      const taskId = createRuntimeTaskId(phase);

      return scheduler.register({
        id: taskId,
        phase,
        priority: 0,
        run: (context: WorldSchedulerFrameContext) => {
          bus.emit("SCHEDULER_PHASE_METRIC", {
            phase,
            frame: context.frame,
            now: context.now,
            deltaMs: context.deltaMs,
            skippedFrames: context.skippedFrames,
            taskId,
            source: "system",
          });
        },
      });
    });

    scheduler.start();

    return () => {
      for (const cleanup of cleanups) cleanup();
      scheduler.stop();
    };
  }, [bus, scheduler]);

  return null;
}

export const WorldRuntimeIntegration = memo(WorldRuntimeIntegrationComponent);
WorldRuntimeIntegration.displayName = "WorldRuntimeIntegration";

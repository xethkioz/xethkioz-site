import { useEffect, useMemo } from "react";
import { createWorldScheduler, type WorldScheduler, type WorldSchedulerOptions } from "./worldScheduler";

export type WorldSchedulerController = {
  scheduler: WorldScheduler;
};

export function createWorldSchedulerController(
  options?: WorldSchedulerOptions
): WorldSchedulerController {
  return {
    scheduler: createWorldScheduler(options),
  };
}

/**
 * React lifecycle helper.
 *
 * Creates a scheduler instance once, starts it on mount and stops it on unmount.
 * Runtime Provider integration can consume this without changing engine internals.
 */
export function useWorldScheduler(
  options: WorldSchedulerOptions = { autoStart: true }
): WorldSchedulerController {
  const scheduler = useMemo(() => createWorldScheduler(options), []);

  useEffect(() => {
    if (options.autoStart !== false) {
      scheduler.start();
    }

    return () => {
      scheduler.stop();
    };
  }, [scheduler, options.autoStart]);

  return {
    scheduler,
  };
}

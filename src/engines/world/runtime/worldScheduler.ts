export const WORLD_SCHEDULER_PHASES = [
  "frame",
  "state",
  "orchestrator",
  "theme",
  "lighting",
  "camera",
  "ui",
] as const;

export type WorldSchedulerPhase = (typeof WORLD_SCHEDULER_PHASES)[number];

export type WorldSchedulerTask = {
  id: string;
  phase: WorldSchedulerPhase;
  enabled?: boolean;
  priority?: number;
  run: (context: WorldSchedulerFrameContext) => void;
};

export type WorldSchedulerFrameContext = {
  frame: number;
  now: number;
  deltaMs: number;
  skippedFrames: number;
};

export type WorldSchedulerOptions = {
  targetFps?: number;
  maxDeltaMs?: number;
  autoStart?: boolean;
};

export type WorldSchedulerSnapshot = {
  running: boolean;
  frame: number;
  taskCount: number;
  lastDeltaMs: number;
  skippedFrames: number;
};

const DEFAULT_OPTIONS: Required<WorldSchedulerOptions> = {
  targetFps: 60,
  maxDeltaMs: 48,
  autoStart: false,
};

const PHASE_ORDER: Record<WorldSchedulerPhase, number> = {
  frame: 0,
  state: 1,
  orchestrator: 2,
  theme: 3,
  lighting: 4,
  camera: 5,
  ui: 6,
};

const getTaskSortValue = (task: WorldSchedulerTask) => {
  return PHASE_ORDER[task.phase] * 1000 + (task.priority ?? 0);
};

/**
 * Deterministic runtime scheduler.
 *
 * It does not own visual logic. It only guarantees execution order:
 * frame → state → orchestrator → theme → lighting → camera → ui.
 */
export class WorldScheduler {
  private tasks = new Map<string, WorldSchedulerTask>();
  private options: Required<WorldSchedulerOptions>;
  private rafId: number | null = null;
  private running = false;
  private frame = 0;
  private lastNow = 0;
  private lastDeltaMs = 0;
  private skippedFrames = 0;

  constructor(options: WorldSchedulerOptions = {}) {
    this.options = {
      ...DEFAULT_OPTIONS,
      ...options,
    };

    if (this.options.autoStart) {
      this.start();
    }
  }

  register(task: WorldSchedulerTask): () => void {
    this.tasks.set(task.id, task);
    return () => {
      this.tasks.delete(task.id);
    };
  }

  unregister(taskId: string): void {
    this.tasks.delete(taskId);
  }

  start(): void {
    if (this.running || typeof window === "undefined") {
      return;
    }

    this.running = true;
    this.lastNow = performance.now();
    this.rafId = window.requestAnimationFrame(this.tick);
  }

  stop(): void {
    if (!this.running) {
      return;
    }

    this.running = false;

    if (this.rafId !== null && typeof window !== "undefined") {
      window.cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  clear(): void {
    this.tasks.clear();
  }

  getSnapshot(): WorldSchedulerSnapshot {
    return {
      running: this.running,
      frame: this.frame,
      taskCount: this.tasks.size,
      lastDeltaMs: this.lastDeltaMs,
      skippedFrames: this.skippedFrames,
    };
  }

  private tick = (now: number) => {
    if (!this.running) {
      return;
    }

    const rawDelta = now - this.lastNow;
    const targetFrameMs = 1000 / this.options.targetFps;

    if (rawDelta < targetFrameMs * 0.72) {
      this.rafId = window.requestAnimationFrame(this.tick);
      return;
    }

    const overloaded = rawDelta > this.options.maxDeltaMs;
    const deltaMs = overloaded ? this.options.maxDeltaMs : rawDelta;

    this.lastNow = now;
    this.lastDeltaMs = deltaMs;
    this.frame += 1;

    if (overloaded) {
      this.skippedFrames += Math.max(1, Math.floor(rawDelta / targetFrameMs) - 1);
    }

    const context: WorldSchedulerFrameContext = {
      frame: this.frame,
      now,
      deltaMs,
      skippedFrames: this.skippedFrames,
    };

    const sortedTasks = Array.from(this.tasks.values())
      .filter((task) => task.enabled !== false)
      .sort((a, b) => getTaskSortValue(a) - getTaskSortValue(b));

    for (const task of sortedTasks) {
      task.run(context);
    }

    this.rafId = window.requestAnimationFrame(this.tick);
  };
}

export const createWorldScheduler = (options?: WorldSchedulerOptions) => {
  return new WorldScheduler(options);
};

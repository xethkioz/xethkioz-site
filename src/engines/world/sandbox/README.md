# XETHKIOZ AI Sandbox

This directory is intentionally isolated from production UI.

## Rules

- Do not import this folder from stable Stage components.
- Use this area only for AI-assisted experiments, prompts, shader prototypes and asset generation specs.
- Raw AI assets must not be shipped directly.
- Final approved outputs must be optimized to `.webp` or `.svg`.
- Final approved outputs must be manually placed in `public/assets/` with clear prefixes such as `ai_relic_bg.webp`.

## Files

```txt
index.ts
AiAssetSpecs.ts
ExperimentalShader.tsx
README.md
```

## Alpha 3.3 Visual Runtime Sandbox Core

The following files initialize the isolated Visual Runtime Engine bunker:

- `visualTypes.ts` — strongly typed contracts for particles, forces, emitters, portal behavior presets and runtime metrics.
- `visualForces.ts` — pure vector force matrix: gravity, pulse, deterministic noise flow field and cursor repulsion.
- `visualEmitters.ts` — hot-swappable emitter registry with Wisp, Portal and Cursor emitters.
- `visualSimulationLoop.ts` — `VisualRuntimeSimulation`, a pure Float32Array-based simulation loop driven by external `dt`.

Rules:

- No React state for simulation data.
- No UI re-render dependency.
- No imports from production runtime.
- Scheduler integration must pass `dt` into `VisualRuntimeSimulation.step(dt)`.

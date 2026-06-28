# XETHKIOZ Alpha 3.2 — Sprint D: Runtime Integration

## Estado

Implementado y validado el 2026-06-28.

## Objetivo

Conectar el runtime global, el Scheduler y el Event Bus dentro de la aplicación real sin romper la UI estable ni forzar re-renders por frame.

## Cambios aplicados

- `App.tsx` ahora monta el núcleo de motores globales:
  - `WorldRuntimeProvider`
  - `WorldStateProvider`
  - `WorldOrchestratorProvider`
  - `WorldThemeProvider`
  - `LightingEngineProvider`
  - `WorldRuntimeIntegration`
- Se agregó `src/engines/world/runtime/WorldRuntimeIntegration.tsx`.
- Se agregó el evento tipado `SCHEDULER_PHASE_METRIC` al Event Bus.
- Se exportaron contratos de Scheduler desde `src/engines/world/runtime/index.ts`.
- Se agregó auditoría `npm run audit:runtime`.
- Se actualizó la versión a `7.0.0-fusion-alpha.3.2-runtime-integration`.

## Orden determinista activo

```text
Frame → State → Orchestrator → Theme → Lighting → Camera → UI
```

Cada fase registra una tarea estable en el Scheduler y publica métricas al Event Bus con:

- `phase`
- `frame`
- `now`
- `deltaMs`
- `skippedFrames`
- `taskId`
- `source: system`

## Restricción de rendimiento

La integración no escribe en React state por frame. Las métricas se publican internamente por Event Bus para evitar ruido visual y re-renders.

## Validación ejecutada

```powershell
npm ci
npm run build
npm run audit:runtime
npm run audit:fusion
npm run audit:wisp
npm run audit:portal
npm run audit:wisp-engine
npm run audit:functionality
```

Resultado: PASS.

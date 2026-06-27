# XETHKIOZ Alpha 3.1 — Sprint D: World Orchestrator Engine

## Objetivo

Crear un mediador central para coordinar señales entre los motores del mundo sin acoplamientos cruzados.

## Archivos

```txt
src/engines/world/orchestrator/worldOrchestratorTypes.ts
src/engines/world/orchestrator/worldOrchestratorEvents.ts
src/engines/world/orchestrator/worldOrchestratorSelectors.ts
src/engines/world/orchestrator/WorldOrchestrator.ts
src/engines/world/orchestrator/WorldOrchestratorContext.tsx
src/engines/world/orchestrator/index.ts
```

## Encapsulamiento

No contiene CSS ni lógica visual.

No toca:

```txt
src/providers/
src/services/
src/engines/profile/
```

## Responsabilidad

El orquestador recibe eventos como:

```txt
ON_PORTAL_CHANGE
ON_CRITICAL_ALERT
ON_INTERACTION_ENGAGED
ON_WISP_SURGE
```

y emite comandos abstractos hacia motores:

```txt
lighting
theme
worldState
camera
wisp
```

## Ejemplo lógico

Si el Wisp dispara `ON_WISP_SURGE`, el orquestador produce comandos:

```txt
lighting.SET_ALERT_LIGHT
camera.SHAKE
worldState.REQUEST_STATE(alert)
```

## Uso futuro

En una integración posterior, `WorldHeroStage` podrá depender del orquestador en lugar de coordinar cada motor individualmente.

# XETHKIOZ Alpha 3.2 — Runtime & Event Bus

## Objetivo

Fundar la capa de runtime superior para transportar eventos entre motores sin modificar su lógica interna.

## Archivos

```txt
src/engines/world/runtime/worldRuntimeEvents.ts
src/engines/world/runtime/worldEventBus.ts
src/engines/world/runtime/worldRuntimeTypes.ts
src/engines/world/runtime/WorldRuntimeProvider.tsx
src/engines/world/runtime/useWorldRuntimeEvent.ts
src/engines/world/runtime/index.ts
```

## Encapsulamiento

No modifica motores validados.

No toca:

```txt
src/providers/
src/services/
src/engines/profile/
```

## Flujo

```txt
Engine → EventBus → Orchestrator → Commands → Visual runtime consumers
```

## Eventos tipados

No hay strings abiertos. Todos los eventos pasan por `WorldRuntimeEventMap`.

## Uso futuro

```tsx
<WorldRuntimeProvider>
  <WorldHeroStage />
</WorldRuntimeProvider>
```

Luego los motores podrán emitir:

```ts
runtime.bus.emit("LIGHTING_SHIFTED", { profile, source: "lighting" });
```

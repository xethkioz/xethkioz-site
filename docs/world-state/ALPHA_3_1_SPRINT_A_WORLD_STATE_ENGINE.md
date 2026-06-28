# XETHKIOZ Alpha 3.1 — Sprint A: World State Engine Core

## Objetivo

Fundar el cerebro lógico del Stage mediante una máquina de estados finita autónoma, en memoria y desacoplada de persistencia.

## Archivos

```txt
src/engines/world/state/worldStates.ts
src/engines/world/state/worldEvents.ts
src/engines/world/state/WorldStateEngine.ts
src/engines/world/state/WorldStateContext.tsx
src/engines/world/state/index.ts
```

## Estados oficiales

```txt
idle
searching
talking
meditation
combat
alert
loading
portal
sleeping
```

## Restricciones

No se toca:

```txt
src/providers/
src/services/
src/engines/profile/
```

## Uso futuro

El Sprint B podrá mapear `current` y `definition.accent` hacia el Lighting Engine para controlar:

- intensidad ambiental;
- color dominante;
- partículas;
- cámara;
- Wisp;
- reliquias;
- estados del HUD.

## Ejemplo de uso

```tsx
import { WorldStateProvider, useWorldState } from "@/engines/world/state";

function Stage() {
  return (
    <WorldStateProvider>
      <WorldStateConsumer />
    </WorldStateProvider>
  );
}

function WorldStateConsumer() {
  const { current, definition, send } = useWorldState();

  return (
    <button onClick={() => send({ type: "START_SEARCH" })}>
      {current} / {definition.label}
    </button>
  );
}
```

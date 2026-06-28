# XETHKIOZ Alpha 3.1 — Sprint B: Lighting Engine

## Objetivo

Mapear los estados del `WorldStateEngine` hacia una matriz cromática reactiva y reutilizable para los motores visuales del Stage.

## Archivos

```txt
src/engines/world/lighting/lightingMatrix.ts
src/engines/world/lighting/lightingVariables.ts
src/engines/world/lighting/LightingEngineContext.tsx
src/engines/world/lighting/index.ts
```

## Encapsulamiento

No modifica:

```txt
src/providers/
src/services/
src/engines/profile/
```

## Estados cubiertos

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

## Uso futuro

El Sprint C podrá conectar `WorldStateProvider` con `LightingEngineProvider`:

```tsx
const { current } = useWorldState();

<LightingEngineProvider state={current}>
  <WorldStageBackdrop />
</LightingEngineProvider>
```

## Salida principal

`useLighting()` expone:

```txt
profile
cssVariables
motion.intensity
motion.bloomBlur
motion.fogDensity
motion.wispSpeed
```

Los componentes visuales podrán consumir estos valores sin acoplarse a Supabase, ProfileEngine o providers globales.

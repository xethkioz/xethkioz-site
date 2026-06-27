# XETHKIOZ Alpha 3.0 — Sprint E: Camera Engine

## Objetivo

Crear la base matemática del Camera Engine para que el escenario World pueda responder al cursor con profundidad, parallax y tilt sin acoplarse al Core ni a la persistencia.

## Archivos agregados

```txt
src/engines/world/camera/useWorldCameraMotion.ts
src/engines/world/camera/index.ts
```

## Archivos modificados

```txt
src/engines/world/index.ts
```

## Principios

- No toca `src/providers/`.
- No toca `src/services/`.
- No toca `src/engines/profile/`.
- No toca Supabase.
- No altera `WorldHeroStage` todavía.
- Expone MotionValues para evitar re-renders por movimiento del cursor.

## API

```ts
const camera = useWorldCameraMotion({ intensity: 1 })
```

La API devuelve:

- `stageRef`
- `onPointerMove`
- `onPointerLeave`
- `cameraX`
- `cameraY`
- `stageRotateX`
- `stageRotateY`
- `backdropX`
- `backdropY`
- `foregroundX`
- `foregroundY`
- `wispDriftX`
- `wispDriftY`

## Próxima integración

El siguiente sprint puede conectar estos valores a:

- `WorldStageBackdrop`
- `WorldWispMotion`
- `WorldFloatingRelic`
- `AvatarRenderer`
- HUD superior

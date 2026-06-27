# XETHKIOZ Alpha 3.0 — Sprint E Camera Engine Integration

## Alcance

Este patch integra el Camera Engine con el escenario visual del World:

- `WorldHeroStage` captura `onPointerMove` una sola vez.
- `useCameraMotion` expone MotionValues normalizados y amortiguados.
- `WorldStageBackdrop` escucha la cámara con parallax invertido mínimo.
- `WorldWispMotion` escucha la cámara con profundidad por capas.
- `WorldFloatingRelic` combina parallax global con micro-hover local.

## Encapsulamiento

No modifica:

- `src/providers/`
- `src/services/`
- `src/engines/profile/`

## Validación

Build validado con:

```bash
npm run build
```

Resultado:

```txt
✓ built in 2.46s
```

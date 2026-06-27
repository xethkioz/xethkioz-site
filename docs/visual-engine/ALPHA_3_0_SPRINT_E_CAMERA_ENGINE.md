# XETHKIOZ Alpha 3.0 — Sprint E: Camera Engine

## Objetivo

Crear una base de cámara virtual centralizada para que el escenario visual pueda reaccionar al movimiento del cursor sin generar re-renderizados innecesarios en React.

## Archivos agregados

```txt
src/engines/world/hooks/useCameraMotion.ts
src/engines/world/hooks/index.ts
```

## Encapsulamiento

No modifica:

```txt
src/providers/
src/services/
src/engines/profile/
```

## API principal

```ts
const camera = useCameraMotion();

camera.setPointerFromEvent(event);
camera.resetPointer();

camera.mouseX;
camera.mouseY;
camera.smoothMouseX;
camera.smoothMouseY;
```

## Integración recomendada en WorldHeroStage

El orquestador del escenario debe capturar el puntero una sola vez:

```tsx
const camera = useCameraMotion();

<motion.section
  onPointerMove={camera.setPointerFromEvent}
  onPointerLeave={camera.resetPointer}
>
  ...
</motion.section>
```

## Capas sugeridas

```txt
backdrop  → movimiento mínimo e invertido
fog       → desplazamiento suave
wisp      → deriva atmosférica
relic     → combinación con hover local
avatar    → profundidad focal
hud       → movimiento casi imperceptible
```

## Rendimiento

El hook trabaja con MotionValues y springs de Framer Motion. Eso permite que el movimiento del cursor se propague a los nodos animados sin usar `useState`, evitando re-renderizados continuos.

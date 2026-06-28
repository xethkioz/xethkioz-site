# XETHKIOZ Alpha 3.2 — Sprint C: Scheduler

## Objetivo

Agregar un scheduler determinista basado en `requestAnimationFrame` para ordenar el ciclo de actualización del runtime.

## Orden fijo

```txt
frame
state
orchestrator
theme
lighting
camera
ui
```

## Archivos

```txt
src/engines/world/runtime/worldScheduler.ts
src/engines/world/runtime/useWorldScheduler.ts
```

## Encapsulamiento

No modifica motores existentes. No contiene lógica visual, CSS ni dependencias de Supabase.

## Protección de rendimiento

- Usa `requestAnimationFrame`.
- Apunta a 60 FPS.
- Aplica throttling sutil si el frame llega demasiado pronto.
- Aplica delta clamp si hay sobrecarga.
- Registra `skippedFrames` para futura telemetría.

## Uso futuro

```tsx
const { scheduler } = useWorldScheduler();

useEffect(() => {
  return scheduler.register({
    id: "orchestrator-sync",
    phase: "orchestrator",
    run: (frame) => {
      // sync commands
    },
  });
}, [scheduler]);
```

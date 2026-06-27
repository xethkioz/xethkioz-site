# XETHKIOZ Alpha 3.0 — Sprint F: Optimization & Close

## Objetivo

Cerrar la base visual de Alpha 3.0 aplicando optimizaciones de orquestación sobre `WorldHeroStage` y el Camera Engine, sin tocar persistencia ni Core.

## Cambios aplicados

- `LazyMotion` + `domMax` envolviendo el subárbol visual del escenario.
- `MotionConfig` centralizado para transiciones spring por defecto.
- `LayoutGroup` con ID estable para el Stage.
- `useCallback` para eventos de puntero del Camera Engine.
- Constantes fuera del ciclo de render para `particleCount`, `seedFactor` y `layoutGroupId`.
- `useMemo` para la semilla determinista del Wisp.
- Retorno memoizado del hook `useCameraMotion` para estabilizar referencias.
- Sin `console.log`, `debugger`, `Math.random` ni rastros experimentales en `WorldHeroStage`, `components/` o `hooks/`.

## Archivos modificados

```txt
src/engines/world/WorldHeroStage.tsx
src/engines/world/hooks/useCameraMotion.ts
docs/visual-engine/ALPHA_3_0_SPRINT_F_OPTIMIZATION_CLOSE.md
```

## No modificado

```txt
src/providers/
src/services/
src/engines/profile/
```

## Validación requerida

```bash
npm run build
```

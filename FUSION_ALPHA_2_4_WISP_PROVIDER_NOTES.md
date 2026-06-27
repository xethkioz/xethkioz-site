# XETHKIOZ Fusion Alpha 2.4 — Wisp Provider

## Objetivo
Centralizar el ciclo de vida global del Wisp mediante `src/providers/WispProvider.tsx` sin romper compatibilidad con el `WispEngineContext` existente.

## Cambios
- `WispProvider` ahora es el proveedor global usado por `App.tsx`.
- Expone estados públicos normalizados: `IDLE`, `WATCHING`, `CONNECTED`, `GREEN_MODE`.
- Mantiene `mood` interno compatible con el motor existente: `idle`, `watching`, `connected`, `guiding`, `alert`, `sleeping`, `GREEN_MODE`.
- Agrega API limpia:
  - `setWispState(state)`
  - `triggerGreenPortal()`
  - `activateGreenMode()` como alias compatible.
- Conserva compatibilidad con componentes existentes que usan `useWispEngine`.
- El estado inicial del motor pasa a `watching` cuando no existe estado persistido.

## Seguridad y estabilidad
- No se modificó Supabase runtime.
- No se agregó SQL.
- No se cambiaron dependencias.
- Se preservó localStorage del Wisp Engine.

## Validación esperada
- `npm run build`
- `npm run audit:portal`
- `npm run audit:fusion`
- `npm run audit:live`
- `npm run audit:hud`
- `npm run audit:functionality`

# XETHKIOZ Fusion Alpha 0.9 — Persistent HUD Foundation

## Objetivo
Convertir los controles globales en una base real y persistente del ecosistema.

## Cambios
- Se agregó `src/lib/HudContext.tsx`.
- `App.tsx` ahora envuelve la app con `HudProvider`.
- `Header.tsx` deja de usar estado local para sonido.
- El estado de sonido y volumen se guarda en `localStorage`.
- Se agrega control de volumen base sin introducir pistas de audio todavía.
- Se agrega `npm run audit:hud`.

## Riesgo controlado
No se agregaron pistas de audio ni reproducción automática. Esta versión solo prepara el motor de estado.

## Verificación
- `npm run audit:hud`
- `npm run audit:wisp`
- `npm run audit:fusion`
- `npm run audit:architecture`
- `npm run audit:inventory`
- `npm run audit:sql`
- `npm run build`

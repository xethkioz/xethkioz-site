# XETHKIOZ Fusion Alpha 1.3 — Global HUD

## Objetivo
Implementar la Fase 2 del Master Design Bible v3.0: HUD global persistente, login preview, ES/EN funcional, audio ON/OFF, estado del sistema y Wisp siempre visible.

## Cambios aplicados
- `HudContext` ahora centraliza audio, volumen y estado de cuenta preview.
- `Header` consume estado global y ya no maneja audio local.
- Login preview persistente con `localStorage` (`guest` / `connected`).
- Agregado `FusionGlobalStatus` para estado del sistema visible fuera de Home.
- Agregado `FusionGlobalWisp` para que el Wisp exista en todas las rutas.
- `FusionWorldStage` deja de renderizar el Wisp localmente para evitar duplicados.
- CSS global agregado para HUD, Wisp fijo y estado del sistema.
- i18n ES/EN ampliado con textos de login, volumen, estado y audio.
- Scripts de auditoría actualizados para validar HUD global y Wisp global.

## Rutas a probar
- `/`
- `/gaming`
- `/science`
- `/fun`
- `/green-node`

## Verificación ejecutada
- `npm run audit:hud`
- `npm run audit:fusion`
- `npm run audit:live`
- `npm run build`

## Resultado
Build y auditorías correctas. Sin cambios en SQL ni Supabase.

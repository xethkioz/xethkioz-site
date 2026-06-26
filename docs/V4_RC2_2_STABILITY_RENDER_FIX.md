# XETHKIOZ v4.0 RC2.2 — Stability Render Fix

Fecha: 2026-06-26

## Objetivo
Corregir la pantalla vacía detectada en local/producción donde solo se veía el fondo de la web y no montaban header, contenido ni footer.

## Causa probable
Un error de render en módulos flotantes/globales podía romper el árbol completo de React. Los módulos más sensibles eran chat, presencia, Wisp, Supabase Realtime y providers de runtime.

## Cambios técnicos
- Se agrega `AppErrorBoundary` para aislar errores por módulo.
- Se envuelve `Header`, `Routes`, `Footer`, `FloatingCommunityChat` y `WispPortal` con boundaries independientes.
- Se refuerza `main.tsx` con Safe Boot para evitar pantalla negra si falla el arranque.
- Se endurece `realtimeCommunity.ts` para evitar crashes por `localStorage`, `BroadcastChannel`, `crypto`, Realtime o Supabase.
- Se corrige `supabase.ts` para no lanzar errores destructivos durante el import.
- Se actualiza versión a `4.0.0-rc.2.2`.

## Resultado esperado
Aunque falle chat, presencia, Wisp o Supabase, la Home y la navegación base deben seguir renderizando.

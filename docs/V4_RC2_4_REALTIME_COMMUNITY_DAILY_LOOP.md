# XETHKIOZ v4.0 RC2.4 — Realtime Community + Daily Loop

## Objetivo
Corregir la limitación del chat local y preparar la web para sentirse viva todos los días.

## Cambios principales

### Chat
- `useRealtimeChat` ahora usa tres capas:
  1. Supabase Realtime Broadcast por sala.
  2. Persistencia opcional en `xeth_chat_messages`.
  3. Fallback local/multi-pestaña si Supabase no está disponible.
- El chat cambia automáticamente de sala según la ruta.
- El estado visible ahora diferencia: Local seguro, Broadcast navegador, Historial Supabase y Realtime global.

### Presencia
- Nuevo canal global de presencia para contar usuarios online.
- Contador por ruta y por sala.
- Fallback local para pruebas sin Supabase.

### Wisp
- El Wisp lee actividad real/presencia cuando está disponible.
- Nuevos niveles hasta `Network Spirit`.
- Eventos de XP persistibles en `xeth_wisp_events`.

### Actividad diaria
- Nuevo `ActivityPulsePanel` en Home.
- Muestra usuarios online, Wisp, noticia del día, fuente destacada, carril editorial y foco de trabajo.
- Rotación diaria determinística para que el portal cambie sin depender de carga manual inmediata.

### SQL
- Nueva migración `20260625_rc24_realtime_community_daily_loop.sql`.
- Tablas: `xeth_chat_messages`, `xeth_presence_routes`, `xeth_wisp_events`, `xeth_daily_content_slots`.
- RLS pública controlada para lectura/chat/presencia.

## Requisito importante
Para que el chat sea global entre usuarios reales en producción hay que aplicar la migración en Supabase y verificar que Realtime esté habilitado para las tablas/canales.

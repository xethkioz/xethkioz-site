# XETHKIOZ v4.0 RC2.0 — Realtime Chat + Wisp Evolution

## Objetivo

Corregir el problema detectado en pruebas: el chat visual/local no sincronizaba mensajes entre usuarios reales. Esta versión agrega una arquitectura híbrida para chat y presencia.

## Qué cambia

### Chat

- Chat con soporte multi-pestaña mediante `BroadcastChannel`.
- Cache local con `localStorage` para no perder mensajes durante pruebas.
- Integración preparada con Supabase Realtime mediante tabla `xeth_chat_messages`.
- Salas por portal: General, Gaming, IA, Ciencia, Streaming, Green Node y Asia Gaming.
- El chat sugiere sala según la ruta actual.

### Presencia

- Contador de usuarios mirando la página actual.
- Contador global de usuarios en el ecosistema.
- Fallback local por pestañas.
- Preparación para Supabase Presence.

### Wisp

- Muestra cantidad de personas mirando la página.
- Tiene niveles evolutivos:
  - Lv.1 Spark
  - Lv.2 Echo
  - Lv.3 Portal Keeper
  - Lv.4 Green Guardian
  - Lv.5 Core Entity
- Gana XP por interacción con el portal y por actividad en chat.
- Muestra energía porcentual.

## SQL agregado

Archivo:

```txt
database/migrations/20260625_rc20_realtime_chat_wisp_evolution.sql
supabase/migrations/20260625_rc20_realtime_chat_wisp_evolution.sql
```

Tablas:

- `xeth_chat_rooms`
- `xeth_chat_messages`
- `xeth_presence_routes`
- `xeth_wisp_events`

## Nota importante para Supabase

Para que el chat sea realtime entre usuarios de diferentes dispositivos, activar Realtime en Supabase para:

- `xeth_chat_messages`
- `xeth_presence_routes`

Ruta sugerida:

```txt
Supabase Dashboard > Database > Replication > Add tables to realtime publication
```

## Estado

- Build probado.
- La web puede funcionar sin Supabase aplicado usando modo local/híbrido.
- Cuando la migración y Realtime estén activos, el chat pasa a sincronización real.

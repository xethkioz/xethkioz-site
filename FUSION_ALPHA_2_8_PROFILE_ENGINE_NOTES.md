# XETHKIOZ Fusion Alpha 2.8 — Profile Engine

## Objetivo

Inicializar el `ProfileEngine` como motor responsable de lectura/escritura de datos reales de perfil, XP, nivel y estado del avatar usando el cliente global de Supabase.

## Archivos principales

- `src/engines/profile/ProfileEngine.ts`
- `src/engines/profile/index.ts`

## Funciones

- `ProfileEngine.getProfile(userId?)`
- `ProfileEngine.getAvatarState(userId?)`
- `ProfileEngine.addXp(userId, amount)`
- `ProfileEngine.updateProgress(userId, amount, actionId?)`
- `ProfileEngine.completeRpgAction(userId, actionId)`

## Acciones RPG iniciales

- `walk`
- `fight_dragon`
- `forge`
- `magic`
- `fish`

## Seguridad

- El motor consume el cliente seguro `src/services/supabaseClient.ts`.
- La seguridad real depende de RLS en Supabase.
- No se usa service role ni claves privadas en frontend.
- Los eventos del Wisp quedan registrados como logs inmutables.

## Nota técnica

El incremento de XP se realiza por lectura + actualización. Para producción avanzada conviene migrar este flujo a una función RPC PostgreSQL transaccional.

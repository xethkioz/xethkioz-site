# Reconciliación de migraciones — 23 de agosto de 2026

## Estado comprobado

- Producción registra 57 migraciones antes de esta entrega.
- El repositorio contiene 66 archivos SQL en `supabase/migrations` antes de esta entrega.
- Las diferencias de nombre y timestamp provienen de migraciones históricas aplicadas por bloques y de archivos anteriores al historial administrado actual.
- Las cuatro migraciones más recientes de seguridad y contenido coinciden por nombre y versión entre producción y el repositorio.

## Decisión segura

No se deben ejecutar automáticamente los archivos históricos que no aparecen en el ledger remoto. La presencia de tablas, funciones y políticas actuales demuestra que muchos de esos cambios ya están incorporados de forma semántica, aunque no compartan el mismo identificador. Reproducirlos a ciegas puede duplicar políticas, datos o funciones.

A partir de esta entrega:

1. Cada cambio de base nuevo vive en un único archivo dentro de `supabase/migrations`.
2. El nombre lógico aplicado en Supabase debe coincidir con el sufijo del archivo.
3. Toda migración se ensaya primero dentro de una transacción revertida.
4. El CI debe validar las referencias críticas del archivo antes de la publicación.
5. La auditoría quincenal compara el ledger remoto con el repositorio y reporta cualquier diferencia nueva.

## Línea base

Las diferencias históricas quedan congeladas como deuda documental; no son una cola de migraciones pendientes. El criterio de alerta es que aparezca una diferencia nueva después de `20260823173000_maintenance_retention_and_expiry.sql`.

Para una restauración se debe usar el respaldo lógico validado más reciente y luego aplicar únicamente migraciones posteriores a esta línea base. Antes de automatizar una restauración completa se requiere un `pg_dump` nativo o snapshot administrado por Supabase.

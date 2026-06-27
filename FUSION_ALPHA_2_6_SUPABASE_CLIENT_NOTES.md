# XETHKIOZ Fusion Alpha 2.6 — Supabase Client

## Objetivo

Inicializar el cliente oficial de Supabase para la Fusion Platform dentro de `src/services/supabaseClient.ts`.

## Cambios

- Se creó `src/services/supabaseClient.ts` como punto centralizado de conexión.
- Se utilizan exclusivamente `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
- Se exporta `supabase` para consumo por motores modulares.
- Se exporta `isSupabaseConfigured` para evitar llamadas reales cuando el entorno no está listo.
- Se exporta `supabaseEnvironment` para diagnósticos seguros sin exponer secretos.
- Se mantiene compatibilidad legacy mediante `src/lib/supabase.ts` como re-export.

## Seguridad

- No se utiliza service role key en frontend.
- No se imprimen credenciales en consola.
- El fallback local evita romper builds cuando `.env` usa placeholders.
- Las operaciones reales deben depender de RLS y validaciones en Supabase.

## Sin cambios SQL

Esta revisión no aplica migraciones ni modifica tablas.

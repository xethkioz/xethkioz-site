# XETHKIOZ Fusion Alpha 0.4 — SQL & Data Safety Notes

## Objetivo

Congelar y auditar el estado SQL/Supabase del proyecto sin aplicar migraciones nuevas.

## Decisión

No se aplica SQL en esta fase. El objetivo es inventariar, clasificar y detectar duplicados antes de tocar la base de datos real.

## Cambios

- Versión actualizada a `7.0.0-fusion-alpha.0.4`.
- Agregado script `npm run audit:sql`.
- Generado inventario SQL en `docs/ARCHITECTURE/FUSION_ALPHA_0_4_SQL_INVENTORY.md`.
- No se modificó Home.
- No se modificó visual.
- No se modificó Supabase runtime.

## Hallazgos iniciales

- Existen migraciones duplicadas entre `database/migrations` y `supabase/migrations`.
- Existen varias etapas históricas mezcladas: Alpha, RC, v4, content system, chat, Green Node, Science, milestones y community.
- La carpeta SQL debe tratarse como archivo histórico hasta definir un baseline nuevo.

## Regla

Ninguna migración debe aplicarse sobre Supabase hasta crear un `schema_baseline_fusion_1.sql` revisado.

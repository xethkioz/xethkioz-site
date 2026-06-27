# XETHKIOZ Fusion Alpha 0.5 — Core Architecture

## Objetivo

Congelar una arquitectura mínima y documentada antes de tocar la Home o el Design System.

## Cambios

- Versión actualizada a `7.0.0-fusion-alpha.0.5`.
- Se agrega `src/lib/fusionConfig.ts` como contrato de versión, rutas públicas, redirects heredados y guardrails.
- Se agrega `npm run audit:architecture`.
- Se genera inventario de arquitectura en `docs/ARCHITECTURE/FUSION_ALPHA_0_5_ARCHITECTURE_AUDIT.md`.
- Se corrige la etiqueta visible de Home para no quedar clavada en Fusion Alpha 0.2.

## Decisiones

- No se elimina código legado todavía.
- No se toca SQL.
- No se toca Supabase runtime.
- No se rehace la Home.
- `main` debe seguir siendo deployable.

## Próxima fase recomendada

Fusion Alpha 0.6 — Design System Seed:
- Crear componentes visuales básicos reutilizables.
- No rediseñar la Home todavía.
- Preparar Portal Engine con piezas reales, no imágenes pegadas.

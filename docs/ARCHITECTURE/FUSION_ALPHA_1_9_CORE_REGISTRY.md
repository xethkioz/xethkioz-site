# Fusion Alpha 1.9 — Core Registry Architecture

## Decisión técnica

La Home deja de conocer los portales como una lista local y empieza a consumir `portalRegistry`. Esto reduce deuda técnica y permite que Portal Engine evolucione por configuración.

## Regla nueva

Las entidades principales deben vivir en registros dedicados:

- `portalRegistry`
- futuro `engineRegistry`
- futuro `routeRegistry`
- futuro `themeRegistry`
- futuro `audioRegistry`

## Design Tokens

`src/design/designTokens.ts` queda como fuente técnica de tokens del ecosistema. Tailwind todavía mantiene su configuración actual para no introducir riesgo innecesario en Alpha 1.9.

## Próximo paso recomendado

Fusion Alpha 2.0 debe reorganizar progresivamente carpetas hacia:

- `core/`
- `design/`
- `engines/`
- `shared/`
- `providers/`
- `layouts/`
- `pages/`

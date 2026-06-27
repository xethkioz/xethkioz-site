# Fusion Alpha 1.9 — Core Registry

## Objetivo

Consolidar el primer paso de arquitectura V5: Design Tokens, Portal Registry y separación inicial de Engines sin romper rutas ni funcionalidad existente.

## Cambios

- Agregado `src/design/designTokens.ts`.
- Agregado `src/design/index.ts`.
- Agregado `src/engines/portal/portalRegistry.ts`.
- Agregado `src/engines/portal/index.ts`.
- Agregado `src/engines/world/WorldGateV5.tsx`.
- Agregado `src/engines/world/index.ts`.
- `Home.tsx` ahora usa `WorldGateV5` desde `engines/world`.
- `FusionWorldStageV5` consume `getPortalRegistry()` en vez de declarar portales hardcodeados.
- Green Node mantiene condición `wispWatching` desde el registro.
- Agregado `npm run audit:portal`.

## Alcance

- No se ejecutaron migraciones SQL.
- No se tocó Supabase runtime.
- No se alteraron rutas públicas.
- No se eliminaron componentes legacy.

# XETHKIOZ Fusion Alpha 1.0 — Live Candidate

## Objetivo

Preparar una versión apta para quedar LIVE por más tiempo, con una base visual más fuerte pero sin repetir el error de usar una imagen plana como interfaz.

## Cambios principales

- Versión actualizada a `7.0.0-fusion-alpha.1.0-live-candidate`.
- Home reconstruida mediante `FusionWorldStage`.
- Avatar y dragón pasan a ser capas HTML/CSS animadas livianas, no una imagen pegada.
- Portales principales siguen siendo componentes reales mediante `FusionPortalGate`.
- Green Wisp sigue siendo entidad reutilizable mediante `FusionWispEntity`.
- Agregado `FusionStatusRail` para comunicar estado del ecosistema sin saturar la UI.
- Portales internos incorporan estado contextual sin modificar datos ni Supabase.
- Agregado `npm run audit:live`.
- Guardrails actualizados para live candidates.

## Lo que NO se hizo

- No se tocó Supabase runtime.
- No se aplicó SQL.
- No se agregó CMS nuevo.
- No se agregó audio real.
- No se usaron assets externos como interfaz principal.

## Estado

Apta para test LIVE controlado.

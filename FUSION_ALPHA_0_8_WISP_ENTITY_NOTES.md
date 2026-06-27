# XETHKIOZ Fusion Alpha 0.8 — Wisp Entity Foundation

## Objetivo
Convertir el Green Wisp en un componente real reutilizable, evitando que vuelva a quedar como markup hardcodeado dentro del Home.

## Cambios
- Agregado `src/components/fusion/FusionWispEntity.tsx`.
- Home ahora usa `<FusionWispEntity />`.
- Agregado `npm run audit:wisp`.
- Agregada auditoría de seguridad específica para Wisp.
- Versión actualizada a `7.0.0-fusion-alpha.0.8`.
- CSS agregado para Wisp con animación liviana y estados base.

## No se modificó
- SQL.
- Supabase runtime.
- CMS.
- Auth.
- Visual general del Home.

## Resultado
El Wisp queda preparado como entidad escalable para futuros estados: idle, watching, connected.

# Fusion Alpha 1.5 — Wisp Engine Architecture

## Propósito
El Wisp pasa de ser un elemento decorativo a ser una entidad de ecosistema preparada para IA, eventos, navegación contextual y futuro sistema de comunidad.

## Archivos principales
- `src/lib/WispEngineContext.tsx`
- `src/components/fusion/FusionWispEntity.tsx`
- `src/components/fusion/FusionGlobalWisp.tsx`
- `src/components/fusion/FusionGlobalStatus.tsx`
- `src/App.tsx`

## Contratos
### Estado
`WispMood = idle | watching | connected | guiding | alert | sleeping`

### Eventos
`WispEventType = route-watch | portal-hover | green-unlock | system-ready | future-ai`

### Persistencia
- `xethkioz.wisp.mood`
- `xethkioz.wisp.energy`
- `xethkioz.wisp.events`
- `xethkioz.wisp.focusRoute`

## Uso futuro
- Integración con IA contextual.
- Eventos de comunidad.
- Logros/XP.
- Notificaciones.
- Guía de navegación.
- Mystery/Green Node discovery loop.

## Regla
El Wisp no debe volver a ser hardcodeado en Home ni convertirse en un botón decorativo. Debe permanecer como motor global.

# Architecture — Fusion Alpha 1.3 Global HUD

## Decisión
El HUD no pertenece a Home ni a ningún portal. Pertenece al ecosistema completo.

## Componentes
- `HudContext`: fuente única para audio, volumen y cuenta preview.
- `Header`: controles principales.
- `FusionGlobalStatus`: estado de sistema, ruta activa, audio y cuenta.
- `FusionGlobalWisp`: entidad Wisp global, con acceso a Green Node.

## Guardrail
Ningún portal debe esconder ni recrear controles globales. Si una sección necesita controles adicionales, debe extender el HUD o crear paneles propios sin duplicar lógica global.

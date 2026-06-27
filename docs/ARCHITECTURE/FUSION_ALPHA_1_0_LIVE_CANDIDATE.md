# Fusion Alpha 1.0 — Arquitectura Live Candidate

## Decisión principal

La Home queda dividida en capas funcionales:

- `Home.tsx`: ruta y SEO.
- `FusionWorldStage.tsx`: escena principal.
- `FusionPortalGate.tsx`: portales reales.
- `FusionWispEntity.tsx`: Wisp reusable.
- `FusionStatusRail.tsx`: estado visible del ecosistema.
- `HudContext.tsx` + `Header.tsx`: HUD persistente.

## Criterio técnico

La interfaz no depende de una imagen plana. Los elementos visuales son componentes HTML/CSS animados, reemplazables por assets definitivos más adelante sin cambiar la arquitectura.

## Riesgos controlados

- La visual todavía no es final.
- El avatar y dragón son placeholders avanzados.
- El audio sigue siendo solo estado de HUD.
- Los portales internos siguen en fase estructural.

## Verificación

Comandos ejecutados:

```bash
npm run audit:live
npm run audit:hud
npm run audit:wisp
npm run audit:fusion
npm run audit:architecture
npm run audit:inventory
npm run audit:sql
npm run build
```

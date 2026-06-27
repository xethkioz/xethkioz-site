# QA — Fusion Alpha 1.4 Portal Engine

## Resultado

Build esperado: PASS.

## Alcance revisado

- Home / World Gate.
- FusionPortalGate.
- FusionWorldStage.
- CSS de portales.
- Datos i18n usados para paneles visibles.

## Criterios

- No usar imagen como interfaz completa.
- Mantener portales como componentes React reales.
- Mantener Green Node como Easter Egg con acceso especial.
- Mantener textos provenientes del sistema i18n.
- Mantener rutas públicas disponibles.

## Riesgos

- Los efectos CSS agregan peso visual; deben probarse en mobile real.
- El Green Node tiene gating por interacción; en dispositivos táctiles se requiere primer toque para desbloquear y segundo para ingresar.

## Estado

Apto para test local y Live si build y auditorías pasan.

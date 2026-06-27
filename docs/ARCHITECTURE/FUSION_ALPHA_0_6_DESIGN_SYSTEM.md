# Fusion Alpha 0.6 — Design System Foundation

## Contrato inicial
El Design System se basa en tonos, no en estilos sueltos por página.

Tonos actuales:
- `gaming`
- `science`
- `fun`
- `green`

Fuente de verdad:
- `src/lib/designSystem.ts`

## Componentes creados

### FusionShell
Layout de portal interno. Centraliza:
- fondo base
- header interno
- botón volver al núcleo
- etiqueta del portal

### FusionHero
Bloque hero reutilizable. Centraliza:
- eyebrow
- heading
- description
- borde/glow según tono

### FusionFeatureGrid
Cards internas para secciones de Games, Science y Fun.

### FusionLevelGrid
Cards de niveles del Green Node.

## Beneficio arquitectónico
Antes cada portal duplicaba markup, clases y estilos. Ahora las páginas internas usan componentes comunes, reduciendo deuda técnica y preparando un Portal Engine real.

## Pendiente
- FusionButton
- FusionHUD
- FusionPortalOrb
- WispEngine
- Portal transition layer

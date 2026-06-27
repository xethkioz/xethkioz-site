# XETHKIOZ Fusion Alpha 2.1 — Design Tokens

## Objetivo
Centralizar la paleta mística oficial de XETHKIOZ, brillos neón, estados, motion tokens y animaciones de Wisp/Avatar en `src/design/designTokens.ts`.

## Cambios
- Paleta oficial:
  - `fusionBg`: `#050608`
  - `fusionSurface.DEFAULT`: `#0F1118`
  - Gaming: `#8A2EFF`
  - Fun: `#FF7A00`
  - Science: `#3B82F6`
  - Green Node: `#32FF8A`
- Alias de compatibilidad: `techPrimary` y `techSecondary`.
- Tokens nuevos para:
  - `typography`
  - `motion`
  - `shadow`
  - `status`
  - `animations.wisp`
  - `animations.avatar`
- Tailwind actualizado para reflejar la nueva paleta en las clases existentes.

## Restricciones
- Sin SQL nuevo.
- Sin cambios en Supabase runtime.
- Sin alterar rutas.

# Fusion Alpha 1.6 — Functionality Core Architecture

## Módulos
- Content Engine preview: `src/lib/fusionContent.ts`
- Profile/Progress Engine preview: `src/lib/ProfileProgressContext.tsx`
- Panel Engine: `src/components/fusion/FusionContentPanel.tsx`

## Rutas nuevas
- `/news`: agregador dinámico mock.
- `/community`: base de comunidad y misiones.
- `/profile`: perfil local y progreso.
- `/cms`: cola editorial mock.

## Decisión técnica
Se evita conectar backend real hasta aprobar contratos de datos y seguridad. La función ya existe en UI/estado local, pero no compromete SQL ni Supabase.

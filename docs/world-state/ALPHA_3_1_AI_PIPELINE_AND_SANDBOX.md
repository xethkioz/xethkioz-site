# XETHKIOZ Alpha 3.1 — AI Pipeline & Sandbox

## Objetivo

Crear un área aislada para asistencia de IA, generación de assets y prototipos visuales experimentales sin acoplarlos a producción.

## Archivos

```txt
src/engines/world/sandbox/index.ts
src/engines/world/sandbox/AiAssetSpecs.ts
src/engines/world/sandbox/ExperimentalShader.tsx
src/engines/world/sandbox/README.md
```

## Encapsulamiento

No se importa desde:

```txt
src/providers/
src/services/
src/engines/profile/
WorldHeroStage
AppShell
routes
```

## Regla de seguridad

El `index.ts` exporta vacío por diseño para evitar fugas accidentales.

## Sanitización de assets

Todo asset generado por IA debe:

1. Revisarse manualmente.
2. Optimizarse como `.webp` o `.svg`.
3. Guardarse manualmente en `public/assets/`.
4. Usar prefijo claro: `ai_relic_bg.webp`, `ai_portal_grid.svg`, etc.
5. No incluir logos, texto, marcas de terceros ni contenido con copyright.

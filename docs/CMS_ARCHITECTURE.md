# CMS ARCHITECTURE — XETHKIOZ Professional CMS

Base: `v7.0.0-fusion-rc4 + News Engine scaffold`  
PR objetivo: `#10 feat(cms) scaffold base + admin routing`  
Rama: `feature/cms-scaffold-base`

## Estado

Este documento define la primera entrega del CMS profesional de XETHKIOZ.

PR #10 no incluye editor real, integración con `/api/generate-news`, tests unitarios ni dependencias nuevas. Su objetivo es crear la columna vertebral segura del CMS.

## Alcance de PR #10

Incluye:

- Estructura `src/cms/`.
- `useAdminSession` con Supabase Auth.
- `AdminGuard` con verificación de rol admin.
- `CmsLayout` con sidebar, header y outlet.
- Placeholders para dashboard, generación, listado y editor.
- Rutas protegidas `/cms/*` en `App.tsx`.
- Ruta legacy `/cms-legacy` para conservar la página anterior.

No incluye:

- Vitest.
- Editor visual.
- LLM.
- Nuevas dependencias.
- Dashboard con datos reales.
- Consumo real de `/api/generate-news`.

## Rutas

```txt
/cms
/cms/generate
/cms/news
/cms/news/new
/cms/news/:id
/cms-legacy
```

## Protección

El CMS usa doble capa:

1. `AdminGuard` en cliente para UX y bloqueo visual.
2. Supabase RLS para protección real de datos.

El guard valida:

- usuario autenticado.
- `app_metadata.role = admin` o `user_metadata.role = admin`.

## Roadmap CMS incremental

1. PR #10 — scaffold + rutas protegidas.
2. PR #11 — listado real de noticias.
3. PR #12 — editor por bloques.
4. PR #13 — UI que consume `/api/generate-news`.
5. PR #14 — workflow editorial.
6. PR #15 — programación.
7. PR #16 — SEO preview.
8. PR futuro — testing infrastructure con Vitest.

## Decisión técnica

Vitest no está instalado en el stack actual. Por lo tanto, PR #10 no incluye tests. La infraestructura de testing debe agregarse luego con actualización correcta de `package-lock.json`.

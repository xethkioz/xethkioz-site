# CMS ARCHITECTURE — XETHKIOZ Professional CMS

Base: `v7.0.0-fusion-rc4 + News Engine scaffold`  
Estado actual: `CMS scaffold + news listing foundation`

## Estado

Este documento define la evolución incremental del CMS profesional de XETHKIOZ.

PR #10 creó la columna vertebral del CMS: rutas protegidas, layout, guard admin y placeholders.

PR #11 profesionaliza el listado editorial conectado a `news_articles`, sin introducir dependencias nuevas ni mutaciones destructivas.

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
- Consumo real de `/api/generate-news`.

## Alcance de PR #11

Incluye:

- Lectura real de `news_articles` desde Supabase.
- Estadísticas editoriales por estado.
- Filtro por estado: `all`, `draft`, `review`, `published`, `archived`.
- Filtro por categoría derivado de los artículos cargados.
- Búsqueda local por título, resumen, slug o categoría.
- Paginación local de 10 resultados por página.
- Enlaces a editor y vista pública cuando corresponde.

No incluye:

- Mutaciones de estado.
- Publicar/despublicar.
- Eliminar o archivar.
- Editor por bloques.
- LLM.
- Dependencias nuevas.

## Rutas CMS

```txt
/cms
/cms/generate
/cms/news
/cms/news/new
/cms/news/:id
/cms/review
/cms/users
/cms/ads
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
2. PR #11 — listado real de noticias con filtros y paginación.
3. PR #12 — editor por bloques.
4. PR #13 — UI que consume `/api/generate-news`.
5. PR #14 — workflow editorial.
6. PR #15 — programación.
7. PR #16 — SEO preview.
8. PR futuro — testing infrastructure con Vitest.

## Decisión técnica

Vitest no está instalado en el stack actual. La infraestructura de testing debe agregarse luego con actualización correcta de `package-lock.json`.

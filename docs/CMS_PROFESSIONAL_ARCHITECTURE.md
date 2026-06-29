# CMS PROFESSIONAL ARCHITECTURE — XETHKIOZ Fusion Platform

Base estable: `v7.0.0-fusion-rc4 + News Engine scaffold`  
Rama: `feature/cms-generate-news`  
Objetivo: diseñar la arquitectura del CMS profesional antes de implementar UI y lógica editorial.

## 1. Estado de partida

La plataforma ya cuenta con:

- RC4 sellada en `main`.
- News Engine scaffold integrado.
- Endpoint `/api/generate-news`.
- Supabase con `news_articles` y `news_audit_log`.
- Usuario `xethkioz@gmail.com` con rol `admin`.
- Variables Vercel configuradas.
- Página base `/cms` existente en `src/pages/CmsStudio.tsx`.

La página CMS actual es una shell visual con `FusionShell`, `FusionHero` y `FusionContentPanel`. El siguiente paso es convertirla en un centro editorial real.

## 2. Objetivo del CMS v1

Crear un panel editorial que permita:

1. Ver borradores creados por `/api/generate-news`.
2. Crear drafts desde una interfaz visual.
3. Editar título, resumen, categoría, tags y bloques de contenido.
4. Guardar cambios como draft.
5. Cambiar estado editorial: `draft`, `review`, `published`, `archived`.
6. Consultar audit log básico.
7. Preparar la base para SEO, programación y publicación multired.

## 3. Principios de diseño

- No romper RC4.
- No tocar `main` directamente.
- No activar LLM en esta fase.
- No agregar dependencias nuevas sin actualizar lockfile correctamente.
- Mantener CMS como módulo aislado.
- Mantener contenido en JSON estructurado, no HTML crudo.
- Priorizar seguridad admin.
- Mantener compatibilidad con XETHKIOZ Network.

## 4. Arquitectura de módulos

### 4.1 CMS Dashboard

Ruta objetivo:

```txt
/cms
```

Responsabilidad:

- Mostrar estado del sistema editorial.
- Resumen de drafts.
- Últimos artículos.
- Pendientes de revisión.
- Acceso rápido a generar noticia.

### 4.2 Generador de noticias

Ruta objetivo:

```txt
/cms/generate
```

Responsabilidad:

- Formulario para consumir `/api/generate-news`.
- Campos mínimos:
  - category
  - topic
  - title opcional
  - summary opcional
  - tags
  - source_urls
  - language
- Resultado:
  - draft creado
  - link a edición

### 4.3 Editor de artículo

Ruta objetivo:

```txt
/cms/articles/:id
```

Responsabilidad:

- Editar metadata.
- Editar bloques de contenido.
- Guardar cambios.
- Cambiar estado editorial.

### 4.4 Lista de artículos

Ruta objetivo:

```txt
/cms/articles
```

Filtros:

- status
- category
- search text
- date
- author

### 4.5 Audit Log

Ruta objetivo futura:

```txt
/cms/audit
```

Responsabilidad:

- Mostrar eventos de `news_audit_log`.
- Primera versión: lectura simple.

## 5. Estructura de archivos propuesta

```txt
src/
  pages/
    CmsStudio.tsx
    CmsGenerateNews.tsx
    CmsArticles.tsx
    CmsArticleEditor.tsx
  components/
    cms/
      CmsDashboard.tsx
      CmsGenerateForm.tsx
      CmsArticleList.tsx
      CmsArticleEditorPanel.tsx
      CmsContentBlockEditor.tsx
      CmsStatusBadge.tsx
      CmsCategorySelect.tsx
      CmsAuditTrail.tsx
  services/
    cms/
      newsApi.ts
      newsRepository.ts
      newsTypes.ts
      newsValidation.ts
```

## 6. Tipos base

```ts
export type NewsCategory = 'gaming' | 'tech' | 'science' | 'ai' | 'community' | 'green' | 'programming'
export type NewsStatus = 'draft' | 'review' | 'published' | 'archived'
export type ReviewStatus = 'pending' | 'approved' | 'rejected'

export type NewsContentBlock = {
  type: 'heading' | 'paragraph' | 'list' | 'quote'
  text: string
}

export type NewsArticle = {
  id: string
  slug: string
  title: string
  summary: string | null
  content: NewsContentBlock[]
  category: NewsCategory
  status: NewsStatus
  review_status: ReviewStatus
  tags: string[]
  source_urls: string[]
  ai_generated: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}
```

## 7. Integración con Supabase

Lecturas previstas desde cliente autenticado:

- `news_articles` por estado.
- `news_articles` por id.
- `news_audit_log` para admins.

Escrituras previstas:

- update de draft.
- cambio de estado.
- archivado.

La creación inicial puede hacerse vía `/api/generate-news` para mantener control server-side.

## 8. Integración con `/api/generate-news`

El CMS no debe generar directamente en Supabase en fase 1. Debe llamar al endpoint serverless:

```txt
POST /api/generate-news
```

Motivo:

- centralizar validación
- centralizar rate limit
- centralizar audit log
- mantener futuro LLM detrás de API

## 9. Seguridad

Requisitos:

- Solo usuarios admin pueden acceder a funciones del CMS.
- No mostrar drafts a usuarios públicos.
- No exponer `SUPABASE_SERVICE_ROLE_KEY` al cliente.
- No permitir HTML crudo en contenido.
- Registrar cambios sensibles en audit log.

## 10. Flujo editorial v1

```txt
Generate Draft
  -> Edit Draft
  -> Send to Review
  -> Approve
  -> Publish
  -> Archive if needed
```

Estados:

- `draft`: editable.
- `review`: pendiente de aprobación.
- `published`: visible públicamente.
- `archived`: oculto.

## 11. Roadmap de implementación

### PR CMS-1 — Documentación y navegación

- Crear arquitectura CMS.
- Agregar ruta `/cms/generate`.
- Crear página visual inicial sin conexión destructiva.

### PR CMS-2 — Generador funcional

- Formulario para llamar `/api/generate-news`.
- Manejo de errores.
- Respuesta con link al draft.

### PR CMS-3 — Lista de drafts

- Leer `news_articles`.
- Filtros por status/category.

### PR CMS-4 — Editor básico

- Editar título, resumen, tags, categoría y bloques.
- Guardar cambios.

### PR CMS-5 — Publicación

- Cambio de estado.
- Publicación manual.
- Preparación SEO.

## 12. Fases posteriores

Fuera de scope de CMS v1:

- LLM activo.
- Programación avanzada.
- Publicación automática en redes.
- Editor multimedia completo.
- Versionado de contenido.
- Workflow multiusuario avanzado.

## 13. Reglas para Gemini

Gemini debe registrar este documento como base de diseño del CMS profesional.

## 14. Reglas para Qwen

Qwen debe implementar por PRs pequeños. No agregar Zod/Vitest/otras dependencias sin actualizar lockfile desde entorno real.

## 15. Decisión final

El CMS profesional debe construirse en capas, no como una sola entrega grande.

Primera entrega recomendada:

```txt
PR CMS-1: navegación + /cms/generate visual scaffold
```

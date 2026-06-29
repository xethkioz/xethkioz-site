# API NEWS — `/api/generate-news`

Base: `v7.0.0-fusion-rc4`  
Branch: `feature/api-generate-news`  
Runtime: Vercel Serverless Function  
Status: Phase 1 scaffold

## Objetivo

Crear drafts de noticias para el News Engine y el CMS profesional de XETHKIOZ Fusion Platform.

La fase 1 no depende de un LLM externo. La función genera contenido estructurado desde plantillas y deja el artículo en estado `draft` para revisión editorial.

## Decisiones aprobadas

- Runtime: Vercel Serverless Function.
- Persistencia: Supabase.
- Estado inicial: `draft`.
- Generación: plantillas estructuradas.
- LLM: opcional en fase posterior, desactivado por defecto.
- Seguridad: solo usuarios con rol admin.
- `main`: base estable RC4, sin cambios directos.

## Endpoint

```http
POST /api/generate-news
Authorization: Bearer <supabase-access-token>
Content-Type: application/json
```

## Request

```json
{
  "category": "tech",
  "topic": "Avances en computación cuántica 2026",
  "title": "Avances en computación cuántica 2026",
  "summary": "Resumen opcional",
  "tags": ["quantum", "research"],
  "source_urls": ["https://example.com/article"],
  "useLLM": false,
  "language": "es"
}
```

## Response 201

```json
{
  "id": "uuid",
  "slug": "avances-en-computacion-cuantica-2026",
  "status": "draft",
  "previewUrl": "/news/avances-en-computacion-cuantica-2026?preview=1",
  "createdAt": "2026-06-29T18:42:10.000Z"
}
```

## Errores

- `400 VALIDATION_ERROR`
- `401 UNAUTHORIZED`
- `403 FORBIDDEN`
- `405 METHOD_NOT_ALLOWED`
- `409 SLUG_CONFLICT`
- `429 RATE_LIMITED`
- `500 INTERNAL_ERROR`

## Variables de entorno requeridas

```txt
VITE_SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
```

Opcional futuro:

```txt
OPENAI_API_KEY
```

## Supabase

La migración inicial crea:

- `news_articles`
- `news_audit_log`
- índices básicos
- políticas RLS para lectura pública de publicados y escritura admin

## Limitaciones de fase 1

- Rate limit en memoria, no distribuido.
- Idempotencia en memoria, no persistente.
- Sin LLM activo.
- Sin UI en CMS todavía.
- Tests automáticos quedan para el siguiente PR porque el proyecto aún no tiene Vitest ni Zod instalados en `package-lock.json`.

## Siguiente PR recomendado

1. Agregar Vitest y Zod con actualización real de lockfile.
2. Separar validadores a módulos testeables.
3. Integrar UI `/cms/generate`.
4. Agregar proveedor LLM opcional.

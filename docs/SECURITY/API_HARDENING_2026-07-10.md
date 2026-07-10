# API Security Hardening — 2026-07-10

## Alcance

Auditoría focalizada en:

- `api/admin-auth-link.ts`
- `api/generate-news/index.ts`

## Hallazgos corregidos

### `admin-auth-link`

- Redirect basado en headers manipulables.
- Falta de `Cache-Control: no-store`.
- Errores internos devueltos al cliente.
- Falta de rate limit.
- Validación de email demasiado permisiva.
- Falta de header `Allow` para métodos no soportados.

### `generate-news`

- Body nulo podía provocar excepción durante validación.
- `useLLM: true` marcaba contenido como generado por IA sin ejecutar un LLM.
- Tags sin sanitización.
- Idempotency key sin límite de longitud.
- Buckets en memoria sin limpieza.
- Error de lookup de slug no controlado.
- Error de audit log ignorado sin registro.
- Respuestas sin `Cache-Control: no-store`.

## Cambios aplicados

- Allow-list de hosts para redirect administrativo.
- Rate limit por IP en recuperación administrativa.
- Respuestas sensibles con `Cache-Control: no-store`.
- Errores internos normalizados.
- Validación estricta de email, token, body e idempotency key.
- `useLLM: true` rechazado en fase 1.
- `ai_generated` fijado en `false` hasta activar integración real.
- Sanitización de tags.
- Limpieza periódica de buckets en memoria.
- Registro de fallos de auditoría y lookup.

## Restricciones

- No se agregaron dependencias.
- No se modificaron tablas ni políticas RLS.
- No se tocaron variables de entorno.
- No se activó LLM.
- No se modificó `main` directamente.

## Validación requerida

- Preview Vercel en verde.
- `npm run deploy:check` local antes de merge si está disponible.
- Prueba del endpoint admin con token válido e inválido.
- Prueba de `/api/generate-news` con `useLLM: false` y `useLLM: true`.

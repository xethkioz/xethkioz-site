# XETHKIOZ — Production Readiness

**Versión:** 11.4.11  
**Revisión:** 2026-09-24  
**Repositorio canónico:** `xethkioz/xethkioz-site`

Este documento reemplaza el informe histórico de v2.0.0. El estado de producción debe verificarse con los workflows y auditorías actuales, no con puntuaciones antiguas.

## Gates obligatorios

Antes de mergear a `main`:

- `npm ci`
- `npm run typecheck`
- `npm run build`
- `npm run audit:dependencies`
- Browser Quality (Playwright + Axe)
- Lighthouse Quality
- preview de despliegue

## Estado técnico actual

- React/Vite/TypeScript con lazy loading por rutas.
- Supabase con RLS, roles y helpers privados.
- APIs serverless con validación y límites de entrada.
- CSP, HSTS y headers defensivos configurados.
- Sitemap, News Sitemap, RSS, OpenSearch, canonical y hreflang.
- Playwright en desktop y mobile.
- Axe y Lighthouse con presupuestos.
- Auditorías internas de seguridad, privacidad, SEO, runtime y bundle.

## Riesgos que deben seguir controlados

1. `main` debe estar protegido y exigir checks.
2. Las ramas temporales deben limpiarse después de mergear.
3. Los videos grandes deben migrarse progresivamente fuera del historial Git.
4. `supabase/migrations` es la fuente canónica; las migraciones históricas únicas que quedan en `database/migrations` deben conservarse hasta completar su inventario.
5. Factura Salud debe separarse del repositorio web.
6. `services/nexus` debe formalizarse como workspace o servicio independiente.
7. La CSP debería reducir gradualmente `'unsafe-inline'` cuando el stack lo permita.
8. Rate limiting de endpoints sensibles debería usar almacenamiento compartido/durable en vez de memoria por instancia cuando se requiera garantía global.

## Regla de release

Un release sólo se considera listo cuando CI, Browser Quality y Lighthouse quedan en verde sobre el commit que se pretende publicar.

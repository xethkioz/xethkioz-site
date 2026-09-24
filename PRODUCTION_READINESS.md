# XETHKIOZ — Production Readiness

**Versión:** 11.4.11  
**Revisión:** 2026-09-24

Este documento describe el criterio actual de preparación para producción. No es un score histórico.

## Gates obligatorios

Antes de mergear a `main`:

- `npm ci`
- `npm run typecheck`
- `npm run build`
- `npm run audit:dependencies`
- `npm run test:e2e`
- Lighthouse CI
- revisión del preview de Vercel

## Estado técnico

- React/Vite/TypeScript con TypeScript strict.
- Supabase con RLS y helpers privilegiados fuera del API público.
- CMS protegido por sesión y rol.
- CSP/HSTS/headers de seguridad configurados.
- SEO con canonical, hreflang, JSON-LD, sitemap, News sitemap, RSS y 404 real.
- Playwright prueba desktop/mobile; Axe cubre accesibilidad crítica; Lighthouse aplica budgets.
- Dependencias de producción bloquean advisories high/critical mediante `audit:dependencies`.

## Condiciones que bloquean una release

- cualquier workflow requerido en rojo;
- errores TypeScript;
- build fallido;
- high/critical vulnerability de producción;
- regresión de navegación o accesibilidad;
- secretos reales dentro del repositorio;
- cambios Supabase/RLS sin revisión explícita;
- assets privados de World of Xethkioz en el repositorio público.

## Mantenimiento pendiente

Ver `docs/TECH_DEBT.md`.

La existencia de deuda documentada no bloquea por sí sola una release; sí la bloquea una regresión activa de CI, seguridad, navegación o datos.

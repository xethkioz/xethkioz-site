# SECURITY — XETHKIOZ Web 11

**Revisión:** 2026-09-24

## Modelo

El repositorio es público. Se asume que todo archivo commiteado puede ser leído por terceros, incluso si luego se elimina de `main`.

## Secretos

Permitido en frontend:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY` / publishable key

Sólo servidor:

- `SUPABASE_SERVICE_ROLE_KEY`
- `XETHKIOZ_ADMIN_RECOVERY_TOKEN`
- claves privadas de proveedores

Nunca commitear `.env`, tokens administrativos, `sb_secret_*`, PEM, P12/PFX o credenciales personales.

## Supabase

- RLS debe permanecer habilitado.
- Browser roles reciben privilegios mínimos.
- Roles administrativos se resuelven desde `app_metadata` segura y/o tablas protegidas.
- Las funciones privilegiadas viven fuera del esquema público cuando corresponde.
- Migraciones nuevas: `supabase/migrations/`.

## HTTP y navegador

Producción aplica CSP, HSTS, X-Frame-Options, nosniff, Referrer-Policy y Permissions-Policy.

Los cambios de CSP deben validarse contra Vercel y Netlify. Evitar ampliar orígenes con comodines sin necesidad.

## CMS y APIs

- `/cms` requiere sesión y rol editorial.
- APIs administrativas requieren autorización server-side.
- Endpoints públicos validan método, tamaño y formato.
- Rate limiting en memoria es defensa complementaria, no un límite distribuido fuerte.

## Dependencias

`npm run audit:dependencies` bloquea advisories high/critical de dependencias de producción.

## Reporte

Canal público: `/.well-known/security.txt`.

## Historial

El repositorio tuvo un `.env` histórico con variables públicas de Supabase. No se detectó service-role key ni clave privada en ese archivo. La regla vigente es no commitear ningún `.env`, aunque contenga sólo valores públicos.

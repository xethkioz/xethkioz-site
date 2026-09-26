# XETHKIOZ Network

**Versión actual:** `v11.5.1`
**Release:** Infrastructure Maintenance · Pass 36
**Estado:** producción activa  
**Última revisión operativa:** 2026-09-26
**Dominio canónico:** https://www.xethkioz.com.ar  
**Hosting principal:** Vercel

XETHKIOZ Network es la plataforma pública de XETHKIOZ: World of Xethkioz, gaming, noticias, ciencia/tecnología, comunidad, Green Node, XETHKIOZ Studio y CMS editorial.

## Repositorio canónico

La fuente de producción es este repositorio: `xethkioz/xethkioz-site`.

Los forks o copias históricas no deben usarse como fuente de deploy ni como base de nuevas ramas sin sincronizarlos primero.

## Stack

- React 18 + Vite + TypeScript
- React Router
- Tailwind CSS
- Supabase Auth/Database/Realtime
- Vercel Serverless Functions
- Playwright + Axe
- Lighthouse CI
- GitHub Actions

Node soportado: **22**.

## Rutas públicas principales

| Ruta | Estado |
| --- | --- |
| `/` | Home / gateway |
| `/world-of-xethkioz` | Portal público del juego |
| `/gaming` | Gaming |
| `/gaming/guides` | Guías |
| `/science` | Ciencia y tecnología |
| `/news` | Noticias |
| `/community` | Comunidad |
| `/creacion-web` | XETHKIOZ Studio |
| `/support` | Apoyo voluntario |
| `/green-node` | Green Node, acceso mediante Wisp/gate |
| `/account` | Cuenta |
| `/profile` | Perfil |
| `/cms` | CMS protegido |

`/fun` y `/nexus-city` son rutas retiradas y redirigen a `/community`.

Las páginas públicas localizadas compatibles también existen bajo `/en/*`.

## Desarrollo

```bash
npm ci
npm run dev
```

Validación completa:

```bash
npm run typecheck
npm run build
npm run test:e2e
npm run deploy:check
```

## CI

GitHub Actions ejecuta:

- build + auditoría de producción;
- política de vulnerabilidades;
- Playwright + Axe en desktop/mobile;
- Lighthouse;
- auditoría nocturna.

Un cambio no debe considerarse listo para producción si cualquiera de los checks obligatorios falla.

## Variables de entorno

Frontend público:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Backend/serverless, sólo cuando el módulo correspondiente lo necesita:

```env
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
XETHKIOZ_ADMIN_RECOVERY_TOKEN=
```

Nunca subir `.env`, service-role keys, tokens administrativos ni credenciales privadas.

## Seguridad

- RLS habilitado en Supabase.
- Permisos privilegiados validados del lado servidor/RLS.
- CSP, HSTS y headers de seguridad en producción.
- CMS protegido por sesión/rol.
- Telemetría condicionada a consentimiento.
- `.gitignore` bloquea secretos, builds, caches y assets privados de World of Xethkioz.
- `/.well-known/security.txt` publica el canal de reporte.

Ver `docs/SECURITY.md`.

## Versionado

La versión de producción debe coincidir en:

- `package.json`;
- `package-lock.json`;
- `src/lib/siteConfig.ts`.

Ver `VERSION_POLICY.md`.

## Base de datos

La fuente activa de migraciones es `supabase/migrations/`.

`database/migrations/` contiene material histórico/compatibilidad y no debe recibir nuevas migraciones. La consolidación final de duplicados requiere reconciliación de historial antes de borrar archivos.

## Reglas de cambio

1. Crear rama desde `main`.
2. Cambios pequeños y reversibles.
3. Ejecutar build, auditorías y navegador.
4. Abrir PR.
5. Mergear sólo con checks verdes.
6. No borrar migraciones ni material histórico sin inventario previo.
7. No introducir assets privados del juego en este repositorio público.

## Deuda conocida

La deuda vigente está documentada en `docs/TECH_DEBT.md`. Las prioridades inmediatas son limpieza de ramas históricas, consolidación de documentación, separación de Factura Salud y revisión de duplicados multimedia/migraciones.
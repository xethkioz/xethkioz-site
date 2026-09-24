# XETHKIOZ Network

**Versión actual:** `v11.4.10`  
**Estado:** producción activa  
**Última revisión operativa:** `2026-09-24`  
**Repositorio canónico:** `xethkioz/xethkioz-site`  
**Dominio público:** `https://www.xethkioz.com.ar`

XETHKIOZ Network es el ecosistema web de XETHKIOZ: World of Xethkioz, noticias, gaming, ciencia/tecnología, comunidad, Green Node, creación web y herramientas editoriales.

## Producción

- Hosting principal: Vercel.
- Fallback/configuración secundaria: Netlify.
- Frontend: React 18 + Vite + TypeScript.
- Backend/API: funciones serverless en `/api`.
- Datos y autenticación: Supabase.
- Runtime de desarrollo/CI: Node 22.
- Build: `npm run build`.
- Verificación integral: `npm run verify`.
- Verificación de deploy: `npm run deploy:check`.

## Rutas públicas principales

| Ruta | Módulo | Estado |
| --- | --- | --- |
| `/` | Home / Portal Network | Activo |
| `/world-of-xethkioz` | World of Xethkioz | Activo |
| `/gaming` | Biblioteca gamer | Activo |
| `/gaming/guides` | Guías | Activo |
| `/news` | Noticias | Activo |
| `/science` | Ciencia y tecnología | Activo |
| `/community` | Comunidad | Activo |
| `/creacion-web` | XETHKIOZ Studio | Activo |
| `/support` | Apoyo voluntario | Activo |
| `/green-node` | Green Node | Activo con entrada especial |
| `/account` / `/login` | Cuenta | No indexable |
| `/profile` | Perfil | No indexable |
| `/cms` | CMS | Protegido / no indexable |
| `/mascotas/` | Huellas / Mascotas | Portal estático |

Las rutas `/fun` y `/nexus-city` se mantienen únicamente como compatibilidad y redirigen a `/community`.

## Stack

```text
React 18
Vite 8
TypeScript
TailwindCSS
React Router
React Helmet Async
Supabase JS
Vercel Analytics
Vercel Serverless Functions
Playwright
Axe
Lighthouse CI
```

## Comandos

```bash
npm ci
npm run dev
npm run typecheck
npm run build
npm run test:e2e
npm run verify
npm run deploy:check
```

## Calidad y seguridad

El proyecto incluye auditorías propias para:

- rutas y SEO runtime;
- privacidad y consentimiento;
- telemetría;
- sesión/auth;
- hardening;
- seguridad de comunidad;
- integridad editorial;
- dependencia/vulnerabilidades;
- accesibilidad;
- rendimiento y bundle inicial;
- protección de material privado de World of Xethkioz.

GitHub Actions ejecuta CI, Playwright/Axe, Lighthouse y una auditoría nocturna.

## Variables de entorno

Frontend público:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Backend/serverless cuando corresponda:

```env
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
XETHKIOZ_ADMIN_RECOVERY_TOKEN=
```

Nunca commitear valores reales de secretos. Las claves `service_role`, tokens administrativos y credenciales privadas deben existir únicamente en el proveedor de runtime correspondiente.

## Base de datos

La ubicación canónica de migraciones nuevas es:

```text
supabase/migrations/
```

`database/migrations/` contiene material histórico/compatibilidad y debe tratarse como legado hasta terminar la reconciliación.

## Flujo de cambios

1. Crear una rama desde `main`.
2. Ejecutar typecheck/build/auditorías.
3. Abrir PR hacia `main`.
4. Exigir CI, Browser Quality y Lighthouse en verde antes de mergear.
5. Verificar preview.
6. Recién entonces publicar.

No borrar migraciones, rutas, assets o ramas de respaldo sin verificar referencias y contar con reversión.

## Repositorios duplicados

`BlackMetalXeth/xethkioz-site` es un fork del repositorio canónico. No debe utilizarse como segunda fuente de producción; debe mantenerse sincronizado o archivarse cuando se confirme que ningún servicio depende de él.

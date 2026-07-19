# XETHKIOZ Network

**Versión actual:** `v10.0.0`
**Estado:** producción activa con flujo de revisión controlado.
**Última revisión operativa:** `2026-07-19`
**Dominio principal:** `https://xethkioz.com.ar`
**Dominio público:** `https://www.xethkioz.com.ar`

XETHKIOZ Network es el ecosistema web modular de la marca XETHKIOZ. Reúne portal gamer/tech, noticias, comunidad, perfiles, CMS, streaming, Science Lab, Green Node, Wisp, módulos editoriales y futuras automatizaciones con Supabase.

## Estado de producción

- Hosting principal actual: Vercel.
- Framework: React + Vite + TypeScript.
- Backend/API: funciones serverless en `/api`.
- Base de datos/auth: Supabase.
- Build esperado: `npm run build`.
- Verificación completa: `npm run verify`.
- Deploy hardening: `npm run deploy:check`.

La web debe tratarse como proyecto vivo. Los cambios de infraestructura, auth, CMS, Supabase, rutas públicas o seguridad deben pasar por rama de revisión antes de mergear a `main`.

## Módulos públicos y rutas principales

| Ruta | Módulo | Estado |
| --- | --- | --- |
| `/` | Home principal | Activo |
| `/news` | Noticias / Content OS | Activo |
| `/gaming` | Gaming & Technology | Activo |
| `/gaming/guides` | Guías de los juegos principales | Activo |
| `/science` | Science Lab | Activo |
| `/fun` | Creator / Fun Portal | Activo |
| `/community` | Comunidad | Activo |
| `/profile` | Perfil / estado de cuenta | Activo |
| `/account` | Acceso estable de cuenta | Activo |
| `/login` | Alias de acceso | Activo |
| `/confirm-email` | Confirmación de email | Activo |
| `/cms` | CMS protegido | Activo bajo guard |
| `/green-node` | Green Node oculto | Activo con gate |

## Módulos internos preparados

- Gaming & Technology.
- Science Lab.
- Green Node / Green Zone.
- Asia Gaming.
- AI Lab.
- Content OS.
- Creator Studio.
- Community OS.
- Wisp / easter eggs.
- CMS editorial.
- Supabase Realtime preparado para chat/comunidad.

## Stack técnico

```text
React 18
Vite
TypeScript
TailwindCSS
React Router
React Helmet Async
Supabase JS
Vercel Analytics
Vercel Serverless Functions
```

## Scripts principales

```bash
npm run dev
npm run build
npm run typecheck
npm run verify
npm run deploy:check
```

## Auditorías internas disponibles

```bash
npm run audit:env
npm run audit:production-ready
npm run audit:security-hardening
npm run audit:runtime
npm run audit:portal
npm run audit:news-factory
npm run audit:auth-nexus
npm run audit:supabase-hydration
```

## Variables de entorno requeridas

### Frontend público

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

### API/serverless

```env
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
XETHKIOZ_ADMIN_RECOVERY_TOKEN=
```

Regla: nunca commitear claves reales. Las claves deben vivir en Vercel/Netlify/Supabase según corresponda.

## Supabase / SQL

Las migraciones y baselines están en:

```text
supabase/migrations/
database/migrations/
```

Prioridad actual:

1. Confirmar auth estable.
2. Confirmar perfiles/admin roles.
3. Confirmar CMS protegido.
4. Revisar tablas editoriales.
5. Activar Realtime solo después de validar reglas RLS.

## Política de cambios

### Permitido directo en rama de revisión

- Documentación.
- Metadatos de versión.
- Fixes de build/typecheck.
- Limpieza de estados obsoletos.
- Checklists operativos.

### Requiere revisión antes de mergear

- Cambios en auth.
- Cambios en CMS.
- Cambios en Supabase/RLS.
- Cambios en rutas públicas.
- Cambios en headers/CSP.
- Cambios visuales grandes.
- Cambios que toquen funciones serverless.

### No hacer sin respaldo

- Borrar migraciones.
- Borrar rutas públicas.
- Modificar claves o secretos.
- Mover dominio/alias.
- Cambiar providers globales sin test.

## Deploy checklist

Antes de producción:

```bash
npm install
npm run verify
npm run deploy:check
```

Después del deploy:

- Revisar `/`.
- Revisar `/account`.
- Revisar `/profile`.
- Revisar `/news`.
- Revisar `/gaming`.
- Revisar `/science`.
- Revisar `/community`.
- Revisar `/cms` con usuario admin.
- Revisar consola del navegador.
- Revisar logs de Vercel.

## Estado operativo al 2026-07-06

- Producción en Vercel: activa.
- Dominio principal: activo.
- Alias `www`: activo.
- Últimos errores detectados: builds fallidos por TypeScript en funciones API que usan `process.env`.
- Corrección preparada: tipado local mínimo en `api/node-env.d.ts`, sin agregar dependencias nuevas ni tocar `package-lock.json`.
- Documentación anterior: actualizada desde v4/rc2 hacia v7 live.

## Siguiente etapa recomendada

1. Mergear esta rama solo si el preview/deploy build queda correcto.
2. Auditar `/api` completo.
3. Revisar seguridad de `admin-auth-link`.
4. Consolidar CMS + Supabase con roles reales.
5. Crear tablero de issues por módulo: Auth, CMS, Content OS, Community, Green Node, SEO, Ads, Streaming.

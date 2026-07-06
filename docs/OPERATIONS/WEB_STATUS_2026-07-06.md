# XETHKIOZ Web Operations Status — 2026-07-06

## Resumen ejecutivo

La web está activa en producción y el repositorio correcto es `xethkioz/xethkioz-site`. El objetivo de esta limpieza es dejar una base técnica ordenada para seguir trabajando sin depender del historial incompleto de chats anteriores.

## Estado confirmado

- Repositorio: `xethkioz/xethkioz-site`.
- Branch base: `main`.
- Branch de revisión: `review/web-ops-cleanup-2026-07-06`.
- Producción: Vercel.
- Framework: Vite.
- Stack frontend: React + TypeScript + TailwindCSS.
- Servicios conectados: Supabase + Vercel Analytics.
- Dominio principal: `xethkioz.com.ar`.
- Alias público: `www.xethkioz.com.ar`.

## Hallazgos corregidos en esta rama

### 1. Documentación atrasada

El `README.md` tenía referencias viejas a ramas v4/rc2 mientras el proyecto real ya declara `7.0.0-fusion-rc-live.1` en `package.json`.

Corrección:

- README actualizado a estado v7 live.
- Rutas públicas reorganizadas.
- Reglas de cambio y deploy documentadas.
- Variables de entorno separadas entre frontend y API.

### 2. Metadatos públicos atrasados

`src/lib/siteConfig.ts` tenía versión y fecha desalineadas.

Corrección:

- `SITE_VERSION` alineado con `package.json`.
- `SITE_RELEASE` actualizado a limpieza operativa.
- `SITE_BUILD_DATE` actualizado a `2026-07-06`.
- Estados internos antiguos `rc1.x` en sectores de control pasaron a nombres operativos actuales.

### 3. Build serverless con tipos Node

Vercel registró fallos por `process.env` en archivos API TypeScript. Esos archivos usan variables de entorno server-side, por lo que necesitan tipos Node disponibles durante el build.

Corrección:

- Se agregó `@types/node` a `devDependencies`.

## Pendientes no tocados todavía

Estos puntos requieren revisión adicional antes de tocar producción:

1. `package-lock.json` debe regenerarse con `npm install` o CI si GitHub/Vercel marca lock desfasado.
2. Revisar seguridad de `api/admin-auth-link.ts`.
3. Auditar `api/generate-news/index.ts` para límites, permisos y logs.
4. Confirmar configuración real de variables en Vercel.
5. Revisar Supabase RLS antes de activar comunidad real/realtime.
6. Confirmar CMS admin con usuario real.
7. Revisar si Netlify todavía se usa o queda solo como fallback histórico.

## Orden recomendado de trabajo

### Fase 1 — Estabilidad

- Fix de build.
- Documentación actual.
- Deploy preview correcto.
- Verificación de dominio.

### Fase 2 — Auth/CMS

- Login estable.
- Confirmación de email.
- Recuperación/admin auth controlada.
- Roles de admin/editor.
- CMS protegido.

### Fase 3 — Contenido

- Noticias propias.
- Radar externo curado.
- Science Lab con fuentes.
- Asia Gaming.
- SEO por artículo.

### Fase 4 — Comunidad

- Perfil.
- XP.
- Badges.
- Chat.
- Moderación.
- Donadores/sponsors.

### Fase 5 — Monetización

- Espacios de sponsor.
- Ads internos.
- Stream banners.
- Servicios web/seguridad.
- Bar Gaming Hub como línea de negocio futura.

## Regla operativa

No mergear cambios de infraestructura directo a `main` sin revisar preview, build y rutas críticas.

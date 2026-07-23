# XETHKIOZ Web 10.0 — Auditoría integral de producción

Fecha: 2026-07-23  
Repositorio: `xethkioz/xethkioz-site`  
Baseline auditado: `main@1a09b40a11658dedae253e6a99adf0e3d78551c3`  
Rama de remediación: `agent/full-audit-runtime-seo-133`

## 1. Veredicto ejecutivo

XETHKIOZ es una plataforma productiva y funcional, no un prototipo. La arquitectura, el CMS, la identidad visual, la seguridad de Supabase y el sistema de despliegues tienen una base sólida.

Calificación global de la baseline: **8.5/10**.

Los riesgos principales ya no están en el diseño del Home. Se concentran en consistencia HTTP/SEO, observabilidad, consentimiento de analítica, pruebas reales de navegador y reducción del peso global.

## 2. Alcance auditado

- GitHub: ramas, PR, CI, scripts de auditoría, rutas y módulos alcanzables.
- Vercel: producción, previews, build, rewrites, redirects, cabeceras, funciones y registros.
- Supabase: estado del proyecto, Auth, RLS, políticas, funciones, Edge Functions, Storage, advisors y logs.
- Aplicación: Home, Gaming, Guías, Ciencia, Fun/Nexus, Green Node, Noticias, perfiles, chat, CMS y Creación Web.
- SEO: canonical, shells estáticos, artículos, robots, sitemap, rutas antiguas y respuestas 404.
- Accesibilidad: navegación, foco, ARIA, reduced motion y contratos estáticos.
- Rendimiento: tamaños de bundles, CSS global, carga por ruta y consultas reales.
- Privacidad: telemetría propia, trackers externos, retención y rastreadores automatizados.

## 3. Estado técnico confirmado

### Build y rutas

- TypeScript: correcto.
- Auditoría de rutas: **42 rutas**, **160 módulos alcanzables** y **241 destinos internos**.
- Vite: **594–595 módulos** según el commit de auditoría.
- Build del cliente: aproximadamente 3.3–3.7 segundos en Vercel.
- Producción actual: `READY`.

### Bundle de referencia

- CSS global principal: **350.29 kB raw / 64.40 kB gzip**.
- JavaScript principal: **58.31 kB raw / 18.62 kB gzip**.
- Vendor: **162.83 kB raw / 54.15 kB gzip**.
- Supabase: **213.75 kB raw / 56.28 kB gzip**.
- Nexus Pixel ya tiene CSS aislado por ruta: **76.23 kB raw / 16.47 kB gzip**.
- Gaming Guides: **82.00 kB raw / 28.44 kB gzip**.
- Green Node: **68.25 kB raw / 23.52 kB gzip**.

### Supabase

- Proyecto: `ACTIVE_HEALTHY`.
- PostgreSQL: 17.6.
- Todas las tablas públicas auditadas tienen RLS habilitado.
- No se detectaron tablas con RLS activo y cero políticas.
- El Security Advisor no reportó fallos de RLS ni funciones privilegiadas expuestas.
- Advertencia pendiente: protección contra contraseñas filtradas desactivada.
- Las Edge Functions activas son `submit-web-quote`, `visit-log` y `admin-users`.
- `admin-users` exige JWT.

### Datos observados

- Artículos publicados/editoriales: 152 registros en `news_articles`.
- Perfiles: 4.
- Salas de chat: 9.
- Mensajes públicos: 17.
- Logs de visita: 362 durante la auditoría.
- Ofertas de creación web: 3.
- Salas y mensajes VIP: todavía sin actividad real.
- Buckets públicos configurados: `news-media` y `web-service-media`; sin objetos almacenados en la muestra auditada.

## 4. Hallazgos críticos

### C-01 — Soft 404 en rutas inexistentes

**Baseline:** una URL inventada respondía HTTP 200, con canonical y metadata del Home. Esto podía provocar indexación de rutas basura y reportes de soft-404.

**Remediación en esta rama:**

- Se enumeran explícitamente los deep links SPA válidos.
- Lo desconocido se envía a `api/not-found.ts`.
- La función devuelve HTTP 404, `noindex` y una página bilingüe de error.
- El build incorpora una auditoría que impide restaurar el catch-all a `index.html`.

### C-02 — `/nexus-city` duplicaba señales SEO

**Baseline:** Vercel servía un shell indexable y canonical propio para `/nexus-city`, mientras React redirigía a `/fun#nexus-city`.

**Remediación en esta rama:**

- Redirect HTTP permanente hacia `/fun#nexus-city`.
- Eliminación del rewrite SEO independiente.
- Eliminación del sitemap.
- Eliminación del generador de shell estático.

## 5. Hallazgos altos

### H-01 — Consulta real a una tabla `streams` inexistente

Gaming solicitaba `/rest/v1/streams` y Supabase respondía 404. La interfaz ocultaba el fallo mediante fallback, pero generaba ruido y trabajo de red innecesario.

**Remediación:** migración `20260723153000_streams_public_radar.sql` con:

- contrato compatible con `Stream`;
- lectura pública;
- mutaciones limitadas a ADMIN mediante helper privado;
- RLS;
- índices de publicación y señal activa.

La migración fue validada dentro de una transacción con rollback.

### H-02 — Analítica contaminada por bots

Los logs mostraron visitas de rastreadores y herramientas automatizadas dentro de `site_visit_logs`, inflando audiencia y rutas.

**Remediación:** `visit-log` identifica bots/crawlers y responde 202 sin guardar el evento.

### H-03 — Limpieza de retención repetida por cold starts

El marcador de seis horas vivía solo en memoria. Cada instancia nueva podía volver a ejecutar el DELETE de retención.

**Remediación:** el último cleanup se persiste en `site_settings`; la comprobación se limita a la ruta raíz y sobrevive a reinicios.

### H-04 — Ausencia de CSP

La baseline tenía HSTS, `DENY`, `nosniff`, Referrer Policy, COOP y Permissions Policy, pero no CSP.

**Remediación inicial:** `Content-Security-Policy-Report-Only` para inventariar dependencias antes de bloquearlas. No se activa enforcement hasta revisar consola y trackers reales.

## 6. Fortalezas verificadas

- CMS protegido por sesión y roles.
- ADMIN no depende de `user_metadata` editable.
- `ARCHITECT` ya no eleva automáticamente a administración.
- Helpers privilegiados fuera del esquema público.
- Políticas de noticias separadas por lector, autor y moderación.
- Storage con MIME y límites de tamaño.
- Rutas privadas y CMS con `noindex`.
- Artículos con HTML server-side, canonical y datos estructurados.
- Lazy loading de páginas y chunks específicos.
- Error boundaries, Safe Boot y fallbacks de imagen.
- Navegación con skip link, foco restaurado y anuncios de ruta.
- ES/EN amplio en interfaz y accesibilidad.
- Reduced motion aplicado en componentes visuales principales.
- Auditorías estáticas integradas al repositorio.
- Retención declarada de 30 días ejecutándose en producción.

## 7. Riesgos todavía abiertos

### Seguridad y cuenta

1. Activar protección contra contraseñas filtradas en Supabase Auth.
2. Verificar backup/PITR o realizar un dump cifrado y una prueba de restauración.
3. Ejecutar pruebas reales con dos cuentas para invitaciones VIP, expulsión y rate limit.
4. Reforzar el rate limit del chat público con almacenamiento durable, CAPTCHA o requisito de sesión.
5. Revisar CSP Report-Only y convertirla en CSP aplicada sin depender permanentemente de `unsafe-inline`.

### Privacidad

1. Implementar consentimiento explícito antes de cargar GA4, Clarity o Meta Pixel cuando estén configurados.
2. Añadir panel de preferencias para revocar analítica/publicidad.
3. Documentar y probar la purga de datos de cuenta y solicitudes comerciales.

### SEO internacional

1. Crear URLs inglesas indexables o una estrategia SSR/edge por idioma.
2. Añadir `hreflang` y canonical cruzado.
3. Generar shells sociales ingleses; `localStorage` no alcanza para bots.
4. Sustituir OG institucionales SVG por PNG/WebP 1200×630.

### Rendimiento

1. Dividir el CSS global de 350 kB raw.
2. Auditar la necesidad de cargar Supabase y Motion en todas las rutas públicas.
3. Diferir chat/Wisp en sesiones de lectura rápida cuando no sean críticos.
4. Aplicar `content-visibility` o carga progresiva a páginas extensas.
5. Revisar consultas paralelas por categoría en Ciencia y Gaming.

### Calidad continua

1. Añadir Playwright para rutas, auth y flujos críticos.
2. Añadir Axe para accesibilidad real.
3. Añadir Lighthouse CI con presupuestos de LCP, CLS, JS y CSS.
4. Incorporar capturas visuales mobile/desktop.
5. Probar teclado, reduced motion y zoom 200 % en navegador real.

### Mantenimiento

1. Consolidar las dos historias de migraciones (`database/migrations` y `supabase/migrations`).
2. Retirar páginas y hooks legacy no alcanzables cuando exista inventario firmado.
3. Investigar la advertencia indirecta de Node `url.parse()` observada en una función de noticias.
4. No eliminar índices marcados como “unused” hasta contar con tráfico representativo.

## 8. Nueva barrera automática

El script `scripts/runtime-seo-contract-check.mjs` se ejecuta en cada build y comprueba:

- redirects HTTP permanentes;
- ausencia del shell y sitemap duplicado de Nexus;
- deep links SPA válidos;
- 404 real y noindex;
- CSP Report-Only;
- tabla `streams` con RLS y escritura ADMIN;
- exclusión de bots;
- cleanup persistente de telemetría.

## 9. Limitaciones de esta auditoría

No se afirma un puntaje Lighthouse porque no se ejecutó un navegador instrumentado. Tampoco se realizaron todavía:

- restauración de backup;
- pruebas con dos usuarios reales;
- pruebas visuales automatizadas;
- navegación completa con lector de pantalla;
- verificación del envío real de correo de invitación;
- pruebas de carga sostenida.

Estos puntos permanecen abiertos y deben documentarse con evidencia, no asumirse.

## 10. Gates antes de producción

1. Build Vercel `READY` sin errores de compilación de Functions.
2. Probar HTTP 404 en una ruta inventada del preview.
3. Probar redirects de Nexus, Admin, Register y Web Creation.
4. Probar deep links de Green Node, pasaporte, sala y VIP.
5. Aplicar migración `streams`.
6. Desplegar la nueva versión de `visit-log`.
7. Repetir Security/Performance Advisors.
8. Confirmar ausencia de nuevos 4xx/5xx inesperados.
9. Fusionar mediante PR con squash.

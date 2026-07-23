# XETHKIOZ Web 10.0 — Auditoría integral y estado de remediación

Fecha de auditoría y cierre técnico: 2026-07-23  
Repositorio: `xethkioz/xethkioz-site`  
Baseline original: `main@1a09b40a11658dedae253e6a99adf0e3d78551c3`  
Main validado: `fdd00c9897f0ca1fa0760cf492c9d3e629699dd5`  
Producción pública confirmada: `d4e199196182060f35bf15da1edc86b3b97b308c`  
Último preview funcional confirmado: `f8b03c8551b0ab7a461254b04c7e2bf8700896cb`

## 1. Veredicto ejecutivo

XETHKIOZ es una plataforma productiva con arquitectura, CMS, identidad visual, SEO dinámico, controles de privacidad, RLS, CI y despliegues operativos. La baseline recibió **8.5/10** porque todavía cargaba demasiado CSS y librerías globales, carecía de CSP aplicada, mezclaba señales SEO y mantenía deudas de observabilidad.

Después de la remediación, el **main validado** alcanza una evaluación técnica aproximada de **9.3/10**. La diferencia hasta una calificación superior no está en el diseño general ni en el build: depende principalmente de pruebas reales de navegador, recuperación de backups, flujos multiusuario, controles externos de Supabase/Vercel y SEO internacional.

La producción pública confirmada todavía está algunos commits detrás del main. Este documento separa deliberadamente:

- **Fusionado y validado en main:** código aprobado por GitHub CI, TypeScript, auditorías y build.
- **Confirmado en producción:** deployment Vercel `READY` con aliases públicos.
- **Pendiente externo:** acciones que requieren plan pago, panel administrativo o prueba humana/instrumentada.

No se considera desplegado un cambio sólo porque haya sido fusionado.

## 2. Alcance auditado

- GitHub: ramas, PR, CI, scripts de auditoría, dependencias, rutas y módulos alcanzables.
- Vercel: producción, previews, rewrites, redirects, headers, functions, build y runtime logs.
- Supabase: proyecto, organización, plan, Auth, RLS, políticas, Edge Functions, Storage y advisors.
- Aplicación: Home, Gaming, Guías, Ciencia, Fun/Nexus, Green Node, Noticias, perfiles, chat, CMS y Creación Web.
- SEO: canonical, shells estáticos, artículos dinámicos, robots, sitemap, redirects y 404 reales.
- Accesibilidad: navegación, foco, ARIA, reduced motion y contratos estáticos.
- Rendimiento: bundles iniciales, CSS global, chunks por ruta y librerías diferidas.
- Privacidad: consentimiento, preferencias, telemetría, retención y exclusión de bots.
- Contenido: artículos publicados, portadas, metadata social y contratos del News Factory.

## 3. Estado actual medido

### 3.1 Build y rutas — main validado

Último build Vercel `READY` con el árbol funcional acumulado:

- Rutas declaradas: **42**.
- Módulos alcanzables: **167**.
- Destinos internos auditados: **242**.
- Módulos transformados por Vite: **258**.
- Build Vite: aproximadamente **3.4 segundos**.
- Build Vercel completo: aproximadamente **27 segundos**.
- TypeScript cliente y API: PASS.
- Runtime/SEO contracts: PASS.
- Privacy consent contracts: PASS.
- `npm audit --omit=dev`: **0 vulnerabilidades**.

### 3.2 Bundle — main validado

- CSS inicial principal: **215.21 kB raw / 38.91 kB gzip**.
- Presupuesto automático: máximo **225 kB raw / 41.5 kB gzip**.
- JavaScript principal: **66.52 kB raw / 20.56 kB gzip**.
- Vendor: **186.96 kB raw / 62.59 kB gzip**.
- Supabase diferido: **213.46 kB raw / 56.18 kB gzip**.
- Política de contraseña: **0.80 kB raw / 0.48 kB gzip**.
- Nexus Pixel CSS por ruta: **76.23 kB raw / 16.47 kB gzip**.
- Gaming Guides: **82.00 kB raw / 28.44 kB gzip**.
- Green Node: **68.25 kB raw / 23.52 kB gzip**.

Las **13 entradas HTML públicas** evitan precargar Supabase, Framer Motion y los chunks CSS exclusivos de rutas.

### 3.3 Datos editoriales — Supabase

Medición del cierre:

- Registros totales en `news_articles`: **152**.
- Artículos publicados y vigentes: **117**.
- Artículos publicados sin portada: **0**.
- Perfiles: **4**.
- Salas de chat: **9**.
- Mensajes de chat: **17**.
- Logs de visita presentes: **365**.

Las dos portadas faltantes de Meme Radar fueron asignadas con assets WebP first-party y metadata alt descriptiva. Canonical, Open Graph, Twitter Card y JSON-LD fueron verificados en el HTML público.

### 3.4 Supabase y seguridad de datos

- Proyecto: `ACTIVE_HEALTHY`.
- PostgreSQL: 17.6.
- Organización: plan **Free**.
- Tablas públicas auditadas con RLS habilitado.
- No se detectaron tablas públicas con RLS activo y cero políticas.
- Helpers privilegiados fuera del esquema público.
- `admin-users` exige JWT.
- Edge Functions activas auditadas: `submit-web-quote`, `visit-log` y `admin-users`.
- Security Advisor: única advertencia actual, **Leaked Password Protection Disabled**.

La protección nativa contra contraseñas filtradas requiere Supabase Pro o superior. Mientras el proyecto permanezca en Free, la aplicación exige para contraseñas nuevas 12 caracteres, minúscula, mayúscula, número y símbolo, sin bloquear el inicio de sesión de cuentas existentes. Esta política local no sustituye enforcement de servidor frente a clientes externos que llamen directamente Supabase Auth.

## 4. Remediaciones completadas

### 4.1 HTTP y SEO

- Rutas inexistentes devuelven HTTP 404 institucional con `noindex`.
- `/nexus-city` usa redirect HTTP permanente hacia `/fun#nexus-city`.
- Eliminados shell, sitemap y canonical duplicados de Nexus City.
- Redirects legacy de Admin, Register y Web Creation protegidos por contratos.
- Deep links de Green Node, pasaportes, salas y VIP preservados.
- Artículos públicos reciben HTML server-side, canonical, OG, Twitter y `NewsArticle` JSON-LD.
- El shell dinámico de noticias obtiene `slug` desde `request.url` mediante WHATWG `URL`.
- `request.query` está prohibido por contrato en `api/news-page.ts` para no activar `url.parse()` en launchers Vercel antiguos.

### 4.2 Rendimiento

- Supabase salió del arranque público y se carga sólo cuando una ruta/función lo necesita.
- Framer Motion salió del arranque global.
- El contador animado utiliza `SmoothNumberValue` local y responde en vivo a `prefers-reduced-motion`.
- CSS global dividido de forma determinista por propietarios:
  - Home.
  - Gaming/Fun.
  - Secciones Gaming.
  - Science.
  - Green Node.
  - NexusDistrict.
  - Editorial/noticias/guías.
  - Fun/Nexus City.
  - Pasaporte.
  - Salas.
- CSS inicial reducido desde aproximadamente **64.7 kB gzip** a **38.9 kB gzip**, una mejora aproximada del **40 %**.
- Presupuesto de bundle obligatorio integrado al build.

### 4.3 Seguridad web y dependencias

- CSP aplicada en producción, manteniendo una política report-only más estricta para la siguiente fase.
- `default-src 'self'`, `object-src 'none'`, `frame-ancestors 'none'` y `script-src-attr 'none'` protegidos por contrato.
- React Router actualizado a **7.18.1** para cerrar tres avisos moderados.
- CI conserva `npm-audit.json` como evidencia cuando la auditoría falla.
- Estado actual de dependencias de producción: **0 vulnerabilidades conocidas por npm audit**.
- `api/node-env.d.ts` dejó de estrechar artificialmente el global `process`; las funciones API usan el entorno completo de `@types/node`.

### 4.4 Auth

- Política compartida para registro y cambio/recuperación de contraseña.
- Cobertura en `/account`, `XethkiozNexusAuth`, `CreatorAccount` legacy y `AuthNexusService.signUp()`.
- Checklist de requisitos accesible mediante `aria-describedby` y `aria-invalid` contextual.
- Inicio de sesión compatible con cuentas antiguas: sólo exige contraseña no vacía antes de enviar a Supabase.
- Contratos automáticos evitan reintroducir registros débiles desde superficies conocidas.

### 4.5 Privacidad y observabilidad

- Trackers opcionales apagados por defecto.
- Consentimiento granular y revocable.
- Rutas privadas excluidas de tracking.
- Bots y crawlers excluidos de `site_visit_logs`.
- Retención de 30 días con marcador persistente de cleanup.
- Endpoint diagnóstico `/triggers/github` retirado del repositorio y producción pública confirmada devuelve 404 institucional.
- Hook Vercel Connect identificado: `647366100`, agente `Vercel-Connex/1.0`.

### 4.6 Datos y contenido

- Tabla `streams` creada con lectura pública, RLS e índices.
- Mutaciones de streams limitadas a ADMIN mediante helper privado.
- Portadas Meme Radar versionadas en una migración idempotente.
- `audit:news-factory` protege los assets, slugs, alt y asignaciones.
- Cero artículos publicados sin portada en la medición actual.

## 5. Matriz de despliegue

### Producción pública confirmada

Deployment: `dpl_7KU1AznY3XgtzLGKXKEMKxSAXraw`  
Commit: `d4e199196182060f35bf15da1edc86b3b97b308c`  
Estado: `READY`  
Aliases: `www.xethkioz.com.ar`, `xethkioz.com.ar`

Incluye, entre otras remediaciones:

- CSS por rutas y presupuesto inicial.
- Supabase y Motion fuera del arranque público.
- CSP enforcement.
- React Router 7.18.1.
- `npm audit` con cero vulnerabilidades.
- Eliminación del endpoint diagnóstico de `/triggers/github`.

### Fusionado en main y validado, pendiente de producción pública nueva

Main: `fdd00c9897f0ca1fa0760cf492c9d3e629699dd5`

- Política fuerte para contraseñas nuevas.
- Cobertura de Auth legacy y guardia del servicio.
- Migración reproducible de portadas Meme Radar.
- Corrección del tipo global `process` en APIs.
- Parser WHATWG de `slug` sin `request.query`.
- Contrato contra la reintroducción de `DEP0169`.

Existe preview `READY` para el cambio funcional del parser de artículos, pero no se considera sustituto de un deployment público y una prueba fría observable.

## 6. Barreras automáticas actuales

Cada build relevante valida:

- 42 rutas y destinos internos.
- 404 HTTP real y `noindex`.
- Redirects y deep links.
- Canonical y shell dinámico de artículos.
- Parser WHATWG y ausencia de `request.query`.
- CSP enforcement y política report-only.
- Privacidad, consentimiento y revocación.
- Streams con RLS e índice de ownership.
- Telemetría sin bots y cleanup persistente.
- CSS inicial bajo **225 kB raw / 41.5 kB gzip**.
- Emisión de diez chunks CSS de ruta.
- 13 entradas públicas sin Supabase, Motion ni CSS de ruta precargado.
- Política de contraseñas y compatibilidad de login.
- Portadas editoriales de Meme Radar.
- `npm audit --omit=dev` con bloqueo del CI y evidencia JSON.

## 7. Riesgos abiertos y bloqueos externos

### Seguridad e infraestructura

1. Actualizar Supabase a Pro y activar **Prevent use of leaked passwords**; luego repetir Security Advisor.
2. Retirar desde Vercel Team → Connect el trigger destination Hook ID `647366100`, sin desconectar la integración Git normal.
3. Confirmar 24 horas sin nuevos POST a `/triggers/github`.
4. Verificar backup/PITR o ejecutar dump cifrado y prueba de restauración.
5. Probar rate limit, expulsión e invitaciones VIP con dos cuentas reales.
6. Reforzar rate limit del chat con almacenamiento durable, CAPTCHA o sesión obligatoria si aumenta el abuso.

### Confirmación pendiente de runtime

1. Desplegar públicamente el main posterior a `fdd00c9`.
2. Provocar un cold start de un artículo.
3. Confirmar en logs cero `DEP0169` para `/api/news-page`.
4. Cerrar el issue sólo después de esa evidencia.

### Calidad de navegador

1. Incorporar Playwright para rutas, Auth y flujos críticos.
2. Incorporar Axe para accesibilidad dinámica.
3. Ejecutar Lighthouse CI con presupuestos de LCP, CLS, JS y CSS.
4. Añadir regresión visual mobile/desktop.
5. Probar teclado, reduced motion y zoom 200 % en navegador real.
6. Validar que la carga de CSS por navegación interna no produzca flash visual.

### SEO y contenido internacional

1. Crear URLs inglesas indexables o estrategia SSR/edge por idioma.
2. Añadir `hreflang` y canonical cruzado.
3. Generar shells sociales ingleses.
4. Sustituir OG institucionales SVG por PNG/WebP 1200×630.

### Mantenimiento

1. Consolidar las historias de migraciones `database/migrations` y `supabase/migrations`.
2. Retirar páginas y hooks legacy sólo después de un inventario firmado.
3. No eliminar índices informados como “unused” hasta contar con tráfico representativo.
4. Migrar progresivamente estilos heredados restantes de `index.css` sin usar purga heurística.

## 8. Fortalezas verificadas

- CMS protegido por sesión y roles.
- ADMIN no depende de `user_metadata` editable.
- `ARCHITECT` no eleva automáticamente a administración.
- Políticas de noticias separadas por lector, autor y moderación.
- Storage con MIME y límites de tamaño.
- Rutas privadas y CMS con `noindex`.
- Lazy loading de páginas y CSS por ruta.
- Error boundaries, Safe Boot y fallbacks de imagen.
- Navegación con skip link, foco restaurado y anuncios de ruta.
- ES/EN amplio en interfaz y accesibilidad.
- Reduced motion reactivo.
- CI con auditorías de arquitectura, seguridad, privacidad, SEO, contenido y bundle.
- Producción pública con CSP enforcement y cero vulnerabilidades npm conocidas.

## 9. Limitaciones de la auditoría

No se publica una puntuación Lighthouse porque no fue posible ejecutar un navegador instrumentado confiable dentro del entorno de auditoría. Tampoco se afirma haber realizado:

- restauración real de backup;
- pruebas con dos usuarios reales;
- capturas visuales automatizadas;
- navegación completa con lector de pantalla;
- envío real de invitaciones VIP;
- pruebas de carga sostenida;
- validación visual de todas las rutas a 200 % de zoom.

Estas limitaciones permanecen explícitas. Ningún check estático se presenta como sustituto de una prueba humana o de navegador.

## 10. Gates para el próximo deployment público

1. GitHub CI verde sobre el commit de main.
2. Vercel Production `READY` con aliases públicos.
3. Home y rutas principales responden HTTP 200.
4. Ruta inventada responde HTTP 404 institucional.
5. Redirects de Nexus, Admin, Register y Web Creation correctos.
6. Deep links de Green Node, pasaporte, sala y VIP correctos.
7. `/account` incluye la política de contraseña nueva sin bloquear logins existentes.
8. Ambos artículos Meme Radar mantienen OG y alt correctos.
9. Cold start de artículo sin `DEP0169`.
10. Cero 4xx/5xx inesperados en funciones después del despliegue.
11. Repetir Security Advisor y confirmar que la única advertencia siga siendo la función de Auth bloqueada por el plan Free.
12. Fusionar y desplegar únicamente mediante PR trazable.

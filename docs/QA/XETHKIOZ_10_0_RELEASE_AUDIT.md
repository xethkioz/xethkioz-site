# XETHKIOZ Web 10.0 — Auditoría de lanzamiento

Fecha: 2026-07-19  
Rama: `agent/editorial-depth-03`  
Release: `10.0.0 · Nexus City Multiverse Production Release`

## Resultado del candidato

**PASS para preview y promoción controlada.** El lanzamiento queda condicionado a que el commit publicado conserve los checks verdes y a una verificación final del dominio productivo luego del merge.

## Alcance revisado

- Home, portales, Wisp móvil/escritorio y transición de Green Node.
- Gaming, guías, Science, Fun, Creación Web, noticias y artículo individual.
- Autenticación persistente, perfil, actividad, chat y desplazamiento al último mensaje.
- CMS, publicación editorial, carga de portadas, anuncios y solicitudes web.
- SEO técnico, metadatos, sitemap, rutas públicas e imágenes.
- Supabase Auth, RLS, migraciones, índices, API, Realtime y Edge Functions.
- Dependencias, TypeScript, compilación Vite, responsive y accesibilidad básica.
- Telemetría de visitas, privacidad, retención y logs operativos.

## Evidencia automática

| Control | Resultado |
|---|---:|
| Auditoría consolidada | PASS |
| Production readiness | PASS |
| Variables públicas de entorno | PASS |
| TypeScript | PASS |
| Build Vite 8.1.5 | PASS |
| `npm audit --omit=dev` | 0 vulnerabilidades |
| Integridad del diff | PASS |
| Rutas públicas del preview | PASS |
| Imágenes del preview | 0 rotas |
| Overflow horizontal desktop/móvil | 0 detectado |

## Verificación visual y funcional del preview

- Home: los tres mundos V3 cargan completos, mantienen su energía ambiental y se integran al fondo sin recortes rígidos.
- Wisp: acceso visible y funcional a Green Node; la carga misteriosa de 2–3 segundos se ejecuta antes de abrir el nodo.
- Noticias: lectura extensa, imagen clara, subtítulos, párrafos y fuente oficial directa.
- Rutas verificadas: `/`, `/gaming`, `/gaming/guides`, `/science`, `/fun`, `/creacion-web`, `/news`, un artículo real y `/green-node`.
- Semántica: `main`, `h1`, idioma `es-AR`, regiones vivas y navegación pública presentes.

## Correcciones de plataforma

- Versión unificada en paquete, UI, health check, configuración y base de datos.
- Dependencias compatibles actualizadas sin introducir saltos mayores de React, Router, Tailwind o TypeScript.
- Sitemap ampliado con `/gaming/guides`.
- Fundación de monetización activada con slots y campañas protegidos por RLS.
- Índices agregados para relaciones de artículos, comentarios y campañas.
- Políticas RLS optimizadas para evitar evaluaciones repetidas y lecturas administrativas solapadas.
- Edge Function `visit-log` actualizada a la versión 2; la limpieza de retención se ejecuta como máximo una vez cada seis horas por instancia activa.

## Logs y datos

- Las consultas públicas actuales de noticias responden correctamente.
- Auth muestra inicios, renovaciones y revocaciones de sesión normales, sin exponer datos personales en este informe.
- Realtime y chat muestran conexiones normales.
- El 404 histórico de `ads_campaigns` quedó resuelto con las migraciones de 10.0.
- Los errores históricos de feed/noticias correspondían a permisos ya corregidos; no representan el estado actual.

## Riesgos aceptados y seguimiento

- Supabase mantiene advertencias por cuatro funciones `SECURITY DEFINER` ejecutables por usuarios autenticados. Son funciones booleanas de rol usadas deliberadamente por RLS y Storage; revocar su ejecución rompería permisos del CMS.
- La protección contra contraseñas filtradas continúa desactivada en la configuración de Auth. No bloquea el lanzamiento, pero debe activarse desde el panel de Supabase.
- Los índices nuevos aparecen inicialmente como “sin uso”; se conservarán hasta contar con tráfico suficiente para medirlos.
- Las actualizaciones mayores de framework se posponen a una rama separada para no mezclar una migración de React/Router/Tailwind con este lanzamiento.

## Gate de promoción

1. Publicar el commit 10.0 en el PR.
2. Esperar preview y checks de Vercel en verde.
3. Repetir smoke test público.
4. Marcar el PR listo, mergear y verificar el dominio productivo.
5. Revisar logs posteriores al despliegue antes de declarar la release estable.

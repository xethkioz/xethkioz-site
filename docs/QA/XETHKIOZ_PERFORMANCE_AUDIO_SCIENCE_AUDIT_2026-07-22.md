# XETHKIOZ — Auditoría profunda de experiencia, rendimiento y red científica

Fecha: 2026-07-22

Base auditada: `origin/main` en `379db038`

Alcance: Home, Gaming, Science, Fun/Nexus, Green Node, Creación Web, navegación global, medios, build, seguridad y contratos de auditoría.

## Resultado ejecutivo

La plataforma tiene una arquitectura pública amplia y estable: 41 rutas, 145 módulos alcanzables y 219 destinos internos verificados. TypeScript, build de producción, RLS/auth, seguridad, rutas, Nexus City y dependencias pasan sus controles. La producción previa a este cambio responde HTTP 200 en los portales principales y entrega assets versionados con caché inmutable.

El principal límite para equipos modestos no era el JavaScript de cada página, sino la suma de videos decorativos, animaciones continuas, filtros GPU, blur, sombras y CSS de Plaza Nexus cargado globalmente. También había tres contratos de auditoría atrasados respecto de la arquitectura actual, lo que hacía fallar la auditoría consolidada aun cuando el build terminaba.

## Hallazgos

| Área | Estado inicial | Riesgo | Resolución |
|---|---|---:|---|
| Modo de rendimiento | No existía una elección global del visitante | Alto en TV/PC modesta | Se agregó Full/Lite persistente y accesible |
| Video ambiental del Home | MP4 de 993 KB cargado en experiencia completa | Medio | Lite evita montarlo y Full conserva carga diferida |
| GPU y movimiento | Animaciones, blur, filtros y partículas en varias capas | Alto | Lite congela animación y elimina decoración costosa sin romper interacción |
| Música | No había motor aprobado ni archivos de audio | Medio | Motor Web Audio original, opt-in y cargado sólo al activarlo |
| Ciencia | XETHKIOZ y ArgenCiencia no estaban conectados | Medio | Selector de portal y vínculo permanente desde Science Lab |
| CSS inicial | 392.20 KB sin comprimir / 73.68 KB gzip | Medio | CSS exclusivo de Plaza Nexus pasó a su chunk de ruta |
| Auditoría Live | Exigía una clase eliminada del Home anterior | Alto para CI | Contrato actualizado al Home vigente |
| Auditoría Nexus | Exigía Nexus como página aislada | Alto para CI | Contrato actualizado a la integración Fun/Nexus |
| Auditoría Wisp | Exigía la identidad anterior del personaje | Alto para CI | Verifica ahora Zona Hack, runas, móvil y Green Node |
| OpenSearch | El test no reconocía llaves escapadas en XML | Bajo | Verificador compatible con XML válido |

## Implementación realizada

### Gráficos ON/OFF

- `ON · FULL`: experiencia completa con video, iluminación, partículas y movimiento.
- `OFF · LITE`: fondo estático liviano, sin video ambiental, sin animaciones continuas, blur ni filtros decorativos.
- La elección se guarda en `localStorage`, pero el sitio sigue funcionando si el navegador lo bloquea.
- Se muestra una recomendación de Lite cuando el navegador informa ahorro de datos, memoria limitada, pocos núcleos o movimiento reducido.
- Navegación, Wisp, chat, cuentas, Ciencia y Plaza Nexus conservan funcionalidad.

### Banda sonora por portal

- Inicio: Power Metal.
- Gaming: Nu Metal.
- Diversión: Glam Metal.
- Ciencia: Prog Cyber Metal.
- Nexus City: Industrial Metal.
- Green Node / Zona Hack: Black / Death Metal.

La música es instrumental procedural original, generada localmente con Web Audio. No descarga canciones, no usa material con copyright y no arranca automáticamente. El motor de 1.51 KB gzip se descarga únicamente después de que el usuario activa Música. Lite apaga y bloquea la reproducción.

### Vínculo Ciencia ↔ ArgenCiencia

- El portal principal de Ciencia abre un selector accesible con dos destinos.
- `XETHKIOZ Science Lab` conserva la sección propia.
- `ArgenCiencia` abre directamente `https://argenciencia.com/` en una pestaña aislada con `noopener noreferrer`.
- Science Lab incorpora además un enlace permanente para no depender sólo del modal del Home.

### Optimización adicional

El CSS exclusivo de Plaza Nexus dejó de cargarse en todas las páginas:

| Bundle | Antes | Después | Diferencia |
|---|---:|---:|---:|
| CSS principal sin comprimir | 392.20 KB | 346.63 KB | -45.57 KB |
| CSS principal gzip | 73.68 KB | 63.80 KB | -9.88 KB |
| Home JS gzip | 4.79 KB base | 5.00 KB | +0.21 KB |
| Audio procedural | incluido en main | 1.51 KB bajo demanda | 0 KB hasta activarlo |
| Selector científico | incluido en Home | 1.49 KB bajo demanda | 0 KB hasta abrirlo |

## Evidencia de verificación

- Auditoría consolidada XETHKIOZ 10.0: PASS.
- Auditoría Nexus City: 50/50.
- Auditoría Full/Lite, audio y Ciencia: 12/12.
- Auditoría de producción: PASS.
- Integridad de rutas: 41 rutas, 145 módulos, 219 destinos.
- TypeScript: PASS.
- Build Vite: PASS.
- Dependencias de producción: 0 vulnerabilidades.
- Smoke local: HTTP 200 en `/`, `/gaming`, `/science`, `/fun`, `/nexus-city/room/xethkioz`, `/creacion-web`, `/news` y `/opensearch.xml`.
- Producción previa: HTTP 200 en los portales públicos y ArgenCiencia.
- Assets de producción: caché `public, max-age=31536000, immutable` para medios versionados.

La revisión visual automatizada no estuvo disponible en el entorno local. Por eso la aprobación de publicación debe apoyarse además en el preview público de Vercel y sus logs antes del merge.

## Próximas mejoras recomendadas

1. Convertir `xethkioz-pixel-banner.mp4` (8.27 MB) a WebM/MP4 adaptativo y usar una variante móvil.
2. Comprimir `xethkioz-cover.png` (3.33 MB) a AVIF/WebP manteniendo el original de respaldo.
3. Eliminar o consolidar los dos videos Green Wisp duplicados de 1.97 MB cada uno tras confirmar cuál está en uso.
4. Diferir Supabase/chat en Lite hasta que el visitante abra cuenta, chat o una función social.
5. Medir Web Vitals separados por `FULL` y `LITE` para comprobar el beneficio en equipos reales.
6. Incorporar navegación específica para control remoto/D-pad si se prioriza Smart TV.
7. Agregar desde ArgenCiencia un backlink visible hacia Science Lab para que el vínculo sea bidireccional y útil también para descubrimiento SEO.
8. Diseñar un feed compartido con autoría y fuente explícitas, evitando duplicar artículos completos entre ambos portales.
9. Si más adelante se reemplaza la música procedural por canciones reales, usar masters propios o licencias documentadas y mantener el consentimiento manual.

## Decisión de salida

GO para preview. Merge a producción únicamente con Vercel READY, checks verdes, rutas públicas HTTP 200 y ausencia de errores runtime.

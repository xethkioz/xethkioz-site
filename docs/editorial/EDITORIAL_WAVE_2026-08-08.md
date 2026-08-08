# XETHKIOZ Editorial Wave — 2026-08-08

## Estado

Carga aplicada directamente al CMS/Supabase productivo.

- 7 publicaciones nuevas
- 4 Green Node
- 1 Gaming
- 1 Ciencia
- 1 IA
- `status = published`
- `review_status = approved`
- fuentes primarias almacenadas en `source_urls`
- mínimo editorial de 220 palabras conservado
- inserción idempotente por `slug`

## Green Node

1. `green-tor-browser-160a9-alpha-2026`
   - Tor Browser 16.0a9 y diferencia entre canal Alpha y estable.
   - Fuente: Tor Project.
2. `green-ubuntu-usn-kernel-julio-2026`
   - Cómo interpretar las grandes tandas de CVE del kernel sin confundir cantidad con exposición real.
   - Fuente: Ubuntu Security Notices / Canonical.
3. `green-firefox-150-ai-vulnerabilidades-2026`
   - Mozilla, Firefox 150 y descubrimiento de vulnerabilidades asistido por IA.
   - Fuentes: Mozilla.
4. `green-mozilla-root-store-policy-31`
   - Web PKI, certificados y Mozilla Root Store Policy 3.1.
   - Fuente: Mozilla Security Blog.

## Otras secciones

5. `gaming-xbox-precios-consolas-agosto-2026`
   - Nueva política global de precios de consolas Xbox desde agosto.
   - Fuente: Xbox Wire.
6. `science-eclipse-total-agosto-2026-nasa`
   - Cobertura científica del eclipse total de agosto de 2026.
   - Fuentes: NASA.
7. `ai-openai-ciencia-nacional-2026`
   - IA de frontera aplicada a laboratorios, simulación y supercomputación.
   - Fuente: OpenAI.

## Criterio editorial

- noticias y guías separan hechos confirmados de interpretación;
- no se publican precios argentinos sin referencia local verificable;
- versiones Alpha de software no se presentan como recomendación para uso sensible;
- seguridad se explica desde mitigación, actualización y contexto, no desde alarmismo;
- las afirmaciones futuras se presentan como planes anunciados y no como resultados consumados.

## Hallazgo técnico de la misma revisión

Vercel registró tres respuestas `503` consecutivas en `/api/visit-log`. El frontend reintentaba hasta tres veces una telemetría opcional cuyo RPC requiere `service_role`. La corrección de esta rama hace que la telemetría propia sea opt-in mediante `VITE_VISIT_TELEMETRY_ENABLED=true`, evitando generar errores cuando el secreto server-side no está configurado.

## Gate de dependencias

La auditoría de seguridad detectó el advisory de React Router que afecta versiones anteriores a `7.18.2`. La rama se actualizó a `react-router` y `react-router-dom` `7.18.2`, regenerando `package-lock.json` contra el registro real de npm. Este commit documental fuerza una ejecución normal de CI después del commit automatizado del lockfile para validar nuevamente build, navegador y Lighthouse antes del merge.

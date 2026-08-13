# XETHKIOZ v11 — Backup y rollback

Fecha del recovery point: 2026-08-13

## 1. Código

### Producción congelada

Commit:

`54252877b671d42b8c8902646998a8857b5d2be4`

### Rama de recuperación

`snapshot-20260813-pre-v11`

La rama apunta al commit productivo anterior al inicio de v11. No debe recibir desarrollo normal.

### Rama de trabajo

`v11-audit-20260813`

Todo cambio estructural de v11 se desarrolla y valida fuera de `main`.

## 2. Snapshot editorial/config de Supabase

Proyecto: `pascicauudfyydzknoop`

Schema:

`snapshot_20260813_pre_v11`

Tablas copiadas:

- `news_articles` — 222 filas.
- `comicon_catalog` — 57 filas.
- `site_settings` — 3 filas.
- `ads_slots` — 4 filas.
- `ads_campaigns` — 4 filas.
- `web_service_offers` — 3 filas.
- `pet_posts` — 1 fila.
- `huellas_stats` — 1 fila.
- `streams` — 0 filas.
- `snapshot_manifest` — 1 fila.

### Datos excluidos deliberadamente

El snapshot NO duplica:

- `auth.users`.
- perfiles privados.
- mensajes privados/directos.
- safety reports.
- solicitudes de presupuesto.
- emails de newsletter.
- datos privados de usuarios.

Esto reduce la duplicación de información personal dentro de la misma base.

## 3. Qué protege este snapshot

Permite comparar o restaurar contenido editorial/configuración si una migración v11:

- archiva contenido incorrectamente;
- modifica catálogos;
- altera settings;
- cambia ofertas web;
- afecta contenido comunitario de Huellas.

## 4. Limitación importante

El schema snapshot vive dentro del mismo proyecto Supabase. Es un **recovery point lógico**, no un backup offsite ni un plan completo de disaster recovery.

Un fallo total del proyecto/proveedor podría afectar producción y snapshot simultáneamente.

Antes del release final v11 se requiere además:

1. export lógico de esquema/migraciones;
2. export de contenido crítico a almacenamiento externo cifrado/controlado;
3. comprobación de que GitHub contiene todas las migraciones necesarias;
4. procedimiento de restore probado en un entorno no productivo;
5. registro de versión y checksum del backup externo.

## 5. Rollback de código

Si una versión v11 llega a producción y presenta una regresión crítica:

1. detener nuevos merges;
2. identificar el deployment anterior estable en Vercel;
3. volver a desplegar/revertir hacia el commit conocido estable correspondiente;
4. no ejecutar rollback destructivo de DB hasta determinar compatibilidad de esquema;
5. verificar `/`, `/gaming`, `/comicon`, `/news`, `/creacion-web`, `/mascotas/`, `/nexus-city`, autenticación y CMS;
6. revisar runtime errors y logs;
7. documentar causa y corrección antes de reintentar release.

## 6. Rollback de contenido

Nunca restaurar `news_articles` completa sin comparar IDs/slugs y timestamps.

Procedimiento recomendado:

1. seleccionar las filas afectadas del schema snapshot;
2. comparar con producción mediante `id`, `slug`, `updated_at` y estado editorial;
3. restaurar sólo las filas necesarias dentro de una transacción/migración controlada;
4. regenerar sitemap/feed si corresponde;
5. smoke test de artículos restaurados.

## 7. Rollback de configuración

`site_settings`, `ads_slots`, `ads_campaigns` y `web_service_offers` también deben restaurarse de forma selectiva, no mediante truncado masivo.

## 8. Verificación antes de cualquier limpieza v11

Antes de borrar/archivar recursos:

- [ ] Existe referencia en el snapshot o Git.
- [ ] Se verificó que no contiene datos privados que no deban duplicarse.
- [ ] Se buscaron referencias en código/runtime.
- [ ] Si es un asset, se calculó SHA-256 antes de deduplicar.
- [ ] Si es DB, se entiende la FK/RLS/grant/RPC relacionada.
- [ ] Si afecta SEO, se definió redirect/canonical/sitemap.
- [ ] Existe una forma explícita de revertir.

## 9. Gate de release v11

No fusionar v11 a `main` hasta que:

- CI y build estén verdes.
- Playwright desktop/mobile esté verde.
- Axe no tenga fallos críticos/serios.
- Lighthouse cumpla budgets sin relajar umbrales sólo para aprobar.
- no existan advisories HIGH/CRITICAL de producción;
- sitemap, robots, canonicals y redirects estén revisados;
- migraciones de Supabase estén versionadas;
- restore procedure haya sido probado al menos una vez fuera de producción;
- Vercel Preview esté READY;
- haya checklist de smoke test posterior al deploy.

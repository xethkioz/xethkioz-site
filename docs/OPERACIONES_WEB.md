# XETHKIOZ Web — Registro operativo

## 2026-10-11 — Revisión de mantenimiento (sin eliminación)

### Vercel
- Preview `dpl_GUCDnpM8pK74sQzq6hPeqgVbBMVE`: `READY`; build Vite y auditorías de compilación completados.
- No confundir preview con producción; mantener rollback antes de promocionar.
- Advertencias de higiene: 13 migraciones históricas reflejadas; videos públicos de 36 MiB y 23 MiB. Conservar hasta verificar historial y referencias.

### GitHub
- PR #305 contiene portales SVG provisionales AION 2 / WoWForever y animación Green Node CSS. Pendiente: sustituir por recursos originales y comprobar visualmente en móvil antes del merge.
- No borrar ramas, archivos, historial ni snapshots por antigüedad sin inventario y confirmación de referencias.
- `npm run deploy:check` incluye `audit:dependencies`; `npm run build` no lo incluye. Ejecutar verificación de dependencias antes de producción.

### Supabase
- Proyecto `xethkioz-site` (`pascicauudfyydzknoop`) ACTIVE_HEALTHY; proyecto `Argenciencia` separado (`tvittanffqgjpsbujdgi`) ACTIVE_HEALTHY. No fusionar.
- Todas las tablas base del esquema `public` consultadas tienen RLS habilitado.
- Security Advisor: (1) `public.xethkioz_claim_activity` SECURITY DEFINER ejecutable por `authenticated`: diseño intencional documentado en issue #140, revisar controles antes de cambiar; (2) protección contra contraseñas filtradas deshabilitada: habilitar en Auth Settings.
- Performance Advisor: 10 tablas de snapshot sin PK y 31 índices marcados como sin uso; no borrar por estas señales solas.
- Migraciones históricas son registros de aplicación; no eliminar ni reescribir sin reconciliación y copia verificada.

### Pendientes prioritarios
1. Verificar `npm run deploy:check` / auditoría de dependencias y smoke tests en preview.
2. Revisar y activar protección de contraseñas filtradas en Supabase Auth.
3. Comprobar UX visual y recursos reales antes de publicar PR #305.
4. Revisar el webhook huérfano `/triggers/github` (issue #142) sin crear endpoint falso.
5. Programar traslado de videos grandes a CDN después de verificar sus consumidores.

### Regla de conservación
No se han borrado tablas, índices, migraciones, archivos ni despliegues en esta revisión. Mantener cambios auditables, mínimos y reversibles.

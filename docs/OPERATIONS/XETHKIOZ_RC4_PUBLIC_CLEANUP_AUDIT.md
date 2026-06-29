# XETHKIOZ RC4 Public Cleanup Audit

Fecha: 2026-06-29
Base: `v7.0-rc3-live`
Rama: `rc4-public-cleanup-wisp-banner`

## Objetivo

Sincronizar el estado público de XETHKIOZ Web con el multiverso XETHKIOZ y dejar preparada la siguiente etapa visual/funcional sin romper producción.

## Estado confirmado antes de RC4

- GitHub `main` vivo.
- Vercel production listo.
- Dominios `xethkioz.com.ar` y `www.xethkioz.com.ar` operativos.
- Tag estable: `v7.0-rc3-live`.
- Build local reportado: `npm run deploy:check` PASS.
- Auditoría local reportada: `npm audit --omit=dev` con 0 vulnerabilidades.

## Cambios RC4 aplicados en esta rama

### 1. Wisp y Green Zone

- El Wisp global ahora dispara el desbloqueo de Green Zone antes de navegar a `/green-node`.
- Se conserva la protección por `sessionStorage` en `App.tsx`.
- Se expone `setFocusRoute` desde `WispProvider` para mantener el bridge consistente.
- Se registra evento `green-unlock` + `green-mode` al activar el acceso oculto.

### 2. Limpieza pública de navegación

- Se removió Green Node del Footer público.
- Se eliminaron links públicos a rutas que no están montadas en `App.tsx`.
- El Footer ahora muestra solamente rutas públicas funcionales.
- Green Zone queda comunicada como acceso oculto por Wisp, no como link directo.

### 3. Banner del ecosistema

- Se agregó `XethkiozHeroBanner` como banner funcional dentro del World Gate.
- No depende de assets binarios externos.
- Sirve como placeholder visual oficial hasta cargar videos/banners finales al repositorio.

### 4. Metadata de versión

- `SITE_VERSION` actualizado a `v7.0-rc3-live`.
- `SITE_RELEASE` actualizado a `RC4 Public Cleanup + Wisp Green Zone + Media Banner`.
- `SITE_BUILD_DATE` actualizado a `2026-06-29`.

### 5. Configuración pública

- `LIVE_INTERNAL_LINKS` reducido a rutas montadas reales.
- Referencia externa de YouTube eliminada de Green Zone pública.
- Entradas planeadas del Network redirigen temporalmente a rutas reales para evitar NotFound público.

## Pendiente para RC4 antes de merge

- Ejecutar `npm run deploy:check`.
- Verificar Preview Deploy en Vercel.
- Probar manualmente:
  - Home
  - Footer
  - Wisp click → Green Zone
  - refresh directo en `/green-node` sin sesión debe volver al Home
  - rutas públicas del Footer no deben caer en NotFound

## Pendiente para RC5

- Rediseño visual completo del World Gate.
- Carga de assets binarios reales del banner.
- Separación formal de Media Engine.
- Revisión de CMS/Admin visibility.
- Auditoría real contra export Supabase/local DB.

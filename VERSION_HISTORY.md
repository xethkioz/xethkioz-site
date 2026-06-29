# VERSION HISTORY — XETHKIOZ Fusion Platform

## Estado actual — 2026-06-29

### Línea activa
`7.0.0-fusion-rc-live.1`

### Próximo objetivo operativo
`7.0.0-fusion-rc4`

### Base actual
La plataforma se encuentra en línea como XETHKIOZ Fusion Platform, con arquitectura modular orientada a ecosistema.

## Hito: PR #3 superseded por PR #5

### PR #3
- Título: `RC3 Performance: Lazy route loading kickoff`
- Estado: cerrado.
- Merge: no.
- Motivo: quedó desfasado frente a `main` después de avance del repositorio.

### PR #5
- Título: `RC3 Live Sync: Performance and hidden Green Node`
- Estado: cerrado.
- Merge: sí.
- Merge commit: `b06df6c59506836510a48a1cfa9a4cd5183d56d1`.

## Capacidades preservadas
- React + Vite + TypeScript.
- SPA Routing.
- Vercel Analytics.
- Account Access routes.
- Supabase como backend/base de datos.
- Portal modular.
- Green Node oculto y protegido.
- Wisp como entidad de acceso/experiencia.

## Capacidades incorporadas en el cierre RC3 hacia RC4
- Lazy route loading por página.
- Suspense fallback para rutas.
- Ocultamiento real de Green Node en hub visible y World Gates.
- Documentación de transición hacia RC4.

## Regla de continuidad
Antes de iniciar `/api/generate-news`, mantener este orden:

1. Confirmar `main` limpio.
2. Ejecutar `npm run deploy:check`.
3. Validar preview/producción en Vercel o Netlify.
4. Actualizar versión pública si se decide sellar RC4.
5. Recién después comenzar News API / generación dinámica.

# XETHKIOZ Fusion Alpha 0.2 — Structure Audit

## Resultado

Aprobado como corrección funcional menor.

## Build

```txt
npm install
npm run build
✓ 52 modules transformed
✓ built in 1.82s
```

## Cambios auditados

### `src/App.tsx`

Antes:

- El `Header` se ocultaba en rutas internas.
- Las rutas `/gaming`, `/science`, `/fun` y `/green-node` no mostraban ES/EN, sonido ni cuenta.

Después:

- El `Header` se renderiza globalmente.
- Los controles globales aparecen en todas las rutas públicas.
- Se mantiene `AppErrorBoundary` para aislar fallos del panel global.

### `package.json`

- Versión actualizada a `7.0.0-fusion-alpha.0.2`.

### `public/version.json`

- Versión pública sincronizada con Fusion Alpha 0.2.

### `src/pages/Home.tsx`

- Solo se actualizó el texto de estado del núcleo.
- No se cambió composición visual.

## SQL

No se aplicó SQL.

### Estado SQL observado

- Existen migraciones en `database/migrations` y `supabase/migrations`.
- Hay duplicación funcional entre migraciones RC.
- No deben ejecutarse todas juntas sin consolidación.
- Próxima fase debe clasificar migraciones antes de tocar Supabase.

## Decisión de arquitectura

Los controles globales pertenecen al ecosistema, no a una página.

Por lo tanto, `Header` debe vivir en `AppShell`, fuera de las rutas, y no debe depender de Home.

## QA manual recomendado

Revisar en navegador:

- `/`
- `/gaming`
- `/science`
- `/fun`
- `/green-node`

En cada ruta debe verse:

- ES/EN
- ON/OFF
- Cuenta
- Volver al núcleo cuando corresponda

## Estado

Fusion Alpha 0.2 queda habilitada como base técnica siguiente.

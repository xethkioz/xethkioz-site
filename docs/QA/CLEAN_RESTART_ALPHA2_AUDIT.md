# QA Audit — Clean Restart Alpha 2

## Validación técnica

Comandos ejecutados:

```bash
rm -rf node_modules dist
npm install
npm run build
```

Resultado:

- npm install: OK
- vulnerabilidades: no bloqueantes detectadas por build local
- TypeScript: OK
- Vite build: OK
- módulos transformados: 118
- build: exitoso

## Validación funcional esperada

Checklist para el usuario:

- `/` carga sin navbar tradicional.
- El panel superior derecho muestra idioma, audio visual y cuenta.
- Los tres portales aparecen como accesos principales.
- El Wisp verde aparece cerca del avatar/escena y no muestra instrucciones visibles.
- Click en el Wisp abre `/green-node`.
- `/gaming`, `/science`, `/fun` no muestran secciones mezcladas.
- Cada portal permite volver al núcleo.
- `/green-node` se mantiene separado, verde y simplificado.

## Cambios de arquitectura

- Se conserva el proyecto anterior funcional como base.
- Se reduce la interfaz pública sin borrar módulos internos.
- La simplificación se aplica primero a navegación/UX, evitando tocar Supabase o SQL.

## Pendiente

- Revisión visual en PC.
- Revisión visual en Redmi Note 13 Pro.
- Definir si el panel superior derecho requiere login real o placeholder temporal.
- Integrar assets finales de avatar vs dragón cuando estén disponibles.

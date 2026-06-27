# QA — Fusion Alpha 0.8 Wisp Entity

## Validaciones requeridas
- `npm run audit:wisp`
- `npm run audit:fusion`
- `npm run build`

## Criterio de aprobación
La versión es válida si:
- el Wisp existe como componente reutilizable;
- el Home no contiene markup hardcodeado del Wisp;
- el acceso a `/green-node` sigue funcionando;
- el build termina sin errores.

## Riesgo
Bajo. Cambio encapsulado en Home + componente nuevo + CSS.

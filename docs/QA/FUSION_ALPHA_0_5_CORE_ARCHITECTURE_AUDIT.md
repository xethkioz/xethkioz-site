# QA — Fusion Alpha 0.5 Core Architecture

## Validaciones esperadas

- `npm install`
- `npm run audit:architecture`
- `npm run audit:inventory`
- `npm run audit:sql`
- `npm run build`

## Alcance

Esta versión no cambia la experiencia visual base. Solo agrega contrato de arquitectura, auditoría de rutas y documentación.

## Riesgos

Bajo. Cambios de runtime mínimos: Home importa `FUSION_LABEL` para mostrar versión actual. El resto son scripts/documentación.

## Criterio de aceptación

- Build exitoso.
- La navegación pública sigue limitada a `/`, `/gaming`, `/science`, `/fun`, `/green-node`.
- Los redirects legacy siguen seguros.
- No hay SQL ejecutado.

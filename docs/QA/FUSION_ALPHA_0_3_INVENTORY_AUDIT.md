# QA — Fusion Alpha 0.3 Inventory & Safety Lock

## Build

- `npm install`: validado.
- `npm run build`: validado. Resultado: `✓ 52 modules transformed`, `✓ built in 1.57s`.

## Cambios realizados

- Versión actualizada a `7.0.0-fusion-alpha.0.3`.
- Agregado script `npm run audit:inventory`.
- Agregado inventario de arquitectura en `docs/ARCHITECTURE/FUSION_ALPHA_0_3_INVENTORY.md`.
- Agregada auditoría QA para Alpha 0.3.

## Riesgos

- Se detecta deuda técnica heredada en `src/pages`, `src/components` y migraciones SQL duplicadas.
- No debe eliminarse código heredado sin confirmar si todavía se reutilizará desde `WEBOrigenes`.
- No debe tocarse producción visual hasta crear una rama de recuperación.

## Verificación manual mínima

1. Abrir `/`.
2. Cambiar ES/EN.
3. Usar On/Off.
4. Entrar a `/gaming`, `/science`, `/fun`, `/green-node`.
5. Confirmar que los controles globales persisten.
6. Confirmar que no aparece error React en consola.

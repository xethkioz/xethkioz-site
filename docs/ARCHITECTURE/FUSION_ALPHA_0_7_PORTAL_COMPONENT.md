# Fusion Alpha 0.7 — Portal Component Foundation

## Contexto

La Home de XETHKIOZ debe ser una entrada al ecosistema, pero la implementación anterior tuvo un problema central: intentar resolver la visual como composición pegada o markup duplicado.

## Decisión

Se creó `FusionPortalGate` como componente base de los portales principales.

## Beneficio

- Reduce duplicación en `Home.tsx`.
- Evita que cada portal evolucione con markup diferente.
- Permite crear luego un Portal Engine real.
- Facilita animaciones, accesibilidad y responsive desde un solo punto.

## Estado actual

`FusionPortalGate` todavía usa las clases visuales existentes (`wow-portal-*`) para no alterar la visual base en esta revisión.

## Próxima evolución

Alpha 0.8 puede agregar:

- configuración de portal en `fusionConfig.ts` o `portalConfig.ts`;
- estados de portal: idle, hover, opening, locked;
- efectos por tone;
- soporte de assets externos generados con IA;
- transición de entrada a cada mundo.

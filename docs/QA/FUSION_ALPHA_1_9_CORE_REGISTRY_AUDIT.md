# QA — Fusion Alpha 1.9 Core Registry

## Verificaciones

- Portal Registry contiene gaming, science, green y fun.
- World Gate V5 consume `getPortalRegistry()`.
- Green Node conserva `unlockCondition: 'wispWatching'`.
- Home apunta al wrapper `engines/world/WorldGateV5`.
- Design Tokens existen y exportan tipado.
- Build debe pasar antes de deploy.

## Riesgos

- Tailwind config aún no consume `designTokens.ts` directamente.
- Hay componentes legacy en `src/components` que deberán migrarse gradualmente.
- No mover carpetas masivamente hasta preparar aliases y auditorías.

# XETHKIOZ Alpha 3.1 — AI Operational Pipeline ESM Fix

## Objetivo

Corregir el script operativo del sandbox para que funcione en un proyecto Node/Vite con `"type": "module"`.

## Cambio

```txt
runAiAudit.js  →  runAiAudit.mjs
require()      →  import
```

## Comando actualizado

```bash
node src/engines/world/sandbox/runAiAudit.mjs
```

## Encapsulamiento

No toca producción, providers, services, ProfileEngine ni Stage.

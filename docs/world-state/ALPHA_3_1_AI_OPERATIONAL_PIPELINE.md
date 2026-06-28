# XETHKIOZ Alpha 3.1 — AI Operational Pipeline

## Objetivo

Agregar herramientas operativas de sandbox para IA sin tocar producción.

## Archivos

```txt
src/engines/world/sandbox/aiOperationalConfig.ts
src/engines/world/sandbox/aiPromptFactory.ts
src/engines/world/sandbox/runAiAudit.js
src/engines/world/sandbox/AI_OPERATIONAL_PIPELINE.md
```

## Encapsulamiento

No se importa desde producción. Todo queda confinado al sandbox.

## Comando local

```bash
node src/engines/world/sandbox/runAiAudit.js
```

## Importante

`runAiAudit.js` no llama APIs externas. Solo verifica presencia de archivos sandbox y compatibilidad básica con `worldMotionVariants.ts`.

# AI Operational Pipeline

This sandbox contains local-only contracts for AI-assisted development.

## Files

```txt
aiOperationalConfig.ts
aiPromptFactory.ts
runAiAudit.mjs
```

## Local audit

From project root:

```bash
node src/engines/world/sandbox/runAiAudit.mjs
```

## Boundary

The operational files must not be imported into production UI. They define safe contracts for future Gemini/Omni/Nano Banana workflows only.

## ESM rule

The project uses `"type": "module"`, so executable sandbox scripts must use ESM syntax and `.mjs` extension.

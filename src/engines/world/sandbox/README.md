# XETHKIOZ AI Sandbox

This directory is intentionally isolated from production UI.

## Rules

- Do not import this folder from stable Stage components.
- Use this area only for AI-assisted experiments, prompts, shader prototypes and asset generation specs.
- Raw AI assets must not be shipped directly.
- Final approved outputs must be optimized to `.webp` or `.svg`.
- Final approved outputs must be manually placed in `public/assets/` with clear prefixes such as `ai_relic_bg.webp`.

## Files

```txt
index.ts
AiAssetSpecs.ts
ExperimentalShader.tsx
README.md
```

# GIT WORKFLOW — XETHKIOZ 11.4

## Fuente de verdad

Repositorio canónico:

```text
xethkioz/xethkioz-site
```

`main` representa producción.

## Flujo

```text
main
├── feature/*
├── fix/*
├── security/*
├── content/*
├── audit/*
└── release/*
```

## Reglas

1. Crear ramas desde `main` actualizado.
2. Evitar pushes directos a `main`.
3. Abrir PR.
4. Esperar CI, Browser Quality y Lighthouse.
5. Resolver fallos antes de mergear.
6. Verificar preview.
7. Mergear con historial claro.
8. Eliminar la rama temporal después de confirmar producción.

## Antes de abrir PR

```bash
npm ci
npm run typecheck
npm run build
npm run audit:dependencies
npm run test:e2e
```

## Commits

Usar mensajes descriptivos:

```text
feat: add ...
fix: correct ...
security: harden ...
perf: optimize ...
test: cover ...
docs: update ...
chore: maintain ...
```

No mezclar cambios no relacionados en un commit cuando puedan revisarse por separado.

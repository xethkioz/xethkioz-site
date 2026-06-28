# GitHub Actions Setup

## Secrets requeridos

En GitHub: `Settings` → `Secrets and variables` → `Actions` → `New repository secret`.

Crear:

```txt
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

## Workflows incluidos

- `.github/workflows/ci.yml`
- `.github/workflows/nightly-audit.yml`

## Validación esperada

Cada Pull Request debe ejecutar:

1. `npm ci`
2. `npm run audit:env`
3. `npm run audit:production-ready`
4. `npm run build`
5. `npm audit --omit=dev`

Si un paso falla, no se debe fusionar a `main`.

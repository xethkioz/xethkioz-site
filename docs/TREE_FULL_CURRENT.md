# TREE FULL CURRENT

**Snapshot:** 2026-09-24  
**Repository:** `xethkioz/xethkioz-site`

The repository changes frequently. This document keeps a stable high-level snapshot; generate the exhaustive tree from the checked-out revision with:

```bash
npm run audit:tree
```

## Current inventory

- 952 files
- 109 directories
- 1,061 total tree entries
- 340 files under `src/`

## Top-level working areas

```txt
.github/      GitHub Actions, Dependabot, CODEOWNERS and PR policy
api/          Vercel/serverless API handlers
database/     Historical database material; migrations are frozen
docs/         Architecture, operations, QA, security and historical reports
public/       Public static assets
roadmap/      Roadmap documents
scripts/      Build, audit and generation scripts
services/     Auxiliary services (including Nexus)
src/          React/Vite application
supabase/     Canonical Supabase migrations, functions and schema material
templates/    Repository templates
tests/        Playwright/Axe browser tests
tools/        Auxiliary tools pending separation where applicable
```

## Source of truth

- New database migrations: `supabase/migrations/`
- Production application: `src/`, `api/`, `public/`
- Canonical deployment config: `vercel.json`
- Secondary/fallback deployment config: `netlify.toml`

Historical root reports remain for traceability and should not be interpreted as the current architecture unless explicitly dated as current.

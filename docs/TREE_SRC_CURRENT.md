# TREE SRC CURRENT

**Snapshot:** 2026-09-24  
**Source files:** 340

Generate the exhaustive repository tree with `npm run audit:tree`.

## `src/` inventory

| Area | Files |
| --- | ---: |
| root | 9 |
| cms | 24 |
| components | 89 |
| data | 9 |
| design | 2 |
| engines | 82 |
| game | 3 |
| hooks | 1 |
| lib | 30 |
| pages | 77 |
| providers | 2 |
| services | 11 |
| types | 1 |

## Current architecture

```txt
src/
├── cms/          protected editorial/admin UI
├── components/   shared UI and portal components
├── data/         curated static catalogs
├── design/       design tokens
├── engines/      world/runtime/profile/portal engines
├── game/         web-side game/Nexus state modules
├── hooks/        application hooks
├── lib/          contexts, configuration and shared utilities
├── pages/        routed page surfaces
├── providers/    application providers
├── services/     auth, CMS, news, ads and Supabase services
├── types/        shared types
├── App.tsx       router/application shell
└── main.tsx      browser entrypoint
```

Legacy page files may remain for compatibility or deferred cleanup. Do not remove them solely because they are not listed as primary routes; confirm import/reference usage first.

# ARCHITECTURE — XETHKIOZ v4.0

## Diagnóstico inicial

La estructura actual funciona para una web de contenido, pero para v4.0 necesita separación profesional por responsabilidad.

## Estructura actual detectada

```txt
src/
├── components/
├── lib/
└── pages/
```

## Estructura objetivo

```txt
src/
├── app/
├── assets/
├── components/
│   ├── common/
│   ├── layout/
│   ├── ui/
│   └── features/
├── config/
├── contexts/
├── hooks/
├── layouts/
├── pages/
├── services/
├── styles/
├── types/
└── utils/
```

## Movimientos recomendados

- `src/lib/hooks.ts` → `src/hooks/`
- `src/lib/types.ts` → `src/types/`
- `src/lib/siteConfig.ts` → `src/config/`
- `src/lib/LangContext.tsx` → `src/contexts/`
- `src/lib/supabase.ts` → `src/services/supabase/`
- `Header.tsx` y `Footer.tsx` → `src/components/layout/`
- `Skeletons.tsx`, `SafeImage.tsx`, `Logo.tsx` → `src/components/ui/` o `common/`
- `SEO.tsx` → `src/components/common/seo/` o `src/services/seo/`

## Regla de migración

Mover archivos por bloques pequeños y ejecutar:

```bash
npm run build
```

después de cada bloque.

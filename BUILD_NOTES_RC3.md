# XETHKIOZ Network — BUILD NOTES RC3.0

Fecha: 2026-06-26  
Versión: v4.0.0-rc.3.0

## Objetivo de la revisión

Esta revisión agrupa cambios de arquitectura, UX y contenido estructural para avanzar sin consumir deploys en parches pequeños. La meta es que la plataforma se sienta más profesional, modular y preparada para CMS/Supabase/Netlify con una sola RC grande.

## Cambios principales

### 1. Home Command Center

- Reestructuración completa de la Home.
- Nuevo hero editorial con mensaje de plataforma.
- KPI strip para impacto, RC strategy, Content OS y comunidad.
- Portales principales visibles como nodos: Gaming Hub, Tech Lab, Science Lab y Green Node.
- Bloque Content OS con carriles editoriales hacia Gaming, Tecnología, Ciencia, Green Node, Streaming y CMS.
- Menos saturación visual: se redujo la dependencia del bloque NetworkPortalHub en la portada y se reorganizó la jerarquía.

### 2. Route splitting

- `src/App.tsx` migrado a `React.lazy` + `Suspense`.
- Separación de páginas en bundles para reducir el peso inicial.
- Loader de rutas con identidad XETHKIOZ.
- Se mantiene error boundary por rutas y chrome principal.

### 3. Internacionalización editorial preparada

- Nuevo módulo `src/lib/localizedArticle.ts`.
- `ArticleCard` ahora lee copy por idioma cuando existe.
- Soporte directo para futuros campos Supabase:
  - `title_en`
  - `title_zh`
  - `excerpt_en`
  - `excerpt_zh`
- Se agregaron traducciones manuales iniciales para notas destacadas de fallback.

### 4. Green Node 2.0

- Nuevo modelo editorial compartido en `src/lib/editorialModel.ts`.
- Green Node incorpora una matriz de conocimiento:
  - Sistemas
  - Programación
  - Infraestructura
  - Seguridad educativa
  - Exploración
  - Contenido
- Terminal actualizada con señales de matrix y news rotation.
- CTA directo para conectar Green Node con CMS.

### 5. Modelo editorial centralizado

Nuevo archivo:

```txt
src/lib/editorialModel.ts
```

Incluye:

- KPIs de Home.
- Portales principales.
- Carriles editoriales.
- Matriz Green Node.

Esto evita hardcode excesivo dentro de las páginas y deja la base lista para mover esos datos a Supabase o CMS.

## Validación realizada

- TypeScript: `node node_modules/typescript/lib/tsc.js -b` ejecutado correctamente.
- Build Vite no pudo ejecutarse dentro del contenedor porque el ZIP incluye `node_modules` incompleto para Linux/Rollup.

## Nota importante para Netlify/local

Antes de compilar en un entorno real, usar instalación limpia:

```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

O, si se conserva `package-lock.json` válido:

```bash
rm -rf node_modules
npm ci
npm run build
```

El error detectado en el contenedor fue:

```txt
Cannot find module @rollup/rollup-linux-x64-gnu
```

Esto no es un error del código RC3; es un problema típico de optional dependencies de Rollup cuando `node_modules` se mueve entre sistemas.

## Archivos modificados

- `src/App.tsx`
- `src/pages/Home.tsx`
- `src/pages/GreenNode.tsx`
- `src/components/ArticleCard.tsx`
- `src/lib/editorialModel.ts`
- `src/lib/localizedArticle.ts`
- `src/lib/siteConfig.ts`
- `package.json`
- `package-lock.json`
- `BUILD_NOTES_RC3.md`

## Próximo bloque recomendado

RC3.1 debería agrupar:

1. CMS schema real para multi-idioma.
2. Tabla Supabase para `xeth_chat_messages` pública con RLS controlado.
3. Panel admin para publicar en carriles editoriales.
4. Migración de Green Node Matrix a datos CMS.
5. QA visual renderizado antes de deploy.

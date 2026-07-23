# XETHKIOZ Web 10.0 — CSS inicial por ruta

Fecha: 2026-07-23  
Rama: `agent/css-audit-146`  
Issue: `#139`

## Objetivo

Reducir el CSS cargado por todas las páginas sin eliminar estilos, alterar el archivo fuente original ni depender de una purga heurística de clases dinámicas.

## Línea base

- `main.css`: 352.60 kB raw / 64.70 kB gzip.
- CSS fuente importado desde `main.tsx`: 248,652 bytes.
- `xethkioz-redesign.css`: 171,671 bytes y estilos de múltiples rutas mezclados.

## Resultado validado

- `main.css`: 215,179 bytes raw / 38,706 bytes gzip medidos por el contrato post-build.
- Vite: 215.17 kB raw / 38.91 kB gzip.
- Reducción gzip: aproximadamente 40.2 %.
- 13 entradas HTML públicas sin precarga de Supabase, Framer Motion ni CSS de ruta.
- TypeScript, rutas, runtime/SEO y privacidad: PASS.
- GitHub Actions: PASS.
- Preview Vercel: READY.

## Conservación semántica y cascada

Se comparó el artefacto `dist` aprobado por CI contra el artefacto de la línea base anterior al split:

- 3,944 reglas CSS canónicas en la línea base.
- 3,944 reglas CSS canónicas en el build dividido.
- Reglas o declaraciones faltantes: 0.
- Reglas o declaraciones agregadas por error: 0.
- Diferencias en la declaración final efectiva: 0 para Home, Gaming, Fun, Science, Green Node, Editorial, Pasaporte y Rooms.
- Inversiones de cascada con efecto: 0.

El generador analiza reglas residuales con PostCSS, separa listas de selectores y mueve media queries, condiciones y overrides de calidad gráfica junto con su propietario de ruta. Sólo una definición simple situada directamente en la raíz puede clasificar una clase como realmente compartida.

## Arquitectura

`src/xethkioz-redesign.css` continúa siendo la fuente editable. El script `scripts/split-redesign-css.mjs` valida marcadores semánticos y genera archivos ignorados bajo `src/generated/` antes de `dev`, `typecheck` y `build`.

Chunks generados:

- Home.
- Gaming/Fun compartido.
- Secciones exclusivas de Gaming.
- Science.
- Green Node.
- NexusDistrict.
- Editorial, noticias y guías.
- Fun + Nexus City.
- Pasaporte público.
- Salas Nexus.

La Red de Universos permanece en el núcleo global durante esta fase porque su rail de tránsito es compartido por varias superficies.

## Prevención de regresiones

`audit:initial-bundle` exige:

- CSS inicial menor o igual a 225,000 bytes raw.
- CSS inicial menor o igual a 41,500 bytes gzip.
- Emisión de los diez chunks de ruta.
- Ausencia de esos chunks en las 13 entradas HTML públicas.
- Ausencia de Supabase y Framer Motion en el arranque público.

`audit:css-source` informa tamaño, prefijos, clases page-scoped, tokens sin referencias directas y límites semánticos del archivo fuente. Sus candidatos son diagnósticos; no se eliminan clases automáticamente.

## Limitación conocida

En accesos directos, `main.tsx` espera el CSS correspondiente antes del primer render. En navegación interna, `RouteCssLoader` inicia la descarga mediante `useLayoutEffect` al cambiar la ruta y permite reintentar una descarga fallida.

La navegación visual automatizada del entorno fue bloqueada por una política administrativa del navegador. Por eso la aprobación no afirma capturas Playwright: usa los artefactos exactos de CI y una comparación semántica completa de reglas, declaraciones y orden de cascada.

## No incluido

- No se modificó `index.css` ni Tailwind.
- No se eliminaron estilos legacy por heurística.
- No se cambió contenido, rutas, RLS, CMS ni diseño.
- No se afirma puntuación Lighthouse sin navegador instrumentado.

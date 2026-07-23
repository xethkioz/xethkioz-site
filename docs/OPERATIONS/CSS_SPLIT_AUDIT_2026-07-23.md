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

- `main.css`: 220,591 bytes raw / 40,074 bytes gzip medidos por el contrato post-build.
- Vite: 220.59 kB raw / 40.29 kB gzip.
- Reducción gzip: aproximadamente 38 %.
- 13 entradas HTML públicas sin precarga de Supabase, Framer Motion ni CSS de ruta.
- TypeScript, rutas, runtime/SEO y privacidad: PASS.
- Preview Vercel: READY.

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

En accesos directos, `main.tsx` espera el CSS correspondiente antes del primer render. En navegación interna, `RouteCssLoader` inicia la descarga al cambiar la ruta. Una fase posterior puede trasladar los imports a cada módulo lazy y validarlos con Playwright/capturas visuales para eliminar cualquier posibilidad de flash de estilos durante navegación.

## No incluido

- No se modificó `index.css` ni Tailwind.
- No se eliminaron estilos legacy por heurística.
- No se cambió contenido, rutas, RLS, CMS ni diseño.
- No se afirma puntuación Lighthouse sin navegador instrumentado.

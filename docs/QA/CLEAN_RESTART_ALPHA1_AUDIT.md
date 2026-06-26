# XETHKIOZ V7 Clean Restart Alpha 1 — Auditoría

## Objetivo
Reducir la web anterior sin perder el corazón visual de XETHKIOZ.

## Cambios aplicados
- Home reemplazado por una entrada central tipo ecosistema con avatar/dragón representados por capas CSS livianas.
- Se redujeron paneles y dashboards visibles en portada.
- Se dejaron 3 portales principales: Juegos, Ciencia y Tecnología, Memes/Ocio/Diversión.
- Green Node queda aislado y simplificado como sección oculta activada por Green Wisp.
- Header reducido a identidad, idioma y acceso admin.
- En páginas de portal se ocultan header, footer, chat y Wisp para evitar mezcla visual.
- Se agregó portal Fun en `/fun`.
- Se mantuvo la base funcional anterior como referencia y no se reescribió desde cero.

## Validación
- TypeScript: OK.
- Vite build: OK.
- Build manual validado en entorno Linux con `node node_modules/typescript/bin/tsc -b` y `node node_modules/vite/bin/vite.js build`.

## Pendiente
- Reemplazar la escena CSS de avatar/dragón por imagen/video final aprobado.
- Test visual en PC y mobile.
- Luego integrar CMS y Supabase de forma gradual.

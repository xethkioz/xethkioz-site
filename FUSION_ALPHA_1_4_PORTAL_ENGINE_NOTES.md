# XETHKIOZ Fusion Alpha 1.4 — Portal Engine

## Objetivo

Construir la primera versión real del Portal Engine sobre la base estable de Fusion Alpha 1.3, respetando el Master Design Bible v3.0.

## Cambios

- Los portales ahora exponen paneles específicos por sección.
- Cada portal refuerza su identidad visual mediante color, vórtice y microefectos propios.
- Se agregó mayor profundidad visual con perspectiva 3D, partículas, runas y capas de energía.
- Green Node incorpora guardia visual: un duende mágico atraviesa el portal y una fuente de oro aparece como parte del Easter Egg.
- El Green Node no entra como menú común: el primer contacto despierta al duende; solo se accede cuando el duende está mirando.
- La navegación sigue siendo accesible: en desktop se activa con hover/focus; en táctil el primer toque despierta y el segundo ingresa.

## No se tocó

- SQL.
- Supabase runtime.
- CMS.
- Auth real.
- Estructura de rutas públicas.

## Verificación requerida

- npm install
- npm run build
- npm run audit:fusion
- npm run audit:live
- Revisar rutas: /, /gaming, /science, /fun, /green-node
- Verificar que ES/EN siga funcionando desde el HUD global.
- Verificar que el Wisp global siga visible.

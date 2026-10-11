# XETHKIOZ · Rediseño luminoso 2026

## Identidad
Luz, esperanza, naturaleza, magia y tecnología útil; estilo AAA adulto. Paleta inicial: cielo #E8F7FF, marfil #FFF8DD, verde #347C63, tinta #173A3F, dorado #C18B38. Oscuridad solo como contraste puntual.

## Auditoría inicial · 11/10/2026
Repositorio xethkioz/xethkioz-site: React, TypeScript, Vite, Tailwind y Supabase; despliegue Vercel. Mantener stack y hosting. Main conserva selector AION 2 / WoWForever, Mascotas, Digital y Green Node. Rama feat/luminous-xethkioz-2026-stage1 añade cuatro accesos destacados sin borrar los anteriores y CSS luminoso HomeLuminous.css. Preview dpl_HAy8vYshC229Uqy2Qyk8mB3S39C5 pendiente de validación final. Otra rama feat/new-aion-wow-green-node-portals (PR #305) modifica el mismo Home; no fusionar a ciegas.

## Reglas
No alterar World of Xethkioz 2D, lore reservado, datos, donaciones, redes ni funcionalidades. No reincorporar Facebook, Twitch o Kick. No publicar métricas no verificadas. No gastar créditos ni publicar producción sin aprobación final.

## Etapas
1. Home: cuatro destinos, selector gamer existente, ES/EN, responsive y reduced motion. Validar rutas reales.
2. Portales: Elemental Realms vivo, Huellas cálido, Digital claro con VEYR/Argenciencia, Green Node verde naturaleza digital.
3. Rendimiento: imágenes optimizadas, lazy loading secundario, animaciones ligeras y medición LCP/CLS.
4. QA: build, typecheck, rutas, accesibilidad, seguridad, SEO, revisión visual a 390/768/1440 px. Solo preparar merge tras aprobación.

## Pendientes
Verificar compilación de preview, enlaces y contraste; recursos multimedia originales de otra rama no incorporados; Supabase Auth advierte protección de contraseñas filtradas desactivada y requiere acceso autorizado al panel.

## Stage 2 · interior de portales (rama aislada)
Se prepara `feat/luminous-portal-interiors-stage2` a partir de la rama luminosa (base e34b4569): estilos claros y reutilización de paisajes públicos para Elemental Realms y Digital; Green Node obtiene un exterior verde más luminoso sin tocar terminal, expedientes, datos ni Deep Mode. En la Home ya existen recursos originales de fondo conservados por otra iteración. La ruta de Huellas es `/mascotas/` y queda intacta; no modificar su aplicación independiente en esta etapa. No modificar precios, cobros ni bases de datos. Verificar compilación de Vercel, responsive y accesibilidad antes de fusionar. Producción requiere aprobación final.

## QA local etapa 2 · 11/10/2026
En un worktree aislado del commit 02d73bd se ejecutaron `npm run build` (PASS luego de actualizar contrato de wordmark), `npm audit --omit=dev --audit-level=high` (0 vulnerabilidades) y `playwright test --project=chromium-mobile tests/e2e/luminous-stage2.qa.spec.ts --workers=2` (6/6 PASS; viewport móvil 390 px y control escritorio 1440 px). La auditoría anterior exigía un logo WebP; el nuevo Home incluye wordmark HTML XETHKIOZ liviano, por lo que el contrato ahora acepta ambos conservando rechazo de PNG pesado. Falta validar Vercel READY y revisión visual. La rama se mantiene en PR draft; no fusionar a producción.

## Accesibilidad · corrección validada
Playwright + axe-core detectó 4 enlaces del menú interior oculto a lectores de pantalla pero todavía visibles en la interfaz de Elemental Realms y Digital (contraste insuficiente). Se corrigió el estado visual cerrado en `PortalSystem.css` con un selector limitado a navegación no-Home. Recompilación PASS y repetición de 4 rutas con auditoría Axe WCAG 2.x (0 incumplimientos graves o críticos; 4/4 tests PASS, viewport 390 px). El menú abierto conserva sus enlaces y controles. Pendiente: revisión humana final en varias dimensiones.

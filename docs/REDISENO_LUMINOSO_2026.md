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

## Verificación de etapa 2 (11/10/2026)
- Vercel preview dpl_Bxb3vym1JJqpjHWF5ksLtL6K9E2J: READY; auditoría de rutas 62/173 módulos y bundle inicial 38.2 kB gzip, sin errores de compilación.
- Se mantiene HomeLuminous.css para la Home, PortalLuminous.css para Elemental Realms y Digital, GreenNodeLuminous.css para la experiencia pública de Green Node. Se retira la hoja duplicada PortalLuminousInteriors.css creada durante trabajo concurrente, sin perder comportamiento.
- Se retiró Facebook del listado público y el texto con métricas históricas de Threads en ChatOverlay.
- Sin modificaciones a World of Xethkioz 2D, migraciones ni base de datos. Producción sigue sin publicar.
- Pendiente: inspección visual de 390/768/1440, validar enlaces de Huellas y comprobar accesos bajo protección del preview antes de aprobación final.

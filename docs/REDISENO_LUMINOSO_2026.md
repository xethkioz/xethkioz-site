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


## Avance verificado: paisajes y portales (11/10/2026)
- Home: los cuatro destinos reutilizan archivos WebP ya existentes en public/assets/portals; no se subieron imágenes de terceros ni se reemplazó arte privado del juego. La superposición luminosa mantiene el texto en HTML y respeta reduced motion.
- Elemental Realms: PortalLuminous.css aclara hero, textos y módulos; la demo Alpha 2 y las advertencias de proyecto en desarrollo permanecen.
- Digital: tarjetas claras para servicios web, VEYR, ArgenCiencia y cursos; los enlaces y componentes originales no fueron reemplazados.
- Huellas Argentina: portal-nature-luminous.css se aplica después del tema anterior en public/mascotas/index.html; formularios, informes y archivos JS continúan sin modificaciones.
- Green Node: GreenNodeLuminous.css aclara el exterior y conserva expedientes, terminal, interacciones y Deep Mode.
- SafeImage y Home: atributo HTML fetchpriority en minúsculas para compatibilidad con React 18. La prueba de diseño de contenido admite el logotipo original WebP (conservado) o el wordmark accesible.
- No se cambiaron datos de Supabase, hosting, las rutas publicadas ni proyectos de videojuegos. Producción no modificada.

## QA de navegador
- Vercel: deployment 5bc161036… READY; verificación de 62 rutas y auditorías de SEO, seguridad y bundle inicial aprobadas. Revalidar el deployment que contenga los últimos commits al continuar.
- En copia aislada del repositorio, Chrome local con Vite, viewports 390 x 844, 768 x 1024 y 1440 x 900.
- **17/17 controles aprobados, 0 errores en consola** tras corregir fetchpriority. Revisados enlaces de los cuatro destinos, carga real de cuatro imágenes, ausencia de scroll horizontal y cabeceras de las cuatro páginas interiores.
- El micrositio Huellas se validó en local con /mascotas/index.html porque el servidor Vite no aplica las reescrituras de Vercel. La URL pública es /mascotas/ y sigue definida por la configuración de despliegue.
- Evidencias locales (no publicadas): E:\\WEB XETHKIOZ\\03_EXPORTS_QA\\Luminous-QA-20261011\\qa-results.json y capturas qa-home-390.png, qa-home-768.png, qa-home-1440.png.
- Las comprobaciones automáticas y las capturas no sustituyen la aprobación visual del propietario.

## Trabajo restante antes de producción
- Revisar personalmente las capturas, contrastes y experiencia de las cuatro secciones completas; evitar aplicar un esquema claro a texto o paneles que necesitan contraste intencional.
- Acordar consolidación con otras ramas activas de rediseño para no pisar trabajo concurrente.
- Mantener pendiente la activación de leaked-password protection en Supabase Auth hasta contar con sesión administrativa autorizada.
- Advertencias no bloqueantes de Vercel: dos videos públicos pesados y migraciones históricas espejadas; no eliminar sin auditoría.
- Preparar revisión del propietario antes de merge. No publicar automáticamente.

## QA consolidado de esta etapa (11/10/2026)
- Confirmado build completo local con `npm ci` y `npm run build` sobre commit `091dada434bf3dee57a9092e0f5db9519bf2dec0`; salida exit 0.
- Home verificada con Chrome/Playwright a 390×844, 768×1024 y 1440×900: cuatro portales y sus WebP cargados, cero overflow, cero excepciones JS. Selector WoWForever pasa `aria-selected=true` al accionarse.
- Axe WCAG A/AA/2.1 AA en Home móvil/escritorio: 0 violaciones detectadas.
- Interior en 390px: Elemental Realms, Digital, Green Node, Huellas, Servicios y /en retornan 200, cargan imágenes, 0 overflow y 0 errores JS. Axe: Elemental Realms y Digital sin violaciones.
- Se detectaron dos contrastes insuficientes en el footer de Huellas (`.footer-social-label`, `.rights strong`), corregidos en `public/mascotas/portal-nature-luminous.css`. Nueva ejecución Axe en Huellas: **0 violaciones detectadas**.
- Despliegue Vercel último commit `091dada...`: `dpl_BUMepB2ev4ZKr4BgqbRa7YLkiktD`, estado READY. Preview protegido puede pedir inicio de sesión.
- Estas son pruebas automáticas locales: la revisión visual humana del propietario y autorización explícita para producción continúan pendientes.

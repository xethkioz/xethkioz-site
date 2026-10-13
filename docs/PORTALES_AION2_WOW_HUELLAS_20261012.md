# XETHKIOZ — Actualización pública AION 2 / WoW: Forever / Huellas Argentina
Fecha: 12/10/2026

## Alcance de edición
- Portada React: arte original celestial para AION 2 (ya no reutiliza el portal de fuego de World of Xethkioz), selector con información pertinente de clases y acceso directo a una ficha visible de cada juego.
- `UniverseSpotlight`: dos dossiers ligeros ES/EN con datos verificados, fichas, cuatro pasos de inicio, clases, enlaces oficiales y nota explícita de independencia editorial.
- AION 2: lanzamiento global PC 05/10/2026, 8 clases iniciales, Elyos/Asmodians, Balaur, vuelo libre, PvE/PvP, Abismo, comunidad AION 2 Global SA y referencia a InnerCircle Elyos.
- WoW: Forever: beta desde 17/09/2026 con acceso condicionado; lanzamiento 04/11 en horario de América y 05/11 en Europa, nivel 1–60, 9 clases, Horda/Alianza, nueva raza cielonato. No presentar WoW Forever como servidor privado.
- Se corrigieron dos URLs de Blizzard que antes apuntaban a una ruta en alemán que no correspondía al título de la guía.
- Mascotas: nueva ilustración **original generada** de perro, gato y conejo (AVIF pequeño), portada Huellas renovada, sección de compañeros orgánica y retratos circulares en las cuatro tarjetas. No representa fotografías de animales reales disponibles para adopción: su función es decorativa y emotiva.
- Formularios, donaciones, búsquedas, moderación, rutas y contenido de usuario de Huellas permanecen intactos.

## Fuentes primarias comprobadas
- NC AION 2: https://about.ncsoft.com/en/news/article/aion2_update_20260421
- Lanzamiento PC/Steam: https://store.steampowered.com/app/3393110/AION_2/
- Información oficial NC: https://aion2.plaync.com/en-us/about/index
- WoW: Forever, Blizzard: https://worldofwarcraft.blizzard.com/es-es/news/24302093
- Blizzard, razas y clases: https://news.blizzard.com/es-es/article/24304075/crea-un-heroe-a-tu-imagen-y-semejanza-en-world-of-warcraft-forever
- Beta Blizzard: https://us.support.blizzard.com/es/help/article/189194

## Límites y seguridad
- No se modifican el código fuente del juego 2D/3D, modelos privados, historias reservadas, CMS, base de datos ni claves.
- No se generaron falsas guías de habilidades ni tablas de daño sujetas a actualizaciones.
- Medios locales sin carga de librerías gráficas nuevas. Se preserva Green Node oscuro y los cuatro portales.
- Selector de universo mantiene la enciclopedia detrás de consentimiento explícito, y ahora se cierra al cambiar de juego.

## QA local
- `npm run build`: PASS (incluye typecheck, estructura, medios, rendimiento y límites de propiedad intelectual).
- `node scripts/qa-aion-wow-huellas-20261012.mjs`: PASS.
- Cinco anchos de portada (320/360/390/768/1440), cuatro anchos de Huellas (320/390/768/1440), imágenes descodificadas, cambio de tabs, 8 y 9 clases, rutas oficiales, navegación a dossier, enciclopedia, formulario existente, 0 errores JS, 0 overflow y 0 infracciones Axe WCAG en los contenedores examinados.
- Evidencias en `E:\WEB XETHKIOZ\03_EXPORTS_QA\AION_WOW_HUELLAS_20261012`.

# WEB CONTINUIDAD — WORLD OF XETHKIOZ

Actualizado: 2026-09-29 · Pass 40 · candidato v11.7.0

## Estado y alcance
Esta hoja es operativa de la web pública, no una biblia del juego.
Base: main f8d029fc (Pass 38 publicado + limpieza de CSP conservada).
Trabajo: design/portal-convergence-pass40, en worktree dedicado.
La solicitud vigente es aplicar el diseño de portales aprobado, no crear más mockups.
La producción no debe declararse actualizada hasta comprobar el despliegue exacto.

## Arquitectura vigente del candidato
Home: logo World of Xethkioz, lema, tres portales en fila y Green Node debajo.
Fuego: /world-of-xethkioz/elemental-realms, destino directo al juego.
Naturaleza: /mascotas/, conserva la red comunitaria Huellas Argentina.
Hielo: /digital, agrupa Creación Web, VEYR Local/Remote y ArgenCiencia externo.
Distorsión: /green-node, verde Matrix, negro y violeta; acceso directo al contenido educativo.
/world-of-xethkioz y su variante inglesa redirigen al juego: no restaurar el hub intermedio.
Cada página conserva un único encabezado y un pie compacto cuando corresponde.
Noticias, biblioteca gamer, comunidad y cuenta siguen accesibles desde el menú secundario.
El catálogo y formulario de servicios conservan sus funciones, precios y controles.

## Contenido del juego
Alpha 2 ocupa la entrada principal, con controles, sin autoplay.
La visión del fundador y la captura histórica se montan sólo al abrir su archivo opcional.
Veyr es el compañero divertido y positivo. B-Rabbit es UN contrapunto travieso.
No inventar dos versiones buena/mala de B-Rabbit.
VEYR Local/Remote es el proyecto de IA: no confundirlo con el personaje del juego.
El arte actual usa retratos promocionales recortados, nunca fichas completas.
No restaurar el antiguo Veyr de piedra/raíces como imagen vigente.

## Arte y efectos
Escenografía recortada del concepto aprobado, títulos y enlaces reales en HTML.
Fuego: brasas y luz cálida. Naturaleza: verde, vegetación y luciérnagas.
Hielo: cristales, azul/cian y partículas frías. Green Node: fractura y lluvia de código.
Efectos opcionales: máximo 12 partículas por superficie, pausa explícita y persistente.
Se suspenden fuera de vista, al ocultar la pestaña y con movimiento reducido.
No se añade WebGL, canvas, audio automático, librería pesada ni video de fondo.
En móvil se reduce el efecto y los tres accesos se apilan sin desbordar.

## Apoyo y redes
PayPal y Mercado Pago abren sus destinos oficiales, sin iniciar cobros automáticos.
Alias xethkioz copiable. Aportes voluntarios, no preventa ni ventaja en el juego.
Instagram, Threads, TikTok principal, Facebook y YouTube conservan enlaces centralizados.
Facebook usa el ID 1200879536437785 confirmado en REDES_XETHKIOZ_REGISTRO.json.
Es sólo un enlace público solicitado en el diseño; no reconecta Buffer ni autoriza publicaciones.
Mantener privacidad, preferencias de cookies y versión visibles en el pie.

## Protección y compatibilidad
No publicar modelos, archivos editables, ZIP de producción, mapas internos o lore privado.
Las imágenes son arte promocional; Alpha 2 es captura de desarrollo no final.
Mantener CSP, RLS, autenticación, consentimiento, CMS y validaciones de formularios.
Nexus City y COMICON siguen retirados. No reactivar contenido antiguo por notas históricas.
El chat comunitario y sus controles accesibles permanecen disponibles.
No gastar créditos de aplicaciones pagas sin autorización específica.

## Verificación
Build completo y auditoría production-ready: aprobados localmente.
Inspección de seis destinos en 1440 y 390 px: sin errores JS ni desbordamiento horizontal.
Pruebas de teclado, pausa de efectos, rutas ES/EN, Alpha 2 y contraste automatizado en ejecución.
Antes de publicar: CI, Browser Quality, Lighthouse y Preview del commit exacto.
Verificar que las 11 imágenes WebP de public/assets/portals estén incluidas en Git.
En Windows, la regla histórica Assets/ ignora esa carpeta; incorporar sólo los WebP aprobados.
Los informes y capturas de QA quedan fuera de producción y se conservan para continuidad.

## Regla de continuidad
Esta estructura sustituye al Home y al hub de las pasadas anteriores.
El historial de Git conserva las versiones previas; no tratarlas como instrucciones vigentes.
No modificar worktrees de otros chats ni el proyecto de juego durante esta edición web.

## Pass 41 — Pulido de Huellas · 2026-09-29 · v11.7.1
Esta revisión parte de main 636f6ecc (Pass 40 publicado) y conserva su arquitectura y arte aprobados.
Alcance: eliminar el panel blanco de Nuestra comunidad, pulir interacción/movimiento y corregir versión pública.
Causa: stats.js inyecta estilos claros después del tema; las reglas .portal-nature .community-* ahora mantienen contraste incluso con carga tardía.
Tarjetas, iconos, cifras, estado y mensajes de error respetan el verde oscuro; no se cambian ni simulan datos reales.
Las luciérnagas permanecen detrás del texto, sin añadir partículas ni bucles JS.
Se pausan fuera de vista, con pestaña oculta, pagehide, ahorro de datos y preferencia de movimiento reducido.
La preferencia manual no se borra por cambios del sistema; el botón comunica si los efectos están pausados.
En táctil se elimina la elevación hover pegada; en escritorio se mantiene una respuesta ligera de 4 px.
La navegación de Mascotas respeta movimiento reducido también en el scroll programático.
Se actualiza public/version.json (antes 11.2.0) junto a package, lockfile y SITE_VERSION; se retiran afirmaciones de validación históricas de ese JSON.
Prueba nueva: tests/e2e/huellas-polish.spec.ts; ocho ejecuciones locales aprobadas (desktop/móvil), cinco anchos de 320 a 1440 px, contraste Axe, carga tardía, error de datos, pausa y versión.
Los fixtures de estadísticas existen sólo en tests interceptados: nunca enviarlos a Supabase ni contarlos como visitas.
Build local completo: aprobado. Antes del merge, exigir CI, Browser Quality, Lighthouse y Preview exacto.
No se modifican pagos, formularios, permisos, canon, imágenes ni el diseño de los portales.
Mantener los informes/capturas de QA fuera del paquete público. Revisar dominio real después del deploy.

## Pass 42 — Cierre de pulido · 2026-09-29 · v11.7.1 / cierre Pass 42
Base publicada: main 69806f9f, v11.7.1. Rama aislada fix/portal-final-polish-pass42.
Se conserva íntegro el diseño de tres portales y la fractura Green Node, sin nuevas secciones.
El encabezado fijo de Mascotas ahora es opaco: no transparenta texto al desplazarse.
Los efectos React separan la elección manual de las pausas por movimiento reducido y ahorro de datos.
Al liberar una pausa del sistema se respeta la elección anterior, sin escribir un apagado permanente.
Las partículas se pausan también durante pagehide y recuperaciones del historial; no se añade ningún bucle.
El menú se cierra al salir con teclado sin robar el foco; Escape sólo devuelve el foco si estaba abierto.
Se conserva la versión 11.7.1 del paquete; esta entrega es el cierre Pass 42 sin cambios de dependencias.
Revisión inicial en el dominio: seis destinos, 390/1440 px, sin errores JS ni imágenes visibles rotas ni overflow.
Se reprodujo el fallo de preferencia: on -> reducción de movimiento -> off persistente. La regresión lo corrige.
Build y audit:production-ready aprobados; 34 ejecuciones de pruebas locales aprobadas (desktop/móvil).
La nueva suite cubre encabezado 320/390/1440, preferencia, ahorro de datos, lifecycle y navegación con teclado.
Mantener CI, Browser Quality, Lighthouse y Preview como condiciones de publicación; registrar resultado final en la PR.
QA conserva capturas/logs fuera de public; las visitas de prueba no incrementan contadores y no envían formularios.
No se alteran estadísticas, pagos, permisos, canon, imágenes aprobadas ni los worktrees de otros proyectos.
Esta sección reemplaza los pendientes de encabezado del Pass 41; no volver a aplicarlos desde ramas antiguas.


## Pass 43 — Huellas naturaleza luminosa
- Se corrigió el acceso `Publicar`: queda fuera del carrusel horizontal y permanece visible en escritorio junto a `Volver a los portales`.
- La regla de pre-render de `public/mascotas/app.js` quedó alineada con el header de cuatro columnas; ya no fuerza el layout heredado de 1480 px / tres columnas.
- Mascotas conserva el fondo bosque y el portal natural, pero reduce el verde musgo: superficies marfil/salvia, bordes verdes y mayor claridad central.
- Se reemplazó el asset roto `huellas-portal-pets.svg` por `huellas-hero-real.svg`, integrado de forma atmosférica para mostrar perro y gato sin convertir el hero en un collage.
- `Nuestra comunidad` usa salvia clara con contraste verde, evitando tanto el bloque blanco anterior como el panel excesivamente oscuro.
- Publicaciones, estadísticas, directorios, formularios, pagos y efectos de naturaleza no cambian funcionalmente.
- QA agregado para visibilidad de Publicar, ausencia de solapamientos/overflow, fila única en escritorio ancho y presencia real del arte de mascotas.

# WEB CONTINUIDAD — XETHKIOZ / WORLD OF XETHKIOZ

Actualizado: 2026-09-20

## Alcance
Este archivo documenta exclusivamente la WEB pública de XETHKIOZ.
No es una biblia de juego, repositorio de lore ni inventario de producción.

## Fuente de verdad
- Producción actual: `main` — Pass 21 / v11.4.0.
- Candidato activo: `release/services-studio-pass23`.
- Flujo obligatorio: GitHub → Preview Vercel → CI/Browser/Lighthouse → validación → producción.
- No promover a producción sin aprobación explícita del propietario.

## Protección de propiedad intelectual
- No publicar modelos 3D crudos, archivos editables, mapas internos, documentos de diseño, lore privado ni nomenclatura inédita.
- No publicar screenshots de herramientas de producción o material que permita reconstruir assets originales.
- Usar únicamente arte promocional transformado y aprobado para web.
- Toda imagen conceptual debe presentarse como ilustración promocional y no como gameplay.
- Los documentos públicos de continuidad deben contener sólo información operativa de la web.

## Identidad pública vigente
- Web: https://www.xethkioz.com.ar
- Threads: https://www.threads.com/@xethkioz
- Instagram: https://www.instagram.com/xethkioz
- TikTok: https://www.tiktok.com/@xethkioz0
- YouTube: https://www.youtube.com/@XETHKIOZ

## Superficies principales
- Home: presentación Premium Fantasy con World of Xethkioz como foco principal.
- World of Xethkioz: portal separado del juego, sin revelar material de producción privado.
- Biblioteca gamer: guías, radar, videos y comunidad.
- Noticias: centro editorial con fuentes, búsqueda y filtros.
- Ciencia / ArgenCiencia: contenido científico y tecnológico con identidad propia.
- Mascotas: micrositio independiente, sin rediseño innecesario.
- Creación Web: Estudio Digital y solicitud de propuestas.
- Apoyo: aportes voluntarios separados de la contratación de servicios.
- Comunidad: chat, perfiles y accesos comunitarios.
- Green Node: experiencia especial accesible mediante Veyr/Wisp.

## Retiro de superficies heredadas
- Nexus City está retirado como destino público.
- Sus rutas antiguas redirigen a Comunidad.
- El chat y las funciones comunitarias aprobadas se conservan.
- Material editorial heredado identificado con la marca retirada no debe mostrarse en feeds públicos ni indexarse.

## Pass 23 — Estudio Digital
El candidato incorpora una presentación comercial propia para Creación Web, separada del universo del videojuego.

Funciones:
- Servicios de creación web, IA aplicada, contenido/diseño y soporte básico de PC.
- Combinaciones sugeridas y extras compatibles.
- Selección de varios servicios y resumen de propuesta.
- Enlace compartible limitado a identificadores permitidos, sin datos personales.
- Formulario de presupuesto con consentimiento, límites y controles antiabuso.
- No existe compra ni cobro automático.
- Precios, plazos y condiciones se acuerdan antes de iniciar cualquier trabajo.
- Aportes voluntarios al proyecto permanecen separados de los servicios.

## Navegación y móvil
- Menú móvil de ancho completo y nombres legibles.
- Veyr/Wisp y Chat mantienen separación física.
- Cuando el Chat está abierto, Veyr no debe cubrir controles.
- ES/EN debe conservar rutas localizadas válidas.
- Web y Threads son destinos prioritarios en superficies sociales.

## Rendimiento
- Evitar video automático, filtros costosos y animaciones continuas innecesarias.
- Las rutas móviles usan perfiles visuales simplificados.
- Cargar arte inferior de forma diferida cuando corresponda.
- Mantener presupuestos de CSS/JS y Lighthouse definidos por CI.

## QA obligatorio
Antes de cualquier promoción:
1. `npm run audit:production-ready`
2. `npm run build`
3. Playwright + Axe en desktop y móvil.
4. Lighthouse Quality.
5. Preview Vercel del commit exacto.
6. Smoke de rutas ES/EN, navegación, Chat, Veyr y formularios.
7. Confirmar ausencia de overflow horizontal.
8. Revisar logs de runtime.
9. Verificar que no se publicaron assets o documentos privados.

## Estado del candidato actual
- Árbol fuente sincronizado con GitHub y verificado contra la copia local.
- CI remoto en ejecución para el candidato Pass 23.
- Producción continúa intacta hasta aprobación.
- Las pruebas de teléfono físico, sesiones reales y controles de abuso/retención siguen siendo verificaciones separadas y no se sustituyen con Lighthouse.

## Regla de continuidad
No usar documentos históricos como autorización para restaurar UI, rutas o contenido retirado.
Ante conflicto entre una nota antigua y este archivo, prevalece el estado vigente de la hoja de ruta y la instrucción más reciente del propietario.

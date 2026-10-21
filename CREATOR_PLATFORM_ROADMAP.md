# XETHKIOZ — Plataforma de creadores (rediseño 2026-10-21)

## Objetivo
Convertir la web pública en un catálogo comunitario de software, videojuegos, videos, arte y proyectos hechos con IA. Identidad pública: XETHKIOZ.

## Conservar
Green Node, Ciencia/Argenciencia y Mascotas/Huellas Argentina. Mantener sus datos, funcionalidades, rutas y dependencias. No borrar archivos privados del juego ni repositorios externos.

## Retirar de la navegación pública
Las restantes secciones y portales legacy; reemplazar rutas con redirecciones 301 o páginas de transición según SEO. NO borrar tablas, buckets, registros de usuarios ni assets antes de inventario, backup y verificación de dependencias.

## MVP
1. Home: buscador, categorías, novedades, proyectos destacados y CTA de registro/publicación.
2. Cuentas: reutilizar Supabase Auth actual, perfiles públicos, nombre, avatar, bio, enlaces y consentimiento.
3. Publicaciones: borrador/publicado/en revisión/rechazado; tipo, título, descripción, capturas, etiquetas, licencia, autor, enlaces y URL de archivo externo; filtros y reporte.
4. Biblioteca personal: proyectos propios, editar/despublicar, estadísticas mínimas y conexión de nube.
5. Cloud BYOS: primera integración Google Drive mediante OAuth de alcance mínimo; usar Google Picker y enlaces autorizados. No guardar tokens en el navegador ni compartirlos entre usuarios. Google Drive no debe considerarse CDN de descargas públicas; verificar permisos, cuotas, enlaces caducados y TOS. Fallback: enlaces públicos de nube propia/OneDrive/Dropbox o almacenamiento gestionado con límites.
6. Seguridad: RLS estricta por propietario; validación de URL y MIME; antivirus/escaneo si se alojan archivos; bloqueo de malware, piratería, contenido ilícito, phishing y suplantación; moderación y mecanismo de denuncia; rate limits, tamaño y cuotas, protección contra spam.
7. UX: mobile first, tema oscuro premium, accesibilidad, carga progresiva, skeletons, motion reducida y excelente Core Web Vitals.
8. Privacidad: no indexar archivos privados, políticas de datos, revocación de OAuth y eliminación de cuenta y publicaciones.

## Orden de ejecución
A. Auditar rutas, esquema Supabase, permisos y assets; documentar dependencias.
B. Crear componentes y rutas nuevas en esta rama sin tocar producción.
C. Migraciones SQL aditivas, RLS, autenticación y CRUD; nunca aplicar cambios destructivos.
D. Conector Drive en modo prueba con OAuth seguro y aprobación del usuario antes de activar.
E. Pruebas unitarias/e2e de autorización, publicación, reportes, móviles y regresiones de los tres módulos conservados.
F. Preview Vercel y validación; producción solo tras build verde y revisión.

## Estado
Rama creada; especificación inicial registrada. Implementación de interfaz, backend, OAuth y migraciones: pendientes. Producción sin cambios.

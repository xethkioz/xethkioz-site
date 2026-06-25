# XETHKIOZ v3.6.0 — Stability, Content & Community Polish

## Estado
Build de producción verificado correctamente con `npm run build`.

## Mejoras incluidas

### 1. Banner animado en Home
- Se agregó `/public/videos/xethkioz-pixel-banner.mp4`.
- La Home ahora incluye el banner pixel art como bloque visual principal.
- Se configuró reproducción automática, loop, muted y playsInline para uso web/móvil.
- Se agregó fallback estático.

### 2. Sistema de imágenes seguro
- Nuevo componente `SafeImage`.
- Reemplaza imágenes rotas automáticamente.
- Bloquea imágenes demo de Pexels usadas en la versión anterior.
- Agrega fallbacks internos por tipo: gaming, tech, science, streaming y genérico.
- Evita que vuelva a aparecer la foto vieja de About en tarjetas o noticias.

### 3. Noticias y artículos
- `ArticleCard` ahora usa imágenes internas/fallback cuando la noticia no tiene portada real.
- `ArticlePage` ahora muestra una portada fallback si no existe imagen válida.
- SEO de artículo usa una imagen segura.
- Se deja preparada la estructura para cargar portadas reales por noticia desde Supabase.

### 4. Comunidad y cuentas
- Header y menú móvil agregan accesos claros a Crear cuenta / Iniciar sesión.
- Se conserva `/creator` como panel inicial de cuenta.
- Se agregó explicación técnica en schema sobre dónde se guardan los datos:
  - `auth.users` para cuentas.
  - `creator_profiles` para perfiles.
  - `community_posts` para publicaciones.
  - `community_comments` para comentarios.
  - `community_reactions` para likes/reacciones.

### 5. Patrocinios y donaciones
- Nueva página `/support`.
- Botones para PayPal y Mercado Pago.
- Sección para marcas, sponsors y colaboraciones.
- Footer y Header enlazan a la sección de apoyo.
- Sitemap actualizado con `/support` y `/creator`.

### 6. Supabase
- Se agregaron tablas de base para comunidad:
  - `community_posts`
  - `community_comments`
  - `community_reactions`
- Se agregaron índices y políticas RLS iniciales.

### 7. Limpieza técnica
- Se agregó `.gitignore` para evitar subir `node_modules`, `dist`, `.env` y archivos temporales.
- Versión actualizada a `3.6.0`.

## Pendiente antes de v4.0
- Ejecutar el nuevo SQL en Supabase si querés activar publicaciones, comentarios y reacciones reales.
- Cargar portadas reales por noticia en Supabase.
- Conectar panel Creator con sesión persistente y vista de perfil.
- Definir roles: admin, editor, creador, usuario.
- Crear panel de administración profesional.

## Resultado
Esta versión deja la base más estable para empezar a cargar contenido real y preparar el salto grande a XETHKIOZ v4.0.

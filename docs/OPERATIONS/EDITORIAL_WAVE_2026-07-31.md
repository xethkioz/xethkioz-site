# Ola editorial XETHKIOZ · 2026-07-31

Registro operativo de la segunda carga real de noticias, guías, fichas COMICON y cómic original.

## Resumen

- **20 publicaciones nuevas** en `public.news_articles`.
- **12 noticias actuales** con fuentes primarias u oficiales.
- **8 guías permanentes** para COMICON, Gaming, IA, Programación y Green Node.
- **17 fichas nuevas** en `public.comicon_catalog`.
- El catálogo COMICON crece de 40 a **57 fichas publicadas**.
- El cómic original `Dos almas, un guerrero` pasa de un prólogo a **dos capítulos legibles**.
- Cada publicación contiene al menos cuatro apartados, una fuente y más de 250 palabras.

## Noticias publicadas

### Universo COMICON

- `comicon-godzilla-conquista-multiverso-1`
- `comicon-avengers-1-zdarsky-checchetto-noviembre-2026`
- `comicon-dc-next-level-legion-titans-doom-patrol`
- `comicon-dc-comic-con-2026-legado-anos-50`
- `comicon-konosuba-temporada-4-estreno-2027`
- `comicon-bleach-calamity-opening-ending-2026`

### Gaming

- `gaming-halo-campaign-evolved-lanzamiento-2026`
- `gaming-splatoon-raiders-lanzamiento-switch-2`
- `gaming-game-pass-julio-2026-gears-palworld`

### Inteligencia artificial

- `ai-openai-presence-agentes-empresariales`
- `ai-openai-work-frontier-cruce-tareas`

### Ciencia

- `science-nasa-roman-lanzamiento-agosto-2026`

## Guías publicadas

- `guia-comicon-avengers-despues-armageddon`
- `guia-comicon-dc-elseworlds-continuidad`
- `guia-comicon-anime-verano-2026`
- `guia-gaming-elegir-suscripcion-juegos`
- `guia-gaming-hdr-120hz-configuracion`
- `guia-ai-escalamiento-humano-agentes`
- `guia-programming-supabase-rls-seguro`
- `guia-green-passkeys-gestor-contrasenas`

## Nuevas fichas COMICON

### Marvel

- `daredevil-matt-murdock`
- `deadpool-wade-wilson`
- `scarlet-witch-wanda-maximoff`
- `doctor-doom-victor-von-doom`
- `venom-eddie-brock`

### DC

- `nightwing-dick-grayson`
- `zatanna-zatara`
- `lex-luthor`
- `teen-titans`
- `doom-patrol`

### Anime + Manga

- `ichigo-kurosaki`
- `tanjiro-kamado`
- `izuku-midoriya`
- `saitama-one-punch-man`
- `frieren-beyond-journeys-end`

### Cómic independiente

- `invincible-comic`
- `saga-image-comics`

## Cómic original

La fuente narrativa se trasladó a `src/data/originalComicSaga.ts`.

Contenido disponible:

1. `00 · Prólogo: La fractura` — 6 viñetas.
2. `01 · El guardián sin reino` — 8 viñetas.

El lector ahora permite seleccionar capítulos disponibles, mantiene desactivados los capítulos planificados, actualiza el cierre según el capítulo siguiente y conserva navegación accesible por teclado.

## Política editorial

- Las noticias se basan en páginas oficiales de Marvel, DC, Crunchyroll, Xbox, Nintendo, OpenAI y NASA.
- Las guías técnicas utilizan documentación primaria de Supabase, CISA y los fabricantes correspondientes.
- Los anuncios confirmados se separan de rumores y teorías.
- La carga es idempotente mediante `slug` único.
- Las publicaciones están en estado `published` y revisión `approved`.
- Las fichas COMICON mantienen lectura pública y escritura exclusiva para rol `ADMIN` mediante RLS.

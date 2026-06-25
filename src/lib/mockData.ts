import type { Article, Category, Stream, MediaItem, SocialLink, Author } from './types'
import { SOCIAL_LINKS, STREAM_LINKS } from './siteConfig'

export const fallbackCategories: Category[] = [
  { id: 'cat-gaming-news', name: 'Gaming News', slug: 'gaming-news', description: 'Noticias gamer, lanzamientos, esports y comunidad.', icon: '🎮', portal: 'gaming', sort_order: 1 },
  { id: 'cat-builds-meta', name: 'Builds & Meta', slug: 'builds-meta', description: 'Guías, builds, tier lists y tendencias competitivas.', icon: '⚔️', portal: 'gaming', sort_order: 2 },
  { id: 'cat-asia-gaming', name: 'Asia Gaming', slug: 'asia-gaming', description: 'Tendencias de Corea, Japón, China y SEA para LATAM.', icon: '🌏', portal: 'gaming', sort_order: 3 },
  { id: 'cat-ai', name: 'Inteligencia Artificial', slug: 'ia', description: 'IA aplicada a creación, gaming, productividad y medios.', icon: '🤖', portal: 'tech', sort_order: 1 },
  { id: 'cat-hardware', name: 'Hardware', slug: 'hardware', description: 'PC, consolas, GPUs, periféricos y setup streamer.', icon: '🖥️', portal: 'tech', sort_order: 2 },
  { id: 'cat-cyber', name: 'Ciberseguridad', slug: 'ciberseguridad', description: 'Privacidad, cuentas, protección digital y buenas prácticas.', icon: '🛡️', portal: 'tech', sort_order: 3 },
  { id: 'cat-science', name: 'Ciencia Digital', slug: 'ciencia-digital', description: 'Ciencia, tecnología y cultura digital explicadas simple.', icon: '🔬', portal: 'science', sort_order: 1 },
  { id: 'cat-fake-news', name: 'Fake News', slug: 'fake-news', description: 'Alfabetización digital, verificación y pensamiento crítico.', icon: '🧠', portal: 'science', sort_order: 2 },
]

export const fallbackAuthors: Author[] = [
  { id: 'author-alexis', name: 'Alexis Díaz', slug: 'alexis-diaz', role: 'Fundador de XETHKIOZ', avatar_url: '/images/xethkioz-about.webp', bio: 'Creador argentino de XETHKIOZ. Gaming, tecnología, IA y ciencia con mirada adulta y de comunidad.' },
  { id: 'author-xethkioz', name: 'Redacción XETHKIOZ', slug: 'xethkioz-team', role: 'Equipo editorial', avatar_url: '/images/articles/fallback.svg', bio: 'Equipo editorial del ecosistema XETHKIOZ.' },
]

const today = '2026-06-25T12:00:00.000Z'
const author = fallbackAuthors[0]
const team = fallbackAuthors[1]

export const fallbackArticles: Article[] = [
  {
    id: 'article-v4-ecosystem', title: 'XETHKIOZ v4.0: de página gamer a ecosistema digital', slug: 'xethkioz-v4-ecosistema-digital',
    excerpt: 'La nueva etapa prepara noticias, gaming, tecnología, IA, comunidad, streaming, CMS y administración en una sola plataforma.',
    content: 'XETHKIOZ v4.0 marca el salto hacia un ecosistema digital completo. La prioridad es construir una arquitectura limpia, documentada y preparada para escalar: noticias, gaming, tecnología, ciencia, IA, streaming y comunidad. Esta versión también prepara CMS, administración, SEO avanzado y automatizaciones para que el proyecto pueda mantenerse durante años.',
    cover_image: '/images/articles/fallback.svg', category_id: 'cat-gaming-news', author_id: author.id, tags: ['xethkioz', 'gaming', 'tecnologia', 'ia'], status: 'published',
    is_featured: true, is_trending: true, is_editors_pick: true, is_popular: true, views: 1600000, published_at: today, created_at: today, updated_at: today,
    category: fallbackCategories[0], author,
  },
  {
    id: 'article-asia-meta', title: 'Gaming asiático: tendencias que pueden llegar fuerte a LATAM', slug: 'gaming-asiatico-tendencias-latam',
    excerpt: 'Mobile, esports, MMORPG y cultura gamer asiática empiezan a marcar el contenido que todavía no explotó en Latinoamérica.',
    content: 'XETHKIOZ Asia Gaming funcionará como radar de tendencias: LoL, Mobile Legends, MMORPG asiáticos, gachas competitivos, esports y cultura digital. El foco es detectar antes lo que puede llegar al público hispanohablante.',
    cover_image: '/images/articles/gaming.svg', category_id: 'cat-asia-gaming', author_id: author.id, tags: ['asia gaming', 'mobile', 'esports'], status: 'published',
    is_featured: false, is_trending: true, is_editors_pick: true, is_popular: true, views: 72000, published_at: '2026-06-24T18:00:00.000Z', created_at: today, updated_at: today,
    category: fallbackCategories[2], author,
  },
  {
    id: 'article-ai-fake-news', title: 'IA, fake news y videojuegos: por qué verificar fuentes ya es parte del juego', slug: 'ia-fake-news-videojuegos-verificacion',
    excerpt: 'La IA puede crear imágenes, textos y noticias creíbles. El desafío es aprender a verificar antes de compartir.',
    content: 'La relación entre IA, fake news y videojuegos crece todos los días. Las herramientas generativas pueden crear imágenes y textos hiperrealistas, por eso XETHKIOZ impulsará contenido educativo sobre verificación, fuentes y pensamiento crítico.',
    cover_image: '/images/articles/science.svg', category_id: 'cat-fake-news', author_id: team.id, tags: ['ia', 'fake news', 'ciencia', 'alfabetizacion digital'], status: 'published',
    is_featured: true, is_trending: false, is_editors_pick: true, is_popular: false, views: 46000, published_at: '2026-06-23T15:30:00.000Z', created_at: today, updated_at: today,
    category: fallbackCategories[7], author: team,
  },
  {
    id: 'article-nvidia-gaming-ai', title: 'Hardware gamer vs IA: el nuevo campo de batalla de las GPUs', slug: 'hardware-gamer-vs-ia-gpus',
    excerpt: 'La demanda de IA cambió la conversación sobre GPUs, precios, rendimiento y prioridades del mercado gamer.',
    content: 'El sector gamer mira con atención cómo la IA cambia la demanda de hardware. XETHKIOZ cubrirá este cruce entre GPUs, PC gaming, creación de contenido y automatización.',
    cover_image: '/images/articles/tech.svg', category_id: 'cat-hardware', author_id: team.id, tags: ['hardware', 'gpu', 'ia', 'pc gaming'], status: 'published',
    is_featured: true, is_trending: true, is_editors_pick: false, is_popular: true, views: 68000, published_at: '2026-06-22T20:00:00.000Z', created_at: today, updated_at: today,
    category: fallbackCategories[4], author: team,
  },
  {
    id: 'article-streaming-obs', title: 'Streaming con Starlink y OBS: base técnica para crecer en vivo', slug: 'streaming-starlink-obs-base-tecnica',
    excerpt: 'Configuración, estabilidad, overlays, chat y presencia multiplataforma para streams más profesionales.',
    content: 'La estrategia de streaming de XETHKIOZ apunta a Twitch, Kick, YouTube y TikTok. La base incluye overlays, chat visible, escenas, miniaturas y enlaces claros a cada canal.',
    cover_image: '/images/articles/streaming.svg', category_id: 'cat-hardware', author_id: author.id, tags: ['obs', 'streaming', 'starlink', 'kick', 'twitch'], status: 'published',
    is_featured: false, is_trending: false, is_editors_pick: true, is_popular: true, views: 39000, published_at: '2026-06-21T22:00:00.000Z', created_at: today, updated_at: today,
    category: fallbackCategories[4], author,
  },
]

export const fallbackStreams: Stream[] = [
  { id: 'stream-kick-live', title: 'XETHKIOZ EN VIVO — Gaming, noticias y comunidad', platform: 'kick', channel_name: 'XETHKIOZ en Kick', channel_url: STREAM_LINKS.kick, video_id: null, thumbnail: '/images/media/stream-kick.svg', is_live: true, is_featured: true, views: 1600, published_at: today },
  { id: 'stream-twitch-night', title: 'Noche gamer: Fortnite, Albion, WoW y pruebas nuevas', platform: 'twitch', channel_name: 'XETHKIOZ en Twitch', channel_url: STREAM_LINKS.twitch, video_id: null, thumbnail: '/images/media/stream-twitch.svg', is_live: false, is_featured: true, views: 4200, published_at: '2026-06-24T23:00:00.000Z' },
  { id: 'stream-youtube-shorts', title: 'Shorts: noticias gaming, IA y tecnología en formato rápido', platform: 'youtube', channel_name: 'XETHKIOZ en YouTube', channel_url: STREAM_LINKS.youtube, video_id: null, thumbnail: '/images/media/video-placeholder.svg', is_live: false, is_featured: false, views: 11800, published_at: '2026-06-23T20:00:00.000Z' },
]

export const fallbackMedia: MediaItem[] = [
  { id: 'media-chat-overlay', title: 'Chat overlay para streams', type: 'image', url: '/images/media/chat-overlay.svg', thumbnail: '/images/media/chat-overlay.svg', description: 'Diseño base para mostrar chat de comunidad en OBS, Kick o Twitch.', is_featured: true, created_at: today },
  { id: 'media-video-news', title: 'Miniatura para video de noticia gamer', type: 'video', url: STREAM_LINKS.youtube, thumbnail: '/images/media/video-placeholder.svg', description: 'Placeholder visual para videos y notas multimedia.', is_featured: true, created_at: today },
  { id: 'media-stream-card', title: 'Placa EN VIVO XETHKIOZ', type: 'short', url: STREAM_LINKS.kick, thumbnail: '/images/media/stream-kick.svg', description: 'Imagen base para avisos de directos y clips.', is_featured: false, created_at: today },
  { id: 'media-asia-card', title: 'XETHKIOZ Asia Gaming', type: 'carousel', url: 'https://www.tiktok.com/@xethkioz.asia', thumbnail: '/images/articles/gaming.svg', description: 'Carrusel para tendencias asiáticas de gaming.', is_featured: false, created_at: today },
]

export const fallbackSocialLinks: SocialLink[] = SOCIAL_LINKS.map((social, index) => ({
  id: `social-${index + 1}`,
  platform: social.name,
  handle: social.handle,
  url: social.url,
  followers: social.name === 'Threads' ? '1.6M+ views' : null,
  icon: social.icon,
  sort_order: index + 1,
}))

export type XethkiozStaticMediaAsset = {
  path: string
  name: string
  publicUrl: string
  mimeType: string
  searchText: string
}

/**
 * Recursos visuales versionados con la web y reutilizables desde el CMS.
 *
 * Este catálogo no reemplaza el bucket news-media: expone dentro de la
 * biblioteca editorial los assets estáticos que ya forman parte del sitio.
 */
export const xethkiozStaticMediaCatalog: readonly XethkiozStaticMediaAsset[] = [
  {
    path: 'static/assets/portal-games-clean-v1.webp',
    name: 'Portal Gaming XETHKIOZ',
    publicUrl: '/assets/portal-games-clean-v1.webp',
    mimeType: 'image/webp',
    searchText: 'gaming videojuegos portal violeta noticias portada general',
  },
  {
    path: 'static/assets/identity/gaming-anime-nexus-v1.webp',
    name: 'Gaming Anime Nexus',
    publicUrl: '/assets/identity/gaming-anime-nexus-v1.webp',
    mimeType: 'image/webp',
    searchText: 'gaming anime nexus esports personaje noticias',
  },
  {
    path: 'static/assets/portal-science-clean-v1.webp',
    name: 'Portal Ciencia IA y Tecnología',
    publicUrl: '/assets/portal-science-clean-v1.webp',
    mimeType: 'image/webp',
    searchText: 'tecnologia inteligencia artificial ia ciencia hardware laboratorio noticias',
  },
  {
    path: 'static/images/articles/wow-midnight.svg',
    name: 'World of Warcraft Midnight',
    publicUrl: '/images/articles/wow-midnight.svg',
    mimeType: 'image/svg+xml',
    searchText: 'world of warcraft wow midnight mmorpg guía gaming',
  },
  {
    path: 'static/images/articles/gaming-hub.svg',
    name: 'Gaming Hub',
    publicUrl: '/images/articles/gaming-hub.svg',
    mimeType: 'image/svg+xml',
    searchText: 'gaming hub diablo fortnite videojuegos portada',
  },
  {
    path: 'static/images/articles/open-world.svg',
    name: 'Open World · GTA VI',
    publicUrl: '/images/articles/open-world.svg',
    mimeType: 'image/svg+xml',
    searchText: 'gta vi gta 6 mundo abierto open world gaming',
  },
  {
    path: 'static/images/articles/mmorpg-asia.svg',
    name: 'Asia Gaming · MMORPG',
    publicUrl: '/images/articles/mmorpg-asia.svg',
    mimeType: 'image/svg+xml',
    searchText: 'asia gaming china japon corea aion 2 mmorpg oriental',
  },
  {
    path: 'static/images/articles/pc-gaming.svg',
    name: 'PC Gaming y Hardware',
    publicUrl: '/images/articles/pc-gaming.svg',
    mimeType: 'image/svg+xml',
    searchText: 'pc gaming hardware gpu chips xbox rendimiento tecnologia',
  },
  {
    path: 'static/images/articles/gaming.svg',
    name: 'Gaming General',
    publicUrl: '/images/articles/gaming.svg',
    mimeType: 'image/svg+xml',
    searchText: 'gaming general roblox videojuegos noticias',
  },
  {
    path: 'static/news/memes/gourmet-ai-meme.svg',
    name: 'Meme Tech · IA Gourmet',
    publicUrl: '/news/memes/gourmet-ai-meme.svg',
    mimeType: 'image/svg+xml',
    searchText: 'meme tecnologia ia gourmet wifi inteligencia artificial fun',
  },
] as const

// Public destinations only. Keep game data and private production records out of this registry.
export const PUBLIC_NAVIGATION = [
  { id: 'game', es: 'World of Xethkioz', en: 'World of Xethkioz', href: '/world-of-xethkioz' },
  { id: 'gaming', es: 'Biblioteca gamer', en: 'Gaming library', href: '/gaming' },
  { id: 'news', es: 'Noticias', en: 'News', href: '/news' },
  { id: 'science', es: 'ArgenCiencia', en: 'ArgenCiencia', href: 'https://argenciencia.com/', external: true },
  { id: 'pets', es: 'Mascotas', en: 'Pets', href: '/mascotas/', document: true },
  { id: 'veyr', es: 'VEYR IA', en: 'VEYR AI', href: '/#veyr' },
  { id: 'services', es: 'Creación web', en: 'Web creation', href: '/creacion-web' },
  { id: 'support', es: 'Apoyar', en: 'Support', href: '/support' },
] as const

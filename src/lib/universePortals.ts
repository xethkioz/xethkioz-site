export type UniversePortalId = 'gaming' | 'science' | 'fun' | 'nexus' | 'web' | 'green'

export type UniversePortal = {
  id: UniversePortalId
  code: string
  glyph: string
  route: string
  tone: string
  image: string
  title: { es: string; en: string }
  subtitle: { es: string; en: string }
  signal: { es: string; en: string }
}

export const UNIVERSE_PORTALS: readonly UniversePortal[] = [
  {
    id: 'gaming', code: 'XK-01', glyph: '遊', route: '/gaming', tone: '#a855f7', image: '/assets/portal-games-world-v3.webp',
    title: { es: 'Gaming District', en: 'Gaming District' },
    subtitle: { es: 'Noticias, guías, builds y mundos para habitar.', en: 'News, guides, builds and worlds to inhabit.' },
    signal: { es: 'REINO DE AVENTURA', en: 'ADVENTURE REALM' },
  },
  {
    id: 'science', code: 'XK-02', glyph: '未', route: '/science', tone: '#22d3ee', image: '/assets/portal-science-world-v3.webp',
    title: { es: 'Future Lab', en: 'Future Lab' },
    subtitle: { es: 'Ciencia, IA, proyectos y tecnología que sirve.', en: 'Science, AI, projects and useful technology.' },
    signal: { es: 'OBSERVATORIO VIVO', en: 'LIVING OBSERVATORY' },
  },
  {
    id: 'fun', code: 'XK-03', glyph: '🐾', route: '/mascotas/', tone: '#34d399', image: '/assets/portal-mascotas-huellas.svg',
    title: { es: 'Huellas de Puan', en: 'Huellas de Puan' },
    subtitle: { es: 'Perdidos, encontrados, adopciones, rescate y cuidado animal.', en: 'Lost pets, found animals, adoption, rescue and animal care.' },
    signal: { es: 'RED COMUNITARIA ANIMAL', en: 'COMMUNITY ANIMAL NETWORK' },
  },
  {
    id: 'nexus', code: 'XK-04', glyph: '界', route: '/nexus-city', tone: '#f97316', image: '/assets/xethkioz-cover.webp',
    title: { es: 'Nexus City', en: 'Nexus City' },
    subtitle: { es: 'Avatar, Atrio vivo, chat, cápsulas y comunidad.', en: 'Avatar, live Atrium, chat, capsules and community.' },
    signal: { es: 'MUNDO SOCIAL', en: 'SOCIAL WORLD' },
  },
  {
    id: 'web', code: 'XK-05', glyph: '創', route: '/creacion-web', tone: '#f59e0b', image: '/web-services/creacion-web-og.png',
    title: { es: 'Creation Studio', en: 'Creation Studio' },
    subtitle: { es: 'Diseño web con identidad, estrategia y presupuesto real.', en: 'Web design with identity, strategy and honest pricing.' },
    signal: { es: 'FORJA DIGITAL', en: 'DIGITAL FORGE' },
  },
  {
    id: 'green', code: 'XK-13', glyph: '禁', route: '/green-node', tone: '#32ff8a', image: '/assets/identity/green-node-occult-malware-v1.webp',
    title: { es: 'Green Node', en: 'Green Node' },
    subtitle: { es: 'Linux, archivos oscuros, ocultismo y evidencia.', en: 'Linux, dark archives, occultism and evidence.' },
    signal: { es: 'ARCHIVO RESTRINGIDO', en: 'RESTRICTED ARCHIVE' },
  },
] as const

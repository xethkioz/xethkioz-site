import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const templatePath = path.join(root, 'index.html')
const outputDir = path.join(root, 'seo-shells')
const siteUrl = 'https://www.xethkioz.com.ar'

const spanishRoutes = [
  {
    file: 'gaming.html',
    path: '/gaming',
    title: 'Nexus Gaming | Noticias, guías y comunidad | XETHKIOZ',
    description: 'Lanzamientos, MMORPG, esports, guías, builds y señales de Asia dentro del portal Gaming de XETHKIOZ.',
    keywords: 'gaming, videojuegos, MMORPG, esports, guías, builds, Asia Gaming, XETHKIOZ',
    image: '/assets/portal-games-world-v3.webp',
    imageAlt: 'Portal Gaming de XETHKIOZ',
  },
  {
    file: 'gaming-guides.html',
    path: '/gaming/guides',
    title: 'Guías de videojuegos y builds | XETHKIOZ',
    description: 'Guías, configuraciones, builds y rutas de progreso para los juegos destacados por la comunidad XETHKIOZ.',
    keywords: 'guías de videojuegos, builds, MMORPG, RPG, gaming, XETHKIOZ',
    image: '/assets/portal-games-world-v3.webp',
    imageAlt: 'Guías y builds de Gaming XETHKIOZ',
  },
  {
    file: 'science.html',
    path: '/science',
    title: 'Science Lab | Ciencia, IA y tecnología | XETHKIOZ',
    description: 'Ciencia, inteligencia artificial, hardware, software y proyectos explicados con claridad y fuentes dentro de XETHKIOZ.',
    keywords: 'ciencia, inteligencia artificial, tecnología, hardware, software, proyectos, XETHKIOZ',
    image: '/assets/portal-science-world-v3.webp',
    imageAlt: 'Portal Science Lab de XETHKIOZ',
  },
  {
    file: 'comicon.html',
    path: '/comicon',
    title: 'Universo COMICON | Marvel, DC, Anime y cultura fan | XETHKIOZ',
    description: 'Noticias, estrenos, personajes y cultura fan de Marvel, DC Universe, anime, manga, cine, series y cómics.',
    keywords: 'Marvel, DC Universe, anime, manga, cómics, cine, series, cultura fan, XETHKIOZ',
    image: '/assets/xethkioz-light-shadow-comic-anime.webp',
    imageAlt: 'Xethkioz como superhéroe de luz y villano de oscuridad en estilo cómic anime',
  },

  {
    file: 'nexus-city.html',
    path: '/nexus-city',
    title: 'Nexus City | Mundo social y comunidad | XETHKIOZ',
    description: 'El mundo social de XETHKIOZ: avatar, distritos, salas, actividad, identidad y comunidad conectadas a la Red de Portales.',
    keywords: 'Nexus City, comunidad gamer, avatar, mundo social, salas, identidad digital, XETHKIOZ',
    image: '/assets/xethkioz-cover.webp',
    imageAlt: 'Nexus City, el mundo social de XETHKIOZ',
    localized: false,
  },
  {
    file: 'news.html',
    path: '/news',
    title: 'Noticias de gaming, tecnología e IA | XETHKIOZ',
    description: 'Noticias, análisis y señales verificadas sobre videojuegos, tecnología, inteligencia artificial, ciencia y cultura digital.',
    keywords: 'noticias gaming, tecnología, inteligencia artificial, ciencia, esports, XETHKIOZ',
    image: '/assets/xethkioz-cover.png',
    imageAlt: 'Centro de noticias XETHKIOZ',
    localized: false,
  },
  {
    file: 'community.html',
    path: '/community',
    title: 'Comunidad XETHKIOZ | Perfiles, chat y misiones',
    description: 'Entrá a la comunidad XETHKIOZ para descubrir perfiles, actividad, misiones, chat y espacios conectados con Nexus City.',
    keywords: 'comunidad gamer, perfiles, chat, misiones, Nexus City, XETHKIOZ',
    image: '/assets/xethkioz-cover.png',
    imageAlt: 'Comunidad XETHKIOZ',
  },
  {
    file: 'about.html',
    path: '/about',
    title: 'Sobre XETHKIOZ | Gaming, tecnología y Red de Portales',
    description: 'Conocé la historia, la misión y la identidad de XETHKIOZ, un proyecto argentino de gaming, tecnología y cultura digital.',
    keywords: 'sobre XETHKIOZ, gaming, tecnología, proyecto argentino, cultura digital',
    image: '/og-image.svg',
    imageAlt: 'Identidad de XETHKIOZ',
  },
  {
    file: 'contact.html',
    path: '/contact',
    title: 'Contacto | XETHKIOZ',
    description: 'Canales oficiales para contactar a XETHKIOZ por historias, colaboraciones, propuestas, soporte y creación web.',
    keywords: 'contacto XETHKIOZ, colaboraciones, soporte, creación web',
    image: '/og-image.svg',
    imageAlt: 'Contacto oficial de XETHKIOZ',
  },
  {
    file: 'support.html',
    path: '/support',
    title: 'Apoyar el proyecto | XETHKIOZ',
    description: 'Formas oficiales de apoyar el crecimiento de XETHKIOZ, su contenido, infraestructura y proyectos comunitarios.',
    keywords: 'apoyar XETHKIOZ, donaciones, comunidad, proyecto independiente',
    image: '/og-image.svg',
    imageAlt: 'Apoyar el proyecto XETHKIOZ',
  },
  {
    file: 'privacy.html',
    path: '/privacy',
    title: 'Política de privacidad | XETHKIOZ',
    description: 'Información sobre cuentas, registros técnicos, formularios, pagos externos, derechos y protección de datos en XETHKIOZ.',
    keywords: 'privacidad, protección de datos, cuentas, XETHKIOZ',
    image: '/og-image.svg',
    imageAlt: 'Política de privacidad de XETHKIOZ',
  },
  {
    file: 'editorial-policy.html',
    path: '/editorial-policy',
    title: 'Política editorial | XETHKIOZ',
    description: 'Criterios de fuentes, revisión humana, inteligencia artificial, correcciones, humor, sponsors y transparencia editorial.',
    keywords: 'política editorial, fuentes, inteligencia artificial, correcciones, transparencia, XETHKIOZ',
    image: '/og-image.svg',
    imageAlt: 'Política editorial de XETHKIOZ',
  },
]

const englishRoutes = [
  {
    file: 'en-home.html',
    path: '/en',
    title: 'XETHKIOZ | Gaming, Tech, Science and Digital Culture',
    description: 'An independent portal network for gaming, technology, science, artificial intelligence, community and digital culture.',
    keywords: 'gaming, technology, science, artificial intelligence, streaming, digital culture, XETHKIOZ',
    image: '/og-image.svg',
    imageAlt: 'XETHKIOZ global portal network',
  },
  {
    file: 'en-gaming.html',
    path: '/en/gaming',
    title: 'Nexus Gaming | News, guides and community | XETHKIOZ',
    description: 'Releases, MMORPGs, esports, guides, builds and Asian gaming signals inside the XETHKIOZ Gaming portal.',
    keywords: 'gaming, videogames, MMORPG, esports, guides, builds, Asian gaming, XETHKIOZ',
    image: '/assets/portal-games-world-v3.webp',
    imageAlt: 'XETHKIOZ Gaming portal',
  },
  {
    file: 'en-gaming-guides.html',
    path: '/en/gaming/guides',
    title: 'Video Game Guides and Builds | XETHKIOZ',
    description: 'Guides, settings, builds and progression routes for games selected by the XETHKIOZ community.',
    keywords: 'video game guides, builds, MMORPG, RPG, gaming, XETHKIOZ',
    image: '/assets/portal-games-world-v3.webp',
    imageAlt: 'XETHKIOZ gaming guides and builds',
  },
  {
    file: 'en-science.html',
    path: '/en/science',
    title: 'Science Lab | Science, AI and Technology | XETHKIOZ',
    description: 'Science, artificial intelligence, hardware, software and projects explained clearly with verifiable sources.',
    keywords: 'science, artificial intelligence, technology, hardware, software, projects, XETHKIOZ',
    image: '/assets/portal-science-world-v3.webp',
    imageAlt: 'XETHKIOZ Science Lab portal',
  },
  {
    file: 'en-comicon.html',
    path: '/en/comicon',
    title: 'COMICON Universe | Marvel, DC, Anime and fan culture | XETHKIOZ',
    description: 'News, releases, characters and fan culture across Marvel, DC Universe, anime, manga, movies, series and comics.',
    keywords: 'Marvel, DC Universe, anime, manga, comics, movies, series, fan culture, XETHKIOZ',
    image: '/assets/xethkioz-light-shadow-comic-anime.webp',
    imageAlt: 'Xethkioz as a light superhero and dark villain in comic anime style',
  },
  {
    file: 'en-creacion-web.html',
    path: '/en/creacion-web',
    title: 'Professional Web Design and Development | XETHKIOZ',
    description: 'Modern websites, landing pages and online stores built with identity, performance, security and practical administration.',
    keywords: 'web design, web development, landing page, online store, professional website, XETHKIOZ',
    image: '/web-services/creacion-web-og.png',
    imageAlt: 'A professional website created by XETHKIOZ',
  },
  {
    file: 'en-community.html',
    path: '/en/community',
    title: 'XETHKIOZ Community | Profiles, Chat and Missions',
    description: 'Discover profiles, activity, missions, chat and spaces connected to Nexus City in the XETHKIOZ community.',
    keywords: 'gaming community, profiles, chat, missions, Nexus City, XETHKIOZ',
    image: '/assets/xethkioz-cover.png',
    imageAlt: 'XETHKIOZ community',
  },
  {
    file: 'en-about.html',
    path: '/en/about',
    title: 'About XETHKIOZ | Gaming, Technology and Portal Network',
    description: 'Discover the history, mission and identity of XETHKIOZ, an independent Argentine gaming and technology project.',
    keywords: 'about XETHKIOZ, gaming, technology, Argentine project, digital culture',
    image: '/og-image.svg',
    imageAlt: 'XETHKIOZ identity',
  },
  {
    file: 'en-contact.html',
    path: '/en/contact',
    title: 'Contact | XETHKIOZ',
    description: 'Official channels to contact XETHKIOZ about stories, collaborations, proposals, support and web creation.',
    keywords: 'contact XETHKIOZ, collaborations, support, web creation',
    image: '/og-image.svg',
    imageAlt: 'Official XETHKIOZ contact channels',
  },
  {
    file: 'en-support.html',
    path: '/en/support',
    title: 'Support the Project | XETHKIOZ',
    description: 'Official ways to support XETHKIOZ content, infrastructure and community projects.',
    keywords: 'support XETHKIOZ, donations, community, independent project',
    image: '/og-image.svg',
    imageAlt: 'Support the XETHKIOZ project',
  },
  {
    file: 'en-privacy.html',
    path: '/en/privacy',
    title: 'Privacy Policy | XETHKIOZ',
    description: 'Information about accounts, technical logs, forms, external payments, rights and data protection at XETHKIOZ.',
    keywords: 'privacy, data protection, accounts, XETHKIOZ',
    image: '/og-image.svg',
    imageAlt: 'XETHKIOZ privacy policy',
  },
  {
    file: 'en-editorial-policy.html',
    path: '/en/editorial-policy',
    title: 'Editorial Policy | XETHKIOZ',
    description: 'Standards for sources, human review, artificial intelligence, corrections, humor, sponsors and editorial transparency.',
    keywords: 'editorial policy, sources, artificial intelligence, corrections, transparency, XETHKIOZ',
    image: '/og-image.svg',
    imageAlt: 'XETHKIOZ editorial policy',
  },
]

const localizedPairs = new Map([
  ['/', '/en'],
  ['/gaming', '/en/gaming'],
  ['/gaming/guides', '/en/gaming/guides'],
  ['/science', '/en/science'],
  ['/comicon', '/en/comicon'],
  ['/creacion-web', '/en/creacion-web'],
  ['/community', '/en/community'],
  ['/about', '/en/about'],
  ['/contact', '/en/contact'],
  ['/support', '/en/support'],
  ['/privacy', '/en/privacy'],
  ['/editorial-policy', '/en/editorial-policy'],
])

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function absoluteUrl(value) {
  return value.startsWith('http') ? value : `${siteUrl}${value}`
}

function replaceTag(html, pattern, replacement, label) {
  if (!pattern.test(html)) throw new Error(`SEO shell template is missing ${label}.`)
  pattern.lastIndex = 0
  return html.replace(pattern, replacement)
}

function localizedAlternates(routePath) {
  if (localizedPairs.has(routePath)) return { es: routePath, en: localizedPairs.get(routePath) }
  for (const [spanishPath, englishPath] of localizedPairs.entries()) {
    if (englishPath === routePath) return { es: spanishPath, en: englishPath }
  }
  return null
}

function renderShell(template, route, language) {
  const canonical = `${siteUrl}${route.path}`
  const image = absoluteUrl(route.image)
  const locale = language === 'en' ? 'en_US' : 'es_AR'
  const alternateLocale = language === 'en' ? 'es_AR' : 'en_US'
  const alternates = route.localized === false ? null : localizedAlternates(route.path)
  const alternateTags = alternates
    ? `<link data-rh="true" rel="canonical" href="${escapeHtml(canonical)}" />\n    <link rel="alternate" hreflang="es-AR" href="${siteUrl}${alternates.es}" />\n    <link rel="alternate" hreflang="en" href="${siteUrl}${alternates.en}" />\n    <link rel="alternate" hreflang="x-default" href="${siteUrl}${alternates.es}" />`
    : `<link data-rh="true" rel="canonical" href="${escapeHtml(canonical)}" />`
  let html = template

  html = replaceTag(html, /<html lang="[^"]*">/, `<html lang="${language === 'en' ? 'en' : 'es-AR'}">`, 'document language')
  html = replaceTag(html, /<meta data-rh="true" name="description" content="[^"]*" \/>/, `<meta data-rh="true" name="description" content="${escapeHtml(route.description)}" />`, 'description')
  html = replaceTag(html, /<meta name="keywords" content="[^"]*" \/>/, `<meta name="keywords" content="${escapeHtml(route.keywords)}" />`, 'keywords')
  html = replaceTag(html, /<link data-rh="true" rel="canonical" href="[^"]*" \/>/, alternateTags, 'canonical URL')
  html = replaceTag(html, /<meta data-rh="true" property="og:title" content="[^"]*" \/>/, `<meta data-rh="true" property="og:title" content="${escapeHtml(route.title)}" />`, 'Open Graph title')
  html = replaceTag(html, /<meta data-rh="true" property="og:description" content="[^"]*" \/>/, `<meta data-rh="true" property="og:description" content="${escapeHtml(route.description)}" />`, 'Open Graph description')
  html = replaceTag(html, /<meta data-rh="true" property="og:url" content="[^"]*" \/>/, `<meta data-rh="true" property="og:url" content="${escapeHtml(canonical)}" />`, 'Open Graph URL')
  html = replaceTag(html, /<meta data-rh="true" property="og:image" content="[^"]*" \/>/, `<meta data-rh="true" property="og:image" content="${escapeHtml(image)}" />`, 'Open Graph image')
  html = replaceTag(html, /<meta property="og:image:alt" content="[^"]*" \/>/, `<meta property="og:image:alt" content="${escapeHtml(route.imageAlt)}" />`, 'Open Graph image alt')
  html = replaceTag(html, /<meta data-rh="true" property="og:locale" content="[^"]*" \/>/, `<meta data-rh="true" property="og:locale" content="${locale}" />${alternates ? `\n    <meta property="og:locale:alternate" content="${alternateLocale}" />` : ''}`, 'Open Graph locale')
  html = replaceTag(html, /<meta data-rh="true" name="twitter:title" content="[^"]*" \/>/, `<meta data-rh="true" name="twitter:title" content="${escapeHtml(route.title)}" />`, 'Twitter title')
  html = replaceTag(html, /<meta data-rh="true" name="twitter:description" content="[^"]*" \/>/, `<meta data-rh="true" name="twitter:description" content="${escapeHtml(route.description)}" />`, 'Twitter description')
  html = replaceTag(html, /<meta data-rh="true" name="twitter:image" content="[^"]*" \/>/, `<meta data-rh="true" name="twitter:image" content="${escapeHtml(image)}" />`, 'Twitter image')
  html = replaceTag(html, /<meta name="twitter:image:alt" content="[^"]*" \/>/, `<meta name="twitter:image:alt" content="${escapeHtml(route.imageAlt)}" />`, 'Twitter image alt')
  html = replaceTag(html, /<title>[^<]*<\/title>/, `<title>${escapeHtml(route.title)}</title>`, 'document title')
  return html
}

if (!fs.existsSync(templatePath)) throw new Error('index.html was not found.')

const template = fs.readFileSync(templatePath, 'utf8')
fs.rmSync(outputDir, { recursive: true, force: true })
fs.mkdirSync(outputDir, { recursive: true })

for (const route of spanishRoutes) fs.writeFileSync(path.join(outputDir, route.file), renderShell(template, route, 'es'), 'utf8')
for (const route of englishRoutes) fs.writeFileSync(path.join(outputDir, route.file), renderShell(template, route, 'en'), 'utf8')

const allRoutes = [...spanishRoutes, ...englishRoutes]
fs.writeFileSync(
  path.join(outputDir, 'routes.json'),
  `${JSON.stringify(allRoutes.map(({ file, path: routePath }) => ({ file, path: routePath })), null, 2)}\n`,
  'utf8',
)

console.log(`Generated ${allRoutes.length} localized static SEO shells in seo-shells/.`)

import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const templatePath = path.join(root, 'index.html')
const outputDir = path.join(root, 'seo-shells')
const siteUrl = 'https://www.xethkioz.com.ar'

const routes = [
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
    file: 'fun.html',
    path: '/fun',
    title: 'Chaos Alley | Memes, clips y humor gamer | XETHKIOZ',
    description: 'Memes, videos, clips, rarezas y creaciones de la comunidad en el portal de humor y ocio de XETHKIOZ.',
    keywords: 'memes, humor gamer, clips, videos, comunidad, cultura digital, XETHKIOZ',
    image: '/assets/portal-fun-world-v3.webp',
    imageAlt: 'Portal Chaos Alley de XETHKIOZ',
  },
  {
    file: 'news.html',
    path: '/news',
    title: 'Noticias de gaming, tecnología e IA | XETHKIOZ',
    description: 'Noticias, análisis y señales verificadas sobre videojuegos, tecnología, inteligencia artificial, ciencia y cultura digital.',
    keywords: 'noticias gaming, tecnología, inteligencia artificial, ciencia, esports, XETHKIOZ',
    image: '/assets/xethkioz-cover.png',
    imageAlt: 'Centro de noticias XETHKIOZ',
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
    file: 'nexus-city.html',
    path: '/nexus-city',
    title: 'Nexus City | La comunidad viva de XETHKIOZ',
    description: 'La ciudad social de XETHKIOZ con avatares, pasaportes, cápsulas, actividad comunitaria y accesos a la Red de Portales.',
    keywords: 'Nexus City, comunidad gamer, avatares, perfiles, chat, XETHKIOZ',
    image: '/assets/xethkioz-cover.png',
    imageAlt: 'Nexus City de XETHKIOZ',
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

function renderShell(template, route) {
  const canonical = `${siteUrl}${route.path}`
  const image = absoluteUrl(route.image)
  let html = template

  html = replaceTag(html, /<meta data-rh="true" name="description" content="[^"]*" \/>/, `<meta data-rh="true" name="description" content="${escapeHtml(route.description)}" />`, 'description')
  html = replaceTag(html, /<meta name="keywords" content="[^"]*" \/>/, `<meta name="keywords" content="${escapeHtml(route.keywords)}" />`, 'keywords')
  html = replaceTag(html, /<link data-rh="true" rel="canonical" href="[^"]*" \/>/, `<link data-rh="true" rel="canonical" href="${escapeHtml(canonical)}" />`, 'canonical URL')
  html = replaceTag(html, /<meta data-rh="true" property="og:title" content="[^"]*" \/>/, `<meta data-rh="true" property="og:title" content="${escapeHtml(route.title)}" />`, 'Open Graph title')
  html = replaceTag(html, /<meta data-rh="true" property="og:description" content="[^"]*" \/>/, `<meta data-rh="true" property="og:description" content="${escapeHtml(route.description)}" />`, 'Open Graph description')
  html = replaceTag(html, /<meta data-rh="true" property="og:url" content="[^"]*" \/>/, `<meta data-rh="true" property="og:url" content="${escapeHtml(canonical)}" />`, 'Open Graph URL')
  html = replaceTag(html, /<meta data-rh="true" property="og:image" content="[^"]*" \/>/, `<meta data-rh="true" property="og:image" content="${escapeHtml(image)}" />`, 'Open Graph image')
  html = replaceTag(html, /<meta property="og:image:alt" content="[^"]*" \/>/, `<meta property="og:image:alt" content="${escapeHtml(route.imageAlt)}" />`, 'Open Graph image alt')
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

for (const route of routes) {
  fs.writeFileSync(path.join(outputDir, route.file), renderShell(template, route), 'utf8')
}

fs.writeFileSync(
  path.join(outputDir, 'routes.json'),
  `${JSON.stringify(routes.map(({ file, path: routePath }) => ({ file, path: routePath })), null, 2)}\n`,
  'utf8',
)

console.log(`Generated ${routes.length} static SEO shells in seo-shells/.`)

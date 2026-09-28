import fs from 'node:fs'
const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const home = read('src/pages/Home.tsx')
const hub = read('src/pages/WorldOfXethkioz.tsx')
const page = read('src/pages/ElementalRealms.tsx')
const css = read('src/pages/WorldOfXethkiozPortal.css')
const homeCss = read('src/pages/WorldOfXethkiozLanding.css')
const elementalCss = read('src/pages/ElementalRealmsMedia.css')
const hubCss = read('src/pages/WorldOfXethkiozHub.css')
const wispCss = read('src/components/fusion/FusionGlobalWisp.css')
const footer = read('src/components/Footer.tsx')
const checks = [
 ['Home enters the World universe before the current project', home.includes("localizePath('/world-of-xethkioz')") && hub.includes("localizePath('/world-of-xethkioz/elemental-realms')")],
 ['offscreen sections defer rendering with stable placeholders', css.includes('content-visibility:auto') && css.includes('contain-intrinsic-size:auto 680px')],
 ['isolated gallery limits layout and paint work', css.includes('contain:layout paint')],
 ['hero reserves its actual image dimensions and gets loading priority', home.includes('fetchPriority="high"') && home.includes('width="1672" height="941"') && hub.includes('fetchPriority="high"') && hub.includes('width="1672" height="941"') && page.includes('fetchPriority="high"') && page.includes('width="1672" height="941"')],
 ['below-fold art is lazy and asynchronously decoded', page.includes('loading="lazy" decoding="async"')],
 ['public media never autoplays or embeds heavyweight remote surfaces', [home,hub,page].every(s => !/autoPlay|<iframe|<canvas/.test(s))],
 ['Founder Vision, Alpha 2 and Pre-Alpha videos are user-controlled and metadata-only', page.includes('founder-vision.mp4') && page.includes('elemental-realms-alpha-2.mp4') && page.includes('alpha-5-demo.mp4') && (page.match(/controls/g) ?? []).length >= 3 && (page.match(/playsInline/g) ?? []).length >= 3 && (page.match(/preload="metadata"/g) ?? []).length >= 3],
 ['Elemental Realms development stages are explicitly framed as non-final builds', page.includes('ALPHA 2 · ELEMENTAL REALMS') && page.includes('PRE-ALPHA · REGISTRO DE DESARROLLO') && page.includes('NOT A PUBLIC BUILD')],
 ['Elemental Realms exposes current engine and verified movement without internal canon', page.includes('Elemental Realms') && page.includes('Unreal Engine 5.8.3') && page.includes('Caminar, correr, saltar, nadar y bucear') && page.includes('Trepar sigue pendiente')],
 ['page styles have no persistent animation or backdrop filters', [css,homeCss,elementalCss,hubCss].every(s => !/backdrop-filter\s*:|animation\s*:[^;}]*infinite/.test(s))],
 ['both presentations support phones and reduced motion', [css,homeCss,elementalCss,hubCss].every(s => s.includes('@media(max-width:760px)') && /prefers-reduced-motion:\s*reduce/.test(s))],
 ['global mobile Veyr remains on the static profile', wispCss.includes('.xk-wisp .xk-wisp-field,') && wispCss.includes('.xk-wisp .xk-wisp-specter-veyr,') && wispCss.includes('.xk-wisp .xk-wisp-particles{')],
 ['public experience never imports internal game data', [home,hub,page].every(s => !/from ['"][^'"]*(?:game-data|bestiary|quest|lore|canon)/i.test(s) && !/\.(?:glb|gltf|fbx|blend|unitypackage)\b/i.test(s))],
 ['presentation avoids production counts and internal map ranges', [home,hub,page].every(s => !/M\d{2}[–-]M\d{2}|\bQuestID\b|\bBoss\d+\b/.test(s))],
 ['illustrations are clearly not gameplay', [home,hub,page].every(s => s.includes('NO ES GAMEPLAY') && s.includes('NOT GAMEPLAY'))],
 ['Threads and web remain official public destinations in the shared footer', footer.includes('SOCIAL_LINKS.filter') && read('src/lib/siteConfig.ts').includes('https://www.threads.com/@xethkioz') && footer.includes('https://www.xethkioz.com.ar')],
 ['styles stay compact', Buffer.byteLength(css) < 18000 && Buffer.byteLength(homeCss) < 15000 && Buffer.byteLength(elementalCss) < 8000 && Buffer.byteLength(hubCss) < 18000],
]
for (const [name,pass] of checks) console.log(`${pass ? 'PASS' : 'FAIL'} ${name}`)
if (checks.some(([,pass]) => !pass)) process.exit(1)
console.log('Premium Fantasy mobile and public-surface contract passed.')

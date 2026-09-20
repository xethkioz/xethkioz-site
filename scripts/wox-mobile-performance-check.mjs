import fs from 'node:fs'
const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const home = read('src/pages/Home.tsx')
const page = read('src/pages/WorldOfXethkioz.tsx')
const css = read('src/pages/WorldOfXethkiozPortal.css')
const homeCss = read('src/pages/WorldOfXethkiozLanding.css')
const wispCss = read('src/components/fusion/FusionGlobalWisp.css')
const checks = [
 ['offscreen sections defer rendering with stable placeholders', css.includes('content-visibility:auto') && css.includes('contain-intrinsic-size:auto 680px')],
 ['isolated gallery limits layout and paint work', css.includes('contain:layout paint')],
 ['hero reserves dimensions and gets loading priority', [home,page].every(s => s.includes('fetchPriority="high"') && s.includes('width="800" height="800"'))],
 ['below-fold art is lazy and asynchronously decoded', page.includes('loading="lazy" decoding="async"')],
 ['public landing and game portal never autoplay media', [home,page].every(s => !/<video|autoPlay|<iframe|<canvas/.test(s))],
 ['page styles have no persistent animation or backdrop filters', [css,homeCss].every(s => !/backdrop-filter\s*:|animation\s*:[^;}]*infinite/.test(s))],
 ['both presentations support phones and reduced motion', [css,homeCss].every(s => s.includes('@media(max-width:760px)') && s.includes('prefers-reduced-motion: reduce'))],
 ['global mobile Veyr remains on the static profile', wispCss.includes('.xk-wisp .xk-wisp-field,') && wispCss.includes('.xk-wisp .xk-wisp-specter-veyr,') && wispCss.includes('.xk-wisp .xk-wisp-particles{')],
 ['public experience never imports internal game data', [home,page].every(s => !/from ['"][^'"]*(?:game-data|bestiary|quest|lore|canon)/i.test(s) && !/\.(?:glb|gltf|fbx|blend|unitypackage)\b/i.test(s))],
 ['presentation avoids production counts and internal map ranges', [home,page].every(s => !/M\d{2}[–-]M\d{2}|\bQuestID\b|\bBoss\d+\b/.test(s))],
 ['illustrations are clearly not gameplay', [home,page].every(s => s.includes('NO ES GAMEPLAY') && s.includes('NOT GAMEPLAY'))],
 ['Threads and web remain official public destinations', [home,page].every(s => s.includes('https://www.threads.com/@xethkioz') && s.includes('https://www.xethkioz.com.ar'))],
 ['styles stay compact', Buffer.byteLength(css) < 18000 && Buffer.byteLength(homeCss) < 15000],
]
for (const [name,pass] of checks) console.log(`${pass ? 'PASS' : 'FAIL'} ${name}`)
if (checks.some(([,pass]) => !pass)) process.exit(1)
console.log('Premium Fantasy mobile and public-surface contract passed.')

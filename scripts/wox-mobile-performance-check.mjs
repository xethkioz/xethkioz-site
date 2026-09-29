import fs from 'node:fs'
const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const home=read('src/pages/Home.tsx'), game=read('src/pages/ElementalRealms.tsx'), legacy=read('src/pages/WorldOfXethkioz.tsx'), digital=read('src/pages/DigitalHub.tsx')
const fx=read('src/components/portals/PortalEffects.tsx'), css=read('src/components/portals/PortalSystem.css'), homeCss=read('src/pages/HomePortals.css'), inside=read('src/pages/PortalInteriors.css')
const surfaces=[home,game,digital]
const checks=[
 ['Direct game route; legacy hub is only a compatible redirect', home.includes("localizePath('/world-of-xethkioz/elemental-realms')") && legacy.includes('<Navigate') && !legacy.includes('<section')],
 ['Three large sibling portals and a separate full-width Green Node rift', home.includes('portal-triad') && home.includes('portal-node-rift') && home.indexOf('portal-triad') < home.indexOf('portal-node-rift')],
 ['Home has no videos, remote players, canvas or raw 3D downloads', !/<video|<iframe|<canvas|\.glb|\.fbx/.test(home)],
 ['All public game media is controlled, never autoplay', !/autoPlay|<iframe|<canvas/.test(game) && (game.match(/controls playsInline/g)||[]).length===3],
 ['Alpha 2 is the initial video; archives mount only after user intent', game.includes('id="alpha-2"') && game.includes('elemental-realms-alpha-2.mp4') && game.includes('historyOpen &&') && (game.match(/preload="none"/g)||[]).length===2 && (game.match(/preload="metadata"/g)||[]).length===1],
 ['Optional particles are bounded and paused offscreen and in hidden tabs', fx.includes('Math.min(count, 12)') && fx.includes('IntersectionObserver') && fx.includes('visibilitychange') && fx.includes('!document.hidden') && css.includes('animation-play-state:paused')],
 ['Effects have an explicit user pause and reduced-motion support', fx.includes('prefers-reduced-motion: reduce') && fx.includes('portal-effects') && css.includes('prefers-reduced-motion:reduce') && css.includes('html[data-portal-effects="off"]')],
 ['Decorations do not block clicks and mobile limits particle count', css.includes('pointer-events:none') && css.includes('nth-child(n+5)')],
 ['Dedicated page CSS avoids blur animations and heavy background filters', [css,homeCss,inside].every(s=>!/@keyframes[^}]*backdrop-filter/.test(s)) && !homeCss.includes('backdrop-filter')],
 ['Home and interiors use responsive media with reserved dimensions', home.includes('portal-mobile.webp') && home.includes('width="600" height="420"') && game.includes('width="520" height="520"')],
 ['Veyr and B-Rabbit have separate current public identities', game.includes('veyr-companion.webp') && game.includes('b-rabbit-counterpart.webp') && game.includes('EL «BUENO»') && game.includes('EL «MALO»') && !game.includes('veyr-good.webp')],
 ['Raw models and internal lore stay outside public page imports', surfaces.every(s=>!/from ['"][^'"]*(?:game-data|bestiary|quest|lore|canon)|\.(?:glb|gltf|fbx|blend|unitypackage)\b/i.test(s))],
 ['Public illustrations and unfinished Alpha are clearly labeled', home.includes('NO ES GAMEPLAY') && game.includes('NOT A PUBLIC BUILD') && game.includes('NOT GAMEPLAY')],
 ['Route-specific stylesheet size remains bounded', Buffer.byteLength(homeCss)<16000 && Buffer.byteLength(inside)<16000 && Buffer.byteLength(css)<16000],
 ['All portal scenery stays below a 650 kB source budget', fs.readdirSync(new URL('../public/assets/portals/',import.meta.url)).filter(f=>f.endsWith('.webp')).reduce((sum,f)=>sum+fs.statSync(new URL(`../public/assets/portals/${f}`,import.meta.url)).size,0)<650000],
]
for(const [name,ok] of checks) console.log(`${ok?'PASS':'FAIL'} ${name}`)
if(checks.some(([,ok])=>!ok))process.exit(1)
console.log('PASS portal convergence: direct routing, media intent, bounded VFX, current characters and IP boundary')

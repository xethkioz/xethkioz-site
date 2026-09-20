// One-time, branch-scoped synchronization of reviewed public presentation contracts.
import fs from 'node:fs'
import assert from 'node:assert/strict'
const edits = new Map()
function replace(path, before, after) {
  const text = edits.get(path) ?? fs.readFileSync(path, 'utf8')
  assert(text.includes(before), `Expected source changed: ${path}`)
  edits.set(path, text.replace(before, after))
}
replace('src/App.tsx', '  const hasPublicNavigation = !isCmsRoute && !isHomeRoute', "  const isGamePortalRoute = basePath === '/world-of-xethkioz'\n  const hasPublicNavigation = !isCmsRoute && !isHomeRoute && !isGamePortalRoute")
replace('src/App.tsx', "${isPixelGameRoute ? ' xk-is-pixel-game' : ''}`}", "${isPixelGameRoute ? ' xk-is-pixel-game' : ''}${isHomeRoute || isGamePortalRoute ? ' xk-fantasy-shell' : ''}`}")
replace('scripts/content-design-check.mjs', "home.includes('UN MUNDO FRACTURADO. UNA FAMILIA UNIDA.')", "home.includes('EXPLORAR EL JUEGO') && home.includes(\"localizePath('/world-of-xethkioz')\")")
replace('scripts/content-design-check.mjs', "'Home keeps ambient motion with reduced-motion support', home.includes('/assets/bg-dragon-animated.mp4')", "'Home uses static promotional art without autoplay', !home.includes('<video') && !home.includes('autoPlay') && home.includes('/assets/portal-games-world-v3.webp')")
replace('scripts/production-ready-check.mjs', `  'Home ambient video honors motion and data preferences',
  home.includes("matchMedia('(prefers-reduced-motion: reduce)')")
    && home.includes('supportsAmbientVideo(graphicsMode)')
    && read('src/lib/experienceMode.ts').includes('connection?.saveData')
    && home.includes('videoEnabled &&'),`, `  'Home static art avoids motion and video data costs',
  !home.includes('<video') && !home.includes('autoPlay')
    && home.includes('/assets/portal-games-world-v3.webp')
    && homeCss.includes('prefers-reduced-motion: reduce'),`)
replace('scripts/production-ready-check.mjs', "'Home ambient video has a static poster fallback'", "'Home uses an existing public promotional illustration'")
replace('scripts/production-ready-check.mjs', "exists('public/assets/bg-dragon-poster.webp')", "exists('public/assets/portal-games-world-v3.webp')")
replace('scripts/production-ready-check.mjs', "home.includes('/assets/bg-dragon-poster.webp')", "home.includes('/assets/portal-games-world-v3.webp')")
replace('scripts/production-ready-check.mjs', "home.includes('<main className=\"wox-home\">')", "home.includes('<main className=\"wox-home\"')")
replace('scripts/production-ready-check.mjs', "&& home.includes('prefers-reduced-motion: reduce')", "&& !home.includes('<video')")
replace('scripts/production-ready-check.mjs', "homeCss.includes('@media(prefers-reduced-motion:reduce)')", "homeCss.includes('prefers-reduced-motion: reduce')")
replace('scripts/web-services-check.mjs', "home.includes('/assets/bg-dragon-poster.webp') && home.includes('/assets/bg-dragon-animated.mp4') && home.includes('prefers-reduced-motion: reduce')", "home.includes('/assets/portal-games-world-v3.webp') && !home.includes('<video') && homeCss.includes('prefers-reduced-motion: reduce')")
replace('scripts/generate-seo-shells.mjs', 'Portal oficial de World of Xethkioz: Saga I, regiones, protagonistas y arte conceptual protegido del action RPG en desarrollo.', 'El portal oficial de World of Xethkioz. Fantasía, atmósfera y novedades de un Action RPG independiente en desarrollo.')
replace('scripts/generate-seo-shells.mjs', 'Official World of Xethkioz portal: Saga I, regions, protagonists and protected concept art for the action RPG in development.', 'The official World of Xethkioz portal. Fantasy, atmosphere and updates from an independent action RPG in development.')
for (let i = 0; i < 2; i++) replace('scripts/generate-seo-shells.mjs', 'World of Xethkioz, action RPG, Unity 6, URP, 3D/2.5D, Saga I, XETHKIOZ', 'World of Xethkioz, action RPG, fantasy, independent game, XETHKIOZ')
replace('src/components/Header.tsx', "import { Link, NavLink, useNavigate } from 'react-router-dom'", "import './HeaderFantasy.css'\nimport { Link, NavLink, useNavigate } from 'react-router-dom'")
replace('src/components/Header.tsx', '<aside className="fixed left-4 top-1/2', '<aside className="xk-quick-launcher fixed left-4 top-1/2')
replace('src/components/Header.tsx', 'aria-label={t.topNav}>\n            {nav.map', 'aria-label={t.topNav}>\n            <Link className="xk-game-portal-link" to={localizePath(\'/world-of-xethkioz\')}>{lang === \'es\' ? \'EL JUEGO\' : \'THE GAME\'}</Link>\n            {nav.map')
for (const [path, text] of edits) fs.writeFileSync(path, text)
console.log(`Updated ${edits.size} reviewed public presentation files.`)

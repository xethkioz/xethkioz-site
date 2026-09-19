import fs from 'node:fs'

function read(path) {
  return fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

const css = read('src/pages/WorldOfXethkiozPortal.css')
const page = read('src/pages/WorldOfXethkioz.tsx')

const checks = [
  ['mobile portal defers below-fold chapters', css.includes('content-visibility:auto') && css.includes('contain-intrinsic-size:auto 680px')],
  ['mobile portal removes ambient layer', css.includes('.wox-portal-ambient{display:none}')],
  ['mobile portal avoids fixed background grid', css.includes('position:absolute;') && css.includes('mask-image:none;')],
  ['mobile portal removes expensive image filters', css.includes('.wox-portal-regions article::before{filter:none}')],
  ['isolated decorative blocks use containment', css.includes('.wox-portal-orbit,') && css.includes('contain:layout paint')],
  ['hero art is prioritized', page.includes('fetchPriority="high"') && page.includes('decoding="async"')],
  ['below-fold cast art is lazy', page.includes('loading="lazy" decoding="async"')],
]

let failed = 0
for (const [label, ok] of checks) {
  console.log(`${ok ? 'PASS' : 'FAIL'} ${label}`)
  if (!ok) failed += 1
}

if (failed) {
  console.error(`World mobile performance contract failed: ${failed} check(s).`)
  process.exit(1)
}

console.log('World mobile performance contract passed.')

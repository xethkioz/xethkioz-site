import fs from 'node:fs'
import path from 'node:path'
const root=process.cwd()
const home=fs.readFileSync(path.join(root,'src/pages/Home.tsx'),'utf8')
const css=fs.readFileSync(path.join(root,'src/pages/HomePortals.css'),'utf8')
const required=[
  'public/assets/portals/aion2-rune-gate.svg',
  'public/assets/portals/wowforever-rune-gate.svg',
  'public/assets/portals/node-rift.webp',
]
for(const file of required){
  if(!fs.existsSync(path.join(root,file)))throw Error('Missing launcher asset: '+file)
}
for(const gate of ['aion2-rune-gate.svg','wowforever-rune-gate.svg']){
  if(!home.includes(gate))throw Error('Launcher does not reference '+gate)
}
if(home.includes('green-node-intro.mp4'))throw Error('Launcher references uncommitted video')
if(!css.includes('prefers-reduced-motion'))throw Error('Missing reduced-motion support')
if(!home.includes('aria-selected')||!home.includes('aria-expanded'))throw Error('Missing selector accessibility attributes')
console.log('PASS launcher integrity: gates, Green Node fallback, reduced motion and selector attributes')

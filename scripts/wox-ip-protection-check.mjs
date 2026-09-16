import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const publicWorld = path.join(root, 'public/assets/world-of-xethkioz')
const forbiddenExtensions = new Set(['.glb', '.gltf', '.fbx', '.obj', '.blend', '.zip', '.7z'])
const forbiddenLegacyPaths = [
  'public/assets/world-of-xethkioz/veyr/veyr-wisp-poster.webp',
  'public/assets/world-of-xethkioz/veyr/veyr-wisp-v03.glb',
  'public/assets/world-of-xethkioz/xethkioz/xethkioz-lod0-production.webp',
]
const requiredWebArt = ['player-etereo-sigil.svg','xethkioz-resonance-sigil.svg','veyr-green-sigil.svg','biome-izrdralar.svg','biome-desfralar.svg','biome-xiomalar.svg','biome-zodnight.svg','hero-family-resonance.svg']
const files = []
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
  const full = path.join(dir, entry.name)
  entry.isDirectory() ? walk(full) : files.push(full)
})
walk(publicWorld)
const forbiddenFiles = files.filter((file) => forbiddenExtensions.has(path.extname(file).toLowerCase()))
const legacyPresent = forbiddenLegacyPaths.filter((file) => fs.existsSync(path.join(root, file)))
const missingWebArt = requiredWebArt.filter((file) => !fs.existsSync(path.join(publicWorld, 'web-art', file)))
const source = ['src/pages/Home.tsx','src/components/fusion/FusionGlobalWisp.tsx','src/components/fusion/FusionGlobalWisp.css'].map((file) => fs.readFileSync(path.join(root, file), 'utf8')).join('\n')
const leakedReferences = forbiddenLegacyPaths.filter((file) => source.includes('/' + file.replace(/^public\//, '')))
if (forbiddenFiles.length || legacyPresent.length || missingWebArt.length || leakedReferences.length) {
  console.error(JSON.stringify({ forbiddenFiles, legacyPresent, missingWebArt, leakedReferences }, null, 2)); process.exit(1)
}
console.log(`PASS World IP protection: ${requiredWebArt.length} protected web-art assets, 0 raw 3D/archive files and 0 legacy public references.`)

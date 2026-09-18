import { execFileSync } from 'node:child_process'

const tracked = execFileSync('git', ['ls-files'], { encoding: 'utf8' })
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter(Boolean)

const forbiddenExtensions = [
  '.blend', '.blend1', '.fbx', '.obj', '.glb', '.gltf', '.stl',
  '.unity', '.prefab', '.unitypackage', '.psd', '.kra', '.7z', '.rar'
]

const forbiddenPrefixes = [
  'Assets/',
  'ProjectSettings/',
  'Packages/',
  'game/',
  'World of Xethkioz/',
  'world-of-xethkioz-private/'
]

const forbiddenNames = [
  'GAME_BIBLE',
  'HISTORIA_OFICIAL',
  'BESTIARIO_MAESTRO',
  'CATALOGO_MAESTRO_ENTIDADES',
  'CANON_FREEZE'
]

const violations = tracked.filter((file) => {
  const lower = file.toLowerCase()
  const extBlocked = forbiddenExtensions.some((ext) => lower.endsWith(ext))
  const prefixBlocked = forbiddenPrefixes.some((prefix) => file.startsWith(prefix))
  const nameBlocked = forbiddenNames.some((token) => file.toUpperCase().includes(token))
  return extBlocked || prefixBlocked || nameBlocked
})

console.log('# XETHKIOZ Public Web IP Boundary Check')
console.log('Tracked files:', tracked.length)

if (violations.length) {
  console.error('FAIL - proprietary game-source material detected in public web repository:')
  for (const file of violations) console.error(' -', file)
  process.exit(1)
}

console.log('PASS - no editable game-source or protected canon artifacts are tracked.')

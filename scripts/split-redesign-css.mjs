import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const sourcePath = path.join(root, 'src', 'xethkioz-redesign.css')
const homeRingsPath = path.join(root, 'src', 'home-portal-rings.css')
const generatedDir = path.join(root, 'src', 'generated')

const outputPaths = {
  core: path.join(generatedDir, 'xethkioz-core.css'),
  home: path.join(generatedDir, 'home-shell.css'),
  greenNode: path.join(generatedDir, 'green-node-shell.css'),
  gamingFun: path.join(generatedDir, 'gaming-fun-shell.css'),
  gamingSections: path.join(generatedDir, 'gaming-sections-shell.css'),
  science: path.join(generatedDir, 'science-shell.css'),
  nexusDistrict: path.join(generatedDir, 'nexus-district-shell.css'),
  editorial: path.join(generatedDir, 'editorial-shell.css'),
  funNexus: path.join(generatedDir, 'fun-nexus-shell.css'),
  passport: path.join(generatedDir, 'passport-shell.css'),
  room: path.join(generatedDir, 'room-shell.css'),
}

const MARKERS = {
  homePortals: '@keyframes portal-orbit',
  homePortalsEnd: '.xk-noise {',
  greenBase: '@keyframes xk-access-shake',
  gamingFun: '/* Anime portals: Games and Memes intentionally use different visual grammars. */',
  greenTerminal: '.xk-green-terminal{',
  science: '.xk-tech-stack,',
  homeStory: '/* Home manifesto: gives the portal network a human reason to exist. */',
  sharedActivity: '/* A shared activity loop makes every universe feel connected without erasing its tone. */',
  nexusDistrict: '/* Nexus City: one living world with a readable identity for every district. */',
  editorial: '/* Editorial dossiers: reading should feel like entering a mission, not opening a form. */',
  funArcade: '/* Oasis 3.0 Fun Arcade: humor becomes an activity rather than another content grid. */',
  practicalScience: '/* Practical Science Lab: audience routes and a transparent external reference library. */',
  nexusSocial: '/* Nexus City Social Alpha: avatar forge, districts and a safe earned-cosmetic loop. */',
  publicPassport: '/* Public Nexus Passport route. */',
  rooms: '/* Nexus City Living Rooms 03: visitable capsule, presence and movement. */',
  universe: '/* XETHKIOZ Universe Network 10: orbital world selector and shared transit line. */',
  gamingSections: '/* Gaming hub sections: one purpose per view instead of one endless page. */',
}

function writeIfChanged(filePath, content) {
  if (fs.existsSync(filePath) && fs.readFileSync(filePath, 'utf8') === content) return false
  fs.writeFileSync(filePath, content)
  return true
}

function locateBlock(source, startMarker, endMarker, label) {
  const start = source.indexOf(startMarker)
  const end = endMarker === null ? source.length : source.indexOf(endMarker, start)
  if (start < 0 || end < 0 || end <= start) throw new Error(`${label} CSS markers are missing or out of order.`)
  return { label, start, end, content: source.slice(start, end).trim() }
}

function removeBlocks(source, blocks) {
  const ordered = [...blocks].sort((left, right) => left.start - right.start)
  let cursor = 0
  const retained = []
  for (const block of ordered) {
    if (block.start < cursor) throw new Error(`${block.label} CSS range overlaps a previous extraction.`)
    retained.push(source.slice(cursor, block.start).trim())
    cursor = block.end
  }
  retained.push(source.slice(cursor).trim())
  return retained.filter(Boolean).join('\n\n').trim()
}

function generated(label, content) {
  return `/* AUTO-GENERATED ${label}. Edit src/xethkioz-redesign.css instead. */\n${content.trim()}\n`
}

if (!fs.existsSync(sourcePath)) throw new Error(`CSS source not found: ${path.relative(root, sourcePath)}`)
if (!fs.existsSync(homeRingsPath)) throw new Error(`Home ring CSS source not found: ${path.relative(root, homeRingsPath)}`)

const source = fs.readFileSync(sourcePath, 'utf8')
const homeRings = fs.readFileSync(homeRingsPath, 'utf8').trim()
const blocks = {
  homePortals: locateBlock(source, MARKERS.homePortals, MARKERS.homePortalsEnd, 'Home portals'),
  greenBase: locateBlock(source, MARKERS.greenBase, MARKERS.gamingFun, 'Green Node base'),
  gamingFun: locateBlock(source, MARKERS.gamingFun, MARKERS.greenTerminal, 'Gaming and Fun'),
  greenTerminal: locateBlock(source, MARKERS.greenTerminal, MARKERS.science, 'Green Node terminal'),
  science: locateBlock(source, MARKERS.science, MARKERS.homeStory, 'Science tools'),
  homeStory: locateBlock(source, MARKERS.homeStory, MARKERS.sharedActivity, 'Home manifesto'),
  nexusDistrict: locateBlock(source, MARKERS.nexusDistrict, MARKERS.editorial, 'Nexus district'),
  editorial: locateBlock(source, MARKERS.editorial, MARKERS.funArcade, 'Editorial and Oasis'),
  funArcade: locateBlock(source, MARKERS.funArcade, MARKERS.practicalScience, 'Fun Arcade'),
  practicalScience: locateBlock(source, MARKERS.practicalScience, MARKERS.nexusSocial, 'Practical Science'),
  funNexus: locateBlock(source, MARKERS.nexusSocial, MARKERS.publicPassport, 'Nexus Social and Living World'),
  passport: locateBlock(source, MARKERS.publicPassport, MARKERS.rooms, 'Public passport'),
  room: locateBlock(source, MARKERS.rooms, MARKERS.universe, 'Nexus rooms and co-presence'),
  gamingSections: locateBlock(source, MARKERS.gamingSections, null, 'Gaming sections'),
}

const coreBlock = removeBlocks(source, Object.values(blocks))
const outputs = {
  core: generated('global core CSS', coreBlock),
  home: generated('Home route CSS', `${blocks.homePortals.content}\n\n${blocks.homeStory.content}\n\n${homeRings}`),
  greenNode: generated('Green Node route CSS', `${blocks.greenBase.content}\n\n${blocks.greenTerminal.content}`),
  gamingFun: generated('Gaming and Fun shared route CSS', blocks.gamingFun.content),
  gamingSections: generated('Gaming route sections CSS', blocks.gamingSections.content),
  science: generated('Science route CSS', `${blocks.science.content}\n\n${blocks.practicalScience.content}`),
  nexusDistrict: generated('NexusDistrict component CSS', blocks.nexusDistrict.content),
  editorial: generated('Editorial routes CSS', blocks.editorial.content),
  funNexus: generated('Fun Nexus City route CSS', `${blocks.funArcade.content}\n\n${blocks.funNexus.content}`),
  passport: generated('Public Nexus Passport route CSS', blocks.passport.content),
  room: generated('Nexus room route CSS', blocks.room.content),
}

const requiredContracts = [
  ['home', '.xk-home-portal-shell', '.xk-home-story'],
  ['greenNode', '.xk-green-shell', '.xk-green-terminal'],
  ['gamingFun', '.xk-anime-page', '.xk-meme-bento'],
  ['gamingSections', '.xk-gaming-section-nav', '.xk-gaming-start'],
  ['science', '.xk-tech-stack', '.xk-learning-routes'],
  ['nexusDistrict', '.xk-nexus-district', '.xk-nexus-sign'],
  ['editorial', '.xk-news-dossier', '.xk-news-simple-meta'],
  ['funNexus', '.xk-fun-arcade', '.xk-city-page'],
  ['passport', '.xk-public-passport', '.xk-public-avatar-stage'],
  ['room', '.xk-room-page', '.xk-living-room'],
]
for (const [outputKey, ...selectors] of requiredContracts) {
  for (const selector of selectors) {
    if (!outputs[outputKey].includes(selector)) throw new Error(`${outputKey} CSS is missing contract ${selector}.`)
  }
}

const forbiddenCoreMarkers = [
  '@keyframes portal-world-drift', MARKERS.homeStory, '.xk-green-shell', MARKERS.gamingFun,
  '.xk-tech-stack,.xk-lab-assistant', MARKERS.nexusDistrict, MARKERS.editorial, MARKERS.funArcade,
  MARKERS.practicalScience, MARKERS.nexusSocial, MARKERS.publicPassport, MARKERS.rooms, MARKERS.gamingSections,
]
for (const marker of forbiddenCoreMarkers) {
  if (outputs.core.includes(marker)) throw new Error(`Route CSS leaked into the global core: ${marker}`)
}
if (!outputs.core.includes(MARKERS.universe)) throw new Error('The shared Universe Network must remain in the global core for this phase.')

fs.mkdirSync(generatedDir, { recursive: true })
const wrote = {}
for (const [key, content] of Object.entries(outputs)) wrote[key] = writeIfChanged(outputPaths[key], content)

const sourceBytes = Buffer.byteLength(source) + Buffer.byteLength(homeRings)
const globalCoreBytes = Buffer.byteLength(outputs.core)
console.log(JSON.stringify({
  sourceBytes,
  globalCoreBytes,
  globalReductionBytes: sourceBytes - globalCoreBytes,
  routeBytes: Object.fromEntries(Object.entries(outputs).filter(([key]) => key !== 'core').map(([key, content]) => [key, Buffer.byteLength(content)])),
  wrote,
}))

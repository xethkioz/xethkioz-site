import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const sourcePath = path.join(root, 'src', 'xethkioz-redesign.css')
const homeRingsPath = path.join(root, 'src', 'home-portal-rings.css')
const generatedDir = path.join(root, 'src', 'generated')
const corePath = path.join(generatedDir, 'xethkioz-core.css')
const homePath = path.join(generatedDir, 'home-shell.css')
const greenNodePath = path.join(generatedDir, 'green-node-shell.css')
const gamingFunPath = path.join(generatedDir, 'gaming-fun-shell.css')
const sciencePath = path.join(generatedDir, 'science-shell.css')

const HOME_PORTALS_START = '@keyframes portal-orbit'
const HOME_PORTALS_END = '.xk-noise {'
const GREEN_START = '@keyframes xk-access-shake'
const GAMING_FUN_START = '/* Anime portals: Games and Memes intentionally use different visual grammars. */'
const GREEN_TERMINAL_START = '.xk-green-terminal{'
const SCIENCE_START = '.xk-tech-stack,'
const HOME_STORY_START = '/* Home manifesto: gives the portal network a human reason to exist. */'
const HOME_STORY_END = '/* A shared activity loop makes every universe feel connected without erasing its tone. */'

function writeIfChanged(filePath, content) {
  if (fs.existsSync(filePath) && fs.readFileSync(filePath, 'utf8') === content) return false
  fs.writeFileSync(filePath, content)
  return true
}

function locateBlock(source, startMarker, endMarker, label) {
  const start = source.indexOf(startMarker)
  const end = source.indexOf(endMarker, start)
  if (start < 0 || end < 0 || end <= start) {
    throw new Error(`${label} CSS markers are missing or out of order.`)
  }
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

if (!fs.existsSync(sourcePath)) {
  throw new Error(`CSS source not found: ${path.relative(root, sourcePath)}`)
}
if (!fs.existsSync(homeRingsPath)) {
  throw new Error(`Home ring CSS source not found: ${path.relative(root, homeRingsPath)}`)
}

const source = fs.readFileSync(sourcePath, 'utf8')
const homeRings = fs.readFileSync(homeRingsPath, 'utf8').trim()
const homePortals = locateBlock(source, HOME_PORTALS_START, HOME_PORTALS_END, 'Home portals')
const greenBase = locateBlock(source, GREEN_START, GAMING_FUN_START, 'Green Node base')
const gamingFun = locateBlock(source, GAMING_FUN_START, GREEN_TERMINAL_START, 'Gaming and Fun')
const greenTerminal = locateBlock(source, GREEN_TERMINAL_START, SCIENCE_START, 'Green Node terminal')
const science = locateBlock(source, SCIENCE_START, HOME_STORY_START, 'Science tools')
const homeStory = locateBlock(source, HOME_STORY_START, HOME_STORY_END, 'Home manifesto')
const extractedBlocks = [homePortals, greenBase, gamingFun, greenTerminal, science, homeStory]
const coreBlock = removeBlocks(source, extractedBlocks)
const homeBlock = `${homePortals.content}\n\n${homeStory.content}`
const greenBlock = `${greenBase.content}\n\n${greenTerminal.content}`

if (!homeBlock.includes('.xk-home-portal-shell') || !homeBlock.includes('.xk-home-story')) {
  throw new Error('Home CSS extraction did not include the expected portal and manifesto contracts.')
}
if (!greenBlock.includes('.xk-green-shell') || !greenBlock.includes('.xk-green-terminal')) {
  throw new Error('Green Node CSS extraction did not include the expected shell and terminal contracts.')
}
if (!gamingFun.content.includes('.xk-anime-page') || !gamingFun.content.includes('.xk-meme-bento')) {
  throw new Error('Gaming/Fun CSS extraction did not include both portal contracts.')
}
if (!science.content.includes('.xk-tech-stack') || !science.content.includes('.xk-lab-assistant')) {
  throw new Error('Science CSS extraction did not include the expected laboratory contracts.')
}
if (coreBlock.includes('@keyframes portal-world-drift') || coreBlock.includes('.xk-home-specter-energy')) {
  throw new Error('Home portal selectors leaked back into the global core.')
}
if (coreBlock.includes(HOME_STORY_START)) {
  throw new Error('The Home manifesto base block leaked back into the global core.')
}
if (coreBlock.includes('.xk-green-shell') || coreBlock.includes('.xk-green-terminal{')) {
  throw new Error('Green Node route selectors leaked back into the global core.')
}
if (coreBlock.includes(GAMING_FUN_START) || coreBlock.includes('.xk-meme-bento')) {
  throw new Error('Gaming/Fun base selectors leaked back into the global core.')
}
if (coreBlock.includes('.xk-tech-stack,.xk-lab-assistant')) {
  throw new Error('Science base selectors leaked back into the global core.')
}

fs.mkdirSync(generatedDir, { recursive: true })

const coreOutput = `/* AUTO-GENERATED by scripts/split-redesign-css.mjs. Edit src/xethkioz-redesign.css instead. */\n${coreBlock}\n`
const homeOutput = `/* AUTO-GENERATED Home route CSS. Sources: xethkioz-redesign.css + home-portal-rings.css */\n${homeBlock}\n\n${homeRings}\n`
const greenNodeOutput = `/* AUTO-GENERATED Green Node route CSS. Source: src/xethkioz-redesign.css */\n${greenBlock}\n`
const gamingFunOutput = `/* AUTO-GENERATED Gaming and Fun route CSS. Source: src/xethkioz-redesign.css */\n${gamingFun.content}\n`
const scienceOutput = `/* AUTO-GENERATED Science route CSS. Source: src/xethkioz-redesign.css */\n${science.content}\n`

const coreChanged = writeIfChanged(corePath, coreOutput)
const homeChanged = writeIfChanged(homePath, homeOutput)
const greenChanged = writeIfChanged(greenNodePath, greenNodeOutput)
const gamingFunChanged = writeIfChanged(gamingFunPath, gamingFunOutput)
const scienceChanged = writeIfChanged(sciencePath, scienceOutput)

console.log(JSON.stringify({
  sourceBytes: Buffer.byteLength(source) + Buffer.byteLength(homeRings),
  globalCoreBytes: Buffer.byteLength(coreOutput),
  homeBytes: Buffer.byteLength(homeOutput),
  greenNodeBytes: Buffer.byteLength(greenNodeOutput),
  gamingFunBytes: Buffer.byteLength(gamingFunOutput),
  scienceBytes: Buffer.byteLength(scienceOutput),
  globalReductionBytes: Buffer.byteLength(source) + Buffer.byteLength(homeRings) - Buffer.byteLength(coreOutput),
  wrote: {
    core: coreChanged,
    home: homeChanged,
    greenNode: greenChanged,
    gamingFun: gamingFunChanged,
    science: scienceChanged,
  },
}))

import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8')
const checks = []
const add = (name, ok, detail) => checks.push({ name, ok: Boolean(ok), detail })

const green = read('src/pages/GreenNode.tsx')
const greenGuide = read('src/components/GreenNodeWispGuide.tsx')
const greenGuideCss = read('src/components/GreenNodeWispGuide.css')
const globalWisp = read('src/components/fusion/FusionGlobalWisp.tsx')
const dossiers = read('src/data/greenNodeDossiers.ts')
const greenCss = read('src/pages/GreenNodeDossiers.css')
const fun = read('src/pages/FunPortal.tsx')
const funGateway = read('src/components/fun/FunGameGateway.tsx')
const funCss = read('src/pages/FunNexusFusion.css')
const guides = read('src/pages/GamingGuides.tsx')
const guidesCss = read('src/pages/GamingGuidesV2.css')
const classCatalog = read('src/data/gameClassCatalog.ts')
const classDirectory = read('src/components/gaming/ClassGuideDirectory.tsx')
const popularBuildCatalog = read('src/data/popularBuildCatalog.ts')
const gaming = read('src/pages/GamingHub.tsx')
const pixelWorld = read('src/pages/NexusPixelWorld.tsx')
const pixelCss = read('src/pages/NexusPixelWorld.css')
const chat = read('src/components/nexus/NexusChatWidget.tsx')
const directMessages = read('src/components/nexus/NexusDirectMessages.tsx')
const directMigration = read('supabase/migrations/20260722183000_nexus_direct_messages.sql')

add('Green Node has at least twenty sourced dossiers', (dossiers.match(/id: '/g) ?? []).length >= 20, 'Expected twenty evidence-labelled files with primary sources.')
add('New cybercrime cases use primary public sources', ['MIRAI-2016', 'BAYONET-2017', 'DARKSIDE-2021', 'SILKROAD-2013'].every((code) => dossiers.includes(code)) && dossiers.includes('justice.gov') && dossiers.includes('fbi.gov'), 'Cybercrime records must link to FBI or DOJ material.')
add('Declassified and mystery additions preserve evidence limits', dossiers.includes('COINTELPRO-1956') && dossiers.includes('BLUEBOOK-1952') && dossiers.includes('no constituye por sí mismo evidencia extraterrestre'), 'Documented programs must not become unsupported conclusions.')
add('Expanded cyber archive covers major attacks and surveillance', ['WANNACRY-2017', 'NOTPETYA-2017', 'VAULT7-2017', 'HIVE-2023', 'CRONOS-2024', 'PRISM-2008'].every((code) => dossiers.includes(code)), 'The expanded archive must retain the six new sourced investigations.')
add('Case-file search exposes useful archive discovery', green.includes('type="search"') && green.includes('dossierQuery') && green.includes('xk-dossier-no-results'), 'Visitors need search and a clear empty state.')
add('Investigation progress remains local and resettable', green.includes('GREEN_PROGRESS_KEY') && green.includes('window.localStorage.setItem') && green.includes('resetInvestigation'), 'Green progress should not require identity or remote tracking.')
add('Three hidden signals gate the final correlation', ['GHOST-14', 'MIRROR-07', 'ORBIT-69', 'correlacion_13'].every((signal) => green.includes(signal)) && green.includes('investigationComplete'), 'All three fragments and the final command are required.')
add('Reading a dossier advances investigation safely', green.includes('onToggle={(event) =>') && green.includes('markDossierRead') && !green.includes('eval('), 'Details interaction should update local progress without executing code.')
add('Green investigation is responsive', greenCss.includes('.xk-green-investigation') && greenCss.includes('.xk-signal-fragments') && greenCss.includes('@media(max-width:760px)'), 'Investigation board needs mobile layout rules.')
add('Fun offers explicit game and meme modes', fun.includes("type FunPortalMode = 'play' | 'memes'") && fun.includes('xk-fun-mode-switcher') && fun.includes("selectPortalMode('play')") && fun.includes("selectPortalMode('memes')"), 'The two experiences should be selectable and announced as tabs.')
add('Nexus City is lazy and mounted only on explicit request', fun.includes("const NexusCity = lazy(() => import('./NexusCity'))") && fun.includes("activeMode === 'play'") && fun.includes('showNexusHub ? <Suspense'), 'The full Nexus hub should not mount until the visitor asks for it.')
add('Meme deep links select the right internal section', fun.includes("['#humor', '#weekly-clip', '#meme-wall']") && fun.includes("section=clips#weekly-clip") && fun.includes("section=wall#meme-wall") && funGateway.includes('/fun?mode=memes#humor'), 'Existing anchors and new section URLs must resolve predictably.')
add('Meme Core renders one focused section at a time', ['home', 'arcade', 'clips', 'wall'].every((section) => fun.includes(`activeMemeSection === '${section}'`)) && fun.includes('xk-meme-section-nav'), 'Arcade, clips and the wall must not remain in one oversized page.')
add('Fun mode selector adapts to mobile and reduced motion', funCss.includes('.xk-fun-mode-switcher') && funCss.includes('grid-template-columns:1fr') && funCss.includes('prefers-reduced-motion'), 'Mode controls need mobile and reduced-motion support.')
add('Guides aggregate progress across the library', guides.includes('libraryProgress') && guides.includes('guideProgressKey') && guides.includes('xk-guide-command-progress'), 'The guide hub should expose total completed steps.')
add('Guides recommend an incomplete route', guides.includes('routes.find((route) => route.done > 0') && guides.includes('CONTINUAR RUTA') && guides.includes('openSearchResult(libraryProgress.next'), 'A visitor needs a direct continuation action.')
add('Guide command center is responsive', guidesCss.includes('.xk-guide-command') && guidesCss.includes('@media(max-width:560px)'), 'Campaign progress must collapse to one column on small screens.')
add('Guide library exposes at least fifty-five current class and job routes', (classCatalog.match(/^\s+entry\(/gm) ?? []).length >= 55 && ['wow', 'diablo', 'ffxiv', 'poe'].every((game) => classCatalog.includes(`id: '${game}'`)) && classCatalog.includes('Runes of Aldur 0.5.4b'), 'The four main games should expose current playable routes and prioritize PoE 2.')
add('Build catalog exposes at least eighty versioned configurations', (popularBuildCatalog.match(/(?:wowSeed|d4Seed|ffxivSeed|poeSeed)\(/g) ?? []).length >= 80 && ['skills', 'stats', 'gear', 'rotation', 'progression', 'snapshot'].every((field) => popularBuildCatalog.includes(`${field}:`)), 'Class profiles must include skills, stats, equipment, rotation, progression and a dated snapshot.')
add('Class directory is searchable and deep-linkable', classDirectory.includes("view', 'classes'") && classDirectory.includes("next.set('class'") && classDirectory.includes("next.set('build'") && classDirectory.includes('sourceHref'), 'Visitors need search, direct build URLs and official references.')
add('Green Node is split into four focused views', ['overview', 'dossiers', 'terminal', 'signals'].every((view) => green.includes(`${view}:`)) && green.includes('xk-green-view-nav'), 'The archive should no longer render as one oversized stack.')
add('Green overview cards open their selected node', green.includes('function openNode(nodeId: string)') && green.includes("next.set('view', 'signals')") && green.includes("next.set('node', nodeId)") && green.includes('onClick={() => openNode(node.id)}'), 'Open node must navigate to the selected signal content instead of only changing hidden state.')
add('WISP teaches every Green Node area', ['overview', 'dossiers', 'terminal', 'signals', 'CORRELACIÓN_13'].every((token) => greenGuide.includes(token)) && green.includes('<GreenNodeWispGuide'), 'The guide must explain the map, files, safe terminal, intercepts and investigation objective.')
add('WISP guide is local, dismissible and reopenable', greenGuide.includes('WISP_GREEN_GUIDE_STORAGE_KEY') && greenGuide.includes('localStorage.setItem') && globalWisp.includes('WISP_GREEN_GUIDE_EVENT') && globalWisp.includes('window.dispatchEvent'), 'First-visit state should remain local and the floating WISP must reopen help on demand.')
add('WISP guide supports mobile and reduced motion', greenGuideCss.includes('@media(max-width:700px)') && greenGuideCss.includes('@media(prefers-reduced-motion:reduce)'), 'The walkthrough must remain usable on small screens and respect motion preferences.')
add('Gaming hub is split into five focused sections', ['overview', 'guides', 'live', 'news', 'community'].every((section) => gaming.includes(`${section}:`)) && gaming.includes('xk-gaming-section-nav'), 'Gaming should expose a clear section switcher.')
add('Pixel world is larger and keeps mobile controls', pixelCss.includes('width: min(1500px, 100%)') && pixelCss.includes('height: min(820px') && pixelCss.includes('60dvh') && pixelWorld.includes('xk-pixel-controls'), 'The playable area must grow without dropping touch controls.')
add('Pixel chat persists in the global General room', pixelWorld.includes(".eq('room_id', 'general')") && pixelWorld.includes("room_id: 'general'") && pixelWorld.includes('xk-pixel-chat-log'), 'World bubbles and the global chat must share a durable channel.')
add('Private messaging requires accepted contacts and participant RLS', directMigration.includes("relation.status = 'accepted'") && directMigration.includes('nexus_direct_messages_participant_read') && directMigration.includes('revoke all on public.nexus_direct_messages from anon'), 'Anonymous users and non-participants must not read or send direct messages.')
add('Private message reports expose only selected evidence', chat.includes('NexusDirectMessages') && directMessages.includes('evidence_snapshot: message.body') && directMigration.includes('moderators cannot browse them'), 'Moderation should receive the reported excerpt, not unrestricted conversation access.')

let failures = 0
for (const item of checks) {
  console.log(`${item.ok ? 'PASS' : 'FAIL'} ${item.name}`)
  if (!item.ok) {
    failures += 1
    console.log(`  ${item.detail}`)
  }
}

if (failures) {
  console.error(`Green/Games/Guides audit failed: ${failures}/${checks.length}`)
  process.exit(1)
}

console.log(`Green/Games/Guides audit PASS (${checks.length}/${checks.length})`)

import fs from 'node:fs'

const read = (file) => fs.readFileSync(file, 'utf8')
const component = read('src/components/PortalWispGuide.tsx')
const css = read('src/components/PortalWispGuide.css')
const fun = read('src/pages/FunPortal.tsx')
const gaming = read('src/pages/GamingHub.tsx')
const checks = []
const add = (name, pass, detail) => checks.push({ name, pass: Boolean(pass), detail })

add('Reusable portal Wisp guide exists', component.includes('PortalWispVariant') && component.includes('PortalWispGuideProps'), 'Fun and Gaming must share behavior without duplicating guide state.')
add('Lumina covers both Fun modes', ['play', 'memes-home', 'memes-arcade', 'memes-clips', 'memes-wall'].every((destination) => component.includes(`destination: '${destination}'`)), 'Lumina must explain Nexus Plaza and every Meme Core subsection.')
add('Elemental Wisp covers every Gaming section', ['overview', 'guides', 'live', 'news', 'community'].every((destination) => component.includes(`destination: '${destination}'`)), 'The guide must explain all sections that Gaming can mount.')
add('Elemental modes change the visual state', ['fire', 'arcane', 'ice'].every((energy) => component.includes(`energy: '${energy}'`) && css.includes(`[data-energy="${energy}"]`)), 'Fire, Arcane and Ice must be functional guide states.')
add('Lumina has a distinct identity', component.includes("name: 'LÚMINA'") && component.includes("identity: 'WISP DE LUZ Y RISA'"), 'Fun must not reuse Green Node or Gaming copy.')
add('Completion stays local and separate', component.includes("'xethkioz.fun.wisp-guide.v1'") && component.includes("'xethkioz.gaming.wisp-guide.v1'") && component.includes('window.localStorage'), 'Each first-visit tour must be remembered only on-device.')
add('Guides reopen from their local entities', component.includes('function reopenGuide()') && component.includes('onClick={reopenGuide}'), 'Visitors must always be able to ask the local Wisp for help again.')
add('Step navigation changes visible content', component.includes('onNavigate(t.steps[boundedIndex].destination)') && fun.includes('onNavigate={navigateWithLumina}') && gaming.includes('onNavigate={navigateWithElementalWisp}'), 'A guide step must mount the section it explains.')
add('Fun route state remains URL-backed', fun.includes('selectPortalMode') && fun.includes('selectMemeSection') && fun.includes('navigateWithLumina'), 'Lumina must use the existing shareable portal navigation.')
add('Gaming route state remains URL-backed', gaming.includes('selectSection') && gaming.includes('navigateWithElementalWisp'), 'Elemental Wisp must use the existing shareable section navigation.')
add('Green Wisp is not repurposed', !component.includes('green-node') && !fun.includes('WISP_GREEN_GUIDE_EVENT') && !gaming.includes('WISP_GREEN_GUIDE_EVENT'), 'Local companions must not replace the secret Green Node Wisp.')
add('Reduced motion is respected', css.includes('@media(prefers-reduced-motion:reduce)'), 'Procedural Wisp animation needs an accessible reduced-motion state.')

console.log('# XETHKIOZ Portal Wisp Guides Check')
for (const check of checks) console.log(`${check.pass ? 'PASS' : 'FAIL'} - ${check.name}\n  ${check.detail}`)
const failed = checks.filter((check) => !check.pass)
console.log(`\nResult: ${failed.length ? 'FAIL' : 'PASS'} (${checks.length - failed.length}/${checks.length})`)
if (failed.length) process.exit(1)

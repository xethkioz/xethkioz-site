import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8')
const checks = []
const check = (name, ok) => checks.push({ name, ok: Boolean(ok) })

const app = read('src/App.tsx')
const context = read('src/lib/ExperienceContext.tsx')
const audio = read('src/lib/proceduralMetal.ts')
const controls = read('src/components/ExperienceControls.tsx')
const css = read('src/experience.css')
const home = read('src/pages/Home.tsx')
const gateway = read('src/components/SciencePortalGateway.tsx')
const science = read('src/pages/ScienceLab.tsx')

check('global experience provider', app.includes('<ExperienceProvider>') && app.includes('<ExperienceControls />'))
check('graphics mode persists safely', context.includes("xethkioz.experience.graphics.v1") && context.includes('window.localStorage.setItem') && context.includes('catch'))
check('full and lite controls are explicit', controls.includes('ON · FULL') && controls.includes('OFF · LITE') && controls.includes("setGraphicsMode('lite')"))
check('lite mode stops music', context.includes("if (mode === 'lite')") && context.includes('setMusicOn(false)'))
check('music requires user action', controls.includes('onClick={() => void toggleMusic()}') && context.includes('const [musicOn, setMusicOn] = useState(false)'))
check('route soundtracks are defined', ['POWER METAL', 'NU METAL', 'GLAM METAL', 'BLACK / DEATH METAL'].every((label) => audio.includes(label)))
check('soundtrack is original and local', audio.includes('createOscillator') && audio.includes('createBuffer') && !audio.includes('fetch('))
check('lite avoids ambient video load', home.includes("useAmbientVideoEnabled(graphicsMode)") && home.includes("graphicsMode === 'lite'") && home.includes('{videoEnabled && ('))
check('lite disables costly decoration', css.includes('data-xk-graphics=lite') && css.includes('.xk-rb-bg-video') && css.includes('backdrop-filter:none'))
check('science portal offers both destinations', home.includes('<SciencePortalGateway') && gateway.includes('to="/science"') && gateway.includes('https://argenciencia.com/'))
check('science keeps permanent ArgenCiencia link', science.includes('xk-argenciencia-link') && science.includes('https://argenciencia.com/'))
check('external science link is isolated', gateway.includes('noopener noreferrer') && science.includes('noopener noreferrer'))

for (const item of checks) console.log(`${item.ok ? 'PASS' : 'FAIL'} ${item.name}`)
const failed = checks.filter((item) => !item.ok)
if (failed.length) {
  console.error(`\n${failed.length} experience mode check(s) failed.`)
  process.exit(1)
}
console.log(`\nExperience mode: ${checks.length}/${checks.length} checks passed.`)

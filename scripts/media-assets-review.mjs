import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const publicDir = path.join(root, 'public')
const walk = (dir, acc = []) => {
  if (!fs.existsSync(dir)) return acc
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item)
    const stat = fs.statSync(full)
    if (stat.isDirectory()) walk(full, acc)
    else acc.push(full)
  }
  return acc
}
const files = walk(publicDir)
const mediaExt = ['.svg','.webp','.png','.jpg','.jpeg','.gif','.mp4','.webm','.mp3','.wav','.ogg']
const media = files.filter((file) => mediaExt.includes(path.extname(file).toLowerCase()))
const grouped = media.reduce((acc, file) => {
  const ext = path.extname(file).toLowerCase().slice(1) || 'unknown'
  acc[ext] = (acc[ext] || 0) + 1
  return acc
}, {})
const audio = media.filter((file) => ['.mp3','.wav','.ogg'].includes(path.extname(file).toLowerCase()))
const video = media.filter((file) => ['.mp4','.webm'].includes(path.extname(file).toLowerCase()))
const image = media.filter((file) => ['.svg','.webp','.png','.jpg','.jpeg','.gif'].includes(path.extname(file).toLowerCase()))
const rel = (file) => path.relative(root, file).replaceAll('\\\\','/')

const report = [
  '# Fusion Alpha 1.5 Visual / Audio Objects Review',
  '',
  `Generated: ${new Date().toISOString()}`,
  '',
  '## Asset summary',
  `- Total media assets: ${media.length}`,
  `- Images/SVG: ${image.length}`,
  `- Videos: ${video.length}`,
  `- Audio files: ${audio.length}`,
  `- By extension: ${Object.entries(grouped).map(([k,v]) => `${k}=${v}`).join(', ') || 'none'}`,
  '',
  '## Video assets',
  ...(video.length ? video.map((file) => `- ${rel(file)}`) : ['- No video assets detected.']),
  '',
  '## Audio assets',
  ...(audio.length ? audio.map((file) => `- ${rel(file)}`) : ['- No real audio files detected yet. HUD audio is a persistent preview state only.']),
  '',
  '## Visual object notes',
  '- Videos must remain atmospheric layers with overlays and fallbacks, never flattened UI.',
  '- Current Green media belongs to the Media Engine. Fun/duende video still needs to be re-uploaded in this conversation before integration.',
  '- No audio playback engine is approved yet; audio ON/OFF remains a state contract for future soundscapes.',
  '',
].join('\n')
fs.mkdirSync(path.join(root, 'docs/ARCHITECTURE'), { recursive: true })
fs.writeFileSync(path.join(root, 'docs/ARCHITECTURE/FUSION_ALPHA_1_5_MEDIA_OBJECTS_REVIEW.md'), report)
console.log(report)

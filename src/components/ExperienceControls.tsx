import { useExperience } from '../lib/ExperienceContext'
import { useLang } from '../lib/LangContext'

const copy = {
  es: {
    title: 'Modo de experiencia',
    graphics: 'GRÁFICOS', full: 'ON · FULL', lite: 'OFF · LITE', music: 'MÚSICA', on: 'ON', off: 'OFF',
    liteHelp: 'Carga rápida para PC de bajos recursos, TV y datos móviles.', fullHelp: 'Experiencia completa con animaciones, luces y video.',
    recommendation: 'LITE RECOMENDADO EN ESTE DISPOSITIVO', original: 'Banda sonora instrumental original', liteAudio: 'La música se apaga en modo Lite.',
  },
  en: {
    title: 'Experience mode',
    graphics: 'GRAPHICS', full: 'ON · FULL', lite: 'OFF · LITE', music: 'MUSIC', on: 'ON', off: 'OFF',
    liteHelp: 'Fast mode for low-end PCs, TVs and mobile data.', fullHelp: 'Complete experience with animation, lighting and video.',
    recommendation: 'LITE RECOMMENDED ON THIS DEVICE', original: 'Original instrumental soundtrack', liteAudio: 'Music is disabled in Lite mode.',
  },
} as const

export default function ExperienceControls() {
  const { lang } = useLang()
  const { graphicsMode, musicOn, soundtrack, liteRecommended, audioError, setGraphicsMode, toggleMusic } = useExperience()
  const t = copy[lang]

  return (
    <div className="xk-experience" role="group" aria-label={t.title}>
      <button
        type="button"
        className="xk-header-experience-button is-music"
        aria-label={`${t.music}: ${musicOn ? t.on : t.off}. ${soundtrack}`}
        aria-pressed={musicOn}
        disabled={graphicsMode === 'lite'}
        title={graphicsMode === 'lite' ? t.liteAudio : `${t.original}: ${soundtrack}`}
        onClick={() => void toggleMusic()}
      >
        <span aria-hidden="true">{musicOn ? '♫' : '♪'}</span><b className="xk-experience-name">{t.music}</b><em>{musicOn ? t.on : t.off}</em>
      </button>
      <button
        type="button"
        className="xk-header-experience-button is-graphics"
        aria-label={`${t.graphics}: ${graphicsMode === 'full' ? t.full : t.lite}. ${graphicsMode === 'full' ? t.fullHelp : t.liteHelp}`}
        aria-pressed={graphicsMode === 'full'}
        title={liteRecommended && graphicsMode === 'full' ? t.recommendation : graphicsMode === 'full' ? t.fullHelp : t.liteHelp}
        onClick={() => setGraphicsMode(graphicsMode === 'full' ? 'lite' : 'full')}
      >
        <span aria-hidden="true">{graphicsMode === 'full' ? '◆' : '◇'}</span><b className="xk-experience-name">{t.graphics}</b><em>{graphicsMode === 'full' ? 'FULL' : 'LITE'}</em>
      </button>
      {audioError ? <span className="xk-experience-inline-error" role="alert" title={audioError}>!</span> : null}
    </div>
  )
}

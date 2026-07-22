import { useState } from 'react'
import { useExperience } from '../lib/ExperienceContext'
import { useLang } from '../lib/LangContext'

const copy = {
  es: {
    open: 'Abrir controles de rendimiento y música', close: 'Cerrar controles', title: 'MODO DE EXPERIENCIA',
    graphics: 'GRÁFICOS', full: 'ON · FULL', lite: 'OFF · LITE', music: 'MÚSICA', on: 'ON', off: 'OFF',
    liteHelp: 'Carga rápida para PC de bajos recursos, TV y datos móviles.', fullHelp: 'Experiencia completa con animaciones, luces y video.',
    recommendation: 'LITE RECOMENDADO EN ESTE DISPOSITIVO', original: 'Banda sonora instrumental original', liteAudio: 'La música se apaga en modo Lite.',
  },
  en: {
    open: 'Open performance and music controls', close: 'Close controls', title: 'EXPERIENCE MODE',
    graphics: 'GRAPHICS', full: 'ON · FULL', lite: 'OFF · LITE', music: 'MUSIC', on: 'ON', off: 'OFF',
    liteHelp: 'Fast mode for low-end PCs, TVs and mobile data.', fullHelp: 'Complete experience with animation, lighting and video.',
    recommendation: 'LITE RECOMMENDED ON THIS DEVICE', original: 'Original instrumental soundtrack', liteAudio: 'Music is disabled in Lite mode.',
  },
} as const

export default function ExperienceControls() {
  const { lang } = useLang()
  const { graphicsMode, musicOn, soundtrack, liteRecommended, audioError, setGraphicsMode, toggleMusic } = useExperience()
  const [open, setOpen] = useState(false)
  const t = copy[lang]

  return (
    <aside className={`xk-experience${open ? ' is-open' : ''}`} aria-label={t.title}>
      <button type="button" className="xk-experience-trigger" aria-expanded={open} aria-controls="xk-experience-panel" aria-label={open ? t.close : t.open} onClick={() => setOpen((current) => !current)}>
        <span aria-hidden="true">⚙</span><b>{graphicsMode === 'full' ? 'FULL' : 'LITE'}</b>
      </button>
      <div id="xk-experience-panel" className="xk-experience-panel" hidden={!open}>
        <div className="xk-experience-head"><div><small>XETHKIOZ // ACCESSIBILITY</small><strong>{t.title}</strong></div><button type="button" onClick={() => setOpen(false)} aria-label={t.close}>×</button></div>
        <section aria-labelledby="xk-graphics-title">
          <div className="xk-experience-label"><b id="xk-graphics-title">{t.graphics}</b>{liteRecommended ? <span>{t.recommendation}</span> : null}</div>
          <div className="xk-experience-switch" role="group" aria-label={t.graphics}>
            <button type="button" aria-pressed={graphicsMode === 'full'} onClick={() => setGraphicsMode('full')}>{t.full}</button>
            <button type="button" aria-pressed={graphicsMode === 'lite'} onClick={() => setGraphicsMode('lite')}>{t.lite}</button>
          </div>
          <p>{graphicsMode === 'lite' ? t.liteHelp : t.fullHelp}</p>
        </section>
        <section aria-labelledby="xk-music-title">
          <div className="xk-experience-label"><b id="xk-music-title">{t.music}</b><span>{soundtrack}</span></div>
          <button type="button" className="xk-music-toggle" aria-pressed={musicOn} disabled={graphicsMode === 'lite'} onClick={() => void toggleMusic()}>
            <span aria-hidden="true">{musicOn ? '♫' : '♪'}</span>{musicOn ? t.on : t.off}
          </button>
          <p>{graphicsMode === 'lite' ? t.liteAudio : t.original}</p>
          {audioError ? <p className="xk-experience-error" role="alert">{audioError}</p> : null}
        </section>
      </div>
    </aside>
  )
}

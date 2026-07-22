import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../lib/LangContext'

const copy = {
  es: {
    eyebrow: 'XK-02 // RED CIENTÍFICA', title: '¿Qué portal querés abrir?',
    description: 'Dos caminos conectados: el laboratorio de Ciencia y Tecnología de XETHKIOZ o ArgenCiencia, el portal de divulgación científica de la familia.',
    xkTitle: 'XETHKIOZ SCIENCE LAB', xkText: 'IA, hardware, ciencia, guías y tecnología explicada desde el universo XETHKIOZ.', xkAction: 'QUEDARME EN XETHKIOZ',
    argTitle: 'ARGENCIENCIA', argText: 'Abrir directamente el portal de divulgación científica de tu padre.', argAction: 'IR A ARGENCIENCIA',
    external: 'Se abre en una pestaña nueva', close: 'Cerrar selector de portales científicos',
  },
  en: {
    eyebrow: 'XK-02 // SCIENCE NETWORK', title: 'Which portal do you want to open?',
    description: 'Two connected paths: the XETHKIOZ Science & Technology Lab or ArgenCiencia, the family science outreach portal.',
    xkTitle: 'XETHKIOZ SCIENCE LAB', xkText: 'AI, hardware, science, guides and technology explained inside the XETHKIOZ universe.', xkAction: 'STAY IN XETHKIOZ',
    argTitle: 'ARGENCIENCIA', argText: 'Open your father’s science outreach portal directly.', argAction: 'GO TO ARGENCIENCIA',
    external: 'Opens in a new tab', close: 'Close science portal selector',
  },
} as const

export default function SciencePortalGateway({ onClose }: { onClose: () => void }) {
  const { lang } = useLang()
  const t = copy[lang]
  const closeRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { onClose(); return }
      if (event.key !== 'Tab' || !dialogRef.current) return
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]),a[href]'))
      const first = focusable[0]
      const last = focusable.at(-1)
      if (!first || !last) return
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose])

  return (
    <div className="xk-science-gateway" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="science-gateway-title" aria-describedby="science-gateway-description">
        <button ref={closeRef} type="button" className="xk-science-gateway-close" onClick={onClose} aria-label={t.close}>×</button>
        <p>{t.eyebrow}</p><h2 id="science-gateway-title">{t.title}</h2><span id="science-gateway-description">{t.description}</span>
        <div>
          <Link to="/science" onClick={onClose}><i aria-hidden="true">XK</i><small>PORTAL INTERNO</small><strong>{t.xkTitle}</strong><span>{t.xkText}</span><b>{t.xkAction} →</b></Link>
          <a href="https://argenciencia.com/" target="_blank" rel="noopener noreferrer"><i aria-hidden="true">AR</i><small>VÍNCULO DIRECTO</small><strong>{t.argTitle}</strong><span>{t.argText}</span><b>{t.argAction} ↗</b><em>{t.external}</em></a>
        </div>
      </section>
    </div>
  )
}

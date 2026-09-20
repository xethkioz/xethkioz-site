import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { PUBLIC_ATMOSPHERE_ART as artwork } from '../lib/publicArtwork'
import './PublicArtworkViewer.css'

type Lang = 'es' | 'en'
const labels = {
  es: {
    open: 'Ver ilustración completa', hint: 'Una ilustración · tres perspectivas',
    title: 'Una mirada completa.', close: 'Cerrar vista',
    notice: 'Ilustración promocional. No es gameplay, un mapa ni el aspecto definitivo del juego.',
    description: 'Arquitectura fantástica y luz violeta en una ilustración promocional de XETHKIOZ.',
    loading: 'Cargando ilustración…', failed: 'No se pudo cargar la ilustración. Podés cerrar esta vista e intentar de nuevo.',
    footer: 'La misma ilustración pública, sin recortes.',
  },
  en: {
    open: 'View full illustration', hint: 'One illustration · three perspectives',
    title: 'The complete picture.', close: 'Close view',
    notice: 'Promotional illustration. Not gameplay, a game map or the final appearance of the game.',
    description: 'Fantasy architecture and violet light in a promotional XETHKIOZ illustration.',
    loading: 'Loading illustration…', failed: 'The illustration could not be loaded. Close this view and try again.',
    footer: 'The same public illustration, uncropped.',
  },
} as const

function ArtworkDialog({ lang, onDismiss, invoker }: { lang: Lang; onDismiss: () => void; invoker: HTMLButtonElement | null }) {
  const id = useId()
  const dialog = useRef<HTMLDialogElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)
  const [imageState, setImageState] = useState<'loading' | 'ready' | 'failed'>('loading')
  const t = labels[lang]
  useEffect(() => {
    const modal = dialog.current
    if (!modal) return
    const returnTarget = invoker ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null)
    const root = document.documentElement
    const previousOverflow = root.style.overflow
    modal.showModal()
    root.style.overflow = 'hidden'
    closeButton.current?.focus({ preventScroll: true })
    return () => {
      modal.close()
      root.style.overflow = previousOverflow
      if (returnTarget?.isConnected) returnTarget.focus({ preventScroll: true })
    }
  }, [invoker])
  return createPortal(
    <dialog ref={dialog} className="wox-artwork-dialog" lang={lang}
      aria-labelledby={`${id}-title`} aria-describedby={`${id}-notice`}
      onKeyDown={event => {
        if (event.key !== 'Tab') return
        const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], [tabindex="0"]'))
          .filter(element => element.getClientRects().length > 0)
        const first = controls[0], last = controls[controls.length - 1]
        if (!first || !last) { event.preventDefault(); return }
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault(); last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault(); first.focus()
        }
      }}
      onCancel={event => { event.preventDefault(); onDismiss() }}
      onClick={event => {
        if (event.target !== event.currentTarget) return
        const box = event.currentTarget.getBoundingClientRect()
        if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) onDismiss()
      }}>
      <header className="wox-artwork-header">
        <div><span>XETHKIOZ / ART</span><h2 id={`${id}-title`}>{t.title}</h2></div>
        <button ref={closeButton} type="button" onClick={onDismiss}>{t.close}<span aria-hidden="true">×</span></button>
      </header>
      <p id={`${id}-notice`} className="wox-artwork-notice">{t.notice}</p>
      <figure className="wox-artwork-stage">
        {imageState !== 'failed' && <img src={artwork.src} alt={t.description}
          width={artwork.width} height={artwork.height} decoding="async"
          onLoad={() => setImageState('ready')} onError={() => setImageState('failed')} />}
        {imageState !== 'ready' && <p className="wox-artwork-status" role="status">
          {imageState === 'failed' ? t.failed : t.loading}
        </p>}
      </figure>
      <footer className="wox-artwork-footer"><p>{t.footer}</p><span>© XETHKIOZ</span></footer>
    </dialog>, document.body,
  )
}

export default function PublicArtworkViewer({ lang }: { lang: Lang }) {
  const [open, setOpen] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)
  const t = labels[lang]
  return (
    <div className="wox-artwork-toolbar">
      <span>{t.hint}</span>
      <button ref={trigger} type="button" aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)}>
        <span aria-hidden="true">⤢</span>{t.open}
      </button>
      {open && <ArtworkDialog lang={lang} invoker={trigger.current} onDismiss={() => setOpen(false)} />}
    </div>
  )
}

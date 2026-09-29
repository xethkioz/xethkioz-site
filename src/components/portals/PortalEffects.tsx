import { useEffect, useRef, useState, type CSSProperties } from 'react'

const preferenceKey = 'xethkioz.portal-effects'
type DataConnection = EventTarget & { readonly saveData?: boolean }
const connection = () => (navigator as Navigator & { connection?: DataConnection }).connection
const readPreference = () => {
  try { return localStorage.getItem(preferenceKey) !== 'off' } catch { return false }
}
const systemPausesEffects = () => matchMedia('(prefers-reduced-motion: reduce)').matches || Boolean(connection()?.saveData)

export function usePortalEffects() {
  // A system pause is temporary; only an explicit user action changes the saved choice.
  const [preferred, setPreferred] = useState(readPreference)
  const [systemPaused, setSystemPaused] = useState(systemPausesEffects)
  const enabled = preferred && !systemPaused
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)')
    const network = connection()
    const sync = () => setSystemPaused(media.matches || Boolean(network?.saveData))
    const storage = (event: StorageEvent) => {
      if (event.key === preferenceKey || event.key === null) setPreferred(readPreference())
    }
    media.addEventListener('change', sync)
    network?.addEventListener('change', sync)
    window.addEventListener('storage', storage)
    sync()
    return () => {
      media.removeEventListener('change', sync)
      network?.removeEventListener('change', sync)
      window.removeEventListener('storage', storage)
    }
  }, [])
  useEffect(() => {
    document.documentElement.dataset.portalEffects = enabled ? 'on' : 'off'
  }, [enabled])
  const toggle = () => {
    if (systemPaused) return
    const next = !preferred
    setPreferred(next)
    try { localStorage.setItem(preferenceKey, next ? 'on' : 'off') } catch { /* Optional presentation preference. */ }
  }
  return { enabled, systemPaused, toggle }
}

// Small compositor-only particles. No render loop, WebGL, canvas, audio or video.
export default function PortalEffects({ tone, count = 9 }: { tone: 'fire' | 'nature' | 'ice' | 'node'; count?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const element = ref.current
    if (!element) return
    let intersecting = false, activePage = true
    const sync = () => { element.dataset.running = String(intersecting && activePage && !document.hidden) }
    const hide = () => { activePage = false; sync() }
    const show = () => { activePage = true; sync() }
    // Unsupported observers fall back to static artwork rather than a running effect.
    const observer = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(([entry]) => {
      intersecting = entry.isIntersecting; sync()
    }, { rootMargin: '0px' })
    observer?.observe(element)
    document.addEventListener('visibilitychange', sync)
    window.addEventListener('pagehide', hide)
    window.addEventListener('pageshow', show)
    return () => {
      observer?.disconnect()
      document.removeEventListener('visibilitychange', sync)
      window.removeEventListener('pagehide', hide)
      window.removeEventListener('pageshow', show)
    }
  }, [])
  return <span ref={ref} className={`portal-fx portal-fx--${tone}`} aria-hidden="true" data-running="false">
    {Array.from({ length: Math.max(0, Math.min(count, 12)) }, (_, index) => <i key={index} style={{ '--x': `${9 + (index * 17) % 84}%`, '--delay': `${-(index * .83)}s`, '--duration': `${4 + index % 5}s`, '--drift': `${index % 2 ? 24 : -18}px` } as CSSProperties} />)}
  </span>
}

import { useEffect, useRef, useState, type CSSProperties } from 'react'

const preferenceKey = 'xethkioz.portal-effects'
export function usePortalEffects() {
  const [enabled, setEnabled] = useState(() => {
    try { return localStorage.getItem(preferenceKey) !== 'off' && !matchMedia('(prefers-reduced-motion: reduce)').matches } catch { return false }
  })
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => { if (media.matches) setEnabled(false) }
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])
  useEffect(() => {
    document.documentElement.dataset.portalEffects = enabled ? 'on' : 'off'
    try { localStorage.setItem(preferenceKey, enabled ? 'on' : 'off') } catch { /* Optional presentation preference. */ }
  }, [enabled])
  return { enabled, toggle: () => setEnabled(value => !value) }
}

// Small compositor-only particles. No render loop, WebGL, canvas, audio or video.
export default function PortalEffects({ tone, count = 9 }: { tone: 'fire' | 'nature' | 'ice' | 'node'; count?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const element = ref.current
    if (!element) return
    let intersecting = false
    const sync = () => { element.dataset.running = String(intersecting && !document.hidden) }
    const observer = new IntersectionObserver(([entry]) => { intersecting = entry.isIntersecting; sync() }, { rootMargin: '0px' })
    observer.observe(element)
    document.addEventListener('visibilitychange', sync)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', sync) }
  }, [])
  return <span ref={ref} className={`portal-fx portal-fx--${tone}`} aria-hidden="true" data-running="false">
    {Array.from({ length: Math.min(count, 12) }, (_, index) => <i key={index} style={{ '--x': `${9 + (index * 17) % 84}%`, '--delay': `${-(index * .83)}s`, '--duration': `${4 + index % 5}s`, '--drift': `${index % 2 ? 24 : -18}px` } as CSSProperties} />)}
  </span>
}

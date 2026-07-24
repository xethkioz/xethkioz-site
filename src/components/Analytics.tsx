import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { usePrivacyConsent } from '../lib/PrivacyConsentContext'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
    clarity?: (...args: unknown[]) => void
    fbq?: (...args: unknown[]) => void
  }
}

const GA4_ID = import.meta.env.VITE_GA4_ID as string | undefined
const CLARITY_ID = import.meta.env.VITE_CLARITY_ID as string | undefined
const PIXEL_ID = import.meta.env.VITE_FACEBOOK_PIXEL_ID as string | undefined
const TELEMETRY_ENDPOINT = '/api/visit-log'
const MAX_SEND_ATTEMPTS = 3

function createEventId() {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID()

  const bytes = crypto.getRandomValues(new Uint8Array(16))
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const value = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
  return `${value.slice(0, 8)}-${value.slice(8, 12)}-${value.slice(12, 16)}-${value.slice(16, 20)}-${value.slice(20)}`
}

function readEventId(storageKey: string) {
  try {
    const stored = window.sessionStorage.getItem(storageKey)
    if (stored?.startsWith('sent:') || stored?.startsWith('dropped:')) return { eventId: stored.slice(stored.indexOf(':') + 1), complete: true }
    if (stored?.startsWith('pending:')) return { eventId: stored.slice('pending:'.length), complete: false }
  } catch {
    // Telemetry continues without persistence when sessionStorage is unavailable.
  }
  return { eventId: createEventId(), complete: false }
}

function persistEventState(storageKey: string, state: 'pending' | 'sent' | 'dropped', eventId: string) {
  try {
    window.sessionStorage.setItem(storageKey, `${state}:${eventId}`)
  } catch {
    // Persistence is optional; idempotency still applies within the active effect.
  }
}

export default function Analytics() {
  const location = useLocation()
  const { preferences } = usePrivacyConsent()

  useEffect(() => {
    const pagePath = location.pathname + location.search

    if (preferences.analytics && GA4_ID && window.gtag) window.gtag('config', GA4_ID, { page_path: pagePath })
    if (preferences.marketing && PIXEL_ID && window.fbq) window.fbq('track', 'PageView')
    if (!preferences.analytics) return

    const storageKey = `xethkioz.telemetry.${pagePath}`
    const storedEvent = readEventId(storageKey)
    if (storedEvent.complete) return

    const width = window.innerWidth
    const eventId = storedEvent.eventId
    const payload = {
      eventId,
      route: pagePath.slice(0, 240),
      deviceType: width < 640 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop',
      viewportWidth: width,
      viewportHeight: window.innerHeight,
      language: navigator.language.slice(0, 24),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone.slice(0, 80),
      referrerHost: (() => { try { return document.referrer ? new URL(document.referrer).hostname.slice(0, 180) : null } catch { return null } })(),
    }

    let disposed = false
    let attempts = 0
    let retryTimer: number | undefined
    persistEventState(storageKey, 'pending', eventId)

    const scheduleRetry = (delay: number) => {
      if (disposed || attempts >= MAX_SEND_ATTEMPTS) return
      window.clearTimeout(retryTimer)
      retryTimer = window.setTimeout(() => { void send() }, delay)
    }

    const send = async () => {
      if (disposed || !navigator.onLine) return
      attempts += 1

      try {
        const response = await fetch(TELEMETRY_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          cache: 'no-store',
          credentials: 'same-origin',
          keepalive: true,
        })

        if (response.ok) {
          persistEventState(storageKey, 'sent', eventId)
          return
        }

        if (response.status >= 400 && response.status < 500 && response.status !== 429) {
          persistEventState(storageKey, 'dropped', eventId)
          return
        }

        const retryAfter = Number(response.headers.get('Retry-After') || 0)
        scheduleRetry(retryAfter > 0 ? Math.min(retryAfter * 1000, 60_000) : attempts === 1 ? 1_500 : 5_000)
      } catch {
        scheduleRetry(attempts === 1 ? 1_500 : 5_000)
      }
    }

    const retryWhenOnline = () => {
      attempts = 0
      void send()
    }

    window.addEventListener('online', retryWhenOnline)
    void send()

    return () => {
      disposed = true
      window.clearTimeout(retryTimer)
      window.removeEventListener('online', retryWhenOnline)
    }
  }, [location.pathname, location.search, preferences.analytics, preferences.marketing])

  return (
    <Helmet>
      {preferences.analytics && GA4_ID && (
        <>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`} />
          <script>
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA4_ID}');`}
          </script>
        </>
      )}

      {preferences.analytics && CLARITY_ID && (
        <script>
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_ID}");`}
        </script>
      )}

      {preferences.marketing && PIXEL_ID && (
        <script>
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)n=f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=l.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL_ID}');fbq('track','PageView');`}
        </script>
      )}
    </Helmet>
  )
}

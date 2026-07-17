import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

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
const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.replace(/\/+$/, '')
const SUPABASE_PUBLIC_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export default function Analytics() {
  const location = useLocation()

  useEffect(() => {
    const pagePath = location.pathname + location.search
    if (GA4_ID && window.gtag) window.gtag('config', GA4_ID, { page_path: pagePath })
    if (PIXEL_ID && window.fbq) window.fbq('track', 'PageView')

    const telemetryKey = `xethkioz.telemetry.${pagePath}`
    try {
      if (window.sessionStorage.getItem(telemetryKey)) return
      window.sessionStorage.setItem(telemetryKey, 'queued')
    } catch {
      // The collector still works when private browsing disables sessionStorage.
    }
    const width = window.innerWidth
    const deviceType = width < 640 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop'
    const payload = {
      route: pagePath.slice(0, 240),
      deviceType,
      viewportWidth: width,
      viewportHeight: window.innerHeight,
      language: navigator.language.slice(0, 24),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone.slice(0, 80),
      referrerHost: (() => { try { return document.referrer ? new URL(document.referrer).hostname.slice(0, 180) : null } catch { return null } })(),
    }
    const endpoint = SUPABASE_URL ? `${SUPABASE_URL}/functions/v1/visit-log` : '/api/visit-log'
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (SUPABASE_PUBLIC_KEY) headers.apikey = SUPABASE_PUBLIC_KEY
    const retryLater = () => { try { window.sessionStorage.removeItem(telemetryKey) } catch { /* Optional storage. */ } }
    void fetch(endpoint, { method: 'POST', headers, body: JSON.stringify(payload), keepalive: true })
      .then((response) => { if (!response.ok) retryLater() })
      .catch(retryLater)
  }, [location])

  return (
    <Helmet>
      {GA4_ID && (
        <>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`} />
          <script>
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA4_ID}');`}
          </script>
        </>
      )}

      {CLARITY_ID && (
        <script>
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_ID}");`}
        </script>
      )}

      {PIXEL_ID && (
        <script>
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL_ID}');fbq('track','PageView');`}
        </script>
      )}
    </Helmet>
  )
}

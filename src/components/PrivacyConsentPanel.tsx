import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../lib/LangContext'
import { usePrivacyConsent, type PrivacyPreferences } from '../lib/PrivacyConsentContext'

const copy = {
  es: {
    eyebrow: 'PRIVACIDAD // CONTROL LOCAL',
    bannerTitle: 'Vos decidís qué medición se activa.',
    bannerText: 'La web usa funciones esenciales para idioma, sesión y seguridad. La analítica y el marketing permanecen apagados hasta que los autorices.',
    essentialOnly: 'SOLO ESENCIALES',
    configure: 'CONFIGURAR',
    acceptAll: 'ACEPTAR TODO',
    dialogTitle: 'Preferencias de privacidad',
    dialogText: 'Podés cambiar esta decisión en cualquier momento desde el Footer. Desactivar una categoría recarga la página para detener sus herramientas activas.',
    essentialTitle: 'Esenciales',
    essentialText: 'Necesarias para idioma, autenticación, seguridad, navegación y preferencias locales. Siempre activas.',
    analyticsTitle: 'Analítica',
    analyticsText: 'Habilita Vercel Analytics, medición propia de visitas y, si están configurados, Google Analytics y Microsoft Clarity.',
    marketingTitle: 'Marketing',
    marketingText: 'Habilita Meta Pixel y futuras mediciones publicitarias. Los sponsors internos pueden mostrarse sin rastreo personalizado.',
    alwaysActive: 'SIEMPRE ACTIVO',
    save: 'GUARDAR PREFERENCIAS',
    close: 'Cerrar preferencias',
    policy: 'Leer política de privacidad',
  },
  en: {
    eyebrow: 'PRIVACY // LOCAL CONTROL',
    bannerTitle: 'You decide which measurement tools are enabled.',
    bannerText: 'The website uses essential functions for language, session and security. Analytics and marketing remain off until you authorize them.',
    essentialOnly: 'ESSENTIAL ONLY',
    configure: 'CONFIGURE',
    acceptAll: 'ACCEPT ALL',
    dialogTitle: 'Privacy preferences',
    dialogText: 'You can change this decision at any time from the Footer. Disabling a category reloads the page to stop its active tools.',
    essentialTitle: 'Essential',
    essentialText: 'Required for language, authentication, security, navigation and local preferences. Always enabled.',
    analyticsTitle: 'Analytics',
    analyticsText: 'Enables Vercel Analytics, first-party visit measurement and, when configured, Google Analytics and Microsoft Clarity.',
    marketingTitle: 'Marketing',
    marketingText: 'Enables Meta Pixel and future advertising measurement. Internal sponsor placements may appear without personalized tracking.',
    alwaysActive: 'ALWAYS ACTIVE',
    save: 'SAVE PREFERENCES',
    close: 'Close preferences',
    policy: 'Read privacy policy',
  },
} as const

export default function PrivacyConsentPanel() {
  const { lang } = useLang()
  const t = copy[lang]
  const {
    preferences,
    hasChoice,
    panelOpen,
    openSettings,
    closeSettings,
    acceptAll,
    essentialOnly,
    savePreferences,
  } = usePrivacyConsent()
  const [draft, setDraft] = useState<PrivacyPreferences>(preferences)
  const firstControlRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!panelOpen) return
    setDraft(preferences)
    const frame = window.requestAnimationFrame(() => firstControlRef.current?.focus())
    return () => window.cancelAnimationFrame(frame)
  }, [panelOpen, preferences])

  useEffect(() => {
    if (!panelOpen) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && hasChoice) closeSettings()
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [closeSettings, hasChoice, panelOpen])

  return (
    <>
      {!hasChoice && !panelOpen ? (
        <section
          className="fixed inset-x-3 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-[120] mx-auto max-w-5xl rounded-[1.6rem] border border-violet-400/35 bg-[#08080d]/95 p-4 text-white shadow-[0_18px_80px_rgba(0,0,0,.72),0_0_38px_rgba(139,92,246,.18)] backdrop-blur-xl sm:p-5"
          role="region"
          aria-labelledby="privacy-consent-banner-title"
        >
          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="font-mono text-[10px] font-black uppercase tracking-[.22em] text-orange-300">{t.eyebrow}</p>
              <h2 id="privacy-consent-banner-title" className="mt-2 text-lg font-black sm:text-xl">{t.bannerTitle}</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">{t.bannerText}</p>
            </div>
            <div className="grid gap-2 sm:grid-cols-3 lg:min-w-[430px]">
              <button type="button" onClick={essentialOnly} className="rounded-full border border-white/15 px-4 py-3 font-mono text-[10px] font-black tracking-[.12em] text-slate-200 transition hover:border-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300">{t.essentialOnly}</button>
              <button type="button" onClick={openSettings} className="rounded-full border border-violet-400/45 bg-violet-400/10 px-4 py-3 font-mono text-[10px] font-black tracking-[.12em] text-violet-200 transition hover:border-violet-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300">{t.configure}</button>
              <button type="button" onClick={acceptAll} className="rounded-full border border-orange-400 bg-orange-400/15 px-4 py-3 font-mono text-[10px] font-black tracking-[.12em] text-orange-100 transition hover:bg-orange-400 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300">{t.acceptAll}</button>
            </div>
          </div>
        </section>
      ) : null}

      {panelOpen ? (
        <div className="fixed inset-0 z-[130] grid place-items-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm" role="presentation">
          <section
            className="relative my-auto w-full max-w-3xl rounded-[2rem] border border-violet-400/40 bg-[#09090f] p-5 text-white shadow-[0_28px_100px_rgba(0,0,0,.85),0_0_50px_rgba(139,92,246,.18)] sm:p-7"
            role="dialog"
            aria-modal="true"
            aria-labelledby="privacy-preferences-title"
            aria-describedby="privacy-preferences-description"
          >
            {hasChoice ? (
              <button type="button" onClick={closeSettings} aria-label={t.close} className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/10 text-lg text-slate-300 transition hover:border-white/35 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300">×</button>
            ) : null}

            <p className="font-mono text-[10px] font-black uppercase tracking-[.22em] text-orange-300">{t.eyebrow}</p>
            <h2 id="privacy-preferences-title" className="mt-3 pr-12 text-2xl font-black sm:text-3xl">{t.dialogTitle}</h2>
            <p id="privacy-preferences-description" className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">{t.dialogText}</p>

            <div className="mt-6 grid gap-3">
              <article className="rounded-2xl border border-emerald-400/25 bg-emerald-400/[.06] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div><h3 className="font-black">{t.essentialTitle}</h3><p className="mt-1 text-sm leading-6 text-slate-300">{t.essentialText}</p></div>
                  <span className="shrink-0 rounded-full border border-emerald-400/35 px-3 py-2 font-mono text-[9px] font-black tracking-[.12em] text-emerald-300">{t.alwaysActive}</span>
                </div>
              </article>

              <label className="flex cursor-pointer items-start justify-between gap-4 rounded-2xl border border-cyan-400/25 bg-cyan-400/[.05] p-4 transition hover:border-cyan-300/50">
                <span><strong className="block">{t.analyticsTitle}</strong><span className="mt-1 block text-sm leading-6 text-slate-300">{t.analyticsText}</span></span>
                <input ref={firstControlRef} type="checkbox" checked={draft.analytics} onChange={(event) => setDraft((current) => ({ ...current, analytics: event.target.checked }))} className="mt-1 h-5 w-5 shrink-0 accent-cyan-400" />
              </label>

              <label className="flex cursor-pointer items-start justify-between gap-4 rounded-2xl border border-orange-400/25 bg-orange-400/[.05] p-4 transition hover:border-orange-300/50">
                <span><strong className="block">{t.marketingTitle}</strong><span className="mt-1 block text-sm leading-6 text-slate-300">{t.marketingText}</span></span>
                <input type="checkbox" checked={draft.marketing} onChange={(event) => setDraft((current) => ({ ...current, marketing: event.target.checked }))} className="mt-1 h-5 w-5 shrink-0 accent-orange-400" />
              </label>
            </div>

            <div className="mt-6 grid gap-2 sm:grid-cols-[1fr_auto_auto] sm:items-center">
              <Link to="/privacy" onClick={closeSettings} className="text-sm font-bold text-violet-300 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300">{t.policy}</Link>
              <button type="button" onClick={essentialOnly} className="rounded-full border border-white/15 px-4 py-3 font-mono text-[10px] font-black tracking-[.12em] text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300">{t.essentialOnly}</button>
              <button type="button" onClick={() => savePreferences(draft)} className="rounded-full border border-orange-400 bg-orange-400/15 px-5 py-3 font-mono text-[10px] font-black tracking-[.12em] text-orange-100 transition hover:bg-orange-400 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300">{t.save}</button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  )
}

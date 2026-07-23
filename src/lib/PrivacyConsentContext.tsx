import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type PrivacyPreferences = {
  analytics: boolean
  marketing: boolean
}

type StoredPrivacyPreferences = PrivacyPreferences & {
  version: 1
  updatedAt: string
}

type PrivacyConsentContextValue = {
  preferences: PrivacyPreferences
  hasChoice: boolean
  panelOpen: boolean
  openSettings: () => void
  closeSettings: () => void
  acceptAll: () => void
  essentialOnly: () => void
  savePreferences: (preferences: PrivacyPreferences) => void
}

const STORAGE_KEY = 'xethkioz.privacy-consent.v1'
const DEFAULT_PREFERENCES: PrivacyPreferences = { analytics: false, marketing: false }
const PrivacyConsentContext = createContext<PrivacyConsentContextValue | null>(null)

function readStoredPreferences(): StoredPrivacyPreferences | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<StoredPrivacyPreferences>
    if (parsed.version !== 1 || typeof parsed.analytics !== 'boolean' || typeof parsed.marketing !== 'boolean') return null
    return {
      version: 1,
      analytics: parsed.analytics,
      marketing: parsed.marketing,
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : new Date(0).toISOString(),
    }
  } catch {
    return null
  }
}

export function PrivacyConsentProvider({ children }: { children: ReactNode }) {
  const initial = useMemo(readStoredPreferences, [])
  const [preferences, setPreferences] = useState<PrivacyPreferences>(() => initial ?? DEFAULT_PREFERENCES)
  const [hasChoice, setHasChoice] = useState(Boolean(initial))
  const [panelOpen, setPanelOpen] = useState(false)

  useEffect(() => {
    const open = () => setPanelOpen(true)
    window.addEventListener('xethkioz:privacy-open', open)
    return () => window.removeEventListener('xethkioz:privacy-open', open)
  }, [])

  const persist = (next: PrivacyPreferences) => {
    const previousHadTracking = preferences.analytics || preferences.marketing
    const revokesTracking = previousHadTracking && (!next.analytics || !next.marketing)
    const stored: StoredPrivacyPreferences = {
      version: 1,
      analytics: Boolean(next.analytics),
      marketing: Boolean(next.marketing),
      updatedAt: new Date().toISOString(),
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
    } catch {
      // The preference remains active for the current session when storage is unavailable.
    }

    setPreferences({ analytics: stored.analytics, marketing: stored.marketing })
    setHasChoice(true)
    setPanelOpen(false)

    if (revokesTracking) window.setTimeout(() => window.location.reload(), 0)
  }

  const value: PrivacyConsentContextValue = {
    preferences,
    hasChoice,
    panelOpen,
    openSettings: () => setPanelOpen(true),
    closeSettings: () => setPanelOpen(false),
    acceptAll: () => persist({ analytics: true, marketing: true }),
    essentialOnly: () => persist(DEFAULT_PREFERENCES),
    savePreferences: persist,
  }

  return <PrivacyConsentContext.Provider value={value}>{children}</PrivacyConsentContext.Provider>
}

export function usePrivacyConsent() {
  const context = useContext(PrivacyConsentContext)
  if (!context) throw new Error('usePrivacyConsent must be used within PrivacyConsentProvider')
  return context
}

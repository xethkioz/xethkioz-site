import { Analytics as VercelAnalytics } from '@vercel/analytics/react'
import { usePrivacyConsent } from '../lib/PrivacyConsentContext'
import Analytics from './Analytics'

export default function ConsentAwareAnalytics() {
  const { preferences } = usePrivacyConsent()

  return (
    <>
      <Analytics />
      {preferences.analytics ? <VercelAnalytics /> : null}
    </>
  )
}

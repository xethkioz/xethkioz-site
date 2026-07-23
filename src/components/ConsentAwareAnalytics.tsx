import { Analytics as VercelAnalytics } from '@vercel/analytics/react'
import { useLocation } from 'react-router-dom'
import { usePrivacyConsent } from '../lib/PrivacyConsentContext'
import Analytics from './Analytics'

function isPrivateRoute(pathname: string) {
  return pathname === '/account'
    || pathname === '/login'
    || pathname === '/confirm-email'
    || pathname === '/profile'
    || pathname === '/nexus-city/vip'
    || pathname === '/cms'
    || pathname.startsWith('/cms/')
}

export default function ConsentAwareAnalytics() {
  const { preferences } = usePrivacyConsent()
  const location = useLocation()

  if (isPrivateRoute(location.pathname)) return null

  return (
    <>
      <Analytics />
      {preferences.analytics ? <VercelAnalytics /> : null}
    </>
  )
}

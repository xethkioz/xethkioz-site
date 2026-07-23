import fs from 'node:fs'

const issues = []
const read = (path) => fs.readFileSync(path, 'utf8')
const assert = (condition, message) => { if (!condition) issues.push(message) }

const context = read('src/lib/PrivacyConsentContext.tsx')
const panel = read('src/components/PrivacyConsentPanel.tsx')
const analytics = read('src/components/Analytics.tsx')
const consentAnalytics = read('src/components/ConsentAwareAnalytics.tsx')
const app = read('src/App.tsx')
const footer = read('src/components/Footer.tsx')
const privacy = read('src/pages/Privacy.tsx')
const normalizedPrivacy = privacy.toLocaleLowerCase('es')

assert(context.includes("const DEFAULT_PREFERENCES: PrivacyPreferences = { analytics: false, marketing: false }"), 'Optional tracking must be disabled by default.')
assert(context.includes('xethkioz.privacy-consent.v1'), 'Consent must use an explicit versioned storage key.')
assert(context.includes('revokesTracking') && context.includes('window.location.reload()'), 'Revoking an active category must stop already-running trackers deterministically.')
assert(context.includes("window.addEventListener('xethkioz:privacy-open'"), 'Privacy preferences must be reopenable from anywhere in the public UI.')

assert(panel.includes('essentialOnly') && panel.includes('acceptAll') && panel.includes('savePreferences'), 'The consent UI must offer reject, accept and granular save controls.')
assert(panel.includes('role="dialog"') && panel.includes('aria-modal="true"'), 'The preference panel must expose dialog semantics.')
assert(panel.includes('Analítica') && panel.includes('Marketing') && panel.includes('Analytics'), 'Consent categories must be understandable in both languages.')

assert(analytics.includes('if (!preferences.analytics) return'), 'First-party visit telemetry must not run without analytics consent.')
assert(analytics.includes('preferences.analytics && GA4_ID'), 'Google Analytics must require analytics consent.')
assert(analytics.includes('preferences.analytics && CLARITY_ID'), 'Microsoft Clarity must require analytics consent.')
assert(analytics.includes('preferences.marketing && PIXEL_ID'), 'Meta Pixel must require marketing consent.')
assert(consentAnalytics.includes('preferences.analytics ? <VercelAnalytics /> : null'), 'Vercel Analytics must require analytics consent.')
assert(consentAnalytics.includes("pathname.startsWith('/cms/')") && consentAnalytics.includes("pathname === '/nexus-city/vip'"), 'Private routes must remain outside analytics collection.')

assert(app.includes('<PrivacyConsentProvider>') && app.includes('<ConsentAwareAnalytics />') && app.includes('<PrivacyConsentPanel />'), 'The consent system must wrap and control the application shell.')
assert(!app.includes('Analytics as VercelAnalytics'), 'The application shell must not bypass the consent-aware analytics bridge.')
assert(footer.includes('openSettings') && footer.includes('privacySettings'), 'The Footer must provide a permanent privacy preference control.')
assert(normalizedPrivacy.includes('analítica y el marketing están desactivados por defecto') && normalizedPrivacy.includes('analytics and marketing are disabled by default'), 'The privacy policy must document the real default behavior in both languages.')
assert(privacy.includes('openSettings'), 'The privacy page must let visitors change consent directly.')

if (issues.length) {
  issues.forEach((issue) => console.error(`FAIL ${issue}`))
  console.error(`Privacy consent audit failed: ${issues.length} issue(s).`)
  process.exit(1)
}

console.log('PASS privacy consent: optional tracking defaults off, private routes excluded, granular controls and revocation available.')

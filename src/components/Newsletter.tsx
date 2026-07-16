import { useState } from 'react'
import { useLang } from '../lib/LangContext'
import { supabase } from '../lib/supabase'
export default function Newsletter() {
  const { t, lang } = useLang()
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [accepted, setAccepted] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!email || !accepted || website) return; setStatus('loading')
    try {
      const normalizedEmail = email.trim().toLowerCase().slice(0, 254)
      const { error } = await supabase.from('newsletter_subscribers').insert({ email: normalizedEmail })
      if (error) { if (error.code === '23505') setStatus('success'); else setStatus('error') }
      else { setStatus('success'); setEmail('') }
    } catch { setStatus('error') }
    setTimeout(() => setStatus('idle'), 5000)
  }
  return (
    <div className="xk-newsletter-form glass border border-orange/20 rounded-2xl p-6 md:p-8 text-center">
      <div className="text-3xl mb-3">📬</div>
      <h3 className="font-display text-xl font-bold gradient-text mb-2">{t.sections.newsletter}</h3>
      <p className="text-sm text-gray-400 mb-5 max-w-md mx-auto">{t.sections.newsletterDesc}</p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <label className="xk-newsletter-trap" aria-hidden="true">Sitio web<input type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} /></label>
        <input type="email" required maxLength={254} value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t.sections.newsletterPlaceholder} aria-label={t.sections.newsletterPlaceholder} className="input-field flex-1" disabled={status === 'loading'} />
        <button type="submit" disabled={status === 'loading' || !accepted} className="btn-primary whitespace-nowrap disabled:opacity-50">{status === 'loading' ? '...' : t.sections.newsletterBtn}</button>
        <label className="xk-newsletter-consent"><input type="checkbox" required checked={accepted} onChange={(event) => setAccepted(event.target.checked)} /><span>{lang === 'es' ? 'Acepto recibir el resumen semanal. Podré darme de baja cuando quiera.' : 'I agree to receive the weekly brief. I can unsubscribe at any time.'}</span></label>
      </form>
      {status === 'success' && <p className="text-green-400 text-sm mt-3 animate-fade-in">{t.sections.newsletterSuccess}</p>}
      {status === 'error' && <p className="text-red-400 text-sm mt-3 animate-fade-in">{t.sections.newsletterError}</p>}
    </div>
  )
}

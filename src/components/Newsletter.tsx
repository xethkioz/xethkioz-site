import { useState } from 'react'
import { useLang } from '../lib/LangContext'
import { supabase } from '../lib/supabase'
export default function Newsletter() {
  const { t } = useLang()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!email) return; setStatus('loading')
    try {
      const { error } = await supabase.from('newsletter_subscribers').insert({ email })
      if (error) { if (error.code === '23505') setStatus('success'); else setStatus('error') }
      else { setStatus('success'); setEmail('') }
    } catch { setStatus('error') }
    setTimeout(() => setStatus('idle'), 5000)
  }
  return (
    <div className="glass border border-orange/20 rounded-2xl p-6 md:p-8 text-center">
      <div className="text-3xl mb-3">📬</div>
      <h3 className="font-display text-xl font-bold gradient-text mb-2">{t.sections.newsletter}</h3>
      <p className="text-sm text-gray-400 mb-5 max-w-md mx-auto">{t.sections.newsletterDesc}</p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t.sections.newsletterPlaceholder} className="input-field flex-1" disabled={status === 'loading'} />
        <button type="submit" disabled={status === 'loading'} className="btn-primary whitespace-nowrap disabled:opacity-50">{status === 'loading' ? '...' : t.sections.newsletterBtn}</button>
      </form>
      {status === 'success' && <p className="text-green-400 text-sm mt-3 animate-fade-in">{t.sections.newsletterSuccess}</p>}
      {status === 'error' && <p className="text-red-400 text-sm mt-3 animate-fade-in">{t.sections.newsletterError}</p>}
    </div>
  )
}

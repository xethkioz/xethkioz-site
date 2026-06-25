import { useState } from 'react'
import { useLang } from '../lib/LangContext'
import SEO from '../components/SEO'
export default function Contact() {
  const { t } = useLang()
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSent(true); setForm({ name: '', email: '', message: '' }); setTimeout(() => setSent(false), 5000) }
  return (
    <div className="animate-fade-in max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <SEO title={t.contact.title} description={t.contact.desc} />
      <div className="text-center mb-10"><div className="text-5xl mb-3">📧</div><h1 className="font-display text-3xl md:text-5xl font-bold gradient-text mb-3">{t.contact.title}</h1><p className="text-gray-400">{t.contact.desc}</p></div>
      <form onSubmit={handleSubmit} className="glass border border-white/10 rounded-2xl p-8 space-y-5">
        <div><label className="block text-sm font-medium text-gray-300 mb-2">{t.contact.name}</label><input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" /></div>
        <div><label className="block text-sm font-medium text-gray-300 mb-2">{t.contact.email}</label><input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" /></div>
        <div><label className="block text-sm font-medium text-gray-300 mb-2">{t.contact.message}</label><textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input-field resize-none" /></div>
        <button type="submit" className="btn-primary w-full">{t.contact.send}</button>
        {sent && <p className="text-center text-green-400 text-sm animate-fade-in">{t.contact.sent}</p>}
      </form>
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4">{[{ platform: 'Threads', url: 'https://threads.net/@xethkioz' }, { platform: 'Instagram', url: 'https://instagram.com/xethkioz' }, { platform: 'YouTube', url: 'https://youtube.com/@xethkioz' }].map((s) => <a key={s.platform} href={s.url} target="_blank" rel="noopener noreferrer" className="glass border border-white/10 rounded-xl p-4 text-center text-sm text-gray-300 hover:text-orange hover:border-orange transition-all">{s.platform}</a>)}</div>
    </div>
  )
}

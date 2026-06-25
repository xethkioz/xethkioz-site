
import { finalQaChecklist, officialLinkTargets } from '../lib/contentOps'

const statusClass: Record<string, string> = {
  ready: 'border-green-400/25 bg-green-400/10 text-green-300',
  review: 'border-orange/25 bg-orange/10 text-orange',
  partial: 'border-yellow-300/25 bg-yellow-300/10 text-yellow-200',
}

export default function NetworkFinalQaPanel() {
  return (
    <section className="grid grid-cols-1 gap-5 lg:grid-cols-[1.05fr_.95fr]">
      <div className="rounded-3xl border border-white/10 bg-ink-300/80 p-5 md:p-7">
        <p className="section-eyebrow">Final QA</p>
        <h2 className="font-display text-2xl font-black text-white">Checklist antes de LIVE</h2>
        <div className="mt-5 space-y-3">
          {finalQaChecklist.map((item) => (
            <div key={item.area} className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <strong className="font-display text-white">{item.area}</strong>
                <span className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${statusClass[item.status] || statusClass.review}`}>{item.status}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">{item.check}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-ink-300/80 p-5 md:p-7">
        <p className="section-eyebrow">Links</p>
        <h2 className="font-display text-2xl font-black text-white">Objetivos funcionales</h2>
        <div className="mt-5 space-y-3">
          {officialLinkTargets.map((link) => (
            <a
              key={`${link.label}-${link.url}`}
              href={link.url}
              target={link.url.startsWith('http') ? '_blank' : undefined}
              rel={link.url.startsWith('http') ? 'noreferrer' : undefined}
              className="block rounded-2xl border border-white/10 bg-black/25 p-4 transition hover:border-orange/35 hover:bg-white/[0.04]"
            >
              <span className="text-xs font-black uppercase tracking-[0.18em] text-gray-500">{link.type}</span>
              <strong className="mt-1 block text-white">{link.label}</strong>
              <span className="mt-1 block break-all text-xs text-gray-400">{link.url}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

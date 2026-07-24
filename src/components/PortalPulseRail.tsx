import { Link } from 'react-router-dom'
import { addWispXp } from '../lib/realtimeCommunity'
import { useLang } from '../lib/LangContext'

export type PortalPulseTone = 'violet' | 'cyan' | 'orange' | 'green' | 'gold'

export type PortalPulseItem = {
  code: string
  title: string
  detail: string
  to: string
  action: string
}

type PortalPulseRailProps = {
  tone: PortalPulseTone
  eyebrow: string
  title: string
  description: string
  items: readonly PortalPulseItem[]
}

function recordPulseAction(code: string, to: string) {
  const day = new Date().toISOString().slice(0, 10)
  const key = `xethkioz.pulse.${day}.${code}`
  try {
    if (window.localStorage.getItem(key)) return
    window.localStorage.setItem(key, 'recorded')
    addWispXp(2, 'mission', to)
  } catch {
    // The action remains navigable when local storage is unavailable.
  }
}

export function PortalPulseRail({ tone, eyebrow, title, description, items }: PortalPulseRailProps) {
  const { localizePath } = useLang()

  return (
    <section className={`xk-portal-pulse is-${tone}`} aria-labelledby={`portal-pulse-${tone}`}>
      <div className="xk-portal-pulse-copy">
        <p>{eyebrow}</p>
        <h2 id={`portal-pulse-${tone}`}>{title}</h2>
        <span>{description}</span>
      </div>
      <div className="xk-portal-pulse-actions">
        {items.map((item) => {
          const external = /^https?:\/\//i.test(item.to)
          const destination = external ? item.to : localizePath(item.to)
          const content = <>
            <i>{item.code}</i>
            <span><strong>{item.title}</strong><small>{item.detail}</small></span>
            <b>{item.action} →</b>
          </>
          return external ? (
            <a key={item.code} href={destination} target="_blank" rel="noopener noreferrer" onClick={() => recordPulseAction(item.code, destination)}>{content}</a>
          ) : (
            <Link key={item.code} to={destination} onClick={() => recordPulseAction(item.code, destination)}>{content}</Link>
          )
        })}
      </div>
    </section>
  )
}

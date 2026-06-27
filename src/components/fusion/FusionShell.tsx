import { Link } from 'react-router-dom'
import { type ReactNode } from 'react'
import { type FusionTone, fusionToneClass } from '../../lib/designSystem'

interface FusionShellProps {
  tone: FusionTone
  backLabel: string
  label: string
  children: ReactNode
}

export default function FusionShell({ tone, backLabel, label, children }: FusionShellProps) {
  return (
    <div className={`fusion-page ${fusionToneClass[tone]} min-h-screen text-white`}>
      <header className="fusion-page-header sticky top-0 z-40 border-b bg-black/78 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="fusion-back-link font-display text-sm font-black uppercase tracking-[0.22em] transition hover:text-white">
            {backLabel}
          </Link>
          <span className="fusion-page-pill rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em]">
            {label}
          </span>
        </div>
      </header>
      {children}
    </div>
  )
}

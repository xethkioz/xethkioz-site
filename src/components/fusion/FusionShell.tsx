import { type ReactNode } from 'react'
import { type FusionTone, fusionToneClass } from '../../lib/designSystem'

interface FusionShellProps {
  tone: FusionTone
  children: ReactNode
}

export default function FusionShell({ tone, children }: FusionShellProps) {
  return (
    <div className={`fusion-page ${fusionToneClass[tone]} min-h-screen text-white`}>
      {children}
    </div>
  )
}

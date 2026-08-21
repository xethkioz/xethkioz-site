import { lazy, Suspense } from 'react'

const NexusCity = lazy(() => import('./NexusCity'))

export default function FunPortal() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A0A0F]" />}>
      <NexusCity />
    </Suspense>
  )
}

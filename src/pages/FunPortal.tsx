import { lazy, Suspense, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const NexusCity = lazy(() => import('./NexusCity'))
const MASCOTAS_URL = 'https://www.xethkioz.com.ar/mascotas/'

function MascotasRedirect() {
  useEffect(() => {
    window.location.replace(MASCOTAS_URL)
  }, [])

  return (
    <main className="grid min-h-screen place-items-center bg-[#0A0A0F] px-6 text-center text-white">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-300">XETHKIOZ // PORTAL COMUNITARIO</p>
        <h1 className="mt-3 text-3xl font-black">Abriendo Huellas de Puan…</h1>
        <p className="mt-3 text-slate-300">Mascotas perdidas, animales encontrados, adopciones, castraciones y cuidados responsables.</p>
        <a className="mt-6 inline-block rounded-xl bg-emerald-600 px-5 py-3 font-black" href={MASCOTAS_URL}>Entrar a Huellas de Puan</a>
      </div>
    </main>
  )
}

export default function FunPortal() {
  const location = useLocation()
  const isNexusAccess = location.hash === '#nexus-city' || new URLSearchParams(location.search).get('mode') === 'play'

  if (isNexusAccess) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-[#0A0A0F]" />}>
        <NexusCity />
      </Suspense>
    )
  }

  return <MascotasRedirect />
}

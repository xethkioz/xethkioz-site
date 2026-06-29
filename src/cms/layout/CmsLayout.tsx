import { Outlet } from 'react-router-dom'
import CmsHeader from './CmsHeader'
import CmsSidebar from './CmsSidebar'

export default function CmsLayout() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(147,51,234,0.22),transparent_32%),linear-gradient(135deg,#020617,#070312_54%,#160617)] text-white">
      <div className="lg:flex">
        <CmsSidebar />
        <section className="min-h-screen flex-1">
          <CmsHeader />
          <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </section>
      </div>
    </div>
  )
}

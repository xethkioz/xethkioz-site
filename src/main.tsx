import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import RouteCssLoader, { loadRouteStyles } from './components/RouteCssLoader'
import './index.css'
import './visibility-fixes.css'
import './generated/xethkioz-core.css'
import './experience.css'

try {
  document.documentElement.dataset.xkGraphics = window.localStorage.getItem('xethkioz.experience.graphics.v1') === 'lite' ? 'lite' : 'full'
} catch {
  document.documentElement.dataset.xkGraphics = 'full'
}

const rootElement = document.getElementById('root')

function renderBootError(message: string) {
  const main = document.createElement('main')
  main.style.cssText = 'min-height:100vh;background:#0A0A0F;color:white;font-family:Inter,system-ui,sans-serif;display:grid;place-items:center;padding:24px;'

  const section = document.createElement('section')
  section.style.cssText = 'max-width:760px;border:1px solid rgba(255,106,0,.35);background:rgba(15,15,22,.82);border-radius:24px;padding:28px;box-shadow:0 0 40px rgba(255,106,0,.16);'

  const eyebrow = document.createElement('p')
  eyebrow.style.cssText = 'color:#FF6A00;font-size:12px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;'
  eyebrow.textContent = 'XETHKIOZ Safe Boot'

  const title = document.createElement('h1')
  title.style.cssText = 'margin:12px 0 8px;font-size:28px;line-height:1.1;'
  title.textContent = 'La aplicación no pudo iniciar'

  const description = document.createElement('p')
  description.style.cssText = 'color:#cbd5e1;line-height:1.6;'
  description.textContent = 'Se activó el modo seguro para evitar una pantalla vacía. Revisá consola, variables de entorno y deploy.'

  const details = document.createElement('pre')
  details.style.cssText = 'white-space:pre-wrap;margin-top:18px;background:#050507;border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:14px;color:#ffb4b4;font-size:12px;'
  details.textContent = message

  section.append(eyebrow, title, description, details)
  main.append(section)
  document.body.replaceChildren(main)
}

window.addEventListener('error', (event) => {
  console.error('[XETHKIOZ] Runtime error:', event.error || event.message)
})

window.addEventListener('unhandledrejection', (event) => {
  console.error('[XETHKIOZ] Unhandled promise rejection:', event.reason)
})

async function boot() {
  if (!rootElement) throw new Error('No existe el elemento #root en index.html')

  await loadRouteStyles(window.location.pathname)

  createRoot(rootElement).render(
    <StrictMode>
      <HelmetProvider>
        <BrowserRouter>
          <RouteCssLoader />
          <App />
        </BrowserRouter>
      </HelmetProvider>
    </StrictMode>,
  )
}

void boot().catch((error) => {
  const message = error instanceof Error ? error.message : String(error)
  renderBootError(message)
})

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import './index.css'

const rootElement = document.getElementById('root')

function renderBootError(message: string) {
  document.body.innerHTML = `
    <main style="min-height:100vh;background:#0A0A0F;color:white;font-family:Inter,system-ui,sans-serif;display:grid;place-items:center;padding:24px;">
      <section style="max-width:760px;border:1px solid rgba(255,106,0,.35);background:rgba(15,15,22,.82);border-radius:24px;padding:28px;box-shadow:0 0 40px rgba(255,106,0,.16);">
        <p style="color:#FF6A00;font-size:12px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;">XETHKIOZ Safe Boot</p>
        <h1 style="margin:12px 0 8px;font-size:28px;line-height:1.1;">La aplicación no pudo iniciar</h1>
        <p style="color:#cbd5e1;line-height:1.6;">Se activó el modo seguro para evitar una pantalla vacía. Revisá consola, variables de entorno y deploy.</p>
        <pre style="white-space:pre-wrap;margin-top:18px;background:#050507;border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:14px;color:#ffb4b4;font-size:12px;">${message}</pre>
      </section>
    </main>`
}

window.addEventListener('error', (event) => {
  console.error('[XETHKIOZ] Runtime error:', event.error || event.message)
})

window.addEventListener('unhandledrejection', (event) => {
  console.error('[XETHKIOZ] Unhandled promise rejection:', event.reason)
})

try {
  if (!rootElement) throw new Error('No existe el elemento #root en index.html')
  createRoot(rootElement).render(
    <StrictMode>
      <HelmetProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </HelmetProvider>
    </StrictMode>,
  )
} catch (error) {
  const message = error instanceof Error ? error.message : String(error)
  renderBootError(message)
}

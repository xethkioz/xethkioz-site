import { Component, ErrorInfo, ReactNode } from 'react'

type Props = {
  children: ReactNode
  label?: string
  compact?: boolean
}

type State = {
  hasError: boolean
  message: string
}

export default class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' }

  static getDerivedStateFromError(error: unknown): State {
    const message = error instanceof Error ? error.message : 'Error desconocido de renderizado.'
    return { hasError: true, message }
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    if (typeof console !== 'undefined') {
      console.error(`[XETHKIOZ] Error boundary: ${this.props.label || 'app'}`, error, info.componentStack)
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children

    if (this.props.compact) return null

    return (
      <section className="mx-auto my-10 max-w-3xl rounded-2xl border border-red-500/30 bg-red-950/20 p-6 text-left shadow-[0_0_30px_rgba(239,68,68,0.12)]">
        <p className="section-eyebrow text-red-300">XETHKIOZ SAFE MODE</p>
        <h2 className="font-display text-2xl font-black text-white">Se protegió esta sección</h2>
        <p className="mt-3 text-sm leading-relaxed text-gray-300">
          Un módulo falló durante el renderizado y fue aislado para que el resto de la web siga funcionando.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-xl border border-white/10 bg-black/40 p-3 text-xs text-red-200">
          {this.props.label || 'module'}: {this.state.message}
        </pre>
      </section>
    )
  }
}

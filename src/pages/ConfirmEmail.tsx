import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { isSupabaseConfigured, supabase } from '../services/supabaseClient'

function getRedirectUrl() {
  if (typeof window === 'undefined') return undefined
  return `${window.location.origin}/account?mode=signin`
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  return 'No se pudo reenviar el correo. Probá de nuevo en unos minutos.'
}

export default function ConfirmEmail() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const emailReady = /\S+@\S+\.\S+/.test(email)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage(null)
    setError(null)

    if (!isSupabaseConfigured) {
      setError('Supabase no está configurado en producción.')
      return
    }

    if (!emailReady) {
      setError('Ingresá un email válido.')
      return
    }

    setLoading(true)
    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim(),
        options: {
          emailRedirectTo: getRedirectUrl(),
        },
      })

      if (resendError) throw resendError
      setMessage('Pedido enviado. Si la cuenta existe y todavía no fue confirmada, Supabase reenviará el correo de activación. Revisá spam/promociones.')
    } catch (caughtError) {
      setError(getErrorMessage(caughtError))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEO title="Confirmar cuenta · XETHKIOZ" description="Reenviar correo de confirmación para cuenta XETHKIOZ." url="/confirm-email" />
      <main className="min-h-screen bg-fusionBg px-4 py-28 text-gray-200 sm:px-6">
        <section className="mx-auto max-w-xl rounded-3xl border border-orange/30 bg-black/45 p-6 shadow-2xl shadow-orange-950/20 md:p-8">
          <p className="font-mono text-xs font-black uppercase tracking-[0.28em] text-orange">XETHKIOZ_ACCOUNT_RECOVERY</p>
          <h1 className="mt-4 text-3xl font-black uppercase tracking-wider text-white md:text-4xl">Reenviar confirmación</h1>
          <p className="mt-4 text-sm leading-6 text-gray-400">Usá esta pantalla si creaste la cuenta pero nunca llegó el correo de activación.</p>

          <form onSubmit={submit} className="mt-6 grid gap-4">
            <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.16em] text-gray-400">
              Email de la cuenta
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none transition focus:border-orange" placeholder="tu@email.com" required />
            </label>

            {error ? <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</p> : null}
            {message ? <p className="rounded-xl border border-green-400/30 bg-green-400/10 p-3 text-sm text-green-200">{message}</p> : null}

            <button disabled={!emailReady || loading} type="submit" className="rounded-full bg-orange px-5 py-3 text-sm font-black uppercase tracking-[0.2em] text-black transition hover:shadow-glow-action disabled:cursor-not-allowed disabled:opacity-40">{loading ? 'Enviando...' : 'Reenviar correo'}</button>
          </form>

          <div className="mt-6 flex flex-wrap gap-3 font-mono text-xs uppercase tracking-[0.18em]">
            <Link to="/account?mode=signin" className="rounded-full border border-neon/40 px-4 py-2 text-neon transition hover:bg-neon/10">Ingresar</Link>
            <Link to="/account?mode=reset" className="rounded-full border border-orange/40 px-4 py-2 text-orange transition hover:bg-orange/10">Recuperar contraseña</Link>
          </div>
        </section>
      </main>
    </>
  )
}

import { useMemo, useState } from 'react'

type UrlSignal = {
  level: 'ok' | 'info' | 'warn'
  title: string
  detail: string
}

type UrlResult = {
  href: string
  protocol: string
  hostname: string
  port: string
  pathname: string
  signals: UrlSignal[]
}

type RecoveryStep = {
  id: string
  title: string
  detail: string
}

const MAX_HASH_BYTES = 100 * 1024 * 1024

const RECOVERY_STEPS: RecoveryStep[] = [
  {
    id: 'clean-device',
    title: 'Aislá el dispositivo si ejecutaste algo sospechoso',
    detail: 'Si hubo descarga, comando extraño o control remoto inesperado, cortá la conexión y analizá el equipo antes de volver a usarlo para cambiar credenciales.',
  },
  {
    id: 'email-first',
    title: 'Protegé primero tu correo principal',
    detail: 'El email suele permitir recuperar otras cuentas. Cambiá la clave desde un dispositivo confiable y revisá métodos de recuperación, reenvíos y reglas que no reconozcas.',
  },
  {
    id: 'sessions',
    title: 'Cerrá sesiones y dispositivos que no reconozcas',
    detail: 'Usá la página oficial de seguridad de cada servicio. No sigas enlaces de mensajes que afirman que ya hubo un acceso extraño.',
  },
  {
    id: 'mfa',
    title: 'Activá o renová el segundo factor',
    detail: 'Preferí passkeys o un autenticador cuando el servicio los ofrezca. Guardá códigos de recuperación en un lugar separado y seguro.',
  },
  {
    id: 'payments',
    title: 'Revisá pagos, compras y cambios sensibles',
    detail: 'Si aparecen operaciones que no hiciste, contactá al banco o proveedor desde sus canales oficiales y conservá evidencia del incidente.',
  },
  {
    id: 'reuse',
    title: 'Buscá otras cuentas con la misma contraseña',
    detail: 'Si reutilizabas esa clave, cambiala en los demás servicios. No hagas variaciones mínimas de una contraseña que ya quedó expuesta.',
  },
]

function inspectUrl(rawValue: string): UrlResult {
  const trimmed = rawValue.trim()
  if (!trimmed) throw new Error('Pegá una dirección para analizarla.')
  const candidate = /^[a-z][a-z0-9+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`
  const url = new URL(candidate)
  const hostname = url.hostname.toLowerCase()
  const labels = hostname.split('.').filter(Boolean)
  const isIpv4 = /^(?:\d{1,3}\.){3}\d{1,3}$/.test(hostname)
  const isIpv6 = hostname.includes(':')
  const signals: UrlSignal[] = []

  if (url.protocol === 'https:') {
    signals.push({ level: 'ok', title: 'HTTPS presente', detail: 'La conexión puede cifrarse en tránsito. Esto no demuestra que el sitio sea legítimo.' })
  } else if (url.protocol === 'http:') {
    signals.push({ level: 'warn', title: 'HTTP sin cifrado', detail: 'Evitá ingresar contraseñas, códigos o datos de pago en una conexión HTTP.' })
  } else {
    signals.push({ level: 'warn', title: `Protocolo ${url.protocol}`, detail: 'No es una URL web HTTPS convencional. Verificá por qué necesitás abrirla.' })
  }

  if (url.username || url.password) {
    signals.push({ level: 'warn', title: 'Credenciales dentro de la URL', detail: 'Una dirección con usuario o contraseña embebidos puede ocultar visualmente el destino real.' })
  }
  if (hostname.includes('xn--')) {
    signals.push({ level: 'info', title: 'Dominio con Punycode', detail: 'Puede ser totalmente legítimo, pero conviene confirmar el nombre internacionalizado antes de continuar.' })
  }
  if (isIpv4 || isIpv6) {
    signals.push({ level: 'info', title: 'Destino expresado como IP', detail: 'Muchos servicios legítimos usan dominios. Si esperabas una marca conocida, verificá el canal oficial.' })
  }
  if (labels.length >= 5) {
    signals.push({ level: 'info', title: 'Cadena larga de subdominios', detail: 'Leé el hostname de derecha a izquierda y confirmá cuál es el dominio que realmente controla el sitio.' })
  }
  if (url.port && !['80', '443'].includes(url.port)) {
    signals.push({ level: 'info', title: `Puerto explícito ${url.port}`, detail: 'No implica peligro por sí solo. Confirmá que ese puerto sea esperado para el servicio.' })
  }
  if (signals.length === 1 && signals[0].level === 'ok') {
    signals.push({ level: 'info', title: 'Sin señales técnicas obvias', detail: 'Esto no es un veredicto de seguridad. Confirmá dominio, contexto, remitente y propósito antes de ingresar datos.' })
  }

  return {
    href: url.href,
    protocol: url.protocol.replace(':', '').toUpperCase(),
    hostname,
    port: url.port || 'predeterminado',
    pathname: `${url.pathname}${url.search}${url.hash}` || '/',
    signals,
  }
}

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export default function InternetSOS() {
  const [urlValue, setUrlValue] = useState('')
  const [urlResult, setUrlResult] = useState<UrlResult | null>(null)
  const [urlError, setUrlError] = useState('')
  const [hashValue, setHashValue] = useState('')
  const [expectedHash, setExpectedHash] = useState('')
  const [hashStatus, setHashStatus] = useState('')
  const [hashing, setHashing] = useState(false)
  const [recoveryDone, setRecoveryDone] = useState<string[]>([])

  const normalizedExpected = useMemo(() => expectedHash.trim().toLowerCase().replace(/^sha256:/, '').replace(/\s+/g, ''), [expectedHash])
  const hashesMatch = hashValue && /^[a-f0-9]{64}$/.test(normalizedExpected) ? hashValue === normalizedExpected : null
  const recoveryPercent = Math.round((recoveryDone.length / RECOVERY_STEPS.length) * 100)

  const toggleRecovery = (id: string) => {
    setRecoveryDone((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  }

  const submitUrl = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setUrlError('')
    try {
      setUrlResult(inspectUrl(urlValue))
    } catch {
      setUrlResult(null)
      setUrlError('No pude interpretar esa dirección. Probá con una URL completa, por ejemplo https://ejemplo.com/ruta.')
    }
  }

  const hashFile = async (file: File | null) => {
    setHashValue('')
    setHashStatus('')
    if (!file) return
    if (file.size > MAX_HASH_BYTES) {
      setHashStatus('Para proteger memoria y rendimiento, esta versión local acepta archivos de hasta 100 MB.')
      return
    }
    if (!globalThis.crypto?.subtle) {
      setHashStatus('Este navegador no expone Web Crypto en el contexto actual.')
      return
    }

    setHashing(true)
    try {
      const digest = await crypto.subtle.digest('SHA-256', await file.arrayBuffer())
      setHashValue(toHex(digest))
      setHashStatus(`SHA-256 calculado localmente para “${file.name}”. El archivo no fue enviado a XETHKIOZ.`)
    } catch {
      setHashStatus('No pude calcular el hash en este dispositivo.')
    } finally {
      setHashing(false)
    }
  }

  return (
    <section className="xk-sos" aria-labelledby="internet-sos-title">
      <div className="xk-sos-head">
        <p>GREEN NODE // PROTECT</p>
        <h2 id="internet-sos-title">Internet SOS</h2>
        <span>Herramientas y protocolos de diagnóstico local. No abrimos la URL que pegás, no subimos el archivo que seleccionás y no pedimos credenciales.</span>
      </div>

      <div className="xk-sos-grid">
        <article className="xk-sos-tool">
          <div className="xk-sos-tool-title"><span aria-hidden="true">URL</span><div><strong>Inspector de enlaces</strong><small>Analiza estructura, no reputación.</small></div></div>
          <form onSubmit={submitUrl}>
            <label htmlFor="green-url-input">Dirección para revisar</label>
            <div className="xk-sos-input-row">
              <input id="green-url-input" type="text" inputMode="url" autoComplete="off" spellCheck={false} value={urlValue} onChange={(event) => setUrlValue(event.target.value)} placeholder="https://sitio.ejemplo/ruta" />
              <button type="submit">ANALIZAR</button>
            </div>
          </form>
          {urlError ? <p className="xk-sos-error" role="alert">{urlError}</p> : null}
          {urlResult ? <div className="xk-sos-result" aria-live="polite">
            <dl>
              <div><dt>Protocolo</dt><dd>{urlResult.protocol}</dd></div>
              <div><dt>Hostname</dt><dd>{urlResult.hostname}</dd></div>
              <div><dt>Puerto</dt><dd>{urlResult.port}</dd></div>
              <div><dt>Ruta</dt><dd>{urlResult.pathname}</dd></div>
            </dl>
            <div className="xk-sos-signals">
              {urlResult.signals.map((signal, index) => <div key={`${signal.title}-${index}`} data-level={signal.level}><strong>{signal.title}</strong><span>{signal.detail}</span></div>)}
            </div>
            <p className="xk-sos-note">El inspector no consulta listas negras ni contacta el destino. Una URL sin alertas sigue necesitando contexto y verificación humana.</p>
          </div> : null}
        </article>

        <article className="xk-sos-tool">
          <div className="xk-sos-tool-title"><span aria-hidden="true">256</span><div><strong>Verificador SHA-256</strong><small>Compara integridad sin subir el archivo.</small></div></div>
          <label className="xk-sos-file">
            <span>{hashing ? 'CALCULANDO…' : 'SELECCIONAR ARCHIVO'}</span>
            <input type="file" disabled={hashing} onChange={(event) => void hashFile(event.target.files?.[0] ?? null)} />
          </label>
          <label htmlFor="expected-sha">SHA-256 oficial opcional</label>
          <input id="expected-sha" className="xk-sos-hash-input" type="text" autoComplete="off" spellCheck={false} value={expectedHash} onChange={(event) => setExpectedHash(event.target.value)} placeholder="64 caracteres hexadecimales" />
          {hashStatus ? <p className="xk-sos-note" aria-live="polite">{hashStatus}</p> : null}
          {hashValue ? <div className="xk-sos-hash-output"><small>SHA-256 LOCAL</small><code>{hashValue}</code><button type="button" onClick={() => void navigator.clipboard?.writeText(hashValue)}>COPIAR</button></div> : null}
          {hashesMatch !== null ? <p className={`xk-sos-match ${hashesMatch ? 'is-match' : 'is-different'}`}>{hashesMatch ? 'COINCIDE con el SHA-256 de referencia.' : 'NO COINCIDE con el SHA-256 de referencia.'}</p> : null}
          <p className="xk-sos-note">Una coincidencia confirma bytes idénticos al hash de referencia. No demuestra por sí sola que el archivo sea benigno ni que la fuente del hash sea auténtica.</p>
        </article>

        <article className="xk-sos-tool xk-sos-tool-wide">
          <div className="xk-sos-tool-title"><span aria-hidden="true">SOS</span><div><strong>Me comprometieron una cuenta</strong><small>Protocolo local de recuperación, sin recopilar datos.</small></div></div>
          <div className="xk-sos-progress" aria-label={`Progreso de recuperación ${recoveryPercent}%`}>
            <div><span>PROTOCOLO DE RECUPERACIÓN</span><strong>{recoveryDone.length}/{RECOVERY_STEPS.length}</strong></div>
            <span><i style={{ width: `${recoveryPercent}%` }} /></span>
          </div>
          <div className="xk-sos-recovery">
            {RECOVERY_STEPS.map((step) => {
              const checked = recoveryDone.includes(step.id)
              return <label key={step.id} className={checked ? 'is-done' : ''}>
                <input type="checkbox" checked={checked} onChange={() => toggleRecovery(step.id)} />
                <span><strong>{step.title}</strong><small>{step.detail}</small></span>
              </label>
            })}
          </div>
          <div className="xk-sos-captcha-alert">
            <strong>ALERTA // CAPTCHA FALSO</strong>
            <span>Una verificación web legítima no necesita que abras “Ejecutar” con Win + R ni que pegues comandos con Ctrl + V. Si una página te pide eso, cerrala y tratá el equipo como potencialmente comprometido si ya ejecutaste las instrucciones.</span>
          </div>
          <p className="xk-sos-note">El checklist no se guarda en una cuenta ni se envía al servidor. Es una ayuda de orden y no reemplaza el soporte oficial del servicio, de tu banco o de un profesional ante un incidente grave.</p>
        </article>
      </div>
    </section>
  )
}

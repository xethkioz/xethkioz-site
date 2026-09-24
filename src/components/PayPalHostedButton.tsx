import { useEffect } from 'react'

const PAYPAL_SDK_ID = 'xethkioz-paypal-hosted-sdk'
const PAYPAL_CONTAINER_ID = 'paypal-container-AGU622NTG2BZ8'
const PAYPAL_BUTTON_ID = 'AGU622NTG2BZ8'
const PAYPAL_SDK_SRC = 'https://www.paypal.com/sdk/js?client-id=BAASNwuK244mEQZk71K1mrmWakdkS0cZMTN9ThC78Ctcvv2Izw9Fr7SuMzJ1HhZZeZN4F7dBXSrE1pOWw4&components=hosted-buttons&disable-funding=venmo&currency=USD'

declare global {
  interface Window {
    paypal?: {
      HostedButtons: (options: { hostedButtonId: string }) => {
        render: (selector: string) => Promise<void> | void
      }
    }
  }
}

type Props = {
  fallbackHref: string
  fallbackLabel: string
  ariaLabel: string
}

export default function PayPalHostedButton({ fallbackHref, fallbackLabel, ariaLabel }: Props) {
  useEffect(() => {
    let active = true
    const selector = `#${PAYPAL_CONTAINER_ID}`
    const render = () => {
      if (!active || !window.paypal?.HostedButtons) return
      const container = document.getElementById(PAYPAL_CONTAINER_ID)
      if (!container || container.dataset.paypalRendered === 'true') return
      container.innerHTML = ''
      container.dataset.paypalRendered = 'true'
      try {
        const result = window.paypal.HostedButtons({ hostedButtonId: PAYPAL_BUTTON_ID }).render(selector)
        void Promise.resolve(result).catch(() => { container.dataset.paypalRendered = 'false' })
      } catch {
        container.dataset.paypalRendered = 'false'
      }
    }

    const existing = document.getElementById(PAYPAL_SDK_ID) as HTMLScriptElement | null
    const onLoad = () => render()
    if (window.paypal?.HostedButtons) render()
    else if (existing) existing.addEventListener('load', onLoad, { once: true })
    else {
      const script = document.createElement('script')
      script.id = PAYPAL_SDK_ID
      script.src = PAYPAL_SDK_SRC
      script.async = true
      script.crossOrigin = 'anonymous'
      script.addEventListener('load', onLoad, { once: true })
      document.head.appendChild(script)
    }

    return () => {
      active = false
      existing?.removeEventListener('load', onLoad)
    }
  }, [])

  return (
    <div className="xks-paypal-block">
      <div id={PAYPAL_CONTAINER_ID} className="xks-paypal-hosted" data-hosted-button-id={PAYPAL_BUTTON_ID} role="group" aria-label={ariaLabel} />
      <a className="xks-paypal-fallback" href={fallbackHref} target="_blank" rel="noopener noreferrer">{fallbackLabel} ↗</a>
    </div>
  )
}

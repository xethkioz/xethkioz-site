(() => {
  const PETS_IMAGE = '/assets/huellas-portal-pets.svg?v=20260804-1'

  const applyImage = () => {
    const portals = document.querySelectorAll('.xk-rb-portal')
    for (const portal of portals) {
      const label = (portal.getAttribute('aria-label') || '').toLowerCase()
      if (!label.includes('huellas de puan') && !label.includes('help a pet')) continue

      const image = portal.querySelector('.xk-rb-window img')
      if (!image) continue
      if (!image.src.includes('huellas-portal-pets')) image.src = PETS_IMAGE
      image.style.objectFit = 'cover'
      image.style.objectPosition = '50% 50%'
      image.style.opacity = '1'
      image.style.visibility = 'visible'
    }
  }

  const observer = new MutationObserver(applyImage)
  observer.observe(document.documentElement, { childList: true, subtree: true })

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyImage, { once: true })
  } else {
    applyImage()
  }

  window.addEventListener('load', applyImage, { once: true })
})()

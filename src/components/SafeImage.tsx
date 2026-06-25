import { SyntheticEvent } from 'react'

type SafeImageProps = {
  src?: string | null
  alt: string
  className?: string
  fallback?: string
  loading?: 'lazy' | 'eager'
}

export const IMAGE_FALLBACK = '/images/articles/fallback.svg'

export function articleFallback(portal?: string | null, categorySlug?: string | null) {
  const key = (portal || categorySlug || '').toLowerCase()
  if (key.includes('gaming') || key.includes('game') || key.includes('esport')) return '/images/articles/gaming.svg'
  if (key.includes('tech') || key.includes('ai') || key.includes('hardware')) return '/images/articles/tech.svg'
  if (key.includes('science') || key.includes('space') || key.includes('medicine')) return '/images/articles/science.svg'
  if (key.includes('stream')) return '/images/articles/obs-streaming.svg'
  if (key.includes('comunidad') || key.includes('community') || key.includes('chat')) return '/images/articles/community-chat.svg'
  return IMAGE_FALLBACK
}

export function cleanImageUrl(src?: string | null, fallback = IMAGE_FALLBACK) {
  if (!src) return fallback
  const blockedDemoImages = [
    'pexels-photo-2379004',
    'photos/2379004',
  ]
  if (blockedDemoImages.some((needle) => src.includes(needle))) return fallback
  // Demo Pexels images are kept out of the public news cards until each article has a real source image.
  if (src.includes('images.pexels.com')) return fallback
  return src
}

export default function SafeImage({ src, alt, className = '', fallback = IMAGE_FALLBACK, loading = 'lazy' }: SafeImageProps) {
  const safeSrc = cleanImageUrl(src, fallback)

  const handleError = (event: SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget
    if (img.src.endsWith(fallback)) return
    img.src = fallback
  }

  return (
    <img
      src={safeSrc}
      alt={alt}
      className={className}
      loading={loading}
      onError={handleError}
    />
  )
}

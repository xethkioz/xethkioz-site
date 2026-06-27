import React, { useMemo, useState } from 'react'
import { cyberAnimations } from '../../design'

export type AvatarPoseId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20

interface AvatarRendererProps {
  currentPose?: AvatarPoseId
  glitchActive?: boolean
  label?: string
  spriteUrl?: string
}

const DEFAULT_SPRITE_URL = '/assets/fusion-shared/xethkioz_avatar_sheet.png'

function getSpriteCoordinates(pose: AvatarPoseId) {
  const columns = 5
  const rows = 4
  const index = pose - 1
  const column = index % columns
  const row = Math.floor(index / columns)

  return {
    x: column * (100 / (columns - 1)),
    y: row * (100 / (rows - 1)),
  }
}

export const AvatarRenderer: React.FC<AvatarRendererProps> = ({
  currentPose = 1,
  glitchActive = false,
  label = 'XETHKIOZ avatar renderer',
  spriteUrl = DEFAULT_SPRITE_URL,
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const coords = useMemo(() => getSpriteCoordinates(currentPose), [currentPose])

  return (
    <figure
      className="group relative flex h-48 w-48 items-center justify-center overflow-hidden rounded-lg border border-fusionSurface-muted bg-fusionBg"
      aria-label={`${label} · pose ${currentPose}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <figcaption className="absolute right-2 top-2 z-10 font-mono text-[9px] uppercase tracking-[0.22em] text-fusionAccent-tech-primary/70">
        POSE_{currentPose.toString().padStart(2, '0')}
      </figcaption>

      <div
        className={`h-40 w-40 ${cyberAnimations.avatar.transition} ${isHovered ? 'scale-105' : 'scale-100'} ${glitchActive ? 'animate-pulse opacity-70' : 'opacity-100'}`}
        style={{
          backgroundImage: `url('${spriteUrl}')`,
          backgroundSize: '500% 400%',
          backgroundPosition: `${coords.x}% ${coords.y}%`,
          backgroundRepeat: 'no-repeat',
        }}
        aria-hidden="true"
      />

      <div className="pointer-events-none absolute inset-0 border border-transparent transition-colors group-hover:border-fusionAccent-tech-primary/30" />
      <div className="pointer-events-none absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-fusionAccent-tech-primary/40 to-transparent" />
    </figure>
  )
}

export default AvatarRenderer

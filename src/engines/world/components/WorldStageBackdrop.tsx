import type { ReactNode } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { worldMotionVariants } from './worldMotionVariants'

export interface WorldStageBackdropProps extends Omit<HTMLMotionProps<'section'>, 'children'> {
  children: ReactNode
  labelId?: string
  showGrid?: boolean
  showScanline?: boolean
  className?: string
}

/**
 * Cinematic shell for the World scene.
 * Keeps the visual background isolated from WorldHeroStage logic.
 */
export function WorldStageBackdrop({
  children,
  labelId = 'world-gate-title',
  showGrid = true,
  showScanline = true,
  className = '',
  ...motionProps
}: WorldStageBackdropProps) {
  return (
    <motion.section
      variants={worldMotionVariants.stage}
      initial="initial"
      animate="enter"
      exit="exit"
      className={`panel-cyber relative z-10 flex flex-col items-center gap-8 overflow-hidden border border-fusionSurface-muted bg-gradient-to-b from-fusionSurface via-fusionBg to-fusionBg p-6 md:p-8 ${className}`}
      aria-labelledby={labelId}
      {...motionProps}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_6%,rgba(138,46,255,0.24),transparent_34%),radial-gradient(circle_at_85%_78%,rgba(255,122,0,0.13),transparent_32%)]" />
      <div className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-fusionAccent-gaming/70 to-transparent" />

      {showGrid && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(138,46,255,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,122,0,.12)_1px,transparent_1px)] [background-size:44px_44px]"
          animate={{ y: [0, 44] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        />
      )}

      {showScanline && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/5 via-fusionAccent-gaming/10 to-transparent blur-sm"
          animate={{ y: ['-20%', '120%'], opacity: [0, 0.55, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      <div className="absolute left-4 top-3 font-mono text-[9px] uppercase tracking-[0.28em] text-gray-600">
        WORLD_ENGINE // VISUAL_EXPERIENCE_ENGINE
      </div>

      {children}
    </motion.section>
  )
}

export default WorldStageBackdrop

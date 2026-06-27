import { motion, type HTMLMotionProps } from 'framer-motion'
import { worldMotionVariants, type WispMotionState } from './worldMotionVariants'

export interface WorldWispMotionProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  state?: WispMotionState
  label?: string
  size?: 'sm' | 'md' | 'lg'
  showTrail?: boolean
  className?: string
}

const sizeClasses: Record<NonNullable<WorldWispMotionProps['size']>, string> = {
  sm: 'h-12 w-12',
  md: 'h-20 w-20',
  lg: 'h-28 w-28',
}

/**
 * Independent Wisp motion unit.
 * This component owns only visuals: levitation, pulse, glow and trail.
 */
export function WorldWispMotion({
  state = 'idle',
  label = 'Wisp visual entity',
  size = 'md',
  showTrail = true,
  className = '',
  ...motionProps
}: WorldWispMotionProps) {
  return (
    <motion.div
      className={`pointer-events-none relative flex items-center justify-center ${sizeClasses[size]} ${className}`}
      aria-label={label}
      role="img"
      {...motionProps}
    >
      {showTrail && (
        <motion.span
          aria-hidden="true"
          variants={worldMotionVariants.lightTrail}
          initial="initial"
          animate="enter"
          className="absolute h-1 w-28 origin-left rounded-full bg-gradient-to-r from-transparent via-fusionAccent-gaming/70 to-transparent blur-sm"
        />
      )}

      <motion.span
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-fusionAccent-gaming/25 blur-2xl"
        animate={{ scale: [0.82, 1.22, 0.82], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.span
        variants={worldMotionVariants.wispCore}
        animate={state}
        className="relative h-1/2 w-1/2 rounded-full bg-gradient-to-br from-white via-fusionAccent-textPrimary to-fusionAccent-gaming shadow-[0_0_32px_rgba(138,46,255,.75)]"
      />

      <motion.span
        aria-hidden="true"
        className="absolute h-3/4 w-3/4 rounded-full border border-fusionAccent-fun/40"
        animate={{ rotate: 360, scale: [1, 1.08, 1] }}
        transition={{ rotate: { duration: 7, repeat: Infinity, ease: 'linear' }, scale: { duration: 2.4, repeat: Infinity } }}
      />
    </motion.div>
  )
}

export default WorldWispMotion

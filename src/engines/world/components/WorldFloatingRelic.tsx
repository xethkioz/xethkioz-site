import type { ReactNode } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { worldMotionVariants } from './worldMotionVariants'

export interface WorldFloatingRelicProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode
  label?: string
  delay?: number
  interactive?: boolean
  className?: string
}

/**
 * Floating artifact wrapper for relics, items, badges or scene objects.
 * It provides AAA-style hover, levitation and glow without knowing item logic.
 */
export function WorldFloatingRelic({
  children,
  label = 'Floating world relic',
  delay = 0,
  interactive = true,
  className = '',
  ...motionProps
}: WorldFloatingRelicProps) {
  return (
    <motion.div
      variants={worldMotionVariants.relic}
      initial="initial"
      animate="enter"
      exit="exit"
      whileHover={interactive ? 'hover' : undefined}
      whileTap={interactive ? 'tap' : undefined}
      custom={delay}
      className={`relative inline-flex select-none items-center justify-center rounded-2xl border border-fusionSurface-muted bg-fusionBg/70 p-3 text-fusionAccent-textPrimary backdrop-blur-md [transform-style:preserve-3d] ${interactive ? 'cursor-pointer' : ''} ${className}`}
      aria-label={label}
      role={interactive ? 'button' : 'img'}
      tabIndex={interactive ? 0 : -1}
      transition={{ delay }}
      {...motionProps}
    >
      <motion.span
        aria-hidden="true"
        className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-fusionAccent-gaming/20 via-transparent to-fusionAccent-fun/20 blur-xl"
        animate={{ opacity: [0.28, 0.72, 0.28], scale: [0.96, 1.08, 0.96] }}
        transition={{ duration: 3.1, repeat: Infinity, ease: 'easeInOut', delay }}
      />
      {children}
    </motion.div>
  )
}

export default WorldFloatingRelic

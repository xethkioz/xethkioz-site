import React, { useMemo, useState } from 'react'
import { motion, type HTMLMotionProps, type Variants } from 'framer-motion'

export type InteractionTone = 'gaming' | 'fun' | 'science' | 'green' | 'secret'

export interface AnimatedItemProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: React.ReactNode
  tone?: InteractionTone
  particles?: boolean
  glow?: boolean
  disabled?: boolean
  className?: string
  onActivated?: () => void
}

interface ParticleSpec {
  id: string
  x: number
  y: number
  scale: number
  delay: number
}

const toneClasses: Record<InteractionTone, { glow: string; particle: string; border: string }> = {
  gaming: {
    glow: 'bg-fusionAccent-gaming/20',
    particle: 'bg-fusionAccent-gaming',
    border: 'hover:border-fusionAccent-gaming/50',
  },
  fun: {
    glow: 'bg-fusionAccent-fun/20',
    particle: 'bg-fusionAccent-fun',
    border: 'hover:border-fusionAccent-fun/50',
  },
  science: {
    glow: 'bg-fusionAccent-science/20',
    particle: 'bg-fusionAccent-science',
    border: 'hover:border-fusionAccent-science/50',
  },
  green: {
    glow: 'bg-fusionAccent-greenNode/20',
    particle: 'bg-fusionAccent-greenNode',
    border: 'hover:border-fusionAccent-greenNode/50',
  },
  secret: {
    glow: 'bg-fusionAccent-secret/20',
    particle: 'bg-fusionAccent-secret',
    border: 'hover:border-fusionAccent-secret/50',
  },
}

export const hoverEffect = {
  whileHover: {
    scale: 1.05,
    rotateX: 2,
    rotateY: -3,
    transition: { duration: 0.28, ease: 'easeOut' },
  },
  whileTap: {
    scale: 0.96,
    rotateX: 0,
    rotateY: 0,
  },
} as const

export const cinematicContainer: Variants = {
  initial: { opacity: 0, y: 12, filter: 'blur(8px)' },
  enter: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -8,
    filter: 'blur(8px)',
    transition: { duration: 0.2, ease: 'easeIn' },
  },
}

export const wispPulse: Variants = {
  idle: {
    scale: [1, 1.03, 1],
    opacity: [0.76, 1, 0.76],
    transition: { repeat: Infinity, duration: 3.2, ease: 'easeInOut' },
  },
  watching: {
    scale: [1, 1.08, 1],
    opacity: [0.85, 1, 0.85],
    transition: { repeat: Infinity, duration: 2.1, ease: 'easeInOut' },
  },
  greenMode: {
    scale: [1.05, 1.22, 1.05],
    opacity: [0.9, 1, 0.9],
    rotate: [0, 4, -4, 0],
    transition: { repeat: Infinity, duration: 1.35, ease: 'easeInOut' },
  },
}

function createParticles(count = 12): ParticleSpec[] {
  return Array.from({ length: count }, (_, index) => {
    const angle = (Math.PI * 2 * index) / count
    const radius = 34 + (index % 4) * 8

    return {
      id: `particle-${index}`,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      scale: 0.7 + (index % 3) * 0.22,
      delay: index * 0.018,
    }
  })
}

export const AnimatedItem: React.FC<AnimatedItemProps> = ({
  children,
  tone = 'green',
  particles = true,
  glow = true,
  disabled = false,
  className = '',
  onActivated,
  onClick,
  ...motionProps
}) => {
  const [burstKey, setBurstKey] = useState(0)
  const particlesSpec = useMemo(() => createParticles(14), [])
  const toneClass = toneClasses[tone]

  const handleClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
    if (disabled) return
    setBurstKey((value) => value + 1)
    onActivated?.()
    onClick?.(event)
  }

  return (
    <motion.div
      {...hoverEffect}
      {...motionProps}
      onClick={handleClick}
      className={`relative inline-flex cursor-pointer select-none items-center justify-center rounded-xl border border-transparent outline-none transition-colors duration-300 [transform-style:preserve-3d] ${toneClass.border} ${disabled ? 'pointer-events-none cursor-not-allowed opacity-50' : ''} ${className}`}
      tabIndex={disabled ? -1 : 0}
      role="button"
      aria-disabled={disabled}
    >
      {glow && (
        <motion.div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 -z-10 rounded-full blur-2xl ${toneClass.glow}`}
          animate={{ opacity: [0.22, 0.58, 0.22], scale: [0.92, 1.08, 0.92] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
        />
      )}

      {children}

      {particles && !disabled && (
        <span key={burstKey} className="pointer-events-none absolute inset-1/2 h-0 w-0" aria-hidden="true">
          {particlesSpec.map((particle) => (
            <motion.span
              key={`${particle.id}-${burstKey}`}
              className={`absolute h-1.5 w-1.5 rounded-full ${toneClass.particle}`}
              initial={{ x: 0, y: 0, opacity: 0.9, scale: 0 }}
              animate={{ x: particle.x, y: particle.y, opacity: 0, scale: particle.scale }}
              transition={{ duration: 0.58, delay: particle.delay, ease: 'easeOut' }}
            />
          ))}
        </span>
      )}
    </motion.div>
  )
}

export default AnimatedItem

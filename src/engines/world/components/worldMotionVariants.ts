import type { Transition, Variants } from 'framer-motion'

/**
 * Alpha 3.0 — Visual Experience Engine motion foundation.
 *
 * This file is the single shared contract for World visual components.
 * It intentionally keeps compatibility with the current framer-motion package
 * while remaining easy to migrate to `motion/react` later.
 */
export type WorldPortalTheme = 'gaming' | 'scienceLab' | 'greenNode'

export const worldMotionTimings = {
  instant: 0.16,
  fast: 0.24,
  normal: 0.48,
  cinematic: 0.72,
  ambient: 7.5,
  slowAmbient: 14,
} as const

export const worldMotionEasing = {
  cinematic: [0.16, 1, 0.3, 1],
  smoothOut: [0.22, 1, 0.36, 1],
  softInOut: [0.45, 0, 0.55, 1],
} as const

export const worldTransitions = {
  global: {
    duration: worldMotionTimings.normal,
    ease: worldMotionEasing.cinematic,
  } satisfies Transition,

  default: {
    type: 'spring',
    stiffness: 180,
    damping: 22,
    mass: 0.9,
  } satisfies Transition,

  spring: {
    type: 'spring',
    stiffness: 160,
    damping: 24,
    mass: 0.9,
  } satisfies Transition,

  hoverSpring: {
    type: 'spring',
    stiffness: 260,
    damping: 20,
    mass: 0.75,
  } satisfies Transition,

  smooth: {
    duration: 0.45,
    ease: worldMotionEasing.smoothOut,
  } satisfies Transition,

  ambientLoop: {
    duration: worldMotionTimings.slowAmbient,
    repeat: Infinity,
    repeatType: 'mirror',
    ease: 'easeInOut',
  } satisfies Transition,
}

/** Backward-compatible alias for older Sprint A/B components. */
export const worldMotionTransition = worldTransitions

export const worldThemeVfx: Record<
  WorldPortalTheme,
  {
    label: string
    primaryGlow: string
    secondaryGlow: string
    actionGlow: string
    gridGlow: string
    fogGlow: string
  }
> = {
  gaming: {
    label: 'Gaming',
    primaryGlow: 'rgba(139,92,246,0.28)',
    secondaryGlow: 'rgba(255,122,0,0.13)',
    actionGlow: 'rgba(249,115,22,0.24)',
    gridGlow: 'rgba(139,92,246,0.16)',
    fogGlow: 'rgba(139,92,246,0.14)',
  },
  scienceLab: {
    label: 'Science Lab',
    primaryGlow: 'rgba(34,211,238,0.22)',
    secondaryGlow: 'rgba(139,92,246,0.16)',
    actionGlow: 'rgba(249,115,22,0.16)',
    gridGlow: 'rgba(34,211,238,0.13)',
    fogGlow: 'rgba(34,211,238,0.12)',
  },
  greenNode: {
    label: 'Green Node',
    primaryGlow: 'rgba(34,197,94,0.22)',
    secondaryGlow: 'rgba(139,92,246,0.12)',
    actionGlow: 'rgba(249,115,22,0.14)',
    gridGlow: 'rgba(34,197,94,0.14)',
    fogGlow: 'rgba(34,197,94,0.12)',
  },
}

export const worldMotionVariants = {
  fade: {
    initial: { opacity: 0 },
    enter: { opacity: 1, transition: worldTransitions.smooth },
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: worldTransitions.smooth },
    exit: { opacity: 0, transition: worldTransitions.smooth },
  } satisfies Variants,

  stage: {
    initial: { opacity: 0, y: 28, scale: 0.985, filter: 'blur(14px)' },
    enter: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: worldMotionTimings.cinematic,
        ease: worldMotionEasing.cinematic,
        when: 'beforeChildren',
        staggerChildren: 0.08,
      },
    },
    exit: {
      opacity: 0,
      y: -18,
      scale: 0.99,
      filter: 'blur(10px)',
      transition: { duration: 0.28, ease: 'easeIn' },
    },
  } satisfies Variants,

  backdropBase: {
    initial: { opacity: 0 },
    enter: {
      opacity: 1,
      transition: { duration: worldMotionTimings.cinematic, ease: worldMotionEasing.smoothOut },
    },
    exit: { opacity: 0, transition: { duration: worldMotionTimings.fast, ease: 'easeIn' } },
  } satisfies Variants,

  backdropGradient: {
    initial: { opacity: 0, scale: 1.04, x: 0, y: 0 },
    enter: {
      opacity: [0.42, 0.72, 0.48],
      scale: [1.04, 1.09, 1.04],
      x: [0, 18, -10, 0],
      y: [0, -14, 10, 0],
      transition: { duration: 16, repeat: Infinity, ease: 'easeInOut' },
    },
    exit: { opacity: 0, transition: { duration: worldMotionTimings.fast } },
  } satisfies Variants,

  softFog: {
    initial: { opacity: 0, x: -24, scale: 1.06 },
    enter: {
      opacity: [0.16, 0.28, 0.18],
      x: [-24, 32, -10],
      scale: [1.06, 1.12, 1.08],
      transition: { duration: 18, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' },
    },
    exit: { opacity: 0, transition: { duration: worldMotionTimings.fast } },
  } satisfies Variants,

  gridDrift: {
    initial: { opacity: 0, y: 0 },
    enter: {
      opacity: 0.2,
      y: [0, 44],
      transition: {
        opacity: { duration: worldMotionTimings.normal },
        y: { duration: 12, repeat: Infinity, ease: 'linear' },
      },
    },
    exit: { opacity: 0, transition: { duration: worldMotionTimings.fast } },
  } satisfies Variants,

  scanline: {
    initial: { opacity: 0, y: '-20%' },
    enter: {
      opacity: [0, 0.42, 0],
      y: ['-20%', '118%'],
      transition: { duration: 5.8, repeat: Infinity, ease: 'easeInOut' },
    },
    exit: { opacity: 0, transition: { duration: worldMotionTimings.instant } },
  } satisfies Variants,

  ambientOrb: {
    initial: { opacity: 0, scale: 0.92 },
    enter: {
      opacity: [0.28, 0.58, 0.32],
      scale: [0.92, 1.08, 0.96],
      transition: { duration: 10, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' },
    },
    exit: { opacity: 0, transition: { duration: worldMotionTimings.fast } },
  } satisfies Variants,

  cinematicItem: {
    initial: { opacity: 0, y: 16, scale: 0.96, filter: 'blur(8px)' },
    enter: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: { duration: 0.5, ease: worldMotionEasing.smoothOut },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.98,
      filter: 'blur(8px)',
      transition: { duration: 0.2, ease: 'easeIn' },
    },
  } satisfies Variants,

  floating: {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: [0, -6, 0],
      transition: { ...worldTransitions.default, repeat: Infinity, repeatType: 'mirror' },
    },
  } satisfies Variants,

  wispCore: {
    idle: {
      y: [0, -12, 0],
      scale: [1, 1.06, 1],
      opacity: [0.82, 1, 0.82],
      rotate: [0, 1.5, -1.5, 0],
      transition: { duration: 3.4, repeat: Infinity, ease: 'easeInOut' },
    },
    focus: {
      y: [0, -8, 0],
      scale: [1.04, 1.14, 1.04],
      opacity: [0.9, 1, 0.9],
      rotate: [0, 4, -4, 0],
      transition: { duration: 1.9, repeat: Infinity, ease: 'easeInOut' },
    },
    surge: {
      y: [0, -18, 0],
      scale: [1.08, 1.24, 1.08],
      opacity: [0.95, 1, 0.95],
      rotate: [0, 8, -8, 0],
      transition: { duration: 1.15, repeat: Infinity, ease: 'easeInOut' },
    },
  } satisfies Variants,

  relic: {
    initial: { opacity: 0, y: 20, scale: 0.82, rotateZ: -4, filter: 'drop-shadow(0 0 0 rgba(139,92,246,0))' },
    enter: {
      opacity: 1,
      y: [0, -10, 0],
      scale: 1,
      rotateZ: [-1.2, 1.2, -1.2],
      filter: [
        'drop-shadow(0 0 10px rgba(139,92,246,.4))',
        'drop-shadow(0 0 24px rgba(249,115,22,.55))',
        'drop-shadow(0 0 10px rgba(139,92,246,.4))',
      ],
      transition: {
        opacity: { duration: 0.34, ease: 'easeOut' },
        scale: { duration: 0.34, ease: 'easeOut' },
        y: { duration: 4.6, repeat: Infinity, ease: 'easeInOut' },
        rotateZ: { duration: 5.2, repeat: Infinity, ease: 'easeInOut' },
        filter: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' },
      },
    },
    hidden: { opacity: 0, scale: 0.94, y: 18 },
    visible: { opacity: 1, scale: 1, y: 0, transition: worldTransitions.default },
    hover: {
      scale: 1.08,
      y: -14,
      rotateZ: 0,
      filter: 'drop-shadow(0 0 32px rgba(249,115,22,.75))',
      transition: worldTransitions.hoverSpring,
    },
    tap: { scale: 0.97, transition: { duration: 0.12, ease: 'easeOut' } },
    exit: {
      opacity: 0,
      y: -12,
      scale: 0.94,
      filter: 'drop-shadow(0 0 0 rgba(139,92,246,0))',
      transition: worldTransitions.smooth,
    },
  } satisfies Variants,

  lightTrail: {
    initial: { opacity: 0, scaleX: 0, x: -32 },
    enter: {
      opacity: [0, 0.75, 0],
      scaleX: [0, 1, 0],
      x: [-32, 32, 72],
      transition: { duration: 2.6, repeat: Infinity, repeatDelay: 0.9, ease: 'easeInOut' },
    },
    exit: { opacity: 0, transition: { duration: 0.15 } },
  } satisfies Variants,

  interactiveHover: {
    rest: { scale: 1, rotateX: 0, rotateY: 0 },
    hover: { scale: 1.045, rotateX: 2, rotateY: -3, transition: worldTransitions.hoverSpring },
    tap: { scale: 0.97, rotateX: 0, rotateY: 0, transition: { duration: 0.12, ease: 'easeOut' } },
  } satisfies Variants,
} as const

export type WorldMotionVariantKey = keyof typeof worldMotionVariants
export type WispMotionState = keyof typeof worldMotionVariants.wispCore
